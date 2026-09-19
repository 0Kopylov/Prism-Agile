# Prism Agile 🔷

> **3D Multi-Perspective Project Management for Cross-Functional Engineering Teams**

Prism Agile reimagines software delivery by transforming flat, single-dimensional task tickets into **interactive 3D polyhedral objects**. Rather than cramming architectural diagrams, business justifications, and QA acceptance criteria into one chaotic description box, each ticket possesses distinct perspective facets for each role on your team.

---

## 🌟 Key Concepts

In traditional agile tools (like Jira or Linear), a ticket is a single flat text document where developers, managers, tech leads, and QA testers compete for space.

**Prism Agile treats every task as a 3D prism:**

* **Developer Face (Blue)**: Technical architecture, Git branch, pull request links, tech stack badges, complexity estimation, and engineering checklists.
* **Team Lead Face (Emerald)**: Sprint goal alignment, confidence rating (0–100%), architectural sign-off, risk assessment, and dependency tracking (*Blocks* / *Depends On*).
* **Product Manager & OKR Face (Purple)**: Strategic pillar alignment (Market Growth, Enterprise Security, Operational Resilience, Developer Experience), target milestones, customer impact scores, and business value metrics.
* **QA Quality Gate Face (Amber)**: Test scenarios with pass/fail verification, automated test coverage target, regression risk indicators, and QA sign-off states (*Untested*, *In Testing*, *Passed*, *Blocked*).
* **Top Face (Time & Estimation)**: Story points vs. remaining hours, live worklog stopwatch timer, time spent, cycle time, and lead time metrics.
* **Custom Perspectives**: Configurable facets tailored to your organization (e.g., Security, Compliance, UX Design, DevOps).

---

## 🚀 Features

### 1. Interactive 3D Polyhedral Tickets
* **Full 3D Rotation**: Freely spin, yaw, and inspect tickets in 3D space with smooth physics-based rotations and calculated polygon apothems.
* **Dynamic Geometries**: Tickets adapt their 3D shape based on the number of active perspectives:
  * 1 Side: Flat 3D Card
  * 2 Sides: Dual-Faced 3D Slab
  * 3 Sides: Triangular Prism
  * 4 Sides: Square Prism / Cube
  * 5 Sides: Pentagonal Prism
  * 6+ Sides: Hexagonal and Polygonal Prisms
* **Per-Ticket Perspective Checklist**: Mount or unmount any combination of perspectives per ticket. Quick presets include *Dev Only (1)*, *Dev + QA (2)*, *Dev + Lead + QA (3)*, *Agile Core 4*, or *All Available*.
* **Face Reordering**: Customize the rotational wrap order of facets around each 3D ticket.

### 2. Perspective-Synchronized Kanban Board
* **Global Lens Switcher**: Rotate every ticket on the active sprint board simultaneously to align the entire team during standups, backlog refinement, or sprint reviews.
* **Live Face Navigation**: Rotate individual cards directly from the board or flip to any perspective with a single click.
* **Dual Estimation Modes**: Toggle the board views between Story Points and Time-Spent / Remaining Hours.
* **Comprehensive Filtering**: Filter tickets by assignee, priority, ticket type, risk level, or text search.

### 3. Integrated Time Tracking & Worklogs
* **Interactive Stopwatch**: Start and stop real-time timers directly on ticket facets.
* **Worklog Journal**: Record time spent with date-stamped notes and author attribution.
* **Cycle & Lead Time**: Automated tracking of active in-progress duration and delivery speed.

### 4. Perspective Studio
* **Workspace Customization**: Create and customize perspective archetypes across your organization.
* **Visual Palette**: Configure custom accent colors, icons, border glows, and role archetypes.
* **Safe Synchronization**: Updates propagate across the workspace while preserving each ticket's unique configuration.

### 5. OKR Alignment & Sprint Backlog
* **Strategic Pillars**: Connect daily engineering tasks directly to high-level quarterly objectives.
* **Sprint Backlog**: Manage active, planned, and completed sprints with aggregate story point velocity.

---

## 🛠️ Tech Stack

* **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build System**: [Vite 6](https://vite.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations**: [Motion](https://motion.dev/)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure

```
├── index.html                   # HTML entry point with metadata
├── metadata.json                # Application metadata & capabilities
├── package.json                 # Project dependencies and npm scripts
├── vite.config.ts               # Vite configuration with Tailwind plugin
└── src/
    ├── App.tsx                  # Main application orchestrator & modal coordinator
    ├── main.tsx                 # Application bootstrap entry point
    ├── index.css                # Global stylesheet with Tailwind CSS v4 import
    ├── types/                   # Shared TypeScript interfaces & models
    │   └── index.ts             # Ticket, Perspective, TimeTracking, and OKR types
    ├── data/                    # Initial seed data and default perspectives
    │   └── mockData.ts          # Default users, sprints, OKRs, and 3D tickets
    ├── utils/                   # 3D Math & polygon calculation helpers
    │   └── geometry.ts          # Apothem, rotation angles, and prism projection
    └── components/
        ├── Navbar.tsx           # Global header, theme switcher, and view tabs
        ├── Board/               # Interactive Kanban board components
        │   └── SprintBoard.tsx  # Board with multi-perspective ticket cards
        ├── Backlog/             # Sprint backlog and planning view
        ├── OKR/                 # OKR & strategic goals alignment dashboard
        ├── Studio/              # Perspective Studio for defining team facets
        │   └── PerspectiveStudioView.tsx
        └── ThreeD/              # 3D geometry engine and modals
            ├── PolyhedralTicket.tsx     # 3D CSS transform rendering component
            ├── TicketInspectionModal.tsx# Deep inspector with rotational controls
            ├── CreateTicketModal.tsx    # New ticket modal with face checklist
            ├── TimeTrackingInspector.tsx# Stopwatch & worklog analytics
            └── faces/                   # Dedicated perspective facet views
                ├── DeveloperFace.tsx    # Technical architecture & Git data
                ├── TeamLeadFace.tsx     # Risk, dependencies, and sign-offs
                ├── ManagerFace.tsx      # Business value & OKR alignment
                ├── QAFace.tsx           # Test cases & QA sign-off status
                ├── CustomFace.tsx       # Dynamically rendered custom fields
                └── TopTimeFace.tsx      # Top cap time & story points facet
```

---

## 💻 Getting Started

### Prerequisites
* **Node.js** 18.x or higher (or Bun / pnpm)
* Modern web browser with CSS 3D Transform support (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd prism-agile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite dev server at `0.0.0.0:3000` |
| `npm run build` | Compiles the production bundle to `dist/` |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run preview` | Previews the production build locally |

---

## 🎮 3D Interaction Guide

* **Click & Drag on 3D Model**: Freely rotate the polyhedron around its vertical and horizontal axes.
* **Perspective Buttons (1 to N)**: Instantly snap the ticket to bring that specific perspective face directly to the front.
* **Auto-Rotate Toggle**: Enable continuous gentle rotation to review all facets in a presentation mode.
* **Global Perspective Bar**: Use the perspective tabs in the sprint board header to rotate all cards on the board in unison.
