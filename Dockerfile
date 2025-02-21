# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./
COPY tsconfig*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建前端应用
RUN npm run build

# 编译后端 TypeScript
RUN npm run build:server

# 生产阶段
FROM node:18-alpine

WORKDIR /app

# 创建必要的目录
RUN mkdir -p /app/data /app/public /app/server

# 复制构建产物和必要文件
COPY --from=builder /app/dist /app/public
COPY --from=builder /app/dist-server /app/server
COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/data/visitStats.json /app/data/

# 安装生产环境依赖
RUN npm ci --only=production

# 设置环境变量
ENV NODE_ENV=production

# 设置目录权限
RUN chown -R node:node /app && \
    chmod -R 755 /app && \
    chmod -R 777 /app/data

# 切换到非 root 用户
USER node

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["node", "./server/index.js"] 