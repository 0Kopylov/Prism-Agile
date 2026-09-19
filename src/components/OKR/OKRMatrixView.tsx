import React from 'react';
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Zap, 
  ShieldCheck, 
  AlertTriangle,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Ticket, OkrGoal, User } from '../../types';

interface OKRMatrixViewProps {
  tickets: Ticket[];
  okrGoals: OkrGoal[];
  users: User[];
  onOpenTicketModal: (ticket: Ticket) => void;
}

export const OKRMatrixView: React.FC<OKRMatrixViewProps> = ({
  tickets,
  okrGoals,
  users,
  onOpenTicketModal
}) => {
  // Aggregate stats per OKR
  const getPointsForOKR = (okrCode: string) => {
    return tickets
      .filter(t => t.faces.manager?.okrAlignment.includes(okrCode))
      .reduce((sum, t) => sum + (t.storyPoints || 0), 0);
  };

  const getTicketsForOKR = (okrCode: string) => {
    return tickets.filter(t => t.faces.manager?.okrAlignment.includes(okrCode));
  };

  // Group by strategic pillars
  const pillars = [
    'Operational Resilience',
    'Market Growth',
    'Developer Experience',
    'Enterprise Security'
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            <span>Executive OKR Alignment & Value Matrix</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time projection from the Manager & OKR side of each 3D story across department strategic goals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30 font-mono shadow-sm">
            Q3 2026 Strategic Plan
          </span>
        </div>
      </div>

      {/* Strategic OKR Goals Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {okrGoals.map((okr) => {
          const points = getPointsForOKR(okr.code);
          const alignedTickets = getTicketsForOKR(okr.code);

          return (
            <div
              key={okr.id}
              className="p-4 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950/90 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm dark:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-500/40">
                  {okr.code}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Owner: {okr.owner}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {okr.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Target: {okr.targetMetric}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>Quarterly Trajectory</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{okr.currentProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${okr.currentProgress}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Sprint Allocation:
                </span>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                  {points} pts ({alignedTickets.length} stories)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategic Pillar Breakdown Matrix */}
      <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>Stories Mapped by Strategic Pillar</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Click any story to view its 3D object representation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map((pillar) => {
            const pillarTickets = tickets.filter(
              t => t.faces.manager?.strategicPillar === pillar
            );
            const pillarPoints = pillarTickets.reduce((acc, t) => acc + (t.storyPoints || 0), 0);

            return (
              <div
                key={pillar}
                className="p-4 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {pillar}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ({pillarTickets.length} stories)
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/30">
                    {pillarPoints} pts
                  </span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {pillarTickets.map((t) => {
                    const assignee = users.find(u => u.id === t.assigneeId);
                    const managerData = t.faces.manager;

                    return (
                      <div
                        key={t.id}
                        onClick={() => onOpenTicketModal(t)}
                        className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-900/70 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono font-bold text-sky-600 dark:text-sky-400 shrink-0">
                            {t.key}
                          </span>
                          <span className="text-slate-800 dark:text-slate-200 truncate font-medium">
                            {t.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {managerData?.estimatedBusinessValue && (
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/30 truncate max-w-[130px]">
                              {managerData.estimatedBusinessValue}
                            </span>
                          )}

                          <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            {t.storyPoints} pts
                          </span>

                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400" />
                        </div>
                      </div>
                    );
                  })}

                  {pillarTickets.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-600 italic">
                      No active sprint stories categorized under {pillar}.
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
