import toast from 'react-hot-toast';

export const sendEmailNotification = async (
  to: string,
  subject: string,
  content: string,
  studentData?: any
) => {
  // Simulate email sending
  return new Promise((resolve) => {
    setTimeout(() => {
      toast.success(`Email sent to ${to}`);
      console.log('Email sent:', { to, subject, content, studentData });
      resolve(true);
    }, 1000);
  });
};

export const sendSMSNotification = async (
  to: string,
  message: string,
  studentData?: any
) => {
  // Simulate SMS sending
  return new Promise((resolve) => {
    setTimeout(() => {
      toast.success(`SMS sent to ${to}`);
      console.log('SMS sent:', { to, message, studentData });
      resolve(true);
    }, 1000);
  });
};

export const sendBulkNotifications = async (
  students: any[],
  type: 'email' | 'sms',
  template: string
) => {
  const promises = students.map(student => {
    if (type === 'email') {
      return sendEmailNotification(
        student.parent_email,
        'Attendance Alert - Computer Science Department',
        template.replace('{studentName}', student.name)
          .replace('{attendance}', student.attendance_percentage + '%'),
        student
      );
    } else {
      return sendSMSNotification(
        student.parent_phone,
        template.replace('{studentName}', student.name)
          .replace('{attendance}', student.attendance_percentage + '%'),
        student
      );
    }
  });
  
  await Promise.all(promises);
  toast.success(`${type.toUpperCase()} notifications sent to ${students.length} parents`);
};

export const notificationTemplates = {
  lowAttendance: {
    email: {
      subject: 'Attendance Alert - Computer Science Department',
      content: `Dear Parent,

This is to inform you that your ward {studentName} (Student ID: {studentId}) has low attendance in the Computer Science Department.

Current Attendance: {attendance}
Required Minimum: 75%

Please ensure regular attendance to avoid academic issues.

Best regards,
Computer Science Department`
    },
    sms: {
      content: 'Alert: {studentName} has {attendance} attendance in CS Dept. Minimum required: 75%. Please ensure regular attendance.'
    }
  },
  absentToday: {
    email: {
      subject: 'Absent Today - Computer Science Department',
      content: `Dear Parent,

Your ward {studentName} was absent today ({date}) in the following subjects:
{subjects}

Please ensure regular attendance.

Best regards,
Computer Science Department`
    },
    sms: {
      content: '{studentName} was absent today in CS Dept. Please ensure regular attendance.'
    }
  }
};