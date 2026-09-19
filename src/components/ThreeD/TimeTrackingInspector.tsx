import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Hourglass, 
  Play, 
  Pause, 
  Plus, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw,
  Zap,
  Flame,
  Award,
  Layers,
  FileText,
  User as UserIcon,
  Timer,
  ChevronRight,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { Ticket, User, TimeDisplayMode, TaskTimeTracking, WorklogEntry } from '../../types';
import { calculatePrismGeometry } from '../../utils/prismMath';
import { TopTimeFace } from './faces/TopTimeFace';

interface TimeTrackingInspectorProps {
  ticket: Ticket;
  currentUser: User;
  onUpdateTicket: (updated: Ticket) => void;
  onRequestTopView3D?: () => void;
}

export const TimeTrackingInspector: React.FC<TimeTrackingInspectorProps> = ({
  ticket,
  currentUser,
  onUpdateTicket,
  onRequestTopView3D
}) => {
  const [displayMode, setDisplayMode] = useState<TimeDisplayMode>('time');

  // Ensure robust fallback data
  const timeData: TaskTimeTracking = ticket.timeTracking || {
    originalEstimateHours: (ticket.storyPoints || 3) * 4,
    timeSpentHours: ticket.status === 'done' ? (ticket.storyPoints || 3) * 4 : Math.round((ticket.storyPoints || 3) * 2.5),
    remainingHours: ticket.status === 'done' ? 0 : Math.max(0, (ticket.storyPoints || 3) * 4 - Math.round((ticket.storyPoints || 3) * 2.5)),
    startDate: ticket.createdAt || '2026-08-29',
    dueDate: '2026-09-12',
    cycleTimeDays: ticket.status === 'done' ? 4.2 : 2.4,
    leadTimeDays: ticket.status === 'done' ? 5.8 : 3.8,
    worklogs: [
      {
        id: `wl-init-${ticket.id}`,
        authorId: ticket.assigneeId,
        authorName: 'Alex Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
        hours: Math.round((ticket.storyPoints || 3) * 1.5),
        date: '2026-08-30 14:00',
        note: 'Scaffolded architecture and baseline test harness'
      }
    ]
  };

  // Geometry for previewing the top face
  const numSides = ticket.perspectives?.length || 4;
  const geometry = calculatePrismGeometry(numSides, 240, 240);

  // Worklog form state
  const [logHoursInput, setLogHoursInput] = useState<string>('2');
  const [logNoteInput, setLogNoteInput] = useState<string>('');
  const [originalEstimateInput, setOriginalEstimateInput] = useState<number>(timeData.originalEstimateHours || 16);

  // Live stopwatch timer
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleToggleTimer = () => {
    if (isTimerRunning) {
      // Prompt or auto-commit
      const hours = Math.max(0.25, Number((timerSeconds / 3600).toFixed(2)));
      handleCommitWorklog(hours, `Timer session (${Math.round(timerSeconds / 60)} mins)`);
      setIsTimerRunning(false);
      setTimerSeconds(0);
    } else {
      setIsTimerRunning(true);
    }
  };

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCommitWorklog = (hours: number, note?: string) => {
    if (hours <= 0) return;
    const newEntry: WorklogEntry = {
      id: `wl-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      hours: Number(hours.toFixed(2)),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      note: note || logNoteInput || 'Sprint development work'
    };

    const newSpent = (timeData.timeSpentHours || 0) + hours;
    const newRemaining = Math.max(0, (timeData.remainingHours || 0) - hours);

    const updatedTime: TaskTimeTracking = {
      ...timeData,
      timeSpentHours: Number(newSpent.toFixed(2)),
      remainingHours: Number(newRemaining.toFixed(2)),
      worklogs: [newEntry, ...(timeData.worklogs || [])]
    };

    onUpdateTicket({
      ...ticket,
      timeTracking: updatedTime,
      updatedAt: 'Just now'
    });

    setLogNoteInput('');
  };

  const handleUpdatePoints = (pts: number) => {
    const factor = pts / (ticket.storyPoints || 1);
    const newEst = Math.round((timeData.originalEstimateHours || 16) * factor);
    const newRemaining = Math.max(0, newEst - (timeData.timeSpentHours || 0));

    onUpdateTicket({
      ...ticket,
      storyPoints: pts,
      timeTracking: {
        ...timeData,
        originalEstimateHours: newEst,
        remainingHours: newRemaining
      },
      updatedAt: 'Just now'
    });
  };

  const handleSaveEstimate = () => {
    const est = Math.max(1, Number(originalEstimateInput) || 1);
    const remaining = Math.max(0, est - (timeData.timeSpentHours || 0));

    onUpdateTicket({
      ...ticket,
      timeTracking: {
        ...timeData,
        originalEstimateHours: est,
        remainingHours: remaining
      },
      updatedAt: 'Just now'
    });
  };

  const percentSpent = Math.round(((timeData.timeSpentHours || 0) / (timeData.originalEstimateHours || 1)) * 100);
  const isDone = ticket.status === 'done';

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Dual Mode Switcher & 3D Side View Trigger */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-100 via-sky-50 to-slate-100 dark:from-slate-900/90 dark:via-sky-950/40 dark:to-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Timeline: 3D Bar & Story Points
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30 font-bold">
              Side View (1 SP / Unit Height)
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            In Timeline Side View, tickets are rendered as 3D bars where physical vertical height directly corresponds to task time in story points (unit of measure is 1 story point).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle between Duration and Points */}
          <div className="flex items-center bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setDisplayMode('time')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                displayMode === 'time'
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Time (Hours)</span>
            </button>
            <button
              onClick={() => setDisplayMode('points')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                displayMode === 'points'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Story Points</span>
            </button>
          </div>

          {onRequestTopView3D && (
            <button
              onClick={onRequestTopView3D}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-300 border border-slate-300 dark:border-cyan-500/30 transition flex items-center gap-1.5 shadow-sm"
              title="Align 3D camera to Timeline Side View (Height = Story Points)"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Align Side View</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: Left Top Face Radial Dial Preview + Right Metrics & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Top Polygon Cap Hologram Preview (5 cols) */}
        <div className="md:col-span-5 p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
          <div className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-mono uppercase font-bold text-[10px] text-slate-500 dark:text-slate-400">
              Top Polygon View ({numSides}-gon)
            </span>
            <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
              {displayMode === 'time' ? `${timeData.timeSpentHours}h / ${timeData.originalEstimateHours}h` : `${ticket.storyPoints} Story Points`}
            </span>
          </div>

          {/* Top Face Component */}
          <div className="py-2 flex items-center justify-center">
            <TopTimeFace
              ticket={ticket}
              geometry={geometry}
              displayMode={displayMode}
              compact={false}
              onToggleDisplayMode={() => setDisplayMode(m => m === 'time' ? 'points' : 'time')}
              onLogHours={(id, hrs, note) => handleCommitWorklog(hrs, note)}
              onUpdatePoints={(id, pts) => handleUpdatePoints(pts)}
            />
          </div>

          <div className="mt-3 w-full bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Target Due:</span>
            </div>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              {timeData.dueDate || 'Sep 12, 2026'}
            </span>
          </div>
        </div>

        {/* Right: Metrics & Estimator (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          
          {/* Fibonacci Story Points Selector */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-sky-500" />
                <span>Story Points (Fibonacci Scale)</span>
              </span>
              <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                {ticket.storyPoints} SP (≈ {((ticket.storyPoints * 4) / 8).toFixed(1)} dev days)
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {[1, 2, 3, 5, 8, 13, 21].map(pts => (
                <button
                  key={pts}
                  onClick={() => handleUpdatePoints(pts)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    pts === ticket.storyPoints
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 scale-105 border border-sky-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  {pts}
                </button>
              ))}
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5 font-bold">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>3D Timeline Bar Height: {ticket.storyPoints} Units ({ticket.storyPoints} SP)</span>
              </span>
              <span className="text-[10px] text-cyan-800 dark:text-cyan-200 bg-cyan-100 dark:bg-cyan-900/60 px-2 py-0.5 rounded border border-cyan-300 dark:border-cyan-500/30 font-semibold">
                Unit of Measure: 1 Story Point
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              In Timeline Side View, tickets are 3D bars where physical vertical height directly corresponds to task time in story points (unit of measure is 1 story point). Changing points dynamically extrudes or contracts the 3D bar.
            </p>
          </div>

          {/* Time Tracking Progress & Estimates */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Hourglass className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Duration & Progress Meter</span>
              </span>
              <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                {percentSpent}% Spent ({timeData.timeSpentHours}h / {timeData.originalEstimateHours}h)
              </span>
            </div>

            {/* Horizontal Bar */}
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div 
                className={`h-full transition-all duration-500 ${
                  isDone 
                    ? 'bg-emerald-500' 
                    : percentSpent > 100 
                      ? 'bg-rose-500' 
                      : percentSpent > 80 
                        ? 'bg-amber-500' 
                        : 'bg-cyan-500'
                }`}
                style={{ width: `${Math.min(100, percentSpent)}%` }}
              />
            </div>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-semibold block">
                  Original Est.
                </span>
                <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">
                  {timeData.originalEstimateHours}h
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-semibold block">
                  Time Spent
                </span>
                <span className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {timeData.timeSpentHours}h
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-semibold block">
                  Remaining
                </span>
                <span className={`text-sm font-mono font-bold ${
                  (timeData.remainingHours || 0) === 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                }`}>
                  {timeData.remainingHours}h
                </span>
              </div>
            </div>

            {/* Edit Original Estimate */}
            <div className="pt-2 flex items-center gap-2">
              <label className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Adjust Estimate (h):
              </label>
              <input
                type="number"
                min="1"
                max="200"
                value={originalEstimateInput}
                onChange={(e) => setOriginalEstimateInput(Number(e.target.value))}
                className="w-20 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100 text-center"
              />
              <button
                onClick={handleSaveEstimate}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition"
              >
                Update
              </button>
            </div>
          </div>

          {/* Live Task Stopwatch & Quick Log */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-cyan-50 dark:from-slate-900/90 dark:to-cyan-950/30 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 tracking-wider flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-emerald-500" />
                <span>Live Work Stopwatch</span>
              </span>
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                {isTimerRunning ? 'Running' : 'Paused'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 shadow-inner">
              <div className="font-mono text-2xl font-black text-slate-900 dark:text-slate-100">
                {formatTimer(timerSeconds)}
              </div>

              <button
                onClick={handleToggleTimer}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg ${
                  isTimerRunning
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Stop & Log Time</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start Session</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Worklog Form */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Manual Worklog Entry:
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 4, 8].map(h => (
                    <button
                      key={h}
                      onClick={() => handleCommitWorklog(h, `Completed ${h}h engineering sprint task`)}
                      className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-500/20 hover:border-cyan-400 text-slate-700 dark:text-slate-300 text-xs font-mono border border-slate-300 dark:border-slate-700 transition"
                    >
                      +{h}h
                    </button>
                  ))}
                </div>

                <input 
                  type="text"
                  placeholder="Worklog notes (optional)..."
                  value={logNoteInput}
                  onChange={(e) => setLogNoteInput(e.target.value)}
                  className="flex-1 px-3 py-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                />

                <button
                  onClick={() => handleCommitWorklog(Number(logHoursInput) || 1, logNoteInput)}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-white transition shadow-sm"
                >
                  Log
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Worklog History Table */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Worklog Session Audit History ({timeData.worklogs?.length || 0})
            </h4>
          </div>

          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Total Logged: <strong className="text-cyan-600 dark:text-cyan-400">{timeData.timeSpentHours}h</strong>
          </span>
        </div>

        {timeData.worklogs && timeData.worklogs.length > 0 ? (
          <div className="space-y-2">
            {timeData.worklogs.map((entry) => (
              <div 
                key={entry.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  {entry.authorAvatar ? (
                    <img 
                      src={entry.authorAvatar} 
                      alt={entry.authorName} 
                      className="w-6 h-6 rounded-full object-cover border border-slate-300 dark:border-slate-700" 
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {entry.authorName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {entry.note || 'Work completed'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-sm">
                    +{entry.hours}h
                  </span>
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-mono">
                    {entry.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic py-3 text-center">
            No work logged yet. Use the stopwatch or quick logger above to track duration.
          </p>
        )}
      </div>

    </div>
  );
};
