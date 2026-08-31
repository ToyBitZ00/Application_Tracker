'use client';

import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  MoreVertical,
  BookOpen,
  Search,
  X,
  Check,
  Edit3,
  Trash2
} from 'lucide-react';

/* ================================================= */
/* MOCK DATA */
/* ================================================= */

interface Course {
  id: string;
  code: string;
  name: string;
  studentsEnrolled: number;
  status: 'Active' | 'Archived';
}

const INITIAL_COURSES: Course[] = [
  { id: '1', code: 'BSCS', name: 'Bachelor of Science in Computer Science', studentsEnrolled: 450, status: 'Active' },
  { id: '2', code: 'BSIT', name: 'Bachelor of Science in Information Technology', studentsEnrolled: 380, status: 'Active' },
  { id: '3', code: 'BSBA', name: 'Bachelor of Science in Business Administration', studentsEnrolled: 320, status: 'Active' },
  { id: '4', code: 'BSHM', name: 'Bachelor of Science in Hospitality Management', studentsEnrolled: 210, status: 'Active' },
  { id: '5', code: 'BEED', name: 'Bachelor of Elementary Education', studentsEnrolled: 150, status: 'Active' },
  { id: '6', code: 'BSEd', name: 'Bachelor of Secondary Education', studentsEnrolled: 118, status: 'Active' },
  { id: '7', code: 'BSA', name: 'Bachelor of Science in Agriculture', studentsEnrolled: 0, status: 'Active' },
];

/* ================================================= */
/* MAIN COMPONENT */
/* ================================================= */

export default function CourseManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Add Course Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');

  // Edit Course Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editName, setEditName] = useState('');

  // Delete Course Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Close dropdowns and modals when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter Logic
  const filteredCourses = INITIAL_COURSES.filter((course) => {
    return course.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
           course.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setEditCode(course.code);
    setEditName(course.name);
    setActiveDropdown(null);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (course: Course) => {
    setCourseToDelete(course);
    setActiveDropdown(null);
    setIsDeleteModalOpen(true);
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
                Course Management
              </h1>
              <p className="mt-2 text-sm md:text-base text-slate-500">
                Manage academic programs available in the system.
              </p>
            </div>
            
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/20 transition-all active:scale-95"
            >
              <Plus size={18} strokeWidth={2.5} />
              Add Course
            </button>
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
          
          {/* Controls Bar (Search) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="relative w-full lg:max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by course code or name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-md text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Data Table Container */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-sm overflow-visible">
            <div className="overflow-x-auto min-h-[400px]">
              <table className="min-w-full text-left text-sm whitespace-nowrap border-separate border-spacing-0">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Course Details</th>
                    <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider text-center">Enrolled Students</th>
                    <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider text-right">Status</th>
                    <th className="px-5 py-4 w-12 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <tr key={course.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors group">
                        
                        {/* Course Details Column */}
                        <td className="px-5 py-4 border-t border-slate-200">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                              <BookOpen size={18} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 flex items-center gap-2 group-hover:text-blue-700 transition-colors">
                                {course.code}
                              </p>
                              <p className="text-xs font-medium text-slate-500 mt-0.5">{course.name}</p>
                            </div>
                          </div>
                        </td>

                        {/* Students Column */}
                        <td className="px-5 py-4 border-t border-slate-200 text-center">
                          <span className="font-bold text-slate-700">{course.studentsEnrolled}</span>
                        </td>

                        {/* Status Column */}
                        <td className="px-5 py-4 border-t border-slate-200 text-right">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] ${
                            course.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' :
                            'bg-slate-100 text-slate-600 border border-slate-200/80'
                          }`}>
                            {course.status}
                          </span>
                        </td>

                        {/* Actions Column (Dropdown) */}
                        <td className="px-5 py-4 border-t border-slate-200 text-center relative">
                          <button 
                            onClick={() => setActiveDropdown(activeDropdown === course.id ? null : course.id)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {/* Floating Dropdown Menu */}
                          {activeDropdown === course.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                              <div className="absolute right-8 top-8 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 flex flex-col animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                <button 
                                  onClick={() => openEditModal(course)}
                                  className="w-full block text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                >
                                  Edit Details
                                </button>
                                <div className="h-px bg-slate-100 my-1 mx-2" />
                                <button 
                                  onClick={() => openDeleteModal(course)}
                                  className="w-full block text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  Delete Course
                                </button>
                              </div>
                            </>
                          )}
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center border-t border-slate-200">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Search size={32} className="mb-3 opacity-20" />
                          <p className="text-sm font-semibold text-slate-600">No courses found.</p>
                          <p className="text-xs mt-1">Try adjusting your search criteria.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs font-medium text-slate-500 rounded-b-2xl">
              <p>Showing {filteredCourses.length} of {INITIAL_COURSES.length} total courses</p>
            </div>
          </div>

        </div>
      </main>

      {/* ================================================= */}
      {/* ADD COURSE MODAL */}
      {/* ================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsAddModalOpen(false)} />
          <div role="dialog" aria-modal="true" className="relative w-full max-w-[460px] bg-slate-50 rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.2)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-200">
            
            {/* Modal Header */}
            <div className="relative px-6 py-6 bg-blue-50/80 border-b border-blue-100 flex items-start justify-between rounded-t-3xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-blue-100/50 flex shrink-0 items-center justify-center text-blue-600">
                  <GraduationCap size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-0.5 mt-1">Database Update</h3>
                  <span className="text-2xl font-extrabold text-blue-950 leading-none block">Add New Course</span>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-blue-200/60 flex shrink-0 items-center justify-center text-blue-400 hover:bg-blue-100 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 mt-1 shadow-sm">
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <p className="text-sm leading-relaxed text-slate-500 mb-6">
                Add a new academic program to the system. Students will immediately be able to select this course during registration.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">
                    Course Code (Acronym)
                  </label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. BSA"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">
                    Full Course Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Bachelor of Science in Accountancy"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
                <button onClick={() => setIsAddModalOpen(false)} className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition">Cancel</button>
                <button 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="rounded-xl bg-blue-600 px-5 py-2.5 flex items-center gap-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-[0.98]"
                >
                  <Check size={16} strokeWidth={2.5} />
                  Save Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* EDIT COURSE MODAL */}
      {/* ================================================= */}
      {isEditModalOpen && editingCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsEditModalOpen(false)} />
          <div role="dialog" aria-modal="true" className="relative w-full max-w-[460px] bg-slate-50 rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.2)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-200">
            
            {/* Modal Header */}
            <div className="relative px-6 py-6 bg-slate-100/80 border-b border-slate-200 flex items-start justify-between rounded-t-3xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200/50 flex shrink-0 items-center justify-center text-slate-600">
                  <Edit3 size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-0.5 mt-1">Modify Record</h3>
                  <span className="text-2xl font-extrabold text-slate-950 leading-none block">Edit Details</span>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-slate-300/60 flex shrink-0 items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors focus:outline-none mt-1 shadow-sm">
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <p className="text-sm leading-relaxed text-slate-500 mb-6">
                Update the academic program details below. Changes will be reflected globally across the system.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">
                    Course Code (Acronym)
                  </label>
                  <input
                    type="text"
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    placeholder="e.g. BSA"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">
                    Full Course Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. Bachelor of Science in Accountancy"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
                <button onClick={() => setIsEditModalOpen(false)} className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition">Cancel</button>
                <button 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="rounded-xl bg-slate-900 px-5 py-2.5 flex items-center gap-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition active:scale-[0.98]"
                >
                  <Check size={16} strokeWidth={2.5} />
                  Update Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* DELETE COURSE MODAL */}
      {/* ================================================= */}
      {isDeleteModalOpen && courseToDelete && (
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
                  <span className="text-2xl font-extrabold text-red-950 leading-none block">Delete Course</span>
                </div>
              </div>
              <button onClick={() => setIsDeleteModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-red-200/60 flex shrink-0 items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200 mt-1 shadow-sm">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-6">
              <p className="text-sm leading-relaxed text-slate-600">
                Are you absolutely sure you want to permanently delete <strong className="text-slate-900">{courseToDelete.code} - {courseToDelete.name}</strong>? 
                This action cannot be undone and may affect <span className="font-bold text-red-600">{courseToDelete.studentsEnrolled} enrolled students</span>.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition">Cancel</button>
                <button onClick={() => setIsDeleteModalOpen(false)} className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition active:scale-[0.98]">
                  Delete Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* BOTTOM FADE-IN EFFECT */}
      {/* ================================================= */}
      <div className="fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f5f7fb] via-[#f5f7fb]/80 to-transparent z-30 pointer-events-none" />

    </>
  );
}
