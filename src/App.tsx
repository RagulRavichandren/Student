import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Users, FileSpreadsheet, LogOut, CheckSquare } from 'lucide-react';
import { Student, AttendanceRecords } from './types';
import LoginScreen from './components/LoginScreen';
import AttendancePanel from './components/AttendancePanel';
import RosterPanel from './components/RosterPanel';
import ReportsPanel from './components/ReportsPanel';

const LS_STUDENTS_KEY = 'rollbook_students';
const LS_RECORDS_KEY = 'rollbook_records';
const SS_AUTH_KEY = 'rollbook_auth';

// High-fidelity Seed Students
const DEFAULT_STUDENTS: Student[] = [
  { id: 's1', roll: '001', name: 'Ananya Rao', cls: '10-B' },
  { id: 's2', roll: '002', name: 'Karthik Iyer', cls: '10-B' },
  { id: 's3', roll: '003', name: 'Meera Suresh', cls: '10-B' },
  { id: 's4', roll: '004', name: 'Arjun Nair', cls: '10-B' },
  { id: 's5', roll: '005', name: 'Devika Pillai', cls: '10-B' },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<AttendanceRecords>({});
  const [activeTab, setActiveTab] = useState<'attendance' | 'roster' | 'reports'>('attendance');

  // Check authentication & load initial data
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem(SS_AUTH_KEY);
    if (sessionAuth === '1') {
      setIsAuthenticated(true);
      setCurrentUser('teacher');
    }

    // Load Students from local storage or seed
    const localStudentsStr = localStorage.getItem(LS_STUDENTS_KEY);
    if (localStudentsStr) {
      try {
        setStudents(JSON.parse(localStudentsStr));
      } catch (e) {
        setStudents(DEFAULT_STUDENTS);
      }
    } else {
      setStudents(DEFAULT_STUDENTS);
      localStorage.setItem(LS_STUDENTS_KEY, JSON.stringify(DEFAULT_STUDENTS));
    }

    // Load Records from local storage
    const localRecordsStr = localStorage.getItem(LS_RECORDS_KEY);
    if (localRecordsStr) {
      try {
        setRecords(JSON.parse(localRecordsStr));
      } catch (e) {
        setRecords({});
      }
    } else {
      setRecords({});
    }
  }, []);

  const handleLoginSuccess = (username: string) => {
    sessionStorage.setItem(SS_AUTH_KEY, '1');
    setIsAuthenticated(true);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SS_AUTH_KEY);
    setIsAuthenticated(false);
    setCurrentUser('');
  };

  // Add a new student helper
  const handleAddStudent = (newSt: { roll: string; name: string; cls: string }) => {
    const updatedStudents: Student[] = [
      ...students,
      {
        id: `s_${Date.now()}`,
        ...newSt,
      },
    ];
    setStudents(updatedStudents);
    localStorage.setItem(LS_STUDENTS_KEY, JSON.stringify(updatedStudents));
  };

  // Remove student helper
  const handleRemoveStudent = (studentId: string) => {
    const updatedStudents = students.filter((s) => s.id !== studentId);
    setStudents(updatedStudents);
    localStorage.setItem(LS_STUDENTS_KEY, JSON.stringify(updatedStudents));

    // Also clean up this student's attendance records for cleanliness
    const updatedRecords: AttendanceRecords = {};
    Object.keys(records).forEach((date) => {
      const dayRecord = { ...records[date] };
      delete dayRecord[studentId];
      updatedRecords[date] = dayRecord;
    });
    setRecords(updatedRecords);
    localStorage.setItem(LS_RECORDS_KEY, JSON.stringify(updatedRecords));
  };

  // Save records helper
  const handleSaveRecords = (updatedRecords: AttendanceRecords) => {
    setRecords(updatedRecords);
    localStorage.setItem(LS_RECORDS_KEY, JSON.stringify(updatedRecords));
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div id="app-screen" className="min-h-screen bg-ledger-bg text-ledger-chalk font-sans flex flex-col selection:bg-ledger-accent selection:text-ledger-accent-ink">
      {/* Blackboard Chalk Dust Decorative Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] select-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] z-0" />
      <div className="fixed inset-0 pointer-events-none opacity-5 mix-blend-screen bg-gradient-to-tr from-white/10 via-transparent to-white/5 z-0" />

      {/* Main Top Header */}
      <header className="topbar relative z-10 bg-ledger-bg2 border-b border-ledger-border px-6 py-4 md:px-8 md:py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="brand flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -6 }}
            className="mark w-10 h-10 md:w-11 md:h-11 rounded-lg bg-ledger-accent text-ledger-accent-ink flex items-center justify-center font-serif font-bold text-xl md:text-2xl shadow-md rotate-[-4deg] border border-white/15 cursor-default select-none"
          >
            R
          </motion.div>
          <div>
            <h1 className="font-serif text-lg md:text-xl font-bold tracking-wide text-ledger-chalk leading-tight">
              Roll Book
            </h1>
            <span className="sub font-mono text-[10px] md:text-xs text-ledger-chalk-dim tracking-wider uppercase">
              student attendance register
            </span>
          </div>
        </div>

        <div className="who flex items-center gap-4">
          <span className="name font-mono text-xs text-ledger-chalk-dim bg-white/5 px-3 py-1.5 rounded-full border border-ledger-border">
            @{currentUser}
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="btn-ghost flex items-center gap-2 border border-ledger-border hover:border-ledger-accent hover:text-ledger-accent font-semibold text-xs md:text-sm px-4 py-2 rounded-md transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </motion.button>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <nav className="tabs relative z-10 flex gap-1 px-6 md:px-8 pt-4 bg-ledger-bg2 border-b border-ledger-border/40 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`tab-btn flex items-center gap-2 font-semibold text-xs md:text-sm px-4 py-2.5 rounded-t-lg transition-all border-t-2 border-x cursor-pointer shrink-0 ${
            activeTab === 'attendance'
              ? 'bg-ledger-bg text-ledger-accent border-ledger-accent border-x-ledger-border font-bold'
              : 'border-transparent text-ledger-chalk-dim hover:text-ledger-chalk hover:bg-white/5'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Take Attendance</span>
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`tab-btn flex items-center gap-2 font-semibold text-xs md:text-sm px-4 py-2.5 rounded-t-lg transition-all border-t-2 border-x cursor-pointer shrink-0 ${
            activeTab === 'roster'
              ? 'bg-ledger-bg text-ledger-accent border-ledger-accent border-x-ledger-border font-bold'
              : 'border-transparent text-ledger-chalk-dim hover:text-ledger-chalk hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Roster</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`tab-btn flex items-center gap-2 font-semibold text-xs md:text-sm px-4 py-2.5 rounded-t-lg transition-all border-t-2 border-x cursor-pointer shrink-0 ${
            activeTab === 'reports'
              ? 'bg-ledger-bg text-ledger-accent border-ledger-accent border-x-ledger-border font-bold'
              : 'border-transparent text-ledger-chalk-dim hover:text-ledger-chalk hover:bg-white/5'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Reports</span>
        </button>
      </nav>

      {/* Main Application Panels */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'attendance' && (
            <motion.div
              key="attendance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AttendancePanel
                students={students}
                records={records}
                onSaveRecords={handleSaveRecords}
              />
            </motion.div>
          )}

          {activeTab === 'roster' && (
            <motion.div
              key="roster"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <RosterPanel
                students={students}
                onAddStudent={handleAddStudent}
                onRemoveStudent={handleRemoveStudent}
              />
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ReportsPanel students={students} records={records} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom styled footer */}
      <footer className="relative z-10 text-center text-[11px] md:text-xs text-ledger-chalk-dim/50 py-6 border-t border-ledger-border/25 mt-auto bg-black/10 select-none">
        <span>Data is stored locally in this browser — nothing leaves this device.</span>
      </footer>
    </div>
  );
}
