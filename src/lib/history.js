/**
 * Formats an array of SAN move strings into grouped move rows (FR-004, Architecture.md).
 * Pure function: SAN array -> row objects.
 *
 * @param {string[]} sanMoves - Array of SAN move strings from chess.history()
 * @returns {Array<{ moveNumber: number, white: string, black: string | null }>}
 */
export function formatMoveHistory(sanMoves) {
  if (!Array.isArray(sanMoves) || sanMoves.length === 0) {
    return [];
  }

  const rows = [];
  for (let i = 0; i < sanMoves.length; i += 2) {
    rows.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: sanMoves[i] || '',
      black: sanMoves[i + 1] || null,
    });
  }

  return rows;
}
