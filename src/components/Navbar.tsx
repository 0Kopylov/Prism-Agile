import React, { useState } from 'react';
import { 
  Layers, 
  TrendingUp, 
  Shapes, 
  Plus, 
  ChevronDown, 
  User as UserIcon,
  Sparkles,
  RotateCcw,
  Sliders,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentView: 'board' | 'backlog' | 'okr' | 'studio';
  onSelectView: (view: 'board' | 'backlog' | 'okr' | 'studio') => void;
  currentUser: User;
  users: User[];
  onSelectUser: (user: User) => void;
  onCreateTicket: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  currentUser,
  users,
  onSelectUser,
  onCreateTicket,
  onResetData
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Project Info */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectView('board')}>
            {/* 3D Prism Hex Gem Logo */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 via-purple-500 to-emerald-400 p-[1.5px] shadow-md shadow-sky-500/20">
              <div className="w-full h-full bg-slate-900 dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shapes className="w-4 h-4 text-sky-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 dark:text-slate-100 tracking-tight text-sm">
                  PRISM<span className="text-sky-600 dark:text-sky-400">AGILE</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-500/30 font-semibold">
                  3D Perspectives
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[140px] sm:max-w-xs block leading-tight">
                Atlas Realtime Sync Platform
              </span>
            </div>
          </div>

          {/* Navigation Views Switcher */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => onSelectView('board')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                currentView === 'board'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sprint Board</span>
            </button>

            <button
              onClick={() => onSelectView('backlog')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                currentView === 'backlog'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Backlog</span>
            </button>

            <button
              onClick={() => onSelectView('okr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                currentView === 'okr'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>OKR Alignment</span>
            </button>

            <button
              onClick={() => onSelectView('studio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                currentView === 'studio'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Shapes className="w-3.5 h-3.5" />
              <span>Perspective Studio</span>
            </button>
          </nav>
        </div>

        {/* Right Section: Theme Toggle, Quick Create, Persona Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Light / Dark Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            id="theme-toggle-btn"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200/90 text-slate-700 border border-slate-200/90 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-800 transition cursor-pointer shadow-sm"
            title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
            aria-label="Toggle light and dark theme"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline font-medium text-slate-300">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-sky-600" />
                <span className="hidden sm:inline font-medium text-slate-700">Dark</span>
              </>
            )}
          </button>

          {/* Quick Create Button */}
          <button
            onClick={onCreateTicket}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create 3D Story</span>
          </button>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                  {currentUser.roleTitle}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in"
                onClick={() => setShowUserDropdown(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Switch Active Persona
                </div>

                <div className="py-1 space-y-1">
                  {users.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => onSelectUser(u)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                          isSelected 
                            ? 'bg-sky-50 border border-sky-200 text-sky-900 dark:bg-sky-950/70 dark:border-sky-500/40 dark:text-sky-200' 
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{u.name}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{u.roleTitle}</div>
                          </div>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-sky-500 dark:text-sky-400" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onResetData();
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Sample Agile Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Sub-Navigation */}
      <div className="flex md:hidden items-center justify-around pt-2 border-t border-slate-200 dark:border-slate-800/80 mt-2 text-xs">
        <button
          onClick={() => onSelectView('board')}
          className={`py-1 font-semibold ${currentView === 'board' ? 'text-sky-600 dark:text-sky-400 border-b-2 border-sky-500 dark:border-sky-400' : 'text-slate-500 dark:text-slate-400'}`}
        >
          Board
        </button>
        <button
          onClick={() => onSelectView('backlog')}
          className={`py-1 font-semibold ${currentView === 'backlog' ? 'text-sky-600 dark:text-sky-400 border-b-2 border-sky-500 dark:border-sky-400' : 'text-slate-500 dark:text-slate-400'}`}
        >
          Backlog
        </button>
        <button
          onClick={() => onSelectView('okr')}
          className={`py-1 font-semibold ${currentView === 'okr' ? 'text-sky-600 dark:text-sky-400 border-b-2 border-sky-500 dark:border-sky-400' : 'text-slate-500 dark:text-slate-400'}`}
        >
          OKR Matrix
        </button>
        <button
          onClick={() => onSelectView('studio')}
          className={`py-1 font-semibold ${currentView === 'studio' ? 'text-sky-600 dark:text-sky-400 border-b-2 border-sky-500 dark:border-sky-400' : 'text-slate-500 dark:text-slate-400'}`}
        >
          Studio
        </button>
      </div>
    </header>
  );
};
