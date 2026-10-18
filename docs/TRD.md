# TRD.md — Technical Requirements Document

## 1. Stack
| Layer | Choice | Label |
|-------|--------|-------|
| Build | Vite + React (JavaScript) | C (JS vs TS: P → JS for speed) |
| Styling | Tailwind CSS | C |
| Board UI | react-chessboard | C |
| Rules engine | chess.js (v1.x) | C |
| Persistence | window.localStorage | C |
| Hosting | Static (GitHub Pages / Vercel) | U |

## 2. Technical Requirements
- TR-001 [C]: No backend; all logic runs in the browser. (NFR-001)
- TR-002 [P]: Single source of truth = a PGN string in React state; `Chess` instance is derived (`useMemo`) by loading that PGN. Keeps undo/persist trivial.
- TR-003 [C]: All move legality comes from chess.js; UI never re-implements rules. (FR-002)
- TR-004 [P]: Status derived from chess.js: `isCheckmate`, `isStalemate`, `isThreefoldRepetition`, `isInsufficientMaterial`, `isDraw`, `inCheck`. (FR-005)
- TR-005 [P]: Save to LocalStorage in a `useEffect` on PGN change; load once at startup inside try/catch. (FR-008, NFR-005)
- TR-006 [P]: Promotion handled via react-chessboard promotion callback; chess.js called with `promotion` field. (FR-009)
- TR-007 [P]: Undo = drop last move from history (`undo()` on a fresh instance, then store new PGN). (FR-007)
- TR-008 [P]: Storage access isolated in `lib/storage.js` (get/set/clear, schema version check).
- TR-009 [I]: Node 18+; npm as package manager.

## 3. Key API Notes (chess.js v1)
- `new Chess()`, `.loadPgn(pgn)`, `.pgn()`, `.history()` (SAN), `.move({from,to,promotion})` throws on illegal move, `.undo()`, `.turn()` returns `'w'|'b'`, `.fen()`.
- [U] react-chessboard's props changed between major versions. Pin the installed version and read its README before wiring the board (see Rules.md RULE-009).

## 4. Testing
- [P] Vitest for pure logic (storage, status derivation, history grouping). Manual checklist for UI gates in phases.md.
- [P] Test fixtures: Fool's Mate (checkmate), a known stalemate FEN, a promotion position.

## 5. Browser Support
- [I] Latest Chrome, Firefox, Safari, Edge; mobile Chrome/Safari.