import React from 'react';

interface TrigCircleVisualProps {
  angleDeg: number;
  zoom: number;
  showGrid: boolean;
  animationPhase?: 'intro' | 'build-up' | 'highlight' | 'conclusion';
}

export const TrigCircleVisual: React.FC<TrigCircleVisualProps> = ({
  angleDeg,
  zoom,
  showGrid,
  animationPhase
}) => {
  const isHighlight = animationPhase === 'highlight';
  const width = 600;

  const height = 400;
  const originX = width / 2;
  const originY = height / 2;
  const radius = 130 * zoom;

  const rad = (angleDeg * Math.PI) / 180;
  const cosVal = Math.cos(rad);
  const sinVal = Math.sin(rad);
  const tanVal = Math.abs(cosVal) > 0.001 ? Math.tan(rad) : (sinVal > 0 ? 999 : -999);

  const pointX = originX + cosVal * radius;
  const pointY = originY - sinVal * radius;

  // Arc path for angle theta
  const arcRadius = 32 * zoom;
  const arcEndX = originX + Math.cos(rad) * arcRadius;
  const arcEndY = originY - Math.sin(rad) * arcRadius;
  const largeArcFlag = angleDeg > 180 ? 1 : 0;
  const arcPath = `M ${originX + arcRadius} ${originY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 0 ${arcEndX} ${arcEndY}`;

  return (
    <div className="w-full h-full relative flex items-center justify-center select-none overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full max-h-[460px] drop-shadow-sm"
      >
        <defs>
          <pattern
            id="grid-trig"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
            x={originX % 30}
            y={originY % 30}
          >
            <path
              d="M 30 0 L 0 0 0 30"
              fill="none"
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800/80"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>

        {showGrid && <rect width={width} height={height} fill="url(#grid-trig)" />}

        {/* Axes */}
        <line
          x1="30"
          y1={originY}
          x2={width - 30}
          y2={originY}
          stroke="currentColor"
          className="text-slate-400 dark:text-slate-600"
          strokeWidth="1.5"
        />
        <line
          x1={originX}
          y1="30"
          x2={originX}
          y2={height - 30}
          stroke="currentColor"
          className="text-slate-400 dark:text-slate-600"
          strokeWidth="1.5"
        />

        {/* Axis Labels */}
        <text
          x={width - 25}
          y={originY - 8}
          className="fill-slate-600 dark:fill-slate-400 text-xs font-mono font-medium"
        >
          Cos (x)
        </text>
        <text
          x={originX + 12}
          y={35}
          className="fill-slate-600 dark:fill-slate-400 text-xs font-mono font-medium"
        >
          Sin (y)
        </text>

        {/* Unit Circle (R = 1) */}
        <circle
          cx={originX}
          cy={originY}
          r={radius}
          fill="none"
          stroke="#4338CA"
          strokeWidth="2.5"
          className="opacity-90"
        />

        {/* Shaded Triangle formed by (0,0), (cos, 0), (cos, sin) */}
        <polygon
          points={`${originX},${originY} ${pointX},${originY} ${pointX},${pointY}`}
          className="fill-indigo-500/15 stroke-none"
        />

        {/* Angle Arc */}
        {angleDeg > 0 && (
          <path
            d={arcPath}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
        <text
          x={originX + Math.cos(rad / 2) * (arcRadius + 14)}
          y={originY - Math.sin(rad / 2) * (arcRadius + 14) + 4}
          textAnchor="middle"
          className="fill-amber-600 dark:fill-amber-400 text-xs font-mono font-bold"
        >
          {angleDeg}°
        </text>

        {/* Cosine Projection (Horizontal bar) */}
        <line
          x1={originX}
          y1={originY}
          x2={pointX}
          y2={originY}
          stroke="#3B82F6"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Sine Projection (Vertical bar) */}
        <line
          x1={pointX}
          y1={originY}
          x2={pointX}
          y2={pointY}
          stroke="#EF4444"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Radius Ray (Hypotenuse = 1) */}
        <line
          x1={originX}
          y1={originY}
          x2={pointX}
          y2={pointY}
          stroke="#4338CA"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Moving Point M on Circle */}
        {isHighlight && (
          <circle
            cx={pointX}
            cy={pointY}
            r="16"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2"
            className="animate-ping opacity-75"
          />
        )}
        <circle
          cx={pointX}
          cy={pointY}
          r="6"
          fill="#F59E0B"
          className="stroke-white dark:stroke-[#0B0E14]"
          strokeWidth="2"
        />
        <text
          x={pointX + (cosVal >= 0 ? 12 : -12)}
          y={pointY + (sinVal >= 0 ? -12 : 18)}
          textAnchor={cosVal >= 0 ? 'start' : 'end'}
          className="fill-slate-900 dark:fill-slate-100 text-xs font-mono font-bold"
        >
          M({cosVal.toFixed(2)}, {sinVal.toFixed(2)})
        </text>

        {/* Axis Unit points */}
        <circle cx={originX + radius} cy={originY} r="3" className="fill-slate-400" />
        <text x={originX + radius + 8} y={originY + 14} className="fill-slate-400 text-[10px] font-mono">1</text>
        <circle cx={originX - radius} cy={originY} r="3" className="fill-slate-400" />
        <text x={originX - radius - 16} y={originY + 14} className="fill-slate-400 text-[10px] font-mono">-1</text>
        <circle cx={originX} cy={originY - radius} r="3" className="fill-slate-400" />
        <text x={originX - 16} y={originY - radius - 4} className="fill-slate-400 text-[10px] font-mono">1</text>
        <circle cx={originX} cy={originY + radius} r="3" className="fill-slate-400" />
        <text x={originX - 20} y={originY + radius + 12} className="fill-slate-400 text-[10px] font-mono">-1</text>
      </svg>

      {/* Floating Readout Pill */}
      <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#121620]/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs font-mono flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <span className="text-blue-600 dark:text-blue-400 font-semibold">cos θ = {cosVal.toFixed(3)}</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-red-500 dark:text-red-400 font-semibold">sin θ = {sinVal.toFixed(3)}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span>tan θ = {Math.abs(tanVal) < 100 ? tanVal.toFixed(3) : '∞'}</span>
          <span>•</span>
          <span>Radian: {rad.toFixed(3)} rad ({((angleDeg / 180) * 1).toFixed(2)}π)</span>
        </div>
      </div>
    </div>
  );
};
