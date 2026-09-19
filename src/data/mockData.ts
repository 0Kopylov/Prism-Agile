import { 
  SidePerspective, 
  User, 
  Sprint, 
  OkrGoal, 
  Ticket 
} from '../types';

export const DEFAULT_PERSPECTIVES: SidePerspective[] = [
  {
    id: 'developer',
    name: 'Developer Spec',
    shortLabel: 'DEV',
    roleType: 'developer',
    icon: 'Code2',
    color: '#38bdf8', // sky-400
    bgGradient: 'from-sky-950/90 via-slate-900/95 to-slate-950/95',
    borderGlow: 'border-sky-500/40 shadow-sky-500/20',
    description: 'Technical architecture, execution notes, checklists & API contracts.'
  },
  {
    id: 'lead',
    name: 'Team Lead & Goals',
    shortLabel: 'LEAD',
    roleType: 'lead',
    icon: 'Compass',
    color: '#a855f7', // purple-500
    bgGradient: 'from-purple-950/90 via-slate-900/95 to-slate-950/95',
    borderGlow: 'border-purple-500/40 shadow-purple-500/20',
    description: 'Sprint goal alignment, risk assessment, blockers, and architecture sign-off.'
  },
  {
    id: 'manager',
    name: 'Manager & OKRs',
    shortLabel: 'OKR',
    roleType: 'manager',
    icon: 'TrendingUp',
    color: '#10b981', // emerald-500
    bgGradient: 'from-emerald-950/90 via-slate-900/95 to-slate-950/95',
    borderGlow: 'border-emerald-500/40 shadow-emerald-500/20',
    description: 'Alignment with department OKRs, business ROI, customer impact & quarterly deliverables.'
  },
  {
    id: 'qa',
    name: 'QA & Quality Gate',
    shortLabel: 'QA',
    roleType: 'qa',
    icon: 'ShieldCheck',
    color: '#f59e0b', // amber-500
    bgGradient: 'from-amber-950/90 via-slate-900/95 to-slate-950/95',
    borderGlow: 'border-amber-500/40 shadow-amber-500/20',
    description: 'Test scenarios, coverage targets, regression risk & quality sign-off.'
  },
  {
    id: 'product',
    name: 'Product & UX',
    shortLabel: 'PROD',
    roleType: 'design',
    icon: 'Sparkles',
    color: '#ec4899', // pink-500
    bgGradient: 'from-pink-950/90 via-slate-900/95 to-slate-950/95',
    borderGlow: 'border-pink-500/40 shadow-pink-500/20',
    description: 'User personas, problem statement, Figma designs & customer feedback.'
  }
];

export const USERS: User[] = [
  {
    id: 'u-1',
    name: 'Alex Chen',
    role: 'developer',
    roleTitle: 'Senior Distributed Systems Engineer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
    email: 'alex.chen@prism.internal'
  },
  {
    id: 'u-2',
    name: 'Sarah Jenkins',
    role: 'lead',
    roleTitle: 'Engineering Lead & Scrum Master',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    email: 'sarah.jenkins@prism.internal'
  },
  {
    id: 'u-3',
    name: 'Marcus Vance',
    role: 'manager',
    roleTitle: 'VP of Product & Strategic Eng.',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80',
    email: 'marcus.vance@prism.internal'
  },
  {
    id: 'u-4',
    name: 'Priya Patel',
    role: 'qa',
    roleTitle: 'Staff Quality & Automation Lead',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80',
    email: 'priya.patel@prism.internal'
  },
  {
    id: 'u-5',
    name: 'Jordan Blake',
    role: 'design',
    roleTitle: 'Principal Product Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    email: 'jordan.blake@prism.internal'
  }
];

export const SPRINTS: Sprint[] = [
  {
    id: 'sprint-42',
    name: 'Sprint 42: Core Streaming & Resilience',
    goal: 'Deliver sub-10ms event pipeline and meet Q3 Enterprise OKR for 99.999% availability.',
    startDate: '2026-08-28',
    endDate: '2026-09-11',
    status: 'active',
    totalPoints: 34,
    completedPoints: 13
  },
  {
    id: 'sprint-43',
    name: 'Sprint 43: Multi-Region Failover & SLA',
    goal: 'Deploy cross-region active-active cluster replication and automated failover tests.',
    startDate: '2026-09-12',
    endDate: '2026-09-26',
    status: 'planned',
    totalPoints: 28,
    completedPoints: 0
  },
  {
    id: 'sprint-41',
    name: 'Sprint 41: Auth Mesh & Zero-Trust',
    goal: 'Ship SAML 2.0 / Okta integration and automated token bucket rate-limiting.',
    startDate: '2026-08-14',
    endDate: '2026-08-27',
    status: 'completed',
    totalPoints: 32,
    completedPoints: 32
  }
];

export const OKR_GOALS: OkrGoal[] = [
  {
    id: 'okr-1',
    code: 'OKR-1',
    pillar: 'Operational Resilience',
    title: 'Achieve 99.999% Service Level Availability for Enterprise Tier',
    targetMetric: 'Unplanned downtime < 2.6 mins / quarter',
    currentProgress: 78,
    quarter: 'Q3 2026',
    owner: 'Marcus Vance'
  },
  {
    id: 'okr-2',
    code: 'OKR-2',
    pillar: 'Market Growth',
    title: 'Accelerate Enterprise Pipeline through Real-time Workspace Collaboration',
    targetMetric: '+35% Enterprise contract win rate',
    currentProgress: 64,
    quarter: 'Q3 2026',
    owner: 'Marcus Vance'
  },
  {
    id: 'okr-3',
    code: 'OKR-3',
    pillar: 'Developer Experience',
    title: 'Cut Microservice P99 Latency below 15ms under 500k Concurrent Conns',
    targetMetric: 'P99 latency <= 12ms at 500k rps',
    currentProgress: 82,
    quarter: 'Q3 2026',
    owner: 'Sarah Jenkins'
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 't-101',
    key: 'PRISM-101',
    title: 'Real-time WebSocket event multiplexer for multi-user canvas',
    summary: 'Multiplex client socket channels over Redis pub/sub to synchronize 3D perspective updates across teammates.',
    type: 'story',
    status: 'in_progress',
    priority: 'highest',
    storyPoints: 8,
    sprintId: 'sprint-42',
    assigneeId: 'u-1', // Alex
    reporterId: 'u-2', // Sarah
    createdAt: '2026-08-29',
    updatedAt: '2026-09-02',
    tags: ['realtime', 'websockets', 'redis', '3d-engine'],
    perspectives: DEFAULT_PERSPECTIVES.slice(0, 4), // 4-sided prism (DEV, LEAD, OKR, QA)
    activeFaceIndex: 0,
    faces: {
      developer: {
        technicalApproach: 'Deploy socket connection gateway using epoll-driven worker pool with bidirectional delta compression.',
        gitBranch: 'feat/prism-101-multiplex-redis-stream',
        pullRequestUrl: 'https://github.com/prism-agile/core-engine/pull/482',
        techStack: ['TypeScript', 'Redis Streams', 'WebSockets', 'Worker Threads'],
        checklist: [
          { id: 'c1', text: 'Implement heartbeat ping/pong protocol', done: true },
          { id: 'c2', text: 'Redis cluster failover reconnect handler', done: true },
          { id: 'c3', text: 'Binary payload serialization with Protobuf', done: false },
          { id: 'c4', text: 'Benchmark 100k simulated peers load test', done: false }
        ],
        apiEndpoints: ['WSS /api/v2/stream/perspectives', 'POST /api/v2/sync/presence'],
        complexityEstimate: 'T-Shirt L',
        codeNotes: 'Ensure backpressure buffers do not exceed 2MB per client connection.'
      },
      lead: {
        sprintGoalAlignment: 'Critical path item for Sprint 42 streaming milestone. Directly unlocks concurrent peer editing.',
        goalConfidence: 92,
        riskLevel: 'high',
        riskMitigation: 'Fallback to HTTP long-polling if corporate proxy blocks WSS upgrades.',
        dependencies: [],
        blocks: ['PRISM-104'],
        architecturalSignoff: true,
        leadNotes: 'Sarah: Reviewed architecture on Monday. Memory footprint looks within 120MB per container.'
      },
      manager: {
        okrAlignment: 'Directly supports OKR-3 (Sub-15ms microservice latency) and OKR-2 (Enterprise collaboration).',
        okrCategory: 'Core Enterprise Feature',
        strategicPillar: 'Operational Resilience',
        estimatedBusinessValue: '$240k ARR Tier Unlocked',
        targetMilestone: 'GA Launch v2.4 (September)',
        customerImpactScore: 9,
        managerNotes: 'Essential demo for upcoming Fortune 500 strategic design partnership evaluation.'
      },
      qa: {
        testScenarios: [
          { id: 'q1', scenario: 'Simulate packet loss up to 15% and verify reconnect jitter', passed: true },
          { id: 'q2', scenario: 'Rapid reconnect flood (500 connections / sec)', passed: false },
          { id: 'q3', scenario: 'Graceful shutdown draining in-flight messages', passed: true }
        ],
        automatedCoverageTarget: 90,
        regressionRisk: 'moderate',
        qaSignoff: 'in_testing',
        qaNotes: 'Load testing harness configured in k6. Staging verification underway.'
      }
    },
    comments: [
      {
        id: 'cm-1',
        userId: 'u-2',
        userName: 'Sarah Jenkins',
        userAvatar: USERS[1].avatar,
        faceId: 'lead',
        faceName: 'Team Lead',
        content: 'Alex, keep an eye on connection churn during container rolling updates.',
        createdAt: '2026-08-30 14:22'
      },
      {
        id: 'cm-2',
        userId: 'u-3',
        userName: 'Marcus Vance',
        userAvatar: USERS[2].avatar,
        faceId: 'manager',
        faceName: 'Manager & OKRs',
        content: 'This is the headline capability for our executive customer review next Tuesday.',
        createdAt: '2026-09-01 09:15'
      }
    ]
  },
  {
    id: 't-102',
    key: 'PRISM-102',
    title: 'Zero-downtime database schema migration runner for PostgreSQL 16',
    summary: 'Automate lock-free table alterations, concurrent index creation, and backwards-compatible shadow columns.',
    type: 'task',
    status: 'review',
    priority: 'high',
    storyPoints: 5,
    sprintId: 'sprint-42',
    assigneeId: 'u-1', // Alex
    reporterId: 'u-2', // Sarah
    createdAt: '2026-08-28',
    updatedAt: '2026-09-01',
    tags: ['database', 'postgres', 'migrations', 'devops'],
    perspectives: [DEFAULT_PERSPECTIVES[0], DEFAULT_PERSPECTIVES[1], DEFAULT_PERSPECTIVES[3]], // 3-sided prism (DEV, LEAD, QA)
    activeFaceIndex: 1, // Currently looking at Lead face
    faces: {
      developer: {
        technicalApproach: 'Use pg_repack inspired transactional shadow table swap with statement timeout safeguards.',
        gitBranch: 'feat/prism-102-pg-shadow-migrations',
        pullRequestUrl: 'https://github.com/prism-agile/core-engine/pull/479',
        techStack: ['PostgreSQL 16', 'Go / Node CLI', 'pgvector'],
        checklist: [
          { id: 'c10', text: 'Set lock_timeout = 2s to prevent table starvation', done: true },
          { id: 'c11', text: 'Concurrent index creation scripts', done: true },
          { id: 'c12', text: 'Automatic rollback validation in dry-run mode', done: true }
        ],
        apiEndpoints: ['CLI: prism-migrate --safe --shadow-verify'],
        complexityEstimate: 'T-Shirt M',
        codeNotes: 'PR is awaiting final peer review approval.'
      },
      lead: {
        sprintGoalAlignment: 'Guarantees zero-downtime during weekly sprint releases; reduces deployment maintenance window to zero.',
        goalConfidence: 98,
        riskLevel: 'medium',
        riskMitigation: 'Dry run execution against an automated shadow replica with 10M synthetic rows before prod swap.',
        dependencies: [],
        blocks: [],
        architecturalSignoff: true,
        leadNotes: 'Sarah: Approved with dry-run verification checklist requirement.'
      },
      manager: {
        okrAlignment: 'Protects OKR-1 (99.999% Uptime) by eliminating 15 minutes of monthly scheduled maintenance downtime.',
        okrCategory: 'Operational Excellence',
        strategicPillar: 'Operational Resilience',
        estimatedBusinessValue: 'Zero Maintenance Outages',
        targetMilestone: 'Sprint 42 Release',
        customerImpactScore: 8,
        managerNotes: 'Directly helps our Enterprise SLA commitment of 99.999%.'
      },
      qa: {
        testScenarios: [
          { id: 'q10', scenario: 'Concurrent heavy write traffic (2k writes/sec) during schema alter', passed: true },
          { id: 'q11', scenario: 'Induce artificial statement timeout and check transaction abort', passed: true }
        ],
        automatedCoverageTarget: 95,
        regressionRisk: 'low',
        qaSignoff: 'passed',
        qaNotes: 'Simulated 10M record table migration in staging with 0 dropped queries.'
      }
    },
    comments: []
  },
  {
    id: 't-103',
    key: 'PRISM-103',
    title: 'Dynamic perspective facet geometry editor (3-sided to 8-sided prisms)',
    summary: 'Allow agile teams to configure how many facets their 3D tickets possess and assign custom role points of view.',
    type: 'story',
    status: 'in_progress',
    priority: 'highest',
    storyPoints: 8,
    sprintId: 'sprint-42',
    assigneeId: 'u-5', // Jordan Blake
    reporterId: 'u-3', // Marcus
    createdAt: '2026-08-30',
    updatedAt: '2026-09-03',
    tags: ['ui', '3d', 'geometry', 'customization'],
    perspectives: DEFAULT_PERSPECTIVES, // 5-sided prism!
    activeFaceIndex: 0,
    faces: {
      developer: {
        technicalApproach: 'Dynamic apothem math: R = width / (2 * tan(180 / N)) with hardware-accelerated 3D CSS transform matrix.',
        gitBranch: 'feat/prism-103-n-gon-prism-engine',
        pullRequestUrl: 'https://github.com/prism-agile/core-engine/pull/485',
        techStack: ['React 19', 'Tailwind CSS v4', 'CSS 3D Preserves', 'Motion'],
        checklist: [
          { id: 'c20', text: 'Triangular prism (3 sides) math & lighting', done: true },
          { id: 'c21', text: 'Cuboid / Square prism (4 sides)', done: true },
          { id: 'c22', text: 'Pentagonal prism (5 sides)', done: true },
          { id: 'c23', text: 'Hexagonal & Octagonal prisms (6 & 8 sides)', done: true },
          { id: 'c24', text: 'Drag-to-spin touch and pointer event inertia', done: true }
        ],
        apiEndpoints: ['PUT /api/v1/projects/:id/perspective-config'],
        complexityEstimate: 'T-Shirt L',
        codeNotes: 'Math tested across arbitrary N >= 3.'
      },
      lead: {
        sprintGoalAlignment: 'Core architectural differentiator for the product. Demonstrates multi-view ticket inspection.',
        goalConfidence: 95,
        riskLevel: 'medium',
        riskMitigation: 'Ensure graceful fallback to 2D card view on low-tier mobile GPUs.',
        dependencies: [],
        blocks: [],
        architecturalSignoff: true,
        leadNotes: 'Sarah: The 3D animation test in staging runs smoothly at 60fps.'
      },
      manager: {
        okrAlignment: 'Crucial for OKR-2: Provides leadership and managers their own dedicated lens on every ticket.',
        okrCategory: 'Unique Value Proposition',
        strategicPillar: 'Developer Experience',
        estimatedBusinessValue: 'Flagship Feature Differentiator',
        targetMilestone: 'Sprint 42 Demo',
        customerImpactScore: 10,
        managerNotes: 'Every client we demoed this to loved seeing the Manager and OKR side on engineering stories.'
      },
      qa: {
        testScenarios: [
          { id: 'q20', scenario: 'Verify touch drag gesture responsiveness on mobile viewport', passed: true },
          { id: 'q21', scenario: 'Switching number of sides dynamically re-renders active faces without state loss', passed: true }
        ],
        automatedCoverageTarget: 88,
        regressionRisk: 'low',
        qaSignoff: 'in_testing',
        qaNotes: 'Visual regression snapshots captured for 3, 4, 5, 6, 8 faces.'
      }
    },
    comments: [
      {
        id: 'cm-3',
        userId: 'u-5',
        userName: 'Jordan Blake',
        userAvatar: USERS[4].avatar,
        faceId: 'product',
        faceName: 'Product & UX',
        content: 'Added micro-interactions and specular lighting on the facet edges for depth!',
        createdAt: '2026-09-02 16:40'
      }
    ]
  },
  {
    id: 't-104',
    key: 'PRISM-104',
    title: 'Executive OKR Alignment Matrix & Sprint Velocity roll-up',
    summary: 'Visual dashboard mapping 3D tickets across company strategic pillars and department quarterly targets.',
    type: 'story',
    status: 'todo',
    priority: 'high',
    storyPoints: 5,
    sprintId: 'sprint-42',
    assigneeId: 'u-3', // Marcus
    reporterId: 'u-3',
    createdAt: '2026-08-31',
    updatedAt: '2026-09-02',
    tags: ['okr', 'analytics', 'executive', 'reporting'],
    perspectives: [DEFAULT_PERSPECTIVES[0], DEFAULT_PERSPECTIVES[3]], // 2-sided dual slab (DEV, QA)
    activeFaceIndex: 0,
    faces: {
      developer: {
        technicalApproach: 'Aggregate sprint ticket faces via client-side memoized rollup with real-time grouping by OKR code.',
        gitBranch: 'feat/prism-104-okr-alignment-matrix',
        techStack: ['React 19', 'Recharts / SVG', 'Tailwind CSS'],
        checklist: [
          { id: 'c30', text: 'Aggregate total story points mapped to each OKR', done: true },
          { id: 'c31', text: 'Calculate risk-adjusted confidence score', done: false },
          { id: 'c32', text: 'Export executive alignment PDF / CSV summary', done: false }
        ],
        apiEndpoints: ['GET /api/v1/sprints/:id/okr-breakdown'],
        complexityEstimate: 'T-Shirt M'
      },
      lead: {
        sprintGoalAlignment: 'Gives the team visibility into which stories carry executive priority during standup grooming.',
        goalConfidence: 85,
        riskLevel: 'low',
        riskMitigation: 'Default unassigned stories to "Tech Debt / Foundation" bucket.',
        dependencies: ['PRISM-101'],
        blocks: [],
        architecturalSignoff: true
      },
      manager: {
        okrAlignment: 'Directly serves Marcus (VP of Product) for Board of Directors and executive reporting.',
        okrCategory: 'Strategic Alignment',
        strategicPillar: 'Market Growth',
        estimatedBusinessValue: 'Eliminates 6 hours/week of manual spreadsheet reporting',
        targetMilestone: 'Q3 Board Deck',
        customerImpactScore: 9,
        managerNotes: 'This is the exact view leadership has been asking for to track where engineering hours go.'
      },
      qa: {
        testScenarios: [
          { id: 'q30', scenario: 'Verify story point summation matches sprint total', passed: true },
          { id: 'q31', scenario: 'Filter by strategic pillar displays correct subset of 3D objects', passed: false }
        ],
        automatedCoverageTarget: 85,
        regressionRisk: 'low',
        qaSignoff: 'untested'
      }
    },
    comments: []
  },
  {
    id: 't-105',
    key: 'PRISM-105',
    title: 'Automated test flight gate & acceptance criteria verifier',
    summary: 'Interactive checklist on the QA side allowing testers to approve build verification tests directly from the 3D card.',
    type: 'task',
    status: 'qa',
    priority: 'medium',
    storyPoints: 3,
    sprintId: 'sprint-42',
    assigneeId: 'u-4', // Priya
    reporterId: 'u-4',
    createdAt: '2026-08-27',
    updatedAt: '2026-09-02',
    tags: ['qa', 'testing', 'automation', 'signoff'],
    perspectives: [DEFAULT_PERSPECTIVES[0]], // 1-sided monolith card (DEV)
    activeFaceIndex: 0,
    faces: {
      developer: {
        technicalApproach: 'GitHub Action webhooks push test results directly to the ticket QA facet.',
        gitBranch: 'feat/prism-105-ci-qa-webhook',
        techStack: ['GitHub Actions', 'Node.js', 'Playwright'],
        checklist: [
          { id: 'c40', text: 'Webhook listener endpoint with HMAC verification', done: true },
          { id: 'c41', text: 'Auto-update QA pass/fail status upon CI completion', done: true }
        ],
        apiEndpoints: ['POST /api/v1/webhooks/ci-runner'],
        complexityEstimate: 'T-Shirt S'
      },
      lead: {
        sprintGoalAlignment: 'Enforces definition of done before tickets can be dragged to the "Done" column.',
        goalConfidence: 95,
        riskLevel: 'low',
        riskMitigation: 'Manual override toggle available for scrum master with audit logging.',
        dependencies: [],
        blocks: [],
        architecturalSignoff: true
      },
      manager: {
        okrAlignment: 'Prevents regression bugs from reaching production tier, protecting OKR-1.',
        okrCategory: 'Quality Assurance',
        strategicPillar: 'Operational Resilience',
        estimatedBusinessValue: '90% reduction in production bug escapes',
        targetMilestone: 'Sprint 42 Release',
        customerImpactScore: 7
      },
      qa: {
        testScenarios: [
          { id: 'q40', scenario: 'All required test scenarios must pass before QA signoff badge turns green', passed: true },
          { id: 'q41', scenario: 'Webhook payload with failed Playwright spec flags ticket in red', passed: true }
        ],
        automatedCoverageTarget: 95,
        regressionRisk: 'negligible',
        qaSignoff: 'passed',
        qaNotes: 'Priya: Verified in staging with 20 simulated GitHub Action webhook pushes.'
      }
    },
    comments: []
  },
  {
    id: 't-106',
    key: 'PRISM-106',
    title: 'Distributed rate limiter with sliding window counter in Redis',
    summary: 'Protect API gateway against DDoS and noisy tenant spikes using memory-efficient Redis sliding logs.',
    type: 'story',
    status: 'done',
    priority: 'high',
    storyPoints: 5,
    sprintId: 'sprint-42',
    assigneeId: 'u-1', // Alex
    reporterId: 'u-2', // Sarah
    createdAt: '2026-08-25',
    updatedAt: '2026-08-30',
    tags: ['security', 'rate-limit', 'redis', 'gateway'],
    perspectives: DEFAULT_PERSPECTIVES.slice(0, 4),
    activeFaceIndex: 0,
    faces: {
      developer: {
        technicalApproach: 'Lua script executed atomically inside Redis with timestamp window zadd and zremrangebyscore.',
        gitBranch: 'feat/prism-106-sliding-window-rate-limit',
        pullRequestUrl: 'https://github.com/prism-agile/core-engine/pull/471',
        techStack: ['Redis', 'Lua', 'Express Gateway', 'Jest'],
        checklist: [
          { id: 'c50', text: 'Write atomic Lua script', done: true },
          { id: 'c51', text: 'X-RateLimit headers RFC compliance', done: true },
          { id: 'c52', text: 'Benchmark 50k requests / sec latency', done: true }
        ],
        apiEndpoints: ['Middleware: /api/v1/*'],
        complexityEstimate: 'T-Shirt M',
        codeNotes: 'Lua script execution latency is under 0.4ms.'
      },
      lead: {
        sprintGoalAlignment: 'Completed early in Sprint 42. Stabilized the API gateway during load spike tests.',
        goalConfidence: 100,
        riskLevel: 'low',
        riskMitigation: 'Fail-open policy in case of catastrophic Redis network partition.',
        dependencies: [],
        blocks: [],
        architecturalSignoff: true
      },
      manager: {
        okrAlignment: 'Protects OKR-1 (Uptime) by preventing noisy tenant starvation.',
        okrCategory: 'Platform Security',
        strategicPillar: 'Operational Resilience',
        estimatedBusinessValue: 'Contractual SLA compliance guarantee',
        targetMilestone: 'Sprint 42 Day 3',
        customerImpactScore: 8
      },
      qa: {
        testScenarios: [
          { id: 'q50', scenario: 'Send 101 requests within 60s when limit is 100; 101st returns 429 Too Many Requests', passed: true },
          { id: 'q51', scenario: 'Verify Retry-After header indicates correct wait window seconds', passed: true }
        ],
        automatedCoverageTarget: 95,
        regressionRisk: 'negligible',
        qaSignoff: 'passed'
      }
    },
    comments: []
  },
  {
    id: 't-107',
    key: 'PRISM-107',
    title: 'Global Perspective Lens: synchronous 3D board rotation',
    summary: 'Implement one-click perspective toggle on the sprint board to rotate every ticket prism to Developer, Lead, or Manager view simultaneously.',
    type: 'story',
    status: 'in_progress',
    priority: 'high',
    storyPoints: 5,
    sprintId: 'sprint-42',
    assigneeId: 'u-5', // Jordan
    reporterId: 'u-2', // Sarah
    createdAt: '2026-08-31',
    updatedAt: '2026-09-03',
    tags: ['3d-board', 'perspective-lens', 'orchestration', 'animation'],
    perspectives: DEFAULT_PERSPECTIVES.slice(0, 4),
    activeFaceIndex: 1,
    faces: {
      developer: {
        technicalApproach: 'Cascading CSS transform transition with staggered easing so all cards spin smoothly across columns.',
        gitBranch: 'feat/prism-107-synchronized-board-spin',
        techStack: ['CSS 3D', 'React 19', 'Motion'],
        checklist: [
          { id: 'c60', text: 'Global perspective context broadcast', done: true },
          { id: 'c61', text: 'Smooth 3D spring transition', done: true },
          { id: 'c62', text: 'Preserve individual card spin overrides when needed', done: true }
        ],
        apiEndpoints: [],
        complexityEstimate: 'T-Shirt M'
      },
      lead: {
        sprintGoalAlignment: 'Allows Sarah to run standups in Team Lead view, then Alex to run technical reviews in Developer view.',
        goalConfidence: 96,
        riskLevel: 'low',
        riskMitigation: 'Include keyboard shortcut (1-4) to switch views instantly.',
        dependencies: ['PRISM-103'],
        blocks: [],
        architecturalSignoff: true
      },
      manager: {
        okrAlignment: 'Allows leadership to view the whole board filtered by OKR alignment without losing sprint status.',
        okrCategory: 'User Experience',
        strategicPillar: 'Developer Experience',
        estimatedBusinessValue: 'Exceptional UX delight',
        targetMilestone: 'Sprint 42 Demo',
        customerImpactScore: 9
      },
      qa: {
        testScenarios: [
          { id: 'q60', scenario: 'Switching global perspective rotates all 10+ cards simultaneously with 60fps frame rate', passed: true }
        ],
        automatedCoverageTarget: 90,
        regressionRisk: 'low',
        qaSignoff: 'in_testing'
      }
    },
    comments: []
  },
  {
    id: 't-108',
    key: 'PRISM-108',
    title: 'Multi-region cross-cluster database replication with Raft consensus',
    summary: 'Evaluate CockroachDB and Aurora Global Database for multi-region failover tests in Sprint 43.',
    type: 'story',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 8,
    sprintId: 'sprint-43',
    assigneeId: 'u-1',
    reporterId: 'u-2',
    createdAt: '2026-09-01',
    updatedAt: '2026-09-02',
    tags: ['multi-region', 'consensus', 'raft', 'database'],
    perspectives: DEFAULT_PERSPECTIVES.slice(0, 4),
    activeFaceIndex: 0,
    faces: {
      developer: {
        technicalApproach: 'Benchmarking replication lag under simulated 80ms cross-Atlantic ping latency.',
        gitBranch: 'spike/prism-108-multi-region-raft',
        techStack: ['Raft', 'PostgreSQL', 'Go', 'Terraform'],
        checklist: [
          { id: 'c70', text: 'Deploy test cluster in us-east and eu-west', done: false },
          { id: 'c71', text: 'Simulate region network cut and measure election time', done: false }
        ],
        apiEndpoints: [],
        complexityEstimate: 'T-Shirt XL'
      },
      lead: {
        sprintGoalAlignment: 'Primary epic for upcoming Sprint 43.',
        goalConfidence: 80,
        riskLevel: 'high',
        riskMitigation: 'Run isolated synthetic workload spike before committing to architecture.',
        dependencies: ['PRISM-102'],
        blocks: [],
        architecturalSignoff: false
      },
      manager: {
        okrAlignment: 'Foundational for OKR-1: Guarantees business continuity even if an entire cloud region goes dark.',
        okrCategory: 'Disaster Recovery',
        strategicPillar: 'Operational Resilience',
        estimatedBusinessValue: 'Tier-1 Enterprise Requirement ($500k+ deals)',
        targetMilestone: 'Sprint 43 Deliverable',
        customerImpactScore: 9
      },
      qa: {
        testScenarios: [
          { id: 'q70', scenario: 'Simulate region failure and verify failover completes under 30 seconds', passed: false }
        ],
        automatedCoverageTarget: 90,
        regressionRisk: 'moderate',
        qaSignoff: 'untested'
      }
    },
    comments: []
  }
];
