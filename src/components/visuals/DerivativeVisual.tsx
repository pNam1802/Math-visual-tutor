import React, { useMemo } from 'react';
import { useGraphPanZoom } from './useGraphPanZoom';
import { GraphControls } from './GraphControls';

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

  // Cubic function f(x) = x^3 - 3x
  const f = (x: number) => x * x * x - 3 * x;
  // Exact derivative f'(x) = 3x^2 - 3
  const fPrime = (x: number) => 3 * x * x - 3;

  const y0 = f(x0);
  const x1 = x0 + deltaX;
  const y1 = f(x1);

  // Secant slope m_sec
  const mSec = deltaX !== 0 ? (y1 - y0) / deltaX : fPrime(x0);
  // Tangent slope m_tan
  const mTan = fPrime(x0);

  // Auto-calculate domain based on key points with >= 20% margin
  const { baseOriginX, baseOriginY, baseScale } = useMemo(() => {
    // Key points: x0, x1, roots (0, ±√3 ≈ ±1.732), extrema (±1)
    const keyXList = [0, -1.8, 1.8, x0, x1];
    const minKeyX = Math.min(...keyXList);
    const maxKeyX = Math.max(...keyXList);
    const rawSpanX = Math.max(maxKeyX - minKeyX, 3.5);

    const marginX = rawSpanX * 0.25;
    const domainMinX = minKeyX - marginX;
    const domainMaxX = maxKeyX + marginX;
    const spanX = domainMaxX - domainMinX;

    const keyYList = [0, y0, y1, -2.2, 2.2, f(domainMinX), f(domainMaxX)];
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
    const computedBaseScale = Math.max(12, Math.min(autoScale, 65));

    const domainCenterX = (domainMinX + domainMaxX) / 2;
    const domainCenterY = (domainMinY + domainMaxY) / 2;

    const origX = width / 2 - domainCenterX * computedBaseScale;
    const origY = height / 2 + domainCenterY * computedBaseScale;

    return {
      baseOriginX: origX,
      baseOriginY: origY,
      baseScale: computedBaseScale,
    };
  }, [x0, x1, y0, y1, width, height]);

  // Combined scale and origin accounting for user pan & zoom
  const scale = baseScale * zoom * userZoom;
  const originX = baseOriginX + pan.x;
  const originY = baseOriginY + pan.y;

  // Visible domain in current viewport
  const visibleMinX = (0 - originX) / scale - 1;
  const visibleMaxX = (width - originX) / scale + 1;
  const visibleMinY = (originY - height) / scale - 1;
  const visibleMaxY = (originY - 0) / scale + 1;

  // Curve points
  const curvePoints: [number, number][] = [];
  const step = Math.max(0.02, (visibleMaxX - visibleMinX) / 220);
  for (let x = visibleMinX; x <= visibleMaxX; x += step) {
    const y = f(x);
    curvePoints.push([originX + x * scale, originY - y * scale]);
  }
  const curvePath = curvePoints.reduce((acc, [sx, sy], idx) => {
    return idx === 0 ? `M ${sx.toFixed(1)} ${sy.toFixed(1)}` : `${acc} L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
  }, '');

  // Dynamic span for tangent and secant lines across the full visible x range
  const tanP1 = [originX + visibleMinX * scale, originY - (y0 + mTan * (visibleMinX - x0)) * scale];
  const tanP2 = [originX + visibleMaxX * scale, originY - (y0 + mTan * (visibleMaxX - x0)) * scale];

  const secP1 = [originX + visibleMinX * scale, originY - (y0 + mSec * (visibleMinX - x0)) * scale];
  const secP2 = [originX + visibleMaxX * scale, originY - (y0 + mSec * (visibleMaxX - x0)) * scale];

  const screenP0 = [originX + x0 * scale, originY - y0 * scale];
  const screenP1 = [originX + x1 * scale, originY - y1 * scale];

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
      className={`w-full h-full relative flex items-center justify-center select-none overflow-hidden touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full max-h-[460px] drop-shadow-sm"
      >
        <defs>
          <clipPath id="clip-deriv-canvas">
            <rect x="0" y="0" width={width} height={height} rx="8" />
          </clipPath>

          <pattern
            id="grid-deriv-pattern"
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
        </defs>

        <g clipPath="url(#clip-deriv-canvas)">
          {showGrid && <rect width={width} height={height} fill="url(#grid-deriv-pattern)" />}

          {/* Axes */}
          <line
            x1={0}
            y1={originY}
            x2={width}
            y2={originY}
            stroke="currentColor"
            className="text-slate-400 dark:text-slate-600"
            strokeWidth="1.5"
          />
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
            y={Math.min(Math.max(originY - 8, 20), height - 10)}
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

          {/* Function Curve f(x) = x³ - 3x */}
          <path
            d={curvePath}
            fill="none"
            stroke="#4338CA"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Secant line (Dashed cyan) */}
          <line
            x1={secP1[0]}
            y1={secP1[1]}
            x2={secP2[0]}
            y2={secP2[1]}
            stroke="#0EA5E9"
            strokeWidth="1.8"
            strokeDasharray="6 4"
            className="opacity-80"
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
          {Math.abs(deltaX) > 0.05 && (
            <polygon
              points={`${screenP0[0]},${screenP0[1]} ${screenP1[0]},${screenP0[1]} ${screenP1[0]},${screenP1[1]}`}
              className="fill-sky-500/15 stroke-sky-500/50"
              strokeDasharray="2 2"
            />
          )}
          {Math.abs(deltaX) > 0.05 && (
            <text
              x={(screenP0[0] + screenP1[0]) / 2}
              y={screenP0[1] + (y1 >= y0 ? 16 : -8)}
              textAnchor="middle"
              className="fill-sky-600 dark:fill-sky-400 text-[10px] font-mono font-semibold select-none pointer-events-none"
            >
              Δx = {deltaX.toFixed(2)}
            </text>
          )}

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
            className="fill-amber-600 dark:fill-amber-400 text-xs font-mono font-bold select-none pointer-events-none"
          >
            P({x0.toFixed(1)}, {y0.toFixed(2)})
          </text>

          {/* Point Q(x0+dx, y1) */}
          {Math.abs(deltaX) > 0.05 && (
            <>
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
                className="fill-sky-600 dark:fill-sky-400 text-xs font-mono font-bold select-none pointer-events-none"
              >
                Q({x1.toFixed(2)}, {y1.toFixed(2)})
              </text>
            </>
          )}
        </g>
      </svg>

      {/* Floating Info Pill */}
      <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#121620]/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs font-mono flex flex-col gap-1.5 z-10 pointer-events-none">
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
