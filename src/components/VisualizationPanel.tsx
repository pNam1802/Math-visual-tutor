import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Grid, 
  Sparkles,
  Sliders,
  Play
} from 'lucide-react';
import { TopicData } from '../types';
import { QuadraticVisual } from './visuals/QuadraticVisual';
import { TrigCircleVisual } from './visuals/TrigCircleVisual';
import { DerivativeVisual } from './visuals/DerivativeVisual';
import { ThreeJs3DVisual } from './visuals/ThreeJs3DVisual';
import { CircleAreaVisual } from './visuals/CircleAreaVisual';
import { EquationVisual } from './visuals/EquationVisual';
import { KatexRenderer } from './KatexRenderer';
import { useScriptedTimeline } from '../hooks/useScriptedTimeline';
import { NarrationOverlay } from './timeline/NarrationOverlay';
import { TimelineControlBar } from './timeline/TimelineControlBar';
import { TimelinePreparingCard } from './timeline/TimelinePreparingCard';

interface VisualizationPanelProps {
  topic: TopicData;
  paramValues: Record<string, number>;
  onParamChange: (paramId: string, value: number) => void;
  onOpenFullscreen: () => void;
  onRequestAnimation?: () => void;
  animationTrigger?: number;
}

export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  topic,
  paramValues,
  onParamChange,
  onOpenFullscreen,
  onRequestAnimation,
  animationTrigger = 0
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  
  // Display Mode: 'interactive' (Sliders) | 'preparing' (1s loader) | 'timeline' (Scripted Animation)
  const [mode, setMode] = useState<'interactive' | 'preparing' | 'timeline'>('interactive');

  const containerRef = useRef<HTMLDivElement>(null);

  // Hook for scripted timeline
  const timeline = useScriptedTimeline(
    topic,
    paramValues,
    mode === 'timeline'
  );

  // Respond to external animation triggers (from Chat / Explanation panels)
  useEffect(() => {
    if (animationTrigger > 0) {
      setMode('preparing');
    }
  }, [animationTrigger]);

  const handleStartScriptedAnimation = () => {
    setMode('preparing');
    if (onRequestAnimation) onRequestAnimation();
  };

  const handleAnimationReady = () => {
    setMode('timeline');
    timeline.reset();
  };

  const handleReturnToInteractive = () => {
    timeline.pause();
    setMode('interactive');
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.6));
  const handleResetZoom = () => setZoom(1);

  // Effective params and phase for renderer
  const isTimelineActive = mode === 'timeline';
  const effectiveParams = isTimelineActive ? timeline.interpolatedParams : paramValues;
  const currentPhase = isTimelineActive ? timeline.phase : undefined;

  const renderVisualEngine = () => {
    switch (topic.type) {
      case 'geometry_3d':
      case 'vector':
      case 'vector_3d':
        return (
          <ThreeJs3DVisual
            vx={effectiveParams.vx ?? 3}
            vy={effectiveParams.vy ?? 4}
            vz={effectiveParams.vz ?? 3}
            zoom={zoom}
            showGrid={showGrid}
            topic={topic.type}
            concept={topic.concept}
            animationPhase={currentPhase}
          />
        );

      case 'geometry_2d':
      case 'circle_area':
        return (
          <CircleAreaVisual
            radius={effectiveParams.radius ?? 4}
            slices={effectiveParams.slices ?? 16}
            zoom={zoom}
            showGrid={showGrid}
            animationPhase={currentPhase}
          />
        );

      case 'trigonometry':
      case 'trig_circle':
        return (
          <TrigCircleVisual
            angleDeg={effectiveParams.angleDeg ?? 45}
            zoom={zoom}
            showGrid={showGrid}
            animationPhase={currentPhase}
          />
        );

      case 'calculus':
      case 'derivative':
        return (
          <DerivativeVisual
            x0={effectiveParams.x0 ?? 1.0}
            deltaX={effectiveParams.deltaX ?? 0.8}
            zoom={zoom}
            showGrid={showGrid}
            animationPhase={currentPhase}
          />
        );

      case 'equation':
        return (
          <EquationVisual
            a={effectiveParams.a ?? 1}
            b={effectiveParams.b ?? -5}
            c={effectiveParams.c ?? 6}
            zoom={zoom}
            showGrid={showGrid}
            concept={topic.concept}
            animationPhase={currentPhase}
          />
        );

      case 'algebra':
      case 'quadratic':
      default:
        return (
          <QuadraticVisual
            a={effectiveParams.a ?? 1}
            b={effectiveParams.b ?? -5}
            c={effectiveParams.c ?? 6}
            zoom={zoom}
            showGrid={showGrid}
            animationPhase={currentPhase}
          />
        );
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex-1 bg-white dark:bg-[#181A20] rounded-2xl border border-[#EAE4D9] dark:border-[#26282E] shadow-sm overflow-hidden flex flex-col transition-colors"
    >
      
      {/* Top Header of Canvas */}
      <div className="px-5 py-3.5 border-b border-[#EAE4D9] dark:border-[#26282E] flex items-center justify-between gap-3 bg-white dark:bg-[#181A20]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-2.5 h-2.5 rounded-full ${isTimelineActive ? 'bg-[#F59E0B] animate-pulse' : 'bg-[#F26207]'}`}></div>
          <h2 className="font-sans font-bold text-sm sm:text-base text-[#1C1B1A] dark:text-slate-100 truncate">
            {topic.renderInfo.title || topic.title}
          </h2>
          <span className="hidden sm:inline text-[11px] text-[#625F59] dark:text-slate-400">
            • <KatexRenderer latex={topic.formulaSummary} className="text-xs" />
          </span>
          {isTimelineActive && (
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/80 text-[#F26207] font-bold border border-orange-200 dark:border-orange-900/60 hidden md:inline">
              Scripted Timeline
            </span>
          )}
        </div>

        {/* Top Canvas Toolbar Controls */}
        <div className="flex items-center gap-1.5">
          {/* Toggle Grid */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            title={showGrid ? 'Ẩn lưới tọa độ' : 'Hiện lưới tọa độ'}
            className={`p-2 rounded-lg text-xs transition-colors border ${
              showGrid
                ? 'bg-orange-50 dark:bg-orange-950/80 text-[#F26207] border-orange-200 dark:border-orange-800'
                : 'bg-white dark:bg-slate-800 border-[#EAE4D9] dark:border-slate-700 text-[#625F59] dark:text-slate-400 hover:bg-[#FAF7F2]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            title="Thu nhỏ (-)"
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-[#EAE4D9] dark:border-slate-700 text-[#625F59] dark:text-slate-400 hover:bg-[#FAF7F2] dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Level Indicator */}
          <button
            onClick={handleResetZoom}
            title="Đặt lại mức thu phóng (100%)"
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-[#EAE4D9] dark:border-slate-700 text-[#1C1B1A] dark:text-slate-300 hover:bg-[#FAF7F2] dark:hover:bg-slate-700 font-mono text-xs transition-colors shadow-2xs font-semibold cursor-pointer"
          >
            {Math.round(zoom * 100)}%
          </button>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            title="Phóng to (+)"
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-[#EAE4D9] dark:border-slate-700 text-[#625F59] dark:text-slate-400 hover:bg-[#FAF7F2] dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Reset Zoom */}
          <button
            onClick={handleResetZoom}
            title="Căn giữa"
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-[#EAE4D9] dark:border-slate-700 text-[#625F59] dark:text-slate-400 hover:bg-[#FAF7F2] dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-[#EAE4D9] dark:bg-slate-700 mx-0.5"></div>

          {/* Fullscreen Modal trigger */}
          <button
            onClick={onOpenFullscreen}
            title="Mở toàn màn hình"
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-[#EAE4D9] dark:border-slate-700 hover:border-[#F26207] hover:text-[#F26207] dark:hover:text-orange-400 text-[#1C1B1A] dark:text-slate-300 transition-colors shadow-2xs cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Geometric Stage */}
      <div className="relative min-h-[380px] sm:min-h-[420px] bg-[#FAF7F2] dark:bg-[#0F1219] flex items-center justify-center p-3 overflow-hidden">
        
        {/* Render Active Geometric Model */}
        {renderVisualEngine()}

        {/* 1. Preparing / Script compilation overlay (~1.0s) */}
        {mode === 'preparing' && (
          <TimelinePreparingCard
            topic={topic}
            onReady={handleAnimationReady}
          />
        )}

        {/* 2. Narration Subtitle Banner when Timeline is active */}
        {isTimelineActive && (
          <NarrationOverlay
            phase={timeline.phase}
            step={timeline.activeScriptStep}
            stepIndex={timeline.currentStepIndex}
            totalSteps={timeline.compiledTimeline.steps.length}
            progress={timeline.progress}
          />
        )}

      </div>

      {/* Dynamic Bottom Controls: Scripted Timeline Bar OR Interactive Sliders */}
      {isTimelineActive ? (
        <TimelineControlBar
          isPlaying={timeline.isPlaying}
          progress={timeline.progress}
          currentTime={timeline.currentTime}
          duration={timeline.duration}
          speed={timeline.speed}
          phase={timeline.phase}
          currentStepIndex={timeline.currentStepIndex}
          compiledTimeline={timeline.compiledTimeline}
          onTogglePlay={timeline.togglePlay}
          onReset={timeline.reset}
          onPrevStep={timeline.prevStep}
          onNextStep={timeline.nextStep}
          onSeek={timeline.seekTo}
          onSpeedChange={timeline.setSpeed}
          onReturnToInteractive={handleReturnToInteractive}
          containerRef={containerRef}
        />
      ) : (
        /* Standard Interactive Parameter Sliders & Action Row */
        <div className="p-4 sm:p-5 border-t border-[#EAE4D9] dark:border-[#26282E] bg-white dark:bg-[#121620] flex flex-wrap items-center justify-between gap-4 transition-colors">
          
          {/* Sliders Area */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-6">
            {topic.params.map((param) => {
              const currentValue = paramValues[param.id] ?? param.defaultValue;
              return (
                <div key={param.id} className="flex flex-col">
                  <label className="text-[10px] uppercase font-bold text-[#625F59] dark:text-slate-400 mb-1 flex items-center gap-1">
                    <span>{param.name}</span>
                    {param.symbol && (
                      <span className="font-mono text-[#F26207] dark:text-orange-400">({param.symbol})</span>
                    )}
                  </label>

                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={currentValue}
                      onChange={(e) => onParamChange(param.id, parseFloat(e.target.value))}
                      className="w-28 sm:w-36 h-1.5 bg-[#EAE4D9] dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#F26207]"
                    />
                    <span className="text-xs font-mono font-bold text-[#F26207] dark:text-orange-400 min-w-[36px]">
                      {currentValue} {param.unit ?? ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3Blue1Brown Scripted Animation Action Button */}
          <button
            onClick={handleStartScriptedAnimation}
            className="bg-[#F26207] hover:bg-[#D95300] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer hover:shadow-md hover:shadow-orange-500/20 active:scale-95"
            title="Kích hoạt chuỗi hoạt cảnh kịch bản 4 giai đoạn chạy trực tiếp trong Canvas"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tạo animation giải thích chi tiết</span>
          </button>

        </div>
      )}

    </div>
  );
};
