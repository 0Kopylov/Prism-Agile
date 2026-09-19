import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  User, 
  Sprint, 
  OkrGoal, 
  SidePerspective, 
  TicketStatus,
  ChecklistItem
} from './types';
import { 
  INITIAL_TICKETS, 
  USERS, 
  SPRINTS, 
  OKR_GOALS, 
  DEFAULT_PERSPECTIVES 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { SprintBoard } from './components/Board/SprintBoard';
import { BacklogView } from './components/Backlog/BacklogView';
import { OKRMatrixView } from './components/OKR/OKRMatrixView';
import { PerspectiveStudioView } from './components/Studio/PerspectiveStudioView';
import { TicketInspectionModal } from './components/ThreeD/TicketInspectionModal';
import { CreateTicketModal } from './components/ThreeD/CreateTicketModal';

export default function App() {
  // Navigation View: 'board' | 'backlog' | 'okr' | 'studio'
  const [currentView, setCurrentView] = useState<'board' | 'backlog' | 'okr' | 'studio'>('board');

  // Application State with Local Storage persistence
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem('prism_agile_tickets_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load tickets from localStorage', e);
    }
    return INITIAL_TICKETS;
  });

  const [users] = useState<User[]>(USERS);
  const [currentUser, setCurrentUser] = useState<User>(USERS[0]); // Alex Chen (Senior Fullstack)
  const [sprints, setSprints] = useState<Sprint[]>(SPRINTS);
  const [okrGoals] = useState<OkrGoal[]>(OKR_GOALS);
  const [perspectives, setPerspectives] = useState<SidePerspective[]>(DEFAULT_PERSPECTIVES);

  // Global Perspective Lens Switcher:
  // Controls synchronized 3D rotation across all cards ('developer', 'lead', 'manager', 'qa', or 'free')
  const [globalPerspectiveId, setGlobalPerspectiveId] = useState<string>('free');

  // Modals
  const [inspectingTicketId, setInspectingTicketId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Persist tickets on changes
  useEffect(() => {
    try {
      localStorage.setItem('prism_agile_tickets_v1', JSON.stringify(tickets));
    } catch (e) {
      console.error('Failed to persist tickets', e);
    }
  }, [tickets]);

  // Handle active sprint
  const activeSprint = sprints.find(s => s.status === 'active') || sprints[0];

  // Inspecting ticket object (always fresh from tickets array)
  const inspectingTicket = tickets.find(t => t.id === inspectingTicketId) || null;

  // Actions
  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: TicketStatus) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: newStatus, updatedAt: 'Just now' };
      }
      return t;
    }));
  };

  const handleMoveTicketSprint = (ticketId: string, targetSprintId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, sprintId: targetSprintId, updatedAt: 'Just now' };
      }
      return t;
    }));
  };

  const handleUpdateChecklist = (ticketId: string, itemId: string, done: boolean) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId && t.faces.developer) {
        const updatedList = t.faces.developer.checklist.map(c => 
          c.id === itemId ? { ...c, done } : c
        );
        return {
          ...t,
          faces: {
            ...t.faces,
            developer: {
              ...t.faces.developer,
              checklist: updatedList
            }
          }
        };
      }
      return t;
    }));
  };

  const handleUpdateTicketChecklist = (ticketId: string, checklist: ChecklistItem[]) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const currentDev = t.faces.developer || {
          technicalApproach: '',
          gitBranch: '',
          techStack: [],
          checklist: [],
          apiEndpoints: []
        };
        return {
          ...t,
          faces: {
            ...t.faces,
            developer: {
              ...currentDev,
              checklist
            }
          },
          updatedAt: 'Just now'
        };
      }
      return t;
    }));
  };

  const handleToggleSignoff = (ticketId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId && t.faces.lead) {
        return {
          ...t,
          faces: {
            ...t.faces,
            lead: {
              ...t.faces.lead,
              architecturalSignoff: !t.faces.lead.architecturalSignoff
            }
          }
        };
      }
      return t;
    }));
  };

  const handleToggleScenario = (ticketId: string, scenarioId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId && t.faces.qa) {
        const updatedScenarios = t.faces.qa.testScenarios.map(s => 
          s.id === scenarioId ? { ...s, passed: !s.passed } : s
        );
        return {
          ...t,
          faces: {
            ...t.faces,
            qa: {
              ...t.faces.qa,
              testScenarios: updatedScenarios
            }
          }
        };
      }
      return t;
    }));
  };

  const handleRotateTicketFace = (ticketId: string, newFaceIndex: number) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, activeFaceIndex: newFaceIndex };
      }
      return t;
    }));
  };

  const handleLogHours = (ticketId: string, hours: number, note?: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const current = t.timeTracking || {
          originalEstimateHours: (t.storyPoints || 3) * 4,
          timeSpentHours: 0,
          remainingHours: (t.storyPoints || 3) * 4
        };
        const spent = Number(((current.timeSpentHours || 0) + hours).toFixed(2));
        const remaining = Math.max(0, Number(((current.remainingHours || 0) - hours).toFixed(2)));
        const newLog = {
          id: `wl-${Date.now()}`,
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          hours,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          note: note || 'Sprint task work session'
        };
        return {
          ...t,
          timeTracking: {
            ...current,
            timeSpentHours: spent,
            remainingHours: remaining,
            worklogs: [newLog, ...(current.worklogs || [])]
          },
          updatedAt: 'Just now'
        };
      }
      return t;
    }));
  };

  const handleUpdatePoints = (ticketId: string, points: number) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const current = t.timeTracking || {
          originalEstimateHours: (t.storyPoints || 3) * 4,
          timeSpentHours: 0,
          remainingHours: (t.storyPoints || 3) * 4
        };
        const newEst = points * 4;
        return {
          ...t,
          storyPoints: points,
          timeTracking: {
            ...current,
            originalEstimateHours: newEst,
            remainingHours: Math.max(0, newEst - (current.timeSpentHours || 0))
          },
          updatedAt: 'Just now'
        };
      }
      return t;
    }));
  };

  const handleCreateTicket = (newTicket: Ticket) => {
    setTickets(prev => [newTicket, ...prev]);
    setShowCreateModal(false);
  };

  const handleCreateSprint = () => {
    const newSprintNumber = sprints.length + 42;
    const newSprint: Sprint = {
      id: `sprint-${Date.now()}`,
      name: `Sprint ${newSprintNumber}: Strategic Scale`,
      goal: 'Expand horizontal throughput and complete architectural milestones.',
      startDate: 'Oct 28, 2026',
      endDate: 'Nov 11, 2026',
      status: 'planned',
      totalPoints: 0,
      completedPoints: 0
    };
    setSprints(prev => [...prev, newSprint]);
  };

  const handleResetData = () => {
    if (confirm('Reset all stories, perspectives, and agile data to initial default state?')) {
      localStorage.removeItem('prism_agile_tickets_v1');
      setTickets(INITIAL_TICKETS);
      setSprints(SPRINTS);
      setPerspectives(DEFAULT_PERSPECTIVES);
      setGlobalPerspectiveId('developer');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-800 dark:selection:text-sky-200 transition-colors duration-200">
      
      {/* Top Main Navigation Bar with Persona Switcher */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        currentUser={currentUser}
        users={users}
        onSelectUser={setCurrentUser}
        onCreateTicket={() => setShowCreateModal(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {currentView === 'board' && (
          <SprintBoard
            tickets={tickets}
            sprint={activeSprint}
            users={users}
            currentUser={currentUser}
            globalPerspectiveId={globalPerspectiveId}
            onSetGlobalPerspective={setGlobalPerspectiveId}
            onOpenTicketModal={(t) => setInspectingTicketId(t.id)}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onUpdateChecklist={handleUpdateChecklist}
            onUpdateTicketChecklist={handleUpdateTicketChecklist}
            onToggleSignoff={handleToggleSignoff}
            onToggleScenario={handleToggleScenario}
            onRotateTicketFace={handleRotateTicketFace}
            onLogHours={handleLogHours}
            onUpdatePoints={handleUpdatePoints}
            onCreateTicket={() => setShowCreateModal(true)}
          />
        )}

        {currentView === 'backlog' && (
          <BacklogView
            tickets={tickets}
            sprints={sprints}
            users={users}
            onOpenTicketModal={(t) => setInspectingTicketId(t.id)}
            onMoveTicketSprint={handleMoveTicketSprint}
            onCreateTicket={() => setShowCreateModal(true)}
            onCreateSprint={handleCreateSprint}
          />
        )}

        {currentView === 'okr' && (
          <OKRMatrixView
            tickets={tickets}
            okrGoals={okrGoals}
            users={users}
            onOpenTicketModal={(t) => {
              // Open modal and snap to manager face index if available
              const managerIdx = t.perspectives.findIndex(p => p.id === 'manager');
              if (managerIdx !== -1) {
                handleRotateTicketFace(t.id, managerIdx);
              }
              setInspectingTicketId(t.id);
            }}
          />
        )}

        {currentView === 'studio' && (
          <PerspectiveStudioView
            perspectives={perspectives}
            onUpdatePerspectives={(newPerspectives) => {
              setPerspectives(newPerspectives);
              // Synchronize metadata for faces that tickets use, while preserving each ticket's unique subset of faces
              setTickets(prev => prev.map(t => {
                const updatedTicketPerspectives = t.perspectives
                  .filter(tp => newPerspectives.some(np => np.id === tp.id))
                  .map(tp => newPerspectives.find(np => np.id === tp.id) || tp);
                const finalPerspectives = updatedTicketPerspectives.length > 0
                  ? updatedTicketPerspectives
                  : [newPerspectives[0]];
                return {
                  ...t,
                  perspectives: finalPerspectives,
                  activeFaceIndex: Math.min(t.activeFaceIndex || 0, Math.max(0, finalPerspectives.length - 1))
                };
              }));
            }}
          />
        )}
      </main>

      {/* 3D Ticket Holographic Inspection Modal */}
      {inspectingTicket && (
        <TicketInspectionModal
          ticket={inspectingTicket}
          users={users}
          sprints={sprints}
          currentUser={currentUser}
          workspacePerspectives={perspectives}
          onClose={() => setInspectingTicketId(null)}
          onUpdateTicket={handleUpdateTicket}
        />
      )}

      {/* Create New 3D Agile Story Modal */}
      {showCreateModal && (
        <CreateTicketModal
          sprints={sprints}
          users={users}
          defaultSprintId={activeSprint.id}
          availablePerspectives={perspectives}
          nextTicketNumber={tickets.length + 101}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTicket}
        />
      )}

    </div>
  );
}
