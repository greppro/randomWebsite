import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

// 懒加载其他页面组件
const Poetry = React.lazy(() => import('./pages/Poetry'));
const RollCall = React.lazy(() => import('./pages/RollCall'));
const Food = React.lazy(() => import('./pages/Food'));
const Knowledge = React.lazy(() => import('./pages/Knowledge'));
const CustomRandom = React.lazy(() => import('./pages/CustomRandom'));
const Lottery = React.lazy(() => import('./pages/Lottery'));

const App: React.FC = () => {
  return (
    <React.Suspense fallback={<div>加载中...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="poetry" element={<Poetry />} />
        <Route path="roll-call" element={<RollCall />} />
        <Route path="food" element={<Food />} />
        <Route path="knowledge" element={<Knowledge />} />
        <Route path="custom-random" element={<CustomRandom />} />
        <Route path="lottery" element={<Lottery />} />
      </Routes>
    </React.Suspense>
  );
};

export default App; 