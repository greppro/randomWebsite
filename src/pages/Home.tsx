import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOutlined,
  TeamOutlined,
  CoffeeOutlined,
  ReadOutlined,
  UnorderedListOutlined,
  GiftOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import '../styles/Home.css';

const features = [
  {
    title: '随机古诗词',
    description: '随机抽取古诗词全文或上下句',
    path: '/poetry',
    icon: BookOutlined,
    gridClass: 'bento-poetry',
    pastelClass: 'card-pastel-blue-gray',
    tags: [] as string[],
  },
  {
    title: '随机点名',
    description: '课堂随机点名系统',
    path: '/roll-call',
    icon: TeamOutlined,
    gridClass: 'bento-roll-call',
    pastelClass: 'card-pastel-green',
    tags: ['姓名点名', '座位点名', 'Excel导入'],
  },
  {
    title: '今天吃什么',
    description: '随机推荐美食',
    path: '/food',
    icon: CoffeeOutlined,
    gridClass: 'bento-food',
    pastelClass: 'card-pastel-peach',
    tags: [] as string[],
  },
  {
    title: '知识点抽查',
    description: '随机抽取知识点进行复习',
    path: '/knowledge',
    icon: ReadOutlined,
    gridClass: 'bento-knowledge',
    pastelClass: 'card-pastel-lavender',
    tags: [] as string[],
  },
  {
    title: '自定义随机',
    description: '通过Excel自定义随机内容',
    path: '/custom-random',
    icon: UnorderedListOutlined,
    gridClass: 'bento-custom-random',
    pastelClass: 'card-pastel-lavender',
    tags: [] as string[],
  },
  {
    title: '抽奖系统',
    description: '支持多人同时抽取的抽奖工具',
    path: '/lottery',
    icon: GiftOutlined,
    gridClass: 'bento-lottery',
    pastelClass: 'card-pastel-yellow',
    tags: [] as string[],
  },
  {
    title: '抛硬币',
    description: '在犹豫不决时，让命运做选择',
    path: '/coin-flip',
    icon: ThunderboltOutlined,
    gridClass: 'bento-coin-flip',
    pastelClass: 'card-pastel-pink',
    tags: [] as string[],
  },
];

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">点兵点将</h1>
      <div className="features-grid">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              to={feature.path}
              key={feature.path}
              className={`feature-card bento-card ${feature.gridClass} ${feature.pastelClass}`}
            >
              <span className="feature-card-icon">
                <Icon />
              </span>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
              {feature.tags.length > 0 && (
                <div className="feature-card-tags">
                  {feature.tags.map((tag) => (
                    <span key={tag} className="feature-card-tag">{tag}</span>
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Home; 