import React from 'react';

/**
 * StatusBar component per design.md and NFR-004.
 * Displays current turn, check warnings, checkmate, and draw results.
 * Uses aria-live="polite", text + icons (never color alone), and >= 4.5:1 contrast.
 */
export default function StatusBar({ status }) {
  if (!status) return null;

  const { turn, inCheck, isGameOver, isCheckmate, isDraw, message, type } = status;

  // Determine styling theme based on status type
  let containerStyles = 'bg-white border-slate-200 text-slate-800';
  let badgeStyles = 'bg-slate-100 text-slate-600 border-slate-200';
  let badgeLabel = 'In Progress';

  if (isCheckmate) {
    containerStyles = 'bg-emerald-50 border-emerald-300 text-emerald-900';
    badgeStyles = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    badgeLabel = 'Game Over';
  } else if (isDraw) {
    containerStyles = 'bg-amber-50 border-amber-300 text-amber-900';
    badgeStyles = 'bg-amber-100 text-amber-800 border-amber-300';
    badgeLabel = 'Draw';
  } else if (inCheck) {
    containerStyles = 'bg-red-50 border-red-300 text-red-900';
    badgeStyles = 'bg-red-100 text-red-800 border-red-300';
    badgeLabel = 'Check';
  }

  return (
    <section
      role="status"
      aria-live="polite"
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border shadow-sm transition-colors duration-200 ${containerStyles}`}
    >
      <div className="flex items-center gap-3">
        {/* Turn Dot indicator for active games */}
        {!isGameOver ? (
          <span
            className={`inline-block w-4 h-4 rounded-full border shadow-xs ${
              turn === 'w' ? 'bg-white border-slate-400' : 'bg-slate-900 border-slate-900'
            }`}
            aria-hidden="true"
          />
        ) : null}

        {/* Check icon */}
        {inCheck && !isCheckmate ? (
          <svg
            className="w-5 h-5 text-red-600 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        ) : null}

        {/* Trophy icon for Checkmate */}
        {isCheckmate ? (
          <svg
            className="w-5 h-5 text-emerald-700 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : null}

        {/* Draw icon */}
        {isDraw ? (
          <svg
            className="w-5 h-5 text-amber-700 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7h8m-8 5h8m-8 5h8"
            />
          </svg>
        ) : null}

        {/* Status text message */}
        <span className="text-sm sm:text-base font-semibold tracking-tight">
          {message}
        </span>
      </div>

      {/* State Badge */}
      <span
        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${badgeStyles}`}
      >
        {badgeLabel}
      </span>
    </section>
  );
}
