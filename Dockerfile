# 构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

RUN npm install -g pnpm

# 设置构建参数
ARG DATABASE_URL

# 设置环境变量
ENV DATABASE_URL=$DATABASE_URL

# 安装必要的系统依赖
RUN apk add --no-cache openssl

COPY package.json pnpm-lock.yaml ./

# 配置 yarn 镜像源
RUN pnpm config set sharp_libvips_binary_host "https://npmmirror.com/mirrors/sharp-libvips" && \
    pnpm config set sharp_binary_host "https://npmmirror.com/mirrors/sharp" && \
    pnpm config set registry https://registry.npmmirror.com

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 生成 Prisma 客户端
RUN pnpm prisma generate

# 构建应用
RUN pnpm build

# 运行阶段
FROM node:20-alpine AS runner

WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# 安装必要的系统依赖
RUN apk add --no-cache openssl


# 复制必要的文件
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
# 舍弃全部预渲染页面
RUN find ./.next/server/app -type f -name '*.html' -delete

USER nextjs

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"] 