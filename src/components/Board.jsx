import React, { useState, useEffect } from 'react';
import "../App.css"

const BOARD_SIZE = 500;
const PEG_RADIUS = 4;

const generatePegs = () => {
  const pegs = [];
  const rows = 5;
  const cols = 5;
  const centerX = BOARD_SIZE / 2;
  const centerY = BOARD_SIZE / 2;
  const hexRadius = BOARD_SIZE / 2 * 0.95;
  
  for (let row = -rows; row <= rows; row++) {
    const rowPegs = cols - Math.abs(row);
    for (let col = -Math.floor(rowPegs/2); col <= Math.floor(rowPegs/2); col++) {
      const x = centerX + hexRadius * (Math.sqrt(3) * col + Math.sqrt(3)/2 * row) / rows;
      const y = centerY + hexRadius * (3/2 * row) / rows;
      pegs.push({ x, y });
    }
  }
  return pegs;
};

const pegs = generatePegs();

const Board = () => {
  const [selectedPegs, setSelectedPegs] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [triangles, setTriangles] = useState([]);
  const [playerCount, setPlayerCount] = useState(2);
  const [playerScores, setPlayerScores] = useState([0, 0, 0, 0]);

  useEffect(() => {
    if (selectedPegs.length === 4) {
      const newTriangle = {
        points: selectedPegs,
        player: currentPlayer
      };
      setTriangles([...triangles, newTriangle]);
      setSelectedPegs([]);
      nextTurn();
      updateScores();
    }
  }, [selectedPegs]);

  const nextTurn = () => {
    setCurrentPlayer((prev) => (prev % playerCount) + 1);
  };

  const updateScores = () => {
    // 這裡需要實現正確的計分邏輯
    const newScores = [...playerScores];
    newScores[currentPlayer - 1]++;
    setPlayerScores(newScores);
  };

  const handlePegClick = (index) => {
    if (selectedPegs.includes(index)) {
      setSelectedPegs(selectedPegs.filter(pegIndex => pegIndex !== index));
    } else if (selectedPegs.length < 4) {
      setSelectedPegs([...selectedPegs, index]);
    }
  };

  const renderBoard = () => {
    const centerX = BOARD_SIZE / 2;
    const centerY = BOARD_SIZE / 2;
    const hexRadius = BOARD_SIZE / 2 * 0.95;
    const hexPoints = [
      [0, -1], [Math.sqrt(3)/2, -0.5], [Math.sqrt(3)/2, 0.5],
      [0, 1], [-Math.sqrt(3)/2, 0.5], [-Math.sqrt(3)/2, -0.5]
    ].map(([x, y]) => `${centerX + x * hexRadius},${centerY + y * hexRadius}`).join(' ');

    return (
      <svg width={BOARD_SIZE} height={BOARD_SIZE}>
        <polygon points={hexPoints} fill="black" stroke="gray" strokeWidth="10" />
        {renderTriangles()}
        {renderRubberBands()}
        {renderPegs()}
      </svg>
    );
  };

  const renderPegs = () => {
    return pegs.map((peg, index) => (
      <circle
        key={index}
        cx={peg.x}
        cy={peg.y}
        r={PEG_RADIUS}
        fill={selectedPegs.includes(index) ? 'red' : 'white'}
        onClick={() => handlePegClick(index)}
      />
    ));
  };

  const renderRubberBands = () => {
    return selectedPegs.map((pegIndex, index) => {
      const nextPegIndex = selectedPegs[(index + 1) % selectedPegs.length];
      const startPeg = pegs[pegIndex];
      const endPeg = pegs[nextPegIndex];
      return (
        <line
          key={`${pegIndex}-${nextPegIndex}`}
          x1={startPeg.x}
          y1={startPeg.y}
          x2={endPeg.x}
          y2={endPeg.y}
          stroke="yellow"
          strokeWidth="2"
        />
      );
    });
  };

  const renderTriangles = () => {
    return triangles.map((triangle, index) => {
      const points = triangle.points.map(pegIndex => `${pegs[pegIndex].x},${pegs[pegIndex].y}`).join(' ');
      return (
        <polygon
          key={index}
          points={points}
          fill={`rgba(${triangle.player === 1 ? '255,0,0' : '0,0,255'},0.3)`}
          stroke={triangle.player === 1 ? 'red' : 'blue'}
          strokeWidth="2"
        />
      );
    });
  };

  const resetGame = () => {
    setSelectedPegs([]);
    setCurrentPlayer(1);
    setTriangles([]);
    setPlayerScores([0, 0, 0, 0]);
  };

  return (
    <div className="game-container">
      <h1>三角連鎖棋</h1>
      
      <div className="current-player">
        輪到：玩家{currentPlayer} <span className={`player-token player-${currentPlayer}`}></span>
      </div>
      
      <div className="game-board">
        {renderBoard()}
      </div>
      
      <div className="player-scores">
        {playerScores.slice(0, playerCount).map((score, index) => (
          <div key={index} className="player-score">
            玩家{index + 1} <span className={`player-token player-${index + 1}`}></span>
            佔領棋子：{score}個
          </div>
        ))}
      </div>
      
      <button onClick={resetGame}>重新開始遊戲</button>
      
      <div className="player-selection">
        玩家人數：
        {[2, 3, 4].map(count => (
          <button 
            key={count}
            onClick={() => { setPlayerCount(count); resetGame(); }}
            className={playerCount === count ? 'active' : ''}
          >
            {count}人
          </button>
        ))}
        <button 
          onClick={() => { setPlayerCount(1); resetGame(); }}
          className={playerCount === 1 ? 'active' : ''}
        >
          1VS電腦
        </button>
      </div>
    </div>
  );
};

export default Board;