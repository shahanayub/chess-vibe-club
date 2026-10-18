import React, { useCallback } from 'react';
import { useChessGame } from './hooks/useChessGame';
import BoardPanel from './components/BoardPanel';

export default function App() {
  const { fen, orientation, turn, isGameOver, makeMove } = useChessGame();

  const handlePieceDrop = useCallback(
    ({ sourceSquare, targetSquare }) => {
      if (!targetSquare || sourceSquare === targetSquare) {
        return false;
      }
      return makeMove(sourceSquare, targetSquare);
    },
    [makeMove]
  );

  const handleCanDragPiece = useCallback(
    ({ piece }) => {
      if (isGameOver || !piece?.pieceType) {
        return false;
      }
      // Only the current turn's pieces are draggable (FR-002)
      return piece.pieceType[0] === turn;
    },
    [isGameOver, turn]
  );

  const turnLabel = isGameOver
    ? 'Game Over'
    : turn === 'w'
    ? 'White to move'
    : 'Black to move';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center py-6 px-4 sm:px-6 lg:px-8">
      <header className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Chess
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          2-Player Local Game
        </p>
      </header>

      <main className="w-full max-w-[640px] flex flex-col gap-4">
        {/* Status banner */}
        <section
          aria-live="polite"
          className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-slate-200 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-3.5 h-3.5 rounded-full border border-slate-300 ${
                turn === 'w' ? 'bg-white shadow-xs' : 'bg-slate-900'
              }`}
              aria-hidden="true"
            />
            <span className="text-sm sm:text-base font-medium text-slate-800">
              {turnLabel}
            </span>
          </div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {isGameOver ? 'Finished' : 'In Progress'}
          </span>
        </section>

        {/* Board Panel */}
        <BoardPanel
          fen={fen}
          orientation={orientation}
          onPieceDrop={handlePieceDrop}
          canDragPiece={handleCanDragPiece}
        />
      </main>
    </div>
  );
}
