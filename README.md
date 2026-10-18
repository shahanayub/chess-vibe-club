# Chess — 2-Player Local Web Application

A lightweight, robust 2-player local (same device) chess web application built with **React**, **Vite**, **Tailwind CSS**, **chess.js**, and **react-chessboard**.

Developed following strict **spec-driven engineering practices**, verifiable gates, full unit test coverage, and comprehensive accessibility (WCAG 2.1 AA tokens).

---

## ✨ Features

- **Standard 8×8 Chessboard**: Renders starting position with wood/forest green theme (`#EEEED2` / `#769656`).
- **Legal Move Enforcement**: Powered by `chess.js` — illegal moves snap back immediately; only the current side to move can drag pieces.
- **Turn & Game State Indicator**: Clear textual status and badges announcing turn, check warnings, checkmate winner, and 4 distinct draw conditions (stalemate, threefold repetition, insufficient material, 50-move rule).
- **Interactive Move History**: Standard Algebraic Notation (SAN) move list grouped by move number with active move highlight and auto-scroll.
- **Pawn Promotion Modal**: Prompts for Queen, Rook, Bishop, or Knight upon reaching the final rank, with cancellation support.
- **Controls & Safety Guard**: "New Game" with confirmation dialog to prevent accidental resets, "Undo" last move, and "Flip" board orientation.
- **LocalStorage Auto-Save & Recovery**: State automatically syncs on every move and restores on page reload; corrupted storage is gracefully handled without crashing.
- **Responsive & Accessible**: Seamlessly adapts from 360px mobile viewports to wide desktop monitors, with visible focus rings (`focus-visible:ring-2`), ARIA live regions, and screen reader announcements.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 (Functional Components & Hooks) |
| **Bundler & Tooling** | Vite |
| **Styling** | Tailwind CSS v3 |
| **Chess Engine** | chess.js v1.4 |
| **Board UI** | react-chessboard v5.12 |
| **Testing** | Vitest (39 unit tests) |
| **Persistence** | Browser `localStorage` (Schema v1) |

---

## 📖 Specifications & Architecture

All system design docs and requirements are located in [`docs/`](./docs/):

- [PRD.md](./docs/PRD.md) — Product Requirements Document (FR-001 to FR-012, NFR-001 to NFR-006)
- [TRD.md](./docs/TRD.md) — Technical Requirements Document
- [Architecture.md](./docs/Architecture.md) — Component hierarchy, data flow & hook contracts
- [Rules.md](./docs/Rules.md) — 17 binding engineering constraints (RULE-001 to RULE-017)
- [design.md](./docs/design.md) — UI design tokens, responsive breakpoints & a11y specifications
- [database.md](./docs/database.md) — LocalStorage schema & migration strategy
- [appFlow.md](./docs/appFlow.md) — Application state machine & user flow diagrams
- [phases.md](./docs/phases.md) — Phased implementation roadmap & verification gates

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24+)
- npm 9+

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd chess-vibe-engr

# Install dependencies
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Testing
```bash
# Run Vitest test suite once
npx vitest run

# Run Vitest in watch mode
npm test
```

### Production Build & Preview
```bash
# Build production bundle in dist/
npm run build

# Preview production build locally
npm run preview
```

---


## 📄 License
MIT
