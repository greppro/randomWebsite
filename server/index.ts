import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATS_FILE = path.join(__dirname, '../data/visitStats.json');

// 确保统计文件存在
if (!fs.existsSync(STATS_FILE)) {
    fs.writeFileSync(STATS_FILE, JSON.stringify({
        totalVisits: 0,
        dailyVisits: {},
    }));
}

// 读取访问统计数据
function readStats() {
    const data = fs.readFileSync(STATS_FILE, 'utf-8');
    return JSON.parse(data);
}

// 保存访问统计数据
function saveStats(stats: any) {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
}

// 获取今天的日期字符串
function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

// 记录访问
app.post('/api/visit', (req, res) => {
    const stats = readStats();
    const today = getTodayString();
    
    stats.totalVisits += 1;
    stats.dailyVisits[today] = (stats.dailyVisits[today] || 0) + 1;
    
    saveStats(stats);
    
    res.json({
        totalVisits: stats.totalVisits,
        todayVisits: stats.dailyVisits[today]
    });
});

// 获取访问统计
app.get('/api/stats', (req, res) => {
    const stats = readStats();
    const today = getTodayString();
    
    res.json({
        totalVisits: stats.totalVisits,
        todayVisits: stats.dailyVisits[today] || 0
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 