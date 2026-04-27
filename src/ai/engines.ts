import { Chess } from 'chess.js';
import type { Move } from 'chess.js';
import type { AILevel, AIThinkingInfo } from '../types';
import { evaluateBoard } from './evaluation';

export interface AIResult {
  move: Move;
  thinkingInfo: AIThinkingInfo;
}

function randomMove(game: Chess): AIResult {
  const start = performance.now();
  const moves = game.moves({ verbose: true });
  const move = moves[Math.floor(Math.random() * moves.length)];
  return {
    move,
    thinkingInfo: {
      depth: 0,
      evaluation: 0,
      bestMove: move.san,
      nodesSearched: moves.length,
      timeMs: performance.now() - start,
    },
  };
}

function greedyMove(game: Chess): AIResult {
  const start = performance.now();
  const moves = game.moves({ verbose: true });
  let nodesSearched = 0;

  let bestMove = moves[0];
  let bestScore = -Infinity;
  const isWhite = game.turn() === 'w';

  for (const move of moves) {
    nodesSearched++;
    const testGame = new Chess(game.fen());
    testGame.move(move.san);
    const score = evaluateBoard(testGame);
    const adjustedScore = isWhite ? score : -score;

    if (adjustedScore > bestScore) {
      bestScore = adjustedScore;
      bestMove = move;
    }
  }

  return {
    move: bestMove,
    thinkingInfo: {
      depth: 1,
      evaluation: bestScore / 100,
      bestMove: bestMove.san,
      nodesSearched,
      timeMs: performance.now() - start,
    },
  };
}

function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  nodesRef: { count: number }
): number {
  nodesRef.count++;

  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = game.moves({ verbose: true });

  // Move ordering: captures first, then checks
  moves.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    if (a.captured) scoreA += 10;
    if (b.captured) scoreB += 10;
    if (a.san.includes('+')) scoreA += 5;
    if (b.san.includes('+')) scoreB += 5;
    return scoreB - scoreA;
  });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move.san);
      const evalScore = minimax(game, depth - 1, alpha, beta, false, nodesRef);
      game.undo();
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move.san);
      const evalScore = minimax(game, depth - 1, alpha, beta, true, nodesRef);
      game.undo();
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function minimaxMove(game: Chess): AIResult {
  const start = performance.now();
  const moves = game.moves({ verbose: true });
  const isWhite = game.turn() === 'w';
  const depth = 3;
  const nodesRef = { count: 0 };

  // Move ordering
  moves.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    if (a.captured) scoreA += 10;
    if (b.captured) scoreB += 10;
    if (a.san.includes('+')) scoreA += 5;
    if (b.san.includes('+')) scoreB += 5;
    return scoreB - scoreA;
  });

  let bestMove = moves[0];
  let bestScore = isWhite ? -Infinity : Infinity;

  for (const move of moves) {
    const testGame = new Chess(game.fen());
    testGame.move(move.san);
    const score = minimax(testGame, depth - 1, -Infinity, Infinity, !isWhite, nodesRef);

    if (isWhite ? score > bestScore : score < bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return {
    move: bestMove,
    thinkingInfo: {
      depth,
      evaluation: bestScore / 100,
      bestMove: bestMove.san,
      nodesSearched: nodesRef.count,
      timeMs: performance.now() - start,
    },
  };
}

export function getAIMove(game: Chess, level: AILevel): AIResult {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) {
    throw new Error('No legal moves available');
  }

  switch (level) {
    case 'random':
      return randomMove(game);
    case 'greedy':
      return greedyMove(game);
    case 'minimax':
    case 'stockfish':
      return minimaxMove(game);
    default:
      return randomMove(game);
  }
}
