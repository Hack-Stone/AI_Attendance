import { ChatMessage } from '../types';
import { mockStudents, mockAttendanceRecords } from './mockData';

const responses = {
  greeting: [
    "Hello! I'm your AI attendance assistant for the Computer Science Department. How can I help you today?",
    "Hi there! I can help you with attendance queries, predictions, and insights for CS students.",
    "Welcome! I'm here to assist with all your Computer Department attendance-related questions."
  ],
  attendance: [
    "Let me analyze the attendance data for the Computer Science Department.",
    "I'll check the attendance records for CS students.",
    "Fetching attendance information from the database..."
  ],
  defaulters: [
    "Here are the CS students who need attention regarding their attendance:",
    "I've identified Computer Science students with concerning attendance patterns:",
    "These CS students have attendance below the required threshold:"
  ],
  prediction: [
    "Based on current trends in the CS department, here's my attendance prediction:",
    "Using machine learning analysis of CS student patterns, I forecast:",
    "My AI prediction for Computer Science students suggests:"
  ],
  subjects: [
    "Here are the subjects being taught in the Computer Science Department:",
    "Current CS curriculum includes these subjects:",
    "Computer Science subjects this semester:"
  ]
};

export const processMessage = (message: string): ChatMessage => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return {
      id: Date.now().toString(),
      message: responses.greeting[Math.floor(Math.random() * responses.greeting.length)],
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  if (lowerMessage.includes('defaulter') || lowerMessage.includes('low attendance')) {
    const defaulters = mockStudents.filter(s => s.attendance_percentage < 80);
    return {
      id: Date.now().toString(),
      message: responses.defaulters[Math.floor(Math.random() * responses.defaulters.length)],
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'list',
      data: defaulters
    };
  }
  
  if (lowerMessage.includes('predict') || lowerMessage.includes('forecast')) {
    const prediction = Math.round(75 + Math.random() * 20);
    return {
      id: Date.now().toString(),
      message: `${responses.prediction[Math.floor(Math.random() * responses.prediction.length)]} The overall CS department attendance is likely to be ${prediction}% next week based on current patterns and historical data.`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  if (lowerMessage.includes('subject') || lowerMessage.includes('course')) {
    const subjects = ['Data Structures', 'Database Management', 'Web Development', 'Machine Learning', 'Software Engineering'];
    return {
      id: Date.now().toString(),
      message: responses.subjects[Math.floor(Math.random() * responses.subjects.length)],
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'list',
      data: subjects.map((subject, index) => ({ id: index + 1, name: subject }))
    };
  }
  
  if (lowerMessage.includes('attendance') || lowerMessage.includes('stats')) {
    const avgAttendance = Math.round(mockStudents.reduce((sum, s) => sum + s.attendance_percentage, 0) / mockStudents.length);
    const excellentStudents = mockStudents.filter(s => s.attendance_percentage >= 85).length;
    return {
      id: Date.now().toString(),
      message: `Current Computer Science Department statistics:\n• Average attendance: ${avgAttendance}%\n• Students with excellent attendance (85%+): ${excellentStudents}\n• Total CS students: ${mockStudents.length}\n• Students needing attention: ${mockStudents.filter(s => s.attendance_percentage < 75).length}`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  if (lowerMessage.includes('semester') || lowerMessage.includes('year')) {
    const semesterStats = mockStudents.reduce((acc, student) => {
      const key = `Semester ${student.semester}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(student);
      return acc;
    }, {} as Record<string, typeof mockStudents>);
    
    const statsText = Object.entries(semesterStats)
      .map(([sem, students]) => {
        const avg = Math.round(students.reduce((sum, s) => sum + s.attendance_percentage, 0) / students.length);
        return `${sem}: ${students.length} students, ${avg}% avg attendance`;
      })
      .join('\n');
    
    return {
      id: Date.now().toString(),
      message: `Computer Science Department semester-wise statistics:\n${statsText}`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  // Default response with CS-specific suggestions
  return {
    id: Date.now().toString(),
    message: "I can help you with Computer Science Department queries:\n• Check CS student attendance statistics\n• Find students with low attendance\n• Predict future attendance trends\n• Semester-wise analysis\n• Subject-wise attendance\n• Generate CS department reports\n\nWhat would you like to know about the CS department?",
    sender: 'bot',
    timestamp: new Date().toISOString(),
    type: 'text'
  };
};