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

// Enhanced knowledge base for accurate responses
const knowledgeBase = {
  computerScience: {
    fundamentals: {
      dataStructures: "Data structures are ways of organizing and storing data to enable efficient access and modification. Key types include arrays, linked lists, stacks, queues, trees, graphs, and hash tables.",
      algorithms: "Algorithms are step-by-step procedures for solving problems. Important categories include sorting (quicksort, mergesort), searching (binary search), graph algorithms (DFS, BFS), and dynamic programming.",
      complexity: "Time and space complexity measure algorithm efficiency. Big O notation describes worst-case performance: O(1) constant, O(log n) logarithmic, O(n) linear, O(n²) quadratic.",
      programming: "Programming involves writing instructions for computers using languages like Python, Java, C++, JavaScript. Key concepts include variables, functions, loops, conditionals, and object-oriented programming."
    },
    subjects: {
      webDevelopment: "Web development involves creating websites and web applications using HTML, CSS, JavaScript for frontend, and technologies like Node.js, Python, PHP for backend.",
      databases: "Database management systems (DBMS) store and organize data. SQL is used for relational databases like MySQL, PostgreSQL. NoSQL databases include MongoDB, Redis.",
      networking: "Computer networks connect devices to share resources. Key concepts include TCP/IP, HTTP/HTTPS, DNS, routing, switching, and network security.",
      operatingSystems: "Operating systems manage computer hardware and software resources. Topics include process management, memory management, file systems, and scheduling algorithms.",
      softwareEngineering: "Software engineering applies engineering principles to software development. Includes requirements analysis, design patterns, testing, version control, and project management."
    },
    careers: {
      softwareDeveloper: "Software developers create applications and systems. Average salary: ₹4-12 LPA. Skills needed: programming languages, problem-solving, debugging, version control.",
      dataScientist: "Data scientists analyze data to extract insights. Average salary: ₹6-15 LPA. Skills: Python/R, statistics, machine learning, data visualization.",
      cybersecurity: "Cybersecurity specialists protect systems from threats. Average salary: ₹5-18 LPA. Skills: network security, ethical hacking, risk assessment, compliance.",
      productManager: "Product managers guide product development. Average salary: ₹8-25 LPA. Skills: strategy, communication, analytics, user experience design."
    }
  },
  studyTips: {
    programming: [
      "Practice coding daily for at least 1-2 hours",
      "Start with simple problems and gradually increase complexity",
      "Read and understand others' code to learn different approaches",
      "Build projects to apply theoretical knowledge practically",
      "Use debugging tools to understand how code executes",
      "Comment your code to improve readability and understanding"
    ],
    theory: [
      "Use active recall instead of passive reading",
      "Create mind maps for complex topics",
      "Teach concepts to others to reinforce understanding",
      "Practice with past exam papers and assignments",
      "Form study groups for collaborative learning",
      "Take regular breaks using the Pomodoro technique"
    ],
    examPrep: [
      "Start preparation at least 2 weeks before exams",
      "Create a study schedule and stick to it",
      "Focus on understanding concepts, not memorization",
      "Practice coding problems on paper for written exams",
      "Review and summarize notes regularly",
      "Get adequate sleep and maintain good health"
    ]
  }
};

// Enhanced response processing with better accuracy
export const processMessage = (message: string): ChatMessage => {
  const user = getCurrentUser();
  
  if (user?.role === 'teacher') {
    return processTeacherMessage(message);
  } else {
    return processStudentMessage(message);
  }
};

const getAccurateResponse = (query: string, context: 'teacher' | 'student'): string => {
  const lowerQuery = query.toLowerCase();
  
  // Programming and CS fundamentals
  if (lowerQuery.includes('data structure') || lowerQuery.includes('array') || lowerQuery.includes('linked list')) {
    return `📚 Data Structures Explanation:\n\n${knowledgeBase.computerScience.fundamentals.dataStructures}\n\n🔍 Common Data Structures:\n• Arrays: Fixed-size sequential collection\n• Linked Lists: Dynamic size with node connections\n• Stacks: LIFO (Last In, First Out) principle\n• Queues: FIFO (First In, First Out) principle\n• Trees: Hierarchical structure with parent-child relationships\n• Graphs: Nodes connected by edges\n• Hash Tables: Key-value pairs for fast lookup\n\n💡 When to use each:\n• Arrays: When you need fast random access\n• Linked Lists: When frequent insertion/deletion is needed\n• Stacks: For function calls, undo operations\n• Queues: For scheduling, breadth-first search\n• Trees: For hierarchical data, searching\n• Graphs: For networks, relationships\n• Hash Tables: For fast lookups, caching`;
  }
  
  if (lowerQuery.includes('algorithm') || lowerQuery.includes('sorting') || lowerQuery.includes('searching')) {
    return `🔍 Algorithms Explanation:\n\n${knowledgeBase.computerScience.fundamentals.algorithms}\n\n📊 Sorting Algorithms:\n• Bubble Sort: O(n²) - Simple but inefficient\n• Quick Sort: O(n log n) average - Divide and conquer\n• Merge Sort: O(n log n) - Stable, good for large datasets\n• Heap Sort: O(n log n) - In-place sorting\n\n🎯 Searching Algorithms:\n• Linear Search: O(n) - Check each element\n• Binary Search: O(log n) - Requires sorted array\n• Hash Table Search: O(1) average - Using hash functions\n\n⚡ Algorithm Design Techniques:\n• Divide and Conquer: Break problem into smaller parts\n• Dynamic Programming: Store solutions to subproblems\n• Greedy Algorithms: Make locally optimal choices\n• Backtracking: Try all possibilities systematically`;
  }
  
  if (lowerQuery.includes('complexity') || lowerQuery.includes('big o') || lowerQuery.includes('time complexity')) {
    return `⏱️ Time & Space Complexity:\n\n${knowledgeBase.computerScience.fundamentals.complexity}\n\n📈 Common Complexities (from best to worst):\n• O(1) - Constant: Array access, hash table lookup\n• O(log n) - Logarithmic: Binary search, balanced tree operations\n• O(n) - Linear: Linear search, array traversal\n• O(n log n) - Linearithmic: Efficient sorting algorithms\n• O(n²) - Quadratic: Nested loops, bubble sort\n• O(2ⁿ) - Exponential: Recursive fibonacci, subset generation\n\n🎯 How to Calculate:\n1. Count the number of operations\n2. Express as a function of input size (n)\n3. Focus on the fastest-growing term\n4. Drop constants and lower-order terms\n\n💡 Space Complexity:\n• Additional memory used by algorithm\n• Includes variables, data structures, recursion stack\n• Same notation as time complexity`;
  }
  
  if (lowerQuery.includes('web development') || lowerQuery.includes('html') || lowerQuery.includes('css') || lowerQuery.includes('javascript')) {
    return `🌐 Web Development Guide:\n\n${knowledgeBase.computerScience.subjects.webDevelopment}\n\n🎨 Frontend Technologies:\n• HTML: Structure and content of web pages\n• CSS: Styling, layout, and visual design\n• JavaScript: Interactive behavior and dynamic content\n• React/Vue/Angular: Modern frontend frameworks\n• Bootstrap/Tailwind: CSS frameworks for rapid development\n\n⚙️ Backend Technologies:\n• Node.js: JavaScript runtime for server-side development\n• Python (Django/Flask): Powerful backend frameworks\n• Java (Spring): Enterprise-level web applications\n• PHP: Server-side scripting language\n• Databases: MySQL, PostgreSQL, MongoDB\n\n🚀 Full-Stack Development Path:\n1. Master HTML, CSS, JavaScript fundamentals\n2. Learn a frontend framework (React recommended)\n3. Understand backend concepts and choose a technology\n4. Learn database design and management\n5. Practice with real projects and deploy them\n6. Learn version control (Git) and deployment\n\n💼 Career Opportunities:\n• Frontend Developer: ₹3-10 LPA\n• Backend Developer: ₹4-12 LPA\n• Full-Stack Developer: ₹5-15 LPA`;
  }
  
  if (lowerQuery.includes('database') || lowerQuery.includes('sql') || lowerQuery.includes('mysql')) {
    return `🗄️ Database Management:\n\n${knowledgeBase.computerScience.subjects.databases}\n\n📊 SQL Fundamentals:\n• SELECT: Retrieve data from tables\n• INSERT: Add new records\n• UPDATE: Modify existing records\n• DELETE: Remove records\n• JOIN: Combine data from multiple tables\n• GROUP BY: Aggregate data\n• ORDER BY: Sort results\n\n🔗 Types of Joins:\n• INNER JOIN: Records matching in both tables\n• LEFT JOIN: All records from left table\n• RIGHT JOIN: All records from right table\n• FULL OUTER JOIN: All records from both tables\n\n🏗️ Database Design Principles:\n• Normalization: Reduce data redundancy\n• Primary Keys: Unique identifiers\n• Foreign Keys: Maintain referential integrity\n• Indexes: Improve query performance\n• ACID Properties: Atomicity, Consistency, Isolation, Durability\n\n💡 NoSQL vs SQL:\n• SQL: Structured, ACID compliant, complex queries\n• NoSQL: Flexible schema, horizontal scaling, big data`;
  }
  
  if (lowerQuery.includes('career') || lowerQuery.includes('job') || lowerQuery.includes('salary')) {
    return `💼 CS Career Guidance:\n\n🚀 Top Career Paths:\n\n1. Software Developer:\n${knowledgeBase.computerScience.careers.softwareDeveloper}\n\n2. Data Scientist:\n${knowledgeBase.computerScience.careers.dataScientist}\n\n3. Cybersecurity Specialist:\n${knowledgeBase.computerScience.careers.cybersecurity}\n\n4. Product Manager:\n${knowledgeBase.computerScience.careers.productManager}\n\n🎯 How to Prepare:\n• Build a strong portfolio of projects\n• Contribute to open-source projects\n• Practice coding interviews (LeetCode, HackerRank)\n• Develop soft skills (communication, teamwork)\n• Stay updated with industry trends\n• Network with professionals in your field\n\n📈 Salary Growth Factors:\n• Technical skills and expertise\n• Years of experience\n• Company size and location\n• Specialization and domain knowledge\n• Leadership and management skills`;
  }
  
  if (lowerQuery.includes('study') || lowerQuery.includes('how to learn') || lowerQuery.includes('tips')) {
    const tips = context === 'student' ? knowledgeBase.studyTips.programming : knowledgeBase.studyTips.theory;
    return `📚 Effective Study Strategies:\n\n💻 Programming Study Tips:\n${knowledgeBase.studyTips.programming.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}\n\n📖 Theory Study Tips:\n${knowledgeBase.studyTips.theory.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}\n\n🎯 Exam Preparation:\n${knowledgeBase.studyTips.examPrep.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}\n\n⏰ Time Management:\n• Use the Pomodoro Technique (25 min study, 5 min break)\n• Prioritize tasks using the Eisenhower Matrix\n• Set specific, measurable goals\n• Track your progress regularly\n• Eliminate distractions during study time`;
  }
  
  // Math and logic questions
  if (lowerQuery.includes('what is') && (lowerQuery.includes('fibonacci') || lowerQuery.includes('factorial'))) {
    if (lowerQuery.includes('fibonacci')) {
      return `🔢 Fibonacci Sequence:\n\nThe Fibonacci sequence is a series where each number is the sum of the two preceding ones: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...\n\n📝 Mathematical Definition:\nF(0) = 0\nF(1) = 1\nF(n) = F(n-1) + F(n-2) for n > 1\n\n💻 Implementation:\n\n**Recursive (Simple but inefficient):**\n\`\`\`python\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\`\`\`\n\n**Iterative (Efficient):**\n\`\`\`python\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b\n\`\`\`\n\n⚡ Time Complexity:\n• Recursive: O(2ⁿ) - Exponential\n• Iterative: O(n) - Linear\n• Dynamic Programming: O(n) - Linear\n\n🌟 Applications:\n• Nature patterns (flower petals, spiral shells)\n• Financial markets (Fibonacci retracement)\n• Computer algorithms and data structures`;
    } else {
      return `🔢 Factorial:\n\nFactorial of n (written as n!) is the product of all positive integers less than or equal to n.\n\n📝 Mathematical Definition:\nn! = n × (n-1) × (n-2) × ... × 2 × 1\n0! = 1 (by definition)\n\n💻 Implementation:\n\n**Recursive:**\n\`\`\`python\ndef factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\`\`\`\n\n**Iterative:**\n\`\`\`python\ndef factorial(n):\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n    return result\n\`\`\`\n\n📊 Examples:\n• 0! = 1\n• 1! = 1\n• 5! = 5 × 4 × 3 × 2 × 1 = 120\n• 10! = 3,628,800\n\n⚡ Time Complexity: O(n)\n🌟 Applications:\n• Permutations and combinations\n• Probability calculations\n• Mathematical analysis`;
    }
  }
  
  // Programming language questions
  if (lowerQuery.includes('python') || lowerQuery.includes('java') || lowerQuery.includes('c++')) {
    return `💻 Programming Languages Comparison:\n\n🐍 Python:\n• Beginner-friendly with simple syntax\n• Great for data science, AI/ML, web development\n• Interpreted language, slower execution\n• Extensive libraries (NumPy, Pandas, Django)\n• Use cases: Data analysis, automation, web backends\n\n☕ Java:\n• Object-oriented, platform-independent\n• Strong type system, good for large applications\n• Compiled to bytecode, runs on JVM\n• Enterprise-level development\n• Use cases: Web applications, Android apps, enterprise software\n\n⚡ C++:\n• Low-level control, high performance\n• Manual memory management\n• Compiled language, very fast execution\n• Complex syntax, steeper learning curve\n• Use cases: System programming, game development, embedded systems\n\n🎯 Which to Choose:\n• **Beginner**: Start with Python\n• **Web Development**: JavaScript, Python, Java\n• **Mobile Apps**: Java/Kotlin (Android), Swift (iOS)\n• **System Programming**: C++, C, Rust\n• **Data Science**: Python, R\n• **Game Development**: C++, C#, Unity`;
  }
  
  return null;
};

export const processTeacherMessage = (message: string): ChatMessage => {
  const lowerMessage = message.toLowerCase();
  
  // Check for accurate responses first
  const accurateResponse = getAccurateResponse(message, 'teacher');
  if (accurateResponse) {
    return {
      id: Date.now().toString(),
      message: accurateResponse,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
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
  
  // Default response with CS-specific suggestions
  return {
    id: Date.now().toString(),
    message: "🤖 I'm your AI Teaching Assistant with comprehensive knowledge. I can help you with:\n\n📊 Department Analytics:\n• Student performance analysis\n• Attendance tracking and predictions\n• Risk assessment and interventions\n\n💻 Computer Science Topics:\n• Programming concepts and algorithms\n• Data structures and complexity analysis\n• Web development and databases\n• Career guidance and industry insights\n\n📚 Educational Support:\n• Teaching strategies and methodologies\n• Student engagement techniques\n• Assessment and evaluation methods\n\n🎯 Ask me anything about:\n• Specific CS concepts or technologies\n• Student management strategies\n• Academic planning and curriculum\n• Industry trends and career paths\n\nWhat would you like to know?",
    sender: 'bot',
    timestamp: new Date().toISOString(),
    type: 'text'
  };
};

export const processStudentMessage = (message: string): ChatMessage => {
  const lowerMessage = message.toLowerCase();
  const user = getCurrentUser();
  const currentStudent = mockStudents.find(s => s.student_id === user?.student_id) || mockStudents[0];
  
  // Check for accurate responses first
  const accurateResponse = getAccurateResponse(message, 'student');
  if (accurateResponse) {
    return {
      id: Date.now().toString(),
      message: accurateResponse,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
  }
  
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
  
  // Default response for students
  return {
    id: Date.now().toString(),
    message: "🤖 I'm your AI Study Companion with comprehensive knowledge! I can help you with:\n\n💻 Computer Science Learning:\n• Programming concepts (Python, Java, C++)\n• Data structures and algorithms\n• Web development and databases\n• Software engineering principles\n\n📚 Academic Success:\n• Study strategies and techniques\n• Exam preparation methods\n• Time management and productivity\n• Career guidance and planning\n\n🎯 Personal Development:\n• Skill assessment and improvement\n• Project ideas and implementation\n• Industry insights and trends\n• Interview preparation\n\n💡 Ask me specific questions like:\n• \"Explain binary search algorithm\"\n• \"How to learn web development?\"\n• \"What is time complexity?\"\n• \"Career options in CS?\"\n• \"How to improve my coding skills?\"\n\nI provide accurate, detailed explanations just like ChatGPT. What would you like to learn today?",
    sender: 'bot',
    timestamp: new Date().toISOString(),
    type: 'text'
  };
};