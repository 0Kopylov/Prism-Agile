import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Layers, 
  Shapes, 
  Sparkles, 
  Check, 
  Code2, 
  Compass, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';
import { 
  Ticket, 
  TicketType, 
  TicketStatus, 
  TicketPriority, 
  User, 
  Sprint, 
  SidePerspective 
} from '../../types';
import { DEFAULT_PERSPECTIVES } from '../../data/mockData';

interface CreateTicketModalProps {
  sprints: Sprint[];
  users: User[];
  defaultSprintId: string;
  availablePerspectives?: SidePerspective[];
  nextTicketNumber: number;
  onClose: () => void;
  onCreate: (newTicket: Ticket) => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  sprints,
  users,
  defaultSprintId,
  availablePerspectives,
  nextTicketNumber,
  onClose,
  onCreate
}) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [type, setType] = useState<TicketType>('story');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [storyPoints, setStoryPoints] = useState(5);
  const [sprintId, setSprintId] = useState(defaultSprintId);
  const [assigneeId, setAssigneeId] = useState(users[0]?.id || '');

  // Available perspective pool
  const perspectivePool = availablePerspectives && availablePerspectives.length > 0
    ? availablePerspectives
    : DEFAULT_PERSPECTIVES;

  // Selected perspectives checklist for this specific ticket
  const [selectedPerspectives, setSelectedPerspectives] = useState<SidePerspective[]>(() => {
    return perspectivePool.slice(0, Math.min(4, perspectivePool.length));
  });

  const handleTogglePerspective = (p: SidePerspective) => {
    const isSelected = selectedPerspectives.some(sp => sp.id === p.id);
    if (isSelected) {
      if (selectedPerspectives.length <= 1) return; // Minimum 1 face
      setSelectedPerspectives(prev => prev.filter(sp => sp.id !== p.id));
    } else {
      setSelectedPerspectives(prev => [...prev, p]);
    }
  };

  const handleApplyPreset = (presetIds: string[]) => {
    const matched = perspectivePool.filter(p => presetIds.includes(p.id));
    if (matched.length > 0) {
      setSelectedPerspectives(matched);
    }
  };

  // Perspective facets drafts
  const [techApproach, setTechApproach] = useState('');
  const [gitBranch, setGitBranch] = useState('');
  const [sprintGoalLink, setSprintGoalLink] = useState('');
  const [okrAlignment, setOkrAlignment] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const key = `PRISM-${nextTicketNumber}`;
    const numSides = selectedPerspectives.length;

    const newTicket: Ticket = {
      id: `t-${Date.now()}`,
      key,
      title: title.trim(),
      summary: summary.trim() || title.trim(),
      type,
      status: 'todo',
      priority,
      storyPoints: Number(storyPoints) || 3,
      sprintId,
      assigneeId,
      reporterId: users[1]?.id || users[0]?.id,
      createdAt: 'Today',
      updatedAt: 'Just now',
      tags: ['agile', type, `${numSides}d-prism`],
      perspectives: selectedPerspectives,
      activeFaceIndex: 0,
      faces: {
        developer: {
          technicalApproach: techApproach.trim() || 'Implement architectural spec and unit tests.',
          gitBranch: gitBranch.trim() || `feat/${key.toLowerCase()}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.slice(0, 35),
          techStack: ['TypeScript', 'React', 'Tailwind'],
          checklist: [
            { id: 'c1', text: 'Define API contract & interfaces', done: false },
            { id: 'c2', text: 'Implement business logic and edge cases', done: false },
            { id: 'c3', text: 'Peer review and staging verification', done: false }
          ],
          apiEndpoints: [],
          complexityEstimate: storyPoints >= 8 ? 'T-Shirt L' : storyPoints >= 5 ? 'T-Shirt M' : 'T-Shirt S'
        },
        lead: {
          sprintGoalAlignment: sprintGoalLink.trim() || 'Contributes directly to active sprint milestones.',
          goalConfidence: 90,
          riskLevel: 'low',
          riskMitigation: 'Regular sync during daily standup.',
          dependencies: [],
          blocks: [],
          architecturalSignoff: false
        },
        manager: {
          okrAlignment: okrAlignment.trim() || 'Supports core enterprise uptime and product growth OKR.',
          okrCategory: 'Strategic Delivery',
          strategicPillar: 'Developer Experience',
          estimatedBusinessValue: 'Accelerates team delivery velocity',
          targetMilestone: 'Sprint Release',
          customerImpactScore: 8
        },
        qa: {
          testScenarios: [
            { id: 'q1', scenario: 'Verify functional acceptance criteria', passed: false },
            { id: 'q2', scenario: 'Boundary value and failure recovery test', passed: false }
          ],
          automatedCoverageTarget: 90,
          regressionRisk: 'low',
          qaSignoff: 'untested'
        }
      },
      timeTracking: {
        originalEstimateHours: (Number(storyPoints) || 3) * 4,
        timeSpentHours: 0,
        remainingHours: (Number(storyPoints) || 3) * 4,
        startDate: new Date().toISOString().substring(0, 10),
        dueDate: '2026-09-18',
        worklogs: []
      },
      comments: []
    };

    onCreate(newTicket);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/90 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-500/40 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Shapes className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Create New 3D Agile Story
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ticket Key will be generated as <strong className="text-sky-600 dark:text-sky-400 font-mono">PRISM-{nextTicketNumber}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
              Story Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement distributed cache warming strategy..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Core metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Issue Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TicketType)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="story">Story</option>
                <option value="task">Task</option>
                <option value="bug">Bug</option>
                <option value="epic">Epic</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="lowest">Lowest</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="highest">Highest</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Story Points
              </label>
              <input
                type="number"
                min="1"
                max="21"
                value={storyPoints}
                onChange={(e) => setStoryPoints(Number(e.target.value) || 1)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Sprint
              </label>
              <select
                value={sprintId}
                onChange={(e) => setSprintId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
              >
                {sprints.map(s => (
                  <option key={s.id} value={s.id}>{s.name.split(':')[0]}</option>
                ))}
                <option value="backlog">Backlog</option>
              </select>
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.roleTitle})</option>
              ))}
            </select>
          </div>

          {/* Perspective Faces Checklist */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Shapes className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>3D Perspective Faces Checklist</span>
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select which perspective faces this ticket possesses in 3D space.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-500/30 shrink-0">
                {selectedPerspectives.length} {selectedPerspectives.length === 1 ? 'Face' : 'Faces'}
              </span>
            </div>

            {/* Quick Combinations */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Presets:
              </span>
              <button
                type="button"
                onClick={() => handleApplyPreset(['developer'])}
                className="px-2 py-0.5 text-[11px] rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Dev (1)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(['developer', 'qa'])}
                className="px-2 py-0.5 text-[11px] rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Dev + QA (2)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(['developer', 'lead', 'qa'])}
                className="px-2 py-0.5 text-[11px] rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Dev, Lead, QA (3)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(['developer', 'lead', 'manager', 'qa'])}
                className="px-2 py-0.5 text-[11px] rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Core 4
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(perspectivePool.map(p => p.id))}
                className="px-2 py-0.5 text-[11px] rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                All ({perspectivePool.length})
              </button>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {perspectivePool.map(p => {
                const isChecked = selectedPerspectives.some(sp => sp.id === p.id);
                const isOnlyOne = isChecked && selectedPerspectives.length === 1;

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (!isOnlyOne) {
                        handleTogglePerspective(p);
                      }
                    }}
                    className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 cursor-pointer transition select-none ${
                      isChecked
                        ? 'bg-white dark:bg-slate-900 border-sky-400 dark:border-sky-500 shadow-sm'
                        : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                    } ${isOnlyOne ? 'cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded flex items-center justify-center transition ${
                        isChecked 
                          ? 'bg-sky-500 text-white' 
                          : 'border border-slate-300 dark:border-slate-600'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <span 
                        className="w-3 h-3 rounded-full shrink-0" 
                        style={{ backgroundColor: p.color }} 
                      />

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {p.name}
                          </span>
                          <span 
                            className="text-[9px] font-mono px-1 rounded border font-semibold"
                            style={{ borderColor: `${p.color}40`, color: p.color }}
                          >
                            {p.shortLabel}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {p.description}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-medium shrink-0 text-slate-400">
                      {isChecked ? 'Mounted' : 'Add'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Initial Perspective Field Starters */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Initial Perspective Specs
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Developer: Technical Approach
                </label>
                <input
                  type="text"
                  value={techApproach}
                  onChange={(e) => setTechApproach(e.target.value)}
                  placeholder="e.g. Distributed lock with Redis Redlock"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Manager: Department OKR Alignment
                </label>
                <input
                  type="text"
                  value={okrAlignment}
                  onChange={(e) => setOkrAlignment(e.target.value)}
                  placeholder="e.g. OKR-1: 99.999% Service Level Availability"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/20 transition"
            >
              Create 3D Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
