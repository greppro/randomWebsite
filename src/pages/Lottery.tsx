import React, { useState } from 'react';
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

  const handleDraw = () => {
    if (availablePeople.length === 0) {
      message.warning('没有可抽取的人员！');
      return;
    }

    if (drawCount > availablePeople.length) {
      message.warning(`当前只剩${availablePeople.length}人可抽取！`);
      return;
    }
    
    setIsRolling(true);
    
    let count = 0;
    const maxCount = 20;
    
    const interval = setInterval(() => {
      const randomPeople = [];
      const tempAvailable = [...availablePeople];
      for (let i = 0; i < drawCount; i++) {
        const randomIndex = Math.floor(Math.random() * tempAvailable.length);
        randomPeople.push(tempAvailable[randomIndex].name);
        tempAvailable.splice(randomIndex, 1);
      }
      setSelectedPeople(randomPeople);
      count++;
      
      if (count >= maxCount) {
        clearInterval(interval);
        const finalSelected: string[] = [];
        const newAvailable = [...availablePeople];
        for (let i = 0; i < drawCount; i++) {
          const randomIndex = Math.floor(Math.random() * newAvailable.length);
          finalSelected.push(newAvailable[randomIndex].name);
          newAvailable.splice(randomIndex, 1);
        }
        setSelectedPeople(finalSelected);
        setAvailablePeople(newAvailable);
        setIsRolling(false);
        
        // 添加中奖记录
        const currentTime = new Date().toLocaleString();
        setDrawNumber(prev => prev + 1);
        setWinnerRecords(prev => [...prev, {
          names: finalSelected,
          timestamp: currentTime,
          drawNo: drawNumber + 1
        }]);
      }
    }, 100);
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
    // 如果有中奖记录，显示确认提示
    if (winnerRecords.length > 0) {
      Modal.confirm({
        title: '确认重置',
        icon: <ExclamationCircleOutlined />,
        content: '重置将清空所有中奖记录，是否继续？',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          setAvailablePeople(people);
          setSelectedPeople([]);
          setWinnerRecords([]);
          setDrawNumber(0);
          message.success('已重置抽奖池和中奖记录！');
        }
      });
    } else {
      setAvailablePeople(people);
      setSelectedPeople([]);
      setWinnerRecords([]);
      setDrawNumber(0);
      message.success('已重置抽奖池！');
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderContent = () => {
    if (isFullscreen) {
      return (
        <div className="fullscreen-mode">
          <Button 
            icon={<FullscreenExitOutlined />} 
            onClick={toggleFullscreen}
            className="exit-fullscreen-btn"
          >
            退出全屏
          </Button>
          <div className="fullscreen-content">
            {selectedPeople.length > 0 && (
              <div className={`selected-items ${isRolling ? 'rolling' : ''}`}>
                {selectedPeople.map((name, index) => (
                  <div key={index} className="selected-item">
                    {name}
                  </div>
                ))}
              </div>
            )}
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
              onClick={toggleFullscreen}
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
            <div className={`selected-items ${isRolling ? 'rolling' : ''}`}>
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
    <div className={`lottery-container ${isFullscreen ? 'fullscreen' : ''}`}>
      {!isFullscreen && <Link to="/" className="back-button">返回首页</Link>}
      {!isFullscreen && <h1>抽奖系统</h1>}
      {renderContent()}
    </div>
  );
};

export default Lottery; 