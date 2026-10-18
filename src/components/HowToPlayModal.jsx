import React, { useEffect, useRef } from 'react';

export default function HowToPlayModal({ isOpen, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    closeBtnRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="howto-title"
        className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-200 p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="howto-title" className="text-xl font-bold text-slate-900">
          How to Play
        </h2>
        <ul className="mt-3 space-y-3 text-sm text-slate-700 list-disc pl-5">
          <li><b>Turns:</b> White moves first, then players alternate.</li>
          <li><b>Moving:</b> Drag a piece, or click it and then click a highlighted square.</li>
          <li><b>Capturing:</b> Move onto an opponent's piece to take it (shown in red).</li>
          <li><b>Check:</b> Your king is under attack — you must get out of it.</li>
          <li><b>Checkmate:</b> The king is attacked and can't escape. That player loses.</li>
          <li><b>Promotion:</b> A pawn reaching the far rank becomes a Queen, Rook, Bishop or Knight.</li>
        </ul>
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="mt-5 w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 cursor-pointer transition-colors"
        >
          Got it, Let's Play!
        </button>
      </div>
    </div>
  );
}