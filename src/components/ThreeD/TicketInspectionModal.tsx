import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  RotateCw, 
  Maximize2, 
  Layers, 
  Sliders, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Send, 
  User as UserIcon,
  Tag,
  Code2,
  Compass,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Eye,
  AlertCircle,
  Clock,
  Timer,
  Zap,
  Hourglass,
  ArrowUpDown,
  Shapes,
  Info,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { 
  Ticket, 
  SidePerspective, 
  User, 
  Sprint, 
  ChecklistItem, 
  TestScenarioItem, 
  TicketStatus, 
  TicketPriority 
} from '../../types';
import { calculatePrismGeometry, getRotationForFace, getClosestFaceIndex } from '../../utils/prismMath';
import { DeveloperFace } from './faces/DeveloperFace';
import { TeamLeadFace } from './faces/TeamLeadFace';
import { ManagerFace } from './faces/ManagerFace';
import { QAFace } from './faces/QAFace';
import { CustomFace } from './faces/CustomFace';
import { TopTimeFace } from './faces/TopTimeFace';
import { DEFAULT_PERSPECTIVES } from '../../data/mockData';

interface TicketInspectionModalProps {
  ticket: Ticket;
  users: User[];
  sprints: Sprint[];
  currentUser: User;
  workspacePerspectives?: SidePerspective[];
  onClose: () => void;
  onUpdateTicket: (updatedTicket: Ticket) => void;
}

export const TicketInspectionModal: React.FC<TicketInspectionModalProps> = ({
  ticket,
  users,
  sprints,
  currentUser,
  workspacePerspectives,
  onClose,
  onUpdateTicket
}) => {
  const [activeTab, setActiveTab] = useState<'faces' | 'geometry' | 'comments'>('faces');
  const [activeFaceIndex, setActiveFaceIndex] = useState<number>(ticket.activeFaceIndex || 0);

  // 3D Orbit & Rotation States
  const [rotX, setRotX] = useState<number>(-8);
  const [rotY, setRotY] = useState<number>(() => 
    getRotationForFace(ticket.activeFaceIndex || 0, ticket.perspectives.length)
  );
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isOrbiting, setIsOrbiting] = useState<boolean>(false);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Geometry dimensions in modal: height scales proportionally with story points
  const SP_UNIT_HEIGHT_MODAL = 50;
  const storyPoints = Math.max(1, ticket.storyPoints || 1);
  const faceWidth = 320;
  const faceHeight = Math.max(120, storyPoints * SP_UNIT_HEIGHT_MODAL);
  const perspectives = ticket.perspectives;
  const numSides = perspectives.length;
  const geometry = calculatePrismGeometry(numSides, faceWidth, faceHeight);

  // New comment draft state
  const [commentText, setCommentText] = useState('');

  // New custom side draft state
  const [showAddSideModal, setShowAddSideModal] = useState(false);
  const [newSideName, setNewSideName] = useState('');
  const [newSideLabel, setNewSideLabel] = useState('');
  const [newSideColor, setNewSideColor] = useState('#38bdf8');
  const [newSideDesc, setNewSideDesc] = useState('');

  // Auto-rotate animation loop
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setRotY(prev => (prev - 0.4) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, [autoRotate]);

  // When activeFaceIndex changes via tabs, spin smoothly to it
  const handleSelectFace = (index: number) => {
    setActiveFaceIndex(index);
    setRotY(getRotationForFace(index, numSides));
    setRotX(-8);
  };

  // 3D Orbit Pointer handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setIsOrbiting(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isOrbiting) return;
    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;
    startPosRef.current = { x: e.clientX, y: e.clientY };

    setRotY(prev => prev + deltaX * 0.7);
    setRotX(prev => Math.max(-45, Math.min(45, prev - deltaY * 0.5)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isOrbiting) return;
    setIsOrbiting(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    
    // Snap to nearest face index
    const closest = getClosestFaceIndex(rotY, numSides);
    setActiveFaceIndex(closest);
  };

  // Master pool of perspectives for this ticket (workspace catalog + any ticket custom perspectives)
  const basePerspectives = workspacePerspectives && workspacePerspectives.length > 0 
    ? workspacePerspectives 
    : DEFAULT_PERSPECTIVES;
    
  const allAvailablePerspectives: SidePerspective[] = [...basePerspectives];
  ticket.perspectives.forEach(tp => {
    if (!allAvailablePerspectives.some(ap => ap.id === tp.id)) {
      allAvailablePerspectives.push(tp);
    }
  });

  // Arbitrarily toggle a perspective face on/off for this ticket
  const handleToggleFace = (perspective: SidePerspective) => {
    const isCurrentlyMounted = ticket.perspectives.some(p => p.id === perspective.id);

    if (isCurrentlyMounted) {
      if (ticket.perspectives.length <= 1) {
        return; // Minimum 1 face required
      }
      const updated = ticket.perspectives.filter(p => p.id !== perspective.id);
      const safeIndex = Math.min(activeFaceIndex, Math.max(0, updated.length - 1));
      setActiveFaceIndex(safeIndex);
      setRotY(getRotationForFace(safeIndex, updated.length));
      onUpdateTicket({
        ...ticket,
        perspectives: updated,
        activeFaceIndex: safeIndex
      });
    } else {
      const updated = [...ticket.perspectives, perspective];
      onUpdateTicket({
        ...ticket,
        perspectives: updated
      });
    }
  };

  // Quick preset face selection
  const handleApplyPresetFaces = (presetIds: string[]) => {
    const selected = allAvailablePerspectives.filter(p => presetIds.includes(p.id));
    if (selected.length === 0) return;
    const safeIndex = Math.min(activeFaceIndex, Math.max(0, selected.length - 1));
    setActiveFaceIndex(safeIndex);
    setRotY(getRotationForFace(safeIndex, selected.length));
    onUpdateTicket({
      ...ticket,
      perspectives: selected,
      activeFaceIndex: safeIndex
    });
  };

  // Move face order in 3D polygon
  const handleMoveFace = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= ticket.perspectives.length) return;
    const reordered = [...ticket.perspectives];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    const newActiveIndex = index === activeFaceIndex ? targetIndex : activeFaceIndex;
    setActiveFaceIndex(newActiveIndex);
    setRotY(getRotationForFace(newActiveIndex, reordered.length));
    onUpdateTicket({
      ...ticket,
      perspectives: reordered,
      activeFaceIndex: newActiveIndex
    });
  };

  // Add custom side
  const handleAddCustomSide = () => {
    if (!newSideName.trim()) return;
    const sideId = `side-${Date.now()}`;
    const newPerspective: SidePerspective = {
      id: sideId,
      name: newSideName.trim(),
      shortLabel: newSideLabel.trim().toUpperCase() || newSideName.trim().slice(0, 4).toUpperCase(),
      roleType: 'custom',
      icon: 'Sparkles',
      color: newSideColor,
      bgGradient: '',
      borderGlow: '',
      description: newSideDesc.trim() || 'Custom configured perspective side'
    };

    const updatedPerspectives = [...ticket.perspectives, newPerspective];
    onUpdateTicket({
      ...ticket,
      perspectives: updatedPerspectives
    });

    setNewSideName('');
    setNewSideLabel('');
    setNewSideDesc('');
    setShowAddSideModal(false);
  };

  // Remove side
  const handleRemoveSide = (sideId: string) => {
    if (ticket.perspectives.length <= 1) {
      alert('A 3D object requires a minimum of 1 side.');
      return;
    }
    const updated = ticket.perspectives.filter(p => p.id !== sideId);
    const safeIndex = Math.min(activeFaceIndex, Math.max(0, updated.length - 1));
    setActiveFaceIndex(safeIndex);
    setRotY(getRotationForFace(safeIndex, updated.length));
    onUpdateTicket({
      ...ticket,
      perspectives: updated,
      activeFaceIndex: safeIndex
    });
  };

  // Add comment
  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const currentPersp = perspectives[activeFaceIndex] || perspectives[0];
    const newComment = {
      id: `cm-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      faceId: currentPersp.id,
      faceName: currentPersp.name,
      content: commentText.trim(),
      createdAt: 'Just now'
    };

    onUpdateTicket({
      ...ticket,
      comments: [newComment, ...(ticket.comments || [])]
    });
    setCommentText('');
  };

  const currentPerspective = perspectives[activeFaceIndex] || perspectives[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] max-h-[850px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Modal Navigation Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono font-bold text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-500/30">
              {ticket.key}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 truncate max-w-xl">
              {ticket.title}
            </h2>
            <span className="hidden md:inline-flex text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
              {numSides}-Sided 3D Polyhedron
            </span>

            {/* Assignee Badge (Enlarged Avatar and Name) */}
            {(() => {
              const currentAssignee = users.find(u => u.id === ticket.assigneeId);
              return currentAssignee ? (
                <div className="hidden sm:flex items-center gap-2.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 shadow-sm">
                  {currentAssignee.avatar ? (
                    <img 
                      src={currentAssignee.avatar} 
                      alt={currentAssignee.name} 
                      className="w-8 h-8 rounded-full object-cover border-2 border-slate-300 dark:border-slate-600 shrink-0" 
                    />
                  ) : null}
                  <span className="text-base font-bold text-slate-800 dark:text-slate-100 truncate max-w-[140px]">
                    {currentAssignee.name}
                  </span>
                </div>
              ) : null;
            })()}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRotate(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                autoRotate 
                  ? 'bg-sky-500 text-white border-sky-400' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              <span>{autoRotate ? 'Auto-Spin ON' : 'Auto-Spin'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Layout: Left 3D Stage + Right Jira Editor */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left: 3D Holographic Orbit Stage (5 cols) */}
          <div className="lg:col-span-6 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center justify-between p-4 relative overflow-hidden">
            {/* 3D Viewport Controls Top Bar */}
            <div className="w-full flex items-center justify-between z-10 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 shadow-sm">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentPerspective.color }} />
                <span>Viewing: <strong style={{ color: currentPerspective.color }}>{currentPerspective.name}</strong></span>
              </div>

              {/* Camera Presets: Frontal / Reset */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setRotX(-8);
                    setRotY(getRotationForFace(activeFaceIndex, numSides));
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-100 shadow-sm"
                  title="Reset to frontal facet view"
                >
                  Frontal View
                </button>

                <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 hidden sm:block">
                  {Math.round(rotX)}° / {Math.round(rotY)}°
                </div>
              </div>
            </div>

            {/* Central 3D Canvas Stage */}
            <div 
              className="w-full flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing perspective-2000 relative select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {/* Background circular radar grid */}
              <div className="absolute w-[440px] h-[440px] rounded-full border border-slate-300/60 dark:border-slate-800/60 pointer-events-none" />
              <div className="absolute w-[300px] h-[300px] rounded-full border border-slate-300/40 dark:border-slate-800/40 pointer-events-none" />

              {/* The 3D Polyhedral Object */}
              <div 
                className="preserve-3d transition-transform duration-100"
                style={{
                  transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`
                }}
              >
                {/* Top Polygon Cap: Live TopTimeFace */}
                <div
                  className="absolute pointer-events-auto preserve-3d -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: `${geometry.circumradius * 2}px`,
                    height: `${geometry.circumradius * 2}px`,
                    transform: `translateY(-${faceHeight / 2}px) rotateX(90deg)`
                  }}
                >
                  <TopTimeFace
                    ticket={ticket}
                    geometry={geometry}
                    compact={activeTab !== 'time'}
                    onLogHours={(id, hours, note) => {
                      const current = ticket.timeTracking || {
                        originalEstimateHours: (ticket.storyPoints || 3) * 4,
                        timeSpentHours: 0,
                        remainingHours: (ticket.storyPoints || 3) * 4
                      };
                      const spent = Number(((current.timeSpentHours || 0) + hours).toFixed(2));
                      const remaining = Math.max(0, Number(((current.remainingHours || 0) - hours).toFixed(2)));
                      onUpdateTicket({
                        ...ticket,
                        timeTracking: {
                          ...current,
                          timeSpentHours: spent,
                          remainingHours: remaining,
                          worklogs: [
                            {
                              id: `wl-${Date.now()}`,
                              authorId: currentUser.id,
                              authorName: currentUser.name,
                              authorAvatar: currentUser.avatar,
                              hours,
                              date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                              note: note || 'Development session'
                            },
                            ...(current.worklogs || [])
                          ]
                        }
                      });
                    }}
                    onUpdatePoints={(id, pts) => {
                      const current = ticket.timeTracking || {
                        originalEstimateHours: (ticket.storyPoints || 3) * 4,
                        timeSpentHours: 0,
                        remainingHours: (ticket.storyPoints || 3) * 4
                      };
                      const newEst = pts * 4;
                      onUpdateTicket({
                        ...ticket,
                        storyPoints: pts,
                        timeTracking: {
                          ...current,
                          originalEstimateHours: newEst,
                          remainingHours: Math.max(0, newEst - (current.timeSpentHours || 0))
                        }
                      });
                    }}
                  />
                </div>

                {/* Bottom Polygon Cap */}
                <div
                  className="absolute pointer-events-none preserve-3d -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: `${geometry.circumradius * 2}px`,
                    height: `${geometry.circumradius * 2}px`,
                    transform: `translateY(${faceHeight / 2}px) rotateX(-90deg)`
                  }}
                >
                  <svg 
                    viewBox={`0 0 ${geometry.circumradius * 2} ${geometry.circumradius * 2}`}
                    className="w-full h-full drop-shadow-xl"
                  >
                    <polygon
                      points={geometry.svgPolygonPoints}
                      fill="rgba(15, 23, 42, 0.95)"
                      stroke={currentPerspective.color}
                      strokeWidth="2"
                      strokeOpacity="0.6"
                    />
                  </svg>
                </div>

                {/* All N Faces */}
                {perspectives.map((perspective, index) => {
                  const angle = index * geometry.anglePerSide;
                  const isFacing = index === activeFaceIndex;

                  return (
                    <div
                      key={perspective.id}
                      className="absolute rounded-xl p-4 backface-visible transition-all duration-200"
                      style={{
                        width: `${faceWidth}px`,
                        height: `${faceHeight}px`,
                        left: `-${faceWidth / 2}px`,
                        top: `-${faceHeight / 2}px`,
                        transform: `rotateY(${angle}deg) translateZ(${geometry.apothem}px)`,
                        backgroundColor: 'rgba(11, 15, 25, 0.98)',
                        border: isFacing 
                          ? `2px solid ${perspective.color}` 
                          : '1px solid rgba(51, 65, 85, 0.4)',
                        boxShadow: isFacing 
                          ? `0 0 35px -5px ${perspective.color}40, inset 0 0 20px -8px ${perspective.color}30` 
                          : 'none',
                        opacity: isFacing ? 1 : 0.35,
                        pointerEvents: isFacing ? 'auto' : 'none'
                      }}
                    >
                      {/* Face rendering */}
                      {perspective.id === 'developer' && (
                            <DeveloperFace 
                              ticket={ticket} 
                              data={ticket.faces.developer} 
                              onUpdateTicketChecklist={(newList) => {
                                onUpdateTicket({
                                  ...ticket,
                                  faces: {
                                    ...ticket.faces,
                                    developer: {
                                      ...ticket.faces.developer!,
                                      checklist: newList
                                    }
                                  }
                                });
                              }}
                              onUpdateChecklist={(id, done) => {
                                const updatedList = ticket.faces.developer?.checklist.map(c => 
                                  c.id === id ? { ...c, done } : c
                                );
                                onUpdateTicket({
                                  ...ticket,
                                  faces: {
                                    ...ticket.faces,
                                    developer: {
                                      ...ticket.faces.developer!,
                                      checklist: updatedList || []
                                    }
                                  }
                                });
                              }}
                            />
                          )}
                          {perspective.id === 'lead' && (
                            <TeamLeadFace 
                              ticket={ticket} 
                              data={ticket.faces.lead} 
                              onToggleSignoff={() => {
                                onUpdateTicket({
                                  ...ticket,
                                  faces: {
                                    ...ticket.faces,
                                    lead: {
                                      ...ticket.faces.lead!,
                                      architecturalSignoff: !ticket.faces.lead?.architecturalSignoff
                                    }
                                  }
                                });
                              }}
                            />
                          )}
                          {perspective.id === 'manager' && (
                            <ManagerFace 
                              ticket={ticket} 
                              data={ticket.faces.manager} 
                            />
                          )}
                          {perspective.id === 'qa' && (
                            <QAFace 
                              ticket={ticket} 
                              data={ticket.faces.qa} 
                              onToggleScenario={(scenarioId) => {
                                const updatedScenarios = ticket.faces.qa?.testScenarios.map(s => 
                                  s.id === scenarioId ? { ...s, passed: !s.passed } : s
                                );
                                onUpdateTicket({
                                  ...ticket,
                                  faces: {
                                    ...ticket.faces,
                                    qa: {
                                      ...ticket.faces.qa!,
                                      testScenarios: updatedScenarios || []
                                    }
                                  }
                                });
                              }}
                            />
                          )}
                          {(perspective.roleType === 'custom' || perspective.id === 'product') && (
                            <CustomFace 
                              ticket={ticket} 
                              perspective={perspective} 
                              data={ticket.faces.custom?.[perspective.id]}
                            />
                          )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom 3D Quick Face Carousel Pill Bar */}
            <div className="w-full flex items-center justify-center gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800/80 z-10 flex-wrap">
              {perspectives.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectFace(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    idx === activeFaceIndex
                      ? 'border shadow-md scale-105'
                      : 'bg-white dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                  style={{
                    backgroundColor: idx === activeFaceIndex ? `${p.color}25` : undefined,
                    borderColor: idx === activeFaceIndex ? p.color : undefined,
                    color: idx === activeFaceIndex ? p.color : undefined
                  }}
                >
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Jira-Style Agile Studio & Configurator (7 cols) */}
          <div className="lg:col-span-6 flex flex-col h-full bg-slate-50 dark:bg-slate-900/95 overflow-hidden">
            
            {/* Tab Header */}
            <div className="flex items-center gap-4 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
              <button
                onClick={() => setActiveTab('faces')}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition ${
                  activeTab === 'faces'
                    ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Story & Perspectives</span>
              </button>


              <button
                onClick={() => setActiveTab('geometry')}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition ${
                  activeTab === 'geometry'
                    ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Configure Sides ({numSides})</span>
              </button>

              <button
                onClick={() => setActiveTab('comments')}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition ${
                  activeTab === 'comments'
                    ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Multi-Role Comments ({ticket.comments?.length || 0})</span>
              </button>
            </div>

            {/* Tab Body Scrollable Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* TAB 1: STORY & PERSPECTIVE FIELDS */}
              {activeTab === 'faces' && (
                <div className="space-y-6">
                  {/* Core Ticket Attributes Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                        Status
                      </label>
                      <select
                        value={ticket.status}
                        onChange={(e) => onUpdateTicket({ ...ticket, status: e.target.value as TicketStatus })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:border-sky-500"
                      >
                        <option value="backlog">Backlog</option>
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Code Review</option>
                        <option value="qa">QA Review</option>
                        <option value="done">Done</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                        Priority
                      </label>
                      <select
                        value={ticket.priority}
                        onChange={(e) => onUpdateTicket({ ...ticket, priority: e.target.value as TicketPriority })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:border-sky-500"
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
                        value={ticket.storyPoints}
                        onChange={(e) => onUpdateTicket({ ...ticket, storyPoints: Number(e.target.value) || 1 })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-mono font-semibold focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                        Assignee
                      </label>
                      <div className="flex items-center gap-2 mb-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800">
                        {users.find(u => u.id === ticket.assigneeId)?.avatar && (
                          <img
                            src={users.find(u => u.id === ticket.assigneeId)?.avatar}
                            alt="Assignee avatar"
                            className="w-8 h-8 rounded-full object-cover border-2 border-slate-300 dark:border-slate-600 shadow-sm shrink-0"
                          />
                        )}
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                          {users.find(u => u.id === ticket.assigneeId)?.name || 'Unassigned'}
                        </span>
                      </div>
                      <select
                        value={ticket.assigneeId}
                        onChange={(e) => onUpdateTicket({ ...ticket, assigneeId: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:border-sky-500"
                      >
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Summary / User Story description */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                      Story Description & Context
                    </label>
                    <textarea
                      value={ticket.summary}
                      onChange={(e) => onUpdateTicket({ ...ticket, summary: e.target.value })}
                      rows={3}
                      className="w-full bg-white dark:bg-slate-950/60 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500 leading-relaxed shadow-sm"
                      placeholder="As a user, I want... So that..."
                    />
                  </div>

                  {/* Perspective Specific Live Field Editors */}
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: currentPerspective.color }} 
                        />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {currentPerspective.name} Perspective Details
                        </h3>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {currentPerspective.description}
                      </span>
                    </div>

                    {/* DEV FACE FIELDS */}
                    {currentPerspective.id === 'developer' && ticket.faces.developer && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                            Complexity & Effort Estimate
                          </label>
                          <input
                            type="text"
                            value={ticket.faces.developer.complexityEstimate || ''}
                            onChange={(e) => {
                              onUpdateTicket({
                                ...ticket,
                                faces: {
                                  ...ticket.faces,
                                  developer: {
                                    ...ticket.faces.developer!,
                                    complexityEstimate: e.target.value
                                  }
                                }
                              });
                            }}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:border-sky-500"
                            placeholder="e.g. Fibonacci 8, Standard, High Complexity..."
                          />
                        </div>
                      </div>
                    )}

                    {/* LEAD FACE FIELDS */}
                    {currentPerspective.id === 'lead' && ticket.faces.lead && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                            Sprint Goal Alignment Statement
                          </label>
                          <textarea
                            value={ticket.faces.lead.sprintGoalAlignment}
                            onChange={(e) => {
                              onUpdateTicket({
                                ...ticket,
                                faces: {
                                  ...ticket.faces,
                                  lead: {
                                    ...ticket.faces.lead!,
                                    sprintGoalAlignment: e.target.value
                                  }
                                }
                              });
                            }}
                            rows={2}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:border-purple-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                              Goal Confidence: {ticket.faces.lead.goalConfidence}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={ticket.faces.lead.goalConfidence}
                              onChange={(e) => {
                                onUpdateTicket({
                                  ...ticket,
                                  faces: {
                                    ...ticket.faces,
                                    lead: {
                                      ...ticket.faces.lead!,
                                      goalConfidence: Number(e.target.value)
                                    }
                                  }
                                });
                              }}
                              className="w-full accent-purple-500"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                              Risk Level
                            </label>
                            <select
                              value={ticket.faces.lead.riskLevel}
                              onChange={(e) => {
                                onUpdateTicket({
                                  ...ticket,
                                  faces: {
                                    ...ticket.faces,
                                    lead: {
                                      ...ticket.faces.lead!,
                                      riskLevel: e.target.value as any
                                    }
                                  }
                                });
                              }}
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200"
                            >
                              <option value="low">Low Risk</option>
                              <option value="medium">Medium Risk</option>
                              <option value="high">High Risk</option>
                              <option value="critical">Critical Risk</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* MANAGER OKR FIELDS */}
                    {currentPerspective.id === 'manager' && ticket.faces.manager && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                            Company & Department OKR Alignment
                          </label>
                          <input
                            type="text"
                            value={ticket.faces.manager.okrAlignment}
                            onChange={(e) => {
                              onUpdateTicket({
                                ...ticket,
                                faces: {
                                  ...ticket.faces,
                                  manager: {
                                    ...ticket.faces.manager!,
                                    okrAlignment: e.target.value
                                  }
                                }
                              });
                            }}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:border-emerald-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                              Strategic Pillar
                            </label>
                            <select
                              value={ticket.faces.manager.strategicPillar}
                              onChange={(e) => {
                                onUpdateTicket({
                                  ...ticket,
                                  faces: {
                                    ...ticket.faces,
                                    manager: {
                                      ...ticket.faces.manager!,
                                      strategicPillar: e.target.value as any
                                    }
                                  }
                                });
                              }}
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200"
                            >
                              <option value="Operational Resilience">Operational Resilience</option>
                              <option value="Market Growth">Market Growth</option>
                              <option value="Developer Experience">Developer Experience</option>
                              <option value="Enterprise Security">Enterprise Security</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                              Estimated Business Value / ROI
                            </label>
                            <input
                              type="text"
                              value={ticket.faces.manager.estimatedBusinessValue}
                              onChange={(e) => {
                                onUpdateTicket({
                                  ...ticket,
                                  faces: {
                                    ...ticket.faces,
                                    manager: {
                                      ...ticket.faces.manager!,
                                      estimatedBusinessValue: e.target.value
                                    }
                                  }
                                });
                              }}
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 font-semibold"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* QA FIELDS */}
                    {currentPerspective.id === 'qa' && ticket.faces.qa && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                              QA Signoff Status
                            </label>
                            <select
                              value={ticket.faces.qa.qaSignoff}
                              onChange={(e) => {
                                onUpdateTicket({
                                  ...ticket,
                                  faces: {
                                    ...ticket.faces,
                                    qa: {
                                      ...ticket.faces.qa!,
                                      qaSignoff: e.target.value as any
                                    }
                                  }
                                });
                              }}
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200"
                            >
                              <option value="untested">Untested</option>
                              <option value="in_testing">In Testing</option>
                              <option value="passed">Passed Definition of Done</option>
                              <option value="blocked">QA Blocked</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                              Automated Coverage: {ticket.faces.qa.automatedCoverageTarget}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={ticket.faces.qa.automatedCoverageTarget}
                              onChange={(e) => {
                                onUpdateTicket({
                                  ...ticket,
                                  faces: {
                                    ...ticket.faces,
                                    qa: {
                                      ...ticket.faces.qa!,
                                      automatedCoverageTarget: Number(e.target.value)
                                    }
                                  }
                                });
                              }}
                              className="w-full accent-amber-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: CONFIGURE SIDES & 3D GEOMETRY */}
              {activeTab === 'geometry' && (
                <div className="space-y-6">
                  {/* Perspective Facets Checklist Container */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500 dark:text-sky-400">
                            <Shapes className="w-4 h-4" />
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            Perspective Faces Checklist
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Arbitrarily select, mount, or remove faces. Each ticket can have a unique combination and number of faces.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/70 border border-sky-300 dark:border-sky-500/30">
                          {numSides} {numSides === 1 ? 'Face' : 'Faces'} Active
                        </span>
                      </div>
                    </div>

                    {/* Shape Summary Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">
                        Active 3D Shape: <strong className="text-slate-900 dark:text-slate-100">
                          {numSides === 1 && 'Single Facet Monolith (Flat 3D Card)'}
                          {numSides === 2 && 'Dual-Faced 3D Slab (Front & Back)'}
                          {numSides === 3 && 'Triangular 3D Prism (3-Sided)'}
                          {numSides === 4 && 'Square Prism / Cube (4-Sided)'}
                          {numSides === 5 && 'Pentagonal 3D Prism (5-Sided)'}
                          {numSides === 6 && 'Hexagonal 3D Prism (6-Sided)'}
                          {numSides > 6 && `${numSides}-Sided Polygonal Prism`}
                        </strong>
                      </span>
                      <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                        Apothem: {Math.round(geometry.apothem)}px
                      </span>
                    </div>

                    {/* Quick Preset Selection Filters */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Quick Preset Combinations:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleApplyPresetFaces(['developer'])}
                          className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition"
                        >
                          Dev Only (1)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPresetFaces(['developer', 'qa'])}
                          className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition"
                        >
                          Dev + QA (2)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPresetFaces(['developer', 'lead', 'qa'])}
                          className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition"
                        >
                          Dev + Lead + QA (3)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPresetFaces(['developer', 'lead', 'manager', 'qa'])}
                          className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition"
                        >
                          Agile Core 4 (Dev, Lead, OKR, QA)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPresetFaces(allAvailablePerspectives.map(p => p.id))}
                          className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition"
                        >
                          Select All Available ({allAvailablePerspectives.length})
                        </button>
                      </div>
                    </div>

                    {/* CHECKLIST OF PERSPECTIVES */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Arbitrary Faces Selection Checklist
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowAddSideModal(true)}
                          className="flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Custom Perspective</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {allAvailablePerspectives.map((p) => {
                          const isMounted = perspectives.some(tp => tp.id === p.id);
                          const isOnlyOneRemaining = isMounted && perspectives.length === 1;

                          return (
                            <div
                              key={p.id}
                              onClick={() => {
                                if (!isOnlyOneRemaining) {
                                  handleToggleFace(p);
                                }
                              }}
                              className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition select-none ${
                                isMounted
                                  ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-400 dark:border-sky-500 shadow-sm'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-60 hover:opacity-100'
                              } ${isOnlyOneRemaining ? 'cursor-not-allowed' : ''}`}
                            >
                              <div className="flex items-center gap-3">
                                {/* Checkbox Indicator */}
                                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                                  isMounted 
                                    ? 'bg-sky-500 text-white' 
                                    : 'border-2 border-slate-300 dark:border-slate-600'
                                }`}>
                                  {isMounted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>

                                <span 
                                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                                  style={{ backgroundColor: p.color }}
                                />

                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                      {p.name}
                                    </span>
                                    <span 
                                      className="text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold"
                                      style={{ borderColor: `${p.color}50`, color: p.color }}
                                    >
                                      {p.shortLabel}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                    {p.description}
                                  </span>
                                </div>
                              </div>

                              <div className="shrink-0 text-right">
                                {isMounted ? (
                                  <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/60 border border-sky-300 dark:border-sky-700">
                                    Mounted
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                    Available
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {perspectives.length === 1 && (
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                          <Info className="w-4 h-4 shrink-0 text-amber-500" />
                          <span>
                            This ticket has <strong>1 face</strong> (minimum constraint). Check another face to add it before removing this one.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Sides List & Reordering */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Assigned Faces Ordering on this 3D Object ({perspectives.length})
                      </h4>
                      <button
                        onClick={() => setShowAddSideModal(true)}
                        className="flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Custom Face</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {perspectives.map((p, idx) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {idx + 1}
                            </span>
                            <span 
                              className="w-3.5 h-3.5 rounded-full shadow-sm" 
                              style={{ backgroundColor: p.color }} 
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  {p.name}
                                </span>
                                <span 
                                  className="text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold"
                                  style={{ borderColor: `${p.color}40`, color: p.color }}
                                >
                                  {p.shortLabel}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                {p.description}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Reorder Buttons */}
                            <button
                              type="button"
                              onClick={() => handleMoveFace(idx, 'up')}
                              disabled={idx === 0}
                              className={`p-1.5 rounded-lg border transition ${
                                idx === 0 
                                  ? 'opacity-30 cursor-not-allowed border-transparent text-slate-400' 
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                              }`}
                              title="Move Up in Rotation Order"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleMoveFace(idx, 'down')}
                              disabled={idx === perspectives.length - 1}
                              className={`p-1.5 rounded-lg border transition ${
                                idx === perspectives.length - 1 
                                  ? 'opacity-30 cursor-not-allowed border-transparent text-slate-400' 
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                              }`}
                              title="Move Down in Rotation Order"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleSelectFace(idx)}
                              className="px-2.5 py-1 text-xs rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition font-medium"
                            >
                              Face Front
                            </button>

                            {perspectives.length > 1 ? (
                              <button
                                onClick={() => handleRemoveSide(p.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                title="Unmount Side"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span 
                                className="p-1.5 text-slate-300 dark:text-slate-700 cursor-not-allowed"
                                title="Minimum 1 side required"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Custom Side Inline Form */}
                  {showAddSideModal && (
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-sky-300 dark:border-sky-500/40 space-y-3 animate-in fade-in shadow-md">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-sky-600 dark:text-sky-300 uppercase tracking-wider">
                          Create New Custom Perspective Side
                        </h4>
                        <button 
                          onClick={() => setShowAddSideModal(false)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                            Perspective Name
                          </label>
                          <input
                            type="text"
                            value={newSideName}
                            onChange={(e) => setNewSideName(e.target.value)}
                            placeholder="e.g., Security & Compliance"
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:border-sky-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                            Short Code (2-4 chars)
                          </label>
                          <input
                            type="text"
                            maxLength={4}
                            value={newSideLabel}
                            onChange={(e) => setNewSideLabel(e.target.value)}
                            placeholder="e.g., SEC"
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:border-sky-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                            Theme Accent Color
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={newSideColor}
                              onChange={(e) => setNewSideColor(e.target.value)}
                              className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                            />
                            <span className="font-mono text-xs text-slate-700 dark:text-slate-300">{newSideColor}</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={newSideDesc}
                            onChange={(e) => setNewSideDesc(e.target.value)}
                            placeholder="Audit trail and SOC2 readiness"
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:border-sky-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setShowAddSideModal(false)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddCustomSide}
                          disabled={!newSideName.trim()}
                          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-sky-500 text-white hover:bg-sky-400 disabled:opacity-50 transition"
                        >
                          Add to 3D Polygon
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MULTI-ROLE COMMENTS */}
              {activeTab === 'comments' && (
                <div className="space-y-4">
                  {/* New Comment Input */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>
                        Commenting as: <strong className="text-slate-800 dark:text-slate-200">{currentUser.name}</strong> ({currentUser.roleTitle})
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Tagged to: {currentPerspective.name} Face
                      </span>
                    </div>

                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={`Add your ${currentPerspective.name} note or feedback...`}
                      rows={2}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
                    />

                    <div className="flex justify-end">
                      <button
                        onClick={handleAddComment}
                        disabled={!commentText.trim()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white disabled:opacity-40 transition"
                      >
                        <Send className="w-3 h-3" />
                        <span>Post Perspective Note</span>
                      </button>
                    </div>
                  </div>

                  {/* Comment Stream */}
                  <div className="space-y-3">
                    {ticket.comments && ticket.comments.length > 0 ? (
                      ticket.comments.map((cm) => (
                        <div
                          key={cm.id}
                          className="p-3.5 rounded-xl bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 space-y-1.5 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {cm.userAvatar ? (
                                <img
                                  src={cm.userAvatar}
                                  alt={cm.userName}
                                  className="w-5 h-5 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                                />
                              ) : (
                                <UserIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                              )}
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {cm.userName}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                                on {cm.faceName}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              {cm.createdAt}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-7">
                            {cm.content}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 italic">
                        No perspective comments posted yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
