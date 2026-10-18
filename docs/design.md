# design.md — UI/UX & Design System

## 1. Direction
[P] Clean, calm, modern. Light theme default; dark theme [Could]. Board is the hero.

## 2. Colors (Tailwind-friendly) [P]
| Token | Value | Use |
|-------|-------|-----|
| bg | `#F8FAFC` (slate-50) | Page |
| surface | `#FFFFFF` | Cards |
| text | `#0F172A` (slate-900) | Body |
| muted | `#64748B` (slate-500) | Secondary |
| primary | `#4F46E5` (indigo-600) | Buttons, active |
| danger | `#DC2626` (red-600) | Check, destructive |
| success | `#16A34A` (green-600) | Win banner |
| board-light | `#EEEED2` | Light squares |
| board-dark | `#769656` | Dark squares |
| highlight | `rgba(250, 204, 21, 0.5)` | Last move / selected |

## 3. Typography [P]
- System font stack (`Inter` optional if time allows).
- Title 24–28px semibold; status 18px medium; history 14px mono (tabular numbers).

## 4. Layout & Responsive Rules
| Breakpoint | Layout |
|------------|--------|
| < 640px | Single column: status, board (full width minus 16px padding), controls, history |
| 640–1023px | Single column, board max 560px centered |
| ≥ 1024px | Two columns: board (max 640px) left, sidebar (history + controls) right |
- Board is always square (`aspect-square`), width = `min(100%, 640px)`.
- Touch targets ≥ 44px.

## 5. Components
- **StatusBar:** colored dot + text for turn; check/result uses text + icon.
- **MoveHistory:** two-column rows (White | Black), fixed height, scrollable, latest move highlighted, auto-scroll.
- **Buttons:** primary (filled indigo), secondary (outline), destructive (red) in modal.
- **Modal:** centered, focus trapped, Esc closes (cancel).
- **Game over banner:** above board, success/neutral color.

## 6. Accessibility (NFR-004)
- Never rely on color alone for check/result.
- `aria-live="polite"` on status.
- Visible focus rings on all buttons.
- Contrast ≥ 4.5:1 for text.

## 7. Out of scope [P]
Animations beyond library defaults, themes/piece sets, sound.