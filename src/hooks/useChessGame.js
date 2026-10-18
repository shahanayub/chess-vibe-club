import { useState, useMemo, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import { getGameStatus } from '../lib/gameStatus';
import { loadCurrentGame, saveCurrentGame, clearCurrentGame } from '../lib/storage';

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
 * Auto-saves and restores via lib/storage.js (FR-008, TR-005, NFR-005).
 */
export function useChessGame(initialPgn = null, initialOrientation = null) {
  // Load saved state once at startup (TR-005, NFR-005)
  const [pgn, setPgn] = useState(() => {
    if (initialPgn !== null) return initialPgn;
    const saved = loadCurrentGame();
    return saved?.pgn || '';
  });

  const [orientation, setOrientation] = useState(() => {
    if (initialOrientation !== null) return initialOrientation;
    const saved = loadCurrentGame();
    return saved?.orientation || 'white';
  });

  const [pendingPromotion, setPendingPromotion] = useState(null);

  // Auto-save on state change (FR-008, TR-005)
  useEffect(() => {
    saveCurrentGame({ pgn, orientation });
  }, [pgn, orientation]);

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
  const canUndo = useMemo(() => history.length > 0, [history.length]);

  const flipOrientation = useCallback(() => {
    setOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  }, []);

  /**
   * Attempts to make a move via chess.js (RULE-003, FR-002, FR-009).
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

        setPgn(tempGame.pgn());
        setPendingPromotion(null);
        return true;
      } catch (err) {
        console.error('Move validation error:', err);
        return false;
      }
    },
    [game, pgn]
  );

  /**
   * Undoes the last move (FR-007, TR-007).
   */
  const undo = useCallback(() => {
    if (history.length === 0) {
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

    const undoneMove = tempGame.undo();
    if (!undoneMove) {
      return false;
    }

    const newPgn = tempGame.history().length === 0 ? '' : tempGame.pgn();
    setPgn(newPgn);
    setPendingPromotion(null);
    return true;
  }, [history.length, pgn]);

  /**
   * Resets the game to the starting position and clears storage (FR-006, database.md).
   */
  const newGame = useCallback(() => {
    setPgn('');
    setPendingPromotion(null);
    clearCurrentGame();
    return true;
  }, []);

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
    canUndo,
    undo,
    newGame,
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
