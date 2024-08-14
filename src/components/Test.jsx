import React, { useState, useEffect } from 'react';
import '../App.css';

const BOARD_WIDTH = 600;
const BOARD_HEIGHT = 500;
const PEG_RADIUS = 15;
const TOKEN_RADIUS = 10;

const generatePegs = () => {
  const pegs = [];
  const rowCounts = [4, 5, 6, 7, 6, 5, 4];
  let yOffset = 80;
  let xOffset = 70;
  rowCounts.forEach((count, rowIndex) => {
    const xStep = 60;
    for (let i = 0; i < count; i++) {
      pegs.push({
        x: (i + 1) * xStep +xStep/2*(7-count)+ xOffset,
        y: yOffset
      });
    }
    yOffset += xStep/2*1.732; // 每行之间的垂直间距
  });
  return pegs;
};

const pegs = generatePegs();

const Test = () => {
  const [selectedPegs, setSelectedPegs] = useState([]);
  const [player, setPlayer] = useState(1);
  const [triangles, setTriangles] = useState([]);

  useEffect(() => {
    if (selectedPegs.length === 4) {
      const newTriangle = {
        points: selectedPegs,
        player: player
      };
      setTriangles([...triangles, newTriangle]);
      setSelectedPegs([]);
      setPlayer(player === 1 ? 2 : 1);
    }
  }, [selectedPegs]);

  const handlePegClick = (index) => {
    if (selectedPegs.includes(index)) {
      setSelectedPegs(selectedPegs.filter(pegIndex => pegIndex !== index));
    } else if (selectedPegs.length < 5) {
      setSelectedPegs([...selectedPegs, index]);
    }
  };

  const renderPegs = () => {
    return pegs.map((peg, index) => (
      <circle
        key={index}
        cx={peg.x}
        cy={peg.y}
        r={PEG_RADIUS}
        fill={selectedPegs.includes(index) ? 'red' : 'darkblue'}
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
          stroke="black"
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
          fill={triangle.player === 1 ? 'rgba(255,0,0,0.3)' : 'rgba(0,0,255,0.3)'}
          stroke={triangle.player === 1 ? 'purple' : 'gray'}
          strokeWidth="2"
        />
      );
    });
  };

  return (
    <div className="App">
      <h1>三角連鎖棋</h1>
      <div className="game-info">
        <p>目前玩家: {player}</p>
        <div>
        <span style={{marginRight:"20px"}}>玩家1得分: {triangles.filter(t => t.player === 1).length}</span>

        <span>玩家2得分: {triangles.filter(t => t.player === 2).length}</span>
          
        </div>
      </div>
      <svg width={BOARD_WIDTH} height={BOARD_HEIGHT}>
        <rect width={BOARD_WIDTH} height={BOARD_HEIGHT} fill="lightgray" />
        {renderTriangles()}
        {renderRubberBands()}
        {renderPegs()}
      </svg>
    </div>
  );
};

export default Test;