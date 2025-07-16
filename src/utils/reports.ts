import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Student, AttendanceRecord } from '../types';

export const generatePDFReport = (
  students: Student[],
  title: string = 'Computer Science Department - Attendance Report'
) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
  doc.text(`Total Students: ${students.length}`, 20, 45);
  
  // Table headers
  let yPosition = 60;
  doc.setFontSize(10);
  doc.text('Student ID', 20, yPosition);
  doc.text('Name', 60, yPosition);
  doc.text('Semester', 120, yPosition);
  doc.text('Attendance %', 160, yPosition);
  
  // Table data
  students.forEach((student, index) => {
    yPosition += 10;
    if (yPosition > 280) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.text(student.student_id, 20, yPosition);
    doc.text(student.name.substring(0, 20), 60, yPosition);
    doc.text(student.semester.toString(), 120, yPosition);
    doc.text(`${student.attendance_percentage}%`, 160, yPosition);
  });
  
  doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
};

export const generateExcelReport = (
  students: Student[],
  filename: string = 'CS_Department_Attendance_Report'
) => {
  const worksheet = XLSX.utils.json_to_sheet(
    students.map(student => ({
      'Student ID': student.student_id,
      'Name': student.name,
      'Email': student.email,
      'Semester': student.semester,
      'Year': student.year,
      'Section': student.section,
      'Total Classes': student.total_classes,
      'Attended Classes': student.attended_classes,
      'Attendance Percentage': `${student.attendance_percentage}%`,
      'Parent Email': student.parent_email,
      'Parent Phone': student.parent_phone
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const generateAttendanceReport = (
  records: AttendanceRecord[],
  filename: string = 'CS_Department_Daily_Attendance'
) => {
  const worksheet = XLSX.utils.json_to_sheet(
    records.map(record => ({
      'Date': record.date,
      'Student ID': record.student_id,
      'Subject': record.subject,
      'Status': record.status,
      'Semester': record.semester,
      'Year': record.year,
      'Section': record.section,
      'Timestamp': record.timestamp
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Attendance');
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const generateDefaultersReport = (students: Student[]) => {
  const defaulters = students.filter(s => s.attendance_percentage < 75);
  
  generatePDFReport(
    defaulters,
    'Computer Science Department - Defaulters Report'
  );
  
  generateExcelReport(
    defaulters,
    'CS_Department_Defaulters_Report'
  );
};