# 随机抽选系统

一个基于 React + TypeScript 开发的随机抽选系统，包含多个实用的随机选择功能。

## 功能特点

### 1. 随机古诗词
- 随机抽取古诗词全文
- 支持仅显示上句功能
- 展示诗词作者信息
- 优雅的展示动画

### 2. 随机点名系统
- 添加/删除学生名单
- 随机抽取学生
- 支持重置选择状态
- 动态展示选中效果
- 保存已选择记录

### 3. 今天吃什么
- 按分类筛选食物
- 支持多个美食分类
  - 中餐
  - 快餐
  - 面食
- 随机推荐功能
- 展示所有可选项

### 4. 知识点抽查
- 多学科支持
  - 语文
  - 数学
- 按科目和单元筛选
- 随机抽取知识点
- 3D翻转动画效果

## 技术栈

- React 18
- TypeScript
- React Router v6
- Vite
- CSS Modules

## 开始使用

1. 克隆项目
\`\`\`bash
git clone [项目地址]
\`\`\`

2. 安装依赖
\`\`\`bash
npm install
\`\`\`

3. 启动开发服务器
\`\`\`bash
npm run dev
\`\`\`

4. 构建生产版本
\`\`\`bash
npm run build
\`\`\`

## 项目结构

\`\`\`
src/
  ├── pages/          # 页面组件
  │   ├── Home.tsx    # 首页
  │   ├── Poetry.tsx  # 古诗词
  │   ├── RollCall.tsx# 点名系统
  │   ├── Food.tsx    # 美食推荐
  │   └── Knowledge.tsx# 知识点抽查
  ├── styles/         # 样式文件
  ├── App.tsx         # 应用入口
  └── main.tsx        # 主入口文件
\`\`\`

## 开发说明

- 使用 React Router 进行路由管理
- 采用 CSS Modules 进行样式隔离
- 支持响应式布局设计
- 实现平滑的过渡动画效果

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