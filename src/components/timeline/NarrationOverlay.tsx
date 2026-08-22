import React from 'react';
import { TimelinePhase, TimelineScriptStep } from '../../types';
import { KatexRenderer } from '../KatexRenderer';
import { Sparkles, Compass, Lightbulb, CheckCircle2, Play, Volume2 } from 'lucide-react';

interface NarrationOverlayProps {
  phase: TimelinePhase;
  step: TimelineScriptStep;
  stepIndex: number;
  totalSteps: number;
  progress: number;
  isSpeaking?: boolean;
  isSpeechEnabled?: boolean;
}

export const NarrationOverlay: React.FC<NarrationOverlayProps> = ({
  phase,
  step,
  stepIndex,
  totalSteps,
  progress,
  isSpeaking = false,
  isSpeechEnabled = false
}) => {
  const getPhaseBadge = () => {
    switch (phase) {
      case 'intro':
        return {
          icon: <Compass className="w-3.5 h-3.5" />,
          label: 'GIAI ĐOẠN 1: KHỞI TẠO BÀI TOÁN',
          classes: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
        };
      case 'build-up':
        return {
          icon: <Play className="w-3.5 h-3.5" />,
          label: `GIAI ĐOẠN 2: DỰNG HÌNH & BIẾN ĐỔI (${stepIndex} / ${totalSteps - 2})`,
          classes: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
        };
      case 'highlight':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#F59E0B]" />,
          label: 'GIAI ĐOẠN 3: ĐIỂM MẤU CHỐT & TRỰC QUAN HÓA',
          classes: 'bg-amber-500/25 text-amber-300 border-amber-500/60 shadow-lg shadow-amber-950/40'
        };
      case 'conclusion':
      default:
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'GIAI ĐOẠN 4: KẾT LUẬN & CÔNG THỨC',
          classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        };
    }
  };

  const badge = getPhaseBadge();

  return (
    <div className="absolute top-3 inset-x-3 sm:inset-x-5 z-20 pointer-events-none transition-all duration-300">
      <div className="bg-[#121316]/95 dark:bg-[#121316]/95 backdrop-blur-md border border-[#26282E] rounded-2xl p-3.5 sm:p-4 shadow-xl text-white pointer-events-auto max-w-2xl mx-auto space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
        
        {/* Phase Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider border ${badge.classes}`}>
              {badge.icon}
              {badge.label}
            </span>
            {isSpeechEnabled && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-orange-300 bg-orange-950/60 px-2 py-0.5 rounded-full border border-orange-800/60">
                <Volume2 className={`w-3 h-3 text-[#F26207] ${isSpeaking ? 'animate-pulse' : ''}`} />
                <span>{isSpeaking ? 'Đang đọc...' : 'Giọng 3B1B'}</span>
              </span>
            )}
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            Tiến độ: <span className="text-[#F26207] font-bold">{Math.round(progress)}%</span>
          </span>
        </div>

        {/* Step Title & Explanation */}
        <div className="space-y-1">
          <h4 className="font-heading font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
            {step.title}
          </h4>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {step.narration}
          </p>
        </div>

        {/* Dynamic Formula or Highlight Bar */}
        {(step.formula || step.keyHighlight) && (
          <div className="pt-1.5 flex flex-wrap items-center gap-2.5 border-t border-slate-800 text-xs">
            {step.formula && (
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 font-mono text-orange-400">
                <span className="text-[10px] text-slate-400 font-sans">Công thức:</span>
                <KatexRenderer latex={step.formula} className="text-xs text-orange-300 font-semibold" />
              </div>
            )}

            {step.keyHighlight && (
              <div className="flex items-center gap-1 text-[11px] text-[#F59E0B] font-mono font-medium">
                <Lightbulb className="w-3 h-3 text-[#F59E0B]" />
                <span>{step.keyHighlight}</span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
