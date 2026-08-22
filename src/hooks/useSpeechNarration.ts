import { useState, useEffect, useRef, useCallback } from 'react';
import { TimelineScriptStep } from '../types';

const STORAGE_KEY = 'math_speech_narration_enabled';

// Clean math/LaTeX notation to sound natural in Vietnamese Speech Synthesis
function cleanMathForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\Delta/g, 'Đen-ta ')
    .replace(/\\sqrt\{([^}]+)\}/g, 'căn bậc hai của $1')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 chia cho $2')
    .replace(/\^2/g, ' bình phương ')
    .replace(/\^3/g, ' mũ ba ')
    .replace(/f'\(x\)/g, 'ép phẩy x')
    .replace(/f'\(x_0\)/g, 'ép phẩy tại x không')
    .replace(/x_1/g, 'x một')
    .replace(/x_2/g, 'x hai')
    .replace(/x_0/g, 'x không')
    .replace(/\\pm/g, 'cộng trừ ')
    .replace(/\\approx/g, 'xấp xỉ ')
    .replace(/\\le/g, 'nhỏ hơn hoặc bằng ')
    .replace(/\\ge/g, 'lớn hơn hoặc bằng ')
    .replace(/\\neq/g, 'khác ')
    .replace(/\\cdot/g, ' nhân ')
    .replace(/\\times/g, ' nhân ')
    .replace(/\\pi/g, 'pi')
    .replace(/\\alpha/g, 'an-pha')
    .replace(/\\theta/g, 'thê-ta')
    .replace(/\$/g, '')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\left|\\right/g, '')
    .trim();
}

interface UseSpeechNarrationOptions {
  activeScriptStep?: TimelineScriptStep;
  isPlaying: boolean;
  speed?: number;
  timelineActive: boolean;
}

export function useSpeechNarration({
  activeScriptStep,
  isPlaying,
  speed = 1,
  timelineActive,
}: UseSpeechNarrationOptions) {
  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const lastSpokenStepIdRef = useRef<string | null>(null);

  // Check if browser has speech synthesis and a Vietnamese voice
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setIsSupported(false);
      return;
    }

    const synth = window.speechSynthesis;

    const findVietnameseVoice = () => {
      const voices = synth.getVoices();
      if (!voices || voices.length === 0) {
        return null;
      }
      // Look for vi-VN or any vi voice
      const viVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('vi') ||
          v.lang.toLowerCase().replace('_', '-').includes('vi-vn')
      );
      return viVoice || null;
    };

    const updateSupport = () => {
      const viVoice = findVietnameseVoice();
      if (viVoice) {
        selectedVoiceRef.current = viVoice;
        setIsSupported(true);
      } else {
        const voices = synth.getVoices();
        // If voices list is already loaded and no Vietnamese voice exists
        if (voices.length > 0) {
          setIsSupported(false);
        }
      }
    };

    // Initial check
    updateSupport();

    // Chrome/Safari asynchronously populate getVoices()
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = updateSupport;
    }

    return () => {
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = null;
      }
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Safe catch
      }
    }
    setIsSpeaking(false);
  }, []);

  const toggleSpeech = useCallback(() => {
    setIsSpeechEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Storage might fail in sandboxed iframe
      }
      if (!next) {
        stopSpeaking();
      }
      return next;
    });
  }, [stopSpeaking]);

  // Read narration whenever activeScriptStep changes during active playback
  useEffect(() => {
    if (!timelineActive || !isPlaying || !isSpeechEnabled || !isSupported || !activeScriptStep) {
      if (!isPlaying || !timelineActive) {
        stopSpeaking();
        lastSpokenStepIdRef.current = null;
      }
      return;
    }

    const currentStepId = `${activeScriptStep.phase}-${activeScriptStep.title}-${activeScriptStep.narration}`;
    if (lastSpokenStepIdRef.current === currentStepId) {
      return;
    }

    lastSpokenStepIdRef.current = currentStepId;
    stopSpeaking();

    const rawText = activeScriptStep.narration || activeScriptStep.title;
    const spokenText = cleanMathForSpeech(rawText);

    if (!spokenText) return;

    try {
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.lang = 'vi-VN';
      if (selectedVoiceRef.current) {
        utterance.voice = selectedVoiceRef.current;
      }

      // Slightly modulate rate according to playback speed
      const baseRate = 0.95;
      utterance.rate = Math.max(0.75, Math.min(1.4, baseRate * (speed >= 1.5 ? 1.2 : speed <= 0.75 ? 0.85 : 1)));
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  }, [activeScriptStep, isPlaying, isSpeechEnabled, isSupported, speed, timelineActive, stopSpeaking]);

  // Stop on timeline pause / reset / unmount
  useEffect(() => {
    if (!isPlaying || !timelineActive) {
      stopSpeaking();
    }
  }, [isPlaying, timelineActive, stopSpeaking]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  return {
    isSpeechEnabled,
    isSupported,
    isSpeaking,
    toggleSpeech,
    stopSpeaking,
  };
}
