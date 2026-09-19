import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  User as UserIcon,
  Layers,
  ChevronDown,
  AlertTriangle,
  MoveRight
} from 'lucide-react';
import { Ticket, TicketStatus, Sprint, User, SidePerspective, TimeDisplayMode, ChecklistItem } from '../../types';
import { PolyhedralTicket } from '../ThreeD/PolyhedralTicket';
import { DEFAULT_PERSPECTIVES } from '../../data/mockData';

interface SprintBoardProps {
  tickets: Ticket[];
  sprint: Sprint;
  users: User[];
  currentUser: User;
  globalPerspectiveId: string;
  onSetGlobalPerspective: (perspectiveId: string) => void;
  onOpenTicketModal: (ticket: Ticket) => void;
  onUpdateTicketStatus: (ticketId: string, newStatus: TicketStatus) => void;
  onUpdateChecklist: (ticketId: string, itemId: string, done: boolean) => void;
  onUpdateTicketChecklist?: (ticketId: string, checklist: ChecklistItem[]) => void;
  onToggleSignoff: (ticketId: string) => void;
  onToggleScenario: (ticketId: string, scenarioId: string) => void;
  onRotateTicketFace: (ticketId: string, newFaceIndex: number) => void;
  onLogHours?: (ticketId: string, hours: number, note?: string) => void;
  onUpdatePoints?: (ticketId: string, points: number) => void;
  onCreateTicket: () => void;
}

const COLUMNS: { id: TicketStatus; label: string; color: string; border: string }[] = [
  { id: 'todo', label: 'To Do', color: 'text-slate-700 bg-slate-200 dark:text-slate-300 dark:bg-slate-800/80', border: 'border-slate-300 dark:border-slate-700/60' },
  { id: 'in_progress', label: 'In Progress', color: 'text-sky-700 bg-sky-100 dark:text-sky-300 dark:bg-sky-950/60', border: 'border-sky-300 dark:border-sky-500/40' },
  { id: 'review', label: 'Code Review', color: 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-950/60', border: 'border-purple-300 dark:border-purple-500/40' },
  { id: 'qa', label: 'QA Review', color: 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-950/60', border: 'border-amber-300 dark:border-amber-500/40' },
  { id: 'done', label: 'Done', color: 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/60', border: 'border-emerald-300 dark:border-emerald-500/40' }
];

export const SprintBoard: React.FC<SprintBoardProps> = ({
  tickets,
  sprint,
  users,
  currentUser,
  globalPerspectiveId,
  onSetGlobalPerspective,
  onOpenTicketModal,
  onUpdateTicketStatus,
  onUpdateChecklist,
  onUpdateTicketChecklist,
  onToggleSignoff,
  onToggleScenario,
  onRotateTicketFace,
  onLogHours,
  onUpdatePoints,
  onCreateTicket
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [draggingTicketId, setDraggingTicketId] = useState<string | null>(null);
  const [globalTimeDisplayMode, setGlobalTimeDisplayMode] = useState<TimeDisplayMode>('time');

  // Filter tickets for this active sprint
  const sprintTickets = tickets.filter(t => t.sprintId === sprint.id);

  // Applied filtered list
  const filteredTickets = sprintTickets.filter(t => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchKey = t.key.toLowerCase().includes(q);
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchTags = t.tags.some(tag => tag.toLowerCase().includes(q));
      if (!matchKey && !matchTitle && !matchTags) return false;
    }
    if (selectedAssignee !== 'all' && t.assigneeId !== selectedAssignee) return false;
    if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;
    return true;
  });

  // Calculate story point velocity metrics
  const totalSprintPoints = sprintTickets.reduce((acc, t) => acc + (t.storyPoints || 0), 0);
  const doneSprintPoints = sprintTickets
    .filter(t => t.status === 'done')
    .reduce((acc, t) => acc + (t.storyPoints || 0), 0);
  const velocityPercentage = totalSprintPoints > 0 
    ? Math.round((doneSprintPoints / totalSprintPoints) * 100) 
    : 0;

  // HTML5 Drag and Drop handlers for agile column movement
  const handleDragStart = (e: React.DragEvent, ticketId: string) => {
    e.dataTransfer.setData('text/plain', ticketId);
    setDraggingTicketId(ticketId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TicketStatus) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('text/plain');
    if (ticketId) {
      onUpdateTicketStatus(ticketId, targetStatus);
    }
    setDraggingTicketId(null);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      
      {/* 3D Global Perspective Lens Switcher Ribbon */}
      <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-wrap items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-sky-500 dark:text-sky-400 animate-pulse" />
            <span>Global 3D Perspective Lens:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {DEFAULT_PERSPECTIVES.map((p) => {
              const isActive = globalPerspectiveId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSetGlobalPerspective(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'shadow-md scale-105 border'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700/60'
                  }`}
                  style={{
                    backgroundColor: isActive ? `${p.color}20` : undefined,
                    borderColor: isActive ? p.color : undefined,
                    color: isActive ? p.color : undefined
                  }}
                  title={`Synchronously spin all 3D tickets to the ${p.name} perspective`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span>{p.name}</span>
                </button>
              );
            })}

            <button
              onClick={() => onSetGlobalPerspective('free')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                globalPerspectiveId === 'free'
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-500'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
              title="Allow each 3D card to be rotated independently"
            >
              🔄 Free 3D Spin
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCreateTicket}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create 3D Story</span>
          </button>
        </div>
      </div>

      {/* Sprint Info & Velocity Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-xl text-xs text-slate-700 dark:text-slate-300 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{sprint.name}</span>
          <span className="hidden sm:inline-block text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 pl-3 italic">
            "{sprint.goal}"
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] uppercase font-semibold">
              Velocity:
            </span>
            <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-xs">
              {doneSprintPoints}/{totalSprintPoints} pts ({velocityPercentage}%)
            </span>
            <div className="w-24 bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${velocityPercentage}%` }}
              />
            </div>
          </div>

          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30 text-[11px] font-semibold">
            Active Sprint
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket key, summary, or tags..."
              className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 transition shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Assignee Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 text-slate-700 dark:text-slate-300 shadow-sm">
            <UserIcon className="w-3 h-3 text-slate-400" />
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">All Assignees</option>
              {users.map(u => (
                <option key={u.id} value={u.id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">{u.name}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 text-slate-700 dark:text-slate-300 shadow-sm">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">All Priorities</option>
              <option value="highest" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Highest</option>
              <option value="high" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">High</option>
              <option value="medium" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Medium</option>
              <option value="low" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Low</option>
              <option value="lowest" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Lowest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex-1 overflow-x-auto pb-6">
        <div className="flex items-start gap-4 min-w-[1450px]">
          {COLUMNS.map((col) => {
            const colTickets = filteredTickets.filter(t => t.status === col.id);
            const colStoryPoints = colTickets.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
            const colHours = colTickets.reduce((sum, t) => {
              const est = t.timeTracking?.originalEstimateHours ?? ((t.storyPoints || 3) * 4);
              return sum + est;
            }, 0);

            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="w-[300px] shrink-0 bg-slate-100/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-2.5 flex flex-col min-h-[580px] shadow-sm"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-2 py-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${col.color}`}>
                      {col.label}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                      {colTickets.length}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-300">{colStoryPoints}</strong> pts • <strong className="text-cyan-600 dark:text-cyan-400">{colHours}h</strong>
                  </span>
                </div>

                {/* Tickets Stack */}
                <div className="flex-1 space-y-3.5 overflow-y-auto pr-0.5">
                  {colTickets.map((ticket) => {
                    const assignee = users.find(u => u.id === ticket.assigneeId);
                    return (
                      <div
                        key={ticket.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, ticket.id)}
                        className="transition-transform active:scale-[0.98] cursor-grab active:cursor-grabbing"
                      >
                        <PolyhedralTicket
                          ticket={ticket}
                          assignee={assignee}
                          globalPerspectiveId={globalPerspectiveId}
                          globalTimeDisplayMode={globalTimeDisplayMode}
                          onOpenModal={onOpenTicketModal}
                          onUpdateChecklist={onUpdateChecklist}
                          onUpdateTicketChecklist={onUpdateTicketChecklist}
                          onToggleSignoff={onToggleSignoff}
                          onToggleScenario={onToggleScenario}
                          onRotateFace={onRotateTicketFace}
                          onLogHours={onLogHours}
                          onUpdatePoints={onUpdatePoints}
                        />
                      </div>
                    );
                  })}

                  {colTickets.length === 0 && (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-800/80 rounded-xl text-xs text-slate-600">
                      Drag 3D tickets here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
