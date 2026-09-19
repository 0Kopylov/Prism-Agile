import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Sparkles, 
  Code2, 
  Compass, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle,
  MoreVertical,
  User as UserIcon,
  Tag,
  Clock,
  Layers,
  ArrowUpDown,
  Plus,
  Minus
} from 'lucide-react';
import { Ticket, SidePerspective, User, TimeDisplayMode, ChecklistItem } from '../../types';
import { calculatePrismGeometry, getRotationForFace, getClosestFaceIndex } from '../../utils/prismMath';
import { useTheme } from '../../context/ThemeContext';
import { DeveloperFace } from './faces/DeveloperFace';
import { TeamLeadFace } from './faces/TeamLeadFace';
import { ManagerFace } from './faces/ManagerFace';
import { QAFace } from './faces/QAFace';
import { CustomFace } from './faces/CustomFace';
import { TopTimeFace } from './faces/TopTimeFace';

interface PolyhedralTicketProps {
  ticket: Ticket;
  assignee?: User;
  globalPerspectiveId?: string;
  globalTimeDisplayMode?: TimeDisplayMode;
  onOpenModal: (ticket: Ticket) => void;
  onUpdateChecklist?: (ticketId: string, itemId: string, done: boolean) => void;
  onUpdateTicketChecklist?: (ticketId: string, checklist: ChecklistItem[]) => void;
  onToggleSignoff?: (ticketId: string) => void;
  onToggleScenario?: (ticketId: string, scenarioId: string) => void;
  onRotateFace?: (ticketId: string, newFaceIndex: number) => void;
  onLogHours?: (ticketId: string, hours: number, note?: string) => void;
  onUpdatePoints?: (ticketId: string, points: number) => void;
}

export const PolyhedralTicket: React.FC<PolyhedralTicketProps> = ({
  ticket,
  assignee,
  globalPerspectiveId,
  globalTimeDisplayMode = 'time',
  onOpenModal,
  onUpdateChecklist,
  onUpdateTicketChecklist,
  onToggleSignoff,
  onToggleScenario,
  onRotateFace,
  onLogHours,
  onUpdatePoints
}) => {
  const perspectives = (ticket.perspectives && ticket.perspectives.length >= 3) 
    ? ticket.perspectives 
    : [
        { id: 'developer', name: 'Developer', shortLabel: 'DEV', roleType: 'developer', icon: 'Code2', color: '#38bdf8', bgGradient: '', borderGlow: '', description: '' },
        { id: 'lead', name: 'Lead', shortLabel: 'LEAD', roleType: 'lead', icon: 'Compass', color: '#a855f7', bgGradient: '', borderGlow: '', description: '' },
        { id: 'manager', name: 'Manager', shortLabel: 'OKR', roleType: 'manager', icon: 'TrendingUp', color: '#10b981', bgGradient: '', borderGlow: '', description: '' }
      ];

  const numSides = perspectives.length;
  // Card dimensions on the Kanban board
  const faceWidth = 280;

  const { isDark } = useTheme();

  const [localDisplayMode, setLocalDisplayMode] = useState<TimeDisplayMode>(globalTimeDisplayMode);

  useEffect(() => {
    setLocalDisplayMode(globalTimeDisplayMode);
  }, [globalTimeDisplayMode]);

  // STORY POINT HEIGHT SCALING
  // The height of each ticket is directly proportional to its story points.
  // 1 story point = 50px unit height.
  // An 8 SP prism (400px) is exactly 8 times taller than a 1 SP prism (50px).
  const SP_UNIT_HEIGHT = 50;
  const storyPoints = Math.max(1, ticket.storyPoints || 1);
  const faceHeight = storyPoints * SP_UNIT_HEIGHT;

  // Viewport container height: scales directly with the prism height + clearance for 3D caps
  const viewportHeight = faceHeight + 40;

  const geometry = calculatePrismGeometry(numSides, faceWidth, faceHeight);

  // Active face index
  const [activeFace, setActiveFace] = useState<number>(ticket.activeFaceIndex || 0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startXRef = useRef<number>(0);
  const totalMovedRef = useRef<number>(0);

  // Synchronize when global perspective changes
  useEffect(() => {
    if (globalPerspectiveId && globalPerspectiveId !== 'free') {
      const targetIndex = perspectives.findIndex(p => p.id === globalPerspectiveId);
      if (targetIndex !== -1) {
        setActiveFace(targetIndex);
        onRotateFace?.(ticket.id, targetIndex);
      }
    }
  }, [globalPerspectiveId, perspectives, ticket.id, onRotateFace]);

  // Handle pointer drag to spin in 3D
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag on primary mouse or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setIsDragging(true);
    startXRef.current = e.clientX;
    totalMovedRef.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    totalMovedRef.current += Math.abs(e.movementX || deltaX);
    // Convert px moved into rotation angle degrees
    setDragOffset(deltaX * 0.75);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    const baseRotation = getRotationForFace(activeFace, numSides);
    const finalRotation = baseRotation + dragOffset;
    const closestIndex = getClosestFaceIndex(finalRotation, numSides);

    setDragOffset(0);
    setActiveFace(closestIndex);
    onRotateFace?.(ticket.id, closestIndex);
  };

  const handleStepFace = (direction: 'next' | 'prev', e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = direction === 'next' 
      ? (activeFace + 1) % numSides 
      : (activeFace - 1 + numSides) % numSides;
    setActiveFace(nextIndex);
    onRotateFace?.(ticket.id, nextIndex);
  };

  const handleSelectFace = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveFace(index);
    onRotateFace?.(ticket.id, index);
  };

  // Rotation angles
  const targetRotationY = getRotationForFace(activeFace, numSides) + dragOffset;

  // Active perspective object
  const currentPerspective = perspectives[activeFace] || perspectives[0];

  // Ticket Priority Pill Colors
  const priorityColors: Record<string, string> = {
    lowest: 'text-slate-400 bg-slate-800/80 border-slate-700',
    low: 'text-sky-300 bg-sky-950/60 border-sky-600/40',
    medium: 'text-amber-300 bg-amber-950/60 border-amber-600/40',
    high: 'text-orange-400 bg-orange-950/60 border-orange-600/40',
    highest: 'text-rose-400 bg-rose-950/60 border-rose-600/40'
  };

  const renderFaceContent = (perspective: SidePerspective, index: number) => {
    switch (perspective.id) {
      case 'developer':
        return (
          <DeveloperFace 
            ticket={ticket} 
            data={ticket.faces.developer} 
            compact={true}
            onUpdateChecklist={(itemId, done) => onUpdateChecklist?.(ticket.id, itemId, done)}
            onUpdateTicketChecklist={(newList) => onUpdateTicketChecklist?.(ticket.id, newList)}
          />
        );
      case 'lead':
        return (
          <TeamLeadFace 
            ticket={ticket} 
            data={ticket.faces.lead} 
            compact={true}
            onToggleSignoff={() => onToggleSignoff?.(ticket.id)}
          />
        );
      case 'manager':
        return (
          <ManagerFace 
            ticket={ticket} 
            data={ticket.faces.manager} 
            compact={true}
          />
        );
      case 'qa':
        return (
          <QAFace 
            ticket={ticket} 
            data={ticket.faces.qa} 
            compact={true}
            onToggleScenario={(scenarioId) => onToggleScenario?.(ticket.id, scenarioId)}
          />
        );
      default:
        return (
          <CustomFace 
            ticket={ticket} 
            perspective={perspective}
            data={ticket.faces.custom?.[perspective.id]}
          />
        );
    }
  };

  // Time metrics calculations
  const timeSpent = ticket.timeTracking?.timeSpentHours ?? Math.round((ticket.storyPoints || 3) * 2.5);
  const originalEstimate = ticket.timeTracking?.originalEstimateHours ?? ((ticket.storyPoints || 3) * 4);

  return (
    <div className="relative group/card select-none" style={{ width: `${faceWidth}px` }}>
      {/* Ticket Header: prism-number & estimation (story points) */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-t-xl border-t border-x border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md transition-colors">
        {/* prism-number */}
        <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 tracking-wider">
          {ticket.key}
        </span>

        <div className="flex items-center gap-1.5">
          {/* estimation (story points) */}
          <span className="px-2 py-0.5 rounded text-xs font-mono font-bold text-cyan-700 bg-cyan-50 border border-cyan-300 dark:text-cyan-300 dark:bg-cyan-950/70 dark:border-cyan-500/40">
            {ticket.storyPoints} SP
          </span>

          {/* Quick open 3D Studio button */}
          <button
            onClick={() => onOpenModal(ticket)}
            className="p-1 rounded text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:text-sky-300 dark:hover:bg-slate-800 transition"
            title="Inspect 3D Object"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Ticket Subject & Assignee */}
      <div className="px-3 py-2.5 bg-slate-50/80 dark:bg-slate-900/70 border-x border-slate-200 dark:border-slate-800/80 transition-colors">
        {/* subject (scaled up 150%) */}
        <h4 className="text-[18px] font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug tracking-tight">
          {ticket.title}
        </h4>

        {/* assignee (200% enlarged avatar and typography) */}
        <div className="flex items-center gap-2.5 mt-2 text-slate-700 dark:text-slate-200">
          {assignee?.avatar ? (
            <img 
              src={assignee.avatar} 
              alt={assignee.name} 
              className="w-8 h-8 rounded-full object-cover border-2 border-slate-300 dark:border-slate-600 shadow-sm shrink-0" 
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0">
              <UserIcon className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
            </div>
          )}
          <span className="text-[22px] font-bold text-slate-900 dark:text-slate-100 truncate tracking-tight leading-none">
            {assignee?.name || 'Unassigned'}
          </span>
        </div>
      </div>

      {/* 3D Scene Viewport */}
      <div 
        className="relative overflow-hidden rounded-b-xl border-b border-x border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-100/90 via-slate-50 to-slate-100/90 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 cursor-grab active:cursor-grabbing perspective-1500 transition-all duration-300 shadow-sm dark:shadow-md"
        style={{ height: `${viewportHeight}px`, width: `${faceWidth}px` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Subtle 3D background depth grid */}
        <div className="absolute inset-0 opacity-15 dark:opacity-10 pointer-events-none bg-[radial-gradient(#0284c7_1px,transparent_1px)] dark:bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* The 3D Polyhedral Prism Container */}
        <div 
          className="absolute inset-0 flex items-center justify-center preserve-3d"
          style={{
            transform: `rotateX(-6deg) rotateY(${targetRotationY}deg)`,
            transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Top 3D Geometric Polygon Cap: Time & Duration Face */}
          <div
            className="absolute inset-0 m-auto pointer-events-auto preserve-3d"
            style={{
              width: `${geometry.circumradius * 2}px`,
              height: `${geometry.circumradius * 2}px`,
              transform: `translateY(-${faceHeight / 2}px) rotateX(90deg)`
            }}
          >
            <TopTimeFace
              ticket={ticket}
              geometry={geometry}
              displayMode={localDisplayMode}
              compact={true}
              onToggleDisplayMode={() => setLocalDisplayMode(m => m === 'time' ? 'points' : 'time')}
              onLogHours={onLogHours}
              onUpdatePoints={onUpdatePoints}
            />
          </div>

          {/* Bottom 3D Geometric Polygon Cap / Pedestal Stage */}
          <div
            className="absolute inset-0 m-auto pointer-events-none preserve-3d"
            style={{
              width: `${geometry.circumradius * 2}px`,
              height: `${geometry.circumradius * 2}px`,
              transform: `translateY(${faceHeight / 2}px) rotateX(-90deg)`
            }}
          >
            <svg 
              viewBox={`0 0 ${geometry.circumradius * 2} ${geometry.circumradius * 2}`}
              className="w-full h-full drop-shadow-md"
            >
              <polygon
                points={geometry.svgPolygonPoints}
                fill={isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(241, 245, 249, 0.95)"}
                stroke={currentPerspective.color}
                strokeWidth="1.5"
                strokeOpacity="0.4"
              />
            </svg>
          </div>

          {/* All N Faces of the 3D Prism */}
          {perspectives.map((perspective, index) => {
            const angle = index * geometry.anglePerSide;
            const isFacing = index === activeFace;

            return (
              <div
                key={perspective.id}
                className="absolute inset-0 m-auto rounded-lg p-2 backface-visible transition-opacity duration-300 overflow-hidden"
                style={{
                  width: `${faceWidth}px`,
                  height: `${faceHeight}px`,
                  transform: `rotateY(${angle}deg) translateZ(${geometry.apothem}px)`,
                  backgroundColor: isDark ? 'rgba(11, 15, 25, 0.96)' : 'rgba(255, 255, 255, 0.96)',
                  border: isFacing 
                    ? `1.5px solid ${perspective.color}90` 
                    : isDark ? '1px solid rgba(51, 65, 85, 0.4)' : '1px solid rgba(203, 213, 225, 0.8)',
                  boxShadow: isFacing 
                    ? `0 0 20px -5px ${perspective.color}30, inset 0 0 15px -8px ${perspective.color}20` 
                    : 'none',
                  opacity: isFacing ? 1 : 0.28,
                  pointerEvents: isFacing ? 'auto' : 'none'
                }}
              >
                {renderFaceContent(perspective, index)}
              </div>
            );
          })}
        </div>

        {/* Quick Stepper Overlay (Left/Right Chevrons) */}
        <button
          onClick={(e) => handleStepFace('prev', e)}
          className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-700/80 transition shadow-md opacity-0 group-hover/card:opacity-100 z-10"
          title="Turn to previous face"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => handleStepFace('next', e)}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-700/80 transition shadow-md opacity-0 group-hover/card:opacity-100 z-10"
          title="Turn to next face"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
