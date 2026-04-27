import type { TournamentScore } from '../types';

interface TournamentProps {
  tournamentMode: boolean;
  score: TournamentScore;
  gamesTarget: number;
  isPlaying: boolean;
  onToggleTournament: (enabled: boolean) => void;
  onGamesTargetChange: (target: number) => void;
  onResetTournament: () => void;
}

export default function Tournament({
  tournamentMode,
  score,
  gamesTarget,
  isPlaying,
  onToggleTournament,
  onGamesTargetChange,
  onResetTournament,
}: TournamentProps) {
  const totalPoints = score.whiteWins + score.blackWins + score.draws;
  const whitePercent = totalPoints > 0 ? (score.whiteWins / totalPoints) * 100 : 50;
  const drawPercent = totalPoints > 0 ? (score.draws / totalPoints) * 100 : 0;

  return (
    <div className="tournament-panel">
      <h3 className="panel-title">Tournament Mode</h3>

      <div className="tournament-toggle">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={tournamentMode}
            onChange={e => onToggleTournament(e.target.checked)}
            disabled={isPlaying}
          />
          <span className="toggle-slider" />
          Enable Tournament
        </label>
      </div>

      {tournamentMode && (
        <>
          <div className="tournament-games">
            <label className="selector-label">Games</label>
            <select
              className="select-input"
              value={gamesTarget}
              onChange={e => onGamesTargetChange(Number(e.target.value))}
              disabled={isPlaying}
            >
              <option value={5}>5 Games</option>
              <option value={10}>10 Games</option>
              <option value={20}>20 Games</option>
              <option value={50}>50 Games</option>
            </select>
          </div>

          <div className="score-board">
            <div className="score-header">
              <span>Progress: {score.totalGames} / {gamesTarget}</span>
            </div>
            <div className="score-bar">
              <div className="score-white" style={{ width: `${whitePercent}%` }} />
              <div className="score-draw" style={{ width: `${drawPercent}%` }} />
            </div>
            <div className="score-details">
              <div className="score-item">
                <span className="score-dot white-dot" />
                <span>White: {score.whiteWins}</span>
              </div>
              <div className="score-item">
                <span className="score-dot draw-dot" />
                <span>Draws: {score.draws}</span>
              </div>
              <div className="score-item">
                <span className="score-dot black-dot" />
                <span>Black: {score.blackWins}</span>
              </div>
            </div>
          </div>

          <button
            className="btn btn-secondary"
            onClick={onResetTournament}
            disabled={isPlaying}
          >
            Reset Tournament
          </button>
        </>
      )}
    </div>
  );
}
