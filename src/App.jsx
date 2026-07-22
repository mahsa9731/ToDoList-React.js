import React, { useState, useEffect, useMemo } from 'react';
import TaskForm from './TaskForm';
import Card from './Card';
import { AnimatePresence } from 'framer-motion';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-amber-500' },
  { id: 'doing', title: 'Doing', color: 'bg-blue-500' },
  { id: 'done', title: 'Done', color: 'bg-emerald-500' },
];


const handleEditCard = (columnId, cardId, newTitle, newDescription) => {
  setBoard(prev => ({
    ...prev,
    [columnId]: prev[columnId].map(card => {
      if (card.id !== cardId) return card;
      return {
        ...card,
        title: newTitle,
        description: newDescription
      };
    })
  }));
};

const INITIAL_BOARD = {
  todo: [
    {
      id: 'card-1',
      title: 'Make a Kanban App',
      description: 'Please use trello and designs in dribbble as reference.',
      date: '12th Jan',
      assignee: 'Taha Hosseinipour',
      labels: ['design', 'development'],
      subtasks: [
        { text: 'Create components', completed: true },
        { text: 'Setup Drag & Drop', completed: false }
      ]
    }
  ],
  doing: [],
  done: []
};

export default function App() {
  const [board, setBoard] = useState(() => {
    const saved = localStorage.getItem('kanban_board_data');
    return saved ? JSON.parse(saved) : INITIAL_BOARD;
  });

  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('all');

  useEffect(() => {
    localStorage.setItem('kanban_board_data', JSON.stringify(board));
  }, [board]);

  const allLabels = useMemo(() => {
    const labelsSet = new Set();
    Object.values(board).flat().forEach(card => {
      card.labels?.forEach(label => labelsSet.add(label));
    });
    return Array.from(labelsSet);
  }, [board]);

  const filteredBoard = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    if (!query && selectedLabel === 'all') return board;

    const result = {};

    Object.keys(board).forEach(columnId => {
      result[columnId] = board[columnId].filter(card => {
        
        const matchesQuery = !query || 
          card.title.toLowerCase().includes(query) || 
          card.description?.toLowerCase().includes(query);

        const matchesLabel = selectedLabel === 'all' || 
          card.labels?.includes(selectedLabel);

        return matchesQuery && matchesLabel;
      });
    });

    return result;
  }, [board, searchQuery, selectedLabel]);

  // Handlers
  const handleAddTask = (formValues) => {
    const cleanSubtasks = (formValues.subtasks || [])
      .filter(taskText => taskText.trim() !== '')
      .map(taskText => ({ text: taskText, completed: false }));

    const newCard = {
      id: `card-${Date.now()}`,
      title: formValues.title,
      description: formValues.description,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      assignee: formValues.assignee || 'Unassigned',
      labels: formValues.labels || [],
      subtasks: cleanSubtasks
    };

    setBoard(prev => ({
      ...prev,
      todo: [newCard, ...prev.todo]
    }));
  };

  const handleDragStart = (e, cardId, sourceColumn) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ cardId, sourceColumn }));
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;

      const { cardId, sourceColumn } = JSON.parse(dataStr);
      if (sourceColumn === targetColumn) return;

      setBoard(prev => {
        const sourceCards = [...prev[sourceColumn]];
        const targetCards = [...prev[targetColumn]];
        const cardIndex = sourceCards.findIndex(c => c.id === cardId);

        if (cardIndex === -1) return prev;

        const [movedCard] = sourceCards.splice(cardIndex, 1);
        targetCards.push(movedCard);

        return {
          ...prev,
          [sourceColumn]: sourceCards,
          [targetColumn]: targetCards
        };
      });
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  const handleToggleSubtask = (columnId, cardId, subtaskIndex) => {
    setBoard(prev => ({
      ...prev,
      [columnId]: prev[columnId].map(card => {
        if (card.id !== cardId) return card;
        const newSubtasks = [...card.subtasks];
        newSubtasks[subtaskIndex] = {
          ...newSubtasks[subtaskIndex],
          completed: !newSubtasks[subtaskIndex].completed
        };
        return { ...card, subtasks: newSubtasks };
      })
    }));
  };

  const handleDeleteCard = (columnId, cardId) => {
    setBoard(prev => ({
      ...prev,
      [columnId]: prev[columnId].filter(card => card.id !== cardId)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 antialiased">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        
        {/* Header */}
        <header className="mb-6 border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Project Workspace</h1>
            <p className="text-slate-500 text-sm">Manage and track your daily tasks</p>
          </div>
          <button 
            onClick={() => setBoard(INITIAL_BOARD)}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors self-start sm:self-auto"
          >
            Reset Board
          </button>
        </header>

        {/* Search & Filter Bar */}
        <div className="mb-8 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search tasks by title or desc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
           
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Filter:</span>
            
            <button
              onClick={() => setSelectedLabel('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedLabel === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>

            {allLabels.map(label => (
              <button
                key={label}
                onClick={() => setSelectedLabel(label)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  selectedLabel === label
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4">
            <TaskForm onAddTask={handleAddTask} />
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {COLUMNS.map(col => (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="bg-slate-100/80 p-4 rounded-2xl min-h-[550px] flex flex-col border border-slate-200/50"
              >
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.color}`}></span>
                    <span className="font-bold text-slate-700 text-xs tracking-wider uppercase">
                      {col.title}
                    </span>
                  </div>
                  
                  <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {filteredBoard[col.id]?.length || 0}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto min-h-[150px]">
                <AnimatePresence mode="popLayout">
    {filteredBoard[col.id]?.map(card => (
      <Card
        key={card.id}
        card={card}
        columnId={col.id}
        onDragStart={handleDragStart}
        onToggleSubtask={handleToggleSubtask}
        onDelete={handleDeleteCard}
        onEdit={handleEditCard}
      />
    ))}
  </AnimatePresence>

                  {filteredBoard[col.id]?.length === 0 && (searchQuery || selectedLabel !== 'all') && (
                  <div className="text-center py-8 text-xs text-slate-400">
                     No matching tasks
                 </div>
                       )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}