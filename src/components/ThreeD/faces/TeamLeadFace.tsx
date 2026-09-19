import React from 'react';
import { 
  Compass, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Link2, 
  Target 
} from 'lucide-react';
import { TeamLeadFaceData, Ticket } from '../../../types';

interface TeamLeadFaceProps {
  ticket: Ticket;
  data?: TeamLeadFaceData;
  compact?: boolean;
  onToggleSignoff?: () => void;
}

export const TeamLeadFace: React.FC<TeamLeadFaceProps> = ({
  ticket,
  data,
  compact = false,
  onToggleSignoff
}) => {
  if (!data) {
    return (
      <div className="p-4 text-xs text-slate-400 italic flex items-center justify-center h-full">
        No team lead specifications provided yet.
      </div>
    );
  }

  const riskBadgeStyles = {
    low: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40',
    medium: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40',
    high: 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-500/40',
    critical: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-500/40 animate-pulse'
  };

  return (
    <div className="flex flex-col h-full text-slate-800 dark:text-slate-200 select-none">
      {/* Sprint Goal Alignment Card */}
      <div className="p-2 rounded bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 mb-2">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="flex items-center gap-1 text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
            <Target className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            Sprint Goal Link
          </span>
          <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 font-semibold">
            {data.goalConfidence}% Conf.
          </span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug line-clamp-2">
          {data.sprintGoalAlignment}
        </p>
        
        {/* Confidence progress bar */}
        <div className="w-full bg-purple-200 dark:bg-purple-950/80 rounded-full h-1.5 mt-2 overflow-hidden border border-purple-300 dark:border-purple-500/20">
          <div 
            className="bg-purple-500 dark:bg-purple-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${data.goalConfidence}%` }}
          />
        </div>
      </div>

      {/* Risk Assessment & Mitigation */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            Risk Factor
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${riskBadgeStyles[data.riskLevel]}`}>
            {data.riskLevel} Risk
          </span>
        </div>

        {data.riskMitigation && (
          <div className="text-[11px] bg-slate-50 dark:bg-slate-900/60 p-2 rounded border border-purple-300 dark:border-purple-500/20 text-slate-700 dark:text-slate-300 leading-tight">
            <span className="text-purple-700 dark:text-purple-300 font-semibold block mb-0.5">Mitigation Plan:</span>
            {data.riskMitigation}
          </div>
        )}

        {/* Dependencies / Blockers */}
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Link2 className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            Dependency Graph
          </span>
          <div className="flex flex-wrap gap-1">
            {data.dependencies && data.dependencies.length > 0 ? (
              data.dependencies.map((dep, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 font-mono">
                  Depends on {dep}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">No inbound blockers</span>
            )}

            {data.blocks && data.blocks.length > 0 && (
              data.blocks.map((blk, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30 font-mono">
                  Blocks {blk}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Architectural Sign-off footer */}
      <div className="pt-2 border-t border-purple-200 dark:border-purple-500/20 flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSignoff?.();
          }}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition border ${
            data.architecturalSignoff
              ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-500/50 hover:bg-purple-200 dark:hover:bg-purple-900/80'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:text-purple-700 dark:hover:text-purple-300'
          }`}
        >
          {data.architecturalSignoff ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-[11px]">Arch Approved</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span className="text-[11px]">Signoff Pending</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
