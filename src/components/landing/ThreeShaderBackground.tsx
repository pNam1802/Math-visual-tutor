import React, { useEffect, useRef } from 'react';

interface MathGridCanvasBackgroundProps {
  theme?: 'dark' | 'light';
}

export const ThreeShaderBackground: React.FC<MathGridCanvasBackgroundProps> = ({ theme = 'dark' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    let time = 0;

    // Mathematical parameters for dynamic wave & coordinate field
    const gridSize = 48; // Crisp 48px Cartesian graph paper grid

    const render = () => {
      time += 0.012;

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');

      // Authentic chalkboard / warm cream graph paper background base
      const bgCol = isDark ? '#121316' : '#FAF7F2';
      const gridCol = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(28, 27, 26, 0.04)';
      const subGridCol = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(28, 27, 26, 0.07)';
      const waveCol1 = isDark ? 'rgba(242, 98, 7, 0.26)' : 'rgba(242, 98, 7, 0.18)'; // Replit Signature Orange
      const waveCol2 = isDark ? 'rgba(255, 119, 41, 0.20)' : 'rgba(245, 158, 11, 0.14)'; // Amber Gold
      const waveCol3 = isDark ? 'rgba(16, 185, 129, 0.18)' : 'rgba(5, 150, 105, 0.12)'; // Emerald
      const dotCol = isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(28, 27, 26, 0.10)';

      // Fill background
      ctx.fillStyle = bgCol;
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Cartesian Coordinate Grid
      ctx.lineWidth = 1;
      ctx.strokeStyle = gridCol;
      ctx.beginPath();
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Draw Major Axis lines every 4th grid
      ctx.strokeStyle = subGridCol;
      ctx.beginPath();
      for (let x = (width / 2) % (gridSize * 4); x <= width; x += gridSize * 4) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = (height / 2) % (gridSize * 4); y <= height; y += gridSize * 4) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 3. Draw Grid Intersection Points (Desmos / Math CAD style)
      ctx.fillStyle = dotCol;
      for (let x = gridSize; x < width; x += gridSize * 2) {
        for (let y = gridSize; y < height; y += gridSize * 2) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Draw Harmonic Mathematical Wave 1 (Sine Series)
      const centerY = height * 0.52;
      ctx.lineWidth = 2;
      ctx.strokeStyle = waveCol1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 4) {
        const k = (x / width) * Math.PI * 4;
        const y = centerY + Math.sin(k + time) * 60 + Math.sin(k * 2 - time * 0.8) * 25;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 5. Draw Harmonic Mathematical Wave 2 (Cosine Superposition - Amber)
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = waveCol2;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 4) {
        const k = (x / width) * Math.PI * 3.5;
        const y = centerY + Math.cos(k * 1.2 - time * 1.1) * 75 + Math.sin(k * 0.5 + time * 0.5) * 35;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 6. Draw Harmonic Wave 3 (High-frequency Envelope - Emerald)
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = waveCol3;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 4) {
        const k = (x / width) * Math.PI * 5;
        const y = centerY + Math.sin(k - time * 0.6) * 45 + Math.cos(k * 1.5 + time * 0.9) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 7. Subtle radial vignette overlay to keep text sharp and prominent
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.2,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, isDark ? 'rgba(14, 17, 23, 0.85)' : 'rgba(248, 250, 252, 0.85)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
