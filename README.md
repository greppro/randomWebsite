# 随机抽选系统

一个基于 React + TypeScript 开发的随机抽选系统，包含多个实用的随机选择功能。

## 在线演示

[在线体验地址](https://random.grep.pro)

## 功能特点

### 1. 随机古诗词
- 随机抽取古诗词全文
- 支持仅显示上句/下句功能
- 展示诗词作者和标题信息
- 优雅的展示动画
- 平滑的过渡效果

### 2. 随机点名系统
- 支持手动添加/删除学生名单
- Excel 导入/导出功能
  - 提供标准模板下载
  - 支持批量导入学生名单
- 双模式点名
  - 姓名点名：随机抽取学生姓名
  - 座位点名：随机抽取座位号
- 自定义座位表大小
- 记录已抽取状态
- 一键重置功能

### 3. 今天吃什么
- 按分类筛选食物
- 丰富的美食分类
  - 中餐
  - 快餐
  - 面食
- 随机推荐功能
- 展示所有可选项
- 分类展示和管理
- 动态切换分类

### 4. 知识点抽查
- 多学科支持
  - 语文：修辞、文言文、诗歌等
  - 数学：函数、概率统计等
- 按科目和单元筛选
- 随机抽取知识点
- 3D翻转动画效果
- 分类展示所有知识点

## 技术栈

- React 18
- TypeScript 5
- React Router v6
- Vite 5
- XLSX（Excel 处理）
- CSS Modules
- Docker

## 开始使用

### 方式一：本地开发

1. 克隆项目
```bash
git clone [项目地址]
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

### 方式二：Docker 部署

1. 构建镜像
```bash
docker build -t random-website .
```

2. 运行容器
```bash
docker run -d -p 80:80 random-website
```

3. 使用 Docker Compose（推荐）
```bash
docker-compose up -d
```

访问 http://localhost 即可使用

## 项目结构

```
src/
  ├── pages/          # 页面组件
  │   ├── Home.tsx    # 首页
  │   ├── Poetry.tsx  # 古诗词
  │   ├── RollCall.tsx# 点名系统
  │   ├── Food.tsx    # 美食推荐
  │   └── Knowledge.tsx# 知识点抽查
  ├── styles/         # 样式文件
  │   ├── index.css   # 全局样式
  │   ├── Poetry.css  # 古诗词样式
  │   └── Knowledge.css# 知识点样式
  ├── App.tsx         # 应用入口
  └── main.tsx        # 主入口文件
```

## 开发说明

- 使用 React Router 进行路由管理
- 采用 CSS Modules 进行样式隔离
- 支持响应式布局设计
- 实现平滑的过渡动画效果
- 使用 TypeScript 进行类型检查
- 代码分割和懒加载优化

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交改动
4. 发起 Pull Request

## 许可证

[MIT License](LICENSE) 