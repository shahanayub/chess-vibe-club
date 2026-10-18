import React, { useCallback } from 'react';
import { useChessGame } from './hooks/useChessGame';
import BoardPanel from './components/BoardPanel';
import StatusBar from './components/StatusBar';

export default function App() {
  const { fen, orientation, turn, isGameOver, status, makeMove } = useChessGame();

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
        {/* StatusBar showing turn, check warnings, checkmate, and draw results */}
        <StatusBar status={status} />

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
