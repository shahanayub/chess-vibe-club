# PRD.md — Product Requirements Document

## 1. Overview
- [C] Lightweight 2-player local (same device) chess web app.
- [C] Audience: students and casual players.
- [C] Goal: portfolio piece showing spec-driven development with AI.
- [C] Solo build, deadline Sunday evening.

## 2. Goals / Non-Goals
**Goals:** playable, correct chess; clear turn + move history; progress survives refresh.
**Non-Goals [C]:** backend, accounts, online multiplayer.
**Non-Goals [P]:** AI opponent, timers/clocks, sound, analysis engine.

## 3. Functional Requirements
| ID | Requirement | Priority | Label |
|----|-------------|----------|-------|
| FR-001 | Render an 8x8 board with the standard starting position | Must | C |
| FR-002 | Pieces move by drag-and-drop or click; only legal moves allowed (chess.js validates) | Must | C |
| FR-003 | Show whose turn it is (White/Black) at all times | Must | C |
| FR-004 | Move history list in SAN, grouped by move number | Must | C |
| FR-005 | Detect and display check, checkmate, stalemate, and draws (threefold, insufficient material, 50-move) | Must | I |
| FR-006 | "New Game" button with confirmation dialog | Must | I |
| FR-007 | "Undo" removes the last move | Must | P |
| FR-008 | Auto-save after every move; restore on page load | Must | C |
| FR-009 | Pawn promotion with piece choice | Must | I |
| FR-010 | Flip board orientation | Should | P |
| FR-011 | Captured pieces display | Should | P |
| FR-012 | Archive of last 10 finished games (view result + move list) | Could | P |

## 4. Non-Functional Requirements
| ID | Requirement | Label |
|----|-------------|-------|
| NFR-001 | Fully client-side; no network calls at runtime | C |
| NFR-002 | Responsive from 360px wide to desktop | I |
| NFR-003 | Initial load under 2s on broadband (production build) | P |
| NFR-004 | Basic accessibility: keyboard-focusable buttons, text status (not color-only), ARIA live region for status | P |
| NFR-005 | Corrupt/missing LocalStorage must not crash the app (fall back to new game) | I |
| NFR-006 | Deployable as a static site | P |

## 5. Acceptance Criteria (summary)
- AC-1 (FR-002): Illegal move snaps the piece back; no state change.
- AC-2 (FR-003/005): After each move, turn and status update immediately.
- AC-3 (FR-008): Refresh mid-game restores identical position, history, and turn.
- AC-4 (FR-009): Pawn reaching last rank prompts for Q/R/B/N.
- AC-5 (FR-007): Undo restores previous position and turn; disabled when history empty.

## 6. Unresolved
- [U] Final deploy target (GitHub Pages vs Vercel/Netlify) — see NFR-006.