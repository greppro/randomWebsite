import React, { useState } from 'react';
import '../styles/CoinFlip.css';

const CoinFlip: React.FC = () => {
    const [isFlipping, setIsFlipping] = useState(false);
    const [result, setResult] = useState<'正面' | '反面' | null>(null);
    const [flipCount, setFlipCount] = useState(0);

    const flipCoin = () => {
        if (isFlipping) return;
        
        setIsFlipping(true);
        setResult(null);
        setFlipCount(prev => prev + 1);
        
        // 随机决定结果
        const newResult = Math.random() < 0.5 ? '正面' : '反面';
        
        // 动画结束后显示结果
        setTimeout(() => {
            setResult(newResult);
            setIsFlipping(false);
        }, 1200); // 调整为1.2秒
    };

    return (
        <div className="coin-flip-container">
            <div 
                className={`coin ${isFlipping ? 'flipping' : ''}`}
                onClick={flipCoin}
                title="点击抛硬币"
            >
                <div className="coin-side front">
                    <img src="/images/coin-front.png" alt="硬币正面" draggable="false" />
                </div>
                <div className="coin-side back">
                    <img src="/images/coin-back.png" alt="硬币背面" draggable="false" />
                </div>
            </div>
            <div className="controls">
                <button 
                    onClick={flipCoin}
                    disabled={isFlipping}
                >
                    抛硬币
                </button>
                {result && (
                    <div className="result">
                        {result}
                        <div className="flip-count">
                            第 {flipCount} 次
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoinFlip; 