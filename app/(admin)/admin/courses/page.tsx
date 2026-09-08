'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  Edit3,
  GraduationCap,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';

import { getStoredApplicationUser } from '@/lib/application-session';
import { createClient } from '@/lib/supabase/client';

type CourseStatus = 'active' | 'archived';

type Course = {
  id: string;
  code: string;
  name: string;
  status: CourseStatus;
  students_enrolled: number;
  created_at: string;
  updated_at: string;
};

type CompanyOption = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  website: string | null;
  role: string | null;
  logo_url: string | null;
};

const PAGE_SIZE = 10;

function statusLabel(status: CourseStatus) {
  return status === 'active' ? 'Active' : 'Archived';
}

export default function CourseManagementPage() {
  const supabase = useMemo(() => createClient(), []);
  const currentUser = getStoredApplicationUser();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [isCourseCompaniesModalOpen, setIsCourseCompaniesModalOpen] = useState(false);
  const [courseCompaniesCourse, setCourseCompaniesCourse] = useState<Course | null>(null);
  const [courseCompanies, setCourseCompanies] = useState<CompanyOption[]>([]);
  const [allCompanies, setAllCompanies] = useState<CompanyOption[]>([]);
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [loadingCourseCompanies, setLoadingCourseCompanies] = useState(false);
  const [savingCourseCompanyId, setSavingCourseCompanyId] = useState<string | null>(null);
  const [courseCompanyError, setCourseCompanyError] = useState('');
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);
  const [newCompanyForm, setNewCompanyForm] = useState({
    name: '',
    role: '',
    location: '',
    website: '',
    description: '',
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState<CourseStatus>('active');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  async function loadCourses() {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    setError('');

    const { data, error: coursesError } = await supabase.rpc(
      'list_courses_for_admin',
      {
        p_actor_user_id: currentUser.id,
      }
    );

    if (coursesError) {
      setError(coursesError.message || 'Unable to load courses.');
      setCourses([]);
      setLoading(false);
      return;
    }

    setCourses((data as Course[] | null) || []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredCourses = courses.filter((course) => {
    const searchText = `${course.code} ${course.name}`.toLowerCase();

    return searchText.includes(searchQuery.toLowerCase());
  });

  const filteredAvailableCompanies = allCompanies.filter((company) => {
    const haystack = `${company.name} ${company.role ?? ''} ${company.location ?? ''}`.toLowerCase();
    return haystack.includes(companySearchQuery.toLowerCase());
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCourses.length / PAGE_SIZE)
  );
  const normalizedPage = Math.min(currentPage, totalPages);
  const pageStart = (normalizedPage - 1) * PAGE_SIZE;
  const paginatedCourses = filteredCourses.slice(
    pageStart,
    pageStart + PAGE_SIZE
  );

  const resetAddForm = () => {
    setNewCode('');
    setNewName('');
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setEditCode(course.code);
    setEditName(course.name);
    setEditStatus(course.status);
    setActiveDropdown(null);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (course: Course) => {
    setCourseToDelete(course);
    setActiveDropdown(null);
    setIsDeleteModalOpen(true);
  };

  async function loadCourseCompanies(course: Course) {
    if (!currentUser?.id) {
      return;
    }

    setLoadingCourseCompanies(true);
    setCourseCompanyError('');

    const { data: courseCompanyRows, error: courseCompanyError } = await supabase.rpc(
      'list_course_companies_for_admin',
      {
        p_actor_user_id: currentUser.id,
        p_course_id: course.id,
      }
    );

    const { data: companyRows, error: companyError } = await supabase
      .from('companies')
      .select('id, name, description, location, website, role, logo_url')
      .order('name', { ascending: true });

    if (courseCompanyError) {
      setCourseCompanyError(courseCompanyError.message || 'Unable to load assigned companies.');
      setCourseCompanies([]);
      setAllCompanies([]);
      setLoadingCourseCompanies(false);
      return;
    }

    if (companyError) {
      setCourseCompanyError(companyError.message || 'Unable to load company catalog.');
      setCourseCompanies([]);
      setAllCompanies([]);
      setLoadingCourseCompanies(false);
      return;
    }

    const assignedCompanies = ((courseCompanyRows as CompanyOption[] | null) ?? []).map((company) => ({
      id: company.id,
      name: company.name,
      description: company.description ?? null,
      location: company.location ?? null,
      website: company.website ?? null,
      role: company.role ?? null,
      logo_url: company.logo_url ?? null,
    }));

    const assignedCompanyIds = new Set(
      assignedCompanies.map((company) => company.id)
    );

    setCourseCompanies(assignedCompanies);
    setAllCompanies(
      ((companyRows as CompanyOption[] | null) ?? []).filter(
        (company) => !assignedCompanyIds.has(company.id)
      )
    );
    setLoadingCourseCompanies(false);
  }

  const openCourseCompaniesModal = async (course: Course) => {
    if (!isSuperAdmin) {
      return;
    }

    setCourseCompaniesCourse(course);
    setIsCourseCompaniesModalOpen(true);
    setCompanySearchQuery('');
    setActiveDropdown(null);
    await loadCourseCompanies(course);
  };

  async function addCompanyToCourse(company: CompanyOption) {
    if (!courseCompaniesCourse || !currentUser?.id || savingCourseCompanyId) {
      return;
    }

    setSavingCourseCompanyId(company.id);
    setCourseCompanyError('');

    const { error: insertError } = await supabase.rpc(
      'upsert_course_company_for_admin',
      {
        p_actor_user_id: currentUser.id,
        p_course_id: courseCompaniesCourse.id,
        p_company_id: company.id,
      }
    );

    if (insertError) {
      setCourseCompanyError(insertError.message || 'Unable to add company to this course.');
      setSavingCourseCompanyId(null);
      return;
    }

    await loadCourseCompanies(courseCompaniesCourse);
    setSavingCourseCompanyId(null);
  }

  async function removeCompanyFromCourse(company: CompanyOption) {
    if (!courseCompaniesCourse || !currentUser?.id || savingCourseCompanyId) {
      return;
    }

    setSavingCourseCompanyId(company.id);
    setCourseCompanyError('');

    const { error: removeError } = await supabase.rpc(
      'remove_course_company_for_admin',
      {
        p_actor_user_id: currentUser.id,
        p_course_id: courseCompaniesCourse.id,
        p_company_id: company.id,
      }
    );

    if (removeError) {
      setCourseCompanyError(removeError.message || 'Unable to remove company from this course.');
      setSavingCourseCompanyId(null);
      return;
    }

    await loadCourseCompanies(courseCompaniesCourse);
    setSavingCourseCompanyId(null);
  }

  async function createAndLinkCompany() {
    if (!courseCompaniesCourse || !currentUser?.id) {
      return;
    }

    const trimmedName = newCompanyForm.name.trim();

    if (!trimmedName) {
      setCourseCompanyError('Company name is required.');
      return;
    }

    setCourseCompanyError('');
    setSavingCourseCompanyId('creating-company');

    const { data: newCompanyId, error: createError } = await supabase.rpc(
      'create_company_for_admin',
      {
        p_actor_user_id: currentUser.id,
        p_name: trimmedName,
        p_role: newCompanyForm.role.trim() || null,
        p_location: newCompanyForm.location.trim() || null,
        p_website: newCompanyForm.website.trim() || null,
        p_description: newCompanyForm.description.trim() || null,
      }
    );

    if (createError) {
      setCourseCompanyError(createError.message || 'Unable to create company.');
      setSavingCourseCompanyId(null);
      return;
    }

    const companyId = typeof newCompanyId === 'string' ? newCompanyId : (newCompanyId as { id?: string } | null)?.id;

    if (!companyId) {
      setCourseCompanyError('Company was created but its ID could not be read.');
      setSavingCourseCompanyId(null);
      return;
    }

    const { error: linkError } = await supabase.rpc(
      'upsert_course_company_for_admin',
      {
        p_actor_user_id: currentUser.id,
        p_course_id: courseCompaniesCourse.id,
        p_company_id: companyId,
      }
    );

    if (linkError) {
      setCourseCompanyError(linkError.message || 'Company was created but could not be linked to this course.');
      setSavingCourseCompanyId(null);
      return;
    }

    setNewCompanyForm({
      name: '',
      role: '',
      location: '',
      website: '',
      description: '',
    });
    setIsCreateCompanyOpen(false);
    await loadCourseCompanies(courseCompaniesCourse);
    setSavingCourseCompanyId(null);
  }

  async function saveNewCourse() {
    if (!currentUser?.id || saving) {
      return;
    }

    setSaving(true);
    setError('');

    const { error: saveError } = await supabase.rpc(
      'upsert_course_for_admin',
      {
        p_actor_user_id: currentUser.id,
        p_course_id: null,
        p_code: newCode,
        p_name: newName,
        p_status: 'active',
      }
    );

    if (saveError) {
      setError(saveError.message || 'Unable to save course.');
      setSaving(false);
      return;
    }

    resetAddForm();
    setIsAddModalOpen(false);
    await loadCourses();
    setSaving(false);
  }

  async function saveEditedCourse() {
    if (!currentUser?.id || !editingCourse || saving) {
      return;
    }

    setSaving(true);
    setError('');

    const { error: saveError } = await supabase.rpc(
      'upsert_course_for_admin',
      {
        p_actor_user_id: currentUser.id,
        p_course_id: editingCourse.id,
        p_code: editCode,
        p_name: editName,
        p_status: editStatus,
      }
    );

    if (saveError) {
      setError(saveError.message || 'Unable to update course.');
      setSaving(false);
      return;
    }

    setIsEditModalOpen(false);
    setEditingCourse(null);
    await loadCourses();
    setSaving(false);
  }

  async function deleteCourse() {
    if (!currentUser?.id || !courseToDelete || saving) {
      return;
    }

    setSaving(true);
    setError('');

    const { error: deleteError } = await supabase.rpc(
      'delete_course_for_admin',
      {
        p_actor_user_id: currentUser.id,
        p_course_id: courseToDelete.id,
      }
    );

    if (deleteError) {
      setError(deleteError.message || 'Unable to delete course.');
      setSaving(false);
      return;
    }

    setIsDeleteModalOpen(false);
    setCourseToDelete(null);
    await loadCourses();
    setSaving(false);
  }

  return (
    <>
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
          maskImage:
            'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        }}
      />

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
                Manage online academic programs synced with student onboarding.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/20 transition-all active:scale-95"
            >
              <Plus size={18} strokeWidth={2.5} />
              Add Course
            </button>
          </header>
        </div>
      </div>

      <main
        className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full scroll-smooth scrollbar-hide"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {error && (
            <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="relative w-full lg:max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by course code or name..."
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-md text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

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
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center border-t border-slate-200">
                        <Loader2 size={24} className="mx-auto mb-3 animate-spin text-blue-600" />
                        <p className="text-sm font-semibold text-slate-600">Loading online courses...</p>
                      </td>
                    </tr>
                  ) : filteredCourses.length > 0 ? (
                    paginatedCourses.map((course) => (
                      <tr
                        key={course.id}
                        onClick={() => {
                          if (isSuperAdmin) {
                            void openCourseCompaniesModal(course);
                          }
                        }}
                        className="border-t border-slate-200 hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
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

                        <td className="px-5 py-4 border-t border-slate-200 text-center">
                          <span className="font-bold text-slate-700">{course.students_enrolled}</span>
                        </td>

                        <td className="px-5 py-4 border-t border-slate-200 text-right">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] ${
                            course.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                              : 'bg-slate-100 text-slate-600 border border-slate-200/80'
                          }`}>
                            {statusLabel(course.status)}
                          </span>
                        </td>

                        <td className="px-5 py-4 border-t border-slate-200 text-center relative">
                          <button
                            type="button"
                            onClick={() => setActiveDropdown(activeDropdown === course.id ? null : course.id)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {activeDropdown === course.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                              <div className="absolute right-8 top-8 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 flex flex-col animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                <button
                                  type="button"
                                  onClick={() => openEditModal(course)}
                                  className="w-full block text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                >
                                  Edit Details
                                </button>
                                {isSuperAdmin && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      void openCourseCompaniesModal(course);
                                    }}
                                    className="w-full block text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                  >
                                    Manage Companies
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    openEditModal({
                                      ...course,
                                      status: course.status === 'active' ? 'archived' : 'active',
                                    });
                                  }}
                                  className="w-full block text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                >
                                  {course.status === 'active' ? 'Archive Course' : 'Restore Course'}
                                </button>
                                <div className="h-px bg-slate-100 my-1 mx-2" />
                                <button
                                  type="button"
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
                          <p className="text-xs mt-1">Add a course or adjust your search.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-500 rounded-b-2xl">
              <p>
                Showing {filteredCourses.length === 0 ? 0 : pageStart + 1}-
                {Math.min(pageStart + PAGE_SIZE, filteredCourses.length)} of{' '}
                {filteredCourses.length} courses
              </p>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">
                  Page {normalizedPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={normalizedPage === 1}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={normalizedPage === totalPages}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isAddModalOpen && (
        <CourseModal
          title="Add New Course"
          description="Students will immediately see active courses during onboarding."
          icon={<GraduationCap size={24} />}
          code={newCode}
          name={newName}
          status="active"
          saving={saving}
          showStatus={false}
          onCodeChange={setNewCode}
          onNameChange={setNewName}
          onStatusChange={() => undefined}
          onClose={() => setIsAddModalOpen(false)}
          onSave={saveNewCourse}
        />
      )}

      {isEditModalOpen && editingCourse && (
        <CourseModal
          title="Edit Course"
          description="Changes sync to Supabase and update student course options."
          icon={<Edit3 size={24} />}
          code={editCode}
          name={editName}
          status={editStatus}
          saving={saving}
          showStatus
          onCodeChange={setEditCode}
          onNameChange={setEditName}
          onStatusChange={setEditStatus}
          onClose={() => setIsEditModalOpen(false)}
          onSave={saveEditedCourse}
        />
      )}

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
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-red-200/60 flex shrink-0 items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200 mt-1 shadow-sm">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-6">
              <p className="text-sm leading-relaxed text-slate-600">
                Delete <strong className="text-slate-900">{courseToDelete.code} - {courseToDelete.name}</strong>? Courses with enrolled students cannot be deleted. Archive them instead.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
                <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition">Cancel</button>
                <button type="button" disabled={saving} onClick={deleteCourse} className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition active:scale-[0.98] disabled:opacity-60">
                  {saving ? 'Deleting...' : 'Delete Course'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCourseCompaniesModalOpen && courseCompaniesCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsCourseCompaniesModalOpen(false)} />
          <div role="dialog" aria-modal="true" className="relative w-full max-w-[760px] bg-slate-50 rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.2)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-200">
            <div className="relative px-6 py-6 bg-blue-50/80 border-b border-blue-100 flex items-start justify-between rounded-t-3xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-blue-100/50 flex shrink-0 items-center justify-center text-blue-600">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-0.5 mt-1">Course Access</h3>
                  <span className="text-2xl font-extrabold text-blue-950 leading-none block">{courseCompaniesCourse.code}</span>
                </div>
              </div>
              <button type="button" onClick={() => setIsCourseCompaniesModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-blue-200/60 flex shrink-0 items-center justify-center text-blue-400 hover:bg-blue-100 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 mt-1 shadow-sm">
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-slate-900">{courseCompaniesCourse.name}</p>
                  <p className="text-sm text-slate-500">Companies currently aligned with this course.</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] ${
                  courseCompaniesCourse.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                    : 'bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}>
                  {statusLabel(courseCompaniesCourse.status)}
                </span>
              </div>

              <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">Assigned Companies</p>
                  <span className="text-xs font-semibold text-slate-500">{courseCompanies.length} linked</span>
                </div>

                {loadingCourseCompanies ? (
                  <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-500">
                    <Loader2 size={16} className="animate-spin" />
                    Loading course companies...
                  </div>
                ) : courseCompanies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {courseCompanies.map((company) => (
                      <span
                        key={company.id}
                        className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                      >
                        {company.name}
                        <button
                          type="button"
                          disabled={savingCourseCompanyId === company.id}
                          onClick={() => void removeCompanyFromCourse(company)}
                          className="rounded-full p-0.5 text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label={`Remove ${company.name} from this course`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-sm text-slate-500">No companies are linked to this course yet.</p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">Add Company</p>
                  <button
                    type="button"
                    onClick={() => setIsCreateCompanyOpen((open) => !open)}
                    className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100"
                  >
                    {isCreateCompanyOpen ? 'Hide form' : 'New Company'}
                  </button>
                </div>

                {isCreateCompanyOpen && (
                  <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <input
                        type="text"
                        value={newCompanyForm.name}
                        onChange={(event) => setNewCompanyForm((form) => ({ ...form, name: event.target.value }))}
                        placeholder="Company name *"
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                      <input
                        type="text"
                        value={newCompanyForm.role}
                        onChange={(event) => setNewCompanyForm((form) => ({ ...form, role: event.target.value }))}
                        placeholder="Role / department"
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                      <input
                        type="text"
                        value={newCompanyForm.location}
                        onChange={(event) => setNewCompanyForm((form) => ({ ...form, location: event.target.value }))}
                        placeholder="Location"
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                      <input
                        type="url"
                        value={newCompanyForm.website}
                        onChange={(event) => setNewCompanyForm((form) => ({ ...form, website: event.target.value }))}
                        placeholder="Website URL"
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                    <textarea
                      value={newCompanyForm.description}
                      onChange={(event) => setNewCompanyForm((form) => ({ ...form, description: event.target.value }))}
                      placeholder="Company description"
                      rows={3}
                      className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        disabled={savingCourseCompanyId === 'creating-company'}
                        onClick={() => void createAndLinkCompany()}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-60"
                      >
                        {savingCourseCompanyId === 'creating-company' ? 'Saving...' : 'Save Company & Link'}
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="text"
                  value={companySearchQuery}
                  onChange={(event) => setCompanySearchQuery(event.target.value)}
                  placeholder="Search companies..."
                  className="mb-4 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
                />

                {courseCompanyError && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                    {courseCompanyError}
                  </div>
                )}

                <div className="max-h-[260px] space-y-2 overflow-y-auto pr-1">
                  {filteredAvailableCompanies.length > 0 ? (
                    filteredAvailableCompanies.map((company) => (
                      <div key={company.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">{company.name}</p>
                          <p className="truncate text-xs text-slate-500">{company.role ?? 'Company'}{company.location ? ` • ${company.location}` : ''}</p>
                        </div>
                        <button
                          type="button"
                          disabled={savingCourseCompanyId === company.id}
                          onClick={() => void addCompanyToCourse(company)}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-60"
                        >
                          {savingCourseCompanyId === company.id ? 'Adding...' : 'Add'}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="py-6 text-center text-sm text-slate-500">No companies found for this search.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f5f7fb] via-[#f5f7fb]/80 to-transparent z-30 pointer-events-none" />
    </>
  );
}

function CourseModal({
  title,
  description,
  icon,
  code,
  name,
  status,
  saving,
  showStatus,
  onCodeChange,
  onNameChange,
  onStatusChange,
  onClose,
  onSave,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  code: string;
  name: string;
  status: CourseStatus;
  saving: boolean;
  showStatus: boolean;
  onCodeChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onStatusChange: (value: CourseStatus) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-[460px] bg-slate-50 rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.2)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-200">
        <div className="relative px-6 py-6 bg-blue-50/80 border-b border-blue-100 flex items-start justify-between rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-blue-100/50 flex shrink-0 items-center justify-center text-blue-600">
              {icon}
            </div>
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-0.5 mt-1">Supabase Update</h3>
              <span className="text-2xl font-extrabold text-blue-950 leading-none block">{title}</span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-blue-200/60 flex shrink-0 items-center justify-center text-blue-400 hover:bg-blue-100 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 mt-1 shadow-sm">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-6">
          <p className="text-sm leading-relaxed text-slate-500 mb-6">
            {description}
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">
                Course Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(event) => onCodeChange(event.target.value)}
                placeholder="e.g. BSCS"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300 uppercase"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">
                Full Course Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                placeholder="e.g. Bachelor of Science in Computer Science"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300"
              />
            </div>
            {showStatus && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['active', 'archived'] as CourseStatus[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onStatusChange(option)}
                      className={`h-11 rounded-xl border text-sm font-semibold transition-colors ${
                        status === option
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {option === 'active' ? 'Active' : 'Archived'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition">Cancel</button>
            <button
              type="button"
              disabled={saving}
              onClick={onSave}
              className="rounded-xl bg-blue-600 px-5 py-2.5 flex items-center gap-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-[0.98] disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Check size={16} strokeWidth={2.5} />
              )}
              Save Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
