# 随机抽选系统

基于 React + TypeScript 的随机抽选系统，支持纯静态部署，包含古诗词、点名、吃什么、知识点抽查、自定义随机、抽奖、抛硬币等功能。

## 在线演示

[在线体验地址](https://random.grep.pro)

## 功能特点

### 1. 随机古诗词
- 随机抽取古诗词全文，支持仅显示上句/下句
- 展示作者与标题，带过渡动画

### 2. 随机点名系统
- 手动添加/删除名单，Excel 导入/导出与模板下载
- 姓名点名 / 座位点名，自定义座位表，记录已抽、一键重置

### 3. 今天吃什么
- 按分类筛选（中餐、快餐、面食等），随机推荐

### 4. 知识点抽查
- 多学科（语文、数学等）按科目与单元筛选，随机抽题，3D 翻转展示

### 5. 自定义随机
- 通过 Excel 上传自定义内容，随机抽取

### 6. 抽奖系统
- 支持多人同时抽奖，可全屏展示

### 7. 抛硬币
- 随机正反面，适合做选择

### 访问统计
- 页脚展示「今日访问」与「总访问量」，**纯前端实现**：数据保存在浏览器 localStorage，无需后端，换设备或清空数据会重新计数。

## 技术栈

- React 18、TypeScript 5、React Router v6、Vite 5
- Ant Design 4、@ant-design/icons
- XLSX（Excel 处理）
- ESLint + TypeScript/React 规则

## 开始使用

### 纯静态部署（推荐）

站点为前端应用，访问统计使用 localStorage，**无需 Node 服务**，构建后可直接部署到任意静态托管。

```bash
# 安装依赖
npm install

# 开发
npm run dev
# 浏览器打开 Vite 提示的地址（如 http://localhost:5173）

# 构建
npm run build
```

将生成的 `dist/` 目录部署到 GitHub Pages、Netlify、Vercel 等即可。

### 使用 Node 服务部署（可选）

若需用 Node 提供静态资源与 SPA 回退（例如同一端口、内网部署），可先构建再启动服务：

```bash
npm install
npm run build
npm run build:server
NODE_ENV=production npm start
```

服务默认端口 3000，静态资源从 `dist/` 提供。

### Docker 部署（可选）

```bash
docker build -t random-website .
docker run -d -p 3000:3000 random-website
```

访问 http://localhost:3000。镜像内已执行前端与后端构建，生产环境由 Node 提供 `dist/` 静态资源。

## 脚本说明

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器（仅前端） |
| `npm run build` | 构建前端到 `dist/` |
| `npm run build:server` | 编译服务端 TypeScript 到 `dist-server/` |
| `npm start` | 生产环境启动 Node 服务（需先 build + build:server） |
| `npm run server` | 开发时直接运行服务端（tsx，端口 3000） |
| `npm run lint` | 运行 ESLint 检查 |

## 项目结构

```
├── src/
│   ├── pages/           # 页面（Home, Poetry, RollCall, Food, Knowledge, CustomRandom, Lottery, CoinFlipPage）
│   ├── components/      # 公共组件（如 VisitCounter）
│   ├── styles/          # 全局与页面样式
│   ├── App.tsx
│   └── main.tsx
├── server/              # 可选 Node 服务（提供静态与 SPA 回退）
├── data/                 # 可选运行时数据（若使用服务端统计）
├── public/               # 静态资源（开发时）
└── dist/                 # 构建输出（npm run build）
```

## 开发说明

- 使用 React Router 管理路由，页面懒加载
- TypeScript 严格模式，ESLint 统一规范
- 访问统计为纯前端 localStorage，不依赖后端

## 浏览器支持

Chrome、Firefox、Safari、Edge 等现代浏览器。

## 贡献

1. Fork 项目  
2. 创建特性分支  
3. 提交改动  
4. 发起 Pull Request  

## 许可证

[MIT License](LICENSE)
