import React from 'react';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Calendar, 
  Star, 
  Award,
  Zap
} from 'lucide-react';
import { ManagerOkrFaceData, Ticket } from '../../../types';

interface ManagerFaceProps {
  ticket: Ticket;
  data?: ManagerOkrFaceData;
  compact?: boolean;
}

export const ManagerFace: React.FC<ManagerFaceProps> = ({
  ticket,
  data,
  compact = false
}) => {
  if (!data) {
    return (
      <div className="p-4 text-xs text-slate-400 italic flex items-center justify-center h-full">
        No executive or OKR alignment mapped for this story.
      </div>
    );
  }

  const pillarColorMap: Record<string, string> = {
    'Operational Resilience': 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
    'Market Growth': 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    'Developer Experience': 'text-indigo-400 bg-indigo-950/40 border-indigo-500/30',
    'Enterprise Security': 'text-amber-400 bg-amber-950/40 border-amber-500/30'
  };

  const pillarBadge = pillarColorMap[data.strategicPillar] || 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';

  return (
    <div className="flex flex-col h-full text-slate-800 dark:text-slate-200 select-none">
      {/* OKR Objective Banner */}
      <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 mb-2">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
            <Target className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Strategic OKR
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-400/30 font-semibold">
            {data.okrCategory || 'Core Initiative'}
          </span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-snug line-clamp-2">
          {data.okrAlignment}
        </p>
      </div>

      {/* Strategic Pillar & Value Grid */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-2">
        {/* Strategic Pillar Tag */}
        <div>
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            Strategic Pillar
          </span>
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold border ${pillarBadge}`}>
            <Award className="w-3.5 h-3.5" />
            <span>{data.strategicPillar}</span>
          </div>
        </div>

        {/* Business ROI */}
        <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-emerald-300 dark:border-emerald-500/20">
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider mb-0.5">
            <DollarSign className="w-3 h-3" />
            Estimated Business Value / ROI
          </div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
            {data.estimatedBusinessValue || 'Operational Efficiency'}
          </p>
        </div>

        {/* Customer Impact Meter (1 - 10) */}
        <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-emerald-300 dark:border-emerald-500/20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Customer Impact Score
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-300">
              {data.customerImpactScore}/10
            </span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-sm transition-all ${
                  i < data.customerImpactScore
                    ? 'bg-emerald-500 dark:bg-emerald-400 shadow-sm shadow-emerald-500/50'
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Milestone & Quarter Footer */}
      <div className="pt-2 border-t border-emerald-200 dark:border-emerald-500/20 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1 truncate">
          <Calendar className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="truncate text-slate-700 dark:text-slate-300 font-medium text-[11px]">
            {data.targetMilestone || 'Q3 Release'}
          </span>
        </div>
      </div>
    </div>
  );
};
