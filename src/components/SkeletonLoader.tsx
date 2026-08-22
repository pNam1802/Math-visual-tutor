import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full h-full p-4 sm:p-6 space-y-6 animate-pulse">
      
      {/* Visual Canvas Skeleton */}
      <div className="bg-white dark:bg-[#0E121A] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-4 shadow-sm animate-shimmer overflow-hidden relative">
        <div className="flex items-center justify-between">
          <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          </div>
        </div>

        {/* Canvas area mockup */}
        <div className="h-[320px] bg-slate-100 dark:bg-[#080A0E] rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="w-48 h-48 rounded-full border-4 border-slate-200/50 dark:border-slate-800/50"></div>
          <div className="absolute h-0.5 w-full bg-slate-200/40 dark:border-slate-800/40"></div>
          <div className="absolute w-0.5 h-full bg-slate-200/40 dark:border-slate-800/40"></div>
        </div>

        {/* Sliders Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="h-20 bg-slate-100 dark:bg-[#141824] rounded-xl p-3 space-y-2">
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
          <div className="h-20 bg-slate-100 dark:bg-[#141824] rounded-xl p-3 space-y-2">
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
          <div className="h-20 bg-slate-100 dark:bg-[#141824] rounded-xl p-3 space-y-2">
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>

      {/* Explanation Steps Skeleton */}
      <div className="bg-white dark:bg-[#0E121A] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-3.5 shadow-sm">
        <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-16 bg-slate-100 dark:bg-[#121622] rounded-xl p-4 flex items-center gap-3">
          <div className="w-7 h-7 bg-slate-200 dark:bg-slate-700 rounded-lg shrink-0"></div>
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 w-1/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
        <div className="h-16 bg-slate-100 dark:bg-[#121622] rounded-xl p-4 flex items-center gap-3">
          <div className="w-7 h-7 bg-slate-200 dark:bg-slate-700 rounded-lg shrink-0"></div>
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 w-1/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>

    </div>
  );
};
