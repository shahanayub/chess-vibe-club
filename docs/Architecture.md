# Architecture.md — System Architecture

## 1. Style
[C] Client-only SPA. [P] One page, small component tree, one custom hook owning game logic.

## 2. Component Diagram
```
┌──────────────────────────── Browser ────────────────────────────┐
│  main.jsx → App.jsx                                              │
│                │ uses                                            │
│                ▼                                                 │
│        useChessGame (hook)  ◄──────► lib/storage.js ◄──► localStorage
│        - pgn state                    (get/set/clear)            │
│        - derived Chess (chess.js)                                │
│        - makeMove / undo / newGame / flip                        │
│                │ props                                           │
│     ┌──────────┼───────────┬───────────────┐                    │
│     ▼          ▼           ▼               ▼                    │
│  BoardPanel  StatusBar  MoveHistory   Controls (+ ConfirmModal) │
│ (react-chessboard) (turn/check/result) (SAN list)  (New/Undo/Flip)│
└──────────────────────────────────────────────────────────────────┘
```

## 3. Responsibilities
| Unit | Responsibility | Reqs |
|------|----------------|------|
| `useChessGame` | State, move validation via chess.js, undo, new game, persistence calls | FR-002,003,005,007,008 |
| `BoardPanel` | Render board, forward drops/clicks, promotion UI | FR-001,002,009,010 |
| `StatusBar` | Turn indicator, check/mate/draw messages | FR-003,005 |
| `MoveHistory` | SAN list grouped by move number, auto-scroll | FR-004 |
| `Controls` | New Game, Undo, Flip buttons | FR-006,007,010 |
| `ConfirmModal` | Confirm destructive action | FR-006 |
| `CapturedPieces` [P, Should] | Captured material | FR-011 |
| `GameArchive` [P, Could] | Finished-game list | FR-012 |
| `lib/storage.js` | Safe LocalStorage wrapper, schema versioning | NFR-005 |
| `lib/gameStatus.js` | Pure function: Chess → status object | FR-005 |
| `lib/history.js` | Pure function: SAN array → rows | FR-004 |

## 4. Data Flow
1. User drops piece → `BoardPanel.onDrop` → `makeMove(from,to,promo)`.
2. Hook tries move on a copy; if legal, updates `pgn` state; if not, returns false (piece snaps back).
3. Re-render derives turn, status, history from the new PGN.
4. `useEffect` writes PGN to LocalStorage.

## 5. Folder Structure [P]
```
chess-app/
├─ docs/                 # the 8 .md files
├─ public/
├─ src/
│  ├─ components/
│  │  ├─ BoardPanel.jsx
│  │  ├─ StatusBar.jsx
│  │  ├─ MoveHistory.jsx
│  │  ├─ Controls.jsx
│  │  ├─ ConfirmModal.jsx
│  │  ├─ CapturedPieces.jsx     # Should
│  │  └─ GameArchive.jsx        # Could
│  ├─ hooks/useChessGame.js
│  ├─ lib/{storage,gameStatus,history}.js
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css                 # Tailwind directives
├─ tests/
├─ index.html
├─ package.json
├─ vite.config.js
├─ tailwind.config.js (if required by installed Tailwind version)
└─ README.md
```

## 6. Deployment [U]
Static build (`npm run build` → `dist/`). Target undecided.