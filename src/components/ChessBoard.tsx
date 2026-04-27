import { Chessboard } from 'react-chessboard';
import type { Square } from 'chess.js';

interface ChessBoardProps {
  fen: string;
  lastMove: { from: Square; to: Square } | null;
}

export default function ChessBoard({ fen, lastMove }: ChessBoardProps) {
  const customSquareStyles: Record<string, React.CSSProperties> = {};

  if (lastMove) {
    customSquareStyles[lastMove.from] = {
      backgroundColor: 'rgba(0, 255, 170, 0.25)',
      borderRadius: '0',
    };
    customSquareStyles[lastMove.to] = {
      backgroundColor: 'rgba(0, 255, 170, 0.4)',
      borderRadius: '0',
    };
  }

  return (
    <div className="board-container">
      <Chessboard
        options={{
          position: fen,
          allowDragging: false,
          animationDurationInMs: 300,
          boardStyle: {
            borderRadius: '8px',
            boxShadow: '0 0 40px rgba(0, 255, 170, 0.15), 0 8px 32px rgba(0, 0, 0, 0.5)',
          },
          darkSquareStyle: { backgroundColor: '#1a2332' },
          lightSquareStyle: { backgroundColor: '#2a3a4a' },
          squareStyles: customSquareStyles,
        }}
      />
    </div>
  );
}
