#!/usr/bin/env zsh

: '
XXL-JOB Panel R3 Docker 构建和发布脚本
Enhanced Version with More Features

Docker Build Related Files:
.dockerignore
Dockerfile
docker-build.sh
docker-entrypoint.sh
nginx.conf.template
'

# 检查并安装 sptn 命令
source ~/.zshrc
if command -v sptn >/dev/null 2>&1; then
  echo "检测到 sptn 命令，正在执行..."
  sptn
else
  echo "未检测到 sptn 命令，跳过执行"
fi

# --- 配置信息 ---
IMAGE_NAME="xxl-job-panel-r3"
DOCKER_USERNAME="julxxy"
DEFAULT_VERSION="1.0.3"
BUILDER_NAME="multiarch-builder"
DOCKERFILE_PATH="./Dockerfile"
SUPPORTED_PLATFORMS="linux/amd64,linux/arm64"

# --- 彩色输出 ---
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m'

# --- 日志函数 ---
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_step() { echo -e "${PURPLE}🔄 $1${NC}"; }

# --- 帮助信息 ---
show_help() {
  echo -e "${CYAN}XXL-JOB Panel R3 Docker 构建脚本${NC}"
  echo ""
  echo -e "${YELLOW}用法:${NC}"
  echo "  $0 [选项] [版本号]"
  echo ""
  echo -e "${YELLOW}选项:${NC}"
  echo "  -h, --help           显示此帮助信息"
  echo "  -v, --version VER    指定版本号 (默认: $DEFAULT_VERSION)"
  echo "  -p, --platforms PLAT 指定构建平台 (默认: $SUPPORTED_PLATFORMS)"
  echo "  -n, --no-push        只构建不推送到 Docker Hub"
  echo "  -f, --force          强制重新创建构建器"
  echo "  -c, --clean          构建完成后清理构建器"
  echo "  -t, --test           本地测试模式（不推送，构建测试镜像）"
  echo "  --dry-run            显示将要执行的命令但不实际执行"
  echo ""
  echo -e "${YELLOW}示例:${NC}"
  echo "  $0                   # 使用默认版本构建并推送"
  echo "  $0 -v 1.0.4          # 构建版本 1.0.4"
  echo "  $0 -t                # 本地测试模式"
  echo "  $0 -n -v 1.0.4       # 只构建版本 1.0.4，不推送"
  echo "  $0 --dry-run         # 预览要执行的命令"
}

# --- 错误处理 ---
set -e
trap 'log_error "脚本执行失败，请检查错误信息"; exit 1' ERR

# --- 参数解析 ---
VERSION="$DEFAULT_VERSION"
PLATFORMS="$SUPPORTED_PLATFORMS"
PUSH_ENABLED=true
FORCE_RECREATE=false
CLEAN_AFTER=false
TEST_MODE=false
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case $1 in
  -h | --help)
    show_help
    exit 0
    ;;
  -v | --version)
    VERSION="$2"
    shift 2
    ;;
  -p | --platforms)
    PLATFORMS="$2"
    shift 2
    ;;
  -n | --no-push)
    PUSH_ENABLED=false
    shift
    ;;
  -f | --force)
    FORCE_RECREATE=true
    shift
    ;;
  -c | --clean)
    CLEAN_AFTER=true
    shift
    ;;
  -t | --test)
    TEST_MODE=true
    PUSH_ENABLED=false
    VERSION="test"
    shift
    ;;
  --dry-run)
    DRY_RUN=true
    shift
    ;;
  -*)
    log_error "未知选项: $1"
    show_help
    exit 1
    ;;
  *)
    VERSION="$1"
    shift
    ;;
  esac
done

# --- Dry Run 模式 ---
if [ "$DRY_RUN" = true ]; then
  echo -e "${CYAN}🔍 预览模式 - 将要执行的操作:${NC}"
  echo -e "  镜像名: ${DOCKER_USERNAME}/${IMAGE_NAME}"
  echo -e "  版本: ${VERSION}"
  echo -e "  平台: ${PLATFORMS}"
  echo -e "  推送: $([ "$PUSH_ENABLED" = true ] && echo "是" || echo "否")"
  echo -e "  测试模式: $([ "$TEST_MODE" = true ] && echo "是" || echo "否")"
  echo ""
  echo -e "${YELLOW}构建命令:${NC}"
  echo "docker buildx build \\"
  echo "  --platform ${PLATFORMS} \\"
  echo "  --tag ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} \\"
  if [ "$VERSION" != "test" ] && [ "$PUSH_ENABLED" = true ]; then
    echo "  --tag ${DOCKER_USERNAME}/${IMAGE_NAME}:latest \\"
  fi
  echo "  --file ${DOCKERFILE_PATH} \\"
  if [ "$PUSH_ENABLED" = true ]; then
    echo "  --push \\"
  else
    echo "  --load \\"
  fi
  echo "  ."
  exit 0
fi

# --- 显示配置 ---
echo -e "${BLUE}🚀 XXL-JOB Panel R3 Docker 构建脚本${NC}"
echo -e "${BLUE}   镜像: ${DOCKER_USERNAME}/${IMAGE_NAME}${NC}"
echo -e "${BLUE}   版本: ${VERSION}${NC}"
echo -e "${BLUE}   平台: ${PLATFORMS}${NC}"
echo -e "${BLUE}   推送: $([ "$PUSH_ENABLED" = true ] && echo "启用" || echo "禁用")${NC}"
echo -e "${BLUE}   测试模式: $([ "$TEST_MODE" = true ] && echo "启用" || echo "禁用")${NC}"
echo ""

# [1] 检查前置条件
log_step "步骤 1/7: 检查Docker环境..."
if ! docker info &>/dev/null; then
  log_error "Docker未启动或不可用，请先启动 Docker Desktop！"
  exit 1
fi

if ! docker buildx version &>/dev/null; then
  log_error "Docker buildx 不可用，请确认Docker版本支持buildx功能！"
  exit 1
fi

if [[ ! -f "$DOCKERFILE_PATH" ]]; then
  log_error "Dockerfile不存在: $DOCKERFILE_PATH"
  exit 1
fi

log_success "Docker环境检查通过"

# [2] 清理旧容器
log_step "步骤 2/7: 清理旧容器..."
CONTAINER_NAME="xxl-job-panel-r3"
if docker ps -a --format '{{.Names}}' | grep -wq "$CONTAINER_NAME"; then
  log_info "发现旧容器: $CONTAINER_NAME，正在清理..."
  docker stop "$CONTAINER_NAME" 2>/dev/null || true
  docker rm -f "$CONTAINER_NAME" 2>/dev/null || true
  log_success "旧容器清理完成"
else
  log_info "没有发现需要清理的旧容器"
fi

# [3] Docker Hub 登录检查（仅在需要推送时）
if [ "$PUSH_ENABLED" = true ]; then
  log_step "步骤 3/7: 检查Docker Hub登录状态..."

  # 检查是否已登录
  if ! docker system info --format '{{.RegistryConfig.IndexConfigs}}' 2>/dev/null | grep -q "$DOCKER_USERNAME"; then
    log_warn "未检测到登录状态，准备登录 Docker Hub..."
    echo -e "${YELLOW}💡 建议使用 Personal Access Token 作为密码${NC}"
    echo -e "${YELLOW}   创建Token: https://hub.docker.com/settings/security${NC}"

    if ! docker login -u "$DOCKER_USERNAME"; then
      log_error "Docker Hub 登录失败！"
      exit 1
    fi
    log_success "Docker Hub 登录成功"
  else
    log_success "已登录 Docker Hub"
  fi
else
  log_step "步骤 3/7: 跳过登录检查（未启用推送）"
fi

# [4] 设置多架构构建器
log_step "步骤 4/7: 配置多架构构建器..."

# 强制重新创建构建器
if [ "$FORCE_RECREATE" = true ]; then
  log_info "强制重新创建构建器..."
  docker buildx rm "$BUILDER_NAME" 2>/dev/null || true
fi

if docker buildx ls | grep -q "$BUILDER_NAME"; then
  log_info "使用现有构建器: $BUILDER_NAME"
  docker buildx use "$BUILDER_NAME"
else
  log_info "创建新的构建器: $BUILDER_NAME"
  docker buildx create --name "$BUILDER_NAME" --driver docker-container --use --bootstrap
fi

# 验证构建器平台支持
log_info "验证构建器平台支持..."
if ! docker buildx inspect --bootstrap | grep -E "(linux/amd64|linux/arm64)" &>/dev/null; then
  log_error "构建器不支持所需平台 (${PLATFORMS})"
  exit 1
fi
log_success "构建器平台支持验证通过"

# [5] 构建镜像
log_step "步骤 5/7: 构建$([ "$PUSH_ENABLED" = true ] && echo "并推送" || echo "")镜像..."
echo -e "${BLUE}构建参数:${NC}"
echo -e "  平台: ${PLATFORMS}"
echo -e "  主标签: ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
if [ "$VERSION" != "test" ] && [ "$PUSH_ENABLED" = true ]; then
  echo -e "  latest标签: ${DOCKER_USERNAME}/${IMAGE_NAME}:latest"
fi
echo -e "  Dockerfile: ${DOCKERFILE_PATH}"
echo -e "  推送到Hub: $([ "$PUSH_ENABLED" = true ] && echo "是" || echo "否")"
echo ""

# 构建命令
BUILD_ARGS=(
  "--platform"
  "$PLATFORMS"
  "--tag"
  "${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
  "--file"
  "$DOCKERFILE_PATH"
  "--progress"
  "plain"
)

# 添加 latest 标签（非测试模式且需要推送时）
if [ "$VERSION" != "test" ] && [ "$PUSH_ENABLED" = true ]; then
  BUILD_ARGS+=("--tag" "${DOCKER_USERNAME}/${IMAGE_NAME}:latest")
fi

# 选择推送或本地加载
if [ "$PUSH_ENABLED" = true ]; then
  BUILD_ARGS+=("--push")
else
  BUILD_ARGS+=("--load")
fi

BUILD_ARGS+=(".")

# 执行构建
docker buildx build "${BUILD_ARGS[@]}"

if [ $? -eq 0 ]; then
  log_success "镜像构建$([ "$PUSH_ENABLED" = true ] && echo "并推送" || echo "")完成！"
else
  log_error "镜像构建失败"
  exit 1
fi

# [6] 验证结果
log_step "步骤 6/7: 验证构建结果..."
if [ "$PUSH_ENABLED" = true ]; then
  echo -e "${GREEN}🎉 成功推送的镜像:${NC}"
  echo -e "   📦 ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
  if [ "$VERSION" != "test" ]; then
    echo -e "   📦 ${DOCKER_USERNAME}/${IMAGE_NAME}:latest"
  fi
  echo -e "   🏗️  支持架构: ${PLATFORMS}"
else
  echo -e "${GREEN}🎉 成功构建的本地镜像:${NC}"
  echo -e "   📦 ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
  echo -e "   🏗️  支持架构: ${PLATFORMS}"
fi

# [7] 清理和提示
log_step "步骤 7/7: 完成和清理..."

# 自动清理构建器
if [ "$CLEAN_AFTER" = true ]; then
  log_info "清理构建器: $BUILDER_NAME"
  docker buildx rm "$BUILDER_NAME" 2>/dev/null || true
  log_success "构建器清理完成"
fi

# 显示后续操作提示
echo ""
log_success "脚本执行完成！"

if [ "$CLEAN_AFTER" = false ]; then
  echo -e "${YELLOW}💡 清理构建器: docker buildx rm $BUILDER_NAME${NC}"
fi

if [ "$PUSH_ENABLED" = true ]; then
  echo -e "${YELLOW}💡 查看镜像详情: docker buildx imagetools inspect ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}${NC}"
fi

# [8] 显示使用示例
echo ""
echo -e "${GREEN}📋 镜像使用示例:${NC}"
echo -e "${BLUE}# 基本运行${NC}"
echo -e "docker run -d --name xxl-job-panel-r3 -p 80:80 ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
echo ""
echo -e "${BLUE}# 带代理运行${NC}"
echo -e "docker run -d --name xxl-job-panel-r3 -p 80:80 \\"
echo -e "  -e PROXY_TARGET=http://your-xxl-job-server:8080 \\"
echo -e "  -e API_PROXY_PATH=/xxl-job-admin \\"
echo -e "  -e ENABLE_API_PROXY=true \\"
echo -e "  ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"

if [ "$TEST_MODE" = true ]; then
  echo ""
  echo -e "${BLUE}# 测试运行${NC}"
  echo -e "docker run -d --name xxl-job-panel-test -p 81:80 ${DOCKER_USERNAME}/${IMAGE_NAME}"
fi

