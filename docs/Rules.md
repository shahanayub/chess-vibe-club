# Rules.md — AI Development Rules

Rules for any AI assistant writing code for this project.

- **RULE-001 Scope:** Build only requirements in PRD.md. No new features, libraries, or backend without my approval.
- **RULE-002 Traceability:** Reference requirement/task IDs in commit messages (e.g., `feat: legal move handling (FR-002, TASK-004)`).
- **RULE-003 Rules engine:** All chess logic goes through chess.js. Never hand-write move validation, check detection, or draw logic.
- **RULE-004 State:** Single source of truth is the PGN string in `useChessGame`. No duplicated game state in components.
- **RULE-005 Structure:** Follow the folder structure in Architecture.md. Components are presentational; logic lives in the hook and `lib/`.
- **RULE-006 Storage:** Access LocalStorage only through `lib/storage.js`, always in try/catch, using key names from database.md.
- **RULE-007 Language/Style:** JavaScript (ES modules), functional components + hooks, no class components, no TypeScript unless approved.
- **RULE-008 Styling:** Tailwind utility classes only; no extra CSS frameworks; colors from design.md.
- **RULE-009 Library versions:** Before using react-chessboard, check the installed version's README/props. Do not guess its API from memory.
- **RULE-010 Dependencies:** Allowed: react, react-dom, vite, tailwindcss, react-chessboard, chess.js, vitest (dev). Anything else needs approval.
- **RULE-011 Errors:** Never let a thrown chess.js exception or JSON parse error crash the UI.
- **RULE-012 Accessibility:** Meet NFR-004 on every new UI element.
- **RULE-013 Tasks:** Work one TASK at a time in phases.md order; stop at each verification gate and report results.
- **RULE-014 Secrets:** None needed. Do not add API keys, analytics, or network calls (NFR-001).
- **RULE-015 Small changes:** Keep files under ~200 lines; no dead code or unused imports.
- **RULE-016 Docs sync:** If implementation requires a spec change, say so and update the relevant .md file instead of silently diverging.
- **RULE-017 README:** Keep README current (setup, run, build, live link, link to /docs).