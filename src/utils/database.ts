import { supabase } from '../lib/supabase';
import { Student, AttendanceRecord, Teacher, Subject } from '../types';

// Students
export const getStudents = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
};

export const createStudent = async (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('students')
    .insert([student])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateStudent = async (id: string, updates: Partial<Student>) => {
  const { data, error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteStudent = async (id: string) => {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Attendance
export const getAttendanceRecords = async (filters?: {
  student_id?: string;
  date?: string;
  subject?: string;
  semester?: number;
  year?: number;
}) => {
  let query = supabase
    .from('attendance_records')
    .select(`
      *,
      students (name, student_id, semester, year, section),
      teachers (name, employee_id)
    `);

  if (filters?.student_id) query = query.eq('student_id', filters.student_id);
  if (filters?.date) query = query.eq('date', filters.date);
  if (filters?.subject) query = query.eq('subject', filters.subject);
  if (filters?.semester) query = query.eq('semester', filters.semester);
  if (filters?.year) query = query.eq('year', filters.year);

  const { data, error } = await query.order('date', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const markAttendance = async (records: Omit<AttendanceRecord, 'id' | 'created_at'>[]) => {
  const { data, error } = await supabase
    .from('attendance_records')
    .insert(records)
    .select();
  
  if (error) throw error;
  return data;
};

// Teachers
export const getTeachers = async () => {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
};

export const createTeacher = async (teacher: Omit<Teacher, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('teachers')
    .insert([teacher])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Subjects
export const getSubjects = async () => {
  const { data, error } = await supabase
    .from('subjects')
    .select(`
      *,
      teachers (name, employee_id)
    `)
    .order('semester', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createSubject = async (subject: Omit<Subject, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('subjects')
    .insert([subject])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Analytics
export const getAttendanceAnalytics = async () => {
  const { data: totalStudents } = await supabase
    .from('students')
    .select('id', { count: 'exact' });

  const { data: todayAttendance } = await supabase
    .from('attendance_records')
    .select('status')
    .eq('date', new Date().toISOString().split('T')[0]);

  const { data: defaulters } = await supabase
    .from('students')
    .select('*')
    .lt('attendance_percentage', 75);

  return {
    totalStudents: totalStudents?.length || 0,
    presentToday: todayAttendance?.filter(r => r.status === 'present').length || 0,
    absentToday: todayAttendance?.filter(r => r.status === 'absent').length || 0,
    defaulters: defaulters?.length || 0
  };
};