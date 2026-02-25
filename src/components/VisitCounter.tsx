import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './VisitCounter.css';

const STORAGE_KEY = 'visitStats';

interface VisitStats {
    totalVisits: number;
    todayVisits: number;
}

function getTodayString(): string {
    return new Date().toISOString().split('T')[0];
}

function readFromStorage(): VisitStats {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { totalVisits: 0, todayVisits: 0 };
        const data = JSON.parse(raw) as { totalVisits: number; dailyVisits: Record<string, number> };
        const today = getTodayString();
        return {
            totalVisits: data.totalVisits ?? 0,
            todayVisits: data.dailyVisits?.[today] ?? 0,
        };
    } catch {
        return { totalVisits: 0, todayVisits: 0 };
    }
}

function writeVisitToStorage(): VisitStats {
    const today = getTodayString();
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const data = raw
            ? (JSON.parse(raw) as { totalVisits: number; dailyVisits: Record<string, number> })
            : { totalVisits: 0, dailyVisits: {} as Record<string, number> };
        data.totalVisits = (data.totalVisits ?? 0) + 1;
        data.dailyVisits = data.dailyVisits ?? {};
        data.dailyVisits[today] = (data.dailyVisits[today] ?? 0) + 1;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return {
            totalVisits: data.totalVisits,
            todayVisits: data.dailyVisits[today],
        };
    } catch {
        return { totalVisits: 0, todayVisits: 0 };
    }
}

export default function VisitCounter() {
    const [stats, setStats] = useState<VisitStats>(() => readFromStorage());
    const [isVisible, setIsVisible] = useState(false);
    const scrollRefreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const location = useLocation();
    const isLotteryPage = location.pathname === '/lottery';
    const searchParams = new URLSearchParams(location.search);
    const isLotteryFullscreen = isLotteryPage && searchParams.get('fullscreen') === 'true';

    useEffect(() => {
        const hasRecorded = sessionStorage.getItem('hasRecordedVisit');
        if (!hasRecorded) {
            const next = writeVisitToStorage();
            setStats(next);
            sessionStorage.setItem('hasRecordedVisit', 'true');
        } else {
            setStats(readFromStorage());
        }

        const interval = setInterval(() => setStats(readFromStorage()), 30000);

        const DEBOUNCE_MS = 400;
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollPosition + windowHeight >= documentHeight - 10) {
                setIsVisible(true);
                if (scrollRefreshTimeoutRef.current) clearTimeout(scrollRefreshTimeoutRef.current);
                scrollRefreshTimeoutRef.current = setTimeout(() => {
                    setStats(readFromStorage());
                    scrollRefreshTimeoutRef.current = null;
                }, DEBOUNCE_MS);
            } else {
                setIsVisible(false);
                if (scrollRefreshTimeoutRef.current) {
                    clearTimeout(scrollRefreshTimeoutRef.current);
                    scrollRefreshTimeoutRef.current = null;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            clearInterval(interval);
            if (scrollRefreshTimeoutRef.current) clearTimeout(scrollRefreshTimeoutRef.current);
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
        </div>
    );
} 