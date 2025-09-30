import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3-force";


/* ID LIST
Uni 1 KTH, Uni 2 Chalmers, Uni 3 Lund University
Area 1 AI in Wireless
Area 2 MIMO 
Area 3 Reliable Channles

*/

const allPapers = [
  { id: 1, uniId: 1, areaId: 1, author: "A. Smith, B. Johnson", title: "AI Optimization in Wireless Networks", link: "#", color: "#a5b4fc" },
  { id: 2, uniId: 2, areaId: 1, author: "C. Lee, D. Kim", title: "Beamforming Techniques for 5G Systems", link: "#", color: "#fca5a5" },
  { id: 3, uniId: 2, areaId: 2, author: "E. Martinez, F. Rossi", title: "MIMO Channel Estimation in Urban Environments", link: "#", color: "#a5b4fc" },
  { id: 4, uniId: 3, areaId: 2, author: "G. Chen, H. Patel", title: "Adaptive MIMO Algorithms for Low-Latency Networks", link: "#", color: "#fca5a5" },
  { id: 5, uniId: 1, areaId: 3, author: "I. Nguyen, J. Garcia", title: "Reliability Assessment in Wireless Sensor Networks", link: "#", color: "#0c143bff" },
  { id: 6, uniId: 2, areaId: 1, author: "K. Suzuki, L. Brown", title: "Deep Learning for Beamforming in 5G", link: "#", color: "#fca5a5" },
  { id: 7, uniId: 1, areaId: 2, author: "M. Wilson, N. Ahmed", title: "Optimizing MIMO Performance with AI", link: "#", color: "#a5b4fc" },
  { id: 8, uniId: 2, areaId: 2, author: "O. Silva, P. Kumar", title: "Massive MIMO: Challenges and Solutions", link: "#", color: "#fca5a5" },
  { id: 9, uniId: 3, areaId: 1, author: "Q. Li, R. Fernandez", title: "AI-Driven Interference Management in Wireless Networks", link: "#", color: "#a5b4fc" },
  { id: 10, uniId: 3, areaId: 3, author: "S. Becker, T. Wang", title: "Reliability Modeling of IoT Devices in Industrial Networks", link: "#", color: "#fde68a" },
  { id: 11, uniId: 1, areaId: 1, author: "U. Patel, V. Gonzalez", title: "Reinforcement Learning for Network Resource Allocation", link: "wikipedia.com", color: "#a5b4fc" },
  { id: 12, uniId: 3, areaId: 2, author: "W. Chen, X. Lopez", title: "Next-Generation MIMO Techniques for Smart Cities", link: "#", color: "#fca5a5" },
  { id: 13, uniId: 2, areaId: 3, author: "Y. Nakamura, Z. Rossi", title: "Reliability Analysis of Autonomous Vehicle Communication", link: "#", color: "#86efac" },
  { id: 14, uniId: 2, areaId: 1, author: "A. Singh, B. Kim", title: "AI-Enhanced Beamforming for Millimeter-Wave Networks", link: "#", color: "#fde68a" },
  { id: 15, uniId: 1, areaId: 2, author: "C. Oliveira, D. Tan", title: "Scalable MIMO Architectures for 6G Systems", link: "#", color: "#fca5a5" },
  { id: 16, uniId: 3, areaId: 3, author: "E. Torres, F. Liu", title: "Fault-Tolerant Communication in Wireless Sensor Networks", link: "#", color: "#0c143bff" },
  { id: 17, uniId: 2, areaId: 2, author: "G. Ramirez, H. Zhou", title: "Energy-Efficient MIMO Transceiver Design", link: "#", color: "#a5b4fc" },
  { id: 18, uniId: 2, areaId: 1, author: "I. Brown, J. Kim", title: "Neural Network-Based Interference Cancellation", link: "#", color: "#fca5a5" },
  { id: 19, uniId: 1, areaId: 3, author: "K. Yang, L. Gonzalez", title: "Reliability Metrics for Industrial 5G Networks", link: "#", color: "#86efac" },
  { id: 20, uniId: 1, areaId: 1, author: "M. Silva, N. Ahmed", title: "AI-Assisted Beamforming in Massive MIMO Systems", link: "https://www.wikipedia.com", color: "#fde68a" }
];



const latestPapers = allPapers
  .slice() // copy the array so original isn't mutated
  .sort((a, b) => b.id - a.id)
  .slice(0, 3);

const bubbles = [
  { id: 1, uniId: 1, areaId: 1, x: 100, y: 100, r: 60, color: "#a5b4fc", label: "KTH", area: "AI in Wireless" },
  { id: 2, uniId: 2, areaId: 1, x: 200, y: 150, r: 50, color: "#a5b4fc", label: "Chalmers", area: "AI in Wireless" },
  { id: 3, uniId: 3, areaId: 1, x: 300, y: 200, r: 80, color: "#a5b4fc", label: "Lund University", area: "AI in Wireless" },
  { id: 4, uniId: 1, areaId: 2, x: 400, y: 250, r: 40, color: "#fca5a5", label: "KTH", area: "MIMO" },
  { id: 5, uniId: 2, areaId: 2, x: 500, y: 300, r: 60, color: "#fca5a5", label: "Chalmers", area: "MIMO" },
  { id: 6, uniId: 3, areaId: 2, x: 600, y: 400, r: 50, color: "#fca5a5", label: "Lund University", area: "MIMO" },
  { id: 7, uniId: 1, areaId: 3, x: 700, y: 450, r: 60, color: "#a5fcb8ff", label: "KTH", area: "Reliable Channels" },
  { id: 8, uniId: 2, areaId: 3, x: 800, y: 500, r: 50, color: "#a5fcb8ff", label: "Chalmers", area: "Reliable Channels" },
  { id: 9, uniId: 3, areaId: 3, x: 900, y: 600, r: 80, color: "#a5fcb8ff", label: "Lund University", area: "Reliable Channels" },
];

const handleBubbleClick = (bubble) => {
  const associatedPapers = allPapers.filter(
    (p) => p.uniId === bubble.uniId && p.areaId === bubble.areaId
  );
  setSelected({ ...bubble, papers: associatedPapers });
  //console.log({ ...bubble, papers: associatedPapers })
};


export default function ResearchMap() {
  const [selected, setSelected] = useState(null);
  const [bubblesWithCount, setBubblesWithCount] = useState([]);

  useEffect(() => {
  // Compute paper counts and initial radius
  const initialBubbles = bubbles.map(b => {
    const papersCount = allPapers.filter(
      p => p.uniId === b.uniId && p.areaId === b.areaId
    ).length;
    return {
      ...b,
      papersCount,
      r: 50 + papersCount * 10,
      x: Math.random() * 200 + 100,
      y: Math.random() * 200 + 100
    };
  });

  console.log(initialBubbles)
  const simulation = d3.forceSimulation(initialBubbles)
    .force("charge", d3.forceManyBody().strength(-5))
    .force("center", d3.forceCenter(1000 / 2, 800 / 2))
    .force("collision", d3.forceCollide().radius(d => d.r + 1))
    .stop();
    

  for (let i = 0; i < 200; i++) simulation.tick();

  // Store final positions in state
  setBubblesWithCount([...initialBubbles]);
}, []);


  

  /*const bubblesWithCount = bubbles.map((b) => {
    const papersCount = allPapers.filter(
      (p) => p.uniId === b.uniId && p.areaId === b.areaId
    ).length;

    return {
      ...b,
      papersCount,
      r: 30 + papersCount * 10, // radius grows with number of papers
      x: Math.random() * 800,    // initial random x
      y: Math.random() * 600,    // initial random y
    };
  });*/

  const svgWidth = 1200;
  const svgHeight = 1000;
  //const columns = 4;





  const handleBubbleClick = (bubble) => {
    const associatedPapers = allPapers.filter(
      (p) => p.uniId === bubble.uniId && p.areaId === bubble.areaId
    );
    setSelected({ ...bubble, papers: associatedPapers });
    //console.log({ ...bubble, papers: associatedPapers })
  };

  return (
    <div className="flex flex-row h-screen w-screen bg-white">
      
      {/* Bubble Map */}
      <div className="flex-1 flex-row items-center justify-center">
        {/*Heading */}
      <h1 className="text-3xl font-extrabold mb-4 px-4 py-4">RESEARCH MAP WS</h1>

        <svg width="100%" height="100%">
          {bubblesWithCount.map((b) => (
            <motion.circle
              key={b.id}
              cx={b.x}
              cy={b.y}
              r={b.r}
              fill={b.color}
              whileHover={{ scale: 1.1 }}
              onClick={() => handleBubbleClick(b)}
              className="cursor-pointer shadow-md"
            />
          ))}
          {bubblesWithCount.map((b) => (
            <text key={b.id + "label"} x={b.x} y={b.y} textAnchor="middle" dy=".3em" className="font-bold">
              {b.label}
            </text>
          ))}
        </svg>
      </div>

      {/* Sidebar */}
      <div className="w-64 p-4 border-l border-gray-300">
        <h2 className="font-bold mb-2">Latest Papers</h2>
        {latestPapers.map((p) => (
          <a key={p.id} href={p.link} className="block mb-2 p-2 rounded" style={{ backgroundColor: p.color }}>
            <div className="font-bold">{p.author}</div>
            <div className="text-sm">{p.title}</div>
          </a>
        ))}
      </div>

      {/* Modal for bubble click */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-2">{selected.label}</h3>
            <p className="mb-2">Research Area: {selected.area}</p>
            <ul className="list-disc ml-5">
              {selected.papers.map((p) => (
                <li key={p.id}>
                  <a href={p.link} className="text-blue-600 underline">{p.title}</a>
                </li>
              ))}
            </ul>
            <button className="mt-4 bg-gray-200 rounded px-4 py-2" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Legend */}
    <div className="fixed bottom-4 left-4 bg-white p-3 rounded shadow-lg border border-gray-300">
      <h4 className="font-bold mb-2 text-sm">Research Areas</h4>
      <div className="flex flex-col gap-1 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#a5b4fc] rounded-full"></div>
          <span>AI in Wireless</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#fca5a5] rounded-full"></div>
          <span>MIMO</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#86efac] rounded-full"></div>
          <span>Reliable Channels</span>
        </div>
      </div>
      </div>
    </div>

    

    
  );
}
