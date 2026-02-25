import React from 'react';
import { Link } from 'react-router-dom';
import CoinFlip from '../components/CoinFlip';
import '../styles/CoinFlipPage.css';

const CoinFlipPage: React.FC = () => {
    return (
        <div className="coin-flip-page">
            <Link to="/" className="back-button">返回首页</Link>
            <div className="bento-card coin-flip-content">
                <h1>抛硬币</h1>
                <p className="description">
                    在犹豫不决时，不妨试试让命运来做选择。
                    <br />
                    点击按钮开始抛硬币，看看是正面还是反面？
                </p>
                <CoinFlip />
            </div>
        </div>
    );
};

export default CoinFlipPage; 