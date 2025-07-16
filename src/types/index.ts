export interface User {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'student';
  avatar?: string;
  department?: string;
  employee_id?: string;
  student_id?: string;
  semester?: number;
  year?: number;
  created_at?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  student_id: string;
  semester: number;
  year: number;
  section: string;
  parent_email: string;
  parent_phone: string;
  avatar?: string;
  total_classes: number;
  attended_classes: number;
  attendance_percentage: number;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  subject: string;
  status: 'present' | 'absent' | 'late';
  teacher_id: string;
  semester: number;
  year: number;
  section: string;
  timestamp: string;
  created_at?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  employee_id: string;
  subjects: string[];
  semesters: number[];
  sections: string[];
  avatar?: string;
  created_at?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  semester: number;
  credits: number;
  teacher_id: string;
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: string;
  type?: 'text' | 'chart' | 'list' | 'action';
  data?: any;
}

export interface NotificationTemplate {
  id: string;
  type: 'email' | 'sms';
  subject: string;
  content: string;
  variables: string[];
}