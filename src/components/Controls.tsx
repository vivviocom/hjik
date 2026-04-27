import type { AILevel, GameSpeed, GameStatus } from '../types';

interface ControlsProps {
  status: GameStatus;
  isPlaying: boolean;
  whiteAI: AILevel;
  blackAI: AILevel;
  speed: GameSpeed;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onWhiteAIChange: (level: AILevel) => void;
  onBlackAIChange: (level: AILevel) => void;
  onSpeedChange: (speed: GameSpeed) => void;
}

const AI_OPTIONS: { value: AILevel; label: string }[] = [
  { value: 'random', label: 'Random' },
  { value: 'greedy', label: 'Greedy' },
  { value: 'minimax', label: 'Minimax (AB)' },
];

const SPEED_OPTIONS: { value: GameSpeed; label: string }[] = [
  { value: 'slow', label: 'Slow' },
  { value: 'normal', label: 'Normal' },
  { value: 'fast', label: 'Fast' },
];

export default function Controls({
  status,
  isPlaying,
  whiteAI,
  blackAI,
  speed,
  onStart,
  onPause,
  onResume,
  onReset,
  onWhiteAIChange,
  onBlackAIChange,
  onSpeedChange,
}: ControlsProps) {
  const isGameOver = status === 'checkmate' || status === 'draw' || status === 'stalemate';
  const canStart = status === 'idle' && !isPlaying;
  const canPause = isPlaying && !isGameOver;
  const canResume = status === 'paused';

  return (
    <div className="controls-panel">
      <h3 className="panel-title">Controls</h3>

      <div className="button-group">
        {canStart && (
          <button className="btn btn-primary" onClick={onStart}>
            <span className="btn-icon">&#9654;</span> Start
          </button>
        )}
        {canPause && (
          <button className="btn btn-warning" onClick={onPause}>
            <span className="btn-icon">&#10074;&#10074;</span> Pause
          </button>
        )}
        {canResume && (
          <button className="btn btn-primary" onClick={onResume}>
            <span className="btn-icon">&#9654;</span> Resume
          </button>
        )}
        <button className="btn btn-danger" onClick={onReset}>
          <span className="btn-icon">&#8634;</span> Reset
        </button>
      </div>

      <div className="ai-selector">
        <label className="selector-label">
          <span className="piece-icon white-piece">&#9812;</span> White AI
        </label>
        <div className="radio-group">
          {AI_OPTIONS.map(opt => (
            <label key={`white-${opt.value}`} className={`radio-btn ${whiteAI === opt.value ? 'active' : ''}`}>
              <input
                type="radio"
                name="whiteAI"
                value={opt.value}
                checked={whiteAI === opt.value}
                onChange={() => onWhiteAIChange(opt.value)}
                disabled={isPlaying}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="ai-selector">
        <label className="selector-label">
          <span className="piece-icon black-piece">&#9818;</span> Black AI
        </label>
        <div className="radio-group">
          {AI_OPTIONS.map(opt => (
            <label key={`black-${opt.value}`} className={`radio-btn ${blackAI === opt.value ? 'active' : ''}`}>
              <input
                type="radio"
                name="blackAI"
                value={opt.value}
                checked={blackAI === opt.value}
                onChange={() => onBlackAIChange(opt.value)}
                disabled={isPlaying}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="speed-selector">
        <label className="selector-label">Speed</label>
        <div className="radio-group">
          {SPEED_OPTIONS.map(opt => (
            <label key={opt.value} className={`radio-btn ${speed === opt.value ? 'active' : ''}`}>
              <input
                type="radio"
                name="speed"
                value={opt.value}
                checked={speed === opt.value}
                onChange={() => onSpeedChange(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
