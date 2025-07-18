import { Student, AttendanceRecord, Teacher, Subject } from '../types';
import { format, subDays } from 'date-fns';

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Arjun Patel',
    email: 'arjun.patel@csdept.edu',
    student_id: 'CS2021001',
    semester: 6,
    year: 2024,
    section: 'A',
    parent_email: 'arjun.parent@email.com',
    parent_phone: '+91-9876543210',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    total_classes: 120,
    attended_classes: 102,
    attendance_percentage: 85
  },
  {
    id: '2',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@csdept.edu',
    student_id: 'CS2021002',
    semester: 6,
    year: 2024,
    section: 'A',
    parent_email: 'sneha.parent@email.com',
    parent_phone: '+91-9876543211',
    avatar: 'https://images.pexels.com/photos/3307758/pexels-photo-3307758.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    total_classes: 120,
    attended_classes: 110,
    attendance_percentage: 92
  },
  {
    id: '3',
    name: 'Rahul Singh',
    email: 'rahul.singh@csdept.edu',
    student_id: 'CS2021003',
    semester: 6,
    year: 2024,
    section: 'B',
    parent_email: 'rahul.parent@email.com',
    parent_phone: '+91-9876543212',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    total_classes: 120,
    attended_classes: 78,
    attendance_percentage: 65
  },
  {
    id: '4',
    name: 'Priya Gupta',
    email: 'priya.gupta@csdept.edu',
    student_id: 'CS2021004',
    semester: 6,
    year: 2024,
    section: 'A',
    parent_email: 'priya.parent@email.com',
    parent_phone: '+91-9876543213',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    total_classes: 120,
    attended_classes: 94,
    attendance_percentage: 78
  },
  {
    id: '5',
    name: 'Vikram Joshi',
    email: 'vikram.joshi@csdept.edu',
    student_id: 'CS2021005',
    semester: 6,
    year: 2024,
    section: 'B',
    parent_email: 'vikram.parent@email.com',
    parent_phone: '+91-9876543214',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    total_classes: 120,
    attended_classes: 114,
    attendance_percentage: 95
  },
  {
    id: '6',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@csdept.edu',
    student_id: 'CS2021006',
    semester: 4,
    year: 2024,
    section: 'A',
    parent_email: 'ananya.parent@email.com',
    parent_phone: '+91-9876543215',
    avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    total_classes: 100,
    attended_classes: 88,
    attendance_percentage: 88
  },
  {
    id: '7',
    name: 'Karthik Menon',
    email: 'karthik.menon@csdept.edu',
    student_id: 'CS2022007',
    semester: 4,
    year: 2024,
    section: 'B',
    parent_email: 'karthik.parent@email.com',
    parent_phone: '+91-9876543216',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    total_classes: 100,
    attended_classes: 82,
    attendance_percentage: 82
  },
  {
    id: '8',
    name: 'Divya Nair',
    email: 'divya.nair@csdept.edu',
    student_id: 'CS2022008',
    semester: 4,
    year: 2024,
    section: 'A',
    parent_email: 'divya.parent@email.com',
    parent_phone: '+91-9876543217',
    avatar: 'https://images.pexels.com/photos/3771788/pexels-photo-3771788.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    total_classes: 100,
    attended_classes: 91,
    attendance_percentage: 91
  },
  {
    id: '9',
    name: 'Rohan Kumar',
    email: 'rohan.kumar@csdept.edu',
    student_id: 'CS2023009',
    semester: 2,
    year: 2024,
    section: 'A',
    parent_email: 'rohan.parent@email.com',
    parent_phone: '+91-9876543218',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    total_classes: 80,
    attended_classes: 72,
    attendance_percentage: 90
  },
  {
    id: '10',
    name: 'Meera Shah',
    email: 'meera.shah@csdept.edu',
    student_id: 'CS2023010',
    semester: 2,
    year: 2024,
    section: 'B',
    parent_email: 'meera.parent@email.com',
    parent_phone: '+91-9876543219',
    avatar: 'https://images.pexels.com/photos/3307758/pexels-photo-3307758.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    total_classes: 80,
    attended_classes: 76,
    attendance_percentage: 95
  }
];

export const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@csdept.edu',
    employee_id: 'CS001',
    subjects: ['Data Structures', 'Algorithms', 'Database Management Systems'],
    semesters: [4, 6],
    sections: ['A', 'B'],
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '2',
    name: 'Prof. Priya Sharma',
    email: 'priya.sharma@csdept.edu',
    employee_id: 'CS002',
    subjects: ['Web Development', 'Software Engineering', 'Computer Networks'],
    semesters: [4, 6, 8],
    sections: ['A', 'B'],
    avatar: 'https://images.pexels.com/photos/3771788/pexels-photo-3771788.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '3',
    name: 'Dr. Amit Verma',
    email: 'amit.verma@csdept.edu',
    employee_id: 'CS003',
    subjects: ['Machine Learning', 'Artificial Intelligence', 'Data Mining'],
    semesters: [6, 8],
    sections: ['A', 'B'],
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '4',
    name: 'Dr. Sunita Rao',
    email: 'sunita.rao@csdept.edu',
    employee_id: 'CS004',
    subjects: ['Operating Systems', 'Computer Architecture', 'System Programming'],
    semesters: [4, 6],
    sections: ['A', 'B'],
    avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '5',
    name: 'Prof. Vikash Singh',
    email: 'vikash.singh@csdept.edu',
    employee_id: 'CS005',
    subjects: ['Programming Fundamentals', 'Object Oriented Programming', 'Data Structures'],
    semesters: [2, 4],
    sections: ['A', 'B'],
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  }
];

export const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Programming Fundamentals',
    code: 'CS201',
    semester: 2,
    credits: 4,
    teacher_id: '5'
  },
  {
    id: '2',
    name: 'Object Oriented Programming',
    code: 'CS202',
    semester: 2,
    credits: 4,
    teacher_id: '5'
  },
  {
    id: '3',
    name: 'Data Structures',
    code: 'CS401',
    semester: 4,
    credits: 4,
    teacher_id: '1'
  },
  {
    id: '4',
    name: 'Algorithms',
    code: 'CS402',
    semester: 4,
    credits: 4,
    teacher_id: '1'
  },
  {
    id: '5',
    name: 'Operating Systems',
    code: 'CS403',
    semester: 4,
    credits: 4,
    teacher_id: '4'
  },
  {
    id: '6',
    name: 'Computer Networks',
    code: 'CS404',
    semester: 4,
    credits: 3,
    teacher_id: '2'
  },
  {
    id: '7',
    name: 'Database Management Systems',
    code: 'CS601',
    semester: 6,
    credits: 4,
    teacher_id: '1'
  },
  {
    id: '8',
    name: 'Web Development',
    code: 'CS602',
    semester: 6,
    credits: 3,
    teacher_id: '2'
  },
  {
    id: '9',
    name: 'Software Engineering',
    code: 'CS603',
    semester: 6,
    credits: 4,
    teacher_id: '2'
  },
  {
    id: '10',
    name: 'Machine Learning',
    code: 'CS604',
    semester: 6,
    credits: 4,
    teacher_id: '3'
  },
  {
    id: '11',
    name: 'Computer Architecture',
    code: 'CS605',
    semester: 6,
    credits: 3,
    teacher_id: '4'
  },
  {
    id: '12',
    name: 'Artificial Intelligence',
    code: 'CS801',
    semester: 8,
    credits: 4,
    teacher_id: '3'
  },
  {
    id: '13',
    name: 'Data Mining',
    code: 'CS802',
    semester: 8,
    credits: 3,
    teacher_id: '3'
  },
  {
    id: '14',
    name: 'System Programming',
    code: 'CS803',
    semester: 8,
    credits: 4,
    teacher_id: '4'
  }
];

const generateAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const subjects = mockSubjects.map(s => s.name);
  
  mockStudents.forEach(student => {
    for (let i = 0; i < 30; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      
      // Get subjects for student's semester
      const studentSubjects = mockSubjects.filter(s => s.semester === student.semester);
      
      studentSubjects.forEach(subject => {
        const attendance = Math.random();
        let status: 'present' | 'absent' | 'late';
        
        if (attendance > 0.85) status = 'present';
        else if (attendance > 0.75) status = 'late';
        else status = 'absent';

        records.push({
          id: `${student.id}-${subject.id}-${date}`,
          student_id: student.id,
          date,
          subject: subject.name,
          status,
          teacher_id: subject.teacher_id,
          semester: student.semester,
          year: student.year,
          section: student.section,
          timestamp: new Date().toISOString()
        });
      });
    }
  });
  
  return records;
};

export const mockAttendanceRecords = generateAttendanceRecords();