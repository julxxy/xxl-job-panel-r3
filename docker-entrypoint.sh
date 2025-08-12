#!/bin/sh

set -e

# 设置默认值
export NGINX_PORT="${NGINX_PORT:-80}"
export API_PROXY_PATH="${API_PROXY_PATH:-/api}"
export PROXY_TARGET="${PROXY_TARGET:-http://localhost:8080}"
export ENABLE_API_PROXY="${ENABLE_API_PROXY:-false}"

echo "=== XXL-JOB Panel Container Starting ==="
echo ""
echo "Environment Configuration:"
echo "  NGINX_PORT: $NGINX_PORT"
echo "  API_PROXY_PATH: $API_PROXY_PATH"
echo "  PROXY_TARGET: $PROXY_TARGET"
echo "  ENABLE_API_PROXY: $ENABLE_API_PROXY"

# 解析 PROXY_TARGET 来提取主机名和端口
# 移除协议前缀 (http:// 或 https://)
PROXY_TARGET_CLEAN=$(echo "$PROXY_TARGET" | sed 's|^https\?://||')

# 提取主机名和端口
if echo "$PROXY_TARGET_CLEAN" | grep -q ':'; then
  # 包含端口
  PROXY_HOST=$(echo "$PROXY_TARGET_CLEAN" | cut -d':' -f1)
  PROXY_PORT=$(echo "$PROXY_TARGET_CLEAN" | cut -d':' -f2 | cut -d'/' -f1)
else
  # 不包含端口，根据协议设置默认端口
  PROXY_HOST="$PROXY_TARGET_CLEAN"
  if echo "$PROXY_TARGET" | grep -q '^https://'; then
    PROXY_PORT="443"
  else
    PROXY_PORT="80"
  fi
fi

# 确保变量有值（提供默认值）
PROXY_HOST="${PROXY_HOST:-localhost}"
PROXY_PORT="${PROXY_PORT:-8080}"

# 导出变量供 envsubst 使用
export PROXY_HOST
export PROXY_PORT

echo "  PROXY_HOST: $PROXY_HOST"
echo "  PROXY_PORT: $PROXY_PORT"

# 生成环境变量配置文件
echo ""
echo "Generating runtime environment configuration..."
cat >/usr/share/nginx/html/config/env-config.js <<EOF
window.ENV_CONFIG = {
  VITE_APP_ENV: '${VITE_APP_ENV:-production}',
  VITE_IS_PROD: ${VITE_IS_PROD:-true},
  VITE_ENABLE_AUTH: '${VITE_ENABLE_AUTH:-on}',
  VITE_API_BASE_URL: '${VITE_API_BASE_URL:-/job}',
  API_PROXY_PATH: '${API_PROXY_PATH}',
  ENABLE_API_PROXY: ${ENABLE_API_PROXY}
};
EOF

# 生成 Nginx 配置
if [ -f /etc/nginx/nginx.conf.template ]; then
  echo ""
  echo "Generating nginx configuration..."
  echo "Variables to substitute:"
  echo "  NGINX_PORT=${NGINX_PORT}"
  echo "  PROXY_HOST=${PROXY_HOST}"
  echo "  PROXY_PORT=${PROXY_PORT}"
  echo "  API_PROXY_PATH=${API_PROXY_PATH}"

  # 使用 envsubst 只替换指定的变量
  envsubst '${NGINX_PORT},${API_PROXY_PATH},${PROXY_HOST},${PROXY_PORT}' \
    </etc/nginx/nginx.conf.template \
    >/etc/nginx/nginx.conf

  echo ""
  echo "Generated nginx.conf upstream section:"
  echo "--- START ---"
  grep -A 5 "upstream backend" /etc/nginx/nginx.conf || echo "No upstream section found"
  echo "--- END ---"
else
  echo "Warning: nginx.conf.template not found, using default config..."
  if [ -f /etc/nginx/nginx.conf.backup ]; then
    cp /etc/nginx/nginx.conf.backup /etc/nginx/nginx.conf
  fi
fi

# 测试 Nginx 配置
echo ""
echo "Validating nginx configuration..."
if nginx -t; then
  echo "✅ Nginx configuration validation passed"
else
  echo "❌ Nginx configuration validation failed!"
  echo ""
  echo "Generated config:"
  cat /etc/nginx/nginx.conf
  echo ""
  echo "Environment variables:"
  echo "  PROXY_TARGET: $PROXY_TARGET"
  echo "  PROXY_HOST: $PROXY_HOST"
  echo "  PROXY_PORT: $PROXY_PORT"
  echo "  API_PROXY_PATH: $API_PROXY_PATH"
  exit 1
fi

echo ""
echo "🚀 Starting Nginx..."
exec "$@"
