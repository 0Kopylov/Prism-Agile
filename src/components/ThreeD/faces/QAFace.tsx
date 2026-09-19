import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Activity 
} from 'lucide-react';
import { QaFaceData, Ticket } from '../../../types';

interface QAFaceProps {
  ticket: Ticket;
  data?: QaFaceData;
  compact?: boolean;
  onToggleScenario?: (scenarioId: string) => void;
}

export const QAFace: React.FC<QAFaceProps> = ({
  ticket,
  data,
  compact = false,
  onToggleScenario
}) => {
  if (!data) {
    return (
      <div className="p-4 text-xs text-slate-400 italic flex items-center justify-center h-full">
        No QA test matrix defined for this ticket.
      </div>
    );
  }

  const signoffConfig = {
    untested: {
      label: 'Untested',
      color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      icon: Clock
    },
    in_testing: {
      label: 'In Testing',
      color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40',
      icon: Activity
    },
    passed: {
      label: 'QA Passed',
      color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40',
      icon: CheckCircle2
    },
    blocked: {
      label: 'QA Blocked',
      color: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-500/40',
      icon: AlertCircle
    }
  };

  const currentSignoff = signoffConfig[data.qaSignoff] || signoffConfig.untested;
  const SignoffIcon = currentSignoff.icon;

  const passedScenarios = data.testScenarios?.filter(s => s.passed).length || 0;
  const totalScenarios = data.testScenarios?.length || 0;

  return (
    <div className="flex flex-col h-full text-slate-800 dark:text-slate-200 select-none">
      {/* Sign-off Banner */}
      <div className="flex items-center justify-between p-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 mb-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-bold text-amber-800 dark:text-amber-300">QA Quality Gate</span>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${currentSignoff.color}`}>
          <SignoffIcon className="w-3 h-3" />
          <span>{currentSignoff.label}</span>
        </div>
      </div>

      {/* Test Scenarios & Coverage */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-2">
        {/* Coverage Progress Bar */}
        <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-amber-300 dark:border-amber-500/20">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Target Automated Coverage
            </span>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-300 text-xs">
              {data.automatedCoverageTarget}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-amber-500 dark:bg-amber-400 h-full rounded-full transition-all"
              style={{ width: `${data.automatedCoverageTarget}%` }}
            />
          </div>
        </div>

        {/* Test Scenarios Checklist */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            <span>Acceptance Test Scenarios</span>
            <span className="text-amber-600 dark:text-amber-400 font-mono">
              {passedScenarios}/{totalScenarios} Passed
            </span>
          </div>

          <div className="space-y-1.5">
            {data.testScenarios?.map((scenario) => (
              <div
                key={scenario.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleScenario?.(scenario.id);
                }}
                className={`flex items-start gap-2 p-1.5 rounded transition cursor-pointer text-xs border ${
                  scenario.passed
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/20 text-slate-700 dark:text-slate-300'
                    : 'bg-slate-50 dark:bg-slate-900/50 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {scenario.passed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5 hover:text-amber-500" />
                )}
                <span className={`leading-tight ${scenario.passed ? 'text-slate-600 dark:text-slate-300' : 'text-slate-800 dark:text-slate-200'}`}>
                  {scenario.scenario}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regression Risk Footer */}
      <div className="pt-2 border-t border-amber-200 dark:border-amber-500/20 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-semibold">
          Regression Risk: <span className="text-amber-700 dark:text-amber-300 capitalize font-medium">{data.regressionRisk}</span>
        </span>
      </div>
    </div>
  );
};
