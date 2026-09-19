import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Plus, 
  Trash2, 
  Layers, 
  RotateCw, 
  Eye, 
  Check, 
  Code2, 
  Compass, 
  TrendingUp, 
  ShieldCheck,
  Shapes,
  Palette,
  Edit3,
  ArrowUp,
  ArrowDown,
  X,
  RotateCcw,
  Zap,
  Award,
  AlertCircle,
  Tag,
  Cpu,
  Bookmark,
  CheckCircle2,
  Info
} from 'lucide-react';
import { SidePerspective, PerspectiveRoleType } from '../../types';
import { calculatePrismGeometry } from '../../utils/prismMath';
import { useTheme } from '../../context/ThemeContext';
import { DEFAULT_PERSPECTIVES } from '../../data/mockData';

interface PerspectiveStudioViewProps {
  perspectives: SidePerspective[];
  onUpdatePerspectives: (perspectives: SidePerspective[]) => void;
}

const AVAILABLE_ICONS = [
  { name: 'Code2', component: Code2, label: 'Code' },
  { name: 'Compass', component: Compass, label: 'Compass' },
  { name: 'TrendingUp', component: TrendingUp, label: 'Metrics' },
  { name: 'ShieldCheck', component: ShieldCheck, label: 'Shield' },
  { name: 'Sparkles', component: Sparkles, label: 'Sparkles' },
  { name: 'Layers', component: Layers, label: 'Layers' },
  { name: 'Zap', component: Zap, label: 'Speed' },
  { name: 'Eye', component: Eye, label: 'Observer' },
  { name: 'Palette', component: Palette, label: 'Design' },
  { name: 'Cpu', component: Cpu, label: 'Compute' },
  { name: 'Award', component: Award, label: 'Target' },
  { name: 'AlertCircle', component: AlertCircle, label: 'Risk' },
  { name: 'Sliders', component: Sliders, label: 'Config' },
  { name: 'Tag', component: Tag, label: 'Release' },
  { name: 'Bookmark', component: Bookmark, label: 'Docs' }
];

const PRESET_COLORS = [
  '#38bdf8', // Sky
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#f43f5e', // Rose
  '#64748b'  // Slate
];

const ROLE_OPTIONS: { type: PerspectiveRoleType; label: string }[] = [
  { type: 'developer', label: 'Developer Spec' },
  { type: 'lead', label: 'Engineering Lead' },
  { type: 'manager', label: 'Manager / OKRs' },
  { type: 'qa', label: 'QA / Quality Gate' },
  { type: 'design', label: 'Product & UX' },
  { type: 'devops', label: 'DevOps & SRE' },
  { type: 'custom', label: 'Custom Perspective' }
];

export const PerspectiveStudioView: React.FC<PerspectiveStudioViewProps> = ({
  perspectives,
  onUpdatePerspectives
}) => {
  const { isDark } = useTheme();

  // 3D Visualizer Camera state
  const [previewRotY, setPreviewRotY] = useState<number>(15);
  const [previewRotX, setPreviewRotX] = useState<number>(-12);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [highlightedSideId, setHighlightedSideId] = useState<string | null>(null);

  // Editor states: either editing an existing perspective or creating a new one
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Form inputs for editor
  const [formName, setFormName] = useState<string>('');
  const [formShortLabel, setFormShortLabel] = useState<string>('');
  const [formRoleType, setFormRoleType] = useState<PerspectiveRoleType>('custom');
  const [formIcon, setFormIcon] = useState<string>('Sparkles');
  const [formColor, setFormColor] = useState<string>('#38bdf8');
  const [formDesc, setFormDesc] = useState<string>('');

  // 3D Geometry for Studio Preview
  const faceWidth = 240;
  const faceHeight = 320;
  const geometry = calculatePrismGeometry(perspectives.length, faceWidth, faceHeight);

  // Auto-rotation animation loop
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setPreviewRotY(prev => (prev - 0.4) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, [isRotating]);

  // Open Edit Form for a specific perspective
  const handleStartEdit = (p: SidePerspective) => {
    setIsCreatingNew(false);
    setEditingId(p.id);
    setFormName(p.name);
    setFormShortLabel(p.shortLabel);
    setFormRoleType(p.roleType || 'custom');
    setFormIcon(p.icon || 'Sparkles');
    setFormColor(p.color || '#38bdf8');
    setFormDesc(p.description || '');
    setHighlightedSideId(p.id);
  };

  // Open Add Form
  const handleStartAdd = () => {
    setEditingId(null);
    setIsCreatingNew(true);
    const sideNum = perspectives.length + 1;
    setFormName(`Perspective ${sideNum}`);
    setFormShortLabel(`S${sideNum}`);
    setFormRoleType('custom');
    setFormIcon('Sparkles');
    setFormColor(PRESET_COLORS[(perspectives.length) % PRESET_COLORS.length]);
    setFormDesc('Custom lens focusing on specific domain aspects.');
  };

  // Close editor
  const handleCancelEditor = () => {
    setEditingId(null);
    setIsCreatingNew(false);
  };

  // Save changes (either update or create)
  const handleSaveEditor = () => {
    if (!formName.trim()) return;

    const shortLabel = formShortLabel.trim().toUpperCase() || formName.trim().slice(0, 4).toUpperCase();

    if (isCreatingNew) {
      const newSide: SidePerspective = {
        id: `persp-${Date.now()}`,
        name: formName.trim(),
        shortLabel,
        roleType: formRoleType,
        icon: formIcon,
        color: formColor,
        bgGradient: `from-slate-900/95 via-slate-900/90 to-slate-950/95`,
        borderGlow: `border-[${formColor}]/40`,
        description: formDesc.trim() || 'Custom perspective facet'
      };
      onUpdatePerspectives([...perspectives, newSide]);
      setHighlightedSideId(newSide.id);
    } else if (editingId) {
      const updated = perspectives.map(p => {
        if (p.id === editingId) {
          return {
            ...p,
            name: formName.trim(),
            shortLabel,
            roleType: formRoleType,
            icon: formIcon,
            color: formColor,
            description: formDesc.trim() || p.description
          };
        }
        return p;
      });
      onUpdatePerspectives(updated);
    }

    handleCancelEditor();
  };

  // Delete perspective (strictly enforces minimum 1 side)
  const handleDeletePerspective = (id: string) => {
    if (perspectives.length <= 1) {
      alert('Minimum 1 side required. A ticket or 3D object cannot have fewer than 1 perspective side.');
      return;
    }
    const updated = perspectives.filter(p => p.id !== id);
    onUpdatePerspectives(updated);

    if (editingId === id) {
      handleCancelEditor();
    }
    if (highlightedSideId === id) {
      setHighlightedSideId(null);
    }
  };

  // Move perspective up or down in the polygon
  const handleMovePerspective = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= perspectives.length) return;
    const updated = [...perspectives];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onUpdatePerspectives(updated);
  };

  // Preset shape template handlers
  const handleApplyPresetSides = (count: number) => {
    if (count === 1) {
      onUpdatePerspectives([DEFAULT_PERSPECTIVES[0]]);
    } else if (count === 2) {
      onUpdatePerspectives([DEFAULT_PERSPECTIVES[0], DEFAULT_PERSPECTIVES[3]]);
    } else if (count === 3) {
      onUpdatePerspectives([DEFAULT_PERSPECTIVES[0], DEFAULT_PERSPECTIVES[1], DEFAULT_PERSPECTIVES[3]]);
    } else if (count === 4) {
      onUpdatePerspectives(DEFAULT_PERSPECTIVES.slice(0, 4));
    } else if (count === 5) {
      onUpdatePerspectives(DEFAULT_PERSPECTIVES.slice(0, 5));
    } else if (count === 6) {
      const extraSRE: SidePerspective = {
        id: 'sre-ops',
        name: 'SRE & Infrastructure',
        shortLabel: 'SRE',
        roleType: 'devops',
        icon: 'Cpu',
        color: '#06b6d4',
        bgGradient: '',
        borderGlow: '',
        description: 'Availability, latency, telemetry metrics and runbooks.'
      };
      onUpdatePerspectives([...DEFAULT_PERSPECTIVES.slice(0, 5), extraSRE]);
    }
    handleCancelEditor();
  };

  // Reset to default 4 Agile roles
  const handleResetDefaults = () => {
    onUpdatePerspectives(DEFAULT_PERSPECTIVES.slice(0, 4));
    handleCancelEditor();
  };

  // Helper to render icon
  const renderIcon = (iconName: string, className = "w-4 h-4") => {
    const found = AVAILABLE_ICONS.find(i => i.name === iconName);
    if (found) {
      const Component = found.component;
      return <Component className={className} />;
    }
    return <Sparkles className={className} />;
  };

  const activeEditingSide = perspectives.find(p => p.id === editingId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in">
      
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-500 dark:text-sky-400">
              <Shapes className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              3D Perspective Geometry Studio
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure multi-faceted 3D polyhedron ticket shapes. Edit, add, or delete perspective sides (minimum 1 side).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            title="Reset workspace perspectives to 4 standard Agile roles"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset 4 Agile Roles</span>
          </button>

          <button
            onClick={handleStartAdd}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Side Perspective</span>
          </button>
        </div>
      </div>

      {/* Quick Shape Presets Selector */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-500" />
            <span>Quick Geometry Presets:</span>
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
            (Minimum 1 side)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { sides: 1, label: '1 Side (Card)' },
            { sides: 2, label: '2 Sides (Dual Slab)' },
            { sides: 3, label: '3 Sides (Triangular)' },
            { sides: 4, label: '4 Sides (Square Prism)' },
            { sides: 5, label: '5 Sides (Pentagon)' },
            { sides: 6, label: '6 Sides (Hexagon)' }
          ].map((preset) => (
            <button
              key={preset.sides}
              onClick={() => handleApplyPresetSides(preset.sides)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition ${
                perspectives.length === preset.sides
                  ? 'bg-sky-500 text-white border-sky-500 font-bold shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: 3D Holographic Shape Visualizer (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[530px] relative overflow-hidden shadow-sm">
          
          {/* Visualizer HUD Bar */}
          <div className="w-full flex items-center justify-between z-10 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                {perspectives.length} {perspectives.length === 1 ? 'Side' : 'Sides'}
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {perspectives.length === 1
                  ? 'Single Facet Monolith'
                  : perspectives.length === 2
                  ? 'Dual-Faced 3D Slab'
                  : `${perspectives.length}-Sided Polygon Prism`}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setPreviewRotX(-12);
                  setPreviewRotY(15);
                }}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-sm transition"
                title="Reset Camera Angle"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsRotating(prev => !prev)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-sm transition"
              >
                <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
                <span>{isRotating ? 'Pause' : 'Spin'}</span>
              </button>
            </div>
          </div>

          {/* 3D Prism Stage Viewport */}
          <div className="flex-1 w-full flex items-center justify-center perspective-1500 select-none my-6">
            <div
              className="preserve-3d transition-transform duration-75 relative cursor-grab active:cursor-grabbing"
              style={{
                transform: `rotateX(${previewRotX}deg) rotateY(${previewRotY}deg)`
              }}
            >
              {/* Top Cap SVG for regular polygon prisms (3+ sides) */}
              {perspectives.length >= 3 && (
                <div
                  className="absolute pointer-events-none preserve-3d -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: `${geometry.circumradius * 2}px`,
                    height: `${geometry.circumradius * 2}px`,
                    transform: `translateY(-${faceHeight / 2}px) rotateX(90deg)`
                  }}
                >
                  <svg viewBox={`0 0 ${geometry.circumradius * 2} ${geometry.circumradius * 2}`} className="w-full h-full drop-shadow-md">
                    <polygon
                      points={geometry.svgPolygonPoints}
                      fill={isDark ? "rgba(2, 132, 199, 0.15)" : "rgba(2, 132, 199, 0.08)"}
                      stroke="#0284c7"
                      strokeWidth="2"
                      strokeOpacity="0.6"
                    />
                  </svg>
                </div>
              )}

              {/* Bottom Cap SVG for regular polygon prisms (3+ sides) */}
              {perspectives.length >= 3 && (
                <div
                  className="absolute pointer-events-none preserve-3d -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: `${geometry.circumradius * 2}px`,
                    height: `${geometry.circumradius * 2}px`,
                    transform: `translateY(${faceHeight / 2}px) rotateX(-90deg)`
                  }}
                >
                  <svg viewBox={`0 0 ${geometry.circumradius * 2} ${geometry.circumradius * 2}`} className="w-full h-full drop-shadow-md">
                    <polygon
                      points={geometry.svgPolygonPoints}
                      fill={isDark ? "rgba(2, 132, 199, 0.15)" : "rgba(2, 132, 199, 0.08)"}
                      stroke="#0284c7"
                      strokeWidth="2"
                      strokeOpacity="0.6"
                    />
                  </svg>
                </div>
              )}

              {/* 3D Polyhedron Faces */}
              {perspectives.map((p, idx) => {
                let transformStyle = '';
                if (perspectives.length === 1) {
                  transformStyle = `rotateY(0deg) translateZ(0px)`;
                } else if (perspectives.length === 2) {
                  transformStyle = idx === 0 
                    ? `rotateY(0deg) translateZ(${geometry.apothem}px)`
                    : `rotateY(180deg) translateZ(${geometry.apothem}px)`;
                } else {
                  const angle = idx * geometry.anglePerSide;
                  transformStyle = `rotateY(${angle}deg) translateZ(${geometry.apothem}px)`;
                }

                const isHighlighted = highlightedSideId === p.id || editingId === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => handleStartEdit(p)}
                    className="absolute rounded-2xl p-4 backface-visible flex flex-col justify-between cursor-pointer transition-all duration-200 hover:brightness-105"
                    style={{
                      width: `${faceWidth}px`,
                      height: `${faceHeight}px`,
                      left: `-${faceWidth / 2}px`,
                      top: `-${faceHeight / 2}px`,
                      transform: transformStyle,
                      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.97)',
                      border: isHighlighted ? `2.5px solid ${p.color}` : `1.5px solid ${p.color}80`,
                      boxShadow: isHighlighted 
                        ? `0 0 25px -2px ${p.color}80, 0 10px 25px -5px rgba(0,0,0,0.3)` 
                        : `0 0 14px -3px ${p.color}35`
                    }}
                    title={`Click to edit side: ${p.name}`}
                  >
                    {/* Face Top Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                          style={{ backgroundColor: p.color }}
                        >
                          {idx + 1}
                        </span>
                        <span 
                          className="text-[11px] font-bold tracking-wider"
                          style={{ color: p.color }}
                        >
                          SIDE #{idx + 1}
                        </span>
                      </div>

                      <span 
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border"
                        style={{ borderColor: `${p.color}50`, color: p.color, backgroundColor: `${p.color}15` }}
                      >
                        {p.shortLabel}
                      </span>
                    </div>

                    {/* Face Center Content */}
                    <div className="text-center my-auto px-2 space-y-2">
                      <div 
                        className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-white shadow-md"
                        style={{ backgroundColor: p.color }}
                      >
                        {renderIcon(p.icon, "w-5 h-5")}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                        {p.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    {/* Face Bottom Indicator */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Face {idx + 1} / {perspectives.length}</span>
                      <span className="flex items-center gap-1 text-sky-500 dark:text-sky-400 font-sans font-medium">
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3D Geometry Metrics Footer */}
          <div className="w-full pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>
              {perspectives.length === 1 
                ? 'Monolith Depth: Flat Card'
                : `Apothem: ${Math.round(geometry.apothem)}px`}
            </span>
            <span>
              {perspectives.length === 1
                ? 'Rotation: 360°'
                : `Step: ${Math.round(geometry.anglePerSide)}°`}
            </span>
            <span>
              Sides: {perspectives.length}
            </span>
          </div>
        </div>

        {/* Right Column: Perspective Editor & Configured Sides List (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* PERSPECTIVE EDITOR PANEL (shown when editing or adding) */}
          {(editingId || isCreatingNew) && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-sky-500/60 dark:border-sky-500/50 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2">
              
              {/* Editor Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-sky-500 text-white">
                    {isCreatingNew ? <Plus className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {isCreatingNew ? 'Add New Perspective Side' : `Edit Side: ${activeEditingSide?.name || 'Perspective'}`}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Modify the title, badge code, icon, color, and role specifications for this facet.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCancelEditor}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Close editor"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                    Perspective Title *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. SRE & Resilience, Security Audit"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Short Code */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                    Facet Code (2-5 Letters) *
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    value={formShortLabel}
                    onChange={(e) => setFormShortLabel(e.target.value)}
                    placeholder="e.g. SRE, SEC, ARCH"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Role Type */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                    Role Category
                  </label>
                  <select
                    value={formRoleType}
                    onChange={(e) => setFormRoleType(e.target.value as PerspectiveRoleType)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {ROLE_OPTIONS.map(opt => (
                      <option key={opt.type} value={opt.type}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Accent Color */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                    Facet Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {PRESET_COLORS.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setFormColor(c)}
                          className="w-5 h-5 rounded-full border border-black/10 dark:border-white/10 transition hover:scale-110"
                          style={{ 
                            backgroundColor: c,
                            outline: formColor === c ? '2px solid #0284c7' : 'none',
                            outlineOffset: '1px'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                  Facet Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_ICONS.map((iconItem) => {
                    const IconComp = iconItem.component;
                    const isSelected = formIcon === iconItem.name;
                    return (
                      <button
                        key={iconItem.name}
                        type="button"
                        onClick={() => setFormIcon(iconItem.name)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs transition ${
                          isSelected
                            ? 'bg-sky-50 dark:bg-sky-950/80 border-sky-500 text-sky-600 dark:text-sky-400 font-bold shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                        <span>{iconItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                  Perspective Description & Scope
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe the focus, criteria, or metrics evaluated from this perspective..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Live Preview Bar inside Editor */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: formColor }}
                  >
                    {renderIcon(formIcon, "w-4 h-4")}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {formName || 'Perspective Title'}
                    </span>
                    <span 
                      className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold"
                      style={{ borderColor: `${formColor}60`, color: formColor }}
                    >
                      {formShortLabel || 'CODE'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelEditor}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveEditor}
                    disabled={!formName.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white shadow-md shadow-sky-500/20 transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isCreatingNew ? 'Add Perspective Side' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* PERSPECTIVES LIST */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>Current 3D Sides</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {perspectives.length} {perspectives.length === 1 ? 'Side' : 'Sides'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {perspectives.length === 1 
                    ? 'Minimum limit reached (1 side). Add more sides or edit the current facet.'
                    : 'Click Edit to update any side, or use arrows to reorder faces around the polygon.'}
                </p>
              </div>

              {!isCreatingNew && !editingId && (
                <button
                  onClick={handleStartAdd}
                  className="flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Side</span>
                </button>
              )}
            </div>

            {/* List of configured sides */}
            <div className="space-y-2.5">
              {perspectives.map((p, index) => {
                const isSelected = editingId === p.id || highlightedSideId === p.id;
                const canDelete = perspectives.length > 1;

                return (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm ${
                      isSelected
                        ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-400 dark:border-sky-500'
                        : 'bg-slate-50/70 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Left: Index badge, Color/Icon, and Info */}
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm shrink-0">
                        {index + 1}
                      </span>

                      <div 
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
                        style={{ backgroundColor: p.color }}
                      >
                        {renderIcon(p.icon, "w-4 h-4")}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {p.name}
                          </span>
                          <span 
                            className="text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold"
                            style={{ borderColor: `${p.color}50`, color: p.color, backgroundColor: `${p.color}15` }}
                          >
                            {p.shortLabel}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                            {p.roleType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {p.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions (Move Up, Move Down, Edit, Delete) */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      
                      {/* Move Up */}
                      <button
                        onClick={() => handleMovePerspective(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        onClick={() => handleMovePerspective(index, 'down')}
                        disabled={index === perspectives.length - 1}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm transition"
                        title="Edit this perspective"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {/* Delete Button (Enforces Minimum 1 Side) */}
                      {canDelete ? (
                        <button
                          onClick={() => handleDeletePerspective(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Delete perspective side"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span
                          className="p-1.5 rounded-lg text-slate-300 dark:text-slate-700 cursor-not-allowed"
                          title="Minimum 1 side required"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Minimum limit notification if 1 side */}
            {perspectives.length === 1 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-700 dark:text-amber-300">
                <Info className="w-4 h-4 shrink-0 text-amber-500" />
                <span>
                  The 3D polygon is currently configured with <strong>1 side (minimum required)</strong>. You cannot delete this side, but you may edit its contents or click <strong>Add Side</strong> to add more sides.
                </span>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
};
