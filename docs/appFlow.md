# appFlow.md — Application & User Flow

## 1. Screen Map [P]
Single page, no routing.
```
App
├─ Header (title)
├─ Main
│  ├─ BoardPanel + StatusBar (+ Captured, Should)
│  └─ Sidebar: MoveHistory + Controls
├─ ConfirmModal (New Game)
├─ PromotionPicker (inline/overlay, on demand)
└─ GameOverBanner (on result)
```
Mobile: stacked (status → board → controls → history).

## 2. Flows
**F-1 Start / Resume (FR-001, FR-008)**
1. App loads → read LocalStorage.
2. Valid saved game → restore. Missing/invalid → fresh game (NFR-005).

**F-2 Make a move (FR-002, 003, 004, 005)**
1. Select/drag piece → legal destination → board updates.
2. Turn flips; move appended to history; status re-evaluated; saved.
3. Illegal drop → piece snaps back, no change.

**F-3 Promotion (FR-009)**
1. Pawn reaches last rank → picker (Q/R/B/N) → move completes.
2. Cancel picker → move canceled, piece returns.

**F-4 Undo (FR-007)**
1. Click Undo → last move removed, turn reverts, saved. Disabled when no moves.

**F-5 New Game (FR-006)**
1. Click New Game → ConfirmModal ("Discard current game?").
2. Confirm → reset + clear save. Cancel → nothing. If game already over, skip confirm [P].

**F-6 Game over (FR-005)**
1. Checkmate/stalemate/draw → banner with result; further moves disabled; Undo and New Game still available.
2. [P, Could] Finished game added to archive (FR-012).

**F-7 Flip board (FR-010)** — toggles orientation; stored in saved state.

## 3. Validation Rules
| Case | Behavior |
|------|----------|
| Illegal move | Reject silently, snap back |
| Move after game over | Ignored |
| Wrong-color piece | Not draggable (`arePiecesDraggable`/equivalent per installed version) |
| Corrupt storage JSON | Caught, fresh game, optional small notice |
| Unknown schemaVersion | Treated as corrupt |

## 4. States
| State | UI |
|-------|----|
| Empty/new | Start position, "White to move", Undo disabled |
| In progress | Turn indicator, history, Undo enabled |
| Check | "Check!" text + highlight (not color-only) |
| Game over | Result banner, board locked |
| Storage error | Fresh game; non-blocking message |

## 5. Messages
- "White to move" / "Black to move"
- "Check — Black to move"
- "Checkmate — White wins"
- "Draw — stalemate | threefold repetition | insufficient material | fifty-move rule"