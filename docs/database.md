# database.md — Database / Storage Design

## 1. Storage Model
[C] No database. Browser LocalStorage, client-side only.

## 2. Keys
| Key | Purpose | Reqs | Label |
|-----|---------|------|-------|
| `chess:v1:current` | Current in-progress or just-finished game | FR-008 | C |
| `chess:v1:archive` | Finished games, newest first, max 10 | FR-012 | P (Could) |

## 3. Schemas

### `chess:v1:current`
```json
{
  "schemaVersion": 1,
  "pgn": "1. e4 e5 2. Nf3",
  "orientation": "white",
  "updatedAt": "2026-10-18T14:30:00.000Z"
}
```
| Field | Type | Rules |
|-------|------|-------|
| schemaVersion | number | Must equal 1 |
| pgn | string | Loadable by chess.js; empty string = start position |
| orientation | "white" \| "black" | Default "white" |
| updatedAt | ISO string | Informational |

### `chess:v1:archive` [P, Could]
```json
[
  { "id": "uuid", "pgn": "...", "result": "1-0", "reason": "checkmate", "finishedAt": "ISO" }
]
```

## 4. Derived (not stored)
Turn, FEN, SAN history, check/checkmate/draw status, captured pieces — all recomputed from PGN.

## 5. Operations
| Op | Behavior |
|----|----------|
| Load | `getItem` → `JSON.parse` → validate schemaVersion + `loadPgn`; any failure → null |
| Save | `setItem` in try/catch (quota/private mode) |
| Clear | `removeItem('chess:v1:current')` on New Game |
| Archive add | Prepend, trim to 10 |

## 6. Constraints
- ~5 MB LocalStorage limit; data is a few KB.
- Data is per-browser, per-origin; no sync (accepted limitation).
- [U] Whether Undo after game over should remove the archived entry (default [P]: archive is written only when New Game is pressed on a finished game, avoiding the issue).