import { useEffect, useRef } from 'react';
import kaplay from 'kaplay';

// Make kaplay globally available
(window as any).kaplay = kaplay;

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Import and initialize game after component mounts
    const initGame = async () => {
      if (canvasRef.current && !window.k) {
        console.log('Canvas ready for KAPLAY');
        // Dynamically import the game only once
        await import('./game.js');
      }
    };
    
    initGame();
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
      <canvas 
        ref={canvasRef}
        id="gameCanvas"
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block'
        }}
      />
    </div>
  );
}

export default App;