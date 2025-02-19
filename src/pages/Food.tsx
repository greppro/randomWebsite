import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Food.css';

interface FoodCategory {
  name: string;
  items: string[];
}

const foodData: FoodCategory[] = [
  {
    name: '中餐',
    items: [
      '红烧肉', '麻婆豆腐', '宫保鸡丁', '水煮鱼',
      '回锅肉', '糖醋里脊', '炸酱面', '兰州拉面',
      '小笼包', '叉烧饭', '酸菜鱼', '火锅'
    ]
  },
  {
    name: '快餐',
    items: [
      '汉堡', '炸鸡', '披萨', '三明治',
      '炒面', '炒饭', '盖浇饭', '煎饺'
    ]
  },
  {
    name: '面食',
    items: [
      '阳春面', '牛肉面', '重庆小面', '担担面',
      '炸酱面', '刀削面', '油泼面', '麻辣烫'
    ]
  }
];

const Food: React.FC = () => {
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  const getRandomFood = () => {
    if (isRolling) return;

    setIsRolling(true);
    
    const availableFoods = selectedCategory === '全部'
      ? foodData.flatMap(category => category.items)
      : foodData.find(category => category.name === selectedCategory)?.items || [];

    if (availableFoods.length === 0) return;

    const rollInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableFoods.length);
      setSelectedFood(availableFoods[randomIndex]);
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      const finalIndex = Math.floor(Math.random() * availableFoods.length);
      setSelectedFood(availableFoods[finalIndex]);
      setIsRolling(false);
    }, 2000);
  };

  return (
    <div className="food-container">
      <Link to="/" className="back-button">返回首页</Link>
      <h1>今天吃什么？</h1>

      <div className="category-section">
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="全部">全部类别</option>
          {foodData.map(category => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="control-section">
        <button 
          onClick={getRandomFood}
          disabled={isRolling}
        >
          开始选择
        </button>
      </div>

      <div className="result-section">
        {selectedFood && (
          <div className={`selected-food ${isRolling ? 'rolling' : ''}`}>
            {selectedFood}
          </div>
        )}
      </div>

      <div className="food-list">
        {foodData.map(category => (
          <div key={category.name} className="category-group">
            <h2>{category.name}</h2>
            <div className="food-items">
              {category.items.map(item => (
                <div key={item} className="food-item">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Food; 