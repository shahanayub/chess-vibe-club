# phases.md — Implementation Roadmap & Verification Gates

Time budget [P] for a same-day finish. Cut from the bottom (Should/Could) if behind.

## Phase 0 — Docs & Repo (~30 min)
- **TASK-001** Create repo, add 8 docs under `/docs`, initial commit.
  - Gate: repo on GitHub, docs visible.

## Phase 1 — Scaffold (~30 min)
- **TASK-002** Vite + React + Tailwind setup; install react-chessboard + chess.js; folder structure from Architecture.md. (TR-001, RULE-009)
  - Gate: `npm run dev` shows page with Tailwind styling; no console errors.

## Phase 2 — Core Game (~90 min)
- **TASK-003** `useChessGame` hook + `BoardPanel` rendering start position. (FR-001)
  - Gate: board renders correctly, White starts.
- **TASK-004** Legal moves via chess.js, illegal snap-back, only side-to-move draggable. (FR-002)
  - Gate: play Fool's Mate; try illegal moves (king into check, wrong turn) → rejected.
- **TASK-005** `StatusBar` + `lib/gameStatus.js` (turn, check, mate, draws) + game-over lock. (FR-003, FR-005)
  - Gate: Vitest cases for checkmate, stalemate, insufficient material pass; manual turn/check display verified.
- **TASK-006** `MoveHistory` + `lib/history.js`. (FR-004)
  - Gate: SAN rows correct for 6+ moves incl. captures, castling, check marks.
- **TASK-007** Pawn promotion picker. (FR-009)
  - Gate: promote to each of Q/R/B/N in test position; cancel returns piece.

## Phase 3 — Controls & Persistence (~60 min)
- **TASK-008** `Controls` + `ConfirmModal`: New Game, Undo. (FR-006, FR-007)
  - Gate: Undo works to empty then disables; New Game confirms/cancels correctly.
- **TASK-009** `lib/storage.js` + auto-save/restore. (FR-008, NFR-005)
  - Gate: refresh mid-game restores position/turn/history; manually corrupt localStorage → app loads fresh game without crash; Vitest for storage passes.

## Phase 4 — Polish (~45 min)
- **TASK-010** Responsive layout + design tokens per design.md; a11y pass. (NFR-002, NFR-004)
  - Gate: usable at 360px, 768px, 1280px; keyboard focus visible; status announced.
- **TASK-011** Flip board (FR-010). *Should*
  - Gate: orientation toggles and persists.

## Phase 5 — Ship (~30 min)
- **TASK-012** README, production build, deploy (target [U]), final push. (NFR-003, NFR-006)
  - Gate: `npm run build` succeeds; deployed/preview URL works; GitHub has code + docs + README.

## Stretch (only if time remains)
- **TASK-013** Captured pieces (FR-011).
- **TASK-014** Finished-game archive (FR-012).

## Final QA Checklist
- [ ] Full game to checkmate, stalemate, and threefold repetition
- [ ] Castling, en passant, promotion all work
- [ ] Refresh at every state (start, mid-game, game over)
- [ ] Mobile viewport test
- [ ] No console errors/warnings
- [ ] Requirement coverage: every Must FR has a passing gate