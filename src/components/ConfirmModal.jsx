import React, { useEffect, useRef } from 'react';

/**
 * ConfirmModal component per FR-006, design.md, and NFR-004.
 * Prompts user before destructive actions (New Game).
 * Accessible dialog with Esc to cancel, visible focus rings, and >= 44px touch targets.
 */
export default function ConfirmModal({
  isOpen,
  title = 'Start New Game?',
  message = 'Are you sure you want to discard the current game? This action cannot be undone.',
  confirmLabel = 'Discard & Start New',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  const cancelBtnRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onCancel();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    // Auto-focus cancel button on open for safe default
    cancelBtnRef.current?.focus();

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 p-6 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-full bg-red-100 text-red-600 shrink-0">
            <svg
              className="w-5 h-5"
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
          </div>
          <div>
            <h2
              id="confirm-dialog-title"
              className="text-base font-bold text-slate-900 leading-tight"
            >
              {title}
            </h2>
            <p
              id="confirm-dialog-description"
              className="text-xs sm:text-sm text-slate-500 mt-1"
            >
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-2">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-400 min-h-[44px] cursor-pointer transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:ring-offset-2 min-h-[44px] cursor-pointer transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
