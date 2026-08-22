import React, { useState, useEffect } from 'react';
import { HelpCircle, Check, X } from 'lucide-react';
import { Prediction } from '../utils/predictions';

interface PredictionCardProps {
  prediction: Prediction;
  /** Resets the card whenever the student moves to a different topic. */
  topicId: string;
  /** Fired once an answer is committed, so the steps below can open up. */
  onAnswered: () => void;
}

/**
 * Asks for a guess before the worked steps are shown.
 *
 * Getting it wrong is the point, so a wrong answer is marked plainly and then
 * explained — never scolded, and never hidden behind a retry.
 */
export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  topicId,
  onAnswered
}) => {
  const [chosen, setChosen] = useState<number | null>(null);

  useEffect(() => {
    setChosen(null);
  }, [topicId]);

  const answered = chosen !== null;
  const isCorrect = chosen === prediction.correctIndex;

  const handleChoose = (index: number) => {
    if (answered) return;
    setChosen(index);
    onAnswered();
  };

  return (
    <div className="rounded-xl border border-[#EAE4D9] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 p-4 sm:p-5 space-y-3">

      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#F26207] text-white flex items-center justify-center shrink-0">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase text-[#8F8D88] dark:text-slate-500">
            Đoán thử trước khi xem lời giải
          </p>
          <h4 className="text-sm sm:text-base font-bold text-[#1C1B1A] dark:text-slate-100 mt-0.5">
            {prediction.question}
          </h4>
        </div>
      </div>

      <div className="space-y-2">
        {prediction.options.map((option, index) => {
          const isChosen = chosen === index;
          const isAnswer = index === prediction.correctIndex;

          // Before answering every option looks equally plausible; after, the
          // right one is always marked, whether or not it was picked.
          let tone =
            'border-[#EAE4D9] dark:border-white/10 bg-white dark:bg-white/5 text-[#3D3A35] dark:text-slate-300 hover:border-[#F26207] cursor-pointer';
          if (answered && isAnswer) {
            tone =
              'border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200';
          } else if (answered && isChosen) {
            tone =
              'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/25 text-rose-900 dark:text-rose-200';
          } else if (answered) {
            tone =
              'border-[#EAE4D9] dark:border-white/10 bg-white dark:bg-white/5 text-[#8F8D88] dark:text-slate-500';
          }

          return (
            <button
              key={option}
              onClick={() => handleChoose(index)}
              disabled={answered}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-sm leading-relaxed transition-colors flex items-start gap-2.5 ${tone}`}
            >
              <span className="font-mono font-bold shrink-0">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="flex-1">{option}</span>
              {answered && isAnswer && <Check className="w-4 h-4 shrink-0 mt-0.5" />}
              {answered && isChosen && !isAnswer && <X className="w-4 h-4 shrink-0 mt-0.5" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="space-y-2 pt-1">
          <p
            className={`text-sm font-semibold ${
              isCorrect
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-[#F26207] dark:text-orange-400'
            }`}
          >
            {isCorrect
              ? 'Chính xác — và đây là lý do:'
              : 'Chưa đúng, nhưng đây mới là chỗ đáng nhớ:'}
          </p>
          <p className="text-sm leading-relaxed text-[#3D3A35] dark:text-slate-300">
            {prediction.explanation}
          </p>
        </div>
      )}

    </div>
  );
};
