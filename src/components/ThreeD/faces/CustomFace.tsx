import React from 'react';
import { Sparkles, FileText, CheckSquare, Layers, Tag } from 'lucide-react';
import { CustomFaceData, SidePerspective, Ticket } from '../../../types';

interface CustomFaceProps {
  ticket: Ticket;
  perspective: SidePerspective;
  data?: CustomFaceData;
}

export const CustomFace: React.FC<CustomFaceProps> = ({
  ticket,
  perspective,
  data
}) => {
  return (
    <div className="flex flex-col h-full text-slate-800 dark:text-slate-200 select-none">
      {/* Perspective Header Banner */}
      <div 
        className="p-2 rounded mb-2 border"
        style={{
          backgroundColor: `${perspective.color}15`,
          borderColor: `${perspective.color}40`
        }}
      >
        <div className="flex items-center justify-between gap-1 mb-1">
          <span 
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ color: perspective.color }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {perspective.name}
          </span>
          <span 
            className="text-[10px] font-mono px-1.5 py-0.5 rounded border font-semibold"
            style={{ 
              borderColor: `${perspective.color}40`,
              color: perspective.color 
            }}
          >
            {perspective.shortLabel}
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
          {perspective.description}
        </p>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-2">
        <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
            <FileText className="w-3 h-3" />
            <span>Story Alignment & Context</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
            {ticket.summary}
          </p>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-1.5">
            {ticket.tags.map((tag, i) => (
              <span 
                key={i} 
                className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1"
              >
                <Tag className="w-2.5 h-2.5 opacity-60" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Workflow Status
            </span>
            <span className="font-mono text-slate-700 dark:text-slate-300 uppercase font-semibold">
              {ticket.status.replace('_', ' ')}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Assigned to: <span className="text-slate-700 dark:text-slate-200 font-medium">Sprint 42</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div 
        className="pt-2 border-t flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400"
        style={{ borderColor: `${perspective.color}30` }}
      >
        <span className="text-[10px] text-slate-500 dark:text-slate-400">
          Custom Multi-Angle Facet
        </span>
        <span 
          className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
          style={{ 
            backgroundColor: `${perspective.color}20`,
            color: perspective.color 
          }}
        >
          {perspective.shortLabel} View
        </span>
      </div>
    </div>
  );
};
