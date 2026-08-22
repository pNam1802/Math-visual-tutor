import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUp, Sparkles, User } from 'lucide-react';
import { TrigCircleVisual } from '../visuals/TrigCircleVisual';
import { DerivativeVisual } from '../visuals/DerivativeVisual';
import { CircleAreaVisual } from '../visuals/CircleAreaVisual';
import { QuadraticVisual } from '../visuals/QuadraticVisual';

interface HeroShowcaseProps {
  /** Opens the app and runs this exact question. */
  onAskQuestion: (question: string) => void;
}

/**
 * The conversation plays out one beat at a time, the way a real exchange does:
 * the question is typed into the composer, sent, thought about, answered, and
 * only then does the diagram arrive.
 */
type Stage =
  | 'idle'
  | 'typing'
  | 'sent'
  | 'thinking'
  | 'answering'
  | 'visual'
  | 'clearing';

const TYPE_MS = 55;        // per character, while typing into the composer
const WORD_MS = 60;        // per word, while the answer streams in
const IDLE_MS = 700;       // empty composer before typing starts
const SENT_MS = 550;       // question bubble lands
const THINKING_MS = 1300;  // the three dots
const VISUAL_MS = 5200;    // time to actually watch the diagram move
const CLEAR_MS = 700;      // fade out before the next question

/** One full sweep of a visual's animated parameter. */
const SWEEP_MS = 7000;

interface ShowcaseItem {
  question: string;
  answer: string;
  caption: string;
  /** progress is 0..1, one full sweep of this item's parameter. */
  render: (progress: number) => React.ReactNode;
}

// Every diagram below is the component the app itself renders, so the landing
// page shows exactly what a visitor gets after clicking. All four are plain SVG
// — ThreeJs3DVisual is deliberately left out so three.js stays off this path.
const ITEMS: ShowcaseItem[] = [
  {
    question: 'Tôi muốn hiểu vòng tròn lượng giác',
    answer:
      'Được! Hãy nhìn điểm M chạy trên đường tròn. Hoành độ của nó chính là cos θ, tung độ là sin θ — hai hình chiếu đó là toàn bộ ý nghĩa của lượng giác.',
    caption: 'Kéo góc θ để xem sin và cos đổi theo',
    render: (p) => (
      <TrigCircleVisual angleDeg={Math.round(p * 360)} zoom={0.78} showGrid />
    )
  },
  {
    question: 'Đạo hàm thực chất là gì?',
    answer:
      'Hãy nối hai điểm trên đường cong thành một cát tuyến, rồi kéo chúng lại gần nhau. Khi Δx tiến về 0, cát tuyến trở thành tiếp tuyến — độ dốc của nó chính là đạo hàm.',
    caption: 'Δx co dần, cát tuyến hoá thành tiếp tuyến',
    render: (p) => {
      // Ping-pong so Δx closes onto the tangent, then opens back up.
      const swing = p < 0.5 ? p * 2 : (1 - p) * 2;
      return (
        <DerivativeVisual x0={1} deltaX={0.08 + swing * 1.6} zoom={0.78} showGrid />
      );
    }
  },
  {
    question: 'Vì sao diện tích hình tròn là πr²?',
    answer:
      'Cắt hình tròn thành n nan quạt rồi xếp xen kẽ, ta được một hình gần giống chữ nhật. Đáy dài πr, cao r. Càng nhiều lát cắt, nó càng vuông vắn — và diện tích luôn là πr².',
    caption: 'Số lát cắt tăng dần, hình tiệm cận chữ nhật',
    render: (p) => {
      const swing = p < 0.5 ? p * 2 : (1 - p) * 2;
      return (
        <CircleAreaVisual
          radius={4}
          slices={Math.round(6 + swing * 50)}
          zoom={0.72}
          showGrid
        />
      );
    }
  },
  {
    question: 'Giải phương trình x² − 5x + 6 = 0',
    answer:
      'Δ = 25 − 24 = 1 > 0 nên parabol cắt trục hoành tại hai điểm: x₁ = 2 và x₂ = 3. Đỉnh nằm chính giữa hai nghiệm, tại x = 2,5.',
    caption: 'Đỉnh parabol và hai nghiệm trên trục Ox',
    render: (p) => {
      const swing = p < 0.5 ? p * 2 : (1 - p) * 2;
      return (
        <QuadraticVisual a={1} b={-5} c={4.4 + swing * 1.6} zoom={0.78} showGrid />
      );
    }
  }
];

export const HeroShowcase: React.FC<HeroShowcaseProps> = ({ onAskQuestion }) => {
  // Readers who ask for less motion get the finished conversation, not the loop.
  const reduceMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  }, []);

  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<Stage>(reduceMotion ? 'visual' : 'idle');
  const [typed, setTyped] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [progress, setProgress] = useState(reduceMotion ? 0.35 : 0);

  const item = ITEMS[index];
  const answerWords = useMemo(() => item.answer.split(' '), [item.answer]);

  // What is on screen at each beat.
  const showQuestion = stage !== 'idle' && stage !== 'typing';
  const showThinking = stage === 'thinking';
  const showAnswer = stage === 'answering' || stage === 'visual' || stage === 'clearing';
  const showVisual = stage === 'visual' || stage === 'clearing';

  const streamedAnswer = reduceMotion
    ? item.answer
    : answerWords.slice(0, wordCount).join(' ');

  // Advance the conversation. Each stage schedules the next one.
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
          // Composer empties as the question is sent.
          timer = window.setTimeout(() => {
            setTyped('');
            setStage('sent');
          }, 420);
        }
        break;

      case 'sent':
        timer = window.setTimeout(() => setStage('thinking'), SENT_MS);
        break;

      case 'thinking':
        timer = window.setTimeout(() => setStage('answering'), THINKING_MS);
        break;

      case 'answering':
        if (wordCount < answerWords.length) {
          timer = window.setTimeout(() => setWordCount((n) => n + 1), WORD_MS);
        } else {
          timer = window.setTimeout(() => setStage('visual'), 450);
        }
        break;

      case 'visual':
        timer = window.setTimeout(() => setStage('clearing'), VISUAL_MS);
        break;

      case 'clearing':
        timer = window.setTimeout(() => {
          setIndex((prev) => (prev + 1) % ITEMS.length);
          setWordCount(0);
          setStage('idle');
        }, CLEAR_MS);
        break;
    }

    return () => window.clearTimeout(timer);
  }, [stage, typed, wordCount, item.question, answerWords.length, reduceMotion]);

  // Drives the animated parameter of whichever diagram is on screen.
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

  const isFading = stage === 'clearing';

  return (
    <div
      onClick={() => onAskQuestion(item.question)}
      className="group max-w-4xl mx-auto bg-white dark:bg-[#181A20] border border-[#EAE4D9] dark:border-[#26282E] rounded-2xl shadow-lg shadow-black/5 dark:shadow-none overflow-hidden text-left cursor-pointer hover:border-[#F26207]/60 transition-colors"
    >

      {/* Window chrome */}
      <div className="px-4 py-2.5 border-b border-[#EAE4D9] dark:border-[#26282E] bg-[#FAF7F2] dark:bg-[#121316] flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono text-[11px] font-semibold text-[#1C1B1A] dark:text-slate-200">
          MathVisual Tutor
        </span>
        <div className="ml-auto flex gap-1.5" aria-hidden="true">
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

      {/* Transcript. Fixed height and bottom-aligned so the page never jumps as
          messages arrive, and so the conversation grows upward like a real one. */}
      <div
        aria-live="polite"
        className={`flex flex-col justify-end gap-3 px-4 sm:px-5 py-4 min-h-[460px] sm:min-h-[500px] overflow-hidden bg-[#FAF7F2]/50 dark:bg-[#0F1219] transition-opacity duration-500 ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
      >

        {/* Student's question */}
        {showQuestion && (
          <div className="flex items-start gap-2.5 justify-end animate-msg-in">
            <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#F26207] text-white px-3.5 py-2.5 text-sm leading-relaxed">
              {item.question}
            </div>
            <div className="w-7 h-7 rounded-lg bg-[#EAE4D9] dark:bg-white/10 text-[#5E5D59] dark:text-slate-300 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Tutor's turn */}
        {(showThinking || showAnswer) && (
          <div className="flex items-start gap-2.5 animate-msg-in">
            <div className="w-7 h-7 rounded-lg bg-[#F26207] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            <div className="max-w-[94%] rounded-2xl rounded-bl-sm bg-white dark:bg-white/5 border border-[#EAE4D9] dark:border-white/10 px-3.5 py-2.5 space-y-3">
              {showThinking ? (
                <div className="flex gap-1.5 py-1" aria-label="Đang soạn câu trả lời">
                  <span className="w-2 h-2 rounded-full bg-[#F26207]/70 animate-dot" />
                  <span className="w-2 h-2 rounded-full bg-[#F26207]/70 animate-dot [animation-delay:0.18s]" />
                  <span className="w-2 h-2 rounded-full bg-[#F26207]/70 animate-dot [animation-delay:0.36s]" />
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-[#1C1B1A] dark:text-slate-200">
                  {streamedAnswer}
                </p>
              )}

              {/* The diagram arrives last, inside the reply */}
              {showVisual && (
                <div className="animate-msg-in rounded-xl border border-[#EAE4D9] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#0B0E14] overflow-hidden">
                  <div className="h-[250px] sm:h-[290px] flex items-center justify-center">
                    {item.render(progress)}
                  </div>
                  <p className="px-3 py-2 border-t border-[#EAE4D9] dark:border-white/10 text-[11px] text-[#5E5D59] dark:text-slate-400">
                    {item.caption}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Composer. Not a real input — the question types itself here, then sends. */}
      <div className="px-4 sm:px-5 py-3 border-t border-[#EAE4D9] dark:border-[#26282E] bg-white dark:bg-[#181A20]">
        <div className="flex items-center gap-2 rounded-xl border border-[#EAE4D9] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 px-3.5 py-2.5 group-hover:border-[#F26207]/50 transition-colors">
          <p className="flex-1 text-sm text-[#1C1B1A] dark:text-slate-200 truncate">
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
            className="w-8 h-8 rounded-lg bg-[#F26207] hover:bg-[#D95300] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
