
import React, { useState, useEffect } from 'react';
import '../App.css';
// import triangleEdges from '../triangleEdges.text';

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

//   // Define the edges that make up each triangle.
const triangleEdges = [  
    { id: 1, edges: [4, 5, 12] },
    { id: 2, edges: [1, 5, 6] },
    { id: 3, edges: [6, 7, 13] },
    { id: 4, edges: [2, 7, 8] },
    { id: 5, edges: [8, 9, 14] },
    { id: 6, edges: [3, 9, 10] },
    { id: 7, edges: [10, 11, 15] },
    { id: 8, edges: [16, 17, 26] },
    { id: 9, edges: [12, 17, 18] },
    { id: 10, edges: [18, 19, 27] },
    { id: 11, edges: [13, 19, 20] },
    { id: 12, edges: [20, 21, 28] },
    { id: 13, edges: [14, 21, 22] },
    { id: 14, edges: [22, 23, 29] },
    { id: 15, edges: [15, 23, 24] },
    { id: 16, edges: [24, 25, 30] },
    { id: 17, edges: [31, 32, 43] },
    { id: 18, edges: [26, 32, 33] },
    { id: 19, edges: [33, 34, 44] },
    { id: 20, edges: [27, 34, 35] },
    { id: 21, edges: [35, 36, 45] },
    { id: 22, edges: [28, 36, 37] },
    { id: 23, edges: [37, 38, 46] },
    { id: 24, edges: [29, 38, 39] },
    { id: 25, edges: [39, 40, 47] },
    { id: 26, edges: [30, 46, 41] },
    { id: 27, edges: [41, 42, 48] },
    { id: 28, edges: [43, 49, 50] },
    { id: 29, edges: [50, 51, 61] },
    { id: 30, edges: [44, 51, 52] },
    { id: 31, edges: [52, 53, 62] },
    { id: 32, edges: [45, 53, 54] },
    { id: 33, edges: [54, 55, 63] },
    { id: 34, edges: [46, 55, 56] },
    { id: 35, edges: [56, 57, 64] },
    { id: 36, edges: [47, 57, 58] },
    { id: 37, edges: [58, 59, 65] },
    { id: 38, edges: [48, 59, 60] },
    { id: 39, edges: [61, 66, 67] },
    { id: 40, edges: [67, 68, 76] },
    { id: 41, edges: [62, 68, 69] },
    { id: 42, edges: [69, 70, 77] },
    { id: 43, edges: [63, 70, 71] },
    { id: 44, edges: [71, 72, 78] },
    { id: 45, edges: [64, 72, 73] },
    { id: 46, edges: [73, 74, 79] },
    { id: 47, edges: [65, 74, 75] },
    { id: 48, edges: [76, 80, 81] },
    { id: 49, edges: [81, 82, 88] },
    { id: 50, edges: [77, 82, 83] },
    { id: 51, edges: [83, 84, 89] },
    { id: 52, edges: [78, 84, 85] },
    { id: 53, edges: [85, 86, 90] },
    { id: 54, edges: [79, 86, 87] }
  ];
  


const Test4 = () => {
  const [selectedPegs, setSelectedPegs] = useState([]);
  const [player, setPlayer] = useState(1);
  const [lines, setLines] = useState([]); // Store the permanent lines
  const [triangles, setTriangles] = useState([]); // Store the claimed triangles


// TODO共線檢查有問題待修正
  const arePegsCollinear = (pegIndices) => {
    if (pegIndices.length !== 4) return false;

    const [p1, p2, p3, p4] = pegIndices.map(index => pegs[index]);

    const slope12 = (p2.y - p1.y) / (p2.x - p1.x);
    const slope23 = (p3.y - p2.y) / (p3.x - p2.x);
    const slope34 = (p4.y - p3.y) / (p4.x - p3.x);

    return (slope12 === slope23) && (slope23 === slope34 );
  };

  const handlePegClick = (index) => {
    if (selectedPegs.includes(index)) {
        if (selectedPegs.index === 0 || selectedPegs.index === selectedPegs.length-1){
            setSelectedPegs(selectedPegs.filter(pegIndex => pegIndex !== index));
        }
    } else if (selectedPegs.length < 5 ) {
      setSelectedPegs([...selectedPegs, index]);
      console.log(selectedPegs);
      
    }
  };
// 先把共線檢查拿掉&& arePegsCollinear(selectedPegs)
  useEffect(() => {
    if (selectedPegs.length === 4 ) {
      const newLine = {
        points: selectedPegs,
        player: player
      };
      setLines([...lines, newLine]);
      console.log(lines)

      // Check for triangles that are completed by this new line
      triangleEdges.forEach(triangle => {
        const triangleComplete = triangle.edges.every(edge => 
          lines.some(line => 
            line.points.includes(edge[0]) && line.points.includes(edge[1])
          ) || 
          (newLine.points.includes(edge[0]) && newLine.points.includes(edge[1]))
        );

        if (triangleComplete && !triangles.some(t => t.id === triangle.id)) {
          setTriangles([...triangles, { id: triangle.id, player }]);
          console.log(triangles);
          
        }
      });

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

  const renderLines = () => {
    return lines.map((line, index) => {
      const [startPegIndex,second, third,  endPegIndex] = line.points;
      const startPeg = pegs[startPegIndex];
      const endPeg = pegs[endPegIndex];
      return (
        <line
          key={index}
          x1={startPeg.x}
          y1={startPeg.y}
          x2={endPeg.x}
          y2={endPeg.y}
          stroke={line.player === 1 ? 'red' : 'blue'}
          strokeWidth="2"
        />
      );
    });
  };

  const renderTriangles = () => {
    return triangles.map((triangle, index) => {
      const points = triangle.edges.map(edge => `${pegs[edge[0]].x},${pegs[edge[0]].y}`).join(' ');
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
          <span style={{ marginRight: "20px" }}>玩家1得分: {triangles.filter(t => t.player === 1).length}</span>
          <span>玩家2得分: {triangles.filter(t => t.player === 2).length}</span>
        </div>
      </div>
      <svg width={BOARD_WIDTH} height={BOARD_HEIGHT}>
        <rect width={BOARD_WIDTH} height={BOARD_HEIGHT} fill="lightgray" />
        {renderTriangles()}
        {renderLines()}
        {renderPegs()}
      </svg>
    </div>
  );
};

export default Test4;

