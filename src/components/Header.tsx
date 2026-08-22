import React from 'react';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Sliders,
  Compass
} from 'lucide-react';
import { ThemeMode, AppStateMode } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  stateMode: AppStateMode;
  onSelectStateMode: (mode: AppStateMode) => void;
  activeTopicTitle: string;
  onResetTopic: () => void;
  onGoToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  stateMode,
  onSelectStateMode,
  activeTopicTitle,
  onResetTopic,
  onGoToLanding
}) => {
  return (
    <header className="w-full bg-[#FAF7F2]/90 dark:bg-[#121316]/90 backdrop-blur-md border-b border-[#EAE4D9] dark:border-[#26282E] sticky top-0 z-30 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand & App Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onGoToLanding}
          title="Về Landing Page"
        >
          <div className="w-9 h-9 rounded-xl bg-[#F26207] flex items-center justify-center text-white shadow-sm shadow-orange-700/20 group-hover:scale-105 transition-transform">
            <span className="font-sans font-bold text-lg">M</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans font-bold text-lg sm:text-xl text-[#F26207] dark:text-white tracking-tight" style={{ letterSpacing: '0px' }}>
                MathVisual<span className="text-[#F26207] dark:text-orange-400">Tutor</span>
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium bg-orange-50 dark:bg-orange-950/60 text-[#F26207] border border-orange-200 dark:border-orange-800/60">
                Visual Engine
              </span>
            </div>
            <p className="text-xs text-[#625F59] dark:text-slate-400 hidden sm:block" style={{ letterSpacing: '0px' }}>
              Gia sư toán học trực quan • Mô phỏng hình học thời gian thực
            </p>
          </div>
        </div>

        {/* Center: Current active topic badge (desktop) */}
        <div className="hidden lg:flex items-center gap-2 bg-white dark:bg-slate-800/60 px-3.5 py-1.5 rounded-xl border border-[#EAE4D9] dark:border-slate-700 shadow-2xs">
          <Sliders className="w-3.5 h-3.5 text-[#F26207]" />
          <span className="text-xs text-[#625F59] dark:text-slate-400" style={{ letterSpacing: '0px' }}>Đang khảo sát:</span>
          <span className="text-xs font-semibold text-[#1C1B1A] dark:text-slate-200 font-sans max-w-[240px] truncate" style={{ letterSpacing: '0px' }}>
            {activeTopicTitle}
          </span>
        </div>

        {/* Right: State Switcher Demo & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* UI State Mode Preview Bar */}
          <div className="flex items-center bg-white dark:bg-slate-800/60 p-1 rounded-xl border border-[#EAE4D9] dark:border-slate-700 text-xs shadow-2xs">
            <button
              onClick={() => onSelectStateMode('normal')}
              title="Xem giao diện hoạt động bình thường"
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                stateMode === 'normal'
                  ? 'bg-orange-50 dark:bg-slate-700 text-[#F26207] font-semibold shadow-xs'
                  : 'text-[#625F59] dark:text-slate-400 hover:text-[#1C1B1A] dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chuẩn</span>
            </button>
            <button
              onClick={() => onSelectStateMode('loading')}
              title="Xem trạng thái Loading Skeleton & Shimmer"
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                stateMode === 'loading'
                  ? 'bg-amber-50 dark:bg-slate-700 text-amber-600 dark:text-amber-400 font-semibold shadow-xs'
                  : 'text-[#625F59] dark:text-slate-400 hover:text-[#1C1B1A] dark:hover:text-white'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Loading</span>
            </button>
            <button
              onClick={() => onSelectStateMode('error')}
              title="Xem trạng thái Báo lỗi thiết kế chuyên biệt"
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                stateMode === 'error'
                  ? 'bg-rose-50 dark:bg-slate-700 text-rose-600 dark:text-rose-400 font-semibold shadow-xs'
                  : 'text-[#625F59] dark:text-slate-400 hover:text-[#1C1B1A] dark:hover:text-white'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Error</span>
            </button>
          </div>

          {/* Back to Landing Page Button */}
          {onGoToLanding && (
            <button
              onClick={onGoToLanding}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1C1B1A] dark:text-slate-200 border border-[#EAE4D9] dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Về Landing Page"
            >
              <span>Trang chủ</span>
            </button>
          )}

          {/* Reset Parameters Button */}
          <button
            onClick={onResetTopic}
            title="Đặt lại tham số gốc"
            className="p-2 rounded-xl text-[#625F59] dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-[#EAE4D9] dark:hover:border-slate-700 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
            className="p-2 rounded-xl text-[#625F59] dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-[#FAF7F2] dark:hover:bg-slate-700 transition-colors border border-[#EAE4D9] dark:border-slate-700 flex items-center justify-center cursor-pointer shadow-2xs"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
