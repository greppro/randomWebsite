import React, { useState } from 'react';
import { Button, Upload, message, Card, List, InputNumber } from 'antd';
import { UploadOutlined, RedoOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import '../styles/Lottery.css';
import { Link } from 'react-router-dom';

interface LotteryPerson {
  name: string;
  selected: boolean;
}

const Lottery: React.FC = () => {
  const [people, setPeople] = useState<LotteryPerson[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [drawCount, setDrawCount] = useState<number>(1);
  const [availablePeople, setAvailablePeople] = useState<LotteryPerson[]>([]);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // 过滤掉空值和表头
        const names = jsonData.slice(1).flat().filter(item => item);
        const newPeople = names.map(name => ({
          name: String(name),
          selected: false
        }));
        
        setPeople(newPeople);
        setAvailablePeople(newPeople);
        setSelectedPeople([]);
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
    
    // 快速切换显示不同选项的动画效果
    let count = 0;
    const maxCount = 20; // 动画循环次数
    const tempSelected: string[] = [];
    
    const interval = setInterval(() => {
      // 随机选择指定数量的人
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
        // 最终选择
        const finalSelected = [];
        const newAvailable = [...availablePeople];
        for (let i = 0; i < drawCount; i++) {
          const randomIndex = Math.floor(Math.random() * newAvailable.length);
          finalSelected.push(newAvailable[randomIndex].name);
          newAvailable.splice(randomIndex, 1);
        }
        setSelectedPeople(finalSelected);
        setAvailablePeople(newAvailable);
        setIsRolling(false);
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
    
    // 设置列宽
    const wscols = [
      {wch: 20}, // 设置列宽
    ];
    worksheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workbook, worksheet, '抽奖名单');
    XLSX.writeFile(workbook, '抽奖名单模板.xlsx');
  };

  const handleReset = () => {
    setAvailablePeople(people);
    setSelectedPeople([]);
    message.success('已重置抽奖池！');
  };

  return (
    <div className="lottery-container">
      <Link to="/" className="back-button">返回首页</Link>
      <h1>抽奖系统</h1>
      
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
              disabled={isRolling || people.length === availablePeople.length}
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

        {people.length > 0 && (
          <Card type="inner" title="参与人员名单" className="people-list">
            <List
              size="small"
              bordered
              dataSource={people}
              renderItem={item => (
                <List.Item className={!availablePeople.find(p => p.name === item.name) ? 'selected' : ''}>
                  {item.name}
                  {!availablePeople.find(p => p.name === item.name) && 
                    <span className="selected-tag">已抽取</span>
                  }
                </List.Item>
              )}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Lottery; 