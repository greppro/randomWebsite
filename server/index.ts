import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
const isDev = process.env.NODE_ENV !== 'production';
const app = express();
app.use(express.json());
app.use(cors(isDev ? undefined : { origin: process.env.CORS_ORIGIN || true }));

const STATS_FILE = path.resolve(process.cwd(), 'data/visitStats.json');

interface VisitStats {
    totalVisits: number;
    dailyVisits: Record<string, number>;
}

// 静态文件服务：生产环境使用 Vite 构建产物目录 dist，开发可用 public
const staticDir = process.env.NODE_ENV === 'production' ? 'dist' : 'public';
app.use(express.static(path.resolve(process.cwd(), staticDir)));

// 确保数据目录存在
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 初始化访问统计数据
const initialStats: VisitStats = {
    totalVisits: 14,
    dailyVisits: {}
};
const today = new Date().toISOString().split('T')[0];
initialStats.dailyVisits[today] = 2;

// 确保统计文件存在并包含当前日期
if (!fs.existsSync(STATS_FILE)) {
    fs.writeFileSync(STATS_FILE, JSON.stringify(initialStats, null, 2));
} else {
    try {
        const currentStats = JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));
        if (!currentStats.dailyVisits[today]) {
            currentStats.dailyVisits[today] = 0;
            fs.writeFileSync(STATS_FILE, JSON.stringify(currentStats, null, 2));
        }
    } catch (error) {
        console.error('初始化统计文件出错:', error);
        fs.writeFileSync(STATS_FILE, JSON.stringify(initialStats, null, 2));
    }
}

// 串行化读-改-写，避免并发 POST /api/visit 导致少计
let statsWritePromise: Promise<void> = Promise.resolve();

// 读取访问统计数据
function readStats(): VisitStats {
    try {
        if (isDev) console.log('读取统计文件:', STATS_FILE);
        const data = fs.readFileSync(STATS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('读取统计数据出错:', error);
        const defaultStats = { ...initialStats };
        return defaultStats;
    }
}

// 保存访问统计数据
function saveStats(stats: VisitStats) {
    try {
        fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
        if (isDev) console.log('保存统计数据完成');
    } catch (error) {
        console.error('保存统计数据出错:', error);
    }
}

// 获取今天的日期字符串
function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

// 记录访问（读-改-写通过 statsWritePromise 串行化）
app.post('/api/visit', (req, res) => {
    if (isDev) console.log('收到访问记录请求');
    const thisOp = statsWritePromise.then(() => {
        const stats = readStats();
        const today = getTodayString();
        if (!stats.dailyVisits[today]) stats.dailyVisits[today] = 0;
        stats.totalVisits += 1;
        stats.dailyVisits[today] += 1;
        saveStats(stats);
        return { totalVisits: stats.totalVisits, todayVisits: stats.dailyVisits[today] };
    });
    statsWritePromise = thisOp.then(() => {});
    thisOp
        .then((response) => res.json(response))
        .catch((error) => {
            console.error('处理访问记录请求出错:', error);
            res.status(500).json({ error: '服务器内部错误' });
        });
});

// 获取访问统计（只读，不写文件）
app.get('/api/stats', (req, res) => {
    try {
        const stats = readStats();
        const today = getTodayString();
        
        res.json({
            totalVisits: stats.totalVisits,
            todayVisits: stats.dailyVisits[today] || 0
        });
    } catch (error) {
        console.error('处理获取统计数据请求出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 所有其他路由都返回 index.html（支持前端路由）
app.get('*', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), staticDir, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器已启动，运行在端口 ${PORT}`);
    console.log(`统计数据文件路径: ${STATS_FILE}`);
}); 