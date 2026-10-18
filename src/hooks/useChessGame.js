import { useState, useMemo, useCallback } from 'react';
import { Chess } from 'chess.js';
import { getGameStatus } from '../lib/gameStatus';

/**
 * Custom hook managing the chess game state.
 * Single source of truth is the PGN string (TR-002, RULE-004).
 * All rules and state transitions are derived via chess.js (RULE-003).
 */
export function useChessGame(initialPgn = '', initialOrientation = 'white') {
  const [pgn, setPgn] = useState(initialPgn);
  const [orientation, setOrientation] = useState(initialOrientation);

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
   * Attempts to make a move via chess.js (RULE-003, FR-002).
   * Returns true if legal, false if illegal or game over.
   */
  const makeMove = useCallback(
    (from, to, promotion = 'q') => {
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
        const matchingMove = legalMoves.find(
          (m) => m.from === from && m.to === to
        );

        if (!matchingMove) {
          return false;
        }

        const moveConfig = {
          from,
          to,
          ...(matchingMove.promotion ? { promotion: promotion || 'q' } : {}),
        };

        const result = tempGame.move(moveConfig);
        if (!result) {
          return false;
        }

        // Update single source of truth PGN state
        setPgn(tempGame.pgn());
        return true;
      } catch (err) {
        // Prevent any chess.js exception from crashing UI (RULE-011)
        console.error('Move validation error:', err);
        return false;
      }
    },
    [game, pgn]
  );

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
  };
}
