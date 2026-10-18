import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';

describe('Environment smoke test', () => {
  it('instantiates chess.js correctly', () => {
    const chess = new Chess();
    expect(chess.turn()).toBe('w');
    expect(chess.isGameOver()).toBe(false);
  });
});
