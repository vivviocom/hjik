import type { Square, Color, Move } from 'chess.js';

export type AILevel = 'random' | 'greedy' | 'minimax' | 'stockfish';

export type GameSpeed = 'slow' | 'normal' | 'fast';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'check' | 'checkmate' | 'draw' | 'stalemate';

export interface AIThinkingInfo {
  depth: number;
  evaluation: number;
  bestMove: string;
  nodesSearched: number;
  timeMs: number;
}

export interface MoveRecord {
  moveNumber: number;
  white?: string;
  black?: string;
  fen: string;
}

export interface TournamentScore {
  whiteWins: number;
  blackWins: number;
  draws: number;
  totalGames: number;
}

export interface GameState {
  fen: string;
  turn: Color;
  status: GameStatus;
  moveHistory: Move[];
  lastMove: { from: Square; to: Square } | null;
  whiteAI: AILevel;
  blackAI: AILevel;
  speed: GameSpeed;
  isPlaying: boolean;
  evaluation: number;
  thinkingInfo: AIThinkingInfo | null;
  tournament: TournamentScore | null;
  tournamentMode: boolean;
  tournamentGamesTarget: number;
}

export const SPEED_MS: Record<GameSpeed, number> = {
  slow: 2000,
  normal: 800,
  fast: 200,
};
