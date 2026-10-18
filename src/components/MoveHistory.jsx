import React, { useEffect, useRef, useMemo } from 'react';
import { formatMoveHistory } from '../lib/history';

/**
 * MoveHistory component per design.md (FR-004).
 * Displays SAN move list grouped by move number in a two-column scrollable table.
 * Highlights the latest move and auto-scrolls to the newest move.
 */
export default function MoveHistory({ history = [] }) {
  const bottomRef = useRef(null);
  const rows = useMemo(() => formatMoveHistory(history), [history]);
  const totalMoves = history.length;

  // Auto-scroll to the latest move
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [totalMoves]);

  return (
    <div
      className="w-full bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden"
      aria-label="Move History"
    >
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800 tracking-tight">
          Move History
        </h2>
        <span className="text-xs font-mono text-slate-500">
          {totalMoves} {totalMoves === 1 ? 'move' : 'moves'}
        </span>
      </div>

      <div
        className="h-48 sm:h-56 lg:h-72 xl:h-80 overflow-y-auto p-2 scroll-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
        tabIndex="0"
        role="region"
        aria-label="Scrollable move history table"
      >
        {rows.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
            No moves played yet.
          </div>
        ) : (
          <table className="w-full text-left font-mono text-sm tabular-nums border-collapse">
            <thead className="text-xs uppercase text-slate-400 sticky top-0 bg-white">
              <tr className="border-b border-slate-100">
                <th scope="col" className="w-12 py-1.5 px-2 font-medium">
                  #
                </th>
                <th scope="col" className="py-1.5 px-2 font-medium">
                  White
                </th>
                <th scope="col" className="py-1.5 px-2 font-medium">
                  Black
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((row, index) => {
                const isLastRow = index === rows.length - 1;
                const isWhiteLatest = isLastRow && totalMoves % 2 === 1;
                const isBlackLatest = isLastRow && totalMoves % 2 === 0;

                return (
                  <tr key={row.moveNumber} className="hover:bg-slate-50/80">
                    <td className="py-1.5 px-2 text-slate-400 text-xs font-medium">
                      {row.moveNumber}.
                    </td>
                    <td className="py-1.5 px-2 text-slate-800">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded transition-colors ${
                          isWhiteLatest
                            ? 'bg-amber-100 text-amber-900 font-semibold'
                            : ''
                        }`}
                      >
                        {row.white}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 text-slate-800">
                      {row.black ? (
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded transition-colors ${
                            isBlackLatest
                              ? 'bg-amber-100 text-amber-900 font-semibold'
                              : ''
                          }`}
                        >
                          {row.black}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
