import React, { useCallback } from 'react';
import { useChessGame } from './hooks/useChessGame';
import BoardPanel from './components/BoardPanel';
import StatusBar from './components/StatusBar';
import MoveHistory from './components/MoveHistory';

export default function App() {
  const {
    fen,
    orientation,
    turn,
    isGameOver,
    history,
    status,
    makeMove,
    pendingPromotion,
    confirmPromotion,
    cancelPromotion,
  } = useChessGame();

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
      if (isGameOver || pendingPromotion || !piece?.pieceType) {
        return false;
      }
      // Only the current turn's pieces are draggable (FR-002)
      return piece.pieceType[0] === turn;
    },
    [isGameOver, pendingPromotion, turn]
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

      <main className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 items-start justify-center">
        {/* Board column */}
        <section
          className="w-full max-w-[640px] mx-auto flex flex-col gap-4"
          aria-label="Chess Board Area"
        >
          {/* Status banner on mobile/tablet */}
          <div className="lg:hidden">
            <StatusBar status={status} />
          </div>

          <BoardPanel
            fen={fen}
            orientation={orientation}
            onPieceDrop={handlePieceDrop}
            canDragPiece={handleCanDragPiece}
            pendingPromotion={pendingPromotion}
            onPromotionSelect={confirmPromotion}
            onPromotionCancel={cancelPromotion}
          />
        </section>

        {/* Sidebar column (Desktop side / Mobile stacked) */}
        <aside
          className="w-full max-w-[640px] lg:max-w-xs xl:max-w-sm mx-auto flex flex-col gap-4"
          aria-label="Game Sidebar"
        >
          {/* Status banner on desktop */}
          <div className="hidden lg:block">
            <StatusBar status={status} />
          </div>

          <MoveHistory history={history} />
        </aside>
      </main>
    </div>
  );
}
