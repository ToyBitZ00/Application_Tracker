'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import {
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Pencil,
  Check,
  GripVertical,
  ExternalLink,
  Building2,
  MapPin,
  BriefcaseBusiness,
  X,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import {
  getStoredApplicationUser,
  getStoredUsername,
  setStoredApplicationUser,
} from '@/lib/application-session';

/* =========================================================
   TYPES
========================================================= */

type ColumnColor = {
  name: string;
  dot: string;
  gradient: string;
  background: string;
  border: string;
  header: string;
  text: string;
};

type Card = {
  id: string;
  title: string;
  description: string;
  interviewTag: string;
  status: string;
  position: number;
};

type Column = {
  id: string;
  title: string;
  description: string;
  color: ColumnColor;
  cards: Card[];
};

type Company = {
  id: string;
  name: string;
  location: string;
  role: string;
  description: string;
  website: string;
  logoUrl: string;
};

type SupabaseCompany = {
  id: string;
  name: string;
  location: string;
  role: string;
  description: string | null;
  website: string | null;
  logo_url: string | null;
};

type SupabaseNote = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  interview_tag: string | null;
  status: string;
  position: number;
  created_at: string;
  updated_at: string;
};

type ApplicationUser = {
  id: string;
  full_name: string | null;
  username: string;
  created_at: string;
  updated_at: string;
};

/* =========================================================
   COLUMN COLORS
========================================================= */

const COLUMN_COLORS: ColumnColor[] = [
  {
    name: 'Blue',
    dot: 'bg-blue-500',
    gradient: 'bg-gradient-to-r from-blue-500 via-sky-400 to-blue-200',
    background: 'bg-blue-50',
    border: 'border-blue-200',
    header: 'bg-blue-100',
    text: 'text-blue-700',
  },
  {
    name: 'Purple',
    dot: 'bg-purple-500',
    gradient: 'bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-200',
    background: 'bg-purple-50',
    border: 'border-purple-200',
    header: 'bg-purple-100',
    text: 'text-purple-700',
  },
  {
    name: 'Amber',
    dot: 'bg-amber-500',
    gradient: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-200',
    background: 'bg-amber-50',
    border: 'border-amber-200',
    header: 'bg-amber-100',
    text: 'text-amber-700',
  },
  {
    name: 'Green',
    dot: 'bg-emerald-500',
    gradient: 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-200',
    background: 'bg-emerald-50',
    border: 'border-emerald-200',
    header: 'bg-emerald-100',
    text: 'text-emerald-700',
  },
  {
    name: 'Red',
    dot: 'bg-red-500',
    gradient: 'bg-gradient-to-r from-red-500 via-rose-400 to-red-200',
    background: 'bg-red-50',
    border: 'border-red-200',
    header: 'bg-red-100',
    text: 'text-red-700',
  },
  {
    name: 'Pink',
    dot: 'bg-pink-500',
    gradient: 'bg-gradient-to-r from-pink-500 via-rose-400 to-pink-200',
    background: 'bg-pink-50',
    border: 'border-pink-200',
    header: 'bg-pink-100',
    text: 'text-pink-700',
  },
  {
    name: 'Indigo',
    dot: 'bg-indigo-500',
    gradient: 'bg-gradient-to-r from-indigo-500 via-violet-400 to-indigo-200',
    background: 'bg-indigo-50',
    border: 'border-indigo-200',
    header: 'bg-indigo-100',
    text: 'text-indigo-700',
  },
  {
    name: 'Slate',
    dot: 'bg-slate-400',
    gradient: 'bg-gradient-to-r from-slate-500 via-slate-400 to-slate-200',
    background: 'bg-slate-100',
    border: 'border-slate-300',
    header: 'bg-slate-200',
    text: 'text-slate-700',
  },
];

/* =========================================================
   INITIAL COLUMNS
========================================================= */

const INITIAL_COLUMNS: Column[] = [
  {
    id: 'applied',
    title: 'Applied',
    description: 'Submitted applications',
    color: COLUMN_COLORS[0],
    cards: [],
  },
  {
    id: 'screening',
    title: 'Screening',
    description: 'Waiting for review',
    color: COLUMN_COLORS[1],
    cards: [],
  },
  {
    id: 'interview',
    title: 'Interview',
    description: 'Scheduled conversations',
    color: COLUMN_COLORS[2],
    cards: [],
  },
  {
    id: 'offer',
    title: 'Offer',
    description: 'Accepted or pending offers',
    color: COLUMN_COLORS[3],
    cards: [],
  },
  {
    id: 'rejected',
    title: 'Rejected',
    description: 'Closed applications',
    color: COLUMN_COLORS[4],
    cards: [],
  },
];

const NOTE_SELECT_FIELDS =
  'id, user_id, title, description, interview_tag, status, position, created_at, updated_at';

const INTERVIEW_TAG_STATUSES = [
  'interview',
  'offer',
  'rejected',
];

const INTERVIEW_TAG_OPTIONS = [
  '1st Interview',
  '2nd Interview',
  '3rd Interview',
];

/* =========================================================
   SAMPLE COMPANIES
========================================================= */

const SAMPLE_COMPANIES: Company[] = [
  {
    id: 'company-1',
    name: 'Accenture Philippines',
    location: 'Manila, Philippines',
    role: 'Software Developer Intern',
    description:
      'Technology and consulting internship opportunities focused on software development and digital solutions.',
    website: 'https://www.accenture.com/ph-en',
    logoUrl: 'https://logo.clearbit.com/accenture.com',
  },
  {
    id: 'company-2',
    name: 'Globe Telecom',
    location: 'Taguig, Philippines',
    role: 'IT / Software Intern',
    description:
      'Internship opportunities in software engineering, IT, data, and digital technology.',
    website: 'https://www.globe.com.ph',
    logoUrl: 'https://logo.clearbit.com/globe.com.ph',
  },
  {
    id: 'company-3',
    name: 'GCash / Mynt',
    location: 'Taguig, Philippines',
    role: 'Software Engineering Intern',
    description:
      'Popular Philippine fintech company with opportunities across software engineering, data, payments, and digital products.',
    website: 'https://www.mynt.xyz',
    logoUrl: '/applications/companies/gcash-mynt.svg',
  },
  {
    id: 'company-4',
    name: 'PLDT',
    location: 'Makati, Philippines',
    role: 'Technology Intern',
    description:
      'Technology roles involving software, systems, networking, and digital services.',
    website: 'https://pldt.com.ph',
    logoUrl: 'https://logo.clearbit.com/pldt.com.ph',
  },
  {
    id: 'company-5',
    name: 'IBM Philippines',
    location: 'Quezon City, Philippines',
    role: 'Software Engineering Intern',
    description:
      'Explore software engineering, cloud, AI, cybersecurity, and enterprise technology opportunities.',
    website: 'https://www.ibm.com/ph-en',
    logoUrl: 'https://logo.clearbit.com/ibm.com',
  },
];

/* =========================================================
   HELPERS
========================================================= */

const createEmptyBoard = (): Column[] => {
  return INITIAL_COLUMNS.map((column) => ({
    ...column,
    cards: [],
  }));
};

const buildBoardFromNotes = (
  notes: SupabaseNote[] | null
) => {
  const board = createEmptyBoard();

  notes?.forEach((note) => {
    const column = board.find(
      (item) => item.id === note.status
    );

    if (!column) {
      return;
    }

    column.cards.push({
      id: note.id,
      title: note.title,
      description: note.description || '',
      interviewTag: note.interview_tag || '',
      status: note.status,
      position: note.position,
    });
  });

  board.forEach((column) => {
    column.cards.sort(
      (a, b) => a.position - b.position
    );
  });

  return board;
};

function getCompanyDomain(website: string) {
  if (!website || website === '#') {
    return '';
  }

  try {
    const url = new URL(
      website.startsWith('http')
        ? website
        : `https://${website}`
    );

    return url.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function getCompanyLogoDomain(company: Company) {
  const normalizedName =
    company.name.toLowerCase();
  const domain =
    getCompanyDomain(company.website);

  if (normalizedName.includes('pldt')) {
    return 'pldt.com.ph';
  }

  return domain;
}

function normalizeCompanyLogoUrl(logoUrl: string) {
  const trimmedLogoUrl = logoUrl.trim();

  if (!trimmedLogoUrl) {
    return '';
  }

  if (
    trimmedLogoUrl.startsWith('http://') ||
    trimmedLogoUrl.startsWith('https://')
  ) {
    return trimmedLogoUrl;
  }

  if (trimmedLogoUrl.startsWith('/')) {
    return trimmedLogoUrl;
  }

  return `https://${trimmedLogoUrl}`;
}

function getCompanyLogoCandidates(company: Company) {
  const domain = getCompanyLogoDomain(company);
  const customLogoUrl = normalizeCompanyLogoUrl(
    company.logoUrl
  );

  if (!domain) {
    return customLogoUrl
      ? [customLogoUrl]
      : [];
  }

  return [
    customLogoUrl,
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
      domain
    )}&sz=256`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  ].filter(
    (url, index, urls): url is string =>
      Boolean(url) &&
      urls.indexOf(url) === index
  );
}

function getCompanyRecommendationRank(company: Company) {
  const normalizedName =
    company.name.toLowerCase();

  if (normalizedName.includes('accenture')) {
    return 0;
  }

  if (normalizedName.includes('globe')) {
    return 1;
  }

  if (
    normalizedName.includes('gcash') ||
    normalizedName.includes('mynt')
  ) {
    return 2;
  }

  if (normalizedName.includes('pldt')) {
    return 3;
  }

  if (normalizedName.includes('ibm')) {
    return 4;
  }

  return 20;
}

function sortRecommendedCompanies(companies: Company[]) {
  return [...companies].sort((a, b) => {
    const rankDifference =
      getCompanyRecommendationRank(a) -
      getCompanyRecommendationRank(b);

    if (rankDifference !== 0) {
      return rankDifference;
    }

    return a.name.localeCompare(b.name);
  });
}

function mergeCompanies(
  primary: Company[],
  fallback: Company[]
) {
  const merged = new Map<string, Company>();

  fallback.forEach((company) => {
    merged.set(
      company.name.trim().toLowerCase(),
      company
    );
  });

  primary.forEach((company) => {
      const key =
        company.name.trim().toLowerCase();
      const fallbackCompany =
        merged.get(key);

      merged.set(key, {
        ...fallbackCompany,
        ...company,
        location:
          company.location ||
          fallbackCompany?.location ||
          '',
        role:
          company.role ||
          fallbackCompany?.role ||
          '',
        description:
          company.description ||
          fallbackCompany?.description ||
          '',
        website:
          company.website &&
          company.website !== '#'
            ? company.website
            : fallbackCompany?.website || '#',
        logoUrl:
          company.logoUrl ||
          fallbackCompany?.logoUrl ||
          '',
      });
  });

  return Array.from(merged.values());
}

function CompanyLogo({
  company,
  className,
  iconSize = 16,
}: {
  company: Company;
  className: string;
  iconSize?: number;
}) {
  const logoCandidates =
    getCompanyLogoCandidates(company);
  const [logoIndex, setLogoIndex] =
    useState(0);
  const [logoLoaded, setLogoLoaded] =
    useState(false);

  const logoUrl =
    logoCandidates[logoIndex] || '';

  const initials = company.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');

  return (
    <div
      className={`${className} relative overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center`}
    >
      {initials ? (
        <span className="relative z-0 text-[11px] font-extrabold text-slate-500">
          {initials}
        </span>
      ) : (
        <Building2
          size={iconSize}
          className="relative z-0 text-slate-500"
        />
      )}

      {logoUrl ? (
        // Company logos come from Supabase and can point to arbitrary hosts.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={`${company.name} logo`}
          key={logoUrl}
          className={`absolute inset-0 z-10 h-full w-full object-contain bg-white p-1.5 transition-opacity duration-200 ${
            logoLoaded
              ? 'opacity-100'
              : 'opacity-0'
          }`}
          referrerPolicy="no-referrer"
          onLoad={() => {
            setLogoLoaded(true);
          }}
          onError={() => {
            setLogoLoaded(false);
            setLogoIndex((current) => {
              const nextIndex =
                current + 1;

              return nextIndex <
                logoCandidates.length
                ? nextIndex
                : current;
            });
          }}
        />
      ) : null}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ApplicationsPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [columns, setColumns] =
    useState<Column[]>(createEmptyBoard);

  const [search, setSearch] =
    useState('');

  const [activeCard, setActiveCard] =
    useState<Card | null>(null);

  const [activeColumn, setActiveColumn] =
    useState<Column | null>(null);

  const [editingCard, setEditingCard] =
    useState<string | null>(null);

  const [editingCardTitle, setEditingCardTitle] =
    useState('');

  const [
    editingCardDescription,
    setEditingCardDescription,
  ] = useState('');

  const [
    editingCardInterviewTag,
    setEditingCardInterviewTag,
  ] = useState('');

  const [newCardColumn, setNewCardColumn] =
    useState<string | null>(null);

  const [newCardTitle, setNewCardTitle] =
    useState('');

  const [
    newCardDescription,
    setNewCardDescription,
  ] = useState('');

  const [selectedCompany, setSelectedCompany] =
    useState<Company | null>(null);

  const [showAllCompanies, setShowAllCompanies] =
    useState(false);

  const [
    companiesHidden,
    setCompaniesHidden,
  ] = useState(false);

  const [companies, setCompanies] =
    useState<Company[]>(
      sortRecommendedCompanies(SAMPLE_COMPANIES)
    );

  const [saving, setSaving] =
    useState(false);

  const [loadingNotes, setLoadingNotes] =
    useState(true);

  const [userId, setUserId] =
    useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getCurrentApplicationUser = useCallback(
    async (): Promise<ApplicationUser | null> => {
      const storedUser =
        getStoredApplicationUser();

      const username =
        storedUser?.username ||
        getStoredUsername();

      if (!username) {
        return null;
      }

      const { data, error } = await supabase.rpc(
        'get_application_user_profile',
        {
          p_user_id: storedUser?.id || null,
          p_username: username,
        }
      );

      if (error || !data) {
        console.error(
          'Unable to resolve current application user:',
          error
        );

        return null;
      }

      const account = data as ApplicationUser;

      setStoredApplicationUser({
        id: account.id,
        username: account.username,
        fullName: account.full_name || '',
      });

      return account;
    },
    [supabase]
  );

  /* =========================================================
     LOAD AUTHENTICATED USER + NOTES
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const loadNotes = async () => {
      try {
        const currentUser =
          await getCurrentApplicationUser();

        if (!currentUser) {
          if (mounted) {
            setUserId(null);
            setColumns(createEmptyBoard());
            setLoadingNotes(false);
          }

          return;
        }

        if (mounted) {
          setUserId(currentUser.id);
        }

        /*
         * Load ONLY this application_users account's notes.
         */
        const {
          data,
          error,
        } = await supabase
          .from('application_notes')
          .select(
            NOTE_SELECT_FIELDS
          )
          .eq('user_id', currentUser.id)
          .order('position', {
            ascending: true,
          });

        if (error) {
          console.error(
            'Error loading application notes:',
            error
          );

          if (mounted) {
            setColumns(createEmptyBoard());
            setLoadingNotes(false);
          }

          return;
        }

        const board = buildBoardFromNotes(
          data as SupabaseNote[] | null
        );

        if (mounted) {
          setColumns(board);
          setLoadingNotes(false);
        }
      } catch (error) {
        console.error(
          'Unexpected error loading notes:',
          error
        );

        if (mounted) {
          setColumns(createEmptyBoard());
          setLoadingNotes(false);
        }
      }
    };

    loadNotes();

    return () => {
      mounted = false;
    };
  }, [getCurrentApplicationUser, supabase]);

  /* =========================================================
     LOAD COMPANIES
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const loadCompanies = async () => {
      try {
        const {
          data,
          error,
        } = await supabase
          .from('companies')
          .select(
            'id, name, location, role, description, website, logo_url'
          )
          .order('name', {
            ascending: true,
          });

        if (error || !data) {
          return;
        }

        const databaseCompanies =
          (
            data as SupabaseCompany[]
          ).map((company) => ({
            id: `supabase-${company.id}`,
            name: company.name,
            location: company.location,
            role: company.role,
            description:
              company.description || '',
            website:
              company.website || '#',
            logoUrl:
              company.logo_url || '',
          }));

        if (mounted) {
          setCompanies(
            sortRecommendedCompanies(
              databaseCompanies.length > 0
                ? mergeCompanies(
                    databaseCompanies,
                    SAMPLE_COMPANIES
                  )
                : SAMPLE_COMPANIES
            )
          );
        }
      } catch {
        // Keep sample companies.
      }
    };

    loadCompanies();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  /* =========================================================
     REFRESH FROM SUPABASE
  ========================================================= */

  const refreshBoard = async () => {
    setSaving(true);

    try {
      const currentUser =
        await getCurrentApplicationUser();

      if (!currentUser) {
        setUserId(null);
        setColumns(createEmptyBoard());
        return;
      }

      setUserId(currentUser.id);

      const {
        data,
        error,
      } = await supabase
        .from('application_notes')
        .select(
          NOTE_SELECT_FIELDS
        )
        .eq('user_id', currentUser.id)
        .order('position', {
          ascending: true,
        });

      if (error) {
        console.error(
          'Error refreshing notes:',
          error
        );

        return;
      }

      const board = buildBoardFromNotes(
        data as SupabaseNote[] | null
      );

      setColumns(board);
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     SAVE POSITIONS
  ========================================================= */

  const savePositions = async (
    board: Column[]
  ) => {
    if (!userId) {
      console.error(
        'No authenticated user.'
      );

      return false;
    }

    try {
      /*
       * Update every card with its
       * current status and position.
       */
      const updates: {
        id: string;
        status: string;
        position: number;
      }[] = [];

      board.forEach((column) => {
        column.cards.forEach(
          (card, index) => {
            updates.push({
              id: card.id,
              status: column.id,
              position: index,
            });
          }
        );
      });

      /*
       * Supabase does not have a native
       * bulk update through this client,
       * so update the changed records.
       */
      for (const item of updates) {
        const { error } =
          await supabase
            .from('application_notes')
            .update({
              status: item.status,
              position: item.position,
            })
            .eq('id', item.id)
            .eq('user_id', userId);

        if (error) {
          console.error(
            'Error saving note position:',
            error
          );

          return false;
        }
      }

      return true;
    } catch (error) {
      console.error(
        'Unexpected position save error:',
        error
      );

      return false;
    }
  };

  /* =========================================================
     OPEN ADD NOTE MODAL
  ========================================================= */

  const openAddNote = (
    columnId: string
  ) => {
    setNewCardTitle('');
    setNewCardDescription('');
    setNewCardColumn(columnId);
  };

  /* =========================================================
     CLOSE ADD NOTE MODAL
  ========================================================= */

  const closeAddNote = () => {
    setNewCardColumn(null);
    setNewCardTitle('');
    setNewCardDescription('');
  };

  /* =========================================================
     ADD CARD
  ========================================================= */

  const addCard = async (
    columnId: string
  ) => {
    const title =
      newCardTitle.trim();

    if (!title) {
      return;
    }

    if (!userId) {
      console.error(
        'Cannot create note: no authenticated user.'
      );

      return;
    }

    const column =
      columns.find(
        (item) =>
          item.id === columnId
      );

    if (!column) {
      return;
    }

    setSaving(true);

    try {
      /*
       * Put the new card at the end
       * of the selected column.
       */
      const position =
        column.cards.length;

      const {
        data,
        error,
      } = await supabase
        .from('application_notes')
        .insert({
          user_id: userId,
          title,
          description:
            newCardDescription.trim(),
          status: columnId,
          position,
        })
        .select(
          NOTE_SELECT_FIELDS
        )
        .single();

      if (error || !data) {
        console.error(
          'Error creating application note:',
          error
        );

        return;
      }

      const databaseNote =
        data as SupabaseNote;

      const newCard: Card = {
        id: databaseNote.id,
        title: databaseNote.title,
        description:
          databaseNote.description ||
          '',
        interviewTag:
          databaseNote.interview_tag ||
          '',
        status:
          databaseNote.status,
        position:
          databaseNote.position,
      };

      const nextColumns =
        columns.map(
          (item) =>
            item.id === columnId
              ? {
                  ...item,
                  cards: [
                    ...item.cards,
                    newCard,
                  ],
                }
              : item
        );

      setColumns(nextColumns);

      closeAddNote();
    } finally {
      setSaving(false);
    }
  };

  const applyToCompany = async (
    company: Company
  ) => {
    const currentUserId =
      userId ||
      (await getCurrentApplicationUser())?.id;

    if (!currentUserId) {
      console.error(
        'Cannot apply to company: no authenticated user.'
      );

      return;
    }

    const appliedColumn =
      columns.find(
        (column) =>
          column.id === 'applied'
      );

    const position =
      appliedColumn?.cards.length || 0;

    setSaving(true);

    try {
      const description = [
        company.role,
        company.location,
        company.description,
        company.website,
      ]
        .filter(Boolean)
        .join('\n\n');

      const {
        data,
        error,
      } = await supabase
        .from('application_notes')
        .insert({
          user_id: currentUserId,
          title: company.name,
          description,
          status: 'applied',
          position,
        })
        .select(
          NOTE_SELECT_FIELDS
        )
        .single();

      if (error || !data) {
        console.error(
          'Error creating application note from company:',
          error
        );

        return;
      }

      const databaseNote =
        data as SupabaseNote;

      const newCard: Card = {
        id: databaseNote.id,
        title: databaseNote.title,
        description:
          databaseNote.description || '',
        interviewTag:
          databaseNote.interview_tag || '',
        status:
          databaseNote.status,
        position:
          databaseNote.position,
      };

      setUserId(currentUserId);

      setColumns((previous) =>
        previous.map((column) =>
          column.id === 'applied'
            ? {
                ...column,
                cards: [
                  ...column.cards,
                  newCard,
                ],
              }
            : column
        )
      );

      setSelectedCompany(null);
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     DELETE CARD
  ========================================================= */

  const deleteCard = async (
    columnId: string,
    cardId: string
  ) => {
    if (!userId) {
      return;
    }

    setSaving(true);

    try {
      const {
        error,
      } = await supabase
        .from('application_notes')
        .delete()
        .eq('id', cardId)
        .eq('user_id', userId);

      if (error) {
        console.error(
          'Error deleting application note:',
          error
        );

        return;
      }

      const nextColumns =
        columns.map(
          (column) =>
            column.id === columnId
              ? {
                  ...column,
                  cards:
                    column.cards.filter(
                      (card) =>
                        card.id !==
                        cardId
                    ),
                }
              : column
        );

      /*
       * Re-number remaining cards.
       */
      nextColumns.forEach(
        (column) => {
          column.cards =
            column.cards.map(
              (card, index) => ({
                ...card,
                position:
                  index,
              })
            );
        }
      );

      setColumns(nextColumns);

      /*
       * Persist the new positions.
       */
      await savePositions(
        nextColumns
      );

      if (
        editingCard === cardId
      ) {
        cancelEditingCard();
      }
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     EDIT CARD
  ========================================================= */

  const startEditingCard = (
    card: Card
  ) => {
    setEditingCard(
      card.id
    );

    setEditingCardTitle(
      card.title
    );

    setEditingCardDescription(
      card.description
    );

    setEditingCardInterviewTag(
      card.interviewTag
    );
  };

  const saveCard = async () => {
    if (!editingCard) {
      return;
    }

    const title =
      editingCardTitle.trim();

    if (!title) {
      return;
    }

    if (!userId) {
      return;
    }

    const currentCard =
      columns
        .flatMap((column) =>
          column.cards
        )
        .find(
          (card) =>
            card.id === editingCard
        );

    const canUseInterviewTag =
      currentCard
        ? INTERVIEW_TAG_STATUSES.includes(
            currentCard.status
          )
        : false;

    setSaving(true);

    try {
      const description =
        editingCardDescription.trim();

      const interviewTag =
        canUseInterviewTag
          ? editingCardInterviewTag.trim()
          : '';

      const {
        data,
        error,
      } = await supabase
        .from('application_notes')
        .update({
          title,
          description,
          interview_tag:
            interviewTag || null,
        })
        .eq('id', editingCard)
        .eq('user_id', userId)
        .select(
          NOTE_SELECT_FIELDS
        )
        .single();

      if (error || !data) {
        console.error(
          'Error updating application note:',
          error
        );

        return;
      }

      const updatedNote =
        data as SupabaseNote;

      const nextColumns =
        columns.map(
          (column) => ({
            ...column,
            cards:
              column.cards.map(
                (card) =>
                  card.id ===
                  editingCard
                    ? {
                        ...card,
                        title:
                          updatedNote.title,
                        description:
                          updatedNote.description ||
                          '',
                        interviewTag:
                          updatedNote.interview_tag ||
                          '',
                      }
                    : card
              ),
          })
        );

      setColumns(nextColumns);

      cancelEditingCard();
    } finally {
      setSaving(false);
    }
  };

  const cancelEditingCard = () => {
    setEditingCard(null);
    setEditingCardTitle('');
    setEditingCardDescription('');
    setEditingCardInterviewTag('');
  };

  /* =========================================================
     FIND COLUMN
  ========================================================= */

  const findColumn = (
    cardId: string
  ) => {
    return columns.find(
      (column) =>
        column.cards.some(
          (card) =>
            card.id === cardId
        )
    );
  };

  /* =========================================================
     DRAG START
  ========================================================= */

  const handleDragStart = (
    event: DragStartEvent
  ) => {
    const id =
      String(event.active.id);

    const column =
      columns.find(
        (item) =>
          item.id === id
      );

    if (column) {
      setActiveColumn(column);
      return;
    }

    const cardColumn =
      findColumn(id);

    const card =
      cardColumn?.cards.find(
        (item) =>
          item.id === id
      );

    if (card) {
      setActiveCard(card);
    }
  };

  /* =========================================================
     DRAG CANCEL
  ========================================================= */

  const handleDragCancel = () => {
    setActiveCard(null);
    setActiveColumn(null);
  };

  /* =========================================================
     DRAG END
  ========================================================= */

  const handleDragEnd = async (
    event: DragEndEvent
  ) => {
    const {
      active,
      over,
    } = event;

    setActiveCard(null);
    setActiveColumn(null);

    if (!over) {
      return;
    }

    const activeId =
      String(active.id);

    const overId =
      String(over.id);

    /* =====================================================
       COLUMN DRAG
    ===================================================== */

    const oldColumnIndex =
      columns.findIndex(
        (column) =>
          column.id === activeId
      );

    const newColumnIndex =
      columns.findIndex(
        (column) =>
          column.id === overId
      );

    /*
     * Columns are only UI configuration
     * in this version.
     *
     * There is no localStorage and no
     * columns table, so column order
     * remains frontend-defined.
     */
    if (
      oldColumnIndex !== -1 &&
      newColumnIndex !== -1
    ) {
      if (
        oldColumnIndex !==
        newColumnIndex
      ) {
        const nextColumns =
          arrayMove(
            columns,
            oldColumnIndex,
            newColumnIndex
          );

        setColumns(nextColumns);
      }

      return;
    }

    /* =====================================================
       CARD DRAG
    ===================================================== */

    const sourceColumn =
      findColumn(activeId);

    if (!sourceColumn) {
      return;
    }

    const destinationColumn =
      columns.find(
        (column) =>
          column.id === overId
      );

    /* =====================================================
       DROP DIRECTLY ON COLUMN
    ===================================================== */

    if (destinationColumn) {
      if (
        sourceColumn.id ===
        destinationColumn.id
      ) {
        return;
      }

      const card =
        sourceColumn.cards.find(
          (item) =>
            item.id === activeId
        );

      if (!card) {
        return;
      }

      const nextColumns =
        columns.map(
          (column) => ({
            ...column,
            cards: [
              ...column.cards,
            ],
          })
        );

      const source =
        nextColumns.find(
          (column) =>
            column.id ===
            sourceColumn.id
        );

      const destination =
        nextColumns.find(
          (column) =>
            column.id ===
            destinationColumn.id
        );

      if (
        !source ||
        !destination
      ) {
        return;
      }

      source.cards =
        source.cards.filter(
          (item) =>
            item.id !== activeId
        );

      destination.cards.push({
        ...card,
        status:
          destination.id,
      });

      /*
       * Re-number both columns.
       */
      source.cards =
        source.cards.map(
          (item, index) => ({
            ...item,
            position:
              index,
            status:
              source.id,
          })
        );

      destination.cards =
        destination.cards.map(
          (item, index) => ({
            ...item,
            position:
              index,
            status:
              destination.id,
          })
        );

      setColumns(nextColumns);

      setSaving(true);

      try {
        await savePositions(
          nextColumns
        );
      } finally {
        setSaving(false);
      }

      return;
    }

    /* =====================================================
       DROP ON CARD
    ===================================================== */

    const destination =
      findColumn(overId);

    if (!destination) {
      return;
    }

    /* =====================================================
       SAME COLUMN
    ===================================================== */

    if (
      sourceColumn.id ===
      destination.id
    ) {
      const oldIndex =
        sourceColumn.cards.findIndex(
          (card) =>
            card.id ===
            activeId
        );

      const newIndex =
        sourceColumn.cards.findIndex(
          (card) =>
            card.id ===
            overId
        );

      if (
        oldIndex === -1 ||
        newIndex === -1 ||
        oldIndex === newIndex
      ) {
        return;
      }

      const movedCards =
        arrayMove(
          sourceColumn.cards,
          oldIndex,
          newIndex
        ).map(
          (card, index) => ({
            ...card,
            position:
              index,
            status:
              sourceColumn.id,
          })
        );

      const nextColumns =
        columns.map(
          (column) =>
            column.id ===
            sourceColumn.id
              ? {
                  ...column,
                  cards:
                    movedCards,
                }
              : column
        );

      setColumns(nextColumns);

      setSaving(true);

      try {
        await savePositions(
          nextColumns
        );
      } finally {
        setSaving(false);
      }

      return;
    }

    /* =====================================================
       MOVE BETWEEN COLUMNS
    ===================================================== */

    const card =
      sourceColumn.cards.find(
        (item) =>
          item.id === activeId
      );

    if (!card) {
      return;
    }

    const nextColumns =
      columns.map(
        (column) => ({
          ...column,
          cards: [
            ...column.cards,
          ],
        })
      );

    const source =
      nextColumns.find(
        (column) =>
          column.id ===
          sourceColumn.id
      );

    const destinationColumn2 =
      nextColumns.find(
        (column) =>
          column.id ===
          destination.id
      );

    if (
      !source ||
      !destinationColumn2
    ) {
      return;
    }

    source.cards =
      source.cards.filter(
        (item) =>
          item.id !== activeId
      );

    const destinationIndex =
      destinationColumn2.cards.findIndex(
        (item) =>
          item.id === overId
      );

    const movedCard: Card = {
      ...card,
      status:
        destinationColumn2.id,
    };

    if (
      destinationIndex === -1
    ) {
      destinationColumn2.cards.push(
        movedCard
      );
    } else {
      destinationColumn2.cards.splice(
        destinationIndex,
        0,
        movedCard
      );
    }

    /*
     * Re-number all affected cards.
     */
    source.cards =
      source.cards.map(
        (item, index) => ({
          ...item,
          status:
            source.id,
          position:
            index,
        })
      );

    destinationColumn2.cards =
      destinationColumn2.cards.map(
        (item, index) => ({
          ...item,
          status:
            destinationColumn2.id,
          position:
            index,
        })
      );

    setColumns(nextColumns);

    setSaving(true);

    try {
      await savePositions(
        nextColumns
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const searchQuery =
    search.trim().toLowerCase();

  const filteredCards = (
    cards: Card[]
  ) => {
    if (!searchQuery) {
      return cards;
    }

    return cards.filter(
      (card) =>
        `${card.title} ${card.description} ${card.interviewTag}`
          .toLowerCase()
          .includes(searchQuery)
    );
  };

  const filteredCompanies =
    searchQuery
      ? companies.filter((company) =>
          [
            company.name,
            company.role,
            company.location,
            company.description,
            company.website,
          ]
            .join(' ')
            .toLowerCase()
            .includes(searchQuery)
        )
      : companies;

  /* =========================================================
     TOTAL
  ========================================================= */

  const totalCards =
    columns.reduce(
      (total, column) =>
        total +
        column.cards.length,
      0
    );

  const displayedCompanies =
    showAllCompanies
      ? filteredCompanies
      : filteredCompanies.slice(0, 3);

  const newCardColumnData =
    columns.find(
      (column) =>
        column.id ===
        newCardColumn
    );

  const editingCardData =
    editingCard
      ? columns
          .flatMap((column) =>
            column.cards
          )
          .find(
            (card) =>
              card.id === editingCard
          ) || null
      : null;

  const showEditingInterviewTag =
    editingCardData
      ? INTERVIEW_TAG_STATUSES.includes(
          editingCardData.status
        )
      : false;

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <DndContext
      id="application-board-dnd"
      sensors={sensors}
      collisionDetection={
        closestCorners
      }
      onDragStart={
        handleDragStart
      }
      onDragCancel={
        handleDragCancel
      }
      onDragEnd={
        handleDragEnd
      }
    >
      <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#f5f7fb]">

        {/* =================================================
            BLUE LIGHTING
        ================================================= */}

        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">

          <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-blue-500/10 blur-3xl blue-glow-animation" />

          <div
            className="absolute -bottom-48 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl blue-glow-animation"
            style={{
              animationDelay: '1.5s',
            }}
          />

          <div
            className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-blue-400/5 blur-3xl blue-glow-animation"
            style={{
              animationDelay: '3s',
            }}
          />

        </div>

        {/* =================================================
            GRID
        ================================================= */}

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.28] z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #cbd5e1 1px, transparent 1px),
              linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage:
              'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          }}
        />

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="relative z-40 w-full shrink-0 pt-7 pb-3 bg-transparent">

          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-header-in">

              <div>

                <div className="flex items-center gap-2 mb-1.5">

                  <div className="w-2 h-2 rounded-full bg-blue-600" />

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                    Applications
                  </p>

                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
                  Application Board
                </h1>

                <p className="mt-1.5 text-sm text-slate-500">
                  Organize and track your OJT and internship applications.
                </p>

              </div>

              <div className="flex items-center gap-2">

                {saving && (
                  <div className="text-[11px] text-blue-500">
                    Saving...
                  </div>
                )}

                <button
                  type="button"
                  onClick={
                    refreshBoard
                  }
                  disabled={saving}
                  className="w-9 h-9 rounded-xl bg-white/80 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-white transition-all disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw
                    size={15}
                    className={
                      saving
                        ? 'animate-spin'
                        : ''
                    }
                  />
                </button>

              </div>

            </header>

          </div>

        </div>

        {/* =================================================
            MAIN
        ================================================= */}

        <main
          className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full scroll-smooth scrollbar-hide"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0px, black 20px, black calc(100% - 50px), transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0px, black 20px, black calc(100% - 50px), transparent 100%)',
          }}
        >

          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-5 pb-28">

            {/* =================================================
                SEARCH
            ================================================= */}

            <section className="mb-4">

              <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-3 shadow-sm">

                <div className="flex flex-col sm:flex-row gap-2.5">

                  <div className="relative flex-1">

                    <Search
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target.value
                        )
                      }
                      placeholder="Search applications or notes..."
                      className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />

                  </div>

                  <button
                    type="button"
                    className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                  >
                    <SlidersHorizontal
                      size={15}
                    />

                    Filter
                  </button>

                  <button
                    type="button"
                    className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Latest
                  </button>

                </div>

              </div>

            </section>

            {/* =================================================
                COMPANIES
            ================================================= */}

            <section className="mb-5">

              <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-md shadow-slate-900/5 overflow-hidden">

                <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">

                      <BriefcaseBusiness
                        size={17}
                        className="text-blue-600"
                      />

                    </div>

                    <div>

                      <h2 className="text-sm font-extrabold text-slate-900">
                        Recommended Companies
                      </h2>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Browse Supabase companies and apply with one click.
                      </p>

                    </div>

                  </div>

                  <div className="flex shrink-0 items-center gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setCompaniesHidden(
                          (previous) =>
                            !previous
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 transition-colors whitespace-nowrap"
                    >
                      {companiesHidden
                        ? 'Show'
                        : 'Hide'}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setShowAllCompanies(
                          true
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:border-blue-200 hover:bg-blue-100 transition-colors whitespace-nowrap"
                    >
                      View all

                      <span className="text-blue-400">
                        ({filteredCompanies.length})
                      </span>

                      <ArrowUpRight
                        size={13}
                      />
                    </button>

                  </div>

                </div>

                {!companiesHidden && (

                  <div className="p-3.5">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                      {displayedCompanies.length === 0 && (
                        <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center text-sm text-slate-400">
                          No companies match your search.
                        </div>
                      )}

                      {displayedCompanies.map(
                        (company) => (

                          <button
                            key={
                              company.id
                            }
                            type="button"
                            onClick={() =>
                              setSelectedCompany(
                                company
                              )
                            }
                            className="group relative overflow-hidden text-left rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-lg hover:shadow-blue-950/5 transition-all p-3.5"
                          >
                            <div className="absolute inset-x-0 top-0 h-1 bg-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />

                            <div className="flex items-start gap-3">

                              <CompanyLogo
                                company={company}
                                className="w-10 h-10 shrink-0 rounded-xl transition-colors group-hover:border-blue-200"
                              />

                              <div className="min-w-0 flex-1">

                                <div className="flex items-start justify-between gap-2">

                                  <h3 className="text-sm font-extrabold text-slate-900 truncate">
                                    {
                                      company.name
                                    }
                                  </h3>

                                  <ArrowUpRight
                                    size={13}
                                    className="shrink-0 text-slate-300 group-hover:text-blue-500"
                                  />

                                </div>

                                <p className="mt-1 text-[11px] text-blue-600 font-bold truncate">
                                  {
                                    company.role
                                  }
                                </p>

                                <div className="flex items-center gap-1 mt-2 text-[10px] font-medium text-slate-400">

                                  <MapPin
                                    size={11}
                                  />

                                  <span className="truncate">
                                    {
                                      company.location
                                    }
                                  </span>

                                </div>

                                <p className="mt-2 text-[11px] leading-4 text-slate-500 line-clamp-2">
                                  {
                                    company.description ||
                                    'No description added yet.'
                                  }
                                </p>

                              </div>

                            </div>

                          </button>

                        )
                      )}

                    </div>

                  </div>

                )}

              </div>

            </section>

            {/* =================================================
                BOARD
            ================================================= */}

            <section>

              <div className="overflow-x-auto pb-4">

                <div className="grid min-w-[1120px] grid-cols-5 gap-4 items-start">

                  {columns.map(
                    (column) => (

                      <SortableColumn
                        key={
                          column.id
                        }
                        column={
                          column
                        }
                        cards={filteredCards(
                          column.cards
                        )}
                        totalCards={
                          totalCards
                        }
                        openAddNote={
                          openAddNote
                        }
                        editingCard={
                          editingCard
                        }
                        editingCardTitle={
                          editingCardTitle
                        }
                        editingCardDescription={
                          editingCardDescription
                        }
                        setEditingCardTitle={
                          setEditingCardTitle
                        }
                        setEditingCardDescription={
                          setEditingCardDescription
                        }
                        startEditingCard={
                          startEditingCard
                        }
                        saveCard={
                          saveCard
                        }
                        cancelEditingCard={
                          cancelEditingCard
                        }
                        deleteCard={
                          deleteCard
                        }
                      />

                    )
                  )}

                </div>

              </div>

            </section>

            {/* =================================================
                INFO
            ================================================= */}

            <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-slate-400">

              <span>
                {loadingNotes
                  ? 'Loading applications...'
                  : `${totalCards} application${
                      totalCards !== 1
                        ? 's'
                        : ''
                    }`}
              </span>

              <span>
                Drag columns to rearrange them · Drag notes to change status.
              </span>

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="text-center pt-7 pb-6">

              <p className="text-xs text-slate-400">
                Application Tracker · Software Engineering 2
              </p>

              <p className="text-[10px] text-slate-300 mt-1">
                Version 1.0.0
              </p>

            </footer>

          </div>

        </main>

        {/* =================================================
            BOTTOM FADE
        ================================================= */}

        <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#f5f7fb] via-[#f5f7fb]/80 to-transparent z-30 pointer-events-none" />

        {/* =================================================
            DRAG OVERLAY
        ================================================= */}

        <DragOverlay>

          {activeCard ? (

            <div className="w-[220px] bg-white border border-blue-200 rounded-xl p-3 shadow-2xl rotate-2 cursor-grabbing">

              <div className="flex items-start gap-2">

                <GripVertical
                  size={15}
                  className="mt-0.5 text-slate-300 shrink-0"
                />

                <div className="min-w-0">

                  <p className="text-xs font-bold text-slate-800 break-words">
                    {
                      activeCard.title
                    }
                  </p>

                  {activeCard.description && (

                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500 line-clamp-3">
                      {
                        activeCard.description
                      }
                    </p>

                  )}

                </div>

              </div>

            </div>

          ) : activeColumn ? (

            <div
              className={`w-full rounded-2xl border shadow-2xl rotate-1 overflow-hidden ${activeColumn.color.background} ${activeColumn.color.border}`}
            >

              <div
                className={`px-3 py-2.5 ${activeColumn.color.header}`}
              >

                <div className="flex items-center gap-2">

                  <GripVertical
                    size={15}
                    className="text-slate-500"
                  />

                  <span className="text-xs font-bold text-slate-800">
                    {
                      activeColumn.title
                    }
                  </span>

                </div>

              </div>

              <div className="p-2">

                {activeColumn.cards
                  .slice(0, 2)
                  .map((card) => (

                    <div
                      key={
                        card.id
                      }
                      className="bg-white border border-slate-200 rounded-lg p-2 mb-1.5 text-[10px] text-slate-600"
                    >
                      {
                        card.title
                      }
                    </div>

                  ))}

              </div>

            </div>

          ) : null}

        </DragOverlay>

        {/* =================================================
            ADD NOTE MODAL
        ================================================= */}

        {newCardColumn &&
          newCardColumnData && (

            <div
              className="fixed inset-0 z-[110] flex items-center justify-center p-5 bg-slate-950/25 backdrop-blur-sm"
              onMouseDown={
                closeAddNote
              }
            >

              <div
                className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 animate-modal-in"
                onMouseDown={(
                  event
                ) =>
                  event.stopPropagation()
                }
              >

                <div className="flex items-start justify-between gap-4 mb-5">

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600">
                      New Note
                    </p>

                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      Add Application Note
                    </h3>

                    <div className="flex items-center gap-1.5 mt-2">

                      <span
                        className={`w-2 h-2 rounded-full ${newCardColumnData.color.dot}`}
                      />

                      <span
                        className={`text-xs font-medium ${newCardColumnData.color.text}`}
                      >
                        {
                          newCardColumnData.title
                        }
                      </span>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={
                      closeAddNote
                    }
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  >
                    <X size={17} />
                  </button>

                </div>

                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Note Title
                </label>

                <input
                  autoFocus
                  type="text"
                  value={
                    newCardTitle
                  }
                  onChange={(
                    event
                  ) =>
                    setNewCardTitle(
                      event.target.value
                    )
                  }
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                      'Enter'
                    ) {
                      addCard(
                        newCardColumn
                      );
                    }

                    if (
                      event.key ===
                      'Escape'
                    ) {
                      closeAddNote();
                    }
                  }}
                  placeholder="Enter note title..."
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />

                <label className="block text-xs font-semibold text-slate-500 mb-1.5 mt-5">
                  Description
                </label>

                <textarea
                  value={
                    newCardDescription
                  }
                  onChange={(
                    event
                  ) =>
                    setNewCardDescription(
                      event.target.value
                    )
                  }
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                        'Enter' &&
                      event.ctrlKey
                    ) {
                      addCard(
                        newCardColumn
                      );
                    }

                    if (
                      event.key ===
                      'Escape'
                    ) {
                      closeAddNote();
                    }
                  }}
                  rows={8}
                  placeholder="Add details about this application..."
                  className="w-full resize-none rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm leading-6 text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />

                <div className="flex items-center justify-between gap-3 mt-5">

                  <p className="text-[10px] text-slate-400">
                    Press Ctrl + Enter to add
                  </p>

                  <div className="flex gap-2">

                    <button
                      type="button"
                      onClick={
                        closeAddNote
                      }
                      className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        addCard(
                          newCardColumn
                        )
                      }
                      disabled={
                        !newCardTitle.trim() ||
                        saving
                      }
                      className="h-10 px-5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                    >

                      <Plus
                        size={14}
                        className="inline mr-1.5"
                      />

                      Add Note

                    </button>

                  </div>

                </div>

              </div>

            </div>

          )}

        {/* =================================================
            EDIT NOTE MODAL
        ================================================= */}

        {editingCard && (

          <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-slate-950/25 backdrop-blur-sm">

            <div
              className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 animate-modal-in"
              onPointerDown={(
                event
              ) =>
                event.stopPropagation()
              }
            >

              <div className="flex items-start justify-between gap-4 mb-5">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600">
                    Edit Note
                  </p>

                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    Application Note
                  </h3>

                </div>

                <button
                  type="button"
                  onClick={
                    cancelEditingCard
                  }
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={17} />
                </button>

              </div>

              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Note Title
              </label>

              <input
                autoFocus
                type="text"
                value={
                  editingCardTitle
                }
                onChange={(
                  event
                ) =>
                  setEditingCardTitle(
                    event.target.value
                  )
                }
                onKeyDown={(
                  event
                ) => {
                  if (
                    event.key ===
                    'Escape'
                  ) {
                    cancelEditingCard();
                  }
                }}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                placeholder="Enter note title..."
              />

              <label className="block text-xs font-semibold text-slate-500 mb-1.5 mt-5">
                Description
              </label>

              <textarea
                value={
                  editingCardDescription
                }
                onChange={(
                  event
                ) =>
                  setEditingCardDescription(
                    event.target.value
                  )
                }
                rows={8}
                className="w-full resize-none rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm leading-6 text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                placeholder="Add details about this application..."
              />

              {showEditingInterviewTag && (

                <div className="mt-5">

                  <label className="block text-xs font-semibold text-slate-500 mb-2">
                    Interview Tag
                  </label>

                  <div className="flex flex-wrap gap-2 mb-3">

                    {INTERVIEW_TAG_OPTIONS.map(
                      (tag) => (

                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            setEditingCardInterviewTag(
                              tag
                            )
                          }
                          className={`h-8 px-3 rounded-lg border text-[11px] font-bold transition-all ${
                            editingCardInterviewTag ===
                            tag
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800'
                          }`}
                        >
                          {tag}
                        </button>

                      )
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setEditingCardInterviewTag(
                          ''
                        )
                      }
                      className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-bold text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all"
                    >
                      Clear
                    </button>

                  </div>

                  <input
                    type="text"
                    value={
                      editingCardInterviewTag
                    }
                    onChange={(event) =>
                      setEditingCardInterviewTag(
                        event.target.value
                      )
                    }
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Example: 1st Interview"
                  />

                </div>

              )}

              <div className="flex items-center justify-between gap-3 mt-5">

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    const column =
                      findColumn(
                        editingCard
                      );

                    if (column) {
                      deleteCard(
                        column.id,
                        editingCard
                      );
                    }
                  }}
                  className="h-10 px-4 rounded-xl border border-red-100 text-red-500 text-xs font-semibold hover:bg-red-50 disabled:opacity-40"
                >

                  <Trash2
                    size={14}
                    className="inline mr-1.5"
                  />

                  Delete

                </button>

                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={
                      cancelEditingCard
                    }
                    className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      saveCard
                    }
                    disabled={
                      !editingCardTitle.trim() ||
                      saving
                    }
                    className="h-10 px-5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-40 shadow-sm"
                  >

                    <Check
                      size={14}
                      className="inline mr-1.5"
                    />

                    Save Note

                  </button>

                </div>

              </div>

              <p className="text-[10px] text-slate-300 text-center mt-4">
                Tip: drag the note using its handle to change its position or status.
              </p>

            </div>

          </div>

        )}

        {/* =================================================
            COMPANY MODAL
        ================================================= */}

        {selectedCompany && (

          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-5 bg-slate-950/30 backdrop-blur-sm"
            onMouseDown={() =>
              setSelectedCompany(null)
            }
          >

            <div
              className="w-full max-w-2xl max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-modal-in flex flex-col"
              onMouseDown={(
                event
              ) =>
                event.stopPropagation()
              }
            >

              <div className="shrink-0 p-5 border-b border-slate-100 bg-white">

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <CompanyLogo
                      company={selectedCompany}
                      className="w-14 h-14 shrink-0 rounded-xl shadow-sm"
                      iconSize={22}
                    />

                    <div className="min-w-0">

                      <h2 className="text-xl font-extrabold text-slate-900 break-words">
                        {
                          selectedCompany.name
                        }
                      </h2>

                      <p className="text-xs text-blue-600 font-bold mt-1 break-words">
                        {
                          selectedCompany.role
                        }
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCompany(
                        null
                      )
                    }
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X size={17} />
                  </button>

                </div>

              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-5">

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">

                  <div className="flex items-start gap-2 text-xs font-semibold text-slate-500">

                    <MapPin
                      size={14}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />

                    <span className="break-words">
                      {
                        selectedCompany.location ||
                        'No location added.'
                      }
                    </span>

                  </div>

                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">

                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Opportunity Details
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {
                      selectedCompany.description ||
                      'No description added yet.'
                    }
                  </p>

                </div>

              </div>

              <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-slate-100 bg-slate-50/80 p-4">

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCompany(
                        null
                      )
                    }
                    className="h-10 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      applyToCompany(
                        selectedCompany
                      )
                    }
                    className="h-10 rounded-xl bg-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Check
                      size={14}
                    />

                    Applied
                  </button>

                  <a
                    href={
                      selectedCompany.website
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 rounded-xl bg-blue-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-sm"
                  >
                    Visit Website

                    <ExternalLink
                      size={14}
                    />

                  </a>

              </div>

            </div>

          </div>

        )}

        {/* =================================================
            ALL COMPANIES
        ================================================= */}

        {showAllCompanies && (

          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-5 bg-slate-950/30 backdrop-blur-sm"
            onMouseDown={() =>
              setShowAllCompanies(
                false
              )
            }
          >

            <div
              className="w-full max-w-5xl max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-modal-in flex flex-col"
              onMouseDown={(
                event
              ) =>
                event.stopPropagation()
              }
            >

              <div className="shrink-0 p-5 border-b border-slate-100 bg-white flex items-start justify-between gap-4">

                <div>

                  <div className="flex items-center gap-2">

                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">

                      <BriefcaseBusiness
                        size={16}
                        className="text-blue-600"
                      />

                    </div>

                    <h2 className="text-lg font-extrabold text-slate-900">
                      Recommended Companies
                    </h2>

                  </div>

                  <p className="text-xs text-slate-400 mt-1 ml-11">
                    {filteredCompanies.length} compan{
                      filteredCompanies.length === 1
                        ? 'y'
                        : 'ies'
                    } available from Supabase.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowAllCompanies(
                      false
                    )
                  }
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={17} />
                </button>

              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-5">

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">

                  {filteredCompanies.length === 0 && (
                    <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center text-sm text-slate-400">
                      No companies match your search.
                    </div>
                  )}

                  {filteredCompanies.map(
                    (company) => (

                      <button
                        key={
                          company.id
                        }
                        type="button"
                        onClick={() => {
                          setShowAllCompanies(
                            false
                          );

                          setSelectedCompany(
                            company
                          );
                        }}
                        className="group relative overflow-hidden text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-lg hover:shadow-blue-950/5 transition-all"
                      >
                        <div className="absolute inset-x-0 top-0 h-1 bg-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />

                        <div className="flex items-start gap-3">

                          <CompanyLogo
                            company={company}
                            className="w-11 h-11 shrink-0 rounded-xl transition-colors group-hover:border-blue-200"
                            iconSize={18}
                          />

                          <div className="flex-1 min-w-0">

                            <div className="flex items-start justify-between gap-3">

                              <h3 className="text-sm font-extrabold text-slate-900 line-clamp-2">
                                {
                                  company.name
                                }
                              </h3>

                              <ArrowUpRight
                                size={15}
                                className="text-slate-300 group-hover:text-blue-500 shrink-0"
                              />

                            </div>

                            <p className="text-xs text-blue-600 font-bold mt-1 line-clamp-2">
                              {
                                company.role
                              }
                            </p>

                            <div className="flex items-start gap-1 mt-2 text-[11px] text-slate-400">

                              <MapPin
                                size={11}
                                className="mt-0.5 shrink-0"
                              />

                              <span className="line-clamp-1">
                                {
                                  company.location
                                }
                              </span>

                            </div>

                            <p className="mt-3 text-xs leading-5 text-slate-500 line-clamp-2">
                              {
                                company.description ||
                                'No description added yet.'
                              }
                            </p>

                          </div>

                        </div>

                      </button>

                    )
                  )}

                </div>

              </div>

            </div>

          </div>

        )}

      </div>
    </DndContext>
  );
}

/* =========================================================
   SORTABLE COLUMN PROPS
========================================================= */

type SortableColumnProps = {
  column: Column;
  cards: Card[];
  totalCards: number;

  openAddNote: (
    columnId: string
  ) => void;

  editingCard: string | null;
  editingCardTitle: string;
  editingCardDescription: string;

  setEditingCardTitle: (
    value: string
  ) => void;

  setEditingCardDescription: (
    value: string
  ) => void;

  startEditingCard: (
    card: Card
  ) => void;

  saveCard: () => void;

  cancelEditingCard: () => void;

  deleteCard: (
    columnId: string,
    cardId: string
  ) => void;
};

/* =========================================================
   SORTABLE COLUMN
========================================================= */

function SortableColumn({
  column,
  cards,
  totalCards,

  openAddNote,

  editingCard,
  editingCardTitle,
  editingCardDescription,

  setEditingCardTitle,
  setEditingCardDescription,

  startEditingCard,
  saveCard,
  cancelEditingCard,
  deleteCard,
}: SortableColumnProps) {
  const {
    setNodeRef: setDropRef,
    isOver,
  } = useDroppable({
    id: column.id,
  });

  const visibleCount = cards.length;
  const columnCount = column.cards.length;
  const progress =
    totalCards > 0
      ? Math.round(
          (columnCount / totalCards) * 100
        )
      : 0;

  return (
    <div
      ref={setDropRef}
      className="min-w-0 w-full transition-all"
    >

      <div
        className={`relative overflow-hidden rounded-2xl border p-3 min-h-[520px] transition-all ${column.color.background} ${column.color.border} ${
          isOver
            ? 'shadow-2xl shadow-slate-900/15 scale-[1.01] ring-2 ring-white'
            : 'shadow-md shadow-slate-900/5'
        }`}
      >
        <div
          className={`absolute inset-x-0 top-0 h-2 ${column.color.gradient}`}
        />

        {/* HEADER */}

        <div
          className={`relative rounded-xl mb-3 border ${column.color.border} bg-white/90 px-3 py-3.5 shadow-sm shadow-slate-900/5 backdrop-blur select-none`}
        >

          <div className="flex items-start justify-between gap-2">

            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-2.5 h-2.5 rounded-full shadow-sm ${column.color.dot}`}
                />

                <h2
                  className={`text-[13px] font-extrabold truncate ${column.color.text}`}
                >
                  {
                    column.title
                  }
                </h2>
              </div>

              <p className="mt-1 text-[10px] leading-4 text-slate-500 truncate">
                {
                  column.description
                }
              </p>
            </div>

            <span className={`min-w-8 h-8 px-2 rounded-full border ${column.color.border} ${column.color.header} flex items-center justify-center text-[11px] font-extrabold ${column.color.text} shadow-sm`}>
              {
                columnCount
              }
            </span>

          </div>

          <div className="mt-3.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${column.color.dot} transition-all`}
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-slate-400">
            <span>
              {progress}% of board
            </span>

            {visibleCount !== columnCount && (
              <span>
                {visibleCount} shown
              </span>
            )}
          </div>

        </div>

        {/* CARDS */}

        <SortableContext
          items={cards.map(
            (card) =>
              card.id
          )}
          strategy={
            verticalListSortingStrategy
          }
        >

          <div className="space-y-3">

            {cards.map((card) => (

              <SortableCard
                key={
                  card.id
                }
                card={
                  card
                }
                columnId={
                  column.id
                }
                editingCard={
                  editingCard
                }
                editingCardTitle={
                  editingCardTitle
                }
                editingCardDescription={
                  editingCardDescription
                }
                setEditingCardTitle={
                  setEditingCardTitle
                }
                setEditingCardDescription={
                  setEditingCardDescription
                }
                startEditingCard={
                  startEditingCard
                }
                saveCard={
                  saveCard
                }
                cancelEditingCard={
                  cancelEditingCard
                }
                deleteCard={
                  deleteCard
                }
              />

            ))}

          </div>

        </SortableContext>

        {/* EMPTY */}

        {cards.length === 0 && (

          <div
            className={`border border-dashed rounded-xl min-h-[150px] flex flex-col items-center justify-center text-center px-3 transition-all ${
              isOver
                ? 'border-slate-500 bg-white/80 shadow-inner'
                : 'border-white/90 bg-white/45'
            }`}
          >

            <div className={`w-10 h-10 rounded-xl ${column.color.header} border ${column.color.border} flex items-center justify-center shadow-sm`}>

              <Plus
                size={18}
                className={column.color.text}
              />

            </div>

            <p className="mt-2 text-[11px] font-semibold text-slate-500">
              Drop notes here
            </p>

          </div>

        )}

        {/* ADD NOTE */}

        <div className="mt-3">

          <button
            type="button"
            onClick={() =>
              openAddNote(
                column.id
              )
            }
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/80 bg-white/45 text-[11px] font-bold text-slate-500 shadow-sm shadow-slate-900/5 hover:text-slate-900 hover:bg-white hover:border-white transition-all"
          >

            <Plus
              size={14}
            />

            Add sticky note

          </button>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   SORTABLE CARD PROPS
========================================================= */

type SortableCardProps = {
  card: Card;
  columnId: string;

  editingCard: string | null;

  editingCardTitle: string;

  editingCardDescription: string;

  setEditingCardTitle: (
    value: string
  ) => void;

  setEditingCardDescription: (
    value: string
  ) => void;

  startEditingCard: (
    card: Card
  ) => void;

  saveCard: () => void;

  cancelEditingCard: () => void;

  deleteCard: (
    columnId: string,
    cardId: string
  ) => void;
};

/* =========================================================
   SORTABLE CARD
========================================================= */

function SortableCard({
  card,
  columnId,

  editingCard,

  startEditingCard,

  deleteCard,
}: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  });

  const style = {
    transform:
      CSS.Transform.toString(
        transform
      ),
    transition,
    touchAction: 'none',
  };

  const isEditing =
    editingCard ===
    card.id;

  const showInterviewTag =
    Boolean(card.interviewTag) &&
    INTERVIEW_TAG_STATUSES.includes(
      card.status
    );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative overflow-hidden cursor-grab bg-[#fffdf7] border border-slate-200/90 rounded-xl p-3 shadow-sm shadow-slate-900/5 transition-all active:cursor-grabbing ${
        isDragging
          ? 'opacity-30 scale-[0.98]'
          : 'hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-900/10 hover:border-slate-300'
      } ${
        isEditing
          ? 'ring-2 ring-blue-500/20 border-blue-300'
          : ''
      }`}
    >
      <div
        onClick={() =>
          startEditingCard(
            card
          )
        }
        className="cursor-pointer"
      >

        <div className="flex items-start gap-2">

          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="mt-0.5 shrink-0 rounded-md text-slate-300 transition-colors group-hover:text-slate-500"
            title="Drag note"
          >

            <GripVertical
              size={14}
            />

          </div>

          <div className="min-w-0 flex-1">

            <p className="text-xs font-bold leading-5 text-slate-800 break-words">
              {
                card.title
              }
            </p>

            {showInterviewTag && (

              <span className="mt-1 inline-flex max-w-full items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-extrabold uppercase text-amber-700">
                <span className="truncate">
                  {card.interviewTag}
                </span>
              </span>

            )}

            {card.description ? (

              <p className="mt-1 text-[10px] leading-4 text-slate-500 line-clamp-3 break-words">
                {
                  card.description
                }
              </p>

            ) : (

              <p className="mt-1 text-[10px] italic text-slate-300">
                No description
              </p>

            )}

          </div>

        </div>

      </div>

      <div className="flex justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">

        <button
          type="button"
          onPointerDown={(
            event
          ) =>
            event.stopPropagation()
          }
          onClick={() =>
            startEditingCard(
              card
            )
          }
          className="w-6 h-6 rounded-md bg-white/80 border border-slate-200/80 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50"
          title="Edit note"
        >

          <Pencil size={11} />

        </button>

        <button
          type="button"
          onPointerDown={(
            event
          ) =>
            event.stopPropagation()
          }
          onClick={() =>
            deleteCard(
              columnId,
              card.id
            )
          }
          className="w-6 h-6 rounded-md bg-white/80 border border-slate-200/80 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50"
          title="Delete note"
        >

          <Trash2 size={11} />

        </button>

      </div>

    </div>
  );
}
