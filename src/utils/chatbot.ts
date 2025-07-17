import { ChatMessage } from '../types';
import { mockStudents, mockAttendanceRecords } from './mockData';
import { getCurrentUser } from './auth';

const teacherResponses = {
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
  const user = getCurrentUser();
  
  if (user?.role === 'teacher') {
    return processTeacherMessage(message);
  } else {
    return processStudentMessage(message);
  }
};
const studentResponses = {
  greeting: [
    "Hello! I'm your personal AI study assistant. How can I help you with your Computer Science studies today?",
    "Hi there! I'm here to help you track your progress and improve your academic performance.",
    "Welcome! I can assist you with attendance tracking, study tips, and academic guidance."
  ],
  attendance: [
    "Let me check your current attendance status...",
    "I'll analyze your attendance progress across all subjects.",
    "Fetching your personal attendance data..."
  ],
  improvement: [
    "Here are some personalized tips to improve your attendance and academic performance:",
    "Based on your current progress, I recommend:",
    "To boost your academic success, consider these strategies:"
  ],
  subjects: [
    "Here's information about your Computer Science subjects:",
    "Your current semester subjects include:",
    "Let me show you your subject-wise performance:"
  ],
  study: [
    "Here are some effective study strategies for Computer Science:",
    "To excel in your CS courses, try these proven methods:",
    "Based on successful CS students, here are my recommendations:"
  ]
};
export const processTeacherMessage = (message: string): ChatMessage => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return {
      id: Date.now().toString(),
      message: teacherResponses.greeting[Math.floor(Math.random() * teacherResponses.greeting.length)],
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  if (lowerMessage.includes('defaulter') || lowerMessage.includes('low attendance')) {
    const defaulters = mockStudents.filter(s => s.attendance_percentage < 80);
    return {
      id: Date.now().toString(),
      message: teacherResponses.defaulters[Math.floor(Math.random() * teacherResponses.defaulters.length)],
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
      message: `${teacherResponses.prediction[Math.floor(Math.random() * teacherResponses.prediction.length)]} The overall CS department attendance is likely to be ${prediction}% next week based on current patterns and historical data.`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  if (lowerMessage.includes('subject') || lowerMessage.includes('course')) {
    const subjects = ['Data Structures', 'Database Management', 'Web Development', 'Machine Learning', 'Software Engineering'];
    return {
      id: Date.now().toString(),
      message: teacherResponses.subjects[Math.floor(Math.random() * teacherResponses.subjects.length)],
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
  
  if (lowerMessage.includes('report') || lowerMessage.includes('generate')) {
    return {
      id: Date.now().toString(),
      message: "I can help you generate various reports:\n• Attendance summary reports\n• Defaulter lists\n• Subject-wise performance\n• Semester comparisons\n• Parent notification lists\n\nWhich type of report would you like me to prepare?",
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
export const processStudentMessage = (message: string): ChatMessage => {
  const lowerMessage = message.toLowerCase();
  const user = getCurrentUser();
  const currentStudent = mockStudents.find(s => s.student_id === user?.student_id) || mockStudents[0];
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return {
      id: Date.now().toString(),
      message: studentResponses.greeting[Math.floor(Math.random() * studentResponses.greeting.length)],
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  if (lowerMessage.includes('attendance') || lowerMessage.includes('my attendance')) {
    return {
      id: Date.now().toString(),
      message: `Your current attendance status:\n• Overall Attendance: ${currentStudent.attendance_percentage}%\n• Classes Attended: ${currentStudent.attended_classes}/${currentStudent.total_classes}\n• Status: ${currentStudent.attendance_percentage >= 75 ? '✅ Above minimum requirement' : '⚠️ Below minimum requirement'}\n\n${currentStudent.attendance_percentage < 75 ? 'You need to improve your attendance to meet the 75% requirement.' : 'Great job maintaining good attendance!'}`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  if (lowerMessage.includes('improve') || lowerMessage.includes('help')) {
    const tips = [
      "Set daily alarms for all your classes",
      "Create a study schedule and stick to it",
      "Join study groups with classmates",
      "Attend office hours for extra help",
      "Use the Pomodoro technique for better focus",
      "Take regular breaks to avoid burnout"
    ];
    
    return {
      id: Date.now().toString(),
      message: `${studentResponses.improvement[Math.floor(Math.random() * studentResponses.improvement.length)]}\n\n${tips.slice(0, 4).map((tip, i) => `${i + 1}. ${tip}`).join('\n')}\n\nWould you like more specific advice for any subject?`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  if (lowerMessage.includes('progress') || lowerMessage.includes('performance')) {
    const subjects = ['Data Structures', 'Database Management', 'Web Development', 'Machine Learning', 'Software Engineering'];
    const subjectProgress = subjects.map(subject => ({
      name: subject,
      attendance: Math.round(75 + Math.random() * 20)
    }));
    
    return {
      id: Date.now().toString(),
      message: "Here's your subject-wise progress:",
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'list',
      data: subjectProgress
    };
  }
  
  if (lowerMessage.includes('study') || lowerMessage.includes('tips') || lowerMessage.includes('cs')) {
    return {
      id: Date.now().toString(),
      message: `${studentResponses.study[Math.floor(Math.random() * studentResponses.study.length)]}\n\n📚 For Computer Science:\n• Practice coding daily (30-60 minutes)\n• Work on projects to apply concepts\n• Join coding communities and forums\n• Review lecture notes within 24 hours\n• Solve problems on platforms like LeetCode\n• Collaborate on group projects\n\n💡 Remember: Consistency is key to success in CS!`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  if (lowerMessage.includes('subject') || lowerMessage.includes('course')) {
    const subjects = ['Data Structures', 'Database Management', 'Web Development', 'Machine Learning', 'Software Engineering'];
    return {
      id: Date.now().toString(),
      message: studentResponses.subjects[Math.floor(Math.random() * studentResponses.subjects.length)],
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'list',
      data: subjects.map((subject, index) => ({ id: index + 1, name: subject }))
    };
  }
  
  // Default response for students
  return {
    id: Date.now().toString(),
    message: "I'm here to help you succeed in your Computer Science studies! I can assist with:\n\n📊 Track your attendance progress\n📚 Provide study tips and strategies\n🎯 Help you set academic goals\n📈 Show your performance trends\n💡 Answer questions about your courses\n🤝 Suggest ways to improve\n\nWhat would you like to know about your academic journey?",
    sender: 'bot',
    timestamp: new Date().toISOString(),
    type: 'text'
  };
};