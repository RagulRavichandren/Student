import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileSpreadsheet, TrendingUp, AlertCircle, Award, UserCheck, CalendarDays } from 'lucide-react';
import { Student, AttendanceRecords, AttendanceStatus } from '../types';
import LedgerCard from './LedgerCard';

interface ReportsPanelProps {
  students: Student[];
  records: AttendanceRecords;
}

export default function ReportsPanel({ students, records }: ReportsPanelProps) {
  const dates = Object.keys(records).sort();
  
  // Calculate aggregate stats across all records
  let totalPresent = 0;
  let totalLate = 0;
  let totalAbsent = 0;
  let totalMarks = 0;

  dates.forEach((date) => {
    Object.values(records[date]).forEach((status) => {
      totalMarks++;
      if (status === 'present') totalPresent++;
      else if (status === 'late') totalLate++;
      else if (status === 'absent') totalAbsent++;
    });
  });

  const overallAttendancePct = totalMarks
    ? Math.round(((totalPresent + totalLate) / totalMarks) * 100)
    : 0;

  // Student specific report state
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  useEffect(() => {
    if (students.length > 0 && !selectedStudentId) {
      // Default to first student sorted by roll
      const sorted = [...students].sort((a, b) => a.roll.localeCompare(b.roll, undefined, { numeric: true }));
      setSelectedStudentId(sorted[0].id);
    }
  }, [students, selectedStudentId]);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Calculate stats for the selected student
  const studentHistory: { date: string; status: AttendanceStatus }[] = [];
  let sPresent = 0;
  let sLate = 0;
  let sAbsent = 0;

  if (selectedStudentId) {
    dates.forEach((date) => {
      const status = records[date][selectedStudentId];
      if (status) {
        studentHistory.push({ date, status });
        if (status === 'present') sPresent++;
        else if (status === 'late') sLate++;
        else if (status === 'absent') sAbsent++;
      }
    });
  }

  // Reverse sort student history to show most recent dates first
  studentHistory.sort((a, b) => b.date.localeCompare(a.date));

  const sMarked = sPresent + sLate + sAbsent;
  const sAttendancePct = sMarked
    ? Math.round(((sPresent + sLate) / sMarked) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Aggregate Stats Section */}
      <LedgerCard badge="Overview Summary" title="Attendance Summary" subtitle="Comprehensive performance stats across all class registers.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-ledger-paper2/60 border border-ledger-line rounded-lg p-4 flex flex-col justify-between">
            <div>
              <span className="font-serif font-bold text-2xl md:text-3xl text-ledger-ink">
                {dates.length}
              </span>
              <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-ledger-ink-soft mt-1">
                Registers Taken
              </p>
            </div>
            <CalendarDays className="w-4 h-4 text-ledger-ink-soft/40 self-end mt-4" />
          </div>

          <div className="bg-ledger-paper2/60 border border-ledger-line rounded-lg p-4 flex flex-col justify-between">
            <div>
              <span className="font-serif font-bold text-2xl md:text-3xl text-ledger-ink">
                {students.length}
              </span>
              <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-ledger-ink-soft mt-1">
                Students Enrolled
              </p>
            </div>
            <UserCheck className="w-4 h-4 text-ledger-ink-soft/40 self-end mt-4" />
          </div>

          <div className="bg-ledger-paper2/60 border border-ledger-line rounded-lg p-4 flex flex-col justify-between">
            <div>
              <span className="font-serif font-bold text-2xl md:text-3xl text-ledger-absent">
                {totalAbsent}
              </span>
              <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-ledger-ink-soft mt-1">
                Total Absences
              </p>
            </div>
            <AlertCircle className="w-4 h-4 text-ledger-absent/30 self-end mt-4" />
          </div>

          <div className="bg-ledger-paper2/60 border border-ledger-line rounded-lg p-4 flex flex-col justify-between">
            <div>
              <span className="font-serif font-bold text-2xl md:text-3xl text-ledger-present">
                {overallAttendancePct}%
              </span>
              <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-ledger-ink-soft mt-1">
                Overall Attendance
              </p>
            </div>
            <div className="w-full bg-ledger-line/30 h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-ledger-present h-full rounded-full" style={{ width: `${overallAttendancePct}%` }} />
            </div>
          </div>
        </div>
      </LedgerCard>

      {/* Individual Student Report Card Section */}
      <LedgerCard badge="Student Record Book" title="Individual Student Report">
        {students.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm italic text-ledger-ink-soft">
              Please enroll students to view individual performance sheets.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Student Dropdown selector */}
            <div className="max-w-md">
              <label htmlFor="report-student" className="block text-[11px] font-bold uppercase tracking-wider text-ledger-ink-soft mb-1.5">
                Select Student Profile
              </label>
              <select
                id="report-student"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/50 border border-ledger-line rounded-md text-ledger-ink font-serif font-semibold text-sm md:text-base focus:outline-none focus:border-ledger-present transition-colors cursor-pointer shadow-sm"
              >
                {[...students]
                  .sort((a, b) => a.roll.localeCompare(b.roll, undefined, { numeric: true }))
                  .map((st) => (
                    <option key={st.id} value={st.id}>
                      Roll {st.roll} — {st.name} ({st.cls})
                    </option>
                  ))}
              </select>
            </div>

            {selectedStudent && (
              <div className="space-y-6 pt-2">
                {/* Specific student micro-stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/40 border border-ledger-line/50 rounded-lg p-4 flex flex-col justify-between shadow-sm">
                    <div>
                      <span className="font-serif font-bold text-2xl text-ledger-ink">
                        {sAttendancePct}%
                      </span>
                      <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-ledger-ink-soft mt-0.5">
                        Attendance Rate
                      </p>
                    </div>
                    <div className="w-full bg-ledger-line/20 h-1 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full ${sAttendancePct >= 90 ? 'bg-ledger-present' : sAttendancePct >= 75 ? 'bg-ledger-late' : 'bg-ledger-absent'}`}
                        style={{ width: `${sAttendancePct}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white/40 border border-ledger-line/50 rounded-lg p-4 flex flex-col justify-between shadow-sm">
                    <div>
                      <span className="font-serif font-bold text-2xl text-ledger-present">
                        {sPresent}
                      </span>
                      <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-ledger-ink-soft mt-0.5">
                        Days Present
                      </p>
                    </div>
                    <UserCheck className="w-3.5 h-3.5 text-ledger-present/40 self-end mt-2" />
                  </div>

                  <div className="bg-white/40 border border-ledger-line/50 rounded-lg p-4 flex flex-col justify-between shadow-sm">
                    <div>
                      <span className="font-serif font-bold text-2xl text-ledger-late">
                        {sLate}
                      </span>
                      <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-ledger-ink-soft mt-0.5">
                        Days Late
                      </p>
                    </div>
                    <TrendingUp className="w-3.5 h-3.5 text-ledger-late/40 self-end mt-2" />
                  </div>

                  <div className="bg-white/40 border border-ledger-line/50 rounded-lg p-4 flex flex-col justify-between shadow-sm">
                    <div>
                      <span className="font-serif font-bold text-2xl text-ledger-absent">
                        {sAbsent}
                      </span>
                      <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-ledger-ink-soft mt-0.5">
                        Days Absent
                      </p>
                    </div>
                    <Award className="w-3.5 h-3.5 text-ledger-absent/40 self-end mt-2" />
                  </div>
                </div>

                {/* History Log Table */}
                <div>
                  <h3 className="font-serif text-[15px] font-bold text-ledger-ink mb-3 pb-1 border-b border-dashed border-ledger-line">
                    Attendance History Journal
                  </h3>

                  <div className="overflow-hidden rounded-lg border border-ledger-line/40 bg-white/20">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-black/[0.03] border-b border-ledger-line/60">
                          <th className="py-2.5 px-4 font-sans text-[10px] font-bold uppercase tracking-wider text-ledger-ink-soft">
                            Date
                          </th>
                          <th className="py-2.5 px-4 font-sans text-[10px] font-bold uppercase tracking-wider text-ledger-ink-soft text-right">
                            Attendance Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ledger-line/30 font-mono text-sm">
                        {studentHistory.length === 0 ? (
                          <tr>
                            <td colSpan={2} className="py-6 px-4 text-center font-serif text-xs italic text-ledger-ink-soft">
                              No attendance logged for this student yet.
                            </td>
                          </tr>
                        ) : (
                          studentHistory.map((h, idx) => {
                            let colorClass = 'text-ledger-ink-soft';
                            if (h.status === 'present') colorClass = 'text-ledger-present font-bold';
                            else if (h.status === 'late') colorClass = 'text-ledger-late font-bold';
                            else if (h.status === 'absent') colorClass = 'text-ledger-absent font-bold';

                            return (
                              <tr key={idx} className="hover:bg-black/[0.01]">
                                <td className="py-2.5 px-4 text-ledger-ink">
                                  {h.date}
                                </td>
                                <td className={`py-2.5 px-4 text-right capitalize ${colorClass}`}>
                                  {h.status}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </LedgerCard>
    </div>
  );
}
