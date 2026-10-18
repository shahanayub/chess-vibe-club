import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Chess } from 'chess.js';
import { useChessGame } from './hooks/useChessGame';
import BoardPanel from './components/BoardPanel';
import StatusBar from './components/StatusBar';
import MoveHistory from './components/MoveHistory';
import Controls from './components/Controls';
import ConfirmModal from './components/ConfirmModal';
import HowToPlayModal from './components/HowToPlayModal';
import { playMoveSound } from './hooks/sound';
export default function App() {
  const {
    fen,
    orientation,
    turn,
    isGameOver,
    history,
    status,
    canUndo,
    undo,
    newGame,
    flipOrientation,
    makeMove,
    pendingPromotion,
    confirmPromotion,
    cancelPromotion,
  } = useChessGame();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // ── How to Play (remembered for the session) ──
const [isHelpOpen, setIsHelpOpen] = useState(() => {
  try { return sessionStorage.getItem('howToPlayDismissed') !== '1'; }
  catch { return true; }
});
const closeHelp = useCallback(() => {
  setIsHelpOpen(false);
  try { sessionStorage.setItem('howToPlayDismissed', '1'); } catch {}
}, []);

// ── Sounds: only when a new move is added (not on undo / reload restore) ──
const prevLen = useRef(history.length);
useEffect(() => {
  if (history.length > prevLen.current) {
    const last = history[history.length - 1];
    playMoveSound(typeof last === 'string' ? last : last?.san, isGameOver);
  }
  prevLen.current = history.length;
}, [history, isGameOver]);

// ── Legal move highlighting ──
const [selected, setSelected] = useState(null);
const boardWrapRef = useRef(null);

const targets = useMemo(() => {
  if (!selected) return new Map();
  const moves = new Chess(fen).moves({ square: selected, verbose: true });
  return new Map(moves.map((m) => [m.to, m.flags.includes('c') || m.flags.includes('e')]));
}, [selected, fen]);

const squareStyles = useMemo(() => {
  const s = {};
  if (selected) s[selected] = { background: 'rgba(255, 235, 59, 0.55)' };
  targets.forEach((isCapture, sq) => {
    s[sq] = isCapture
      ? { background: 'rgba(239, 68, 68, 0.55)' }
      : { background: 'radial-gradient(circle, rgba(0,0,0,0.25) 22%, transparent 24%)' };
  });
  return s;
}, [selected, targets]);

// clear on any position change (move, undo, new game)
useEffect(() => { setSelected(null); }, [fen]);

// clear when clicking outside the board
useEffect(() => {
  const onDown = (e) => {
    if (boardWrapRef.current && !boardWrapRef.current.contains(e.target)) setSelected(null);
  };
  document.addEventListener('pointerdown', onDown);
  return () => document.removeEventListener('pointerdown', onDown);
}, []);

const handleSquareClick = useCallback(
  ({ square }) => {
    if (isGameOver || pendingPromotion) return;
    if (selected && targets.has(square)) {
      makeMove(selected, square);
      setSelected(null);
      return;
    }
    const p = new Chess(fen).get(square);
    setSelected(p && p.color === turn && square !== selected ? square : null);
  },
  [isGameOver, pendingPromotion, selected, targets, makeMove, fen, turn]
);

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

  const handleNewGameClick = useCallback(() => {
    // If no moves have been played or game is over, reset without prompting (appFlow.md F-5)
    if (history.length === 0 || isGameOver) {
      newGame();
      return;
    }
    // Otherwise open confirmation modal (FR-006)
    setIsConfirmModalOpen(true);
  }, [history.length, isGameOver, newGame]);

  const handleConfirmNewGame = useCallback(() => {
    newGame();
    setIsConfirmModalOpen(false);
  }, [newGame]);

  const handleCancelNewGame = useCallback(() => {
    setIsConfirmModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      {/* ── App header ── */}
      <header className="w-full max-w-5xl mb-4 sm:mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          ♟ Chess
        </h1>


        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          2-Player Local Game
        </p>
      </header>

      {/* ── Main content ──
          Mobile/tablet (< 1024px): single column — status → board → controls → history (design.md § 4)
          Desktop (≥ 1024px):       two columns  — board (left) | sidebar (right)
      */}
      <main
        className="w-full max-w-5xl flex flex-col lg:flex-row gap-4 sm:gap-6 items-start justify-center"
        aria-label="Chess Game"
      >
        {/* ── Board column ── */}
        <section
          className="w-full lg:flex-1 lg:max-w-[640px] flex flex-col gap-3 sm:gap-4"
          aria-label="Chess Board Area"
        >
          {/* Status bar – mobile/tablet only */}
          <div className="lg:hidden">
            <StatusBar status={status} />
          </div>

          {/* Board — square, full width, max 640px (design.md) */}
          <div ref={boardWrapRef}>
  <BoardPanel
    fen={fen}
    turn={turn}
    orientation={orientation}
    onPieceDrop={handlePieceDrop}
    onSquareClick={handleSquareClick}
    canDragPiece={handleCanDragPiece}
    customSquareStyles={squareStyles}
    pendingPromotion={pendingPromotion}
    onPromotionSelect={confirmPromotion}
    onPromotionCancel={cancelPromotion}
  />
</div>

          {/* Controls – below board on mobile/tablet */}
          <div className="lg:hidden">
            <Controls
              canUndo={canUndo}
              onUndo={undo}
              onNewGame={handleNewGameClick}
              onFlip={flipOrientation}
            />
          </div>
        </section>

        {/* ── Sidebar column ── */}
        <aside
          className="w-full lg:w-72 xl:w-80 flex flex-col gap-3 sm:gap-4"
          aria-label="Game Sidebar"
        >
          {/* Status bar – desktop only */}
          <div className="hidden lg:block">
            <StatusBar status={status} />
          </div>

          {/* Controls – desktop only */}
          <div className="hidden lg:block">
            <Controls
              canUndo={canUndo}
              onUndo={undo}
              onNewGame={handleNewGameClick}
              onFlip={flipOrientation}
            />
          </div>

          {/* Move history – stacked after controls on mobile/tablet too */}
          <MoveHistory history={history} />
        </aside>
      </main>

      {/* ── Confirmation Modal ── */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Start New Game?"
        message="Are you sure you want to discard the current game? This action cannot be undone."
        confirmLabel="Discard & Start New"
        cancelLabel="Cancel"
        onConfirm={handleConfirmNewGame}
        onCancel={handleCancelNewGame}
      />
    </div>
  );
}
