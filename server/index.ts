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
const STATS_FILE = path.resolve(process.cwd(), 'data/visitStats.json');

// 静态文件服务
app.use(express.static(path.resolve(process.cwd(), 'public')));

// 确保数据目录存在
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 初始化访问统计数据
const initialStats = {
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

// 读取访问统计数据
function readStats() {
    try {
        console.log('读取统计文件:', STATS_FILE);
        const data = fs.readFileSync(STATS_FILE, 'utf-8');
        console.log('统计数据内容:', data);
        return JSON.parse(data);
    } catch (error) {
        console.error('读取统计数据出错:', error);
        // 如果读取出错，返回默认数据
        const defaultStats = { ...initialStats };
        return defaultStats;
    }
}

// 保存访问统计数据
function saveStats(stats: any) {
    try {
        console.log('保存统计数据:', JSON.stringify(stats, null, 2));
        fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
        // 验证数据是否正确保存
        const savedData = fs.readFileSync(STATS_FILE, 'utf-8');
        console.log('保存后的数据:', savedData);
    } catch (error) {
        console.error('保存统计数据出错:', error);
    }
}

// 获取今天的日期字符串
function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

// 记录访问
app.post('/api/visit', (req, res) => {
    console.log('收到访问记录请求');
    try {
        const stats = readStats();
        const today = getTodayString();
        
        // 确保今日访问量存在
        if (!stats.dailyVisits[today]) {
            stats.dailyVisits[today] = 0;
        }
        
        // 增加访问量
        stats.totalVisits += 1;
        stats.dailyVisits[today] += 1;
        
        saveStats(stats);
        
        const response = {
            totalVisits: stats.totalVisits,
            todayVisits: stats.dailyVisits[today]
        };
        
        console.log('返回访问统计:', response);
        res.json(response);
    } catch (error) {
        console.error('处理访问记录请求出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 获取访问统计
app.get('/api/stats', (req, res) => {
    console.log('收到获取统计数据请求');
    try {
        const stats = readStats();
        const today = getTodayString();
        
        // 确保今日访问量存在
        if (!stats.dailyVisits[today]) {
            stats.dailyVisits[today] = 0;
            saveStats(stats);
        }
        
        // 随机增加访问量（仅用于演示）
        if (Math.random() > 0.7) {
            stats.totalVisits += 1;
            stats.dailyVisits[today] += 1;
            saveStats(stats);
            console.log('随机增加了访问量');
        }
        
        const response = {
            totalVisits: stats.totalVisits,
            todayVisits: stats.dailyVisits[today] || 0
        };
        
        console.log('返回统计数据:', response);
        res.json(response);
    } catch (error) {
        console.error('处理获取统计数据请求出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 所有其他路由都返回 index.html（支持前端路由）
app.get('*', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器已启动，运行在端口 ${PORT}`);
    console.log(`统计数据文件路径: ${STATS_FILE}`);
}); 