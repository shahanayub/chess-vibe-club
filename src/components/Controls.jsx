import React from 'react';

/**
 * Controls component per Architecture.md (FR-006, FR-007, FR-010).
 * Displays New Game, Undo, and Flip buttons.
 * Touch targets >= 44px, visible focus rings, accessible labels.
 */
export default function Controls({
  canUndo = false,
  onUndo,
  onNewGame,
  onFlip,
}) {
  return (
    <div
      className="w-full bg-white rounded-lg border border-slate-200 shadow-sm p-3 flex flex-wrap sm:flex-nowrap gap-2 items-center justify-between"
      role="toolbar"
      aria-label="Game Controls"
    >
      {/* Undo Button */}
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all min-h-[44px] ${
          canUndo
            ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs'
            : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
        }`}
        aria-label="Undo last move"
        title={canUndo ? 'Undo last move' : 'No moves to undo'}
      >
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h10a5 5 0 015 5v2m-15-7l4-4m-4 4l4 4"
          />
        </svg>
        <span>Undo</span>
      </button>

      {/* Flip Board Button */}
      {onFlip && (
        <button
          type="button"
          onClick={onFlip}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs min-h-[44px] transition-all"
          aria-label="Flip board orientation"
          title="Flip board orientation"
        >
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
          <span>Flip</span>
        </button>
      )}

      {/* New Game Button */}
      <button
        type="button"
        onClick={onNewGame}
        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer shadow-xs min-h-[44px] transition-all"
        aria-label="Start new game"
      >
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>New Game</span>
      </button>
    </div>
  );
}
