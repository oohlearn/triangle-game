
// chatGPT 

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
        x: (i + 1) * xStep + xStep/2 * (7 - count) + xOffset,
        y: yOffset
      });
    }
    yOffset += xStep / 2 * 1.732; // 每行之间的垂直间距
  });
  return pegs;
};

const pegs = generatePegs();

const Test3 = () => {
  const [selectedPegs, setSelectedPegs] = useState([]);
  const [player, setPlayer] = useState(1);
  const [triangles, setTriangles] = useState([]);

  // Function to check if four pegs are collinear (i.e., form a straight line)
  const arePegsCollinear = (pegIndices) => {
    if (pegIndices.length !== 4) return false;

    const [p1, p2, p3, p4] = pegIndices.map(index => pegs[index]);
    
    // Calculate slopes between each pair
    const slope12 = (p2.y - p1.y) / (p2.x - p1.x);
    const slope13 = (p3.y - p1.y) / (p3.x - p1.x);
    const slope14 = (p4.y - p1.y) / (p4.x - p1.x);

    return (slope12 === slope13) && (slope13 === slope14);
  };

  const handlePegClick = (index) => {
    if (selectedPegs.includes(index)) {
      setSelectedPegs(selectedPegs.filter(pegIndex => pegIndex !== index));
    } else if (selectedPegs.length < 4) {
      setSelectedPegs([...selectedPegs, index]);
    }
  };

  useEffect(() => {
    if (selectedPegs.length === 4 && arePegsCollinear(selectedPegs)) {
      const newTriangle = {
        points: selectedPegs,
        player: player
      };
      setTriangles([...triangles, newTriangle]);
      setSelectedPegs([]);
      setPlayer(player === 1 ? 2 : 1);
    }
  }, [selectedPegs]);

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
      const points = triangle.points.map(index => `${pegs[index].x},${pegs[index].y}`).join(' ');
      return (
        <polygon
          key={index}
          points={points}
          fill={triangle.player === 1 ? 'red' : 'blue'}
          opacity="0.5"
        />
      );
    });
  };

  return (
    <svg width={BOARD_WIDTH} height={BOARD_HEIGHT}>
      {renderPegs()}
      {renderRubberBands()}
      {renderTriangles()}
    </svg>
  );
};

export default Test3;
