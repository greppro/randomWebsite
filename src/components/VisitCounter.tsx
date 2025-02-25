import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface VisitStats {
    totalVisits: number;
    todayVisits: number;
}

export default function VisitCounter() {
    const [stats, setStats] = useState<VisitStats>({ totalVisits: 0, todayVisits: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();
    const isLotteryPage = location.pathname === '/lottery';
    const searchParams = new URLSearchParams(location.search);
    const isLotteryFullscreen = isLotteryPage && searchParams.get('fullscreen') === 'true';

    // 获取访问量数据
    useEffect(() => {
        // 记录访问（每个会话只记录一次）
        const hasRecorded = sessionStorage.getItem('hasRecordedVisit');
        
        const initVisits = async () => {
            try {
                if (!hasRecorded) {
                    // 记录新访问
                    const response = await fetch('/api/visit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        setStats(data);
                        sessionStorage.setItem('hasRecordedVisit', 'true');
                    }
                } else {
                    // 获取当前统计数据
                    const response = await fetch('/api/stats');
                    if (response.ok) {
                        const data = await response.json();
                        setStats(data);
                    }
                }
            } catch (error) {
                console.error('获取访问统计数据出错:', error);
            }
        };
        
        initVisits();
        
        // 每10秒更新一次数据
        const interval = setInterval(async () => {
            try {
                const response = await fetch('/api/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('更新访问统计数据出错:', error);
            }
        }, 10000);
        
        // 添加滚动监听器，检测是否滚动到页面底部
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // 当滚动到接近底部时显示计数器
            if (scrollPosition + windowHeight >= documentHeight - 10) {
                setIsVisible(true);
                // 当显示计数器时，立即刷新一次数据
                fetch('/api/stats')
                    .then(res => res.json())
                    .then(data => setStats(data))
                    .catch(error => console.error('刷新访问统计数据出错:', error));
            } else {
                setIsVisible(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        // 初始检查
        handleScroll();
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location.pathname]);
    
    if (isLotteryFullscreen) {
        return null; // 在抽奖全屏模式下不显示访问计数器
    }

    return (
        <div className={`visit-counter ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="footer-content">
                <div className="github-link">
                    <a href="https://github.com/greppro/randomWebsite" target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                </div>
                <div className="visit-stats">
                    <div className="stat-item">
                        <span>今日访问：</span>
                        <span>{stats.todayVisits}</span>
                    </div>
                    <div className="stat-item">
                        <span>总访问量：</span>
                        <span>{stats.totalVisits}</span>
                    </div>
                </div>
            </div>
            <style>
                {`
                .visit-counter {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(255, 255, 255, 0.8);
                    padding: 10px 0;
                    box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    backdrop-filter: blur(8px);
                    border-top: 1px solid rgba(255, 255, 255, 0.3);
                    font-size: 12px !important;
                    color: rgba(0, 0, 0, 0.6);
                    line-height: 1.5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.3s ease, opacity 0.3s ease;
                }
                .visit-counter.hidden {
                    transform: translateY(100%);
                    opacity: 0;
                }
                .visit-counter.visible {
                    transform: translateY(0);
                    opacity: 1;
                }
                .footer-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                }
                .github-link a {
                    color: #4a90e2;
                    text-decoration: none;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .github-link a:hover {
                    text-decoration: underline;
                }
                .github-link a:before {
                    content: '';
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="%234a90e2" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>');
                    background-repeat: no-repeat;
                    background-position: center;
                }
                .visit-stats {
                    display: flex;
                    gap: 12px;
                    font-size: inherit !important;
                }
                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    font-size: inherit !important;
                }
                .stat-item span {
                    font-size: inherit !important;
                    transform: none !important;
                }
                .stat-item span:last-child {
                    font-weight: 500;
                    color: #4a90e2;
                }
                @media (min-width: 768px) {
                    .visit-counter {
                        padding: 12px 0;
                        font-size: 14px !important;
                    }
                    .footer-content {
                        gap: 30px;
                    }
                    .visit-stats {
                        gap: 16px;
                    }
                    .stat-item {
                        gap: 4px;
                    }
                    .github-link a:before {
                        width: 18px;
                        height: 18px;
                    }
                }
                `}
            </style>
        </div>
    );
} 