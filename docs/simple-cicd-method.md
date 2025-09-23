## 持续集成

持续集成已经由 github actions 完成，每次 push 到 main 分支时，会自动触发构建。 TODO: 需要自动构建时不应预先 SSG，应避免构建产物中包含数据。

## 一个简单的持续部署方式

在云服务器上部署步骤：在某个目录中创建 `.env` 、`docker-compose.yml` 、`deploy-cheer.sh` 3 个文件

1. 配置环境变量

参考项目中的 .env.example 创建 .env  主要需配置 DATABASE_URL


2. 复制项目中的 docker-compose.yml 


3. 创建并执行部署脚本 `/opt/deploy_scripts/deploy-cheer.sh`

以下脚本将拉取镜像,并在当镜像有更新时停止当前容器，重新创建容器

```shell
#!/bin/bash
set -euo pipefail

# 加载环境变量
if [ -f ".env" ]; then
  # 更安全的导出方式，处理带空格的值
  export $(grep -v '^#' .env | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | xargs)
else
  echo "Error: .env file not found!"
  exit 1
fi

# 确保日志目录存在且有写入权限
LOG_DIR=$(dirname "$LOG_FILE")
if [ ! -d "$LOG_DIR" ]; then
  sudo mkdir -p "$LOG_DIR"
  sudo chown $(whoami):$(whoami) "$LOG_DIR"
fi

# 定义日志函数
log() {
  local TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
  echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"
}

log "Starting deployment process for ${CONTAINER_NAME}"

# 检查docker-compose.yml是否存在
if [ ! -f "docker-compose.yml" ]; then
  log "Error: docker-compose.yml file not found!"
  exit 1
fi

# 拉取最新镜像
log "Pulling latest image: ${IMAGE_NAME}"
if docker pull "${IMAGE_NAME}" >> "$LOG_FILE" 2>&1; then
  log "Image pulled successfully"
  
  # 获取当前运行容器使用的镜像ID（如果容器存在）
  CURRENT_IMAGE_ID=$(docker inspect --format '{{.Image}}' "${CONTAINER_NAME}" 2>/dev/null || true)
  
  # 获取新拉取镜像的ID
  NEW_IMAGE_ID=$(docker inspect --format '{{.Id}}' "${IMAGE_NAME}" 2>/dev/null)
  
  log "Current image ID: ${CURRENT_IMAGE_ID:-(none)}"
  log "New image ID: ${NEW_IMAGE_ID:-(none)}"
  
  # 检查是否需要更新
  if [ -z "${CURRENT_IMAGE_ID}" ] || [ "${CURRENT_IMAGE_ID}" != "${NEW_IMAGE_ID}" ]; then
    log "New image detected, updating container..."
    
    # 停止并重新创建容器
    if docker compose down >> "$LOG_FILE" 2>&1; then
      log "Old container stopped and removed"
      
      if docker compose up -d >> "$LOG_FILE" 2>&1; then
        log "New container started successfully"
      else
        log "Failed to start new container"
        exit 1
      fi
    else
      log "Failed to stop old container"
      exit 1
    fi
  else
    log "No changes in image, no update needed"
  fi
else
  log "Failed to pull latest image"
  exit 1
fi

log "Deployment process completed"
```



4. 创建定时任务，定时执行部署脚本


`crontab -e` 编辑定时任务配置文件。添加以下行，以每隔5分钟定时执行 `/opt/deploy_scripts/deploy-cheer.sh` ，保存并退出编辑器后，定时任务将自动生效。`

```
*/5 * * * * /opt/deploy_scripts/deploy-cheer.sh >> /var/log/cheer-next-deploy.log 2>&1
```

`crontab -l` 查看正在运行的定时任务列表。`less /var/log/cron` 可以看 cron 日志。
