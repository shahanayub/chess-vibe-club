import React, { useMemo } from 'react';
import { Chessboard } from 'react-chessboard';

/**
 * Presentational board panel rendering the chessboard using react-chessboard options prop.
 * Matches design.md colors: board-light (#EEEED2) and board-dark (#769656).
 */
export default function BoardPanel({
  fen,
  orientation = 'white',
  onPieceDrop,
  canDragPiece,
  customSquareStyles = {},
}) {
  const chessboardOptions = useMemo(() => {
    const opts = {
      position: fen,
      boardOrientation: orientation,
      darkSquareStyle: { backgroundColor: '#769656' },
      lightSquareStyle: { backgroundColor: '#EEEED2' },
      squareStyles: customSquareStyles,
    };

    if (onPieceDrop) {
      opts.onPieceDrop = onPieceDrop;
    }
    if (canDragPiece) {
      opts.canDragPiece = canDragPiece;
    }

    return opts;
  }, [fen, orientation, onPieceDrop, canDragPiece, customSquareStyles]);

  return (
    <div
      className="w-full max-w-[640px] aspect-square mx-auto rounded-lg overflow-hidden shadow-md border border-slate-200 bg-white"
      data-testid="chessboard-panel"
      role="region"
      aria-label="Interactive Chess Board"
    >
      <Chessboard options={chessboardOptions} />
    </div>
  );
}
