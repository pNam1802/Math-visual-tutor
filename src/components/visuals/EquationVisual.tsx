import React from 'react';

interface EquationVisualProps {
  a?: number;
  b?: number;
  c?: number;
  zoom?: number;
  showGrid?: boolean;
  concept?: string;
  animationPhase?: 'intro' | 'build-up' | 'highlight' | 'conclusion';
}

export const EquationVisual: React.FC<EquationVisualProps> = ({
  a = 1,
  b = -5,
  c = 6,
  zoom = 1,
  showGrid = true,
  concept = 'quadratic_equation',
  animationPhase
}) => {
  const isHighlight = animationPhase === 'highlight';
  const width = 600;

  const height = 400;
  const originX = width / 2;
  const originY = height / 2;
  const scale = 36 * zoom;

  // Discriminant and roots calculation
  const delta = b * b - 4 * a * c;
  let root1: number | null = null;
  let root2: number | null = null;
  
  if (a !== 0) {
    if (delta >= 0) {
      root1 = (-b - Math.sqrt(delta)) / (2 * a);
      root2 = (-b + Math.sqrt(delta)) / (2 * a);
    }
  } else if (b !== 0) {
    // Linear equation bx + c = 0 -> x = -c/b
    root1 = -c / b;
  }

  // Curve points
  const points: [number, number][] = [];
  const minX = -8;
  const maxX = 8;
  const step = 0.1;

  for (let x = minX; x <= maxX; x += step) {
    const y = a !== 0 ? a * x * x + b * x + c : b * x + c;
    const sx = originX + x * scale;
    const sy = originY - y * scale;
    points.push([sx, sy]);
  }

  const pathD = points.reduce((acc, [sx, sy], idx) => {
    return idx === 0 ? `M ${sx.toFixed(1)} ${sy.toFixed(1)}` : `${acc} L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
  }, '');

  return (
    <div className="w-full h-full relative flex items-center justify-center select-none overflow-hidden min-h-[380px]">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-h-[460px] drop-shadow-xs">
        <defs>
          <pattern
            id="grid-eq"
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
              className="text-[#EAE4D9] dark:text-white/5"
              strokeWidth="0.8"
            />
          </pattern>
          <linearGradient id="eqGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F26207" />
            <stop offset="100%" stopColor="#FF8B38" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {showGrid && <rect width={width} height={height} fill="url(#grid-eq)" />}

        {/* X Axis & Number Line */}
        <line
          x1="20"
          y1={originY}
          x2={width - 20}
          y2={originY}
          stroke="currentColor"
          className="text-[#8F8D88] dark:text-slate-600"
          strokeWidth="2"
        />

        {/* Y Axis */}
        <line
          x1={originX}
          y1="20"
          x2={originX}
          y2={height - 20}
          stroke="currentColor"
          className="text-[#8F8D88] dark:text-slate-600"
          strokeWidth="1.5"
        />

        {/* Axis Ticks & Number Line Labels */}
        {[-6, -4, -2, 2, 4, 6].map((tick) => {
          const tx = originX + tick * scale;
          if (tx < 30 || tx > width - 30) return null;
          return (
            <g key={`numline-${tick}`}>
              <line
                x1={tx}
                y1={originY - 6}
                x2={tx}
                y2={originY + 6}
                stroke="currentColor"
                className="text-[#625F59] dark:text-slate-400"
                strokeWidth="1.5"
              />
              <text
                x={tx}
                y={originY + 20}
                textAnchor="middle"
                className="fill-[#625F59] dark:fill-slate-400 text-[11px] font-mono font-medium"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Origin label */}
        <text x={originX - 12} y={originY + 18} className="fill-[#625F59] dark:fill-slate-400 text-xs font-mono">
          0
        </text>

        {/* Graph curve */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#eqGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Highlight Roots on Number Line */}
        {root1 !== null && (
          <g>
            <circle
              cx={originX + root1 * scale}
              cy={originY}
              r="6.5"
              fill="#10B981"
              className="stroke-white dark:stroke-[#121316]"
              strokeWidth="2.5"
            />
            <line
              x1={originX + root1 * scale}
              y1={originY}
              x2={originX + root1 * scale}
              y2={originY - 30}
              stroke="#10B981"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <rect
              x={originX + root1 * scale - 24}
              y={originY - 50}
              width="48"
              height="20"
              rx="6"
              fill="#10B981"
            />
            <text
              x={originX + root1 * scale}
              y={originY - 36}
              textAnchor="middle"
              className="fill-white text-[11px] font-mono font-bold"
            >
              x₁ = {root1.toFixed(2)}
            </text>
          </g>
        )}

        {root2 !== null && root2 !== root1 && (
          <g>
            <circle
              cx={originX + root2 * scale}
              cy={originY}
              r="6.5"
              fill="#10B981"
              className="stroke-white dark:stroke-[#121316]"
              strokeWidth="2.5"
            />
            <line
              x1={originX + root2 * scale}
              y1={originY}
              x2={originX + root2 * scale}
              y2={originY - 30}
              stroke="#10B981"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <rect
              x={originX + root2 * scale - 24}
              y={originY - 50}
              width="48"
              height="20"
              rx="6"
              fill="#10B981"
            />
            <text
              x={originX + root2 * scale}
              y={originY - 36}
              textAnchor="middle"
              className="fill-white text-[11px] font-mono font-bold"
            >
              x₂ = {root2.toFixed(2)}
            </text>
          </g>
        )}
      </svg>

      {/* Info telemetry badge */}
      <div className="absolute top-3 left-3 bg-white/95 dark:bg-[#121620]/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#EAE4D9] dark:border-white/10 shadow-sm text-xs font-mono flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F26207]"></span>
          <span className="font-bold text-[#F26207]">
            {a !== 0 ? `${a}x² ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`} = 0` : `${b}x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`} = 0`}
          </span>
        </div>
        <div className="text-[11px] text-[#625F59] dark:text-slate-400 flex items-center gap-2">
          {a !== 0 ? (
            <>
              <span>Δ = {delta.toFixed(2)}</span>
              <span>•</span>
              <span className={delta > 0 ? "text-emerald-500 font-semibold" : delta === 0 ? "text-amber-500 font-semibold" : "text-rose-500 font-semibold"}>
                {delta > 0 ? "2 nghiệm thực" : delta === 0 ? "1 nghiệm kép" : "Vô nghiệm"}
              </span>
            </>
          ) : (
            <span className="text-emerald-500 font-semibold">Phương trình bậc nhất 1 nghiệm</span>
          )}
        </div>
      </div>
    </div>
  );
};
