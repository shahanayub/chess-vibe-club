import React, { useEffect, useRef } from 'react';

/**
 * PromotionPicker modal overlay per FR-009, appFlow.md, and NFR-004.
 * Prompts user for Queen, Rook, Bishop, or Knight upon pawn reaching the last rank.
 * Cancel returns the piece without making a move.
 */
export default function PromotionPicker({ color = 'w', onSelect, onCancel }) {
  const modalRef = useRef(null);

  // Handle Escape key to cancel
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onCancel();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const isWhite = color === 'w' || color === 'white';

  const pieces = [
    { key: 'q', name: 'Queen', symbol: isWhite ? '♕' : '♛' },
    { key: 'r', name: 'Rook', symbol: isWhite ? '♖' : '♜' },
    { key: 'b', name: 'Bishop', symbol: isWhite ? '♗' : '♝' },
    { key: 'n', name: 'Knight', symbol: isWhite ? '♘' : '♞' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promotion-title"
      aria-describedby="promotion-desc"
    >
      <div
        ref={modalRef}
        className="w-full max-w-xs sm:max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 p-6 flex flex-col items-center gap-5"
      >
        <div className="text-center">
          <h2
            id="promotion-title"
            className="text-lg font-bold text-slate-900"
          >
            Promote Pawn
          </h2>
          <p id="promotion-desc" className="text-xs text-slate-500 mt-1">
            Choose a piece to promote your pawn:
          </p>
        </div>

        {/* Piece selection grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {pieces.map(({ key, name, symbol }, idx) => (
            <button
              key={key}
              type="button"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={idx === 0}
              onClick={() => onSelect(key)}
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all min-h-[56px] cursor-pointer"
              aria-label={`Promote to ${name}`}
            >
              <span className="text-4xl select-none leading-none mb-1 text-slate-800">
                {symbol}
              </span>
              <span className="text-xs font-semibold text-slate-700">
                {name}
              </span>
            </button>
          ))}
        </div>

        {/* Cancel button */}
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-400 transition-colors min-h-[44px] cursor-pointer"
        >
          Cancel Move
        </button>
      </div>
    </div>
  );
}

