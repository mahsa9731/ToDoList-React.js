import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckSquare, Trash2, Edit2, Check, X } from 'lucide-react';

const AVAILABLE_LABELS = [
  { id: 'design', name: 'Design', bg: '#fdf2f8', text: '#db2777' },
  { id: 'development', name: 'Development', bg: '#f0fdf4', text: '#16a34a' },
  { id: 'product', name: 'Product', bg: '#e0e7ff', text: '#4f46e5' },
  { id: 'marketing', name: 'Marketing', bg: '#fff7ed', text: '#ea580c' },
  { id: 'business', name: 'Business', bg: '#f0fdfa', text: '#0d9488' },
  { id: 'operation', name: 'Operation', bg: '#fefce8', text: '#ca8a04' },
];

export default function Card({ card, columnId, onDragStart, onToggleSubtask, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(card.description || '');
  const completedSubtasks = card.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = card.subtasks?.length || 0;
  const progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const handleLocalDragStart = (e) => {
    if (isEditing) {
      e.preventDefault();
      return;
    }
    onDragStart(e, card.id, columnId);
    e.currentTarget.style.opacity = '0.4';
  };

  const handleLocalDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onEdit(columnId, card.id, editTitle, editDescription);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout 
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
      draggable={!isEditing}
      onDragStart={handleLocalDragStart}
      onDragEnd={handleLocalDragEnd}
      className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] cursor-grab active:cursor-grabbing hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300 group select-none relative"
    >
      {/* Header Info & Action Buttons */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-400/80" /> {card.date}
        </span>
        
        <div className="flex items-center gap-1.5">
          {!isEditing && (
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity duration-200 mr-1">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                title="Edit task"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(columnId, card.id)}
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          
          <span className="text-[11px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 shadow-sm">
            {card.assignee}
          </span>
        </div>
      </div>

      {/* Title & Description or Edit Form */}
      {isEditing ? (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 my-2"
        >
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-1.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-900"
            placeholder="Task title..."
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows="2"
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-500 resize-none"
            placeholder="Add description..."
          />
          <div className="flex justify-end gap-1.5 pt-1">
            <button
              onClick={() => setIsEditing(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              className="p-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          <h3 className="font-extrabold text-slate-900 text-sm leading-snug mb-1.5 group-hover:text-indigo-600 transition-colors duration-200">
            {card.title}
          </h3>
          {card.description && (
            <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
              {card.description}
            </p>
          )}
        </>
      )}

      {/* Subtasks Progress */}
      {card.subtasks && card.subtasks.length > 0 && (
        <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100 mb-4 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5" /> Tasks progress
            </span>
            <span>{completedSubtasks}/{totalSubtasks}</span>
          </div>

          <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden my-1.5">
            <motion.div
              className="bg-indigo-600 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>

          <div className="space-y-1.5 pt-1">
            {card.subtasks.map((sub, sIdx) => (
              <label
                key={sIdx}
                onClick={(e) => e.stopPropagation()} 
                className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none group/item"
              >
                <input
                  type="checkbox"
                  checked={sub.completed}
                  onChange={() => onToggleSubtask(columnId, card.id, sIdx)}
                  className="w-4 h-4 rounded-md border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer transition-all mt-0.5"
                />
                <span className={`transition-all duration-200 ${sub.completed ? 'line-through text-slate-400' : 'text-slate-700 group-hover/item:text-slate-900'}`}>
                  {sub.text}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-slate-100">
          {card.labels.map(lId => {
            const labelDef = AVAILABLE_LABELS.find(l => l.id === lId);
            if (!labelDef) return null;
            return (
              <span
                key={lId}
                style={{ backgroundColor: labelDef.bg, color: labelDef.text }}
                className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-md shadow-sm"
              >
                {labelDef.name}
              </span>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}