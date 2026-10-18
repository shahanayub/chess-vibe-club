import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';
import { formatMoveHistory } from '../src/lib/history';

describe('lib/history.js move grouping (FR-004, TASK-006)', () => {
  it('returns empty array when no moves have been played', () => {
    expect(formatMoveHistory([])).toEqual([]);
    expect(formatMoveHistory(null)).toEqual([]);
    expect(formatMoveHistory(undefined)).toEqual([]);
  });

  it('correctly groups single (White only) move', () => {
    const rows = formatMoveHistory(['e4']);
    expect(rows).toEqual([
      { moveNumber: 1, white: 'e4', black: null },
    ]);
  });

  it('correctly groups full move pair', () => {
    const rows = formatMoveHistory(['e4', 'e5']);
    expect(rows).toEqual([
      { moveNumber: 1, white: 'e4', black: 'e5' },
    ]);
  });

  it('groups 6+ moves correctly including captures, castling, and check marks (TASK-006 Gate)', () => {
    const chess = new Chess();
    // 1. e4 e5
    chess.move('e4');
    chess.move('e5');
    // 2. Nf3 Nc6
    chess.move('Nf3');
    chess.move('Nc6');
    // 3. Bb5 a6
    chess.move('Bb5');
    chess.move('a6');
    // 4. Bxc6 dxc6 (captures)
    chess.move('Bxc6');
    chess.move('dxc6');
    // 5. O-O Bg4 (kingside castling)
    chess.move('O-O');
    chess.move('Bg4');
    // 6. h3 Bxf3 (capture)
    chess.move('h3');
    chess.move('Bxf3');
    // 7. Qxf3 Qf6 (capture)
    chess.move('Qxf3');
    chess.move('Qf6');
    // 8. Qb3 O-O-O (queenside castling)
    chess.move('Qb3');
    chess.move('O-O-O');
    // 9. d3 Bc5
    chess.move('d3');
    chess.move('Bc5');
    // 10. Be3 Bxe3 (capture)
    chess.move('Be3');
    chess.move('Bxe3');
    // 11. fxe3 Qg5 (capture)
    chess.move('fxe3');
    chess.move('Qg5');
    // 12. Qxf7 Qxe3+ (capture + check mark)
    chess.move('Qxf7');
    chess.move('Qxe3+');

    const history = chess.history();
    expect(history.length).toBe(24); // 12 full moves

    const rows = formatMoveHistory(history);
    expect(rows.length).toBe(12);

    // Row 1: Normal moves
    expect(rows[0]).toEqual({ moveNumber: 1, white: 'e4', black: 'e5' });

    // Row 4: Captures
    expect(rows[3]).toEqual({ moveNumber: 4, white: 'Bxc6', black: 'dxc6' });

    // Row 5: Kingside castling
    expect(rows[4].white).toBe('O-O');

    // Row 8: Queenside castling
    expect(rows[7].black).toBe('O-O-O');

    // Row 12: Check mark
    expect(rows[11].black).toBe('Qxe3+');
  });
});

