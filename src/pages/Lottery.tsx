import React, { useState, useEffect, useRef } from 'react';
import { Button, Upload, message, InputNumber, Modal } from 'antd';
import { UploadOutlined, RedoOutlined, FullscreenOutlined, FullscreenExitOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import '../styles/Lottery.css';
import { Link } from 'react-router-dom';

interface LotteryPerson {
  name: string;
  selected: boolean;
}

interface WinnerRecord {
  names: string[];
  timestamp: string;
  drawNo: number;
}

const Lottery: React.FC = () => {
  const [people, setPeople] = useState<LotteryPerson[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [drawCount, setDrawCount] = useState<number>(1);
  const [availablePeople, setAvailablePeople] = useState<LotteryPerson[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [winnerRecords, setWinnerRecords] = useState<WinnerRecord[]>([]);
  const [drawNumber, setDrawNumber] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rollingSpeed, setRollingSpeed] = useState(100); // 控制抽奖滚动速度
  const [confettiActive, setConfettiActive] = useState(false); // 控制彩带效果

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen]);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const names = jsonData.slice(1).flat().filter(item => item);
        const newPeople = names.map(name => ({
          name: String(name),
          selected: false
        }));
        
        setPeople(newPeople);
        setAvailablePeople(newPeople);
        setSelectedPeople([]);
        setWinnerRecords([]);
        setDrawNumber(0);
        message.success('名单上传成功！');
      } catch (error) {
        message.error('文件处理失败，请确保使用正确的模板格式！');
      }
    };
    reader.readAsBinaryString(file);
    return false;
  };

  const handleExitFullscreen = () => {
    // 直接使用简单的方法退出全屏并更新状态
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => console.error('退出全屏失败:', err));
    }
    setIsFullscreen(false); // 无论成功与否，都将状态设置为非全屏
  };

  const handleEnterFullscreen = () => {
    if (!containerRef.current) return;
    
    try {
      // 尝试进入全屏模式
      const element = containerRef.current;
      if (element.requestFullscreen) {
        element.requestFullscreen().then(() => {
          setIsFullscreen(true);
        }).catch(err => {
          console.error('进入全屏失败:', err);
          message.error('进入全屏模式失败');
        });
      } else {
        // 如果API不支持，至少可以模拟全屏UI
        setIsFullscreen(true);
      }
    } catch (error) {
      console.error('全屏操作异常:', error);
      // 回退方案：仍然切换UI状态
      setIsFullscreen(true);
    }
  };

  const showWarning = (content: string) => {
    message.destroy();
    message.warning({
      content,
      duration: 2,
      style: isFullscreen ? {
        marginTop: '80px'
      } : undefined
    });
  };

  const handleDraw = () => {
    // 检查是否有可抽取的人员
    if (availablePeople.length === 0) {
      showWarning('没有可抽取的人员！');
      return;
    }

    // 检查抽取人数是否合法
    if (drawCount > availablePeople.length) {
      showWarning(`当前只剩${availablePeople.length}人可抽取！`);
      return;
    }
    
    // 如果已经在抽奖中，不执行任何操作
    if (isRolling) return;
    
    setIsRolling(true);
    setSelectedPeople([]); // 清空之前的选择
    setConfettiActive(false); // 重置彩带效果
    
    let count = 0;
    const maxCount = 30; // 增加滚动次数，让效果更明显
    let currentSpeed = rollingSpeed;
    
    const roll = () => {
      const randomPeople = [];
      const tempAvailable = [...availablePeople];
      for (let i = 0; i < drawCount; i++) {
        if (tempAvailable.length === 0) break;
        const randomIndex = Math.floor(Math.random() * tempAvailable.length);
        randomPeople.push(tempAvailable[randomIndex].name);
        tempAvailable.splice(randomIndex, 1);
      }
      setSelectedPeople(randomPeople);
      count++;
      
      // 逐渐减慢滚动速度，增强期待感
      if (count < maxCount / 2) {
        currentSpeed = rollingSpeed;
      } else if (count < maxCount * 0.8) {
        currentSpeed = rollingSpeed * 1.5;
      } else {
        currentSpeed = rollingSpeed * 2.5;
      }
      
      if (count >= maxCount) {
        // 最终结果
        const finalSelected: string[] = [];
        const newAvailable = [...availablePeople];
        for (let i = 0; i < drawCount; i++) {
          if (newAvailable.length === 0) break;
          const randomIndex = Math.floor(Math.random() * newAvailable.length);
          finalSelected.push(newAvailable[randomIndex].name);
          newAvailable.splice(randomIndex, 1);
        }
        setSelectedPeople(finalSelected);
        setAvailablePeople(newAvailable);
        setIsRolling(false);
        setConfettiActive(true); // 显示彩带效果
        
        // 添加中奖记录
        const currentTime = new Date().toLocaleString();
        setDrawNumber(prev => prev + 1);
        setWinnerRecords(prev => [...prev, {
          names: finalSelected,
          timestamp: currentTime,
          drawNo: drawNumber + 1
        }]);
      } else {
        setTimeout(roll, currentSpeed);
      }
    };
    
    roll(); // 开始滚动
  };

  const downloadTemplate = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['姓名'],
      ['张三'],
      ['李四'],
      ['王五'],
      ['赵六'],
      ['钱七'],
      ['孙八'],
      ['周九'],
      ['吴十']
    ]);
    
    const wscols = [
      {wch: 20},
    ];
    worksheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workbook, worksheet, '抽奖名单');
    XLSX.writeFile(workbook, '抽奖名单模板.xlsx');
  };

  const handleReset = () => {
    // 重置所有已抽取的人员
    setAvailablePeople([...people]);
    // 清空中奖记录
    setWinnerRecords([]);
    // 清空当前选中的人员
    setSelectedPeople([]);
    // 停止滚动
    setIsRolling(false);
    message.success('已重置抽奖数据');
  };

  const getSelectedItemsClassName = () => {
    if (!selectedPeople.length) return '';
    const baseClass = isRolling ? 'rolling' : confettiActive ? 'winner' : '';
    
    if (selectedPeople.length === 1) return `single ${baseClass}`;
    if (selectedPeople.length === 2) return `double ${baseClass}`;
    if (selectedPeople.length === 3) return `triple ${baseClass}`;
    return `multiple ${baseClass}`;
  };

  // 渲染彩带效果
  const renderConfetti = () => {
    if (!confettiActive) return null;
    
    return (
      <div className="confetti-container">
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i} 
            className="confetti" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`
            }}
          />
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (isFullscreen) {
      return (
        <div className="fullscreen-mode">
          {renderConfetti()}
          <Button 
            icon={<FullscreenExitOutlined />} 
            onClick={handleExitFullscreen}
            className="exit-fullscreen-btn"
          >
            退出全屏
          </Button>
          <div className="fullscreen-content">
            <h1 className="fullscreen-title">幸运抽奖</h1>
            
            <div className={`selected-items ${getSelectedItemsClassName()}`}>
              {selectedPeople.length > 0 ? (
                selectedPeople.map((name, index) => (
                  <div key={index} className="selected-item">
                    {name}
                  </div>
                ))
              ) : (
                <div className="selected-item waiting-item">
                  <span>等待抽取</span>
                </div>
              )}
            </div>
            
            <div className="fullscreen-controls">
              <Button 
                type="primary"
                size="large"
                onClick={handleDraw}
                disabled={isRolling || availablePeople.length === 0}
                className="fullscreen-draw-btn"
              >
                {isRolling ? '抽取中...' : '开始抽奖'}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="content-section">
        <div className="upload-section">
          <Button onClick={downloadTemplate} style={{ marginRight: 16 }}>
            下载Excel模板
          </Button>
          <Upload
            accept=".xlsx,.xls"
            beforeUpload={handleFileUpload}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>上传名单</Button>
          </Upload>
        </div>

        <div className="control-section">
          <div className="draw-config">
            <span>抽取人数：</span>
            <InputNumber
              min={1}
              max={availablePeople.length}
              value={drawCount}
              onChange={(value) => setDrawCount(value || 1)}
              disabled={isRolling}
            />
            <Button 
              icon={<FullscreenOutlined />}
              onClick={handleEnterFullscreen}
              style={{ marginLeft: 16 }}
            >
              全屏抽奖
            </Button>
          </div>
          <div className="buttons">
            <Button 
              type="primary" 
              onClick={handleDraw} 
              disabled={isRolling || availablePeople.length === 0}
            >
              {isRolling ? '抽取中...' : '开始抽奖'}
            </Button>
            <Button 
              icon={<RedoOutlined />}
              onClick={handleReset}
              disabled={isRolling || (people.length === availablePeople.length && winnerRecords.length === 0)}
            >
              重置
            </Button>
          </div>
        </div>

        {selectedPeople.length > 0 && (
          <div className="result-section">
            <div className={`selected-items ${getSelectedItemsClassName()}`}>
              {selectedPeople.map((name, index) => (
                <div key={index} className="selected-item">
                  {name}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="stats-section">
          <div className="stat-item">
            总人数：{people.length}
          </div>
          <div className="stat-item">
            剩余人数：{availablePeople.length}
          </div>
          <div className="stat-item">
            已抽取：{people.length - availablePeople.length}
          </div>
        </div>

        {winnerRecords.length > 0 && (
          <div className="winner-records">
            <h2>中奖记录</h2>
            <div className="records-list">
              {winnerRecords.map((record, index) => (
                <div key={index} className="record-item">
                  <div className="record-header">
                    <span className="draw-no">第 {record.drawNo} 轮</span>
                    <span className="winner-time">{record.timestamp}</span>
                  </div>
                  <div className="winner-names">
                    {record.names.map((name, nameIndex) => (
                      <span key={nameIndex} className="winner-name">{name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className={`lottery-container ${isFullscreen ? 'fullscreen' : ''}`}>
      {!isFullscreen && <Link to="/" className="back-button">返回首页</Link>}
      {!isFullscreen && <h1>抽奖系统</h1>}
      {renderContent()}
    </div>
  );
};

export default Lottery; 