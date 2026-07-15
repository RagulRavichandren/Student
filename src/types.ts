export interface Student {
  id: string;
  roll: string;
  name: string;
  cls: string;
}

export type AttendanceStatus = 'present' | 'late' | 'absent';

// Key: student.id, Value: AttendanceStatus
export type DailyRecord = Record<string, AttendanceStatus>;

// Key: date string (YYYY-MM-DD), Value: DailyRecord
export type AttendanceRecords = Record<string, DailyRecord>;
