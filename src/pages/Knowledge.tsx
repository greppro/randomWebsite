import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Knowledge.css';

interface Subject {
  name: string;
  chapters: Chapter[];
}

interface Chapter {
  title: string;
  points: string[];
}

const subjectsData: Subject[] = [
  {
    name: '语文',
    chapters: [
      {
        title: '第一单元',
        points: [
          '修辞手法：比喻、拟人、夸张',
          '文言文常见虚词',
          '诗歌意象分析',
          '作者生平及写作背景'
        ]
      },
      {
        title: '第二单元',
        points: [
          '标点符号的使用',
          '议论文写作技巧',
          '古诗词鉴赏方法',
          '文章主旨分析'
        ]
      }
    ]
  },
  {
    name: '数学',
    chapters: [
      {
        title: '函数与导数',
        points: [
          '函数的定义域和值域',
          '导数的几何意义',
          '函数的单调性',
          '函数的最值问题'
        ]
      },
      {
        title: '概率与统计',
        points: [
          '排列组合基础',
          '概率的基本公式',
          '随机变量的期望',
          '正态分布的应用'
        ]
      }
    ]
  }
];

const Knowledge: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('全部');
  const [selectedChapter, setSelectedChapter] = useState<string>('全部');
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const getAvailableChapters = () => {
    if (selectedSubject === '全部') {
      return subjectsData.flatMap(subject => subject.chapters);
    }
    return subjectsData.find(subject => subject.name === selectedSubject)?.chapters || [];
  };

  const getAvailablePoints = () => {
    const chapters = getAvailableChapters();
    if (selectedChapter === '全部') {
      return chapters.flatMap(chapter => chapter.points);
    }
    return chapters.find(chapter => chapter.title === selectedChapter)?.points || [];
  };

  const startRandomSelection = () => {
    const points = getAvailablePoints();
    if (points.length === 0) return;

    setIsRolling(true);
    const rollInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * points.length);
      setSelectedPoint(points[randomIndex]);
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      const finalIndex = Math.floor(Math.random() * points.length);
      setSelectedPoint(points[finalIndex]);
      setIsRolling(false);
    }, 2000);
  };

  return (
    <div className="knowledge-container">
      <Link to="/" className="back-button">返回首页</Link>
      <h1>知识点抽查</h1>

      <div className="filter-section">
        <select
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setSelectedChapter('全部');
          }}
        >
          <option value="全部">所有科目</option>
          {subjectsData.map(subject => (
            <option key={subject.name} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </select>

        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
        >
          <option value="全部">所有单元</option>
          {getAvailableChapters().map(chapter => (
            <option key={chapter.title} value={chapter.title}>
              {chapter.title}
            </option>
          ))}
        </select>
      </div>

      <div className="control-section">
        <button
          onClick={startRandomSelection}
          disabled={isRolling || getAvailablePoints().length === 0}
        >
          开始抽查
        </button>
      </div>

      <div className="result-section">
        {selectedPoint && (
          <div className={`selected-point ${isRolling ? 'rolling' : ''}`}>
            {selectedPoint}
          </div>
        )}
      </div>

      <div className="knowledge-list">
        {subjectsData.map(subject => (
          <div 
            key={subject.name}
            className={`subject-group ${selectedSubject !== '全部' && selectedSubject !== subject.name ? 'hidden' : ''}`}
          >
            <h2>{subject.name}</h2>
            {subject.chapters.map(chapter => (
              <div 
                key={chapter.title}
                className={`chapter-group ${selectedChapter !== '全部' && selectedChapter !== chapter.title ? 'hidden' : ''}`}
              >
                <h3>{chapter.title}</h3>
                <div className="points-grid">
                  {chapter.points.map(point => (
                    <div key={point} className="point-item">
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Knowledge; 