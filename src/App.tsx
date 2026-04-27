import ChessBoard from './components/ChessBoard';
import Controls from './components/Controls';
import GameInfo from './components/GameInfo';
import Tournament from './components/Tournament';
import { useChessGame } from './hooks/useChessGame';
import './App.css';

function App() {
  const game = useChessGame();

  return (
    <div className="app">
      <header className="header">
        <div className="header-glow" />
        <h1 className="title">
          <span className="title-icon">&#9816;</span>
          AI Chess Simulator
          <span className="title-icon">&#9822;</span>
        </h1>
        <p className="subtitle">Watch intelligent agents compete in real-time</p>
      </header>

      <main className="main-layout">
        <aside className="side-panel left-panel">
          <Controls
            status={game.status}
            isPlaying={game.isPlaying}
            whiteAI={game.whiteAI}
            blackAI={game.blackAI}
            speed={game.speed}
            onStart={game.startGame}
            onPause={game.pauseGame}
            onResume={game.resumeGame}
            onReset={game.resetGame}
            onWhiteAIChange={game.setWhiteAI}
            onBlackAIChange={game.setBlackAI}
            onSpeedChange={game.setSpeed}
          />
          <Tournament
            tournamentMode={game.tournamentMode}
            score={game.tournamentScore}
            gamesTarget={game.tournamentGamesTarget}
            isPlaying={game.isPlaying}
            onToggleTournament={game.setTournamentMode}
            onGamesTargetChange={game.setTournamentGamesTarget}
            onResetTournament={game.resetTournament}
          />
        </aside>

        <section className="board-section">
          <div className="player-tag top-player">
            <span className="piece-icon black-piece">&#9818;</span>
            <span>Black AI ({game.blackAI})</span>
          </div>
          <ChessBoard fen={game.fen} lastMove={game.lastMove} />
          <div className="player-tag bottom-player">
            <span className="piece-icon white-piece">&#9812;</span>
            <span>White AI ({game.whiteAI})</span>
          </div>
        </section>

        <aside className="side-panel right-panel">
          <GameInfo
            status={game.status}
            turn={game.turn}
            moveHistory={game.moveHistory}
            evaluation={game.evaluation}
            thinkingInfo={game.thinkingInfo}
          />
        </aside>
      </main>

      <footer className="footer">
        <span>AI Chess Simulator &mdash; Built with React + chess.js</span>
      </footer>
    </div>
  );
}

export default App;
