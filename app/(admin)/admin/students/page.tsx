'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  ShieldAlert,
  Trash2,
  Ban,
  CheckCircle2,
  X
} from 'lucide-react';

/* ================================================= */
/* MOCK DATA */
/* ================================================= */

type AccountStatus = 'Active' | 'Suspended';

interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  year: string;
  status: AccountStatus;
  joinedDate: string;
  applications: number;
}

const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Paul Nerie B. Aguirre', email: 'paul.aguirre@basc.edu.ph', course: 'BSCS', year: '3rd Year', status: 'Active', joinedDate: 'Aug 15, 2026', applications: 26 },
  { id: '2', name: 'Mark MJ Punzalan', email: 'mark.punzalan@basc.edu.ph', course: 'BSCS', year: '3rd Year', status: 'Active', joinedDate: 'Aug 16, 2026', applications: 14 },
  { id: '3', name: 'Rob King Cunanan', email: 'rob.cunanan@basc.edu.ph', course: 'BSCS', year: '3rd Year', status: 'Active', joinedDate: 'Aug 16, 2026', applications: 19 },
  { id: '4', name: 'Maria Santos', email: 'maria.santos@basc.edu.ph', course: 'BSBA', year: '4th Year', status: 'Active', joinedDate: 'Aug 28, 2026', applications: 0 },
  { id: '5', name: 'Juan Dela Cruz', email: 'juan.delacruz@basc.edu.ph', course: 'BSIT', year: '2nd Year', status: 'Suspended', joinedDate: 'Jul 10, 2026', applications: 3 },
  { id: '6', name: 'Ana Reyes', email: 'ana.reyes@basc.edu.ph', course: 'BEED', year: '4th Year', status: 'Active', joinedDate: 'Aug 01, 2026', applications: 8 },
  { id: '7', name: 'Miguel Garcia', email: 'miguel.garcia@basc.edu.ph', course: 'BSHM', year: '3rd Year', status: 'Active', joinedDate: 'Aug 05, 2026', applications: 12 },
  { id: '8', name: 'Sarah Lee', email: 'sarah.lee@basc.edu.ph', course: 'BSCS', year: '1st Year', status: 'Active', joinedDate: 'Aug 29, 2026', applications: 0 },
];

/* ================================================= */
/* MAIN COMPONENT */
/* ================================================= */

export default function StudentManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [courseFilter, setCourseFilter] = useState<string>('All');

  // Modal States
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsSuspendModalOpen(false);
        setIsDeleteModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter Logic
  const filteredStudents = MOCK_STUDENTS.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    const matchesCourse = courseFilter === 'All' || student.course === courseFilter;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const openActionModal = (student: Student, type: 'suspend' | 'delete') => {
    setSelectedStudent(student);
    setActiveDropdown(null);
    if (type === 'suspend') setIsSuspendModalOpen(true);
    if (type === 'delete') setIsDeleteModalOpen(true);
  };

  return (
    <>
      {/* ================================================= */}
      {/* BACKGROUND DESIGN (UNIFIED) */}
      {/* ================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-48 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl animate-pulse"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-blue-400/5 blur-3xl animate-pulse"
          style={{ animationDelay: '3s' }}
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35] z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #cbd5e1 1px, transparent 1px),
            linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        }}
      />

      {/* ================================================= */}
      {/* FIXED HEADER (TRANSPARENT & UNIFIED) */}
      {/* ================================================= */}
      <div className="relative z-40 w-full shrink-0 pt-8 pb-4 bg-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pointer-events-auto">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 animate-header-in">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  Administration
                </p>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
                Student Management
              </h1>
              <p className="mt-2 text-sm md:text-base text-slate-500">
                Manage registered accounts and permissions.
              </p>
            </div>
          </header>
        </div>
      </div>

      {/* ================================================= */}
      {/* SCROLLABLE CONTENT */}
      {/* ================================================= */}
      <main 
        className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full scroll-smooth scrollbar-hide"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Controls Bar (Search & Filters) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by student name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-md text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-sm h-11 transition-all focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500">
                <Filter size={16} className="text-slate-400" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer pr-1"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-sm h-11 transition-all focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500">
                <select 
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer pr-1"
                >
                  <option value="All">All Courses</option>
                  <option value="BSCS">BSCS</option>
                  <option value="BSIT">BSIT</option>
                  <option value="BSBA">BSBA</option>
                  <option value="BSHM">BSHM</option>
                  <option value="BEED">BEED</option>
                </select>
              </div>
            </div>

          </div>

          {/* Data Table Container */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-sm overflow-visible">
            <div className="overflow-x-auto min-h-[400px]">
              <table className="min-w-full text-left text-sm whitespace-nowrap border-separate border-spacing-0">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Student Details</th>
                    <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Program / Year</th>
                    <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider text-center">Applications</th>
                    <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider text-right">Status</th>
                    <th className="px-5 py-4 w-12 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors group">
                        
                        {/* Student Details Column */}
                        <td className="px-5 py-4 border-t border-slate-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{student.name}</p>
                              <p className="text-xs font-medium text-slate-500 mt-0.5">{student.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Program Column */}
                        <td className="px-5 py-4 border-t border-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] tracking-wider border border-slate-200/60">
                              {student.course}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">{student.year}</span>
                          </div>
                        </td>

                        {/* Applications Column */}
                        <td className="px-5 py-4 border-t border-slate-200 text-center">
                          <div className="inline-flex items-center gap-1.5 justify-center">
                            <span className="font-bold text-slate-700">{student.applications}</span>
                            <span className="text-xs text-slate-400">tracked</span>
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="px-5 py-4 border-t border-slate-200 text-right">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] ${
                            student.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' 
                              : 'bg-red-50 text-red-700 border border-red-200/80'
                          }`}>
                            {student.status === 'Active' && <CheckCircle2 size={12} className="mr-1" />}
                            {student.status === 'Suspended' && <Ban size={12} className="mr-1" />}
                            {student.status}
                          </span>
                        </td>

                        {/* Actions Column (Dropdown) */}
                        <td className="px-5 py-4 border-t border-slate-200 text-center relative">
                          <button 
                            onClick={() => setActiveDropdown(activeDropdown === student.id ? null : student.id)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {/* Floating Dropdown Menu */}
                          {activeDropdown === student.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                              <div className="absolute right-8 top-8 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 flex flex-col animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                <button 
                                  onClick={() => openActionModal(student, 'suspend')}
                                  className="w-full block text-left px-4 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-50 transition-colors"
                                >
                                  {student.status === 'Suspended' ? 'Unsuspend Account' : 'Suspend Account'}
                                </button>
                                <button 
                                  onClick={() => openActionModal(student, 'delete')}
                                  className="w-full block text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  Delete Account
                                </button>
                              </div>
                            </>
                          )}
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center border-t border-slate-200">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Search size={32} className="mb-3 opacity-20" />
                          <p className="text-sm font-semibold text-slate-600">No students found.</p>
                          <p className="text-xs mt-1">Try adjusting your search or filters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs font-medium text-slate-500 rounded-b-2xl">
              <p>Showing {filteredStudents.length} of {MOCK_STUDENTS.length} total students</p>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>Previous</button>
                <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-800 transition-colors">Next</button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ================================================= */}
      {/* BOTTOM FADE-IN EFFECT */}
      {/* ================================================= */}
      <div className="fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f5f7fb] via-[#f5f7fb]/80 to-transparent z-30 pointer-events-none" />

      {/* ================================================= */}
      {/* ACTION MODALS */}
      {/* ================================================= */}

      {/* Suspend Modal */}
      {isSuspendModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsSuspendModalOpen(false)} />
          <div role="dialog" aria-modal="true" className="relative w-full max-w-[420px] bg-slate-50 rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.2)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-200">
            <div className="relative px-6 py-6 bg-amber-50/80 border-b border-amber-100 flex items-start justify-between rounded-t-3xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-amber-100/50 flex shrink-0 items-center justify-center text-amber-600">
                  <ShieldAlert size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-amber-500 mb-0.5 mt-1">Account Access</h3>
                  <span className="text-2xl font-extrabold text-amber-950 leading-none block">
                    {selectedStudent.status === 'Suspended' ? 'Restore Access' : 'Suspend Account'}
                  </span>
                </div>
              </div>
              <button onClick={() => setIsSuspendModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-amber-200/60 flex shrink-0 items-center justify-center text-amber-400 hover:bg-amber-100 hover:text-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-200 mt-1 shadow-sm">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-6">
              <p className="text-sm leading-relaxed text-slate-600">
                Are you sure you want to {selectedStudent.status === 'Suspended' ? 'restore' : 'suspend'} access for <strong className="text-slate-900">{selectedStudent.name}</strong>? 
                {selectedStudent.status !== 'Suspended' && " They will not be able to log in until access is restored."}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
                <button onClick={() => setIsSuspendModalOpen(false)} className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition">Cancel</button>
                <button onClick={() => setIsSuspendModalOpen(false)} className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 transition active:scale-[0.98]">
                  Confirm Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsDeleteModalOpen(false)} />
          <div role="dialog" aria-modal="true" className="relative w-full max-w-[420px] bg-slate-50 rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.2)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-200">
            <div className="relative px-6 py-6 bg-red-50/80 border-b border-red-100 flex items-start justify-between rounded-t-3xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-red-100/50 flex shrink-0 items-center justify-center text-red-600">
                  <Trash2 size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-red-400 mb-0.5 mt-1">Danger Zone</h3>
                  <span className="text-2xl font-extrabold text-red-950 leading-none block">Delete Data</span>
                </div>
              </div>
              <button onClick={() => setIsDeleteModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-red-200/60 flex shrink-0 items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200 mt-1 shadow-sm">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-6">
              <p className="text-sm leading-relaxed text-slate-600">
                Are you absolutely sure you want to permanently delete the account for <strong className="text-slate-900">{selectedStudent.name}</strong>? 
                All <span className="font-bold text-red-600">{selectedStudent.applications} applications</span> and tracking data will be erased.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition">Cancel</button>
                <button onClick={() => setIsDeleteModalOpen(false)} className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition active:scale-[0.98]">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        @keyframes header-in {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-header-in { animation: header-in 0.4s ease-out forwards; }
      `}</style>
    </>
  );
}