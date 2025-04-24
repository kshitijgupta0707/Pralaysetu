
import { useEffect, useState } from 'react';

export const PralaySetuLoader = () => {
  const [hexSides, setHexSides] = useState([]);
  
  useEffect(() => {
    const sides = 6;
    const newHexSides = [];
    
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI / 3) * i;
      const nextAngle = (Math.PI / 3) * ((i + 1) % sides);
      
      const radius = 120;
      const centerX = 150;
      const centerY = 150;
      
      // Position the start point
      const x1 = centerX + radius * Math.cos(angle);
      const y1 = centerY + radius * Math.sin(angle);
      
      // Position the end point
      const x2 = centerX + radius * Math.cos(nextAngle);
      const y2 = centerY + radius * Math.sin(nextAngle);
      
      // Calculate the length and angle of the side
      const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const rotateAngle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
      
      newHexSides.push({
        id: i,
        length,
        left: x1,
        top: y1,
        angle: rotateAngle,
        delay: i * 0.3
      });
    }
    
    setHexSides(newHexSides);
  }, []);
  
  return (
    <div className="flex justify-center items-center w-full h-screen bg-slate-900">
      <div className="relative w-80 h-80">
        {/* Hexagon */}
        <div className="absolute w-full h-full top-0 left-0 animate-spin-slow">
    <div className="absolute w-full h-full rounded-full bg-gradient-to-r from-teal-500/20 to-purple-500/20 blur-xl"></div>
  </div>
        <div className="absolute w-full h-full top-0 left-[50%] -translate-x-1/2 ">
          {hexSides.map((side) => (
            <div
              key={side.id}
              className="absolute h-1 bg-teal-400 shadow-lg shadow-teal-400/50 origin-left"
              style={{
                width: `${side.length}px`,
                left: `${side.left}px`,
                top: `${side.top}px`,
                transform: `rotate(${side.angle}deg)`,
                animation: 'hexSideAnimation 2s infinite',
                animationDelay: `${side.delay}s`
              }}
            />
          ))}
        </div>
        
        {/* Logo & Brand */}
        <div className="absolute top-[50%] left-[67%]  -translate-x-1/2  text-center animate-float">
          {/* <div className="mx-auto w-20 h-20 rounded-full bg-teal-400 flex justify-center items-center shadow-lg shadow-teal-400/50 mb-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex justify-center items-center text-teal-400 text-2xl font-bold">
              PS
            </div>
          </div> */}
          <div className="text-white font-bold text-xl uppercase tracking-wider">
            PralaySetu
          </div>
          <div className="text-slate-400 text-sm italic mt-1">
            Bridging Crisis to Safety
          </div>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes hexSideAnimation {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%); }
          50% { transform: translate(-50%, -60%); }
        }
      `}</style>
    </div>
  );
}


