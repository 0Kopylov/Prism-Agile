import React, { useState } from 'react';
import { 
  Plus, 
  Layers, 
  Calendar, 
  ChevronRight, 
  ChevronDown, 
  Maximize2, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Ticket, Sprint, User } from '../../types';

interface BacklogViewProps {
  tickets: Ticket[];
  sprints: Sprint[];
  users: User[];
  onOpenTicketModal: (ticket: Ticket) => void;
  onMoveTicketSprint: (ticketId: string, sprintId: string) => void;
  onCreateTicket: () => void;
  onCreateSprint: () => void;
}

export const BacklogView: React.FC<BacklogViewProps> = ({
  tickets,
  sprints,
  users,
  onOpenTicketModal,
  onMoveTicketSprint,
  onCreateTicket,
  onCreateSprint
}) => {
  const [collapsedSprints, setCollapsedSprints] = useState<Record<string, boolean>>({});

  const toggleSprint = (sprintId: string) => {
    setCollapsedSprints(prev => ({ ...prev, [sprintId]: !prev[sprintId] }));
  };

  const getSprintTickets = (sprintId: string) => {
    return tickets.filter(t => t.sprintId === sprintId);
  };

  const unassignedTickets = tickets.filter(t => !t.sprintId || t.sprintId === 'backlog');

  const priorityBadge: Record<string, string> = {
    lowest: 'text-slate-600 bg-slate-100 border border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-transparent',
    low: 'text-sky-700 bg-sky-50 border border-sky-300 dark:text-sky-400 dark:bg-sky-950/60 dark:border-sky-500/20',
    medium: 'text-amber-700 bg-amber-50 border border-amber-300 dark:text-amber-400 dark:bg-amber-950/60 dark:border-amber-500/20',
    high: 'text-orange-700 bg-orange-50 border border-orange-300 dark:text-orange-400 dark:bg-orange-950/60 dark:border-orange-500/20',
    highest: 'text-rose-700 bg-rose-50 border border-rose-300 dark:text-rose-400 dark:bg-rose-950/60 dark:border-rose-500/20'
  };

  const renderTicketRow = (ticket: Ticket) => {
    const assignee = users.find(u => u.id === ticket.assigneeId);
    const numSides = ticket.perspectives?.length || 4;

    return (
      <div
        key={ticket.id}
        onClick={() => onOpenTicketModal(ticket)}
        className="group flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer shadow-sm"
      >
        <div className="flex items-center gap-3 truncate max-w-2xl">
          {/* 3D Polyhedron Sides Tag */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/50 dark:border-sky-500/30 dark:text-sky-300 font-mono text-[11px] shrink-0 font-semibold">
            <span>{numSides}D</span>
          </div>

          <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 shrink-0">
            {ticket.key}
          </span>

          <span className="text-[18px] font-semibold text-slate-900 dark:text-slate-100 truncate">
            {ticket.title}
          </span>

          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded shrink-0 ${priorityBadge[ticket.priority]}`}>
            {ticket.priority}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Perspectives Mini Ribbons */}
          <div className="hidden md:flex items-center gap-1">
            {ticket.perspectives?.map((p) => (
              <span
                key={p.id}
                className="text-[9px] font-mono px-1 py-0.2 rounded font-bold"
                style={{
                  backgroundColor: `${p.color}20`,
                  color: p.color
                }}
                title={p.name}
              >
                {p.shortLabel}
              </span>
            ))}
          </div>

          {/* Move to Sprint dropdown */}
          <select
            value={ticket.sprintId}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onMoveTicketSprint(ticket.id, e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            {sprints.map(s => (
              <option key={s.id} value={s.id}>{s.name.split(':')[0]}</option>
            ))}
            <option value="backlog">Backlog</option>
          </select>

          {/* Assignee Avatar & Name (Enlarged) */}
          <div className="flex items-center gap-2" title={`Assigned to ${assignee?.name || 'Unassigned'}`}>
            {assignee?.avatar ? (
              <img
                src={assignee.avatar}
                alt={assignee.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-slate-300 dark:border-slate-600 shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
                ?
              </div>
            )}
            <span className="hidden sm:inline text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
              {assignee?.name || 'Unassigned'}
            </span>
          </div>

          {/* Story Points */}
          <span className="w-6 text-center font-mono font-bold text-xs text-sky-700 dark:text-sky-400 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            {ticket.storyPoints}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenTicketModal(ticket);
            }}
            className="p-1 rounded text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:text-sky-300 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-500 dark:text-sky-400" />
            <span>Backlog & Multi-Perspective Sprint Planning</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Groom 3D multi-faceted stories, balance sprint velocity, and plan quarterly release commitments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCreateSprint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Sprint</span>
          </button>

          <button
            onClick={onCreateTicket}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create 3D Story</span>
          </button>
        </div>
      </div>

      {/* Sprints Sections */}
      <div className="space-y-6">
        {sprints.map((sprint) => {
          const sprintTickets = getSprintTickets(sprint.id);
          const totalPts = sprintTickets.reduce((acc, t) => acc + (t.storyPoints || 0), 0);
          const isCollapsed = collapsedSprints[sprint.id];

          return (
            <div
              key={sprint.id}
              className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm"
            >
              {/* Sprint Header */}
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSprint(sprint.id)}>
                <div className="flex items-center gap-2.5">
                  <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>{sprint.name}</span>
                    {sprint.status === 'active' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30">
                        Active
                      </span>
                    )}
                    {sprint.status === 'planned' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-500/30">
                        Planned
                      </span>
                    )}
                  </h3>

                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    ({sprintTickets.length} issues)
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    <span>{sprint.startDate} ~ {sprint.endDate}</span>
                  </div>

                  <span className="font-mono font-bold text-sky-700 dark:text-sky-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                    {totalPts} pts
                  </span>
                </div>
              </div>

              {/* Sprint Goal */}
              <div className="text-xs text-slate-500 dark:text-slate-400 pl-6 italic">
                Goal: {sprint.goal}
              </div>

              {/* Tickets List */}
              {!isCollapsed && (
                <div className="space-y-2 pt-1 pl-6">
                  {sprintTickets.map(ticket => renderTicketRow(ticket))}

                  {sprintTickets.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-600 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      Plan this sprint by dragging or assigning 3D stories from the backlog below.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Unassigned Product Backlog */}
        <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span>Product Backlog (Unassigned)</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                ({unassignedTickets.length} issues)
              </span>
            </h3>

            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              {unassignedTickets.reduce((acc, t) => acc + (t.storyPoints || 0), 0)} pts
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {unassignedTickets.map(ticket => renderTicketRow(ticket))}

            {unassignedTickets.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-600 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No unassigned backlog items. Create a 3D story to populate the backlog.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
