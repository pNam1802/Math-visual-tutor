import React, { useMemo } from 'react';
import { useGraphPanZoom } from './useGraphPanZoom';
import { GraphControls } from './GraphControls';

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

  const {
    pan,
    userZoom,
    isDragging,
    containerRef,
    resetView,
    zoomIn,
    zoomOut,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useGraphPanZoom({ baseZoom: zoom });

  // 1. Critical mathematical points
  const delta = b * b - 4 * a * c;
  const vertexX = a !== 0 ? -b / (2 * a) : 0;
  const vertexY = a !== 0 ? a * vertexX * vertexX + b * vertexX + c : c;

  let root1: number | null = null;
  let root2: number | null = null;
  if (a !== 0 && delta >= 0) {
    root1 = (-b - Math.sqrt(delta)) / (2 * a);
    root2 = (-b + Math.sqrt(delta)) / (2 * a);
  } else if (a === 0 && b !== 0) {
    root1 = -c / b;
  }

  // 2. Compute auto-domain from vertex, roots, 0, and y-intercept with >= 20% margin
  const { baseOriginX, baseOriginY, baseScale } = useMemo(() => {
    const keyXList = [0, vertexX];
    if (root1 !== null) keyXList.push(root1);
    if (root2 !== null) keyXList.push(root2);

    const minKeyX = Math.min(...keyXList);
    const maxKeyX = Math.max(...keyXList);
    const rawSpanX = Math.max(maxKeyX - minKeyX, 3);
    
    // Always add 20% margin (using 0.25 to ensure generous breathing room)
    const marginX = rawSpanX * 0.25;
    const domainMinX = minKeyX - marginX;
    const domainMaxX = maxKeyX + marginX;
    const spanX = domainMaxX - domainMinX;

    // Evaluate y at bounds
    const fAtMinX = a * domainMinX * domainMinX + b * domainMinX + c;
    const fAtMaxX = a * domainMaxX * domainMaxX + b * domainMaxX + c;
    const keyYList = [0, vertexY, c, fAtMinX, fAtMaxX];
    const minKeyY = Math.min(...keyYList);
    const maxKeyY = Math.max(...keyYList);
    const rawSpanY = Math.max(maxKeyY - minKeyY, 3);
    const marginY = rawSpanY * 0.25;
    const domainMinY = minKeyY - marginY;
    const domainMaxY = maxKeyY + marginY;
    const spanY = domainMaxY - domainMinY;

    // Viewport usable area with internal padding
    const paddingX = 45;
    const paddingY = 45;
    const availW = width - paddingX * 2;
    const availH = height - paddingY * 2;

    const scaleX = availW / spanX;
    const scaleY = availH / spanY;
    const autoScale = Math.min(scaleX, scaleY);
    const computedBaseScale = Math.max(10, Math.min(autoScale, 65));

    const domainCenterX = (domainMinX + domainMaxX) / 2;
    const domainCenterY = (domainMinY + domainMaxY) / 2;

    const origX = width / 2 - domainCenterX * computedBaseScale;
    const origY = height / 2 + domainCenterY * computedBaseScale;

    return {
      baseOriginX: origX,
      baseOriginY: origY,
      baseScale: computedBaseScale,
    };
  }, [a, b, c, vertexX, vertexY, root1, root2, width, height]);

  // Combined scale and origin accounting for user pan & zoom
  const scale = baseScale * zoom * userZoom;
  const originX = baseOriginX + pan.x;
  const originY = baseOriginY + pan.y;

  // Visible mathematical domain based on current viewport
  const visibleMinX = (0 - originX) / scale - 1;
  const visibleMaxX = (width - originX) / scale + 1;
  const visibleMinY = (originY - height) / scale - 1;
  const visibleMaxY = (originY - 0) / scale + 1;

  // Sample points smoothly across the visible domain
  const curvePoints: [number, number][] = [];
  const step = Math.max(0.02, (visibleMaxX - visibleMinX) / 220);
  for (let x = visibleMinX; x <= visibleMaxX; x += step) {
    const y = a * x * x + b * x + c;
    const sx = originX + x * scale;
    const sy = originY - y * scale;
    curvePoints.push([sx, sy]);
  }

  const pathD = curvePoints.reduce((acc, [sx, sy], idx) => {
    return idx === 0 ? `M ${sx.toFixed(1)} ${sy.toFixed(1)}` : `${acc} L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
  }, '');

  // Screen coordinates of key points
  const vertexScreenX = originX + vertexX * scale;
  const vertexScreenY = originY - vertexY * scale;

  // Dynamic grid tick step calculation based on scale
  const tickStep = useMemo(() => {
    if (scale > 70) return 1;
    if (scale > 30) return 2;
    if (scale > 14) return 5;
    if (scale > 6) return 10;
    return 20;
  }, [scale]);

  const xTicks: number[] = [];
  const startXTick = Math.floor(visibleMinX / tickStep) * tickStep;
  const endXTick = Math.ceil(visibleMaxX / tickStep) * tickStep;
  for (let t = startXTick; t <= endXTick; t += tickStep) {
    if (t !== 0 && Math.abs(t) < 500) xTicks.push(t);
  }

  const yTicks: number[] = [];
  const startYTick = Math.floor(visibleMinY / tickStep) * tickStep;
  const endYTick = Math.ceil(visibleMaxY / tickStep) * tickStep;
  for (let t = startYTick; t <= endYTick; t += tickStep) {
    if (t !== 0 && Math.abs(t) < 500) yTicks.push(t);
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`w-full h-full relative flex items-center justify-center select-none overflow-hidden touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full max-h-[460px] drop-shadow-sm"
      >
        <defs>
          {/* Clip path preventing any graph elements from overflowing */}
          <clipPath id="clip-quad-canvas">
            <rect x="0" y="0" width={width} height={height} rx="8" />
          </clipPath>

          <pattern
            id="grid-quad-pattern"
            width={tickStep * scale}
            height={tickStep * scale}
            patternUnits="userSpaceOnUse"
            x={originX % (tickStep * scale)}
            y={originY % (tickStep * scale)}
          >
            <path
              d={`M ${tickStep * scale} 0 L 0 0 0 ${tickStep * scale}`}
              fill="none"
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800/80"
              strokeWidth="0.8"
            />
          </pattern>
          <linearGradient id="curveGradQuad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4338CA" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>

        {/* Clipped graphical elements */}
        <g clipPath="url(#clip-quad-canvas)">
          {/* Background Grid */}
          {showGrid && <rect width={width} height={height} fill="url(#grid-quad-pattern)" />}

          {/* Axes */}
          {/* X Axis */}
          <line
            x1={0}
            y1={originY}
            x2={width}
            y2={originY}
            stroke="currentColor"
            className="text-slate-400 dark:text-slate-600"
            strokeWidth="1.5"
          />
          {/* Y Axis */}
          <line
            x1={originX}
            y1={0}
            x2={originX}
            y2={height}
            stroke="currentColor"
            className="text-slate-400 dark:text-slate-600"
            strokeWidth="1.5"
          />

          {/* Coordinate tick marks and labels */}
          {xTicks.map((tick) => {
            const tx = originX + tick * scale;
            if (tx < 15 || tx > width - 15) return null;
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
                  y={originY + (originY > height - 25 ? -8 : 16)}
                  textAnchor="middle"
                  className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono font-medium select-none pointer-events-none"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {yTicks.map((tick) => {
            const ty = originY - tick * scale;
            if (ty < 15 || ty > height - 15) return null;
            return (
              <g key={`ytick-${tick}`}>
                <line
                  x1={originX - 4}
                  y1={ty}
                  x2={originX + 4}
                  y2={ty}
                  stroke="currentColor"
                  className="text-slate-400 dark:text-slate-600"
                  strokeWidth="1"
                />
                <text
                  x={originX + (originX > width - 30 ? -8 : 12)}
                  y={ty + 3}
                  textAnchor={originX > width - 30 ? 'end' : 'start'}
                  className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono font-medium select-none pointer-events-none"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={width - 15}
            y={Math.min(Math.max(originY - 10, 20), height - 10)}
            className="fill-slate-500 dark:fill-slate-400 text-xs font-mono font-bold select-none pointer-events-none"
          >
            x
          </text>
          <text
            x={Math.min(Math.max(originX + 10, 10), width - 20)}
            y={20}
            className="fill-slate-500 dark:fill-slate-400 text-xs font-mono font-bold select-none pointer-events-none"
          >
            y
          </text>

          {/* Axis of Symmetry (dashed line) */}
          {a !== 0 && (
            <line
              x1={vertexScreenX}
              y1={0}
              x2={vertexScreenX}
              y2={height}
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
            stroke="url(#curveGradQuad)"
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
            x={originX - 10}
            y={originY - c * scale - 8}
            textAnchor="end"
            className="fill-indigo-600 dark:fill-indigo-400 text-[11px] font-mono font-semibold select-none pointer-events-none"
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
                x={vertexScreenX + 10}
                y={vertexScreenY + (a > 0 ? -10 : 18)}
                className="fill-amber-500 dark:fill-amber-400 text-[11px] font-mono font-bold select-none pointer-events-none"
              >
                V({vertexX.toFixed(1)}, {vertexY.toFixed(2)})
              </text>
            </g>
          )}

          {/* Roots on X-axis */}
          {root1 !== null && (
            <g>
              {isHighlight && (
                <circle
                  cx={originX + root1 * scale}
                  cy={originY}
                  r="12"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  className="animate-ping opacity-60"
                />
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
                className="fill-emerald-600 dark:fill-emerald-400 text-[11px] font-mono font-bold select-none pointer-events-none"
              >
                x₁={root1.toFixed(2)}
              </text>
            </g>
          )}

          {root2 !== null && root2 !== root1 && (
            <g>
              {isHighlight && (
                <circle
                  cx={originX + root2 * scale}
                  cy={originY}
                  r="12"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  className="animate-ping opacity-60"
                />
              )}
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
                className="fill-emerald-600 dark:fill-emerald-400 text-[11px] font-mono font-bold select-none pointer-events-none"
              >
                x₂={root2.toFixed(2)}
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* Floating Info Pill */}
      <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#121620]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs font-mono flex flex-col gap-1 z-10 pointer-events-none">
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

      {/* Desmos-style Floating Navigation Controls */}
      <GraphControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetView}
        userZoom={userZoom}
      />
    </div>
  );
};
