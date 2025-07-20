import { ChatMessage } from '../types';
import { mockStudents, mockAttendanceRecords } from './mockData';
import { getCurrentUser } from './auth';

const teacherResponses = {
  greeting: [
    "Hello! I'm your AI Teaching Assistant for the Computer Science Department. I provide advanced analytics, predictive insights, and actionable recommendations to help you manage student success effectively.",
    "Hi there! I'm equipped with machine learning algorithms to analyze attendance patterns, identify at-risk students, and suggest intervention strategies for the CS department.",
    "Welcome! I'm your intelligent teaching companion, ready to help you make data-driven decisions for student success in Computer Science."
  ],
  attendance: [
    "Analyzing comprehensive attendance data across all CS semesters and subjects...",
    "Processing real-time attendance metrics with trend analysis...",
    "Generating intelligent insights from CS department attendance patterns..."
  ],
  defaulters: [
    "I've identified CS students requiring immediate intervention based on attendance patterns and risk factors:",
    "Using predictive analytics, here are students at risk of academic failure due to poor attendance:",
    "My analysis shows these Computer Science students need urgent attention:"
  ],
  prediction: [
    "Based on historical data, current trends, and behavioral patterns, my predictive model forecasts:",
    "Using advanced machine learning algorithms analyzing CS department data over multiple semesters:",
    "My AI-powered prediction engine, trained on CS student behavior patterns, indicates:"
  ],
  subjects: [
    "Here's a comprehensive analysis of CS subjects with performance metrics:",
    "Current Computer Science curriculum with attendance and performance analytics:",
    "Subject-wise breakdown for CS department with intelligent insights:"
  ],
  reports: [
    "I can generate comprehensive reports with actionable insights:",
    "My advanced analytics can produce detailed reports including:",
    "I'll create intelligent reports with predictive recommendations:"
  ],
  interventions: [
    "Based on my analysis, here are recommended intervention strategies:",
    "My AI suggests these evidence-based approaches for student success:",
    "Intelligent recommendations for improving student outcomes:"
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
    "Hello! I'm your personal AI Study Companion, designed specifically for Computer Science students. I can help you excel academically, track your progress, and provide personalized guidance for your CS journey!",
    "Hi there! I'm your intelligent academic assistant, equipped with CS-specific knowledge and study strategies to help you succeed in your Computer Science program.",
    "Welcome! I'm your AI-powered study buddy, ready to provide personalized insights, study tips, and academic guidance tailored to your CS coursework."
  ],
  attendance: [
    "Analyzing your personal attendance data with intelligent insights...",
    "Processing your attendance patterns across all CS subjects with trend analysis...",
    "Generating personalized attendance report with actionable recommendations..."
  ],
  improvement: [
    "Based on your learning patterns and performance data, here are personalized strategies to boost your success:",
    "My AI analysis of your academic profile suggests these evidence-based improvement techniques:",
    "Using data from successful CS students with similar profiles, I recommend these targeted strategies:"
  ],
  subjects: [
    "Here's an intelligent analysis of your CS subjects with performance insights:",
    "Your current semester subjects with personalized performance analytics:",
    "Subject-wise breakdown with AI-powered recommendations for improvement:"
  ],
  study: [
    "Here are evidence-based study strategies specifically optimized for Computer Science learning:",
    "Based on cognitive science research and successful CS student patterns, I recommend:",
    "My AI analysis of top-performing CS students reveals these effective study methodologies:"
  ],
  career: [
    "Here's personalized career guidance based on your CS academic profile:",
    "My analysis of your strengths suggests these promising CS career paths:",
    "Based on your performance patterns, here are recommended specializations:"
  ],
  motivation: [
    "Here's some personalized motivation based on your progress:",
    "My analysis shows you're on a great path! Here's how to maintain momentum:",
    "Based on your achievements, here's encouragement and next steps:"
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
  
  if (lowerMessage.includes('defaulter') || lowerMessage.includes('low attendance') || lowerMessage.includes('at risk') || lowerMessage.includes('risk')) {
    const defaulters = mockStudents.filter(s => s.attendance_percentage < 80);
    return {
      id: Date.now().toString(),
      message: `${teacherResponses.defaulters[Math.floor(Math.random() * teacherResponses.defaulters.length)]}\n\n📊 Risk Assessment Summary:\n• Critical Risk (< 60%): ${defaulters.filter(s => s.attendance_percentage < 60).length} students\n• High Risk (60-70%): ${defaulters.filter(s => s.attendance_percentage >= 60 && s.attendance_percentage < 70).length} students\n• Moderate Risk (70-80%): ${defaulters.filter(s => s.attendance_percentage >= 70 && s.attendance_percentage < 80).length} students\n\n🎯 Recommended Actions:\n• Schedule immediate parent meetings for critical risk students\n• Implement peer mentoring for high-risk students\n• Provide additional academic support resources`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'list',
      data: defaulters
    };
  }
  
  if (lowerMessage.includes('predict') || lowerMessage.includes('forecast') || lowerMessage.includes('trend')) {
    const prediction = Math.round(75 + Math.random() * 20);
    const trend = Math.random() > 0.5 ? 'improving' : 'declining';
    const confidence = Math.round(85 + Math.random() * 10);
    return {
      id: Date.now().toString(),
      message: `${teacherResponses.prediction[Math.floor(Math.random() * teacherResponses.prediction.length)]}\n\n📈 Predictive Analysis:\n• Expected attendance next week: ${prediction}%\n• Trend direction: ${trend}\n• Confidence level: ${confidence}%\n• Key factors: Weather patterns, exam schedules, holiday proximity\n\n🔮 Long-term Forecast:\n• Month-end projection: ${Math.round(prediction + (Math.random() - 0.5) * 10)}%\n• Semester-end projection: ${Math.round(prediction + (Math.random() - 0.5) * 15)}%\n\n💡 Proactive Recommendations:\n• Schedule engaging activities for predicted low-attendance days\n• Send preventive reminders to at-risk students\n• Coordinate with other departments for optimal scheduling`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  if (lowerMessage.includes('subject') || lowerMessage.includes('course') || lowerMessage.includes('curriculum')) {
    const subjectAnalysis = [
      { name: 'Data Structures', attendance: 88, difficulty: 'High', engagement: 'Good' },
      { name: 'Database Management', attendance: 85, difficulty: 'Medium', engagement: 'Excellent' },
      { name: 'Web Development', attendance: 92, difficulty: 'Medium', engagement: 'Excellent' },
      { name: 'Machine Learning', attendance: 78, difficulty: 'Very High', engagement: 'Good' },
      { name: 'Software Engineering', attendance: 86, difficulty: 'Medium', engagement: 'Good' }
    ];
    return {
      id: Date.now().toString(),
      message: `${teacherResponses.subjects[Math.floor(Math.random() * teacherResponses.subjects.length)]}\n\n📚 Subject Performance Matrix:\n${subjectAnalysis.map(s => `• ${s.name}: ${s.attendance}% attendance (${s.difficulty} difficulty, ${s.engagement} engagement)`).join('\n')}\n\n🎯 Insights:\n• Web Development shows highest engagement and attendance\n• Machine Learning needs attention due to high difficulty\n• Consider interactive teaching methods for complex subjects`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'list',
      data: subjectAnalysis
    };
  }
  
  if (lowerMessage.includes('attendance') || lowerMessage.includes('stats')) {
    const avgAttendance = Math.round(mockStudents.reduce((sum, s) => sum + s.attendance_percentage, 0) / mockStudents.length);
    const excellentStudents = mockStudents.filter(s => s.attendance_percentage >= 85).length;
    const trendDirection = Math.random() > 0.5 ? '📈 +2.3%' : '📉 -1.1%';
    return {
      id: Date.now().toString(),
      message: `${teacherResponses.attendance[Math.floor(Math.random() * teacherResponses.attendance.length)]}\n\n📊 CS Department Analytics Dashboard:\n• Average attendance: ${avgAttendance}% ${trendDirection} from last month\n• High performers (85%+): ${excellentStudents} students (${Math.round(excellentStudents/mockStudents.length*100)}%)\n• Total enrolled: ${mockStudents.length} CS students\n• Requiring intervention: ${mockStudents.filter(s => s.attendance_percentage < 75).length} students\n• Department ranking: Top 3 in university\n\n🏆 Achievements:\n• 15% improvement in overall attendance this semester\n• 90% student satisfaction with CS program\n• Zero dropouts due to attendance issues\n\n⚡ Quick Actions Available:\n• Generate detailed reports\n• Send bulk notifications\n• Schedule parent meetings\n• Create intervention plans`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  if (lowerMessage.includes('report') || lowerMessage.includes('generate') || lowerMessage.includes('analytics')) {
    return {
      id: Date.now().toString(),
      message: `${teacherResponses.reports[Math.floor(Math.random() * teacherResponses.reports.length)]}\n\n📋 Available Report Types:\n\n🎯 Standard Reports:\n• Daily/Weekly/Monthly attendance summaries\n• Student performance analytics\n• Subject-wise attendance breakdown\n• Semester comparison analysis\n• Parent notification lists\n\n🔬 Advanced Analytics:\n• Predictive risk assessment reports\n• Behavioral pattern analysis\n• Intervention effectiveness tracking\n• Correlation analysis (attendance vs grades)\n• Early warning system alerts\n\n📊 Visual Dashboards:\n• Interactive attendance heatmaps\n• Trend analysis charts\n• Performance comparison graphs\n• Real-time monitoring displays\n\n🚀 AI-Powered Insights:\n• Personalized student recommendations\n• Optimal intervention timing\n• Resource allocation suggestions\n• Success probability predictions\n\nWhich type of intelligent report would you like me to generate?",
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  if (lowerMessage.includes('intervention') || lowerMessage.includes('help students') || lowerMessage.includes('improve')) {
    return {
      id: Date.now().toString(),
      message: `${teacherResponses.interventions[Math.floor(Math.random() * teacherResponses.interventions.length)]}\n\n🎯 Tier 1 Interventions (Preventive):\n• Early warning notifications to students\n• Peer mentoring program assignments\n• Study group formations\n• Academic calendar reminders\n\n🔧 Tier 2 Interventions (Targeted):\n• One-on-one counseling sessions\n• Parent-teacher conferences\n• Customized study plans\n• Additional academic support\n\n⚡ Tier 3 Interventions (Intensive):\n• Academic probation protocols\n• Intensive tutoring programs\n• Mental health support referrals\n• Alternative learning pathways\n\n📈 Success Metrics:\n• 85% improvement rate with Tier 1 interventions\n• 70% success rate with Tier 2 approaches\n• 60% recovery rate with Tier 3 intensive support\n\nWould you like me to create personalized intervention plans for specific students?`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }

  if (lowerMessage.includes('notification') || lowerMessage.includes('alert') || lowerMessage.includes('parent')) {
    return {
      id: Date.now().toString(),
      message: "🔔 Smart Notification System:\n\n📧 Automated Alerts:\n• Low attendance warnings (< 75%)\n• Consecutive absence notifications\n• Improvement acknowledgments\n• Weekly progress summaries\n\n👨‍👩‍👧‍👦 Parent Communications:\n• Instant SMS for critical issues\n• Weekly email progress reports\n• Monthly performance summaries\n• Achievement celebrations\n\n🎯 Targeted Messaging:\n• Personalized improvement suggestions\n• Subject-specific recommendations\n• Motivational messages\n• Resource sharing\n\n⚙️ Smart Features:\n• Optimal timing based on response rates\n• Multi-language support\n• Delivery confirmation tracking\n• Response analytics\n\nWould you like me to send notifications to specific students or parents?",
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
      message: `📊 CS Department Semester Analysis:\n\n${statsText}\n\n🔍 Key Insights:\n• Semester 8 shows highest attendance (final year motivation)\n• Semester 6 needs attention (internship conflicts)\n• Consistent performance across Semesters 2 & 4\n\n💡 Recommendations:\n• Implement flexible scheduling for Semester 6\n• Leverage Semester 8 students as mentors\n• Create semester-specific engagement strategies`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  // Default response with CS-specific suggestions
  return {
    id: Date.now().toString(),
    message: "🤖 AI Teaching Assistant Capabilities:\n\n📊 Analytics & Insights:\n• Real-time attendance monitoring\n• Predictive risk assessment\n• Performance trend analysis\n• Behavioral pattern recognition\n\n🎯 Student Management:\n• At-risk student identification\n• Personalized intervention strategies\n• Progress tracking and monitoring\n• Success probability calculations\n\n📋 Reporting & Communication:\n• Automated report generation\n• Parent notification systems\n• Administrative dashboards\n• Compliance documentation\n\n🔮 Predictive Intelligence:\n• Future attendance forecasting\n• Early warning systems\n• Optimal intervention timing\n• Resource allocation optimization\n\n💡 Smart Recommendations:\n• Evidence-based teaching strategies\n• Student engagement techniques\n• Curriculum optimization suggestions\n• Technology integration ideas\n\nWhat specific aspect of CS department management would you like to explore?",
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
  
  if (lowerMessage.includes('attendance') || lowerMessage.includes('my attendance') || lowerMessage.includes('check')) {
    const attendanceStatus = currentStudent.attendance_percentage >= 75 ? 'excellent' : 'needs improvement';
    const daysToImprove = currentStudent.attendance_percentage < 75 ? Math.ceil((75 * currentStudent.total_classes - currentStudent.attended_classes * 100) / 25) : 0;
    return {
      id: Date.now().toString(),
      message: `${studentResponses.attendance[Math.floor(Math.random() * studentResponses.attendance.length)]}\n\n📊 Your Attendance Dashboard:\n• Overall Attendance: ${currentStudent.attendance_percentage}% (${attendanceStatus})\n• Classes Attended: ${currentStudent.attended_classes}/${currentStudent.total_classes}\n• Status: ${currentStudent.attendance_percentage >= 75 ? '✅ Above minimum requirement' : '⚠️ Below minimum requirement'}\n• Department Ranking: ${Math.floor(Math.random() * mockStudents.length) + 1}/${mockStudents.length}\n\n${currentStudent.attendance_percentage < 75 ? `🎯 Improvement Plan:\n• Attend next ${daysToImprove} classes consecutively to reach 75%\n• Set daily reminders for all classes\n• Join study groups for motivation\n• Contact faculty if facing challenges` : '🏆 Excellent Performance!\n• You\'re in the top performers group\n• Keep up the consistent attendance\n• Consider mentoring struggling classmates\n• You\'re on track for academic excellence'}\n\n📈 Trend Analysis:\n• Last week: ${Math.round(currentStudent.attendance_percentage + (Math.random() - 0.5) * 10)}%\n• Monthly average: ${Math.round(currentStudent.attendance_percentage + (Math.random() - 0.5) * 5)}%\n• Semester projection: ${Math.round(currentStudent.attendance_percentage + (Math.random() - 0.5) * 8)}%`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  if (lowerMessage.includes('improve') || lowerMessage.includes('help') || lowerMessage.includes('better') || lowerMessage.includes('tips')) {
    const tips = [
      "🔔 Set smart alarms 30 minutes before each class",
      "📅 Use digital calendars with location-based reminders",
      "👥 Form study accountability groups with classmates",
      "🏫 Attend professor office hours for personalized guidance",
      "⏰ Apply the Pomodoro technique for focused study sessions",
      "🧘 Practice mindfulness to reduce academic stress",
      "📱 Use attendance tracking apps for self-monitoring",
      "🎯 Set weekly attendance goals and track progress"
    ];
    
    return {
      id: Date.now().toString(),
      message: `${studentResponses.improvement[Math.floor(Math.random() * studentResponses.improvement.length)]}\n\n🚀 Personalized Success Strategies:\n\n${tips.slice(0, 6).map((tip, i) => `${i + 1}. ${tip}`).join('\n')}\n\n🎯 CS-Specific Tips:\n• Code daily to build programming muscle memory\n• Participate in coding competitions and hackathons\n• Build a portfolio of projects to showcase skills\n• Join CS communities and forums for peer learning\n• Practice problem-solving on platforms like LeetCode\n\n📊 Success Metrics to Track:\n• Daily class attendance rate\n• Weekly coding practice hours\n• Monthly project completions\n• Semester GPA progression\n\n💡 Pro Tip: Students who follow these strategies show 40% better academic outcomes!\n\nWould you like me to create a personalized study plan for any specific CS subject?`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  if (lowerMessage.includes('progress') || lowerMessage.includes('performance') || lowerMessage.includes('grades') || lowerMessage.includes('subjects')) {
    const subjects = ['Data Structures', 'Database Management', 'Web Development', 'Machine Learning', 'Software Engineering'];
    const subjectProgress = subjects.map(subject => ({
      name: subject,
      attendance: Math.round(75 + Math.random() * 20),
      grade: ['A+', 'A', 'B+', 'B', 'C+'][Math.floor(Math.random() * 5)],
      difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)]
    }));
    
    return {
      id: Date.now().toString(),
      message: `${studentResponses.subjects[Math.floor(Math.random() * studentResponses.subjects.length)]}\n\n📚 Subject Performance Matrix:\n\n${subjectProgress.map(s => `📖 ${s.name}:\n   • Attendance: ${s.attendance}%\n   • Current Grade: ${s.grade}\n   • Difficulty Level: ${s.difficulty}\n   • Recommendation: ${s.attendance < 75 ? 'Focus on attendance' : s.grade.includes('C') ? 'Improve study methods' : 'Maintain excellence'}`).join('\n\n')}\n\n🎯 Overall Analysis:\n• Strongest Subject: ${subjectProgress.reduce((max, s) => s.attendance > max.attendance ? s : max).name}\n• Needs Attention: ${subjectProgress.reduce((min, s) => s.attendance < min.attendance ? s : min).name}\n• Average Performance: ${Math.round(subjectProgress.reduce((sum, s) => sum + s.attendance, 0) / subjectProgress.length)}%\n\n💡 Smart Recommendations:\n• Focus extra effort on challenging subjects\n• Leverage your strengths to help in weaker areas\n• Consider forming study groups for difficult topics\n• Seek additional resources for struggling subjects`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'list',
      data: subjectProgress
    };
  }
  
  if (lowerMessage.includes('study') || lowerMessage.includes('cs') || lowerMessage.includes('computer science') || lowerMessage.includes('programming')) {
    return {
      id: Date.now().toString(),
      message: `${studentResponses.study[Math.floor(Math.random() * studentResponses.study.length)]}\n\n💻 Advanced CS Study Strategies:\n\n🔥 Daily Coding Practice:\n• Dedicate 45-90 minutes to coding daily\n• Solve 2-3 algorithmic problems on LeetCode/HackerRank\n• Practice different programming paradigms\n• Build mini-projects to reinforce concepts\n\n📖 Effective Learning Techniques:\n• Use active recall for theoretical concepts\n• Create visual diagrams for complex algorithms\n• Teach concepts to others (Feynman Technique)\n• Apply spaced repetition for long-term retention\n\n🚀 Project-Based Learning:\n• Build full-stack applications\n• Contribute to open-source projects\n• Create a diverse portfolio on GitHub\n• Document your learning journey through blogs\n\n🤝 Community Engagement:\n• Join CS Discord servers and Reddit communities\n• Attend local tech meetups and conferences\n• Participate in hackathons and coding competitions\n• Find study partners and coding buddies\n\n📊 Performance Optimization:\n• Track your coding progress with metrics\n• Set weekly learning goals and review them\n• Use tools like Anki for memorizing syntax\n• Practice system design for advanced concepts\n\n🎯 Career Preparation:\n• Build projects that solve real-world problems\n• Practice technical interview questions\n• Develop both frontend and backend skills\n• Learn about software engineering best practices\n\n💡 Success Formula: Consistency + Practice + Projects + Community = CS Excellence!`,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('future') || lowerMessage.includes('specialization')) {
    return {
      id: Date.now().toString(),
      message: `${studentResponses.career[Math.floor(Math.random() * studentResponses.career.length)]}\n\n🚀 CS Career Pathways Based on Your Profile:\n\n💻 Software Development:\n• Full-Stack Developer (High demand, great for versatile learners)\n• Mobile App Developer (iOS/Android)\n• DevOps Engineer (Operations + Development)\n• Game Developer (Creative + Technical)\n\n🔬 Specialized Fields:\n• Data Scientist/ML Engineer (Math + Programming)\n• Cybersecurity Specialist (Security + Networks)\n• Cloud Architect (Scalable systems design)\n• AI/ML Research (Advanced algorithms)\n\n🏢 Industry Opportunities:\n• Tech Giants (Google, Microsoft, Amazon, Apple)\n• Startups (High growth potential, diverse roles)\n• Finance (FinTech, algorithmic trading)\n• Healthcare (Health tech, medical software)\n\n📈 Emerging Fields:\n• Blockchain Development\n• IoT (Internet of Things)\n• AR/VR Development\n• Quantum Computing\n\n🎯 Skill Development Roadmap:\n• Master fundamental programming languages\n• Learn system design and architecture\n• Develop problem-solving abilities\n• Build communication and teamwork skills\n• Stay updated with industry trends\n\n💰 Salary Expectations (Entry Level):\n• Software Developer: ₹4-8 LPA\n• Data Scientist: ₹6-12 LPA\n• ML Engineer: ₹8-15 LPA\n• Product Manager: ₹10-18 LPA\n\nWould you like specific guidance for any particular career path?",
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }

  if (lowerMessage.includes('motivation') || lowerMessage.includes('encourage') || lowerMessage.includes('stressed') || lowerMessage.includes('difficult')) {
    const motivationalMessages = [
      "🌟 Every expert was once a beginner. Your CS journey is just getting started!",
      "💪 Debugging code is like solving puzzles - each bug you fix makes you stronger!",
      "🚀 The best programmers aren't those who never fail, but those who learn from every error!",
      "🎯 Your current struggles are building the problem-solving skills that will define your career!",
      "⭐ Remember: Every line of code you write is a step toward your dream tech career!"
    ];
    
    return {
      id: Date.now().toString(),
      message: `${studentResponses.motivation[Math.floor(Math.random() * studentResponses.motivation.length)]}\n\n${motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]}\n\n🏆 Your Achievements So Far:\n• Successfully enrolled in a competitive CS program\n• Building valuable technical skills daily\n• Part of the next generation of tech innovators\n• Developing logical thinking and problem-solving abilities\n\n💡 Remember:\n• Every successful programmer faced the same challenges\n• Consistency beats perfection every time\n• Your unique perspective adds value to the tech world\n• Small daily improvements lead to remarkable results\n\n🎯 Quick Confidence Boosters:\n• Review your completed projects and assignments\n• Connect with classmates facing similar challenges\n• Celebrate small wins and learning milestones\n• Visualize your future success in tech\n\n🤝 Support Resources:\n• Faculty office hours for academic help\n• Peer study groups for collaborative learning\n• Online communities for motivation and tips\n• Career counseling for future planning\n\nYou've got this! Every challenge is making you a better programmer! 💻✨",
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }

  if (lowerMessage.includes('exam') || lowerMessage.includes('test') || lowerMessage.includes('preparation') || lowerMessage.includes('study plan')) {
    return {
      id: Date.now().toString(),
      message: "📚 Smart Exam Preparation Strategy for CS:\n\n🎯 2 Weeks Before Exam:\n• Create comprehensive study schedule\n• Gather all notes, assignments, and resources\n• Form study groups with classmates\n• Identify weak topics for focused review\n\n📖 1 Week Before Exam:\n• Practice coding problems daily\n• Review theoretical concepts with flashcards\n• Solve previous year question papers\n• Clarify doubts with professors\n\n⚡ 3 Days Before Exam:\n• Focus on revision, not new learning\n• Practice time management with mock tests\n• Review important algorithms and data structures\n• Ensure proper rest and nutrition\n\n🔥 Day Before Exam:\n• Light revision of key concepts only\n• Organize exam materials and documents\n• Get adequate sleep (8+ hours)\n• Stay calm and confident\n\n💻 CS-Specific Exam Tips:\n• Practice coding on paper (for written exams)\n• Memorize time complexities of common algorithms\n• Understand concepts, don't just memorize\n• Draw diagrams for complex data structures\n• Practice explaining code logic clearly\n\n🧠 Memory Techniques:\n• Use mnemonics for algorithm steps\n• Create visual associations for concepts\n• Practice active recall regularly\n• Teach concepts to others\n\n⏰ Time Management:\n• Allocate time based on marks distribution\n• Start with questions you're most confident about\n• Leave buffer time for review\n• Don't spend too much time on any single question\n\nYou're well-prepared! Trust your knowledge and stay confident! 🌟",
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
  // Default response for students
  return {
    id: Date.now().toString(),
    message: "🤖 Your AI Study Companion Capabilities:\n\n📊 Academic Analytics:\n• Personal attendance tracking and insights\n• Performance trend analysis across subjects\n• Goal setting and progress monitoring\n• Comparative analysis with peer benchmarks\n\n📚 Learning Support:\n• Personalized study strategies for CS subjects\n• Coding practice recommendations\n• Project ideas and implementation guidance\n• Resource suggestions for skill development\n\n🎯 Success Planning:\n• Career pathway guidance and specialization advice\n• Skill gap analysis and improvement plans\n• Interview preparation and portfolio building\n• Industry trend insights and opportunities\n\n💡 Smart Assistance:\n• Exam preparation strategies and schedules\n• Time management and productivity tips\n• Stress management and motivation support\n• Academic challenge problem-solving\n\n🚀 Growth Tracking:\n• Weekly progress reviews and feedback\n• Achievement recognition and celebration\n• Challenge identification and solutions\n• Future goal planning and roadmapping\n\n🤝 Community Connection:\n• Study group formation suggestions\n• Peer learning opportunities\n• Mentorship program recommendations\n• Professional network building advice\n\n🔥 Specialized CS Help:\n• Programming language learning paths\n• Algorithm and data structure mastery\n• System design understanding\n• Open source contribution guidance\n\nWhat aspect of your Computer Science journey would you like to explore today? I'm here to help you excel! 💻✨",
    sender: 'bot',
    timestamp: new Date().toISOString(),
    type: 'text'
  };
};