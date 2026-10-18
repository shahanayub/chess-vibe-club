import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';
import { isPromotionMove } from '../src/hooks/useChessGame';

describe('Pawn promotion handling (FR-009, TASK-007)', () => {
  function createPromotionHelper(initialFen) {
    const chess = new Chess(initialFen);
    let pgn = chess.pgn();
    let pendingPromotion = null;

    function getGame() {
      const c = new Chess();
      if (pgn) {
        c.loadPgn(pgn);
      } else {
        c.load(initialFen);
      }
      return c;
    }

    function makeMove(from, to, promotion) {
      const c = getGame();
      const legalMoves = c.moves({ verbose: true });
      const matchingMoves = legalMoves.filter(
        (m) => m.from === from && m.to === to
      );

      if (matchingMoves.length === 0) return false;

      const isPromo = matchingMoves.some((m) => Boolean(m.promotion));

      if (isPromo && !promotion) {
        pendingPromotion = { from, to, color: c.turn() };
        return false;
      }

      const moveConfig = {
        from,
        to,
        ...(isPromo ? { promotion: promotion || 'q' } : {}),
      };

      const result = c.move(moveConfig);
      if (!result) return false;

      pgn = c.pgn();
      pendingPromotion = null;
      return true;
    }

    function confirmPromotion(piece) {
      if (!pendingPromotion) return false;
      const { from, to } = pendingPromotion;
      return makeMove(from, to, piece);
    }

    function cancelPromotion() {
      pendingPromotion = null;
    }

    return {
      getGame,
      makeMove,
      confirmPromotion,
      cancelPromotion,
      getPendingPromotion: () => pendingPromotion,
    };
  }

  it('correctly identifies promotion moves via isPromotionMove helper', () => {
    const chess = new Chess('8/4P3/8/8/8/8/8/k6K w - - 0 1');
    expect(isPromotionMove(chess, 'e7', 'e8')).toBe(true);
    // Non-promotion move
    expect(isPromotionMove(chess, 'h1', 'g1')).toBe(false);
  });

  it('promotes White pawn to Queen (e8=Q)', () => {
    const helper = createPromotionHelper('8/4P3/8/8/8/8/8/k6K w - - 0 1');
    // Drop without piece choice stages pending promotion
    expect(helper.makeMove('e7', 'e8')).toBe(false);
    expect(helper.getPendingPromotion()).toEqual({
      from: 'e7',
      to: 'e8',
      color: 'w',
    });

    // Confirm Queen
    expect(helper.confirmPromotion('q')).toBe(true);
    const game = helper.getGame();
    const piece = game.get('e8');
    expect(piece).toEqual({ type: 'q', color: 'w' });
    expect(game.history()).toEqual(['e8=Q']);
    expect(helper.getPendingPromotion()).toBeNull();
  });

  it('promotes White pawn to Rook (e8=R)', () => {
    const helper = createPromotionHelper('8/4P3/8/8/8/8/8/k6K w - - 0 1');
    helper.makeMove('e7', 'e8');
    expect(helper.confirmPromotion('r')).toBe(true);

    const game = helper.getGame();
    expect(game.get('e8')).toEqual({ type: 'r', color: 'w' });
    expect(game.history()).toEqual(['e8=R']);
  });

  it('promotes White pawn to Bishop (e8=B)', () => {
    const helper = createPromotionHelper('8/4P3/8/8/8/8/8/k6K w - - 0 1');
    helper.makeMove('e7', 'e8');
    expect(helper.confirmPromotion('b')).toBe(true);

    const game = helper.getGame();
    expect(game.get('e8')).toEqual({ type: 'b', color: 'w' });
    expect(game.history()).toEqual(['e8=B']);
  });

  it('promotes White pawn to Knight (e8=N)', () => {
    const helper = createPromotionHelper('8/4P3/8/8/8/8/8/k6K w - - 0 1');
    helper.makeMove('e7', 'e8');
    expect(helper.confirmPromotion('n')).toBe(true);

    const game = helper.getGame();
    expect(game.get('e8')).toEqual({ type: 'n', color: 'w' });
    expect(game.history()).toEqual(['e8=N']);
  });

  it('cancels promotion and returns the piece to original square (TASK-007 Gate)', () => {
    const helper = createPromotionHelper('8/4P3/8/8/8/8/8/k6K w - - 0 1');
    // Drop pawn on promotion square
    helper.makeMove('e7', 'e8');
    expect(helper.getPendingPromotion()).not.toBeNull();

    // User cancels the picker
    helper.cancelPromotion();
    expect(helper.getPendingPromotion()).toBeNull();

    // Pawn is still on e7, square e8 is empty
    const game = helper.getGame();
    expect(game.get('e7')).toEqual({ type: 'p', color: 'w' });
    expect(game.get('e8')).toBeUndefined();
    expect(game.history()).toEqual([]);
  });

  it('promotes Black pawn to all choices (e1=Q, e1=R, e1=B, e1=N)', () => {
    for (const choice of ['q', 'r', 'b', 'n']) {
      const helper = createPromotionHelper('k6K/8/8/8/8/8/4p3/8 b - - 0 1');
      helper.makeMove('e2', 'e1');
      expect(helper.confirmPromotion(choice)).toBe(true);

      const game = helper.getGame();
      expect(game.get('e1')).toEqual({ type: choice, color: 'b' });
      expect(game.history()).toEqual([`e1=${choice.toUpperCase()}`]);
    }
  });
});
