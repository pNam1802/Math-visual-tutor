import React, { useState, useEffect, useMemo } from 'react';
import { Send, Sparkles, User } from 'lucide-react';
import { TrigCircleVisual } from '../visuals/TrigCircleVisual';
import { DerivativeVisual } from '../visuals/DerivativeVisual';
import { CircleAreaVisual } from '../visuals/CircleAreaVisual';
import { QuadraticVisual } from '../visuals/QuadraticVisual';

interface HeroShowcaseProps {
  /** Opens the app and runs this exact question. */
  onAskQuestion: (question: string) => void;
}

/**
 * The card performs the product's promise literally. A question is typed and
 * sent, then the entire chat card folds itself into a paper plane and flies
 * away — uncovering the diagram that was waiting underneath, at full width and
 * no longer boxed inside a chat window.
 */
type Stage =
  | 'idle'
  | 'typing'
  | 'sent'
  | 'folding'
  | 'revealed'
  | 'returning';

const TYPE_MS = 55;       // per character, while typing into the composer
const IDLE_MS = 700;      // empty composer before typing starts
const SEND_MS = 420;      // beat between the last character and the send
const SENT_MS = 900;      // question bubble settles and is read
const FOLD_MS = 1550;     // 1400ms of CSS animation, plus a beat of empty stage
const REVEAL_MS = 8200;   // 850ms unfolding, then one full parameter sweep
const RETURN_MS = 850;    // diagram fades out, card comes back

/** One full sweep of a visual's animated parameter. */
const SWEEP_MS = 7000;

interface ShowcaseItem {
  question: string;
  /** One line, shown under the diagram once the card has flown away. */
  insight: string;
  /** progress is 0..1, one full sweep of this item's parameter. */
  render: (progress: number) => React.ReactNode;
}

// Every diagram below is the component the app itself renders, so the landing
// page shows exactly what a visitor gets after clicking. All four are plain SVG
// — ThreeJs3DVisual is deliberately left out so three.js stays off this path.
const ITEMS: ShowcaseItem[] = [
  {
    question: 'Tôi muốn hiểu vòng tròn lượng giác',
    insight: 'Hoành độ của điểm M là cos θ, tung độ là sin θ — lượng giác chỉ là hai hình chiếu đó.',
    render: (p) => (
      <TrigCircleVisual angleDeg={Math.round(p * 360)} zoom={1} showGrid />
    )
  },
  {
    question: 'Đạo hàm thực chất là gì?',
    insight: 'Khi Δx tiến về 0, cát tuyến trở thành tiếp tuyến — độ dốc của nó chính là đạo hàm.',
    render: (p) => {
      // Ping-pong so Δx closes onto the tangent, then opens back up.
      const swing = p < 0.5 ? p * 2 : (1 - p) * 2;
      return (
        <DerivativeVisual x0={1} deltaX={0.08 + swing * 1.6} zoom={1} showGrid />
      );
    }
  },
  {
    question: 'Vì sao diện tích hình tròn là πr²?',
    insight: 'Cắt thành n nan quạt rồi xếp xen kẽ: đáy dài πr, cao r. Càng nhiều lát, càng vuông vắn.',
    render: (p) => {
      const swing = p < 0.5 ? p * 2 : (1 - p) * 2;
      return (
        <CircleAreaVisual
          radius={4}
          slices={Math.round(6 + swing * 50)}
          zoom={0.92}
          showGrid
        />
      );
    }
  },
  {
    question: 'Giải phương trình x² − 5x + 6 = 0',
    insight: 'Δ = 1 > 0 nên parabol cắt trục hoành tại x₁ = 2 và x₂ = 3, đỉnh nằm chính giữa.',
    render: (p) => {
      const swing = p < 0.5 ? p * 2 : (1 - p) * 2;
      return (
        <QuadraticVisual a={1} b={-5} c={4.4 + swing * 1.6} zoom={1} showGrid />
      );
    }
  }
];

export const HeroShowcase: React.FC<HeroShowcaseProps> = ({ onAskQuestion }) => {
  // A card folding and flying off is exactly what reduced-motion users ask to be
  // spared, so they get the uncovered diagram and no loop at all.
  const reduceMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  }, []);

  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<Stage>(reduceMotion ? 'revealed' : 'idle');
  const [typed, setTyped] = useState('');
  const [progress, setProgress] = useState(reduceMotion ? 0.35 : 0);

  const item = ITEMS[index];

  const showQuestion = stage !== 'idle' && stage !== 'typing';
  const isFolding = stage === 'folding';
  // The card is off screen from the moment it finishes folding until it returns.
  const cardGone = stage === 'revealed';
  const showVisual = stage === 'revealed';

  // Advance the sequence. Each stage schedules the next one.
  useEffect(() => {
    if (reduceMotion) return;

    let timer: number;

    switch (stage) {
      case 'idle':
        timer = window.setTimeout(() => setStage('typing'), IDLE_MS);
        break;

      case 'typing':
        if (typed.length < item.question.length) {
          timer = window.setTimeout(
            () => setTyped(item.question.slice(0, typed.length + 1)),
            TYPE_MS
          );
        } else {
          timer = window.setTimeout(() => {
            setTyped('');
            setStage('sent');
          }, SEND_MS);
        }
        break;

      case 'sent':
        timer = window.setTimeout(() => setStage('folding'), SENT_MS);
        break;

      case 'folding':
        timer = window.setTimeout(() => setStage('revealed'), FOLD_MS);
        break;

      case 'revealed':
        timer = window.setTimeout(() => setStage('returning'), REVEAL_MS);
        break;

      case 'returning':
        // Let the diagram fade and the card settle back before swapping in the
        // next question, so the change never happens in plain sight.
        timer = window.setTimeout(() => {
          setIndex((prev) => (prev + 1) % ITEMS.length);
          setStage('idle');
        }, RETURN_MS);
        break;
    }

    return () => window.clearTimeout(timer);
  }, [stage, typed, item.question, reduceMotion]);

  // Drives the animated parameter of the diagram, starting from zero the moment
  // it is uncovered. Running it from mount instead meant the angle was already
  // three quarters of the way round by reveal time, so the diagram appeared
  // mid-motion and read as a jump.
  useEffect(() => {
    if (reduceMotion || !showVisual) {
      return;
    }

    let frame: number;
    const start = performance.now();
    setProgress(0);

    const tick = (now: number) => {
      setProgress(Math.min(1, (now - start) / SWEEP_MS));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion, showVisual, index]);

  return (
    <div
      onClick={() => onAskQuestion(item.question)}
      className="group relative w-full max-w-6xl mx-auto h-[520px] sm:h-[560px] cursor-pointer"
    >

      {/* UNDERNEATH — the answer, taking the full width of the hero. It is not
          inside a chat window; the chat was only ever covering it. Mounted only
          once the plane has gone, so the unfold plays from the start each time. */}
      {showVisual && (
      <div className="absolute inset-0 flex flex-col bg-white dark:bg-[#181A20] border border-[#EAE4D9] dark:border-[#26282E] rounded-2xl shadow-lg shadow-black/5 dark:shadow-none overflow-hidden animate-unfold">
        <div className="px-4 py-2.5 border-b border-[#EAE4D9] dark:border-[#26282E] bg-[#FAF7F2] dark:bg-[#121316] flex items-center gap-2.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] font-semibold text-[#1C1B1A] dark:text-slate-200 truncate">
            {item.question}
          </span>
          <div className="ml-auto flex gap-1.5 shrink-0" aria-hidden="true">
            {ITEMS.map((entry, i) => (
              <span
                key={entry.question}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-5 bg-[#F26207]' : 'w-1.5 bg-[#EAE4D9] dark:bg-white/15'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-[#FAF7F2]/50 dark:bg-[#0F1219] p-3 overflow-hidden">
          {item.render(progress)}
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-[#EAE4D9] dark:border-[#26282E] bg-white dark:bg-[#181A20] flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#F26207] text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-[#1C1B1A] dark:text-slate-200">
            {item.insight}
          </p>
        </div>
      </div>
      )}

      {/* ON TOP — the chat card. This entire sheet is what folds into the plane. */}
      <div
        className={`absolute inset-x-0 top-0 mx-auto w-full max-w-2xl h-[440px] sm:h-[470px] flex flex-col rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden ${
          isFolding
            ? 'animate-fold bg-[#F26207] border border-[#F26207]'
            : 'bg-white dark:bg-[#181A20] border border-[#EAE4D9] dark:border-[#26282E] group-hover:border-[#F26207]/60 transition-colors'
        } ${cardGone ? 'opacity-0 pointer-events-none' : ''} ${
          stage === 'returning' ? 'transition-opacity duration-500' : ''
        }`}
      >
        {/* Everything printed on the sheet fades first, so only paper folds. */}
        <div
          className={`flex flex-col flex-1 min-h-0 ${
            isFolding ? 'animate-fold-content' : ''
          }`}
        >

          <div className="px-4 py-2.5 border-b border-[#EAE4D9] dark:border-[#26282E] bg-[#FAF7F2] dark:bg-[#121316] flex items-center gap-2.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] font-semibold text-[#1C1B1A] dark:text-slate-200">
              MathVisual Tutor
            </span>
          </div>

          {/* Bottom-aligned so the question rises out of the composer */}
          <div
            aria-live="polite"
            className="flex-1 flex flex-col justify-end gap-3 px-4 sm:px-6 py-5 bg-[#FAF7F2]/50 dark:bg-[#0F1219]"
          >
            {showQuestion && (
              <div className="flex items-start gap-2.5 justify-end animate-msg-in">
                <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-[#F26207] text-white px-4 py-3 text-base leading-relaxed">
                  {item.question}
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#EAE4D9] dark:bg-white/10 text-[#5E5D59] dark:text-slate-300 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {/* Composer. Not a real input — the question types itself here. */}
          <div className="px-4 sm:px-6 py-4 border-t border-[#EAE4D9] dark:border-[#26282E] bg-white dark:bg-[#181A20] shrink-0">
            <div className="flex items-center gap-2 rounded-xl border border-[#EAE4D9] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 px-4 py-3 group-hover:border-[#F26207]/50 transition-colors">
              <p className="flex-1 text-sm sm:text-base text-[#1C1B1A] dark:text-slate-200 truncate">
                {typed || (
                  <span className="text-[#78756F] dark:text-slate-500">
                    Hỏi bất kỳ điều gì về toán…
                  </span>
                )}
                {stage === 'typing' && (
                  <span
                    aria-hidden="true"
                    className="inline-block w-[2px] h-[1.05em] translate-y-[0.16em] ml-0.5 bg-[#F26207] animate-caret"
                  />
                )}
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAskQuestion(item.question);
                }}
                aria-label={`Mở mô phỏng cho câu hỏi: ${item.question}`}
                className="w-9 h-9 rounded-lg bg-[#F26207] hover:bg-[#D95300] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
