import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Compass, TrendingUp, Maximize2 } from 'lucide-react';

interface HeroLiveMathDemoProps {
  onOpenApp: () => void;
}

export const HeroLiveMathDemo: React.FC<HeroLiveMathDemoProps> = ({ onOpenApp }) => {
  const [angleDeg, setAngleDeg] = useState<number>(45);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [mode, setMode] = useState<'trig' | 'parabola'>('trig');

  // Auto animation loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAngleDeg((prev) => (prev + 0.8) % 360);
    }, 20);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const rad = (angleDeg * Math.PI) / 180;
  const cosVal = Math.cos(rad);
  const sinVal = Math.sin(rad);

  // SVG coordinates for R = 85
  const cx = 130;
  const cy = 130;
  const r = 85;
  const px = cx + r * cosVal;
  const py = cy - r * sinVal;

  return (
    <div className="relative w-full max-w-lg mx-auto bg-white dark:bg-[#181A20] rounded-2xl border border-[#EAE4D9] dark:border-[#26282E] shadow-sm overflow-hidden transition-colors">
      
      {/* Top Demo Card Bar */}
      <div className="px-5 py-3.5 border-b border-[#EAE4D9] dark:border-[#26282E] flex items-center justify-between bg-[#FAF7F2] dark:bg-[#121316]">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EAE4D9] dark:bg-slate-700"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#EAE4D9] dark:bg-slate-700"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#EAE4D9] dark:bg-slate-700"></span>
          </div>
          <span className="font-mono text-xs font-semibold text-[#1C1B1A] dark:text-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Math Simulation
          </span>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-[#EAE4D9]/60 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-medium">
          <button
            onClick={() => setMode('trig')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              mode === 'trig'
                ? 'bg-white dark:bg-[#F26207] text-[#F26207] dark:text-white shadow-2xs font-semibold'
                : 'text-[#625F59] dark:text-slate-400 hover:text-[#1C1B1A] dark:hover:text-white'
            }`}
          >
            Lượng giác
          </button>
          <button
            onClick={() => setMode('parabola')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              mode === 'parabola'
                ? 'bg-white dark:bg-[#F26207] text-[#F26207] dark:text-white shadow-2xs font-semibold'
                : 'text-[#625F59] dark:text-slate-400 hover:text-[#1C1B1A] dark:hover:text-white'
            }`}
          >
            Parabol
          </button>
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="p-4 sm:p-5 flex flex-col items-center justify-center relative min-h-[280px] select-none bg-[#FAF7F2]/60 dark:bg-[#0F1219]">
        
        {/* Background Grid Accent */}
        <svg className="absolute inset-0 w-full h-full text-[#EAE4D9] dark:text-slate-800/40 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="hero-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>

        {mode === 'trig' ? (
          /* Live Rotating Unit Circle */
          <div className="relative w-[260px] h-[260px] flex items-center justify-center">
            <svg viewBox="0 0 260 260" className="w-full h-full overflow-visible">
              {/* Axes */}
              <line x1="20" y1={cy} x2="240" y2={cy} stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" />
              <line x1={cx} y1="20" x2={cx} y2="240" stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" />
              
              {/* Unit Circle */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="#F26207"
                strokeWidth="2.5"
                className="opacity-90 dark:stroke-orange-500"
              />

              {/* Triangle Cos / Sin Projections */}
              <polygon
                points={`${cx},${cy} ${px},${cy} ${px},${py}`}
                fill="#F26207"
                fillOpacity="0.08"
                className="transition-all"
              />

              {/* Cos line (horizontal, emerald) */}
              <line
                x1={cx}
                y1={cy}
                x2={px}
                y2={cy}
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="dark:stroke-emerald-400"
              />

              {/* Sin line (vertical, orange) */}
              <line
                x1={px}
                y1={cy}
                x2={px}
                y2={py}
                stroke="#F26207"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="3 3"
                className="dark:stroke-orange-400"
              />

              {/* Radius Hypotenuse Vector (Amber Gold) */}
              <line
                x1={cx}
                y1={cy}
                x2={px}
                y2={py}
                stroke="#FF7729"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="dark:stroke-orange-400"
              />

              {/* Center Origin Dot */}
              <circle cx={cx} cy={cy} r="3.5" className="fill-slate-800 dark:fill-slate-200" />

              {/* Moving Point P(cos, sin) */}
              <circle
                cx={px}
                cy={py}
                r="5.5"
                fill="#FF7729"
                className="stroke-2 stroke-white dark:stroke-slate-900 shadow-md transition-all dark:fill-orange-400"
              />

              {/* Angle arc indicator */}
              <path
                d={`M ${cx + 24} ${cy} A 24 24 0 ${angleDeg > 180 ? 1 : 0} 0 ${cx + 24 * cosVal} ${cy - 24 * sinVal}`}
                fill="none"
                stroke="#FF7729"
                strokeWidth="1.5"
                className="dark:stroke-orange-400"
              />
            </svg>

            {/* Realtime Telemetry Float Badge */}
            <div className="absolute top-2 right-2 bg-white dark:bg-[#181A20] p-2.5 rounded-xl border border-[#EAE4D9] dark:border-[#26282E] text-[11px] font-mono shadow-sm space-y-1">
              <div className="flex items-center justify-between gap-3 text-[#625F59] dark:text-slate-400">
                <span>θ:</span>
                <span className="font-bold text-[#F26207] dark:text-orange-400">{Math.round(angleDeg)}°</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[#625F59] dark:text-slate-400">
                <span>cos θ:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{cosVal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[#625F59] dark:text-slate-400">
                <span>sin θ:</span>
                <span className="font-bold text-[#F26207] dark:text-orange-400">{sinVal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Live Parabola Dynamic Curve */
          <div className="relative w-[260px] h-[260px] flex items-center justify-center">
            <svg viewBox="0 0 260 260" className="w-full h-full overflow-visible">
              {/* Grid & Axes */}
              <line x1="20" y1="200" x2="240" y2="200" stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" />
              <line x1="130" y1="20" x2="130" y2="240" stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" />
              
              {/* Dynamic Parabola Path */}
              <path
                d="M 30,50 Q 130,240 230,50"
                fill="none"
                stroke="#F26207"
                strokeWidth="3"
                strokeLinecap="round"
                className="dark:stroke-orange-500"
              />

              {/* Tangent line at animated x */}
              {(() => {
                const tNorm = ((angleDeg % 180) - 90) / 90; // -1 to 1
                const xPos = 130 + tNorm * 70;
                const yPos = 200 - (1 - tNorm * tNorm) * 110;
                const slope = -2 * tNorm;
                const dx = 40;
                const dy = dx * slope;

                return (
                  <>
                    <line
                      x1={xPos - dx}
                      y1={yPos + dy}
                      x2={xPos + dx}
                      y2={yPos - dy}
                      stroke="#FF7729"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="dark:stroke-orange-400"
                    />
                    <circle
                      cx={xPos}
                      cy={yPos}
                      r="5"
                      fill="#FF7729"
                      className="stroke-2 stroke-white dark:stroke-slate-900 dark:fill-orange-400"
                    />
                  </>
                );
              })()}

              {/* Roots / Intercepts */}
              <circle cx="65" cy="200" r="4" fill="#059669" className="dark:fill-emerald-400" />
              <circle cx="195" cy="200" r="4" fill="#059669" className="dark:fill-emerald-400" />
              <circle cx="130" cy="200" r="3" className="fill-slate-400" />
            </svg>

            <div className="absolute top-2 right-2 bg-white dark:bg-[#181A20] p-2 rounded-xl border border-[#EAE4D9] dark:border-[#26282E] text-[11px] font-mono shadow-sm">
              <span className="text-[#F26207] dark:text-orange-400 font-bold">f(x) = x² - 4</span>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-sans font-medium">
                Nghiệm: x = ±2.0
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Control Bar at Card Bottom */}
      <div className="p-3 sm:p-4 bg-[#FAF7F2] dark:bg-[#121316] border-t border-[#EAE4D9] dark:border-[#26282E] flex items-center justify-between gap-2">
        
        {/* Play/Pause & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-[#EAE4D9] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#1C1B1A] dark:text-slate-200 transition-colors shadow-2xs cursor-pointer"
            title={isPlaying ? 'Tạm dừng' : 'Chạy tiếp'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
          
          <button
            onClick={() => setAngleDeg(45)}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-[#EAE4D9] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#1C1B1A] dark:text-slate-200 transition-colors shadow-2xs cursor-pointer"
            title="Đặt lại góc"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <span className="text-[11px] text-[#625F59] dark:text-slate-400 hidden sm:inline font-mono">
            Mô phỏng toán học 60 FPS
          </span>
        </div>

        {/* CTA to open the live interactive app */}
        <button
          onClick={onOpenApp}
          className="px-3.5 py-1.5 rounded-xl bg-[#F26207] hover:bg-[#D95300] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer group"
        >
          <span>Mở đồ thị tương tác</span>
          <Maximize2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
        </button>

      </div>

    </div>
  );
};
