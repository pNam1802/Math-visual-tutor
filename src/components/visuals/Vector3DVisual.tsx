import React from 'react';

interface Vector3DVisualProps {
  vx: number;
  vy: number;
  vz: number;
  zoom: number;
  showGrid: boolean;
}

export const Vector3DVisual: React.FC<Vector3DVisualProps> = ({
  vx,
  vy,
  vz,
  zoom,
  showGrid
}) => {
  const width = 600;
  const height = 400;
  const originX = width / 2 - 20;
  const originY = height / 2 + 50;

  // Isometric 3D Projection transformation
  // X axis projects down-left (cos 210, sin 210)
  // Y axis projects down-right (cos 330, sin 330)
  // Z axis projects straight up (0, -1)
  const scale = 24 * zoom;

  const project3D = (x: number, y: number, z: number): [number, number] => {
    const isoAngleX = (215 * Math.PI) / 180;
    const isoAngleY = (325 * Math.PI) / 180;

    const sx = originX + (x * Math.cos(isoAngleX) + y * Math.cos(isoAngleY)) * scale;
    const sy = originY - (x * Math.sin(isoAngleX) + y * Math.sin(isoAngleY) + z) * scale;
    return [sx, sy];
  };

  const norm = Math.sqrt(vx * vx + vy * vy + vz * vz);

  // Key projected vertices for 3D box
  const [oX, oY] = project3D(0, 0, 0);
  const [pX, pY] = project3D(vx, vy, vz);
  const [xOnlyX, xOnlyY] = project3D(vx, 0, 0);
  const [yOnlyX, yOnlyY] = project3D(0, vy, 0);
  const [zOnlyX, zOnlyY] = project3D(0, 0, vz);
  const [xyFloorX, xyFloorY] = project3D(vx, vy, 0);
  const [xzWallX, xzWallY] = project3D(vx, 0, vz);
  const [yzWallX, yzWallY] = project3D(0, vy, vz);

  // Axis lines
  const axisLen = 6.5;
  const [axX, axY] = project3D(axisLen, 0, 0);
  const [ayX, ayY] = project3D(0, axisLen, 0);
  const [azX, azY] = project3D(0, 0, axisLen);

  return (
    <div className="w-full h-full relative flex items-center justify-center select-none overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full max-h-[460px] drop-shadow-sm"
      >
        <defs>
          <linearGradient id="vectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>
          <marker
            id="vecArrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#4338CA" />
          </marker>
        </defs>

        {/* 3D Coordinate Grid Floor (Oxy plane) */}
        {showGrid && (
          <g opacity="0.35" stroke="currentColor" className="text-slate-400 dark:text-slate-600">
            {[-4, -2, 0, 2, 4, 6].map((gridI) => {
              const [p1x, p1y] = project3D(gridI, -4, 0);
              const [p2x, p2y] = project3D(gridI, 6, 0);
              return <line key={`gx-${gridI}`} x1={p1x} y1={p1y} x2={p2x} y2={p2y} strokeWidth="0.8" />;
            })}
            {[-4, -2, 0, 2, 4, 6].map((gridJ) => {
              const [p1x, p1y] = project3D(-4, gridJ, 0);
              const [p2x, p2y] = project3D(6, gridJ, 0);
              return <line key={`gy-${gridJ}`} x1={p1x} y1={p1y} x2={p2x} y2={p2y} strokeWidth="0.8" />;
            })}
          </g>
        )}

        {/* 3D Axes */}
        {/* X Axis (Red) */}
        <line x1={oX} y1={oY} x2={axX} y2={axY} stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
        <text x={axX - 14} y={axY + 14} className="fill-red-500 font-mono text-xs font-bold">Ox (x)</text>

        {/* Y Axis (Green) */}
        <line x1={oX} y1={oY} x2={ayX} y2={ayY} stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        <text x={ayX + 10} y={ayY + 12} className="fill-emerald-500 font-mono text-xs font-bold">Oy (y)</text>

        {/* Z Axis (Blue) */}
        <line x1={oX} y1={oY} x2={azX} y2={azY} stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
        <text x={azX + 10} y={azY + 4} className="fill-blue-500 font-mono text-xs font-bold">Oz (z)</text>

        {/* 3D Bounding Box (dashed projection lines) */}
        <g stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="4 4" className="dark:stroke-slate-700 opacity-70">
          {/* Floor rectangle (0,0) -> (vx,0) -> (vx,vy) -> (0,vy) */}
          <line x1={xOnlyX} y1={xOnlyY} x2={xyFloorX} y2={xyFloorY} />
          <line x1={yOnlyX} y1={yOnlyY} x2={xyFloorX} y2={xyFloorY} />

          {/* Vertical pillars to top vertices */}
          <line x1={xyFloorX} y1={xyFloorY} x2={pX} y2={pY} stroke="#F59E0B" strokeWidth="1.6" />
          <line x1={xOnlyX} y1={xOnlyY} x2={xzWallX} y2={xzWallY} />
          <line x1={yOnlyX} y1={yOnlyY} x2={yzWallX} y2={yzWallY} />

          {/* Top lines */}
          <line x1={zOnlyX} y1={zOnlyY} x2={xzWallX} y2={xzWallY} />
          <line x1={zOnlyX} y1={zOnlyY} x2={yzWallX} y2={yzWallY} />
          <line x1={xzWallX} y1={xzWallY} x2={pX} y2={pY} />
          <line x1={yzWallX} y1={yzWallY} x2={pX} y2={pY} />

          {/* Floor diagonal */}
          <line x1={oX} y1={oY} x2={xyFloorX} y2={xyFloorY} stroke="#10B981" strokeWidth="1.4" />
        </g>

        {/* Main 3D Vector Arrow */}
        <line
          x1={oX}
          y1={oY}
          x2={pX}
          y2={pY}
          stroke="url(#vectorGrad)"
          strokeWidth="3.5"
          markerEnd="url(#vecArrow)"
          strokeLinecap="round"
        />

        {/* Origin point O */}
        <circle cx={oX} cy={oY} r="4" fill="#64748B" />
        <text x={oX - 16} y={oY - 6} className="fill-slate-500 font-mono text-[11px]">O(0,0,0)</text>

        {/* Floor projection point P_xy */}
        <circle cx={xyFloorX} cy={xyFloorY} r="4" fill="#10B981" />
        <text x={xyFloorX + 8} y={xyFloorY + 12} className="fill-emerald-600 dark:fill-emerald-400 font-mono text-[10px] font-medium">
          ({vx}, {vy}, 0)
        </text>

        {/* Tip Point P(x,y,z) */}
        <circle cx={pX} cy={pY} r="6" fill="#F59E0B" className="stroke-white dark:stroke-[#0B0E14]" strokeWidth="2" />
        <text x={pX + 10} y={pY - 8} className="fill-amber-600 dark:fill-amber-400 font-mono text-xs font-bold">
          P({vx}, {vy}, {vz})
        </text>
      </svg>

      {/* Floating Info Pill */}
      <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#121620]/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs font-mono flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">
            v = ({vx}i + {vy}j + {vz}k)
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-amber-600 dark:text-amber-400 font-semibold">
            ||v|| = {norm.toFixed(3)}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span>Đường chéo đáy: {Math.sqrt(vx * vx + vy * vy).toFixed(2)}</span>
          <span>•</span>
          <span>Góc nghiêng Z: {Math.asin(vz / (norm || 1)) * (180 / Math.PI) > 0 ? (Math.asin(vz / (norm || 1)) * (180 / Math.PI)).toFixed(1) : 0}°</span>
        </div>
      </div>
    </div>
  );
};
