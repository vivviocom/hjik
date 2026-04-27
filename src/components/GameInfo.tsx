import type { Move } from 'chess.js';
import type { GameStatus, AIThinkingInfo } from '../types';

interface GameInfoProps {
  status: GameStatus;
  turn: string;
  moveHistory: Move[];
  evaluation: number;
  thinkingInfo: AIThinkingInfo | null;
}

function formatMoveHistory(moves: Move[]): { num: number; white: string; black: string }[] {
  const rows: { num: number; white: string; black: string }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    rows.push({
      num: Math.floor(i / 2) + 1,
      white: moves[i]?.san || '',
      black: moves[i + 1]?.san || '',
    });
  }
  return rows;
}

function getStatusText(status: GameStatus): string {
  switch (status) {
    case 'idle': return 'Ready to Start';
    case 'playing': return 'Playing';
    case 'paused': return 'Paused';
    case 'check': return 'Check!';
    case 'checkmate': return 'Checkmate!';
    case 'draw': return 'Draw';
    case 'stalemate': return 'Stalemate';
    default: return '';
  }
}

function getStatusClass(status: GameStatus): string {
  switch (status) {
    case 'check': return 'status-check';
    case 'checkmate': return 'status-checkmate';
    case 'draw':
    case 'stalemate': return 'status-draw';
    case 'playing': return 'status-playing';
    default: return '';
  }
}

export default function GameInfo({ status, turn, moveHistory, evaluation, thinkingInfo }: GameInfoProps) {
  const moveRows = formatMoveHistory(moveHistory);
  const evalPercent = ((evaluation + 10) / 20) * 100;
  const evalClamped = Math.max(5, Math.min(95, evalPercent));

  return (
    <div className="game-info-panel">
      <h3 className="panel-title">Game Info</h3>

      <div className={`status-badge ${getStatusClass(status)}`}>
        {getStatusText(status)}
      </div>

      <div className="turn-indicator">
        <span className="turn-label">Turn:</span>
        <span className={`turn-value ${turn === 'w' ? 'white-turn' : 'black-turn'}`}>
          {turn === 'w' ? '\u2654 White' : '\u265A Black'}
        </span>
      </div>

      <div className="eval-section">
        <label className="eval-label">Evaluation</label>
        <div className="eval-bar">
          <div className="eval-fill" style={{ width: `${evalClamped}%` }} />
          <span className="eval-text">
            {evaluation > 0 ? '+' : ''}{evaluation.toFixed(1)}
          </span>
        </div>
        <div className="eval-labels">
          <span>Black</span>
          <span>Equal</span>
          <span>White</span>
        </div>
      </div>

      {thinkingInfo && (
        <div className="thinking-info">
          <h4 className="thinking-title">AI Thinking</h4>
          <div className="thinking-grid">
            <span className="thinking-key">Depth</span>
            <span className="thinking-val">{thinkingInfo.depth}</span>
            <span className="thinking-key">Eval</span>
            <span className="thinking-val">{thinkingInfo.evaluation > 0 ? '+' : ''}{thinkingInfo.evaluation.toFixed(2)}</span>
            <span className="thinking-key">Best</span>
            <span className="thinking-val highlight">{thinkingInfo.bestMove}</span>
            <span className="thinking-key">Nodes</span>
            <span className="thinking-val">{thinkingInfo.nodesSearched.toLocaleString()}</span>
            <span className="thinking-key">Time</span>
            <span className="thinking-val">{thinkingInfo.timeMs.toFixed(0)}ms</span>
          </div>
        </div>
      )}

      <div className="move-history">
        <h4 className="history-title">Move History</h4>
        <div className="move-list">
          {moveRows.length === 0 ? (
            <div className="no-moves">No moves yet</div>
          ) : (
            moveRows.map(row => (
              <div key={row.num} className="move-row">
                <span className="move-num">{row.num}.</span>
                <span className="move-white">{row.white}</span>
                <span className="move-black">{row.black}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
