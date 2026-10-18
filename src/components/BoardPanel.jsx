import React, { useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import PromotionPicker from './PromotionPicker';

/**
 * Presentational board panel rendering the chessboard using react-chessboard options prop.
 * Matches design.md colors: board-light (#EEEED2) and board-dark (#769656).
 * Renders PromotionPicker modal overlay on pawn reaching the final rank (FR-009).
 */
export default function BoardPanel({
  fen,
  turn = 'w',
  orientation = 'white',
  onPieceDrop,
  canDragPiece,
  customSquareStyles = {},
  pendingPromotion = null,
  onPromotionSelect,
  onPromotionCancel,
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

  const boardAriaLabel = `Chess Board — ${turn === 'w' ? 'White' : 'Black'} to move`;

  return (
    <div
      className="relative w-full max-w-[640px] aspect-square mx-auto rounded-lg overflow-hidden shadow-md border border-slate-200 bg-white"
      data-testid="chessboard-panel"
      role="region"
      aria-label={boardAriaLabel}
    >
      <Chessboard options={chessboardOptions} />

      {pendingPromotion && (
        <PromotionPicker
          color={pendingPromotion.color}
          onSelect={onPromotionSelect}
          onCancel={onPromotionCancel}
        />
      )}
    </div>
  );
}
