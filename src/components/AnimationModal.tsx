import React, { useRef } from 'react';
import { 
  X, 
  Sparkles,
  Layers
} from 'lucide-react';
import { TopicData } from '../types';
import { QuadraticVisual } from './visuals/QuadraticVisual';
import { TrigCircleVisual } from './visuals/TrigCircleVisual';
import { DerivativeVisual } from './visuals/DerivativeVisual';
import { ThreeJs3DVisual } from './visuals/ThreeJs3DVisual';
import { CircleAreaVisual } from './visuals/CircleAreaVisual';
import { EquationVisual } from './visuals/EquationVisual';
import { useScriptedTimeline } from '../hooks/useScriptedTimeline';
import { NarrationOverlay } from './timeline/NarrationOverlay';
import { TimelineControlBar } from './timeline/TimelineControlBar';
import { KatexRenderer } from './KatexRenderer';

interface AnimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: TopicData;
}

export const AnimationModal: React.FC<AnimationModalProps> = ({
  isOpen,
  onClose,
  topic
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hook for scripted timeline running inside the modal
  const timeline = useScriptedTimeline(
    topic,
    topic.defaultValues,
    isOpen
  );

  if (!isOpen) return null;

  const effectiveParams = timeline.interpolatedParams;
  const currentPhase = timeline.phase;

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
            zoom={1.15}
            showGrid={true}
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
            zoom={1.1}
            showGrid={true}
            animationPhase={currentPhase}
          />
        );

      case 'trigonometry':
      case 'trig_circle':
        return (
          <TrigCircleVisual
            angleDeg={effectiveParams.angleDeg ?? 45}
            zoom={1.1}
            showGrid={true}
            animationPhase={currentPhase}
          />
        );

      case 'calculus':
      case 'derivative':
        return (
          <DerivativeVisual
            x0={effectiveParams.x0 ?? 1.0}
            deltaX={effectiveParams.deltaX ?? 0.8}
            zoom={1.1}
            showGrid={true}
            animationPhase={currentPhase}
          />
        );

      case 'equation':
        return (
          <EquationVisual
            a={effectiveParams.a ?? 1}
            b={effectiveParams.b ?? -5}
            c={effectiveParams.c ?? 6}
            zoom={1.1}
            showGrid={true}
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
            zoom={1.1}
            showGrid={true}
            animationPhase={currentPhase}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        ref={containerRef}
        className="bg-[#0E1015] border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#26282E] flex items-center justify-between bg-[#181A20]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-[#F26207] border border-orange-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-white text-base">
                  Hoạt cảnh Giải thích Chi tiết (Timeline có kịch bản)
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30">
                  Vector Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans flex items-center gap-2 mt-0.5">
                <span>{topic.title}</span>
                <span>•</span>
                <KatexRenderer latex={topic.formulaSummary} className="text-xs text-orange-400" />
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Animation Visual Stage */}
        <div className="flex-1 min-h-[420px] bg-[#0A0C10] relative flex items-center justify-center overflow-hidden">
          
          {/* Active Canvas Model */}
          {renderVisualEngine()}

          {/* Narration Subtitle Banner */}
          <NarrationOverlay
            phase={timeline.phase}
            step={timeline.activeScriptStep}
            stepIndex={timeline.currentStepIndex}
            totalSteps={timeline.compiledTimeline.steps.length}
            progress={timeline.progress}
          />
        </div>

        {/* Timeline Controls */}
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
          onReturnToInteractive={onClose}
          containerRef={containerRef}
        />

      </div>
    </div>
  );
};
