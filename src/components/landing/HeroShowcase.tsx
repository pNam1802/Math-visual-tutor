import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { TrigCircleVisual } from '../visuals/TrigCircleVisual';
import { DerivativeVisual } from '../visuals/DerivativeVisual';
import { CircleAreaVisual } from '../visuals/CircleAreaVisual';
import { QuadraticVisual } from '../visuals/QuadraticVisual';

interface HeroShowcaseProps {
  /** Opens the app and runs this exact question. */
  onAskQuestion: (question: string) => void;
}

const TYPE_MS = 45;
const ERASE_MS = 20;
const HOLD_MS = 4600;

/** One full sweep of a visual's animated parameter. */
const SWEEP_MS = 7000;

interface ShowcaseItem {
  question: string;
  caption: string;
  /** progress is 0..1, one full sweep of this item's parameter. */
  render: (progress: number) => React.ReactNode;
}

// Every visual here is the same component the app itself renders, so what a
// visitor watches on the landing page is literally what they get after clicking.
// All four are plain SVG — deliberately no ThreeJs3DVisual, which would pull
// three.js into the landing bundle.
const ITEMS: ShowcaseItem[] = [
  {
    question: 'Tôi muốn hiểu vòng tròn lượng giác',
    caption: 'Góc quay θ và hình chiếu cos θ, sin θ',
    render: (p) => (
      <TrigCircleVisual angleDeg={Math.round(p * 360)} zoom={0.9} showGrid />
    )
  },
  {
    question: 'Đạo hàm thực chất là gì?',
    caption: 'Cát tuyến tiến dần thành tiếp tuyến khi Δx → 0',
    render: (p) => {
      // Ping-pong so Δx shrinks to the tangent, then opens back up.
      const swing = p < 0.5 ? p * 2 : (1 - p) * 2;
      return (
        <DerivativeVisual x0={1} deltaX={0.08 + swing * 1.6} zoom={0.9} showGrid />
      );
    }
  },
  {
    question: 'Vì sao diện tích hình tròn là πr²?',
    caption: 'Cắt thành n nan quạt rồi ghép lại thành hình chữ nhật',
    render: (p) => {
      const swing = p < 0.5 ? p * 2 : (1 - p) * 2;
      return (
        <CircleAreaVisual
          radius={4}
          slices={Math.round(6 + swing * 50)}
          zoom={0.85}
          showGrid
        />
      );
    }
  },
  {
    question: 'Giải phương trình x² − 5x + 6 = 0',
    caption: 'Đỉnh parabol và hai nghiệm trên trục hoành',
    render: (p) => {
      const swing = p < 0.5 ? p * 2 : (1 - p) * 2;
      return (
        <QuadraticVisual a={1} b={-5} c={4 + swing * 2} zoom={0.9} showGrid />
      );
    }
  }
];

export const HeroShowcase: React.FC<HeroShowcaseProps> = ({ onAskQuestion }) => {
  // Readers who ask for less motion get the finished frame instead of the loop.
  const reduceMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  }, []);

  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(reduceMotion ? ITEMS[0].question : '');
  const [isErasing, setIsErasing] = useState(false);
  const [progress, setProgress] = useState(reduceMotion ? 0.35 : 0);

  const item = ITEMS[index];

  // Typewriter: type the question, hold it, erase it, move to the next one.
  useEffect(() => {
    if (reduceMotion) return;

    const full = item.question;
    let timer: number;

    if (!isErasing) {
      if (typed.length < full.length) {
        timer = window.setTimeout(() => setTyped(full.slice(0, typed.length + 1)), TYPE_MS);
      } else {
        timer = window.setTimeout(() => setIsErasing(true), HOLD_MS);
      }
    } else if (typed.length > 0) {
      timer = window.setTimeout(() => setTyped(full.slice(0, typed.length - 1)), ERASE_MS);
    } else {
      timer = window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % ITEMS.length);
        setIsErasing(false);
      }, 260);
    }

    return () => window.clearTimeout(timer);
  }, [typed, isErasing, item.question, reduceMotion]);

  // Drives the animated parameter of whichever visual is on screen.
  useEffect(() => {
    if (reduceMotion) return;

    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      setProgress(((now - start) % SWEEP_MS) / SWEEP_MS);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion, index]);

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch text-left">

      {/* Left: the question, typed out. Not an input — the whole card is the CTA. */}
      <button
        type="button"
        onClick={() => onAskQuestion(item.question)}
        aria-label={`Mở mô phỏng cho câu hỏi: ${item.question}`}
        className="group relative flex flex-col justify-between bg-white dark:bg-[#1A1C23] border-2 border-[#F26207]/40 rounded-2xl p-5 sm:p-6 min-h-[220px] shadow-md shadow-orange-500/5 dark:shadow-none hover:border-[#F26207] focus-visible:border-[#F26207] focus-visible:ring-2 focus-visible:ring-[#F26207]/30 outline-none transition-all cursor-pointer text-left"
      >
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#F26207]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Học sinh hỏi</span>
        </div>

        <p className="flex-1 flex items-center text-lg sm:text-xl md:text-2xl font-semibold text-[#1C1B1A] dark:text-white leading-snug py-4">
          <span>
            {typed}
            {!reduceMotion && (
              <span
                aria-hidden="true"
                className="inline-block w-[2px] h-[1.1em] translate-y-[0.18em] ml-0.5 bg-[#F26207] animate-caret"
              />
            )}
          </span>
        </p>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#EAE4D9] dark:border-white/10">
          <div className="flex gap-1.5" aria-hidden="true">
            {ITEMS.map((entry, i) => (
              <span
                key={entry.question}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 bg-[#F26207]' : 'w-1.5 bg-[#EAE4D9] dark:bg-white/15'
                }`}
              />
            ))}
          </div>

          <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F26207]">
            Xem mô phỏng
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </button>

      {/* Right: the answer, drawn by the app's own visual components. */}
      <div className="bg-white dark:bg-[#181A20] border border-[#EAE4D9] dark:border-[#26282E] rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[220px]">
        <div className="px-4 py-2.5 border-b border-[#EAE4D9] dark:border-[#26282E] bg-[#FAF7F2] dark:bg-[#121316] flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] font-semibold text-[#1C1B1A] dark:text-slate-200">
            Live Math Simulation
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center bg-[#FAF7F2]/60 dark:bg-[#0F1219] p-2 min-h-[240px] sm:min-h-[280px]">
          <div key={index} className="w-full h-full animate-fade-in">
            {item.render(progress)}
          </div>
        </div>

        <p className="px-4 py-2.5 border-t border-[#EAE4D9] dark:border-[#26282E] text-[11px] sm:text-xs text-[#5E5D59] dark:text-slate-400">
          {item.caption}
        </p>
      </div>

    </div>
  );
};
