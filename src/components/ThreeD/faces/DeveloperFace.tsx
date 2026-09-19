import React, { useState, useRef, useEffect } from 'react';
import { ChecklistItem, DeveloperFaceData, Ticket } from '../../../types';
import { X, Check } from 'lucide-react';

interface DeveloperFaceProps {
  ticket: Ticket;
  data?: DeveloperFaceData;
  compact?: boolean;
  onUpdateChecklist?: (itemId: string, done: boolean) => void;
  onUpdateTicketChecklist?: (checklist: ChecklistItem[]) => void;
}

export const DeveloperFace: React.FC<DeveloperFaceProps> = ({ 
  ticket, 
  data, 
  onUpdateChecklist,
  onUpdateTicketChecklist 
}) => {
  const storyPoints = Math.max(1, ticket?.storyPoints || 1);
  const checklist: ChecklistItem[] = data?.checklist || ticket?.faces?.developer?.checklist || [];
  
  // Track which bracket slot is being edited (by index 0..storyPoints-1)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when editing starts
  useEffect(() => {
    if (editingIndex !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingIndex]);

  // Handle clicking an empty bracket to start typing a new task
  const handleStartAdd = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditText('');
  };

  // Handle clicking an existing task's text to edit it
  const handleStartEdit = (e: React.MouseEvent, index: number, currentText: string) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditText(currentText);
  };

  // Save current edit (for both new tasks and modified tasks)
  const handleSave = () => {
    if (editingIndex === null) return;
    const trimmed = editText.trim();
    const isExisting = editingIndex < checklist.length;

    if (isExisting) {
      if (trimmed === '') {
        // If cleared text completely, delete the task
        const updated = checklist.filter((_, idx) => idx !== editingIndex);
        onUpdateTicketChecklist?.(updated);
      } else {
        // Update existing task text
        const updated = checklist.map((item, idx) => 
          idx === editingIndex ? { ...item, text: trimmed } : item
        );
        onUpdateTicketChecklist?.(updated);
      }
    } else {
      // Adding a new task to empty bracket slot
      if (trimmed !== '') {
        const newTask: ChecklistItem = {
          id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          text: trimmed,
          done: false
        };
        const updated = [...checklist, newTask];
        onUpdateTicketChecklist?.(updated);
      }
    }

    setEditingIndex(null);
    setEditText('');
  };

  // Cancel edit on Escape
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditingIndex(null);
      setEditText('');
    }
  };

  // Toggle task completion
  const handleToggleDone = (e: React.MouseEvent, index: number, task: ChecklistItem) => {
    e.stopPropagation();
    const newDone = !task.done;
    const updated = checklist.map((item, idx) => 
      idx === index ? { ...item, done: newDone } : item
    );
    onUpdateTicketChecklist?.(updated);
    onUpdateChecklist?.(task.id, newDone);
  };

  // Delete task on hover button click
  const handleDelete = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (editingIndex === index) {
      setEditingIndex(null);
    }
    const updated = checklist.filter((_, idx) => idx !== index);
    onUpdateTicketChecklist?.(updated);
  };

  // Generate slots for each story point
  const slots = Array.from({ length: storyPoints }, (_, i) => checklist[i]);

  return (
    <div className="h-full w-full select-none flex flex-col justify-between py-1 px-2 bg-white/95 dark:bg-slate-950/85 rounded-lg border border-slate-200 dark:border-slate-800/80 font-mono transition-colors">
      {slots.map((task, index) => {
        const isEditing = editingIndex === index;
        const hasTask = Boolean(task);

        return (
          <div
            key={task?.id || `bracket-slot-${index}`}
            className="flex-1 flex items-center justify-between px-1 w-full min-h-[30px] group transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-900/30 rounded"
          >
            {/* Left Bracket */}
            <span className="text-sky-600 dark:text-sky-400 font-bold text-lg select-none shrink-0 font-mono">
              [
            </span>

            {/* Bracket Interior: Task Content, Inline Input, or Empty Placeholder */}
            <div className="flex-1 mx-2 flex items-center min-w-0 h-full relative">
              {isEditing ? (
                /* Inline Input Field */
                <input
                  ref={inputRef}
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSave}
                  onClick={(e) => e.stopPropagation()}
                  placeholder={hasTask ? 'Edit task...' : 'Type task & press Enter...'}
                  className="w-full bg-slate-50 dark:bg-slate-900/95 border border-sky-500/60 rounded px-2 py-0.5 text-xs font-mono text-slate-900 dark:text-sky-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none shadow-sm focus:border-sky-400"
                />
              ) : hasTask ? (
                /* Existing Task with Toggle, Editable Text, and Delete on Hover */
                <div className="flex items-center justify-between w-full min-w-0 gap-1.5">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {/* Checkbox toggle */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleDone(e, index, task!)}
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        task!.done 
                          ? 'bg-sky-500/20 border-sky-500 text-sky-600 dark:border-sky-400 dark:text-sky-300' 
                          : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/60 hover:border-sky-500/60'
                      }`}
                      title={task!.done ? 'Mark incomplete' : 'Mark done'}
                    >
                      {task!.done && <Check className="w-2.5 h-2.5 text-sky-600 dark:text-sky-400 stroke-[3]" />}
                    </button>

                    {/* Task text (click to edit) */}
                    <span
                      onClick={(e) => handleStartEdit(e, index, task!.text)}
                      className={`truncate text-xs tracking-tight cursor-text hover:text-sky-600 dark:hover:text-sky-300 transition-colors ${
                        task!.done 
                          ? 'line-through text-slate-400 dark:text-slate-500' 
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                      title="Click text to edit"
                    >
                      {task!.text}
                    </span>
                  </div>

                  {/* Delete button on hover */}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, index)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-500 dark:hover:text-rose-400 dark:hover:bg-rose-950/50 rounded transition-opacity shrink-0"
                    title="Delete task"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                /* Empty Bracket Slot (click to add task) */
                <div
                  onClick={(e) => handleStartAdd(e, index)}
                  className="w-full h-full flex items-center justify-center cursor-pointer group/slot"
                  title="Click empty bracket to add a task"
                >
                  <span className="text-[10px] text-slate-400 dark:text-slate-600/60 opacity-0 group-hover/slot:opacity-100 group-hover:text-sky-600 dark:group-hover:text-sky-400/80 transition-opacity font-mono">
                    + add task
                  </span>
                </div>
              )}
            </div>

            {/* Right Bracket */}
            <span className="text-sky-600 dark:text-sky-400 font-bold text-lg select-none shrink-0 font-mono">
              ]
            </span>
          </div>
        );
      })}
    </div>
  );
};
