import React from 'react';

interface QuadraticVisualProps {
  a: number;
  b: number;
  c: number;
  zoom: number;
  showGrid: boolean;
  animationPhase?: 'intro' | 'build-up' | 'highlight' | 'conclusion';
}

export const QuadraticVisual: React.FC<QuadraticVisualProps> = ({
  a,
  b,
  c,
  zoom,
  showGrid,
  animationPhase
}) => {
  const isHighlight = animationPhase === 'highlight';

  const width = 600;
  const height = 400;
  const originX = width / 2 - 40;
  const originY = height / 2 + 40;
  const scale = 36 * zoom;

  // Compute key mathematical points
  const delta = b * b - 4 * a * c;
  const vertexX = a !== 0 ? -b / (2 * a) : 0;
  const vertexY = a !== 0 ? a * vertexX * vertexX + b * vertexX + c : c;

  let root1: number | null = null;
  let root2: number | null = null;
  if (a !== 0 && delta >= 0) {
    root1 = (-b - Math.sqrt(delta)) / (2 * a);
    root2 = (-b + Math.sqrt(delta)) / (2 * a);
  }

  // Generate curve path
  const points: [number, number][] = [];
  const minX = -6;
  const maxX = 8;
  const step = 0.1;

  for (let x = minX; x <= maxX; x += step) {
    const y = a * x * x + b * x + c;
    const screenX = originX + x * scale;
    const screenY = originY - y * scale;
    points.push([screenX, screenY]);
  }

  const pathD = points.reduce((acc, [sx, sy], idx) => {
    return idx === 0 ? `M ${sx.toFixed(1)} ${sy.toFixed(1)}` : `${acc} L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
  }, '');

  // Screen coordinates of key points
  const vertexScreenX = originX + vertexX * scale;
  const vertexScreenY = originY - vertexY * scale;

  return (
    <div className="w-full h-full relative flex items-center justify-center select-none overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full max-h-[460px] drop-shadow-sm"
      >
        <defs>
          <pattern
            id="grid-quad"
            width={scale}
            height={scale}
            patternUnits="userSpaceOnUse"
            x={originX % scale}
            y={originY % scale}
          >
            <path
              d={`M ${scale} 0 L 0 0 0 ${scale}`}
              fill="none"
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800/80"
              strokeWidth="0.8"
            />
          </pattern>
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4338CA" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4338CA" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#4338CA" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {showGrid && <rect width={width} height={height} fill="url(#grid-quad)" />}

        {/* Axes */}
        {/* X Axis */}
        <line
          x1="20"
          y1={originY}
          x2={width - 20}
          y2={originY}
          stroke="currentColor"
          className="text-slate-400 dark:text-slate-600"
          strokeWidth="1.5"
        />
        {/* Y Axis */}
        <line
          x1={originX}
          y1="20"
          x2={originX}
          y2={height - 20}
          stroke="currentColor"
          className="text-slate-400 dark:text-slate-600"
          strokeWidth="1.5"
        />

        {/* Axis Arrows & Labels */}
        <polygon
          points={`${width - 20},${originY - 4} ${width - 12},${originY} ${width - 20},${originY + 4}`}
          className="fill-slate-500 dark:fill-slate-400"
        />
        <polygon
          points={`${originX - 4},20 ${originX},12 ${originX + 4},20`}
          className="fill-slate-500 dark:fill-slate-400"
        />
        <text
          x={width - 15}
          y={originY - 10}
          className="fill-slate-600 dark:fill-slate-400 text-xs font-mono font-medium"
        >
          x
        </text>
        <text
          x={originX + 12}
          y={20}
          className="fill-slate-600 dark:fill-slate-400 text-xs font-mono font-medium"
        >
          y
        </text>

        {/* Coordinate tick numbers */}
        {[-4, -2, 2, 4, 6].map((tick) => {
          const tx = originX + tick * scale;
          if (tx < 30 || tx > width - 30) return null;
          return (
            <g key={`xtick-${tick}`}>
              <line
                x1={tx}
                y1={originY - 4}
                x2={tx}
                y2={originY + 4}
                stroke="currentColor"
                className="text-slate-400 dark:text-slate-600"
                strokeWidth="1"
              />
              <text
                x={tx}
                y={originY + 16}
                textAnchor="middle"
                className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Axis of Symmetry (dashed line) */}
        {a !== 0 && (
          <line
            x1={vertexScreenX}
            y1={20}
            x2={vertexScreenX}
            y2={height - 20}
            stroke="#4338CA"
            strokeDasharray="4 4"
            strokeWidth="1.2"
            opacity="0.6"
          />
        )}

        {/* Parabola Curve */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#curveGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Y-Intercept Point (0, c) */}
        <circle
          cx={originX}
          cy={originY - c * scale}
          r="4.5"
          className="fill-indigo-500 stroke-white dark:stroke-[#0B0E14]"
          strokeWidth="2"
        />
        <text
          x={originX - 12}
          y={originY - c * scale - 8}
          textAnchor="end"
          className="fill-indigo-600 dark:fill-indigo-400 text-[11px] font-mono font-semibold"
        >
          (0, {c})
        </text>

        {/* Vertex Point */}
        {a !== 0 && (
          <g>
            {isHighlight && (
              <circle
                cx={vertexScreenX}
                cy={vertexScreenY}
                r="14"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                className="animate-ping opacity-75"
              />
            )}
            <circle
              cx={vertexScreenX}
              cy={vertexScreenY}
              r="6"
              fill="#F59E0B"
              className="stroke-white dark:stroke-[#0B0E14]"
              strokeWidth="2.5"
            />
            <text
              x={vertexScreenX + (a > 0 ? 10 : 10)}
              y={vertexScreenY + (a > 0 ? -10 : 18)}
              className="fill-amber-500 dark:fill-amber-400 text-[11px] font-mono font-bold"
            >
              V({vertexX.toFixed(1)}, {vertexY.toFixed(2)})
            </text>
          </g>
        )}

        {/* Roots on X-axis */}
        {root1 !== null && root2 !== null && (
          <>
            {isHighlight && (
              <>
                <circle
                  cx={originX + root1 * scale}
                  cy={originY}
                  r="12"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  className="animate-ping opacity-60"
                />
                <circle
                  cx={originX + root2 * scale}
                  cy={originY}
                  r="12"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  className="animate-ping opacity-60"
                />
              </>
            )}
            <circle
              cx={originX + root1 * scale}
              cy={originY}
              r="5.5"
              fill={isHighlight ? "#F59E0B" : "#10B981"}
              className="stroke-white dark:stroke-[#0B0E14]"
              strokeWidth="2"
            />
            <text
              x={originX + root1 * scale}
              y={originY + 20}
              textAnchor="middle"
              className="fill-amber-500 dark:fill-amber-400 text-[11px] font-mono font-bold"
            >
              x₁={root1.toFixed(1)}
            </text>

            <circle
              cx={originX + root2 * scale}
              cy={originY}
              r="5.5"
              fill={isHighlight ? "#F59E0B" : "#10B981"}
              className="stroke-white dark:stroke-[#0B0E14]"
              strokeWidth="2"
            />
            <text
              x={originX + root2 * scale}
              y={originY + 20}
              textAnchor="middle"
              className="fill-amber-500 dark:fill-amber-400 text-[11px] font-mono font-bold"
            >
              x₂={root2.toFixed(1)}
            </text>
          </>
        )}
      </svg>

      {/* Floating Info Pill */}
      <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#121620]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs font-mono flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            f(x) = {a}x² {b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x {c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}
          </span>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span>Δ = {delta.toFixed(2)}</span>
          <span>•</span>
          <span className={delta > 0 ? "text-emerald-500 font-medium" : delta === 0 ? "text-amber-500 font-medium" : "text-rose-500 font-medium"}>
            {delta > 0 ? "2 nghiệm phân biệt" : delta === 0 ? "Nghiệm kép" : "Vô nghiệm thực"}
          </span>
        </div>
      </div>
    </div>
  );
};
