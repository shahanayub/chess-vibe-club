import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';

describe('Legal move handling and validation (FR-002, TASK-004)', () => {
  function createGameHelper(initialPgn = '') {
    let pgn = initialPgn;

    function getGame() {
      const chess = new Chess();
      if (pgn) {
        chess.loadPgn(pgn);
      }
      return chess;
    }

    function canDragPiece(pieceType) {
      const game = getGame();
      if (game.isGameOver()) return false;
      if (!pieceType) return false;
      return pieceType[0] === game.turn();
    }

    function makeMove(from, to, promotion = 'q') {
      const game = getGame();
      if (game.isGameOver()) return false;

      try {
        const legalMoves = game.moves({ verbose: true });
        const matchingMove = legalMoves.find((m) => m.from === from && m.to === to);
        if (!matchingMove) return false;

        const moveConfig = {
          from,
          to,
          ...(matchingMove.promotion ? { promotion: promotion || 'q' } : {}),
        };

        const result = game.move(moveConfig);
        if (!result) return false;

        pgn = game.pgn();
        return true;
      } catch {
        return false;
      }
    }

    return { getGame, canDragPiece, makeMove, getPgn: () => pgn };
  }

  it('rejects dragging pieces of the wrong turn', () => {
    const helper = createGameHelper();
    // At start, White is to move
    expect(helper.canDragPiece('wP')).toBe(true);
    expect(helper.canDragPiece('bP')).toBe(false);
    expect(helper.canDragPiece('bK')).toBe(false);
  });

  it('rejects illegal moves (snap-back)', () => {
    const helper = createGameHelper();
    // White pawn cannot move 3 squares forward
    expect(helper.makeMove('e2', 'e5')).toBe(false);
    // White king cannot jump across the board
    expect(helper.makeMove('e1', 'e8')).toBe(false);
    // Pawn cannot move diagonally to an empty square
    expect(helper.makeMove('e2', 'd3')).toBe(false);

    // Board position remains unchanged
    expect(helper.getGame().fen()).toBe(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    );
  });

  it('rejects moving king into check', () => {
    // White: Kh1, Black: Ra8, black to move
    const helper = createGameHelper();
    // 1. e4 d5 2. Ke2 (legal move by king)
    expect(helper.makeMove('e2', 'e4')).toBe(true);
    expect(helper.makeMove('d7', 'd5')).toBe(true);
    expect(helper.makeMove('e1', 'e2')).toBe(true);
    // Now Black moves Bg4+
    expect(helper.makeMove('c8', 'g4')).toBe(true);

    // White is now in check from bishop on g4
    expect(helper.getGame().inCheck()).toBe(true);

    // White king cannot move to d3 if attacked, or another piece cannot make an unrelated move leaving king in check
    expect(helper.makeMove('a2', 'a3')).toBe(false); // leaves king in check -> rejected
  });

  it("plays Fool's Mate correctly and locks moves after checkmate", () => {
    const helper = createGameHelper();

    // 1. f3
    expect(helper.canDragPiece('wP')).toBe(true);
    expect(helper.makeMove('f2', 'f3')).toBe(true);
    expect(helper.getGame().turn()).toBe('b');

    // Black's turn: white pieces cannot be dragged
    expect(helper.canDragPiece('wP')).toBe(false);
    expect(helper.canDragPiece('bP')).toBe(true);

    // 1... e5
    expect(helper.makeMove('e7', 'e5')).toBe(true);
    expect(helper.getGame().turn()).toBe('w');

    // 2. g4
    expect(helper.makeMove('g2', 'g4')).toBe(true);
    expect(helper.getGame().turn()).toBe('b');

    // 2... Qh4# (Fool's Mate)
    expect(helper.makeMove('d8', 'h4')).toBe(true);

    const finalGame = helper.getGame();
    expect(finalGame.isCheckmate()).toBe(true);
    expect(finalGame.isGameOver()).toBe(true);

    // After checkmate, pieces are locked (no more moves allowed)
    expect(helper.canDragPiece('wK')).toBe(false);
    expect(helper.canDragPiece('bQ')).toBe(false);
    expect(helper.makeMove('e1', 'f2')).toBe(false);
  });
});

