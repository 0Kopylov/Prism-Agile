export type TicketType = 'story' | 'task' | 'bug' | 'epic';
export type TicketStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'qa' | 'done';
export type TicketPriority = 'lowest' | 'low' | 'medium' | 'high' | 'highest';

export type PerspectiveRoleType = 'developer' | 'lead' | 'manager' | 'qa' | 'design' | 'devops' | 'custom';

export interface SidePerspective {
  id: string;
  name: string;
  shortLabel: string;
  roleType: PerspectiveRoleType;
  icon: string; // lucide icon identifier
  color: string; // Primary accent color (e.g., #3b82f6)
  bgGradient: string; // Gradient background for the face card
  borderGlow: string; // Glow color for 3D edges
  description: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface TestScenarioItem {
  id: string;
  scenario: string;
  passed: boolean;
}

export interface DeveloperFaceData {
  technicalApproach: string;
  gitBranch: string;
  pullRequestUrl?: string;
  techStack: string[];
  checklist: ChecklistItem[];
  apiEndpoints: string[];
  complexityEstimate?: 'T-Shirt S' | 'T-Shirt M' | 'T-Shirt L' | 'T-Shirt XL';
  codeNotes?: string;
}

export interface TeamLeadFaceData {
  sprintGoalAlignment: string;
  goalConfidence: number; // 0 - 100%
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskMitigation: string;
  dependencies: string[]; // ticket keys this depends on
  blocks: string[]; // ticket keys this blocks
  architecturalSignoff: boolean;
  leadNotes?: string;
}

export interface ManagerOkrFaceData {
  okrAlignment: string;
  okrCategory: string;
  strategicPillar: 'Market Growth' | 'Operational Resilience' | 'Developer Experience' | 'Enterprise Security';
  estimatedBusinessValue: string;
  targetMilestone: string;
  customerImpactScore: number; // 1 - 10
  managerNotes?: string;
}

export interface QaFaceData {
  testScenarios: TestScenarioItem[];
  automatedCoverageTarget: number; // 0 - 100%
  regressionRisk: 'negligible' | 'low' | 'moderate' | 'high';
  qaSignoff: 'untested' | 'in_testing' | 'passed' | 'blocked';
  qaNotes?: string;
}

export interface CustomFieldItem {
  id: string;
  label: string;
  type: 'text' | 'select' | 'checklist' | 'metric';
  value: any;
}

export interface CustomFaceData {
  title: string;
  summary: string;
  fields: CustomFieldItem[];
}

export interface TicketFaceData {
  developer?: DeveloperFaceData;
  lead?: TeamLeadFaceData;
  manager?: ManagerOkrFaceData;
  qa?: QaFaceData;
  custom?: Record<string, CustomFaceData>;
}

export interface User {
  id: string;
  name: string;
  role: 'developer' | 'lead' | 'manager' | 'qa' | 'design';
  roleTitle: string;
  avatar: string;
  email: string;
}

export interface TicketComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  faceId: string; // On which face the comment was left
  faceName: string;
  content: string;
  createdAt: string;
}

export type TimeDisplayMode = 'time' | 'points';

export interface WorklogEntry {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  hours: number;
  date: string;
  note?: string;
}

export interface TaskTimeTracking {
  originalEstimateHours: number; // e.g. 16h
  timeSpentHours: number;        // e.g. 10h
  remainingHours: number;        // e.g. 6h
  startDate?: string;
  dueDate?: string;
  cycleTimeDays?: number;        // Active in-progress time
  leadTimeDays?: number;         // Total time since creation
  worklogs?: WorklogEntry[];
  timerRunning?: boolean;
  timerStartedAt?: number;
}

export interface Ticket {
  id: string;
  key: string; // e.g. "PRISM-101"
  title: string;
  summary: string;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  storyPoints: number;
  sprintId: string;
  assigneeId: string;
  reporterId: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  
  // 3D Geometry configuration for this specific ticket (inherits project default if not overridden)
  perspectives: SidePerspective[]; // Defines the active sides & their order
  faces: TicketFaceData; // Data corresponding to each perspective
  activeFaceIndex: number; // Currently focused face (0 to perspectives.length - 1)
  
  // Top View: Time & Duration / Story Points representation
  timeTracking?: TaskTimeTracking;

  comments: TicketComment[];
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'planned' | 'completed';
  totalPoints: number;
  completedPoints: number;
}

export interface OkrGoal {
  id: string;
  code: string; // e.g., "OKR-1"
  pillar: string;
  title: string;
  targetMetric: string;
  currentProgress: number; // 0 - 100
  quarter: string; // e.g., "Q3 2026"
  owner: string;
}

export interface BoardFilter {
  search: string;
  assigneeId: string | 'all';
  priority: string | 'all';
  type: string | 'all';
  riskLevel: string | 'all';
}
