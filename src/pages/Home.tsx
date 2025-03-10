import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const features = [
  {
    title: '随机古诗词',
    description: '随机抽取古诗词全文或上下句',
    path: '/poetry'
  },
  {
    title: '随机点名',
    description: '课堂随机点名系统',
    path: '/roll-call'
  },
  {
    title: '今天吃什么',
    description: '随机推荐美食',
    path: '/food'
  },
  {
    title: '知识点抽查',
    description: '随机抽取知识点进行复习',
    path: '/knowledge'
  },
  {
    title: '自定义随机',
    description: '通过Excel自定义随机内容',
    path: '/custom-random'
  },
  {
    title: '抽奖系统',
    description: '支持多人同时抽取的抽奖工具',
    path: '/lottery'
  },
  {
    title: '抛硬币',
    description: '在犹豫不决时，让命运做选择',
    path: '/coin-flip'
  }
];

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">点兵点将</h1>
      <div className="features-grid">
        {features.map((feature, index) => (
          <Link to={feature.path} key={index} className="feature-card">
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home; 