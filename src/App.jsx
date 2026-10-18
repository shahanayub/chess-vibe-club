export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-indigo-600 sm:text-4xl">
          Chess App
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          2-Player Local Chess Web App
        </p>
      </header>
      <main className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm border border-slate-200 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 mb-4 border border-green-200">
          <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></span>
          Scaffold Ready (TASK-002)
        </div>
        <p className="text-sm text-slate-600">
          Vite + React + Tailwind CSS + chess.js + react-chessboard initialized.
        </p>
      </main>
    </div>
  );
}
