# 多阶段构建
FROM node:22-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
COPY yarn.lock* ./

# 安装依赖
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; else npm ci; fi

# 复制源代码
COPY . .

# 构建应用
RUN if [ -f yarn.lock ]; then yarn build; else npm run build; fi

# 生产镜像
FROM nginx:1.29.1-alpine

# 安装必要工具
RUN apk add --no-cache gettext curl

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制配置文件
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh

# 创建配置目录并设置权限
RUN mkdir -p /usr/share/nginx/html/config && \
    chmod +x /docker-entrypoint.sh && \
    chown -R nginx:nginx /usr/share/nginx/html

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# 暴露端口
EXPOSE 80

# 入口点
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
