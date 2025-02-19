import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/RollCall.css';

interface Student {
  id: number;
  name: string;
  selected: boolean;
}

const RollCall: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isRolling, setIsRolling] = useState(false);

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

  const startRollCall = () => {
    if (students.length === 0) return;
    
    setIsRolling(true);
    const rollInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * students.length);
      setSelectedStudent(students[randomIndex]);
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      setIsRolling(false);
      const finalStudent = students[Math.floor(Math.random() * students.length)];
      setSelectedStudent(finalStudent);
      setStudents(students.map(student => 
        student.id === finalStudent.id 
          ? { ...student, selected: true }
          : student
      ));
    }, 2000);
  };

  const resetSelection = () => {
    setStudents(students.map(student => ({ ...student, selected: false })));
    setSelectedStudent(null);
  };

  return (
    <div className="roll-call-container">
      <Link to="/" className="back-button">返回首页</Link>
      <h1>随机点名系统</h1>

      <div className="input-section">
        <input
          type="text"
          value={newStudent}
          onChange={(e) => setNewStudent(e.target.value)}
          placeholder="输入学生姓名"
          onKeyPress={(e) => e.key === 'Enter' && addStudent()}
        />
        <button onClick={addStudent}>添加</button>
      </div>

      <div className="control-section">
        <button 
          onClick={startRollCall}
          disabled={isRolling || students.length === 0}
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
        {selectedStudent && (
          <div className={`selected-student ${isRolling ? 'rolling' : ''}`}>
            {selectedStudent.name}
          </div>
        )}
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
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RollCall; 