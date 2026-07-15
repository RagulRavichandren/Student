import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Trash2, AlertCircle, Users } from 'lucide-react';
import { Student } from '../types';
import LedgerCard from './LedgerCard';

interface RosterPanelProps {
  students: Student[];
  onAddStudent: (newStudent: { roll: string; name: string; cls: string }) => void;
  onRemoveStudent: (id: string) => void;
}

export default function RosterPanel({
  students,
  onAddStudent,
  onRemoveStudent,
}: RosterPanelProps) {
  const [roll, setRoll] = useState('');
  const [name, setName] = useState('');
  const [cls, setCls] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedRoll = roll.trim();
    const trimmedName = name.trim();
    const trimmedCls = cls.trim();

    if (!trimmedRoll || !trimmedName || !trimmedCls) {
      setError('Please fill in all fields (Roll Number, Full Name, and Class).');
      return;
    }

    // Check if roll number already exists for that class
    const duplicate = students.find(
      (s) => s.roll.toLowerCase() === trimmedRoll.toLowerCase() && s.cls.toLowerCase() === trimmedCls.toLowerCase()
    );

    if (duplicate) {
      setError(`Roll number "${trimmedRoll}" already exists in class "${trimmedCls}".`);
      return;
    }

    onAddStudent({
      roll: trimmedRoll,
      name: trimmedName,
      cls: trimmedCls,
    });

    // Reset input states
    setRoll('');
    setName('');
    setCls('');
  };

  // Sort students by class first, then roll number numerically
  const sortedStudents = [...students].sort((a, b) => {
    const classCompare = a.cls.localeCompare(b.cls);
    if (classCompare !== 0) return classCompare;
    return a.roll.localeCompare(b.roll, undefined, { numeric: true });
  });

  return (
    <div className="space-y-6">
      {/* Add Student Section */}
      <LedgerCard badge="Enrollment Form" title="Add Student" subtitle="Create a student enrollment in a designated class register.">
        {error && (
          <div className="bg-ledger-absent/10 border border-ledger-absent/30 text-ledger-absent text-xs font-semibold p-3 rounded-md mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label htmlFor="s-roll" className="block text-[11px] font-bold uppercase tracking-wider text-ledger-ink-soft mb-1.5">
              Roll No.
            </label>
            <input
              type="text"
              id="s-roll"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              placeholder="e.g. 004"
              className="w-full px-3 py-2 bg-white/50 border border-ledger-line rounded-md text-ledger-ink placeholder-ledger-ink-soft/40 font-mono text-sm focus:outline-none focus:border-ledger-present focus:ring-1 focus:ring-ledger-present transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="s-name" className="block text-[11px] font-bold uppercase tracking-wider text-ledger-ink-soft mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              id="s-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anjali Verma"
              className="w-full px-3 py-2 bg-white/50 border border-ledger-line rounded-md text-ledger-ink placeholder-ledger-ink-soft/40 font-sans text-sm focus:outline-none focus:border-ledger-present focus:ring-1 focus:ring-ledger-present transition-colors"
            />
          </div>

          <div className="md:col-span-1 flex gap-2">
            <div className="flex-1">
              <label htmlFor="s-class" className="block text-[11px] font-bold uppercase tracking-wider text-ledger-ink-soft mb-1.5">
                Class
              </label>
              <input
                type="text"
                id="s-class"
                value={cls}
                onChange={(e) => setCls(e.target.value)}
                placeholder="e.g. 10-B"
                className="w-full px-3 py-2 bg-white/50 border border-ledger-line rounded-md text-ledger-ink placeholder-ledger-ink-soft/40 font-sans text-sm focus:outline-none focus:border-ledger-present focus:ring-1 focus:ring-ledger-present transition-colors"
              />
            </div>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-ledger-ink hover:bg-ledger-ink-soft text-ledger-paper p-2.5 rounded-md shadow hover:shadow-md transition-all shrink-0 cursor-pointer flex items-center justify-center h-[38px] w-[38px]"
              title="Add student"
            >
              <UserPlus className="w-5 h-5" />
            </motion.button>
          </div>
        </form>
      </LedgerCard>

      {/* Roster Table Section */}
      <LedgerCard
        badge="Register Roster"
        title="Class Roster"
        subtitle={
          students.length === 0
            ? 'No students enrolled yet.'
            : `${students.length} student${students.length === 1 ? '' : 's'} registered in current roll-book.`
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left mt-2">
            <thead>
              <tr className="border-b-2 border-ledger-ink">
                <th className="py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-ledger-ink-soft w-20">
                  Roll No.
                </th>
                <th className="py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-ledger-ink-soft">
                  Full Name
                </th>
                <th className="py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-ledger-ink-soft w-28">
                  Class
                </th>
                <th className="py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-ledger-ink-soft w-16 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ledger-line/50">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 px-3 text-center font-serif text-sm italic text-ledger-ink-soft">
                    Enroll students above to fill the register roster.
                  </td>
                </tr>
              ) : (
                sortedStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-black/[0.01] transition-colors group">
                    <td className="py-3 px-3 font-mono text-xs text-ledger-ink-soft font-bold">
                      {st.roll}
                    </td>
                    <td className="py-3 px-3 font-serif font-bold text-sm md:text-base text-ledger-ink">
                      {st.name}
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-ledger-ink-soft">
                      {st.cls}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove ${st.name} (Roll ${st.roll}) and their attendance history?`)) {
                            onRemoveStudent(st.id);
                          }
                        }}
                        className="p-1.5 rounded text-ledger-ink-soft hover:text-ledger-absent hover:bg-ledger-absent/10 transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                        title="Remove student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </LedgerCard>
    </div>
  );
}
