import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import '../styles/RollCall.css';

interface Student {
  id: number;
  name: string;
  selected: boolean;
}

interface SeatPosition {
  row: number;
  column: number;
}

const RollCall: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<SeatPosition | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [seatMode, setSeatMode] = useState(false);
  const [seatConfig, setSeatConfig] = useState({ rows: 6, columns: 6 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Excel导入功能
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as { 姓名: string }[];

      const newStudents: Student[] = jsonData.map((row, index) => ({
        id: Date.now() + index,
        name: row.姓名,
        selected: false
      }));

      setStudents(prev => [...prev, ...newStudents]);
    };
    reader.readAsArrayBuffer(file);
  };

  // 随机选择座位
  const startRollCallBySeat = () => {
    setIsRolling(true);
    const rollInterval = setInterval(() => {
      const randomRow = Math.floor(Math.random() * seatConfig.rows) + 1;
      const randomColumn = Math.floor(Math.random() * seatConfig.columns) + 1;
      setSelectedSeat({ row: randomRow, column: randomColumn });
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      const finalRow = Math.floor(Math.random() * seatConfig.rows) + 1;
      const finalColumn = Math.floor(Math.random() * seatConfig.columns) + 1;
      setSelectedSeat({ row: finalRow, column: finalColumn });
      setIsRolling(false);
    }, 2000);
  };

  // 随机选择学生
  const startRollCall = () => {
    if (students.length === 0) return;
    
    setIsRolling(true);
    const rollInterval = setInterval(() => {
      const availableStudents = students.filter(s => !s.selected);
      if (availableStudents.length === 0) {
        clearInterval(rollInterval);
        setIsRolling(false);
        return;
      }
      const randomIndex = Math.floor(Math.random() * availableStudents.length);
      setSelectedStudent(availableStudents[randomIndex]);
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      const availableStudents = students.filter(s => !s.selected);
      if (availableStudents.length === 0) {
        setIsRolling(false);
        return;
      }
      const finalStudent = availableStudents[Math.floor(Math.random() * availableStudents.length)];
      setSelectedStudent(finalStudent);
      setStudents(students.map(student => 
        student.id === finalStudent.id 
          ? { ...student, selected: true }
          : student
      ));
      setIsRolling(false);
    }, 2000);
  };

  const addStudent = () => {
    if (newStudent.trim()) {
      setStudents([
        ...students,
        {
          id: Date.now(),
          name: newStudent.trim(),
          selected: false
        }
      ]);
      setNewStudent('');
    }
  };

  const removeStudent = (id: number) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const resetSelection = () => {
    if (seatMode) {
      setSelectedSeat(null);
    } else {
      setStudents(students.map(student => ({ ...student, selected: false })));
      setSelectedStudent(null);
    }
  };

  // 下载Excel模板
  const downloadTemplate = () => {
    const template = [
      ['姓名'],  // 表头
      ['张三'],  // 示例数据
      ['李四'],
      ['王五']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '学生名单');
    
    // 生成并下载文件
    XLSX.writeFile(wb, '学生名单模板.xlsx');
  };

  return (
    <div className="roll-call-container">
      <Link to="/" className="back-button">返回首页</Link>
      <h1>随机点名系统</h1>

      <div className="mode-switch">
        <button 
          className={!seatMode ? 'active' : ''} 
          onClick={() => {
            setSeatMode(false);
            setSelectedSeat(null);
          }}
        >
          姓名点名
        </button>
        <button 
          className={seatMode ? 'active' : ''} 
          onClick={() => {
            setSeatMode(true);
            setSelectedStudent(null);
          }}
        >
          座位点名
        </button>
      </div>

      <div className="control-panel">
        {!seatMode ? (
          <>
            <div className="input-section">
              <input
                type="text"
                value={newStudent}
                onChange={(e) => setNewStudent(e.target.value)}
                placeholder="输入学生姓名"
                onKeyPress={(e) => e.key === 'Enter' && addStudent()}
              />
              <button onClick={addStudent}>添加</button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
              />
              <button onClick={() => fileInputRef.current?.click()}>
                导入Excel
              </button>
              <button 
                onClick={downloadTemplate}
                className="template-button"
              >
                下载模板
              </button>
            </div>

            <div className="student-list">
              {students.map(student => (
                <div 
                  key={student.id} 
                  className={`student-item ${student.selected ? 'selected' : ''}`}
                >
                  <span>{student.name}</span>
                  <button 
                    onClick={() => removeStudent(student.id)}
                    className="remove-button"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="seat-config">
            <div className="seat-input">
              <label>行数：</label>
              <input
                type="number"
                value={seatConfig.rows}
                onChange={(e) => setSeatConfig(prev => ({ 
                  ...prev, 
                  rows: Math.max(1, parseInt(e.target.value) || 1) 
                }))}
                min="1"
              />
            </div>
            <div className="seat-input">
              <label>列数：</label>
              <input
                type="number"
                value={seatConfig.columns}
                onChange={(e) => setSeatConfig(prev => ({ 
                  ...prev, 
                  columns: Math.max(1, parseInt(e.target.value) || 1) 
                }))}
                min="1"
              />
            </div>
          </div>
        )}

        <div className="control-section">
          <button 
            onClick={seatMode ? startRollCallBySeat : startRollCall}
            disabled={isRolling || (!seatMode && students.length === 0)}
          >
            开始点名
          </button>
          <button 
            onClick={resetSelection}
            disabled={isRolling}
          >
            重置
          </button>
        </div>

        <div className="result-section">
          {seatMode ? (
            selectedSeat && (
              <div className={`selected-seat ${isRolling ? 'rolling' : ''}`}>
                第{selectedSeat.row}排 第{selectedSeat.column}列
              </div>
            )
          ) : (
            selectedStudent && (
              <div className={`selected-student ${isRolling ? 'rolling' : ''}`}>
                {selectedStudent.name}
              </div>
            )
          )}
        </div>

        {seatMode && (
          <div className="seat-grid">
            {Array.from({ length: seatConfig.rows }).map((_, rowIndex) => (
              <div key={rowIndex} className="seat-row">
                {Array.from({ length: seatConfig.columns }).map((_, colIndex) => {
                  const isSelected = selectedSeat?.row === rowIndex + 1 && selectedSeat?.column === colIndex + 1;
                  return (
                    <div 
                      key={colIndex} 
                      className={`seat ${isSelected ? 'selected' : ''}`}
                    >
                      {`${rowIndex + 1}-${colIndex + 1}`}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RollCall; 