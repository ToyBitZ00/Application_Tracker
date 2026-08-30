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
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Pencil,
  Check,
  GripVertical,
  StickyNote,
  Palette,
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
  text: string;
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

  {
    name: 'Pink',
    dot: 'bg-pink-500',
    background: 'bg-pink-50',
    border: 'border-pink-200',
    header: 'bg-pink-100',
    text: 'text-pink-700',
  },

  {
    name: 'Indigo',
    dot: 'bg-indigo-500',
    background: 'bg-indigo-50',
    border: 'border-indigo-200',
    header: 'bg-indigo-100',
    text: 'text-indigo-700',
  },

  {
    name: 'Slate',
    dot: 'bg-slate-200',
    background: 'bg-slate-100',
    border: 'border-slate-300',
    header: 'bg-slate-200',
    text: 'text-slate-700',
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

  const [editingCardText, setEditingCardText] =
    useState('');

  const [newCardColumn, setNewCardColumn] =
    useState<string | null>(null);

  const [newCardText, setNewCardText] =
    useState('');

  const [showAddColumn, setShowAddColumn] =
    useState(false);

  const [newColumnName, setNewColumnName] =
    useState('');

  const [newColumnColor, setNewColumnColor] =
    useState<ColumnColor>(COLUMN_COLORS[0]);


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

      if (Array.isArray(parsed)) {
        setColumns(parsed);
      }

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
  /* ADD COLUMN */
  /* ================================================= */

  const addColumn = () => {

    const name =
      newColumnName.trim();

    if (!name) return;

    const column: Column = {

      id:
        `column-${Date.now()}`,

      title:
        name,

      color:
        newColumnColor,

      cards: [],

    };

    setColumns(
      previous => [
        ...previous,
        column,
      ]
    );

    setNewColumnName('');

    setNewColumnColor(
      COLUMN_COLORS[0]
    );

    setShowAddColumn(false);

  };


  /* ================================================= */
  /* DELETE COLUMN */
  /* ================================================= */

  const deleteColumn = (
    columnId: string
  ) => {

    const column =
      columns.find(
        item =>
          item.id === columnId
      );

    if (!column) return;

    if (column.cards.length > 0) {

      const confirmed =
        window.confirm(
          'This column contains notes. Are you sure you want to delete it?'
        );

      if (!confirmed) return;

    }

    setColumns(
      previous =>
        previous.filter(
          column =>
            column.id !== columnId
        )
    );

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

                  title:
                    name,

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
  /* ADD CARD */
  /* ================================================= */

  const addCard = (
    columnId: string
  ) => {

    const text =
      newCardText.trim();

    if (!text) return;

    const card: Card = {

      id:
        `card-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,

      text,

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

    setNewCardText('');

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

  };


  /* ================================================= */
  /* EDIT CARD */
  /* ================================================= */

  const startEditingCard = (
    card: Card
  ) => {

    setEditingCard(
      card.id
    );

    setEditingCardText(
      card.text
    );

  };


  /* ================================================= */
  /* SAVE CARD */
  /* ================================================= */

  const saveCard = () => {

    if (!editingCard) return;

    const text =
      editingCardText.trim();

    if (!text) return;

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
                        text,
                      }

                    : card
              ),

          })
        )
    );

    setEditingCard(null);

    setEditingCardText('');

  };


  /* ================================================= */
  /* DRAG START */
  /* ================================================= */

  const handleDragStart = (
    event: any
  ) => {

    const id =
      String(event.active.id);


    /* COLUMN */

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


    /* CARD */

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

    return cards.filter(
      card =>
        card.text
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
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
            className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-blue-500/10 blur-3xl animate-pulse"
          />

          <div
            className="absolute -bottom-48 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-3xl animate-pulse"
            style={{
              animationDelay:
                '1.5s',
            }}
          />

          <div
            className="absolute top-[35%] left-[45%] w-96 h-96 rounded-full bg-blue-400/5 blur-3xl animate-pulse"
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
              'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',

            WebkitMaskImage:
              'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          }}
        />


        {/* ================================================= */}
        {/* FIXED HEADER */}
        {/* ================================================= */}

        <div className="relative z-40 w-full shrink-0 pt-8 pb-4 bg-transparent pointer-events-none">

          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pointer-events-auto">

            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 animate-header-in">

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


              <button
                type="button"
                onClick={() =>
                  setShowAddColumn(true)
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm shadow-blue-600/20 hover:bg-blue-700 hover:shadow-md transition-all"
              >

                <Plus
                  size={18}
                  strokeWidth={2.5}
                />

                Add Column

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
            maskImage:
              'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',

            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',
          }}
        >

          <div className="max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-8 pt-4 pb-32">


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
            {/* CREATE COLUMN */}
            {/* ================================================= */}

            {showAddColumn && (

              <section className="mb-6">

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

                  <div className="flex items-center gap-2 mb-4">

                    <Palette
                      size={18}
                      className="text-blue-600"
                    />

                    <h2 className="text-sm font-bold text-slate-800">
                      Create New Column
                    </h2>

                  </div>


                  <input
                    autoFocus
                    type="text"
                    value={
                      newColumnName
                    }
                    onChange={event =>
                      setNewColumnName(
                        event.target.value
                      )
                    }
                    onKeyDown={event => {

                      if (
                        event.key ===
                        'Enter'
                      ) {

                        addColumn();

                      }

                      if (
                        event.key ===
                        'Escape'
                      ) {

                        setShowAddColumn(
                          false
                        );

                      }

                    }}
                    placeholder="Column name, e.g. For Follow-up"
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />


                  <div className="mt-4">

                    <p className="text-xs font-semibold text-slate-500 mb-2">
                      Choose column color
                    </p>


                    <div className="flex flex-wrap gap-2">

                      {COLUMN_COLORS.map(
                        color => (

                          <button
                            key={
                              color.name
                            }
                            type="button"
                            onClick={() =>
                              setNewColumnColor(
                                color
                              )
                            }
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                              newColumnColor.name ===
                              color.name

                                ? `${color.header} ${color.border} ring-2 ring-blue-500/20`

                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                          >

                            <span
                              className={`w-3 h-3 rounded-full ${color.dot}`}
                            />

                            {
                              color.name
                            }

                          </button>

                        )
                      )}

                    </div>

                  </div>


                  <div className="flex justify-end gap-2 mt-5">

                    <button
                      type="button"
                      onClick={() => {

                        setShowAddColumn(
                          false
                        );

                        setNewColumnName(
                          ''
                        );

                      }}
                      className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 hover:bg-slate-50"
                    >
                      Cancel
                    </button>


                    <button
                      type="button"
                      onClick={
                        addColumn
                      }
                      className="h-10 px-5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                    >

                      <Plus
                        size={15}
                        className="inline mr-1"
                      />

                      Create Column

                    </button>

                  </div>

                </div>

              </section>

            )}


            {/* ================================================= */}
            {/* BOARD */}
            {/* ================================================= */}

            <section>

              <div className="overflow-x-auto pb-8">

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
                    className="flex gap-5 items-start"
                    style={{
                      minWidth:
                        columns.length *
                          310 +
                        310 +
                        'px',
                    }}
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

                          deleteColumn={
                            deleteColumn
                          }

                          newCardColumn={
                            newCardColumn
                          }

                          newCardText={
                            newCardText
                          }

                          setNewCardText={
                            setNewCardText
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

                          editingCardText={
                            editingCardText
                          }

                          setEditingCardText={
                            setEditingCardText
                          }

                          startEditingCard={
                            startEditingCard
                          }

                          saveCard={
                            saveCard
                          }

                          deleteCard={
                            deleteCard
                          }
                        />

                      )
                    )}


                    {/* ================================================= */}
                    {/* ADD COLUMN BUTTON */}
                    {/* ================================================= */}

                    <button
                      type="button"
                      onClick={() =>
                        setShowAddColumn(
                          true
                        )
                      }
                      className="w-[290px] shrink-0 min-h-[150px] rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 hover:bg-white hover:border-blue-300 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 transition-all"
                    >

                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">

                        <Plus
                          size={20}
                        />

                      </div>


                      <span className="mt-3 text-sm font-semibold">
                        Add another column
                      </span>

                    </button>

                  </div>

                </SortableContext>

              </div>

            </section>


            {/* ================================================= */}
            {/* BOARD INFO */}
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

            <div className="w-[270px] bg-white border border-slate-200 rounded-xl p-4 shadow-2xl rotate-2 cursor-grabbing">

              <div className="flex items-start gap-2">

                <GripVertical
                  size={16}
                  className="mt-0.5 text-slate-300"
                />

                <p className="flex-1 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap break-words">
                  {
                    activeCard.text
                  }
                </p>

              </div>

            </div>

          ) : activeColumn ? (

            <div
              className={`w-[290px] rounded-2xl border shadow-2xl rotate-1 overflow-hidden ${activeColumn.color.background} ${activeColumn.color.border}`}
            >

              <div
                className={`px-4 py-4 ${activeColumn.color.header}`}
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
                      className="bg-white border border-slate-200 rounded-xl p-3 mb-2 text-xs text-slate-600"
                    >

                      {
                        card.text
                      }

                    </div>

                  ))}

              </div>

            </div>

          ) : null}

        </DragOverlay>


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


          /* HEADER ENTRANCE */

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
              transform: scale(1)
                translate(0, 0);
            }

            50% {
              opacity: 0.85;
              transform: scale(1.08)
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

  deleteColumn:
    (columnId: string) => void;

  newCardColumn:
    string | null;

  newCardText:
    string;

  setNewCardText:
    (value: string) => void;

  setNewCardColumn:
    (value: string | null) => void;

  addCard:
    (columnId: string) => void;

  editingCard:
    string | null;

  editingCardText:
    string;

  setEditingCardText:
    (value: string) => void;

  startEditingCard:
    (card: Card) => void;

  saveCard:
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
  deleteColumn,

  newCardColumn,
  newCardText,

  setNewCardText,
  setNewCardColumn,
  addCard,

  editingCard,
  editingCardText,

  setEditingCardText,
  startEditingCard,
  saveCard,
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

      className={`w-[290px] shrink-0 transition-all ${
        isDragging
          ? 'opacity-30'
          : ''
      }`}
    >


      {/* ================================================= */}
      {/* WHOLE COLUMN */}
      {/* ================================================= */}

      <div
        className={`rounded-2xl border-2 p-3 min-h-[500px] transition-all ${
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
        {/* COLUMN HEADER */}
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

                    setEditingColumn(
                      null
                    );

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


            {/* COLOR EDITOR */}

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
                setEditingColumn(
                  null
                )
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
            className={`flex items-center justify-between px-3 py-3 rounded-xl mb-3 ${column.color.header} border ${column.color.border} cursor-grab active:cursor-grabbing select-none`}
          >

            <div className="flex items-center gap-2 min-w-0">

              <GripVertical
                size={17}
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


              <button
                type="button"
                onPointerDown={event =>
                  event.stopPropagation()
                }
                onClick={() =>
                  deleteColumn(
                    column.id
                  )
                }
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-white/70"
              >

                <Trash2
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

          <div className="space-y-3">

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

                  editingCardText={
                    editingCardText
                  }

                  setEditingCardText={
                    setEditingCardText
                  }

                  startEditingCard={
                    startEditingCard
                  }

                  saveCard={
                    saveCard
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
        {/* EMPTY DROP AREA */}
        {/* ================================================= */}

        {cards.length === 0 && (

          <div
            className={`border-2 border-dashed rounded-xl min-h-[150px] flex flex-col items-center justify-center text-center px-4 ${
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

        <div className="mt-3">

          {newCardColumn ===
          column.id ? (

            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">

              <textarea
                autoFocus
                value={
                  newCardText
                }
                onChange={event =>
                  setNewCardText(
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

                    setNewCardText(
                      ''
                    );

                  }

                }}
                rows={4}
                placeholder="Write your application note..."
                className="w-full resize-none rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />


              <div className="flex justify-end gap-2 mt-2">

                <button
                  type="button"
                  onClick={() => {

                    setNewCardColumn(
                      null
                    );

                    setNewCardText(
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

              <Plus
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
/* SORTABLE CARD */
/* ================================================= */

type SortableCardProps = {

  card: Card;

  columnId: string;

  editingCard:
    string | null;

  editingCardText:
    string;

  setEditingCardText:
    (value: string) => void;

  startEditingCard:
    (card: Card) => void;

  saveCard:
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
  editingCardText,

  setEditingCardText,
  startEditingCard,
  saveCard,
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


  return (

    <div
      ref={setNodeRef}
      style={style}
      {...attributes}

      className={`group bg-white border border-slate-200 rounded-xl p-4 shadow-sm transition-all ${
        isDragging
          ? 'opacity-30 scale-[0.98]'
          : 'hover:shadow-md'
      }`}
    >


      {editingCard ===
      card.id ? (

        <div>

          <textarea
            autoFocus
            value={
              editingCardText
            }
            onChange={event =>
              setEditingCardText(
                event.target.value
              )
            }
            onKeyDown={event => {

              if (
                event.key ===
                'Escape'
              ) {

                setEditingCardText(
                  card.text
                );

              }

              if (
                event.key ===
                'Enter' &&
                event.ctrlKey
              ) {

                saveCard();

              }

            }}
            rows={4}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-800 outline-none resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />


          <div className="flex justify-end gap-2 mt-2">

            <button
              type="button"
              onClick={() =>
                setEditingCardText(
                  card.text
                )
              }
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>


            <button
              type="button"
              onClick={
                saveCard
              }
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              Save
            </button>

          </div>

        </div>

      ) : (

        <>

          {/* ================================================= */}
          {/* DRAG AREA */}
          {/* ================================================= */}

          <div
            {...listeners}
            className="flex items-start gap-2 cursor-grab active:cursor-grabbing select-none"
          >

            <GripVertical
              size={16}
              className="mt-0.5 shrink-0 text-slate-300"
            />


            <p className="flex-1 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap break-words">
              {
                card.text
              }
            </p>

          </div>


          {/* ================================================= */}
          {/* CARD ACTIONS */}
          {/* ================================================= */}

          <div className="flex justify-end gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">

            <button
              type="button"
              onPointerDown={event =>
                event.stopPropagation()
              }
              onClick={() =>
                startEditingCard(
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

        </>

      )}

    </div>

  );

}