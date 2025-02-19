import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Poetry.css';

// 示例诗词数据
const poems = [
  {
    title: '静夜思',
    author: '李白',
    content: ['床前明月光，', '疑是地上霜。', '举头望明月，', '低头思故乡。']
  },
  {
    title: '春晓',
    author: '孟浩然',
    content: ['春眠不觉晓，', '处处闻啼鸟。', '夜来风雨声，', '花落知多少。']
  },
  // 可以添加更多诗词
];

const Poetry: React.FC = () => {
  const [currentPoem, setCurrentPoem] = useState<typeof poems[0] | null>(null);
  const [showFullPoem, setShowFullPoem] = useState(true);

  const getRandomPoem = () => {
    const randomIndex = Math.floor(Math.random() * poems.length);
    setCurrentPoem(poems[randomIndex]);
  };

  const togglePoemDisplay = () => {
    setShowFullPoem(!showFullPoem);
  };

  return (
    <div className="poetry-container">
      <Link to="/" className="back-button">返回首页</Link>
      <h1>随机古诗词</h1>
      
      <div className="controls">
        <button onClick={getRandomPoem}>随机抽取</button>
        <button onClick={togglePoemDisplay}>
          {showFullPoem ? '仅显示上句' : '显示全文'}
        </button>
      </div>

      {currentPoem && (
        <div className="poem-display">
          <h2>{currentPoem.title}</h2>
          <p className="author">{currentPoem.author}</p>
          <div className="poem-content">
            {showFullPoem
              ? currentPoem.content.map((line, index) => (
                  <p key={index}>{line}</p>
                ))
              : currentPoem.content
                  .filter((_, index) => index % 2 === 0)
                  .map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Poetry; 