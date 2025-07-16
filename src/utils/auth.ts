import { supabase } from '../lib/supabase';
import { User } from '../types';

// Mock users for demo - in production, use Supabase Auth
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'teacher1@csdept.edu',
    name: 'Dr. Rajesh Kumar',
    role: 'teacher',
    department: 'Computer Science',
    employee_id: 'CS001',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '2',
    email: 'teacher2@csdept.edu',
    name: 'Prof. Priya Sharma',
    role: 'teacher',
    department: 'Computer Science',
    employee_id: 'CS002',
    avatar: 'https://images.pexels.com/photos/3771788/pexels-photo-3771788.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '3',
    email: 'student1@csdept.edu',
    name: 'Arjun Patel',
    role: 'student',
    department: 'Computer Science',
    student_id: 'CS2021001',
    semester: 6,
    year: 2024,
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '4',
    email: 'student2@csdept.edu',
    name: 'Sneha Reddy',
    role: 'student',
    department: 'Computer Science',
    student_id: 'CS2021002',
    semester: 6,
    year: 2024,
    avatar: 'https://images.pexels.com/photos/3307758/pexels-photo-3307758.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  }
];

export const login = async (email: string, password: string): Promise<User | null> => {
  // Demo: password is always 'password'
  if (password !== 'password') return null;
  
  const user = DEMO_USERS.find(u => u.email === email);
  return user || null;
};

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

export const logout = (): void => {
  setCurrentUser(null);
};

// Supabase Auth functions (for production)
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};