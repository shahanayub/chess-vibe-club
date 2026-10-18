/**
 * Pure function: Chess -> status object (Architecture.md, FR-003, FR-005).
 * All rules logic delegated to chess.js (RULE-003).
 */
export function getGameStatus(chess) {
  if (!chess) {
    return {
      turn: 'w',
      turnName: 'White',
      inCheck: false,
      isGameOver: false,
      isCheckmate: false,
      isStalemate: false,
      isDraw: false,
      drawReason: null,
      winner: null,
      message: 'White to move',
      type: 'in_progress',
    };
  }

  try {
    const turn = chess.turn();
    const turnName = turn === 'w' ? 'White' : 'Black';
    const inCheck = chess.inCheck();
    const isCheckmate = chess.isCheckmate();
    const isStalemate = chess.isStalemate();
    const isThreefold = chess.isThreefoldRepetition();
    const isInsufficient = chess.isInsufficientMaterial();
    const isFiftyMoves = chess.isDrawByFiftyMoves();
    const isDraw = chess.isDraw();
    const isGameOver = chess.isGameOver();

    if (isCheckmate) {
      // The side to move is the one checkmated; the other side won
      const winner = turn === 'w' ? 'Black' : 'White';
      return {
        turn,
        turnName,
        inCheck: true,
        isGameOver: true,
        isCheckmate: true,
        isStalemate: false,
        isDraw: false,
        drawReason: null,
        winner,
        message: `Checkmate — ${winner} wins`,
        type: 'checkmate',
      };
    }

    if (isStalemate) {
      return {
        turn,
        turnName,
        inCheck: false,
        isGameOver: true,
        isCheckmate: false,
        isStalemate: true,
        isDraw: true,
        drawReason: 'stalemate',
        winner: null,
        message: 'Draw — stalemate',
        type: 'draw',
      };
    }

    if (isThreefold) {
      return {
        turn,
        turnName,
        inCheck,
        isGameOver: true,
        isCheckmate: false,
        isStalemate: false,
        isDraw: true,
        drawReason: 'threefold repetition',
        winner: null,
        message: 'Draw — threefold repetition',
        type: 'draw',
      };
    }

    if (isInsufficient) {
      return {
        turn,
        turnName,
        inCheck: false,
        isGameOver: true,
        isCheckmate: false,
        isStalemate: false,
        isDraw: true,
        drawReason: 'insufficient material',
        winner: null,
        message: 'Draw — insufficient material',
        type: 'draw',
      };
    }

    if (isFiftyMoves) {
      return {
        turn,
        turnName,
        inCheck,
        isGameOver: true,
        isCheckmate: false,
        isStalemate: false,
        isDraw: true,
        drawReason: 'fifty-move rule',
        winner: null,
        message: 'Draw — fifty-move rule',
        type: 'draw',
      };
    }

    if (isDraw) {
      return {
        turn,
        turnName,
        inCheck: false,
        isGameOver: true,
        isCheckmate: false,
        isStalemate: false,
        isDraw: true,
        drawReason: 'draw',
        winner: null,
        message: 'Draw',
        type: 'draw',
      };
    }

    if (inCheck) {
      return {
        turn,
        turnName,
        inCheck: true,
        isGameOver: false,
        isCheckmate: false,
        isStalemate: false,
        isDraw: false,
        drawReason: null,
        winner: null,
        message: `Check — ${turnName} to move`,
        type: 'check',
      };
    }

    return {
      turn,
      turnName,
      inCheck: false,
      isGameOver: false,
      isCheckmate: false,
      isStalemate: false,
      isDraw: false,
      drawReason: null,
      winner: null,
      message: `${turnName} to move`,
      type: 'in_progress',
    };
  } catch (err) {
    console.error('getGameStatus error:', err);
    return {
      turn: 'w',
      turnName: 'White',
      inCheck: false,
      isGameOver: false,
      isCheckmate: false,
      isStalemate: false,
      isDraw: false,
      drawReason: null,
      winner: null,
      message: 'White to move',
      type: 'in_progress',
    };
  }
}
