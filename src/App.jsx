import React, { useState } from 'react';
import TaskForm from './TaskForm';
import Card from './Card';

export default function App() {
 
  const [board, setBoard] = useState({
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
  });

  const handleAddTask = (formValues) => {
    const cleanSubtasks = formValues.subtasks
      .filter(taskText => taskText.trim() !== '')
      .map(taskText => ({ text: taskText, completed: false }));

    const newCard = {
      id: `card-${Date.now()}`, //unique
      title: formValues.title,
      description: formValues.description,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      assignee: formValues.assignee,
      labels: formValues.labels,
      subtasks: cleanSubtasks
    };

    setBoard(prev => ({
      ...prev,
      todo: [...prev.todo, newCard]
    }));
  };

  const handleDragStart = (e, cardId, sourceColumn) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ cardId, sourceColumn }));
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;

      const { cardId, sourceColumn } = JSON.parse(dataStr);
      if (sourceColumn === targetColumn) return; 

      const sourceCards = [...board[sourceColumn]];
      const targetCards = [...board[targetColumn]];
      
      const cardIndex = sourceCards.findIndex(c => c.id === cardId);
      
      if (cardIndex !== -1) {
        const [movedCard] = sourceCards.splice(cardIndex, 1);
        targetCards.push(movedCard);

        setBoard({
          ...board,
          [sourceColumn]: sourceCards,
          [targetColumn]: targetCards
        });
      }
    } catch (err) {
      console.error("Drop function error:", err);
    }
  };

 
  const handleToggleSubtask = (columnId, cardId, subtaskIndex) => {
    const updatedCards = board[columnId].map(card => {
      if (card.id === cardId) {
        const newSubtasks = [...card.subtasks];
        newSubtasks[subtaskIndex] = {
          ...newSubtasks[subtaskIndex],
          completed: !newSubtasks[subtaskIndex].completed
        };
        return { ...card, subtasks: newSubtasks };
      }
      return card;
    });

    setBoard(prev => ({
      ...prev,
      [columnId]: updatedCards
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 antialiased">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        
        <header className="mb-8 border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-slate-900">Project Workspace</h1>
          <p className="text-slate-500 text-sm">Create and organize tasks interactively</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4">
            <TaskForm onAddTask={handleAddTask} />
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'todo')}
              className="bg-slate-100/80 p-4 rounded-2xl min-h-[550px] flex flex-col border border-slate-200/50"
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="font-bold text-slate-700 text-xs tracking-wider uppercase">To Do</span>
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {board.todo.length}
                </span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {board.todo.map(card => (
                  <Card key={card.id} card={card} columnId="todo" onDragStart={handleDragStart} onToggleSubtask={handleToggleSubtask} />
                ))}
              </div>
            </div>

            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'doing')}
              className="bg-slate-100/80 p-4 rounded-2xl min-h-[550px] flex flex-col border border-slate-200/50"
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="font-bold text-slate-700 text-xs tracking-wider uppercase">Doing</span>
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {board.doing.length}
                </span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {board.doing.map(card => (
                  <Card key={card.id} card={card} columnId="doing" onDragStart={handleDragStart} onToggleSubtask={handleToggleSubtask} />
                ))}
              </div>
            </div>

            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'done')}
              className="bg-slate-100/80 p-4 rounded-2xl min-h-[550px] flex flex-col border border-slate-200/50"
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="font-bold text-slate-700 text-xs tracking-wider uppercase">Done</span>
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {board.done.length}
                </span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {board.done.map(card => (
                  <Card key={card.id} card={card} columnId="done" onDragStart={handleDragStart} onToggleSubtask={handleToggleSubtask} />
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}