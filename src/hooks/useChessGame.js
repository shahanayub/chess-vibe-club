import { useState, useMemo, useCallback } from 'react';
import { Chess } from 'chess.js';
import { getGameStatus } from '../lib/gameStatus';

/**
 * Helper to check if a move from source to target is a pawn promotion move.
 */
export function isPromotionMove(game, from, to) {
  if (!game || !from || !to) return false;
  try {
    const legalMoves = game.moves({ verbose: true });
    return legalMoves.some(
      (m) => m.from === from && m.to === to && Boolean(m.promotion)
    );
  } catch {
    return false;
  }
}

/**
 * Custom hook managing the chess game state.
 * Single source of truth is the PGN string (TR-002, RULE-004).
 * All rules and state transitions are derived via chess.js (RULE-003).
 */
export function useChessGame(initialPgn = '', initialOrientation = 'white') {
  const [pgn, setPgn] = useState(initialPgn);
  const [orientation, setOrientation] = useState(initialOrientation);
  const [pendingPromotion, setPendingPromotion] = useState(null);

  // Derive Chess instance from PGN single source of truth
  const game = useMemo(() => {
    const chess = new Chess();
    if (pgn && pgn.trim() !== '') {
      try {
        chess.loadPgn(pgn);
      } catch (err) {
        console.error('Failed to load PGN:', err);
      }
    }
    return chess;
  }, [pgn]);

  // Derived state
  const fen = useMemo(() => game.fen(), [game]);
  const turn = useMemo(() => game.turn(), [game]);
  const isGameOver = useMemo(() => game.isGameOver(), [game]);
  const history = useMemo(() => game.history(), [game]);
  const status = useMemo(() => getGameStatus(game), [game]);

  const flipOrientation = useCallback(() => {
    setOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  }, []);

  /**
   * Attempts to make a move via chess.js (RULE-003, FR-002, FR-009).
   * If the move is a pawn promotion and no promotion piece is provided,
   * it stages pendingPromotion and returns false.
   */
  const makeMove = useCallback(
    (from, to, promotion) => {
      if (game.isGameOver()) {
        return false;
      }

      const tempGame = new Chess();
      if (pgn && pgn.trim() !== '') {
        try {
          tempGame.loadPgn(pgn);
        } catch {
          return false;
        }
      }

      try {
        const legalMoves = tempGame.moves({ verbose: true });
        const matchingMoves = legalMoves.filter(
          (m) => m.from === from && m.to === to
        );

        if (matchingMoves.length === 0) {
          return false;
        }

        const isPromo = matchingMoves.some((m) => Boolean(m.promotion));

        // If promotion move and no promotion piece chosen, stage it
        if (isPromo && !promotion) {
          setPendingPromotion({ from, to, color: tempGame.turn() });
          return false;
        }

        const moveConfig = {
          from,
          to,
          ...(isPromo ? { promotion: promotion || 'q' } : {}),
        };

        const result = tempGame.move(moveConfig);
        if (!result) {
          return false;
        }

        // Update single source of truth PGN state and clear any pending promotion
        setPgn(tempGame.pgn());
        setPendingPromotion(null);
        return true;
      } catch (err) {
        // Prevent chess.js exception from crashing UI (RULE-011)
        console.error('Move validation error:', err);
        return false;
      }
    },
    [game, pgn]
  );

  /**
   * Completes a staged promotion move with the chosen piece (q, r, b, n).
   */
  const confirmPromotion = useCallback(
    (piece) => {
      if (!pendingPromotion) return false;
      const { from, to } = pendingPromotion;
      return makeMove(from, to, piece);
    },
    [pendingPromotion, makeMove]
  );

  /**
   * Cancels a staged promotion move and returns the piece.
   */
  const cancelPromotion = useCallback(() => {
    setPendingPromotion(null);
  }, []);

  return {
    game,
    fen,
    turn,
    isGameOver,
    history,
    status,
    pgn,
    setPgn,
    orientation,
    setOrientation,
    flipOrientation,
    makeMove,
    pendingPromotion,
    setPendingPromotion,
    confirmPromotion,
    cancelPromotion,
    isPromotionMove: useCallback(
      (from, to) => isPromotionMove(game, from, to),
      [game]
    ),
  };
}
