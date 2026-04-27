import { useState, useCallback, useRef, useEffect } from 'react';
import { Chess } from 'chess.js';
import type { Move, Square } from 'chess.js';
import type { AILevel, GameSpeed, GameStatus, AIThinkingInfo, TournamentScore } from '../types';
import { SPEED_MS } from '../types';
import { getAIMove } from '../ai/engines';
import { getSimpleEvaluation } from '../ai/evaluation';

export function useChessGame() {
  const gameRef = useRef(new Chess());
  const [fen, setFen] = useState(gameRef.current.fen());
  const [status, setStatus] = useState<GameStatus>('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [whiteAI, setWhiteAI] = useState<AILevel>('greedy');
  const [blackAI, setBlackAI] = useState<AILevel>('minimax');
  const [speed, setSpeed] = useState<GameSpeed>('normal');
  const [evaluation, setEvaluation] = useState(0);
  const [thinkingInfo, setThinkingInfo] = useState<AIThinkingInfo | null>(null);
  const [tournamentMode, setTournamentMode] = useState(false);
  const [tournamentScore, setTournamentScore] = useState<TournamentScore>({
    whiteWins: 0, blackWins: 0, draws: 0, totalGames: 0,
  });
  const [tournamentGamesTarget, setTournamentGamesTarget] = useState(10);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tournamentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);

  const updateStatus = useCallback((game: Chess): GameStatus => {
    if (game.isCheckmate()) return 'checkmate';
    if (game.isStalemate()) return 'stalemate';
    if (game.isDraw()) return 'draw';
    if (game.isCheck()) return 'check';
    if (isPlayingRef.current) return 'playing';
    return 'idle';
  }, []);

  const makeAIMove = useCallback(() => {
    if (!isPlayingRef.current) return;

    const game = gameRef.current;
    if (game.isGameOver()) {
      const finalStatus = updateStatus(game);
      setStatus(finalStatus);
      setIsPlaying(false);
      isPlayingRef.current = false;

      if (tournamentMode) {
        setTournamentScore(prev => {
          const newScore = { ...prev };
          if (game.isCheckmate()) {
            if (game.turn() === 'w') {
              newScore.blackWins++;
            } else {
              newScore.whiteWins++;
            }
          } else {
            newScore.draws++;
          }
          newScore.totalGames++;

          if (newScore.totalGames < tournamentGamesTarget) {
            tournamentTimerRef.current = setTimeout(() => {
              resetGame();
              startGame();
            }, 1500);
          }
          return newScore;
        });
      }
      return;
    }

    const currentAI = game.turn() === 'w' ? whiteAI : blackAI;

    try {
      const result = getAIMove(game, currentAI);
      game.move(result.move.san);

      setFen(game.fen());
      setMoveHistory([...game.history({ verbose: true })]);
      setLastMove({ from: result.move.from, to: result.move.to });
      setEvaluation(getSimpleEvaluation(game));
      setThinkingInfo(result.thinkingInfo);
      setStatus(updateStatus(game));

      if (!game.isGameOver() && isPlayingRef.current) {
        timerRef.current = setTimeout(makeAIMove, SPEED_MS[speed]);
      } else if (game.isGameOver()) {
        const finalStatus = updateStatus(game);
        setStatus(finalStatus);
        setIsPlaying(false);
        isPlayingRef.current = false;

        if (tournamentMode) {
          setTournamentScore(prev => {
            const newScore = { ...prev };
            if (game.isCheckmate()) {
              if (game.turn() === 'w') {
                newScore.blackWins++;
              } else {
                newScore.whiteWins++;
              }
            } else {
              newScore.draws++;
            }
            newScore.totalGames++;

            if (newScore.totalGames < tournamentGamesTarget) {
              tournamentTimerRef.current = setTimeout(() => {
                resetGame();
                startGame();
              }, 1500);
            }
            return newScore;
          });
        }
      }
    } catch {
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  }, [whiteAI, blackAI, speed, updateStatus, tournamentMode, tournamentGamesTarget]);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    isPlayingRef.current = true;
    setStatus('playing');
    timerRef.current = setTimeout(makeAIMove, SPEED_MS[speed]);
  }, [makeAIMove, speed]);

  const pauseGame = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setStatus('paused');
  }, []);

  const resumeGame = useCallback(() => {
    setIsPlaying(true);
    isPlayingRef.current = true;
    setStatus('playing');
    timerRef.current = setTimeout(makeAIMove, SPEED_MS[speed]);
  }, [makeAIMove, speed]);

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (tournamentTimerRef.current) {
      clearTimeout(tournamentTimerRef.current);
      tournamentTimerRef.current = null;
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
    gameRef.current = new Chess();
    setFen(gameRef.current.fen());
    setStatus('idle');
    setMoveHistory([]);
    setLastMove(null);
    setEvaluation(0);
    setThinkingInfo(null);
  }, []);

  const resetTournament = useCallback(() => {
    resetGame();
    setTournamentScore({ whiteWins: 0, blackWins: 0, draws: 0, totalGames: 0 });
  }, [resetGame]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (tournamentTimerRef.current) {
        clearTimeout(tournamentTimerRef.current);
      }
    };
  }, []);

  // Update speed in real-time
  useEffect(() => {
    if (isPlayingRef.current && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(makeAIMove, SPEED_MS[speed]);
    }
  }, [speed, makeAIMove]);

  return {
    fen,
    status,
    isPlaying,
    moveHistory,
    lastMove,
    whiteAI,
    blackAI,
    speed,
    evaluation,
    thinkingInfo,
    tournamentMode,
    tournamentScore,
    tournamentGamesTarget,
    turn: gameRef.current.turn(),
    setWhiteAI,
    setBlackAI,
    setSpeed,
    setTournamentMode,
    setTournamentGamesTarget,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    resetTournament,
  };
}
