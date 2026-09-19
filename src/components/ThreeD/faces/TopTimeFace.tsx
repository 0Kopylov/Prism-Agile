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
  Award
} from 'lucide-react';
import { Ticket, TimeDisplayMode, TaskTimeTracking } from '../../../types';
import { PrismGeometry } from '../../../utils/prismMath';

interface TopTimeFaceProps {
  ticket: Ticket;
  geometry: PrismGeometry;
  displayMode?: TimeDisplayMode;
  compact?: boolean;
  onToggleDisplayMode?: () => void;
  onLogHours?: (ticketId: string, hours: number, note?: string) => void;
  onUpdatePoints?: (ticketId: string, points: number) => void;
  onUpdateEstimate?: (ticketId: string, estimateHours: number) => void;
}

export const TopTimeFace: React.FC<TopTimeFaceProps> = ({
  ticket,
  geometry,
  displayMode = 'time',
  compact = true,
  onToggleDisplayMode,
  onLogHours,
  onUpdatePoints,
  onUpdateEstimate
}) => {
  // Local mode override if onToggleDisplayMode is not passed
  const [localMode, setLocalMode] = useState<TimeDisplayMode>(displayMode);
  useEffect(() => {
    setLocalMode(displayMode);
  }, [displayMode]);

  const activeMode = localMode;

  // Safe timeTracking values
  const timeData: TaskTimeTracking = ticket.timeTracking || {
    originalEstimateHours: (ticket.storyPoints || 3) * 4,
    timeSpentHours: ticket.status === 'done' ? (ticket.storyPoints || 3) * 4 : Math.round((ticket.storyPoints || 3) * 2.5),
    remainingHours: ticket.status === 'done' ? 0 : Math.max(0, (ticket.storyPoints || 3) * 4 - Math.round((ticket.storyPoints || 3) * 2.5)),
    startDate: ticket.createdAt || '2026-08-29',
    dueDate: '2026-09-12',
    cycleTimeDays: ticket.status === 'done' ? 4.2 : 2.4,
    leadTimeDays: ticket.status === 'done' ? 5.8 : 3.8
  };

  const originalEstimate = Math.max(1, timeData.originalEstimateHours || 1);
  const timeSpent = Math.max(0, timeData.timeSpentHours || 0);
  const remaining = Math.max(0, timeData.remainingHours ?? Math.max(0, originalEstimate - timeSpent));
  const storyPoints = ticket.storyPoints || 0;

  // Percentage for radial meter
  const percentSpent = Math.min(150, Math.round((timeSpent / originalEstimate) * 100));
  const isOverEstimate = timeSpent > originalEstimate;
  const isDone = ticket.status === 'done';

  // Live timer simulation state
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  const handleToggleTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTimerActive) {
      // Commit hours if >= 1 minute (or add at least 0.25h for demo)
      const hoursToAdd = Math.max(0.25, Number((timerSeconds / 3600).toFixed(2)));
      onLogHours?.(ticket.id, hoursToAdd, 'Live work session timer');
      setIsTimerActive(false);
      setTimerSeconds(0);
    } else {
      setIsTimerActive(true);
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SVG Radial Dial Math
  const size = geometry.circumradius * 2;
  const center = geometry.circumradius;
  const radius = Math.max(20, geometry.circumradius * 0.58);
  const circumference = 2 * Math.PI * radius;
  const strokePercent = Math.min(100, percentSpent);
  const strokeDashoffset = circumference - (strokePercent / 100) * circumference;

  // Ring status color
  const getDialColor = () => {
    if (isDone) return '#10b981'; // emerald
    if (isOverEstimate) return '#f43f5e'; // rose
    if (percentSpent > 85) return '#f59e0b'; // amber
    return '#06b6d4'; // cyan
  };

  const dialColor = getDialColor();

  const handleQuickAdd = (hours: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onLogHours?.(ticket.id, hours, `Logged ${hours}h via Top Time View`);
  };

  const handleSelectFibonacci = (pts: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdatePoints?.(ticket.id, pts);
  };

  return (
    <div 
      className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* Background SVG Polygon Face Base */}
      <svg 
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-2xl"
      >
        {/* Outer Regular Polygon with Cyberpunk Border */}
        <polygon
          points={geometry.svgPolygonPoints}
          fill="rgba(10, 15, 29, 0.96)"
          stroke={dialColor}
          strokeWidth="2"
          strokeOpacity="0.8"
        />

        {/* Concentric polygon guide radar ring */}
        <circle
          cx={center}
          cy={center}
          r={radius * 1.25}
          fill="none"
          stroke="rgba(56, 189, 248, 0.12)"
          strokeDasharray="4 6"
          strokeWidth="1"
        />

        {/* Outer Circular Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="rgba(15, 23, 42, 0.6)"
          stroke="rgba(51, 65, 85, 0.4)"
          strokeWidth="6"
        />

        {/* Animated Radial Progress Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={dialColor}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          className="transition-all duration-700 ease-out"
        />

        {/* Vertex Corner Marker Ticks */}
        {geometry.svgPolygonPoints.split(' ').map((pt, idx) => {
          const [px, py] = pt.split(',').map(Number);
          return (
            <circle
              key={idx}
              cx={px}
              cy={py}
              r="2.5"
              fill={dialColor}
              opacity="0.9"
            />
          );
        })}
      </svg>

      {/* Center Interactive Content Overlay */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center text-center p-2"
        style={{ maxWidth: `${radius * 2 * 0.95}px` }}
      >
        {/* Mode Toggle Header Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleDisplayMode) {
              onToggleDisplayMode();
            } else {
              setLocalMode(m => m === 'time' ? 'points' : 'time');
            }
          }}
          className="px-2 py-0.5 mb-1 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase border transition-all flex items-center gap-1 shadow-md hover:scale-105 active:scale-95"
          style={{
            backgroundColor: `${dialColor}18`,
            borderColor: `${dialColor}60`,
            color: dialColor
          }}
          title="Click to toggle between Duration (Hours) and Story Points"
        >
          {activeMode === 'time' ? (
            <>
              <Clock className="w-2.5 h-2.5" />
              <span>⏱️ Time: {timeSpent}h / {originalEstimate}h</span>
            </>
          ) : (
            <>
              <Zap className="w-2.5 h-2.5" />
              <span>🔢 Points: {storyPoints} SP</span>
            </>
          )}
        </button>

        {/* Primary Metric Readout */}
        {activeMode === 'time' ? (
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-0.5 font-mono">
              <span className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                {timeSpent}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                /{originalEstimate}h
              </span>
            </div>

            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wide">
              {isDone ? 'Finished' : `${remaining}h remaining`}
            </span>

            {/* Health Badge */}
            <div className="mt-1 flex items-center gap-1">
              <span 
                className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase border"
                style={{
                  backgroundColor: `${dialColor}20`,
                  borderColor: `${dialColor}60`,
                  color: dialColor
                }}
              >
                {isDone ? 'Done' : isOverEstimate ? 'Over Estimate' : percentSpent > 85 ? 'Near Estimate' : 'On Track'}
              </span>
              <span className="text-[9px] font-mono text-slate-300">
                {percentSpent}%
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                {storyPoints}
              </span>
              <span className="text-xs text-sky-400 font-bold uppercase">
                SP
              </span>
            </div>
          </div>
        )}

        {/* Quick interactive controls when space permits */}
        {!compact && (
          <div className="mt-2 flex items-center gap-1.5">
            {activeMode === 'time' ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => handleQuickAdd(1, e)}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[9px] font-mono text-slate-300 border border-slate-700 transition"
                  title="Quick log 1 hour"
                >
                  +1h
                </button>
                <button
                  onClick={(e) => handleQuickAdd(2, e)}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[9px] font-mono text-slate-300 border border-slate-700 transition"
                  title="Quick log 2 hours"
                >
                  +2h
                </button>
                <button
                  onClick={handleToggleTimer}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono flex items-center gap-1 border transition ${
                    isTimerActive 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500 animate-pulse' 
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/50 hover:bg-sky-500/30'
                  }`}
                  title="Start live work stopwatch"
                >
                  {isTimerActive ? (
                    <>
                      <Pause className="w-2.5 h-2.5" />
                      <span>{formatTimer(timerSeconds)}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-2 h-2" />
                      <span>Timer</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 5, 8, 13].map(pts => (
                  <button
                    key={pts}
                    onClick={(e) => handleSelectFibonacci(pts, e)}
                    className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-mono font-bold transition ${
                      pts === storyPoints
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {pts}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Small footer caption: Cycle Time */}
        <div className="mt-1 text-[8px] font-mono text-slate-400 truncate">
          Cycle: {timeData.cycleTimeDays || 2.4}d • Sprint Day 4/14
        </div>
      </div>
    </div>
  );
};
