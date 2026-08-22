import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { TopicData, TimelinePhase, TimelineScriptStep, AnimationTimelineState } from '../types';
import { compileTimelineScript, interpolateParameters, CompiledTimeline } from '../utils/timelineEngine';

export function useScriptedTimeline(
  topic: TopicData,
  baseParams: Record<string, number>,
  enabled: boolean = false
) {
  const compiledTimeline = useMemo<CompiledTimeline>(() => {
    return compileTimelineScript(topic, baseParams);
  }, [topic, baseParams]);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);

  const duration = compiledTimeline.duration; // total seconds

  // Active step & Phase calculation
  const currentStepIndex = useMemo(() => {
    const idx = compiledTimeline.steps.findIndex(
      (s) => progress >= s.startPct && progress <= s.endPct
    );
    return idx !== -1 ? idx : progress >= 100 ? compiledTimeline.steps.length - 1 : 0;
  }, [compiledTimeline.steps, progress]);

  const activeScriptStep = useMemo<TimelineScriptStep>(() => {
    return compiledTimeline.steps[currentStepIndex] || compiledTimeline.steps[0];
  }, [compiledTimeline.steps, currentStepIndex]);

  const phase: TimelinePhase = activeScriptStep.phase;

  // Real-time smooth parameter interpolation
  const interpolatedParams = useMemo<Record<string, number>>(() => {
    return interpolateParameters(topic, baseParams, progress, compiledTimeline);
  }, [topic, baseParams, progress, compiledTimeline]);

  // RequestAnimationFrame playback loop
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !isPlaying) {
      lastTimeRef.current = null;
      return;
    }

    let animationFrameId: number;

    const tick = (now: number) => {
      if (lastTimeRef.current !== null) {
        const deltaMs = now - lastTimeRef.current;
        const deltaSec = deltaMs / 1000;
        const progressDelta = (deltaSec * speed / duration) * 100;

        setProgress((prev) => {
          const next = prev + progressDelta;
          if (next >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return next;
        });
      }
      lastTimeRef.current = now;
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lastTimeRef.current = null;
    };
  }, [enabled, isPlaying, speed, duration]);

  const play = useCallback(() => {
    if (progress >= 100) {
      setProgress(0);
    }
    setIsPlaying(true);
  }, [progress]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seekTo = useCallback((pct: number) => {
    setProgress(Math.max(0, Math.min(100, pct)));
  }, []);

  const reset = useCallback(() => {
    setProgress(0);
    setIsPlaying(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < compiledTimeline.steps.length - 1) {
      const next = compiledTimeline.steps[currentStepIndex + 1];
      seekTo(next.startPct + 1);
    }
  }, [currentStepIndex, compiledTimeline.steps, seekTo]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prev = compiledTimeline.steps[currentStepIndex - 1];
      seekTo(prev.startPct);
    } else {
      seekTo(0);
    }
  }, [currentStepIndex, compiledTimeline.steps, seekTo]);

  const currentTime = (progress / 100) * duration;

  return {
    isPlaying,
    progress,
    currentTime,
    duration,
    speed,
    phase,
    currentStepIndex,
    activeScriptStep,
    compiledTimeline,
    interpolatedParams,
    play,
    pause,
    togglePlay,
    seekTo,
    reset,
    nextStep,
    prevStep,
    setSpeed
  };
}
