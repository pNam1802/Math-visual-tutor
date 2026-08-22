import React, { useMemo } from 'react';
import { useGraphPanZoom } from './useGraphPanZoom';
import { GraphControls } from './GraphControls';

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

  // Vertex calculation for quadratic
  const vertexX = a !== 0 ? -b / (2 * a) : 0;
  const vertexY = a !== 0 ? a * vertexX * vertexX + b * vertexX + c : c;

  // Auto-calculate domain with >= 20% margin
  const { baseOriginX, baseOriginY, baseScale } = useMemo(() => {
    const keyXList = [0, vertexX];
    if (root1 !== null) keyXList.push(root1);
    if (root2 !== null) keyXList.push(root2);

    const minKeyX = Math.min(...keyXList);
    const maxKeyX = Math.max(...keyXList);
    const rawSpanX = Math.max(maxKeyX - minKeyX, 3.5);

    // 25% margin on each side for clear breathing room
    const marginX = rawSpanX * 0.25;
    const domainMinX = minKeyX - marginX;
    const domainMaxX = maxKeyX + marginX;
    const spanX = domainMaxX - domainMinX;

    const fAtMinX = a !== 0 ? a * domainMinX * domainMinX + b * domainMinX + c : b * domainMinX + c;
    const fAtMaxX = a !== 0 ? a * domainMaxX * domainMaxX + b * domainMaxX + c : b * domainMaxX + c;
    const keyYList = [0, vertexY, c, fAtMinX, fAtMaxX];
    const minKeyY = Math.min(...keyYList);
    const maxKeyY = Math.max(...keyYList);
    const rawSpanY = Math.max(maxKeyY - minKeyY, 3.5);
    const marginY = rawSpanY * 0.25;
    const domainMinY = minKeyY - marginY;
    const domainMaxY = maxKeyY + marginY;
    const spanY = domainMaxY - domainMinY;

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

  // Visible domain
  const visibleMinX = (0 - originX) / scale - 1;
  const visibleMaxX = (width - originX) / scale + 1;
  const visibleMinY = (originY - height) / scale - 1;
  const visibleMaxY = (originY - 0) / scale + 1;

  // Curve points
  const points: [number, number][] = [];
  const step = Math.max(0.02, (visibleMaxX - visibleMinX) / 220);

  for (let x = visibleMinX; x <= visibleMaxX; x += step) {
    const y = a !== 0 ? a * x * x + b * x + c : b * x + c;
    const sx = originX + x * scale;
    const sy = originY - y * scale;
    points.push([sx, sy]);
  }

  const pathD = points.reduce((acc, [sx, sy], idx) => {
    return idx === 0 ? `M ${sx.toFixed(1)} ${sy.toFixed(1)}` : `${acc} L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
  }, '');

  // Dynamic grid tick step calculation
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
      className={`w-full h-full relative flex items-center justify-center select-none overflow-hidden min-h-[380px] touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-h-[460px] drop-shadow-xs">
        <defs>
          <clipPath id="clip-eq-canvas">
            <rect x="0" y="0" width={width} height={height} rx="8" />
          </clipPath>

          <pattern
            id="grid-eq-pattern"
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
              className="text-[#EAE4D9] dark:text-white/5"
              strokeWidth="0.8"
            />
          </pattern>
          <linearGradient id="eqGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F26207" />
            <stop offset="100%" stopColor="#FF8B38" />
          </linearGradient>
        </defs>

        <g clipPath="url(#clip-eq-canvas)">
          {/* Grid */}
          {showGrid && <rect width={width} height={height} fill="url(#grid-eq-pattern)" />}

          {/* X Axis & Number Line */}
          <line
            x1={0}
            y1={originY}
            x2={width}
            y2={originY}
            stroke="currentColor"
            className="text-[#8F8D88] dark:text-slate-600"
            strokeWidth="2"
          />

          {/* Y Axis */}
          <line
            x1={originX}
            y1={0}
            x2={originX}
            y2={height}
            stroke="currentColor"
            className="text-[#8F8D88] dark:text-slate-600"
            strokeWidth="1.5"
          />

          {/* Axis Ticks */}
          {xTicks.map((tick) => {
            const tx = originX + tick * scale;
            if (tx < 15 || tx > width - 15) return null;
            return (
              <g key={`numline-${tick}`}>
                <line
                  x1={tx}
                  y1={originY - 5}
                  x2={tx}
                  y2={originY + 5}
                  stroke="currentColor"
                  className="text-[#625F59] dark:text-slate-400"
                  strokeWidth="1.5"
                />
                <text
                  x={tx}
                  y={originY + (originY > height - 25 ? -8 : 18)}
                  textAnchor="middle"
                  className="fill-[#625F59] dark:fill-slate-400 text-[10px] font-mono font-medium select-none pointer-events-none"
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
                  className="text-[#625F59] dark:text-slate-400"
                  strokeWidth="1.5"
                />
                <text
                  x={originX + (originX > width - 30 ? -8 : 12)}
                  y={ty + 3}
                  textAnchor={originX > width - 30 ? 'end' : 'start'}
                  className="fill-[#625F59] dark:fill-slate-400 text-[10px] font-mono font-medium select-none pointer-events-none"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Axis labels */}
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
              {isHighlight && (
                <circle
                  cx={originX + root1 * scale}
                  cy={originY}
                  r="14"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  className="animate-ping opacity-60"
                />
              )}
              <circle
                cx={originX + root1 * scale}
                cy={originY}
                r="6"
                fill="#10B981"
                className="stroke-white dark:stroke-[#121316]"
                strokeWidth="2.5"
              />
              <line
                x1={originX + root1 * scale}
                y1={originY}
                x2={originX + root1 * scale}
                y2={originY - 26}
                stroke="#10B981"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <rect
                x={originX + root1 * scale - 28}
                y={originY - 46}
                width="56"
                height="18"
                rx="5"
                fill="#10B981"
              />
              <text
                x={originX + root1 * scale}
                y={originY - 33}
                textAnchor="middle"
                className="fill-white text-[10px] font-mono font-bold select-none pointer-events-none"
              >
                x₁ = {root1.toFixed(2)}
              </text>
            </g>
          )}

          {root2 !== null && root2 !== root1 && (
            <g>
              {isHighlight && (
                <circle
                  cx={originX + root2 * scale}
                  cy={originY}
                  r="14"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  className="animate-ping opacity-60"
                />
              )}
              <circle
                cx={originX + root2 * scale}
                cy={originY}
                r="6"
                fill="#10B981"
                className="stroke-white dark:stroke-[#121316]"
                strokeWidth="2.5"
              />
              <line
                x1={originX + root2 * scale}
                y1={originY}
                x2={originX + root2 * scale}
                y2={originY - 26}
                stroke="#10B981"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <rect
                x={originX + root2 * scale - 28}
                y={originY - 46}
                width="56"
                height="18"
                rx="5"
                fill="#10B981"
              />
              <text
                x={originX + root2 * scale}
                y={originY - 33}
                textAnchor="middle"
                className="fill-white text-[10px] font-mono font-bold select-none pointer-events-none"
              >
                x₂ = {root2.toFixed(2)}
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* Info telemetry badge */}
      <div className="absolute top-3 left-3 bg-white/95 dark:bg-[#121620]/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#EAE4D9] dark:border-white/10 shadow-sm text-xs font-mono flex flex-col gap-1 z-10 pointer-events-none">
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
