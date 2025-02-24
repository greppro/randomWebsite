import { useEffect, useState, useRef } from 'react';

interface VisitStats {
    totalVisits: number;
    todayVisits: number;
}

export default function VisitCounter() {
    const [stats, setStats] = useState<VisitStats>({ totalVisits: 0, todayVisits: 0 });
    const hasRecordedVisit = useRef(false);

    useEffect(() => {
        // 确保只记录一次访问
        if (!hasRecordedVisit.current) {
            hasRecordedVisit.current = true;
            // 记录访问
            fetch('/api/visit', {
                method: 'POST',
            })
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(console.error);
        }

        // 每分钟更新一次统计数据
        const interval = setInterval(() => {
            fetch('/api/stats')
                .then(res => res.json())
                .then(data => setStats(data))
                .catch(console.error);
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="visit-counter">
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
            <style>
                {`
                .visit-counter {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(255, 255, 255, 0.6);
                    padding: 6px 12px;
                    border-radius: 16px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                    z-index: 1000;
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    font-size: 12px;
                    color: rgba(0, 0, 0, 0.6);
                }
                .visit-stats {
                    display: flex;
                    gap: 12px;
                }
                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                }
                .stat-item span:last-child {
                    font-weight: 500;
                    color: #4a90e2;
                }
                @media (min-width: 768px) {
                    .visit-counter {
                        padding: 8px 16px;
                        font-size: 14px;
                        border-radius: 20px;
                    }
                    .visit-stats {
                        gap: 16px;
                    }
                    .stat-item {
                        gap: 4px;
                    }
                }
                `}
            </style>
        </div>
    );
} 