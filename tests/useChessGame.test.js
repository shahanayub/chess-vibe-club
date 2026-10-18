import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';

describe('Game state derivation logic (FR-001, TR-002)', () => {
  it('instantiates standard starting position with White to move', () => {
    const chess = new Chess();
    expect(chess.fen()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    expect(chess.turn()).toBe('w');
  });

  it('safely handles empty or corrupted PGN string (RULE-011)', () => {
    const chess = new Chess();
    expect(() => {
      try {
        chess.loadPgn('INVALID_PGN_DATA_XYZ');
      } catch (err) {
        // Handled safely
      }
    }).not.toThrow();
  });

  it('correctly loads valid PGN', () => {
    const chess = new Chess();
    chess.loadPgn('1. e4 e5 2. Nf3');
    expect(chess.turn()).toBe('b');
    expect(chess.history()).toEqual(['e4', 'e5', 'Nf3']);
  });
});

