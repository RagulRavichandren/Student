import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Check, Save, Sparkles, UserCheck, AlertTriangle } from 'lucide-react';
import { Student, AttendanceRecords, AttendanceStatus, DailyRecord } from '../types';
import LedgerCard from './LedgerCard';

interface AttendancePanelProps {
  students: Student[];
  records: AttendanceRecords;
  onSaveRecords: (updatedRecords: AttendanceRecords) => void;
}

export default function AttendancePanel({
  students,
  records,
  onSaveRecords,
}: AttendancePanelProps) {
  // Helper to get formatted date string: YYYY-MM-DD
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [currentDayRecord, setCurrentDayRecord] = useState<DailyRecord>({});
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  // Load attendance record for the selected date
  useEffect(() => {
    const dayRecord = records[selectedDate] || {};
    setCurrentDayRecord(dayRecord);
  }, [selectedDate, records]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setCurrentDayRecord((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: DailyRecord = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setCurrentDayRecord(updated);
  };

  const handleSave = () => {
    const updatedRecords = {
      ...records,
      [selectedDate]: currentDayRecord,
    };
    onSaveRecords(updatedRecords);
    
    // Play saved success chime animation
    setShowSavedMsg(true);
    setTimeout(() => {
      setShowSavedMsg(false);
    }, 2500);
  };

  // Sort students by roll number numerically
  const sortedStudents = [...students].sort((a, b) => {
    return a.roll.localeCompare(b.roll, undefined, { numeric: true });
  });

  // Calculate quick attendance stats for the active day
  const presentCount = Object.values(currentDayRecord).filter((v) => v === 'present').length;
  const lateCount = Object.values(currentDayRecord).filter((v) => v === 'late').length;
  const absentCount = Object.values(currentDayRecord).filter((v) => v === 'absent').length;
  const unmarkedCount = students.length - Object.keys(currentDayRecord).length;

  return (
    <div className="space-y-6">
      <LedgerCard badge="Daily Roll Call">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-dashed border-ledger-line">
          <div className="flex items-center gap-3">
            <div className="bg-ledger-bg2 text-ledger-chalk p-2 rounded-md shadow-md">
              <Calendar className="w-5 h-5 text-ledger-accent" />
            </div>
            <div>
              <label htmlFor="att-date" className="block text-[10px] font-bold uppercase tracking-wider text-ledger-ink-soft">
                Register Date
              </label>
              <input
                type="date"
                id="att-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent font-serif font-bold text-lg text-ledger-ink border-b border-ledger-line focus:border-ledger-present focus:outline-none py-0.5 cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Mark Toolbar */}
          {students.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ledger-ink-soft mr-2">
                Batch Stamp:
              </span>
              <button
                type="button"
                onClick={() => handleMarkAll('present')}
                className="text-xs font-semibold px-3 py-1.5 rounded bg-ledger-present/10 hover:bg-ledger-present/20 border border-ledger-present/30 text-ledger-present transition-all cursor-pointer"
              >
                All Present
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('absent')}
                className="text-xs font-semibold px-3 py-1.5 rounded bg-ledger-absent/10 hover:bg-ledger-absent/20 border border-ledger-absent/30 text-ledger-absent transition-all cursor-pointer"
              >
                All Absent
              </button>
            </div>
          )}
        </div>

        {students.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-ledger-line/50 rounded-lg">
            <AlertTriangle className="w-10 h-10 text-ledger-accent/70 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-semibold text-ledger-ink">No Students in Roster</h3>
            <p className="text-sm text-ledger-ink-soft max-w-sm mx-auto mt-1">
              Please go to the <strong>Roster</strong> tab to add students before taking attendance.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Table Header for visual rhythm */}
            <div className="hidden md:flex items-center justify-between px-4 py-2 border-b-2 border-ledger-ink text-[11px] font-bold uppercase tracking-wider text-ledger-ink-soft mb-2">
              <span>Student Details</span>
              <span className="pr-20">Attendance Status (Stamp)</span>
            </div>

            {/* Students List */}
            <div className="divide-y divide-dashed divide-ledger-line/70">
              {sortedStudents.map((student) => {
                const currentStatus = currentDayRecord[student.id];
                return (
                  <div
                    key={student.id}
                    className="flex flex-col md:flex-row md:items-center justify-between py-4 px-2 hover:bg-black/[0.02] rounded-md transition-colors gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="font-mono text-xs font-bold text-ledger-ink-soft bg-black/5 px-2 py-0.5 rounded border border-ledger-line/20 mt-0.5">
                        {student.roll}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-[16px] text-ledger-ink leading-tight">
                          {student.name}
                        </h4>
                        <p className="font-mono text-xs text-ledger-ink-soft mt-0.5">
                          Class {student.cls || '—'}
                        </p>
                      </div>
                    </div>

                    {/* Tactile Stamp Selector */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.93, rotate: -2 }}
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'present')}
                        className={`font-mono text-[11px] font-bold uppercase tracking-widest px-3 py-2 rounded-full border-2 transition-all cursor-pointer ${
                          currentStatus === 'present'
                            ? 'bg-ledger-present/15 border-ledger-present text-ledger-present font-semibold shadow-inner -rotate-2'
                            : 'bg-white/40 hover:bg-white/70 border-ledger-line/40 text-ledger-ink-soft'
                        }`}
                      >
                        Present
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.93, rotate: 1.5 }}
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'late')}
                        className={`font-mono text-[11px] font-bold uppercase tracking-widest px-3 py-2 rounded-full border-2 transition-all cursor-pointer ${
                          currentStatus === 'late'
                            ? 'bg-ledger-late/15 border-ledger-late text-ledger-late font-semibold shadow-inner rotate-1'
                            : 'bg-white/40 hover:bg-white/70 border-ledger-line/40 text-ledger-ink-soft'
                        }`}
                      >
                        Late
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.93, rotate: -1.5 }}
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        className={`font-mono text-[11px] font-bold uppercase tracking-widest px-3 py-2 rounded-full border-2 transition-all cursor-pointer ${
                          currentStatus === 'absent'
                            ? 'bg-ledger-absent/15 border-ledger-absent text-ledger-absent font-semibold shadow-inner -rotate-1'
                            : 'bg-white/40 hover:bg-white/70 border-ledger-line/40 text-ledger-ink-soft'
                        }`}
                      >
                        Absent
                      </motion.button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions and Stats summary */}
            <div className="mt-8 pt-6 border-t border-ledger-ink flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap gap-4 text-xs font-mono text-ledger-ink-soft">
                <span>
                  Present: <strong className="text-ledger-present">{presentCount}</strong>
                </span>
                <span>
                  Late: <strong className="text-ledger-late">{lateCount}</strong>
                </span>
                <span>
                  Absent: <strong className="text-ledger-absent">{absentCount}</strong>
                </span>
                {unmarkedCount > 0 && (
                  <span className="text-ledger-ink/70">
                    Unmarked: <strong className="font-bold">{unmarkedCount}</strong>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <AnimatePresence>
                  {showSavedMsg && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-semibold text-ledger-present flex items-center gap-1 bg-ledger-present/10 px-2.5 py-1 rounded border border-ledger-present/20"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Register Saved ✓</span>
                    </motion.span>
                  )}
                </AnimatePresence>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-ledger-ink hover:bg-ledger-ink-soft text-ledger-paper font-semibold py-2 px-5 rounded-md shadow hover:shadow-md transition-all text-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Register</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </LedgerCard>
    </div>
  );
}
