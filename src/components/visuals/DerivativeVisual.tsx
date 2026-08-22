import React from 'react';

interface DerivativeVisualProps {
  x0: number;
  deltaX: number;
  zoom: number;
  showGrid: boolean;
  animationPhase?: 'intro' | 'build-up' | 'highlight' | 'conclusion';
}

export const DerivativeVisual: React.FC<DerivativeVisualProps> = ({
  x0,
  deltaX,
  zoom,
  showGrid,
  animationPhase
}) => {
  const isHighlight = animationPhase === 'highlight';

  const width = 600;
  const height = 400;
  const originX = width / 2;
  const originY = height / 2;
  const scale = 50 * zoom;

  // Cubic function f(x) = x^3 - 3x
  const f = (x: number) => x * x * x - 3 * x;
  // Exact derivative f'(x) = 3x^2 - 3
  const fPrime = (x: number) => 3 * x * x - 3;

  const y0 = f(x0);
  const x1 = x0 + deltaX;
  const y1 = f(x1);

  // Secant slope m_sec
  const mSec = (y1 - y0) / deltaX;
  // Tangent slope m_tan
  const mTan = fPrime(x0);

  // Curve points
  const curvePoints: [number, number][] = [];
  for (let x = -2.6; x <= 2.6; x += 0.08) {
    const y = f(x);
    curvePoints.push([originX + x * scale, originY - y * scale]);
  }
  const curvePath = curvePoints.reduce((acc, [sx, sy], idx) => {
    return idx === 0 ? `M ${sx.toFixed(1)} ${sy.toFixed(1)}` : `${acc} L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
  }, '');

  // Tangent line points (spanning domain)
  const tanSpan = 2.0;
  const tanP1 = [originX + (x0 - tanSpan) * scale, originY - (y0 - mTan * tanSpan) * scale];
  const tanP2 = [originX + (x0 + tanSpan) * scale, originY - (y0 + mTan * tanSpan) * scale];

  // Secant line points
  const secSpan = 2.4;
  const secP1 = [originX + (x0 - secSpan) * scale, originY - (y0 - mSec * secSpan) * scale];
  const secP2 = [originX + (x1 + secSpan) * scale, originY - (y1 + mSec * secSpan) * scale];

  const screenP0 = [originX + x0 * scale, originY - y0 * scale];
  const screenP1 = [originX + x1 * scale, originY - y1 * scale];

  return (
    <div className="w-full h-full relative flex items-center justify-center select-none overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full max-h-[460px] drop-shadow-sm"
      >
        <defs>
          <pattern
            id="grid-deriv"
            width="35"
            height="35"
            patternUnits="userSpaceOnUse"
            x={originX % 35}
            y={originY % 35}
          >
            <path
              d="M 35 0 L 0 0 0 35"
              fill="none"
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800/80"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>

        {showGrid && <rect width={width} height={height} fill="url(#grid-deriv)" />}

        {/* Axes */}
        <line
          x1="20"
          y1={originY}
          x2={width - 20}
          y2={originY}
          stroke="currentColor"
          className="text-slate-400 dark:text-slate-600"
          strokeWidth="1.5"
        />
        <line
          x1={originX}
          y1="20"
          x2={originX}
          y2={height - 20}
          stroke="currentColor"
          className="text-slate-400 dark:text-slate-600"
          strokeWidth="1.5"
        />
        <text
          x={width - 15}
          y={originY - 8}
          className="fill-slate-600 dark:fill-slate-400 text-xs font-mono font-medium"
        >
          x
        </text>
        <text
          x={originX + 12}
          y={25}
          className="fill-slate-600 dark:fill-slate-400 text-xs font-mono font-medium"
        >
          y
        </text>

        {/* Function Curve f(x) = x³ - 3x */}
        <path
          d={curvePath}
          fill="none"
          stroke="#4338CA"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Secant line (Dashed cyan/gray) */}
        <line
          x1={secP1[0]}
          y1={secP1[1]}
          x2={secP2[0]}
          y2={secP2[1]}
          stroke="#0EA5E9"
          strokeWidth="1.8"
          strokeDasharray="6 4"
          className="opacity-75"
        />

        {/* Tangent line (Amber #F59E0B) */}
        <line
          x1={tanP1[0]}
          y1={tanP1[1]}
          x2={tanP2[0]}
          y2={tanP2[1]}
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Delta triangle (dx, dy step) */}
        <polygon
          points={`${screenP0[0]},${screenP0[1]} ${screenP1[0]},${screenP0[1]} ${screenP1[0]},${screenP1[1]}`}
          className="fill-sky-500/15 stroke-sky-500/50"
          strokeDasharray="2 2"
        />
        <text
          x={(screenP0[0] + screenP1[0]) / 2}
          y={screenP0[1] + (y1 >= y0 ? 14 : -6)}
          textAnchor="middle"
          className="fill-sky-600 dark:fill-sky-400 text-[10px] font-mono font-semibold"
        >
          Δx = {deltaX.toFixed(2)}
        </text>

        {/* Point P(x0, y0) */}
        {isHighlight && (
          <circle
            cx={screenP0[0]}
            cy={screenP0[1]}
            r="16"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2"
            className="animate-ping opacity-75"
          />
        )}
        <circle
          cx={screenP0[0]}
          cy={screenP0[1]}
          r="6"
          fill="#F59E0B"
          className="stroke-white dark:stroke-[#0B0E14]"
          strokeWidth="2"
        />
        <text
          x={screenP0[0] - 10}
          y={screenP0[1] - 12}
          textAnchor="end"
          className="fill-amber-600 dark:fill-amber-400 text-xs font-mono font-bold"
        >
          P({x0.toFixed(1)}, {y0.toFixed(2)})
        </text>

        {/* Point Q(x0+dx, y1) */}
        <circle
          cx={screenP1[0]}
          cy={screenP1[1]}
          r="5"
          fill="#0EA5E9"
          className="stroke-white dark:stroke-[#0B0E14]"
          strokeWidth="2"
        />
        <text
          x={screenP1[0] + 10}
          y={screenP1[1] - 8}
          textAnchor="start"
          className="fill-sky-600 dark:fill-sky-400 text-xs font-mono font-bold"
        >
          Q({x1.toFixed(2)}, {y1.toFixed(2)})
        </text>
      </svg>

      {/* Floating Info Pill */}
      <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#121620]/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs font-mono flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <span className="text-amber-600 dark:text-amber-400 font-semibold">
            Độ dốc tiếp tuyến f'({x0.toFixed(1)}) = {mTan.toFixed(3)}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="text-sky-500">Độ dốc cát tuyến m_sec = {mSec.toFixed(3)}</span>
          <span>•</span>
          <span>Chênh lệch: {Math.abs(mSec - mTan).toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
};
