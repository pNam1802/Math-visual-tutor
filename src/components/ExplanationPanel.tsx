import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
  BookOpen,
  Eye
} from 'lucide-react';
import { TopicData } from '../types';
import { KatexRenderer } from './KatexRenderer';

interface ExplanationPanelProps {
  topic: TopicData;
  onRequestAnimation: () => void;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  topic,
  onRequestAnimation
}) => {
  // Store expanded steps (default step 1 and 2 open)
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false
  });

  const [activeStepId, setActiveStepId] = useState<number>(1);

  // When topic changes, reset default open states for new steps
  useEffect(() => {
    const initialOpen: Record<number, boolean> = {};
    topic.steps.forEach((step, idx) => {
      initialOpen[step.id || idx + 1] = idx < 2; // open first 2 steps by default
    });
    setExpandedSteps(initialOpen);
    setActiveStepId(topic.steps[0]?.id || 1);
  }, [topic.id]);

  const toggleStep = (stepId: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
    setActiveStepId(stepId);
  };

  const expandAll = () => {
    const allOpen: Record<number, boolean> = {};
    topic.steps.forEach((s, idx) => (allOpen[s.id || idx + 1] = true));
    setExpandedSteps(allOpen);
  };

  const collapseAll = () => {
    setExpandedSteps({});
  };

  return (
    <div className="bg-white dark:bg-[#181A20] rounded-2xl border border-[#EAE4D9] dark:border-[#26282E] shadow-sm p-4 sm:p-6 space-y-4 transition-colors">
      
      {/* Explanation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE4D9] dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-orange-50 dark:bg-orange-950/80 text-[#F26207] flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#1C1B1A] dark:text-slate-100" style={{ letterSpacing: '0px' }}>
              Diễn giải trực quan từng bước
            </h3>
          </div>
          <p className="text-xs text-[#625F59] dark:text-slate-400 mt-1" style={{ letterSpacing: '0px' }}>
            Logic giải chi tiết kèm hình học trực quan cho <KatexRenderer latex={topic.formulaSummary} className="font-semibold text-[#F26207]" />
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-2.5 py-1 text-xs text-[#625F59] dark:text-slate-400 hover:bg-black/5 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Mở tất cả
          </button>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <button
            onClick={collapseAll}
            className="px-2.5 py-1 text-xs text-[#625F59] dark:text-slate-400 hover:bg-black/5 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Thu gọn
          </button>
        </div>
      </div>

      {/* Numbered Step Cards */}
      <div className="space-y-3">
        {topic.steps.map((step, idx) => {
          const stepId = step.id || idx + 1;
          const isOpen = !!expandedSteps[stepId];
          const isActive = activeStepId === stepId;
          const explanationText = step.detail || step.explanation || '';

          return (
            <div
              key={stepId}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white dark:bg-[#10141E] border-black/5 dark:border-white/10 shadow-sm'
                  : 'bg-white/50 dark:bg-white/5 border-black/5 dark:border-white/10 opacity-75 hover:opacity-100'
              }`}
            >
              {/* Step Header Accordion Trigger */}
              <button
                onClick={() => toggleStep(stepId)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Step Number Badge */}
                  <span
                    className={`w-6 h-6 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                      isActive ? 'bg-[#FF7729] text-white' : 'bg-[#F26207]'
                    }`}
                  >
                    {stepId}
                  </span>

                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-[#1C1B1A] dark:text-slate-100 truncate" style={{ letterSpacing: '0px' }}>
                      {step.title}
                    </h4>
                    {step.summary && (
                      <p className="text-xs text-[#625F59] dark:text-slate-400 truncate" style={{ letterSpacing: '0px' }}>
                        {step.summary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#625F59]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#625F59]" />
                  )}
                </div>
              </button>

              {/* Collapsible Content */}
              {isOpen && (
                <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 space-y-3 text-xs sm:text-sm border-t border-[#EAE4D9] dark:border-white/10">
                  
                  {/* Formula Box with KaTeX */}
                  {step.formula && (
                    <div className="p-3 rounded-xl bg-orange-50/50 dark:bg-[#07090E] border border-orange-200/60 dark:border-white/10 font-mono text-xs sm:text-sm text-[#F26207] dark:text-orange-300 flex items-center justify-between gap-2 overflow-x-auto">
                      <div className="font-bold overflow-x-auto">
                        <KatexRenderer latex={step.formula} />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-[#F26207] dark:text-orange-300 uppercase shrink-0 font-sans font-semibold">
                        Toán học
                      </span>
                    </div>
                  )}

                  {/* Detail explanation */}
                  <p className="text-[#1C1B1A] dark:text-slate-300 leading-relaxed text-xs sm:text-sm pl-1" style={{ letterSpacing: '0px' }}>
                    {explanationText}
                  </p>

                  {/* Visual Connection Highlight & Key Takeaway */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {step.visualHighlight && (
                      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-orange-50/40 dark:bg-white/5 text-[11px] text-[#625F59] dark:text-slate-400 border border-orange-200/40 dark:border-white/10" style={{ letterSpacing: '0px' }}>
                        <Eye className="w-3.5 h-3.5 text-[#F26207] dark:text-orange-400 shrink-0 mt-0.5" />
                        <span><strong>Trực quan:</strong> {step.visualHighlight}</span>
                      </div>
                    )}
                    {step.keyTakeaway && (
                      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 text-[11px] text-amber-800 dark:text-amber-300 border border-amber-200/40 dark:border-amber-900/30" style={{ letterSpacing: '0px' }}>
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>Ghi nhớ:</strong> {step.keyTakeaway}</span>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Shimmer Bar */}
      <div className="flex items-center space-x-4 p-3 bg-[#FAF7F2] dark:bg-[#121620] rounded-xl border border-[#EAE4D9] dark:border-white/10">
        <div className="flex-1 h-2 bg-[#EAE4D9] dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="w-full h-full bg-[#F26207] relative animate-shimmer">
          </div>
        </div>
        <span className="text-[10px] font-bold text-[#8F8D88] uppercase font-mono" style={{ letterSpacing: '0px' }}>
          Đã tải toàn bộ các bước giải
        </span>
      </div>

    </div>
  );
};
