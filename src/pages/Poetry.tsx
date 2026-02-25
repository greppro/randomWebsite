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
  const [showMode, setShowMode] = useState<'full' | 'first' | 'second'>('full');
  const [isRolling, setIsRolling] = useState(false);
  const [rollInterval, setRollInterval] = useState<NodeJS.Timeout | null>(null);

  const startRolling = () => {
    setIsRolling(true);
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * poems.length);
      setCurrentPoem(poems[randomIndex]);
    }, 200);
    setRollInterval(interval);
  };

  const stopRolling = () => {
    if (rollInterval) {
      clearInterval(rollInterval);
      setRollInterval(null);
    }
    const finalIndex = Math.floor(Math.random() * poems.length);
    setCurrentPoem(poems[finalIndex]);
    setIsRolling(false);
  };

  const togglePoemDisplay = () => {
    setShowMode(current => {
      if (current === 'full') return 'first';
      if (current === 'first') return 'second';
      return 'full';
    });
  };

  const getDisplayContent = () => {
    if (!currentPoem) return [];
    switch (showMode) {
      case 'first':
        return currentPoem.content.filter((_, index) => index % 2 === 0);
      case 'second':
        return currentPoem.content.filter((_, index) => index % 2 === 1);
      default:
        return currentPoem.content;
    }
  };

  return (
    <div className="poetry-container">
      <div className="poetry-content">
        <Link to="/" className="back-button">返回首页</Link>
        <h1>随机古诗词</h1>
        
        <div className="bento-card poetry-controls-card">
          <div className="controls">
            <button 
              onClick={isRolling ? stopRolling : startRolling}
              className={isRolling ? 'rolling' : ''}
            >
              {isRolling ? '停止随机' : '开始随机'}
            </button>
            <button onClick={togglePoemDisplay}>
              {showMode === 'full' ? '仅显示上句' : 
               showMode === 'first' ? '仅显示下句' : '显示全文'}
            </button>
          </div>
        </div>

        {currentPoem && (
          <div className={`poem-display ${isRolling ? 'rolling' : ''}`}>
            <div className="bento-card poem-paper">
              <h2>{currentPoem.title}</h2>
              <p className="author">{currentPoem.author}</p>
              <div className="poem-content">
                {getDisplayContent().map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Poetry; 