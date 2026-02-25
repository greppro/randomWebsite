import React, { useState } from 'react';
import { Button, Upload, message, Card, List } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import '../styles/CustomRandom.css';
import { Link } from 'react-router-dom';

const CustomRandom: React.FC = () => {
  const [data, setData] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // 过滤掉空值并确保类型为字符串
        const items = jsonData.flat().filter(item => item).map(item => String(item));
        setData(items);
        message.success('Excel文件上传成功！');
      } catch (error) {
        message.error('文件处理失败，请确保使用正确的模板格式！');
      }
    };
    reader.readAsBinaryString(file);
    return false;
  };

  const handleRandom = () => {
    if (data.length === 0) {
      message.warning('请先上传数据！');
      return;
    }
    
    setIsRolling(true);
    
    // 快速切换显示不同选项的动画效果
    let count = 0;
    const maxCount = 20; // 动画循环次数
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * data.length);
      setSelectedItem(data[randomIndex]);
      count++;
      
      if (count >= maxCount) {
        clearInterval(interval);
        // 最终选择
        const finalIndex = Math.floor(Math.random() * data.length);
        setSelectedItem(data[finalIndex]);
        setIsRolling(false);
      }
    }, 100); // 每100ms切换一次
  };

  const downloadTemplate = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['香蕉'],
      ['梨子'],
      ['猕猴桃'],
      ['芒果'],
      ['西瓜'],
      ['草莓'],
      ['柚子']
    ]);
    
    // 设置列宽
    const wscols = [
      {wch: 20}, // 设置列宽
    ];
    worksheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workbook, worksheet, '随机列表');
    XLSX.writeFile(workbook, '随机列表模板.xlsx');
  };

  return (
    <div className="custom-random-container">
      <Link to="/" className="back-button">返回首页</Link>
      <h1>自定义随机</h1>
      
      <div className="content-section">
        <div className="bento-card custom-random-action-card">
        <div className="upload-section">
          <Button onClick={downloadTemplate} style={{ marginRight: 16 }}>
            下载Excel模板
          </Button>
          <Upload
            accept=".xlsx,.xls"
            beforeUpload={handleFileUpload}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>上传Excel文件</Button>
          </Upload>
        </div>

        <div className="control-section">
          <Button 
            type="primary" 
            onClick={handleRandom} 
            disabled={isRolling || data.length === 0}
          >
            {isRolling ? '正在选择...' : '随机选择'}
          </Button>
        </div>

        {selectedItem && (
          <div className="result-section">
            <div className={`selected-item ${isRolling ? 'rolling' : ''}`}>
              {selectedItem}
            </div>
          </div>
        )}
        </div>

        {data.length > 0 && (
          <div className="bento-card data-list-wrapper">
          <Card type="inner" title="当前数据列表" className="data-list">
            <List
              size="small"
              bordered
              dataSource={data}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
          </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomRandom; 