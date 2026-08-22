import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Sliders,
  Volume2,
  VolumeX
} from 'lucide-react';
import { TimelinePhase, TimelineScriptStep } from '../../types';
import { CompiledTimeline } from '../../utils/timelineEngine';

interface TimelineControlBarProps {
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  speed: number;
  phase: TimelinePhase;
  currentStepIndex: number;
  compiledTimeline: CompiledTimeline;
  isSpeechEnabled?: boolean;
  isSpeechSupported?: boolean;
  isSpeaking?: boolean;
  onToggleSpeech?: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSeek: (pct: number) => void;
  onSpeedChange: (speed: number) => void;
  onReturnToInteractive: () => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const TimelineControlBar: React.FC<TimelineControlBarProps> = ({
  isPlaying,
  progress,
  currentTime,
  duration,
  speed,
  phase,
  currentStepIndex,
  compiledTimeline,
  isSpeechEnabled = false,
  isSpeechSupported = false,
  isSpeaking = false,
  onToggleSpeech,
  onTogglePlay,
  onReset,
  onPrevStep,
  onNextStep,
  onSeek,
  onSpeedChange,
  onReturnToInteractive
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 sm:p-5 border-t border-[#EAE4D9] dark:border-[#26282E] bg-white dark:bg-[#121620] space-y-3.5 transition-colors">
      
      {/* 1. Milestone Multi-segment Scrub Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono text-[#625F59] dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1C1B1A] dark:text-slate-200">
              {formatTime(currentTime)}
            </span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/80 text-[#F26207] font-bold">
              60 FPS Vector
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-sans">
            <span className={phase === 'intro' ? 'text-indigo-500 font-bold' : 'opacity-60'}>Intro</span>
            <span>•</span>
            <span className={phase === 'build-up' ? 'text-cyan-500 font-bold' : 'opacity-60'}>Dựng hình</span>
            <span>•</span>
            <span className={phase === 'highlight' ? 'text-[#F59E0B] font-bold' : 'opacity-60'}>Điểm nhấn</span>
            <span>•</span>
            <span className={phase === 'conclusion' ? 'text-emerald-500 font-bold' : 'opacity-60'}>Kết luận</span>
          </div>
        </div>

        {/* Scrub Slider with custom gradient representing phases */}
        <div className="relative flex items-center group">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full accent-[#F26207] cursor-pointer h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none relative z-10"
          />
          {/* Phase tick marks */}
          <div className="absolute inset-x-0 h-1 pointer-events-none flex justify-between px-1">
            <span className="w-1 h-1 rounded-full bg-indigo-400" style={{ left: '0%' }}></span>
            <span className="w-1 h-1 rounded-full bg-cyan-400" style={{ left: '20%' }}></span>
            <span className="w-1 h-1 rounded-full bg-amber-400" style={{ left: '65%' }}></span>
            <span className="w-1 h-1 rounded-full bg-emerald-400" style={{ left: '85%' }}></span>
            <span className="w-1 h-1 rounded-full bg-slate-400" style={{ left: '100%' }}></span>
          </div>
        </div>
      </div>

      {/* 2. Controls Toolbar Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        
        {/* Playback action controls */}
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-xl bg-[#F26207] hover:bg-[#D95300] text-white flex items-center justify-center font-bold transition-all shadow-sm cursor-pointer"
            title={isPlaying ? 'Tạm dừng (Space)' : 'Phát kịch bản'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>

          {/* Reset / Rewind */}
          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 hover:bg-[#EAE4D9] dark:hover:bg-slate-700 text-[#625F59] dark:text-slate-300 transition-colors border border-[#EAE4D9] dark:border-slate-700 cursor-pointer"
            title="Tua lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step Prev */}
          <button
            onClick={onPrevStep}
            className="p-2 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 hover:bg-[#EAE4D9] dark:hover:bg-slate-700 text-[#625F59] dark:text-slate-300 transition-colors border border-[#EAE4D9] dark:border-slate-700 cursor-pointer"
            title="Bước trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Step Next */}
          <button
            onClick={onNextStep}
            className="p-2 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 hover:bg-[#EAE4D9] dark:hover:bg-slate-700 text-[#625F59] dark:text-slate-300 transition-colors border border-[#EAE4D9] dark:border-slate-700 cursor-pointer"
            title="Bước tiếp theo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Speed selector chips */}
          <div className="flex items-center bg-[#FAF7F2] dark:bg-slate-800 p-1 rounded-xl border border-[#EAE4D9] dark:border-slate-700 text-xs font-mono ml-1">
            {[0.5, 1, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  speed === s
                    ? 'bg-[#F26207] text-white font-bold'
                    : 'text-[#625F59] dark:text-slate-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2.5">
          {/* Voice Narration Toggle (3Blue1Brown Audio Voiceover) */}
          {isSpeechSupported && (
            <button
              onClick={onToggleSpeech}
              className={`p-2 rounded-xl transition-all border flex items-center gap-1.5 text-xs font-sans font-medium cursor-pointer ${
                isSpeechEnabled
                  ? 'bg-orange-50 dark:bg-orange-950/60 text-[#F26207] border-orange-200 dark:border-orange-900/60 shadow-xs'
                  : 'bg-[#FAF7F2] dark:bg-slate-800 text-[#625F59] dark:text-slate-400 border-[#EAE4D9] dark:border-slate-700 hover:text-[#1C1B1A] dark:hover:text-white'
              }`}
              title={
                isSpeechEnabled
                  ? 'Giọng kể 3B1B tiếng Việt: Đang BẬT (Click để tắt)'
                  : 'Giọng kể 3B1B tiếng Việt: Đang TẮT (Click để bật đọc lời dẫn)'
              }
            >
              {isSpeechEnabled ? (
                <>
                  <Volume2 className={`w-4 h-4 text-[#F26207] ${isSpeaking ? 'animate-pulse' : ''}`} />
                  <span className="hidden sm:inline text-[11px] font-bold">Giọng đọc (BẬT)</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 opacity-70" />
                  <span className="hidden sm:inline text-[11px]">Giọng đọc (TẮT)</span>
                </>
              )}
            </button>
          )}

          {/* Return to interactive mode (Sliders) */}
          <button
            onClick={onReturnToInteractive}
            className="bg-[#1C1B1A] dark:bg-slate-100 hover:bg-[#333] dark:hover:bg-white text-white dark:text-[#1C1B1A] px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#F26207]" />
            <span>Quay lại tương tác (Sliders)</span>
          </button>
        </div>

      </div>

    </div>
  );
};
