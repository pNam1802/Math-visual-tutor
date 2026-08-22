import React, { useState } from 'react';

interface CircleAreaVisualProps {
  radius: number;
  slices: number;
  zoom: number;
  showGrid: boolean;
  animationPhase?: 'intro' | 'build-up' | 'highlight' | 'conclusion';
}

export const CircleAreaVisual: React.FC<CircleAreaVisualProps> = ({
  radius,
  slices,
  zoom,
  showGrid,
  animationPhase
}) => {
  const [userViewMode, setUserViewMode] = useState<'circle' | 'unwrapped' | 'split'>('split');

  // Derive active view mode if in animation phase
  const viewMode = animationPhase === 'intro' ? 'circle' : userViewMode;
  const isHighlight = animationPhase === 'highlight';

  const width = 600;
  const height = 400;

  // Math constants
  const area = Math.PI * radius * radius;
  const perimeter = 2 * Math.PI * radius;
  const sectorAngle = (2 * Math.PI) / slices;

  // SVG rendering dimensions
  const circleCenterX = viewMode === 'split' ? 170 : 300;
  const circleCenterY = 200;
  const pixelRadius = 18 * radius * zoom;

  // Unwrapped sector rendering
  const unwrapStartX = viewMode === 'split' ? 330 : 100;
  const unwrapCenterY = 200;
  const sectorWidth = (perimeter * 18 * zoom) / slices;
  const sectorHeight = pixelRadius;

  return (
    <div className="w-full h-full relative flex items-center justify-center select-none overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full max-h-[460px] drop-shadow-sm"
      >
        <defs>
          <pattern
            id="grid-circle"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
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

        {showGrid && <rect width={width} height={height} fill="url(#grid-circle)" />}

        {/* 1. Original Circle with Slices */}
        {(viewMode === 'circle' || viewMode === 'split') && (
          <g>
            {/* Slices of Circle */}
            {Array.from({ length: slices }).map((_, i) => {
              const startA = i * sectorAngle;
              const endA = (i + 1) * sectorAngle;
              const x1 = circleCenterX + pixelRadius * Math.cos(startA);
              const y1 = circleCenterY - pixelRadius * Math.sin(startA);
              const x2 = circleCenterX + pixelRadius * Math.cos(endA);
              const y2 = circleCenterY - pixelRadius * Math.sin(endA);
              const isEven = i % 2 === 0;

              const path = `M ${circleCenterX} ${circleCenterY} L ${x1} ${y1} A ${pixelRadius} ${pixelRadius} 0 0 0 ${x2} ${y2} Z`;

              return (
                <path
                  key={`sector-${i}`}
                  d={path}
                  fill={isEven ? '#4338CA' : '#6366F1'}
                  fillOpacity={isEven ? 0.85 : 0.45}
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Radius line */}
            <line
              x1={circleCenterX}
              y1={circleCenterY}
              x2={circleCenterX + pixelRadius}
              y2={circleCenterY}
              stroke="#F59E0B"
              strokeWidth="2.5"
            />
            <text
              x={circleCenterX + pixelRadius / 2}
              y={circleCenterY - 8}
              textAnchor="middle"
              className="fill-amber-600 dark:fill-amber-400 font-mono text-xs font-bold"
            >
              r = {radius}
            </text>

            <circle cx={circleCenterX} cy={circleCenterY} r="4" fill="#F59E0B" />
            <text
              x={circleCenterX}
              y={circleCenterY + pixelRadius + 24}
              textAnchor="middle"
              className="fill-slate-700 dark:fill-slate-300 font-sans text-xs font-medium"
            >
              Hình tròn gốc ({slices} nan quạt)
            </text>
          </g>
        )}

        {/* 2. Unwrapped Interlocked Sectors (Approximate Rectangle) */}
        {(viewMode === 'unwrapped' || viewMode === 'split') && (
          <g>
            {Array.from({ length: slices }).map((_, i) => {
              const isEven = i % 2 === 0;
              const xBase = unwrapStartX + i * (sectorWidth / 2);
              const pointingUp = isEven;

              // Draw interlocking triangle approximation
              const pTop = pointingUp ? unwrapCenterY - sectorHeight / 2 : unwrapCenterY + sectorHeight / 2;
              const pBot = pointingUp ? unwrapCenterY + sectorHeight / 2 : unwrapCenterY - sectorHeight / 2;

              const path = pointingUp
                ? `M ${xBase} ${pBot} L ${xBase + sectorWidth} ${pBot} L ${xBase + sectorWidth / 2} ${pTop} Z`
                : `M ${xBase} ${pBot} L ${xBase + sectorWidth} ${pBot} L ${xBase + sectorWidth / 2} ${pTop} Z`;

              return (
                <path
                  key={`unwrapped-${i}`}
                  d={path}
                  fill={isEven ? '#4338CA' : '#6366F1'}
                  fillOpacity={isEven ? 0.85 : 0.45}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Bounding box guide of the rectangle */}
            <rect
              x={unwrapStartX}
              y={unwrapCenterY - sectorHeight / 2}
              width={(slices * sectorWidth) / 2}
              height={sectorHeight}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />

            {/* Width Dimension (Half Circumference = π * r) */}
            <text
              x={unwrapStartX + (slices * sectorWidth) / 4}
              y={unwrapCenterY + sectorHeight / 2 + 18}
              textAnchor="middle"
              className="fill-amber-600 dark:fill-amber-400 font-mono text-xs font-bold"
            >
              Đáy = C/2 = πr ≈ {(perimeter / 2).toFixed(1)} cm
            </text>

            {/* Height Dimension (Radius = r) */}
            <text
              x={unwrapStartX + (slices * sectorWidth) / 2 + 14}
              y={unwrapCenterY + 4}
              textAnchor="start"
              className="fill-indigo-600 dark:fill-indigo-400 font-mono text-xs font-bold"
            >
              h = r ({radius} cm)
            </text>

            <text
              x={unwrapStartX + (slices * sectorWidth) / 4}
              y={unwrapCenterY - sectorHeight / 2 - 12}
              textAnchor="middle"
              className="fill-slate-700 dark:fill-slate-300 font-sans text-xs font-medium"
            >
              Xếp đan xen → Hình chữ nhật (πr × r)
            </text>
          </g>
        )}
      </svg>

      {/* Floating View Switcher & Stats */}
      <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#121620]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs font-mono flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-amber-600 dark:text-amber-400 font-bold">
            A = πr² = π({radius})² ≈ {area.toFixed(2)} cm²
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <span>Chu vi C = 2πr ≈ {perimeter.toFixed(2)} cm</span>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-[#121620]/90 backdrop-blur-md p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <button
          onClick={() => setUserViewMode('circle')}
          className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${viewMode === 'circle' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Hình tròn
        </button>
        <button
          onClick={() => setUserViewMode('split')}
          className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${viewMode === 'split' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Đối chiếu
        </button>
        <button
          onClick={() => setUserViewMode('unwrapped')}
          className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${viewMode === 'unwrapped' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Hình trải
        </button>
      </div>
    </div>
  );
};
