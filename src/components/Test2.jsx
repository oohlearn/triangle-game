import React, { useState, useEffect } from 'react';
import '../App.css';

const BOARD_WIDTH = 600;
const BOARD_HEIGHT = 500;
const PEG_RADIUS = 10;
const TOKEN_RADIUS = 10;

const generatePegs = () => {
  const pegs = [];
  const rowCounts = [4, 5, 6, 7, 6, 5, 4];
  let yOffset = 40;
  let xOffset = 60;
  
  rowCounts.forEach((count, rowIndex) => {
    const xStep = 60;
    for (let i = 0; i < count; i++) {
      pegs.push({
        x: (i + 1) * xStep + xStep/2*(9-count) + xOffset,
        y: yOffset
      });
    }
    yOffset += 60; // Increased vertical spacing
  });
  return pegs;
};

const pegs = generatePegs();

const Test2 = () => {
  const [selectedPegs, setSelectedPegs] = useState([]);
  const [player, setPlayer] = useState(1);
  const [triangles, setTriangles] = useState([]);

  useEffect(() => {
    if (selectedPegs.length === 3) {
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
    } else if (selectedPegs.length < 4) {
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
        fill={selectedPegs.includes(index) ? 'red' : 'blue'}
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
          strokeWidth="1"
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
          stroke={triangle.player === 1 ? 'red' : 'blue'}
          strokeWidth="1"
        />
      );
    });
  };

  return (
    <svg width={BOARD_WIDTH} height={BOARD_HEIGHT}>
      <polygon 
        points="60,40 540,40 600,260 540,480 60,480 0,260"
        fill="none"
        stroke="black"
        strokeWidth="2"
      />
      {renderTriangles()}
      {renderRubberBands()}
      {renderPegs()}
    </svg>
  );
};

export default Test2;