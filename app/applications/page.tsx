'use client';

import { useEffect, useState } from 'react';

import {
  DndContext,
  DragEndEvent,
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
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import {
  Search,
  SlidersHorizontal,
  Trash2,
  Pencil,
  Check,
  GripVertical,
  StickyNote,
  X,
  Save,
} from 'lucide-react';

/* ================================================= */
/* TYPES */
/* ================================================= */

type ColumnColor = {
  name: string;
  dot: string;
  background: string;
  border: string;
  header: string;
  text: string;
};

type Card = {
  id: string;
  title: string;
  description: string;
};

type Column = {
  id: string;
  title: string;
  color: ColumnColor;
  cards: Card[];
};

/* ================================================= */
/* COLUMN COLORS */
/* ================================================= */

const COLUMN_COLORS: ColumnColor[] = [
  {
    name: 'Blue',
    dot: 'bg-blue-500',
    background: 'bg-blue-50',
    border: 'border-blue-200',
    header: 'bg-blue-100',
    text: 'text-blue-700',
  },

  {
    name: 'Purple',
    dot: 'bg-purple-500',
    background: 'bg-purple-50',
    border: 'border-purple-200',
    header: 'bg-purple-100',
    text: 'text-purple-700',
  },

  {
    name: 'Amber',
    dot: 'bg-amber-500',
    background: 'bg-amber-50',
    border: 'border-amber-200',
    header: 'bg-amber-100',
    text: 'text-amber-700',
  },

  {
    name: 'Green',
    dot: 'bg-emerald-500',
    background: 'bg-emerald-50',
    border: 'border-emerald-200',
    header: 'bg-emerald-100',
    text: 'text-emerald-700',
  },

  {
    name: 'Red',
    dot: 'bg-red-500',
    background: 'bg-red-50',
    border: 'border-red-200',
    header: 'bg-red-100',
    text: 'text-red-700',
  },
];

/* ================================================= */
/* INITIAL BOARD */
/* ================================================= */

const INITIAL_COLUMNS: Column[] = [
  {
    id: 'applied',
    title: 'Applied',
    color: COLUMN_COLORS[0],
    cards: [],
  },

  {
    id: 'screening',
    title: 'Screening',
    color: COLUMN_COLORS[1],
    cards: [],
  },

  {
    id: 'interview',
    title: 'Interview',
    color: COLUMN_COLORS[2],
    cards: [],
  },

  {
    id: 'offer',
    title: 'Offer',
    color: COLUMN_COLORS[3],
    cards: [],
  },

  {
    id: 'rejected',
    title: 'Rejected',
    color: COLUMN_COLORS[4],
    cards: [],
  },
];

/* ================================================= */
/* MAIN PAGE */
/* ================================================= */

export default function ApplicationsPage() {
  const [columns, setColumns] =
    useState<Column[]>(INITIAL_COLUMNS);

  const [search, setSearch] =
    useState('');

  const [activeCard, setActiveCard] =
    useState<Card | null>(null);

  const [activeColumn, setActiveColumn] =
    useState<Column | null>(null);

  const [editingColumn, setEditingColumn] =
    useState<string | null>(null);

  const [editingColumnName, setEditingColumnName] =
    useState('');

  const [editingColumnColor, setEditingColumnColor] =
    useState<ColumnColor>(COLUMN_COLORS[0]);

  const [editingCard, setEditingCard] =
    useState<string | null>(null);

  const [editingCardTitle, setEditingCardTitle] =
    useState('');

  const [editingCardDescription, setEditingCardDescription] =
    useState('');

  const [newCardColumn, setNewCardColumn] =
    useState<string | null>(null);

  const [newCardTitle, setNewCardTitle] =
    useState('');

  const [newCardDescription, setNewCardDescription] =
    useState('');

  /* ================================================= */
  /* DRAG SENSOR */
  /* ================================================= */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  /* ================================================= */
  /* LOAD BOARD */
  /* ================================================= */

  useEffect(() => {
    const saved =
      localStorage.getItem(
        'application-kanban'
      );

    if (!saved) return;

    try {
      const parsed =
        JSON.parse(saved);

      if (!Array.isArray(parsed)) return;

      /*
       * Supports the previous version of the board.
       * Old notes used "text", so convert them into
       * the new title/description format.
       */
      const migratedColumns: Column[] =
        parsed.map((column: any) => ({
          ...column,

          cards: Array.isArray(column.cards)
            ? column.cards.map((card: any) => ({
                id: card.id,
                title:
                  card.title ??
                  card.text ??
                  'Untitled Note',
                description:
                  card.description ?? '',
              }))
            : [],
        }));

      /*
       * Make sure Screening exists for boards
       * saved before this update.
       */
      const hasScreening =
        migratedColumns.some(
          column =>
            column.id === 'screening'
        );

      if (!hasScreening) {
        const appliedIndex =
          migratedColumns.findIndex(
            column =>
              column.id === 'applied'
          );

        const screeningColumn: Column = {
          id: 'screening',
          title: 'Screening',
          color: COLUMN_COLORS[1],
          cards: [],
        };

        if (appliedIndex !== -1) {
          migratedColumns.splice(
            appliedIndex + 1,
            0,
            screeningColumn
          );
        } else {
          migratedColumns.unshift(
            screeningColumn
          );
        }
      }

      setColumns(
        migratedColumns
      );
    } catch {
      setColumns(
        INITIAL_COLUMNS
      );
    }
  }, []);

  /* ================================================= */
  /* SAVE BOARD */
  /* ================================================= */

  useEffect(() => {
    localStorage.setItem(
      'application-kanban',
      JSON.stringify(columns)
    );
  }, [columns]);

  /* ================================================= */
  /* FIND CARD COLUMN */
  /* ================================================= */

  const findColumn = (
    cardId: string
  ) => {
    return columns.find(
      column =>
        column.cards.some(
          card =>
            card.id === cardId
        )
    );
  };

  /* ================================================= */
  /* ADD CARD */
  /* ================================================= */

  const addCard = (
    columnId: string
  ) => {
    const title =
      newCardTitle.trim();

    if (!title) return;

    const card: Card = {
      id:
        `card-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,

      title,

      description:
        newCardDescription.trim(),
    };

    setColumns(
      previous =>
        previous.map(
          column =>
            column.id === columnId
              ? {
                  ...column,

                  cards: [
                    ...column.cards,
                    card,
                  ],
                }
              : column
        )
    );

    setNewCardTitle('');
    setNewCardDescription('');
    setNewCardColumn(null);
  };

  /* ================================================= */
  /* DELETE CARD */
  /* ================================================= */

  const deleteCard = (
    columnId: string,
    cardId: string
  ) => {
    setColumns(
      previous =>
        previous.map(
          column =>
            column.id === columnId
              ? {
                  ...column,

                  cards:
                    column.cards.filter(
                      card =>
                        card.id !==
                        cardId
                    ),
                }
              : column
        )
    );

    if (
      editingCard === cardId
    ) {
      closeCardEditor();
    }
  };

  /* ================================================= */
  /* OPEN CARD EDITOR */
  /* ================================================= */

  const openCardEditor = (
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
  };

  /* ================================================= */
  /* CLOSE CARD EDITOR */
  /* ================================================= */

  const closeCardEditor = () => {
    setEditingCard(null);
    setEditingCardTitle('');
    setEditingCardDescription('');
  };

  /* ================================================= */
  /* SAVE CARD */
  /* ================================================= */

  const saveCard = () => {
    if (!editingCard) return;

    const title =
      editingCardTitle.trim();

    if (!title) return;

    setColumns(
      previous =>
        previous.map(
          column => ({
            ...column,

            cards:
              column.cards.map(
                card =>
                  card.id ===
                  editingCard
                    ? {
                        ...card,

                        title,

                        description:
                          editingCardDescription.trim(),
                      }
                    : card
              ),
          })
        )
    );

    closeCardEditor();
  };

  /* ================================================= */
  /* START EDIT COLUMN */
  /* ================================================= */

  const startEditingColumn = (
    column: Column
  ) => {
    setEditingColumn(
      column.id
    );

    setEditingColumnName(
      column.title
    );

    setEditingColumnColor(
      column.color
    );
  };

  /* ================================================= */
  /* SAVE COLUMN */
  /* ================================================= */

  const saveColumn = () => {
    if (!editingColumn) return;

    const name =
      editingColumnName.trim();

    if (!name) return;

    setColumns(
      previous =>
        previous.map(
          column =>
            column.id ===
            editingColumn
              ? {
                  ...column,

                  title: name,

                  color:
                    editingColumnColor,
                }
              : column
        )
    );

    setEditingColumn(null);
    setEditingColumnName('');
  };

  /* ================================================= */
  /* DRAG START */
  /* ================================================= */

  const handleDragStart = (
    event: any
  ) => {
    const id =
      String(event.active.id);

    const column =
      columns.find(
        item =>
          item.id === id
      );

    if (column) {
      setActiveColumn(
        column
      );

      return;
    }

    const cardColumn =
      findColumn(id);

    const card =
      cardColumn?.cards.find(
        item =>
          item.id === id
      );

    if (card) {
      setActiveCard(
        card
      );
    }
  };

  /* ================================================= */
  /* DRAG CANCEL */
  /* ================================================= */

  const handleDragCancel = () => {
    setActiveCard(null);
    setActiveColumn(null);
  };

  /* ================================================= */
  /* DRAG END */
  /* ================================================= */

  const handleDragEnd = (
    event: DragEndEvent
  ) => {
    const {
      active,
      over,
    } = event;

    setActiveCard(null);
    setActiveColumn(null);

    if (!over) return;

    const activeId =
      String(active.id);

    const overId =
      String(over.id);

    /* ================================================= */
    /* COLUMN DRAG */
    /* ================================================= */

    const oldColumnIndex =
      columns.findIndex(
        column =>
          column.id ===
          activeId
      );

    const newColumnIndex =
      columns.findIndex(
        column =>
          column.id ===
          overId
      );

    if (
      oldColumnIndex !== -1 &&
      newColumnIndex !== -1
    ) {
      if (
        oldColumnIndex !==
        newColumnIndex
      ) {
        setColumns(
          previous =>
            arrayMove(
              previous,
              oldColumnIndex,
              newColumnIndex
            )
        );
      }

      return;
    }

    /* ================================================= */
    /* CARD DRAG */
    /* ================================================= */

    const sourceColumn =
      findColumn(activeId);

    if (!sourceColumn) return;

    /* ================================================= */
    /* DROPPED ON COLUMN */
    /* ================================================= */

    const destinationColumn =
      columns.find(
        column =>
          column.id ===
          overId
      );

    if (destinationColumn) {
      if (
        sourceColumn.id ===
        destinationColumn.id
      ) {
        return;
      }

      const card =
        sourceColumn.cards.find(
          item =>
            item.id ===
            activeId
        );

      if (!card) return;

      setColumns(
        previous =>
          previous.map(
            column => {
              if (
                column.id ===
                sourceColumn.id
              ) {
                return {
                  ...column,

                  cards:
                    column.cards.filter(
                      item =>
                        item.id !==
                        activeId
                    ),
                };
              }

              if (
                column.id ===
                destinationColumn.id
              ) {
                return {
                  ...column,

                  cards: [
                    ...column.cards,
                    card,
                  ],
                };
              }

              return column;
            }
          )
      );

      return;
    }

    /* ================================================= */
    /* DROPPED ON CARD */
    /* ================================================= */

    const destination =
      findColumn(overId);

    if (!destination) return;

    /* ================================================= */
    /* SAME COLUMN */
    /* ================================================= */

    if (
      sourceColumn.id ===
      destination.id
    ) {
      const oldIndex =
        sourceColumn.cards.findIndex(
          card =>
            card.id ===
            activeId
        );

      const newIndex =
        sourceColumn.cards.findIndex(
          card =>
            card.id ===
            overId
        );

      if (
        oldIndex === -1 ||
        newIndex === -1
      ) {
        return;
      }

      if (
        oldIndex ===
        newIndex
      ) {
        return;
      }

      setColumns(
        previous =>
          previous.map(
            column =>
              column.id ===
              sourceColumn.id
                ? {
                    ...column,

                    cards:
                      arrayMove(
                        column.cards,
                        oldIndex,
                        newIndex
                      ),
                  }
                : column
          )
      );

      return;
    }

    /* ================================================= */
    /* MOVE BETWEEN COLUMNS */
    /* ================================================= */

    const card =
      sourceColumn.cards.find(
        item =>
          item.id ===
          activeId
      );

    if (!card) return;

    setColumns(
      previous => {
        const next =
          previous.map(
            column => ({
              ...column,

              cards: [
                ...column.cards,
              ],
            })
          );

        const source =
          next.find(
            column =>
              column.id ===
              sourceColumn.id
          );

        const destinationColumn =
          next.find(
            column =>
              column.id ===
              destination.id
          );

        if (
          !source ||
          !destinationColumn
        ) {
          return previous;
        }

        source.cards =
          source.cards.filter(
            item =>
              item.id !==
              activeId
          );

        const destinationIndex =
          destinationColumn.cards.findIndex(
            item =>
              item.id ===
              overId
          );

        if (
          destinationIndex ===
          -1
        ) {
          destinationColumn.cards.push(
            card
          );
        } else {
          destinationColumn.cards.splice(
            destinationIndex,
            0,
            card
          );
        }

        return next;
      }
    );
  };

  /* ================================================= */
  /* SEARCH */
  /* ================================================= */

  const filteredCards = (
    cards: Card[]
  ) => {
    if (!search.trim()) {
      return cards;
    }

    const query =
      search.toLowerCase();

    return cards.filter(
      card =>
        card.title
          .toLowerCase()
          .includes(query) ||
        card.description
          .toLowerCase()
          .includes(query)
    );
  };

  /* ================================================= */
  /* TOTAL */
  /* ================================================= */

  const totalCards =
    columns.reduce(
      (total, column) =>
        total +
        column.cards.length,
      0
    );

  /* ================================================= */
  /* RETURN */
  /* ================================================= */

  return (
    <DndContext
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

        {/* ================================================= */}
        {/* BLUE LIGHTING BACKGROUND */}
        {/* ================================================= */}

        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">

          <div
            className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-blue-500/10 blur-3xl blue-glow-animation"
          />

          <div
            className="absolute -bottom-48 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl blue-glow-animation"
            style={{
              animationDelay:
                '1.5s',
            }}
          />

          <div
            className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-blue-400/5 blur-3xl blue-glow-animation"
            style={{
              animationDelay:
                '3s',
            }}
          />

        </div>

        {/* ================================================= */}
        {/* GRID BACKGROUND */}
        {/* ================================================= */}

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35] z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #cbd5e1 1px, transparent 1px),
              linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
            `,

            backgroundSize:
              '48px 48px',

            maskImage:
              'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',

            WebkitMaskImage:
              'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          }}
        />

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="relative z-40 w-full shrink-0 pt-8 pb-4 bg-transparent pointer-events-none">

          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pointer-events-auto">

            <header className="flex items-center justify-between gap-5 animate-header-in">

              <div>

                <div className="flex items-center gap-2 mb-2">

                  <div className="w-2 h-2 rounded-full bg-blue-600" />

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                    Applications
                  </p>

                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
                  Application Board
                </h1>

                <p className="mt-2 text-sm md:text-base text-slate-500">
                  Organize and track your OJT and internship applications.
                </p>

              </div>

            </header>

          </div>

        </div>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <main
          className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full scroll-smooth scrollbar-hide"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',

            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',
          }}
        >

          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-8 pb-32">

            {/* ================================================= */}
            {/* TOOLBAR */}
            {/* ================================================= */}

            <section className="mb-6">

              <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 shadow-sm">

                <div className="flex flex-col lg:flex-row gap-3">

                  <div className="relative flex-1">

                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={event =>
                        setSearch(
                          event.target.value
                        )
                      }
                      placeholder="Search applications or notes..."
                      className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />

                  </div>

                  <button
                    type="button"
                    className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                  >

                    <SlidersHorizontal
                      size={16}
                    />

                    Filter

                  </button>

                  <button
                    type="button"
                    className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Latest
                  </button>

                </div>

              </div>

            </section>

            {/* ================================================= */}
            {/* BOARD */}
            {/* ================================================= */}

            <section>

              <div className="overflow-x-auto pb-8 scrollbar-hide">

                <SortableContext
                  items={
                    columns.map(
                      column =>
                        column.id
                    )
                  }
                  strategy={
                    horizontalListSortingStrategy
                  }
                >

                  <div
                    className="grid grid-cols-5 gap-5 items-start"
                  >

                    {columns.map(
                      column => (

                        <SortableColumn
                          key={
                            column.id
                          }

                          column={
                            column
                          }

                          cards={
                            filteredCards(
                              column.cards
                            )
                          }

                          editingColumn={
                            editingColumn
                          }

                          editingColumnName={
                            editingColumnName
                          }

                          editingColumnColor={
                            editingColumnColor
                          }

                          setEditingColumnName={
                            setEditingColumnName
                          }

                          setEditingColumnColor={
                            setEditingColumnColor
                          }

                          saveColumn={
                            saveColumn
                          }

                          startEditingColumn={
                            startEditingColumn
                          }

                          newCardColumn={
                            newCardColumn
                          }

                          newCardTitle={
                            newCardTitle
                          }

                          newCardDescription={
                            newCardDescription
                          }

                          setNewCardTitle={
                            setNewCardTitle
                          }

                          setNewCardDescription={
                            setNewCardDescription
                          }

                          setNewCardColumn={
                            setNewCardColumn
                          }

                          addCard={
                            addCard
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

                          openCardEditor={
                            openCardEditor
                          }

                          saveCard={
                            saveCard
                          }

                          closeCardEditor={
                            closeCardEditor
                          }

                          deleteCard={
                            deleteCard
                          }

                        />

                      )
                    )}

                  </div>

                </SortableContext>

              </div>

            </section>

            {/* ================================================= */}
            {/* INFO */}
            {/* ================================================= */}

            <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-400">

              <span>

                {totalCards}{' '}
                application
                {totalCards !== 1
                  ? 's'
                  : ''}

              </span>

              <span>
                Drag columns to rearrange them · Drag notes to change status.
              </span>

            </div>

            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <footer className="text-center pt-8 pb-8">

              <p className="text-xs text-slate-400">
                Application Tracker · Software Engineering 2
              </p>

              <p className="text-[11px] text-slate-300 mt-1">
                Version 1.0.0
              </p>

            </footer>

          </div>

        </main>

        {/* ================================================= */}
        {/* BOTTOM FADE */}
        {/* ================================================= */}

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f5f7fb] via-[#f5f7fb]/80 to-transparent z-30 pointer-events-none" />

        {/* ================================================= */}
        {/* DRAG OVERLAY */}
        {/* ================================================= */}

        <DragOverlay>

          {activeCard ? (

            <div className="w-[250px] bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xl rotate-2 cursor-grabbing">

              <div className="flex items-start gap-2">

                <GripVertical
                  size={16}
                  className="mt-0.5 text-slate-300"
                />

                <div className="flex-1">

                  <p className="text-sm font-bold text-slate-800">
                    {activeCard.title}
                  </p>

                  {activeCard.description && (
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-3">
                      {activeCard.description}
                    </p>
                  )}

                </div>

              </div>

            </div>

          ) : activeColumn ? (

            <div
              className={`w-[270px] rounded-2xl border shadow-2xl rotate-1 overflow-hidden ${activeColumn.color.background} ${activeColumn.color.border}`}
            >

              <div
                className={`px-3.5 py-3 ${activeColumn.color.header}`}
              >

                <div className="flex items-center gap-2">

                  <GripVertical
                    size={17}
                    className="text-slate-500"
                  />

                  <span className="text-sm font-bold text-slate-800">
                    {
                      activeColumn.title
                    }
                  </span>

                </div>

              </div>

              <div className="p-3">

                {activeColumn.cards
                  .slice(0, 2)
                  .map(card => (

                    <div
                      key={
                        card.id
                      }
                      className="bg-white border border-slate-200 rounded-xl p-3 mb-2"
                    >

                      <p className="text-xs font-bold text-slate-700">
                        {card.title}
                      </p>

                      {card.description && (
                        <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                          {card.description}
                        </p>
                      )}

                    </div>

                  ))}

              </div>

            </div>

          ) : null}

        </DragOverlay>

        {/* ================================================= */}
        {/* ZOOMED NOTE EDITOR */}
        {/* ================================================= */}

        {editingCard && (

          <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 sm:p-8">

            {/* BACKDROP */}

            <button
              type="button"
              aria-label="Close note"
              onClick={
                closeCardEditor
              }
              className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
            />

            {/* NOTE */}

            <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-note-zoom">

              {/* TOP BAR */}

              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">

                <div className="flex items-center gap-2">

                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">

                    <StickyNote
                      size={16}
                      className="text-blue-600"
                    />

                  </div>

                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                    Application Note
                  </span>

                </div>

                <button
                  type="button"
                  onClick={
                    closeCardEditor
                  }
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                >

                  <X
                    size={18}
                  />

                </button>

              </div>

              {/* EDITOR */}

              <div className="p-6 sm:p-8">

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Note Title
                </label>

                <input
                  autoFocus
                  type="text"
                  value={
                    editingCardTitle
                  }
                  onChange={event =>
                    setEditingCardTitle(
                      event.target.value
                    )
                  }
                  onKeyDown={event => {

                    if (
                      event.key ===
                      'Escape'
                    ) {
                      closeCardEditor();
                    }

                    if (
                      event.key ===
                        'Enter' &&
                      event.ctrlKey
                    ) {
                      saveCard();
                    }

                  }}
                  placeholder="Enter note title..."
                  className="w-full text-2xl sm:text-3xl font-bold text-slate-900 placeholder:text-slate-300 border-none outline-none bg-transparent"
                />

                <div className="mt-6">

                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Description
                  </label>

                  <textarea
                    value={
                      editingCardDescription
                    }
                    onChange={event =>
                      setEditingCardDescription(
                        event.target.value
                      )
                    }
                    placeholder="Add details about this application..."
                    rows={8}
                    className="w-full resize-none rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm leading-relaxed text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />

                </div>

                {/* ACTIONS */}

                <div className="flex items-center justify-between mt-6">

                  <p className="text-[11px] text-slate-400">
                    Ctrl + Enter to save
                  </p>

                  <div className="flex items-center gap-2">

                    <button
                      type="button"
                      onClick={
                        closeCardEditor
                      }
                      className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={
                        saveCard
                      }
                      className="h-10 px-5 rounded-xl bg-blue-600 text-white text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all"
                    >

                      <Save
                        size={15}
                      />

                      Save Note

                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        )}

        {/* ================================================= */}
        {/* ANIMATIONS */}
        {/* ================================================= */}

        <style jsx global>{`

          html,
          body {
            scroll-behavior: smooth;
          }

          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }

          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          /* HEADER */

          @keyframes header-in {

            from {
              opacity: 0;
              transform: translateY(-12px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }

          }

          .animate-header-in {
            animation:
              header-in
              0.4s
              ease-out
              forwards;
          }

          /* BLUE LIGHTING */

          @keyframes blueGlow {

            0%,
            100% {
              opacity: 0.45;
              transform:
                scale(1)
                translate(0, 0);
            }

            50% {
              opacity: 0.85;
              transform:
                scale(1.08)
                translate(20px, -15px);
            }

          }

          .blue-glow-animation {
            animation:
              blueGlow
              8s
              ease-in-out
              infinite;
          }

          /* NOTE ZOOM */

          @keyframes note-zoom {

            from {
              opacity: 0;
              transform:
                scale(0.92)
                translateY(10px);
            }

            to {
              opacity: 1;
              transform:
                scale(1)
                translateY(0);
            }

          }

          .animate-note-zoom {
            animation:
              note-zoom
              0.2s
              ease-out
              forwards;
          }

          /* REDUCED MOTION */

          @media (prefers-reduced-motion: reduce) {

            html,
            body {
              scroll-behavior: auto;
            }

            *,
            *::before,
            *::after {
              animation-duration:
                0.01ms !important;

              animation-iteration-count:
                1 !important;

              transition-duration:
                0.01ms !important;
            }

          }

        `}</style>

      </div>
    </DndContext>
  );
}

/* ================================================= */
/* SORTABLE COLUMN */
/* ================================================= */

type SortableColumnProps = {
  column: Column;

  cards: Card[];

  editingColumn:
    string | null;

  editingColumnName:
    string;

  editingColumnColor:
    ColumnColor;

  setEditingColumnName:
    (value: string) => void;

  setEditingColumnColor:
    (value: ColumnColor) => void;

  saveColumn:
    () => void;

  startEditingColumn:
    (column: Column) => void;

  newCardColumn:
    string | null;

  newCardTitle:
    string;

  newCardDescription:
    string;

  setNewCardTitle:
    (value: string) => void;

  setNewCardDescription:
    (value: string) => void;

  setNewCardColumn:
    (value: string | null) => void;

  addCard:
    (columnId: string) => void;

  editingCard:
    string | null;

  editingCardTitle:
    string;

  editingCardDescription:
    string;

  setEditingCardTitle:
    (value: string) => void;

  setEditingCardDescription:
    (value: string) => void;

  openCardEditor:
    (card: Card) => void;

  saveCard:
    () => void;

  closeCardEditor:
    () => void;

  deleteCard:
    (
      columnId: string,
      cardId: string
    ) => void;
};

function SortableColumn({
  column,
  cards,

  editingColumn,
  editingColumnName,
  editingColumnColor,

  setEditingColumnName,
  setEditingColumnColor,

  saveColumn,
  startEditingColumn,

  newCardColumn,
  newCardTitle,
  newCardDescription,

  setNewCardTitle,
  setNewCardDescription,
  setNewCardColumn,
  addCard,

  editingCard,
  editingCardTitle,
  editingCardDescription,

  setEditingCardTitle,
  setEditingCardDescription,

  openCardEditor,
  saveCard,
  closeCardEditor,
  deleteCard,

}: SortableColumnProps) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } =
    useSortable({
      id: column.id,
    });

  const style = {
    transform:
      CSS.Transform.toString(
        transform
      ),

    transition,
  };

  const {
    setNodeRef:
      setDropRef,

    isOver,

  } =
    useDroppable({
      id: column.id,
    });

  return (

    <div
      ref={node => {

        setNodeRef(node);

        setDropRef(node);

      }}

      style={style}

      className={`w-full min-w-0 transition-all ${
        isDragging
          ? 'opacity-30'
          : ''
      }`}
    >

      {/* ================================================= */}
      {/* COLUMN */}
      {/* ================================================= */}

      <div
        className={`rounded-2xl border-2 p-2.5 min-h-[560px] transition-all ${
          column.color.background
        } ${
          column.color.border
        } ${
          isOver
            ? 'shadow-xl scale-[1.01]'
            : 'shadow-sm'
        }`}
      >

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        {editingColumn ===
        column.id ? (

          <div className="bg-white rounded-xl border border-slate-200 p-3 mb-3 shadow-sm">

            <div className="flex gap-2">

              <input
                autoFocus
                value={
                  editingColumnName
                }
                onChange={event =>
                  setEditingColumnName(
                    event.target.value
                  )
                }
                onKeyDown={event => {

                  if (
                    event.key ===
                    'Enter'
                  ) {
                    saveColumn();
                  }

                  if (
                    event.key ===
                    'Escape'
                  ) {
                    closeColumnEditor();
                  }

                }}
                className="flex-1 h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm font-semibold outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={
                  saveColumn
                }
                className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
              >

                <Check
                  size={15}
                />

              </button>

            </div>

            <div className="mt-3">

              <p className="text-[11px] font-semibold text-slate-400 mb-2">
                Column Color
              </p>

              <div className="flex flex-wrap gap-1.5">

                {COLUMN_COLORS.map(
                  color => (

                    <button
                      key={
                        color.name
                      }
                      type="button"
                      title={
                        color.name
                      }
                      onClick={() =>
                        setEditingColumnColor(
                          color
                        )
                      }
                      className={`w-7 h-7 rounded-lg ${color.header} border ${color.border} flex items-center justify-center ${
                        editingColumnColor.name ===
                        color.name
                          ? 'ring-2 ring-blue-500'
                          : ''
                      }`}
                    >

                      <span
                        className={`w-3 h-3 rounded-full ${color.dot}`}
                      />

                    </button>

                  )
                )}

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                closeColumnEditor()
              }
              className="mt-3 text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>

          </div>

        ) : (

          <div
            {...attributes}
            {...listeners}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl mb-3 ${column.color.header} border ${column.color.border} cursor-grab active:cursor-grabbing select-none`}
          >

            <div className="flex items-center gap-2 min-w-0">

              <GripVertical
                size={16}
                className="text-slate-500 shrink-0"
              />

              <span
                className={`w-2.5 h-2.5 rounded-full ${column.color.dot}`}
              />

              <h2
                className={`text-sm font-bold truncate ${column.color.text}`}
              >
                {
                  column.title
                }
              </h2>

              <span className="min-w-6 h-6 px-1.5 rounded-full bg-white/70 border border-white flex items-center justify-center text-[11px] font-semibold text-slate-500">
                {
                  column.cards.length
                }
              </span>

            </div>

            <div className="flex items-center shrink-0">

              <button
                type="button"
                onPointerDown={event =>
                  event.stopPropagation()
                }
                onClick={() =>
                  startEditingColumn(
                    column
                  )
                }
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-white/70"
              >

                <Pencil
                  size={13}
                />

              </button>

            </div>

          </div>

        )}

        {/* ================================================= */}
        {/* CARDS */}
        {/* ================================================= */}

        <SortableContext
          items={
            cards.map(
              card =>
                card.id
            )
          }
          strategy={
            verticalListSortingStrategy
          }
        >

          <div className="space-y-2.5">

            {cards.map(
              card => (

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

                  openCardEditor={
                    openCardEditor
                  }

                  saveCard={
                    saveCard
                  }

                  closeCardEditor={
                    closeCardEditor
                  }

                  deleteCard={
                    deleteCard
                  }

                />

              )
            )}

          </div>

        </SortableContext>

        {/* ================================================= */}
        {/* EMPTY AREA */}
        {/* ================================================= */}

        {cards.length === 0 && (

          <div
            className={`border-2 border-dashed rounded-xl min-h-[140px] flex flex-col items-center justify-center text-center px-4 ${
              isOver
                ? 'border-slate-400 bg-white/30'
                : 'border-white/80'
            }`}
          >

            <StickyNote
              size={22}
              className="text-slate-400/60"
            />

            <p className="mt-2 text-xs text-slate-400">
              Drop notes here
            </p>

          </div>

        )}

        {/* ================================================= */}
        {/* ADD NOTE */}
        {/* ================================================= */}

        <div className="mt-2.5">

          {newCardColumn ===
          column.id ? (

            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">

              <input
                autoFocus
                type="text"
                value={
                  newCardTitle
                }
                onChange={event =>
                  setNewCardTitle(
                    event.target.value
                  )
                }
                onKeyDown={event => {

                  if (
                    event.key ===
                    'Escape'
                  ) {

                    setNewCardColumn(
                      null
                    );

                    setNewCardTitle(
                      ''
                    );

                    setNewCardDescription(
                      ''
                    );

                  }

                  if (
                    event.key ===
                      'Enter' &&
                    event.ctrlKey
                  ) {
                    addCard(
                      column.id
                    );
                  }

                }}
                placeholder="Note title..."
                className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

              <textarea
                value={
                  newCardDescription
                }
                onChange={event =>
                  setNewCardDescription(
                    event.target.value
                  )
                }
                rows={3}
                placeholder="Description (optional)..."
                className="w-full mt-2 resize-none rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

              <div className="flex justify-end gap-2 mt-2">

                <button
                  type="button"
                  onClick={() => {

                    setNewCardColumn(
                      null
                    );

                    setNewCardTitle(
                      ''
                    );

                    setNewCardDescription(
                      ''
                    );

                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() =>
                    addCard(
                      column.id
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                >
                  Add Note
                </button>

              </div>

            </div>

          ) : (

            <button
              type="button"
              onClick={() =>
                setNewCardColumn(
                  column.id
                )
              }
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-white/50 transition-all"
            >

              <StickyNote
                size={16}
              />

              Add sticky note

            </button>

          )}

        </div>

      </div>

    </div>
  );
}

/* ================================================= */
/* COLUMN EDITOR HELPER */
/* ================================================= */

function closeColumnEditor() {
  /*
   * This function is intentionally empty here.
   * The parent state handles column editing.
   */
}

/* ================================================= */
/* SORTABLE CARD */
/* ================================================= */

type SortableCardProps = {

  card: Card;

  columnId: string;

  editingCard:
    string | null;

  editingCardTitle:
    string;

  editingCardDescription:
    string;

  setEditingCardTitle:
    (value: string) => void;

  setEditingCardDescription:
    (value: string) => void;

  openCardEditor:
    (card: Card) => void;

  saveCard:
    () => void;

  closeCardEditor:
    () => void;

  deleteCard:
    (
      columnId: string,
      cardId: string
    ) => void;
};

function SortableCard({
  card,
  columnId,

  editingCard,

  editingCardTitle,
  editingCardDescription,

  setEditingCardTitle,
  setEditingCardDescription,

  openCardEditor,
  saveCard,
  closeCardEditor,
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

  };

  /*
   * IMPORTANT:
   *
   * Only the grip/title area gets the drag listeners.
   * The card itself is clickable.
   *
   * This allows:
   *
   * - Click card -> open editor
   * - Drag using grip -> move card
   */

  return (

    <div
      ref={setNodeRef}
      style={style}
      {...attributes}

      className={`group bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm transition-all ${
        isDragging
          ? 'opacity-30 scale-[0.98]'
          : 'hover:shadow-md hover:-translate-y-[1px]'
      }`}
    >

      <button
        type="button"
        onClick={() =>
          openCardEditor(
            card
          )
        }
        className="w-full text-left"
      >

        <div className="flex items-start gap-2">

          {/* DRAG HANDLE */}

          <span
            {...listeners}
            onClick={event =>
              event.stopPropagation()
            }
            className="mt-0.5 shrink-0 text-slate-300 cursor-grab active:cursor-grabbing"
          >

            <GripVertical
              size={15}
            />

          </span>

          {/* NOTE CONTENT */}

          <div className="flex-1 min-w-0">

            <p className="text-sm font-bold leading-snug text-slate-800 break-words">

              {
                card.title
              }

            </p>

            {card.description && (

              <p className="mt-1.5 text-xs leading-relaxed text-slate-500 line-clamp-3">

                {
                  card.description
                }

              </p>

            )}

            <p className="mt-2 text-[10px] font-medium text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to open
            </p>

          </div>

        </div>

      </button>

      {/* ================================================= */}
      {/* ACTIONS */}
      {/* ================================================= */}

      <div className="flex justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">

        <button
          type="button"
          onPointerDown={event =>
            event.stopPropagation()
          }
          onClick={() =>
            openCardEditor(
              card
            )
          }
          className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50"
        >

          <Pencil
            size={14}
          />

        </button>

        <button
          type="button"
          onPointerDown={event =>
            event.stopPropagation()
          }
          onClick={() =>
            deleteCard(
              columnId,
              card.id
            )
          }
          className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50"
        >

          <Trash2
            size={14}
          />

        </button>

      </div>

    </div>

  );
}