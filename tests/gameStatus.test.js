import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';
import { getGameStatus } from '../src/lib/gameStatus';

describe('lib/gameStatus.js derivation (FR-003, FR-005, TASK-005)', () => {
  it('returns active status for standard start position', () => {
    const chess = new Chess();
    const status = getGameStatus(chess);
    expect(status.turn).toBe('w');
    expect(status.turnName).toBe('White');
    expect(status.inCheck).toBe(false);
    expect(status.isGameOver).toBe(false);
    expect(status.isCheckmate).toBe(false);
    expect(status.isDraw).toBe(false);
    expect(status.message).toBe('White to move');
    expect(status.type).toBe('in_progress');
  });

  it('detects in-check condition without checkmate', () => {
    // 1. e4 e5 2. Qh5 Ke7 3. Qxe5# is mate, but 1. e4 d5 2. Bb5+ is check
    const chess = new Chess();
    chess.move({ from: 'e2', to: 'e4' });
    chess.move({ from: 'd7', to: 'd5' });
    chess.move({ from: 'f1', to: 'b5' }); // 2. Bb5+
    expect(chess.inCheck()).toBe(true);
    expect(chess.isCheckmate()).toBe(false);

    const status = getGameStatus(chess);
    expect(status.inCheck).toBe(true);
    expect(status.isGameOver).toBe(false);
    expect(status.turn).toBe('b');
    expect(status.turnName).toBe('Black');
    expect(status.message).toBe('Check — Black to move');
    expect(status.type).toBe('check');
  });

  it("detects checkmate correctly with Black winning (Fool's Mate)", () => {
    const chess = new Chess();
    chess.move({ from: 'f2', to: 'f3' });
    chess.move({ from: 'e7', to: 'e5' });
    chess.move({ from: 'g2', to: 'g4' });
    chess.move({ from: 'd8', to: 'h4' }); // 2... Qh4#

    expect(chess.isCheckmate()).toBe(true);
    const status = getGameStatus(chess);
    expect(status.isCheckmate).toBe(true);
    expect(status.isGameOver).toBe(true);
    expect(status.winner).toBe('Black');
    expect(status.message).toBe('Checkmate — Black wins');
    expect(status.type).toBe('checkmate');
  });

  it("detects checkmate correctly with White winning (Scholar's Mate)", () => {
    const chess = new Chess();
    chess.move({ from: 'e2', to: 'e4' });
    chess.move({ from: 'e7', to: 'e5' });
    chess.move({ from: 'f1', to: 'c4' });
    chess.move({ from: 'b8', to: 'c6' });
    chess.move({ from: 'd1', to: 'h5' });
    chess.move({ from: 'g8', to: 'f6' });
    chess.move({ from: 'h5', to: 'f7' }); // 4. Qxf7#

    expect(chess.isCheckmate()).toBe(true);
    const status = getGameStatus(chess);
    expect(status.isCheckmate).toBe(true);
    expect(status.isGameOver).toBe(true);
    expect(status.winner).toBe('White');
    expect(status.message).toBe('Checkmate — White wins');
    expect(status.type).toBe('checkmate');
  });

  it('detects stalemate draw', () => {
    // Known stalemate position: Black king on e8, White pawn on e7, White king on e6, Black to move
    const chess = new Chess('4k3/4P3/4K3/8/8/8/8/8 b - - 0 1');
    expect(chess.isStalemate()).toBe(true);

    const status = getGameStatus(chess);
    expect(status.isGameOver).toBe(true);
    expect(status.isStalemate).toBe(true);
    expect(status.isDraw).toBe(true);
    expect(status.drawReason).toBe('stalemate');
    expect(status.message).toBe('Draw — stalemate');
    expect(status.type).toBe('draw');
  });

  it('detects insufficient material draw (King vs King)', () => {
    const chess = new Chess('4k3/8/8/8/8/8/8/4K3 w - - 0 1');
    expect(chess.isInsufficientMaterial()).toBe(true);

    const status = getGameStatus(chess);
    expect(status.isGameOver).toBe(true);
    expect(status.isDraw).toBe(true);
    expect(status.drawReason).toBe('insufficient material');
    expect(status.message).toBe('Draw — insufficient material');
    expect(status.type).toBe('draw');
  });

  it('detects threefold repetition draw', () => {
    const chess = new Chess();
    // 1. Nf3 Nf6 2. Ng1 Ng8 3. Nf3 Nf6 4. Ng1 Ng8
    const moves = [
      ['g1', 'f3'], ['g8', 'f6'],
      ['f3', 'g1'], ['f6', 'g8'],
      ['g1', 'f3'], ['g8', 'f6'],
      ['f3', 'g1'], ['f6', 'g8'],
    ];
    for (const [from, to] of moves) {
      chess.move({ from, to });
    }
    expect(chess.isThreefoldRepetition()).toBe(true);

    const status = getGameStatus(chess);
    expect(status.isGameOver).toBe(true);
    expect(status.isDraw).toBe(true);
    expect(status.drawReason).toBe('threefold repetition');
    expect(status.message).toBe('Draw — threefold repetition');
    expect(status.type).toBe('draw');
  });

  it('detects fifty-move rule draw', () => {
    const chess = new Chess('8/5k2/8/8/8/8/1R6/4K3 w - - 100 1');
    expect(chess.isDrawByFiftyMoves()).toBe(true);

    const status = getGameStatus(chess);
    expect(status.isGameOver).toBe(true);
    expect(status.isDraw).toBe(true);
    expect(status.drawReason).toBe('fifty-move rule');
    expect(status.message).toBe('Draw — fifty-move rule');
    expect(status.type).toBe('draw');
  });

  it('handles null or invalid chess instance safely (RULE-011)', () => {
    const status = getGameStatus(null);
    expect(status.turn).toBe('w');
    expect(status.message).toBe('White to move');
    expect(status.isGameOver).toBe(false);
  });
});
