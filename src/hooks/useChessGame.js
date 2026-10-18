import { useState, useMemo, useCallback } from 'react';
import { Chess } from 'chess.js';

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

  const flipOrientation = useCallback(() => {
    setOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  }, []);

  return {
    game,
    fen,
    turn,
    pgn,
    setPgn,
    orientation,
    setOrientation,
    flipOrientation,
  };
}
