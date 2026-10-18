import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';

describe('Controls, Undo, and New Game (FR-006, FR-007, TASK-008)', () => {
  function createGameController(initialPgn = '') {
    let pgn = initialPgn;

    function getGame() {
      const c = new Chess();
      if (pgn) c.loadPgn(pgn);
      return c;
    }

    function makeMove(from, to, promotion = 'q') {
      const c = getGame();
      if (c.isGameOver()) return false;

      try {
        const moves = c.moves({ verbose: true });
        const matching = moves.find((m) => m.from === from && m.to === to);
        if (!matching) return false;

        const moveConfig = {
          from,
          to,
          ...(matching.promotion ? { promotion: promotion || 'q' } : {}),
        };

        const result = c.move(moveConfig);
        if (!result) return false;

        pgn = c.pgn();
        return true;
      } catch {
        return false;
      }
    }

    function undo() {
      const c = getGame();
      if (c.history().length === 0) return false;

      const undone = c.undo();
      if (!undone) return false;

      pgn = c.history().length === 0 ? '' : c.pgn();
      return true;
    }

    function newGame() {
      pgn = '';
      return true;
    }

    return {
      getGame,
      makeMove,
      undo,
      newGame,
      canUndo: () => getGame().history().length > 0,
      getPgn: () => pgn,
    };
  }

  it('verifies Undo works down to empty and then disables (TASK-008 Gate)', () => {
    const controller = createGameController();

    // Initial state: no moves, undo disabled
    expect(controller.canUndo()).toBe(false);
    expect(controller.undo()).toBe(false);

    // Move 1: e4
    expect(controller.makeMove('e2', 'e4')).toBe(true);
    expect(controller.canUndo()).toBe(true);
    expect(controller.getGame().history()).toEqual(['e4']);
    expect(controller.getGame().turn()).toBe('b');

    // Move 2: e5
    expect(controller.makeMove('e7', 'e5')).toBe(true);
    expect(controller.canUndo()).toBe(true);
    expect(controller.getGame().history()).toEqual(['e4', 'e5']);
    expect(controller.getGame().turn()).toBe('w');

    // Move 3: Nf3
    expect(controller.makeMove('g1', 'f3')).toBe(true);
    expect(controller.getGame().history()).toEqual(['e4', 'e5', 'Nf3']);
    expect(controller.getGame().turn()).toBe('b');

    // Undo move 3
    expect(controller.undo()).toBe(true);
    expect(controller.getGame().history()).toEqual(['e4', 'e5']);
    expect(controller.getGame().turn()).toBe('w');
    expect(controller.canUndo()).toBe(true);

    // Undo move 2
    expect(controller.undo()).toBe(true);
    expect(controller.getGame().history()).toEqual(['e4']);
    expect(controller.getGame().turn()).toBe('b');
    expect(controller.canUndo()).toBe(true);

    // Undo move 1 -> back to starting position
    expect(controller.undo()).toBe(true);
    expect(controller.getGame().history()).toEqual([]);
    expect(controller.getGame().turn()).toBe('w');
    expect(controller.getGame().fen()).toBe(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    );

    // Undo is now disabled
    expect(controller.canUndo()).toBe(false);
    expect(controller.undo()).toBe(false);
  });

  it('resets game completely on New Game', () => {
    const controller = createGameController();

    // Play some moves
    controller.makeMove('e2', 'e4');
    controller.makeMove('e7', 'e5');
    controller.makeMove('g1', 'f3');
    expect(controller.canUndo()).toBe(true);

    // Trigger New Game
    controller.newGame();

    expect(controller.canUndo()).toBe(false);
    expect(controller.getGame().history()).toEqual([]);
    expect(controller.getGame().turn()).toBe('w');
    expect(controller.getGame().fen()).toBe(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    );
  });

  it('allows Undo after game over to resume play', () => {
    const controller = createGameController();

    // Fool's mate: 1. f3 e5 2. g4 Qh4#
    controller.makeMove('f2', 'f3');
    controller.makeMove('e7', 'e5');
    controller.makeMove('g2', 'g4');
    controller.makeMove('d8', 'h4');

    expect(controller.getGame().isCheckmate()).toBe(true);
    expect(controller.getGame().isGameOver()).toBe(true);

    // Undo the checkmating move Qh4#
    expect(controller.undo()).toBe(true);

    const game = controller.getGame();
    expect(game.isCheckmate()).toBe(false);
    expect(game.isGameOver()).toBe(false);
    expect(game.turn()).toBe('b');
    expect(game.history()).toEqual(['f3', 'e5', 'g4']);

    // Black can now make a different move instead, e.g. d7-d5
    expect(controller.makeMove('d7', 'd5')).toBe(true);
    expect(controller.getGame().history()).toEqual(['f3', 'e5', 'g4', 'd5']);
  });
});
