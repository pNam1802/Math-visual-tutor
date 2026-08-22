import React from 'react';
import { ArrowRight, Sun, Moon, ChevronDown, LayoutDashboard } from 'lucide-react';
import { ThemeMode } from '../../types';

interface LandingNavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenApp: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  theme,
  onToggleTheme,
  onOpenApp
}) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF7F2]/90 dark:bg-[#121316]/90 backdrop-blur-md border-b border-[#EAE4D9] dark:border-[#26282E] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logo - MathVisual Tutor */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F26207] flex items-center justify-center text-white font-bold text-base shadow-sm">
              M
            </div>
            <span className="font-sans font-bold text-xl text-[#1C1B1A] dark:text-white tracking-tight" style={{ letterSpacing: '0px' }}>
              MathVisual<span className="text-[#F26207]">Tutor</span>
            </span>
          </div>
        </div>

        {/* Center Nav Links (Replit Style) */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-[#5E5D59] dark:text-slate-300">
          <button
            onClick={() => scrollToSection('topics')}
            className="flex items-center gap-1 hover:text-[#1C1B1A] dark:hover:text-white transition-colors cursor-pointer"
          >
            <span>Kho chủ đề</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="flex items-center gap-1 hover:text-[#1C1B1A] dark:hover:text-white transition-colors cursor-pointer"
          >
            <span>Cách hoạt động</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>
          <button
            onClick={() => scrollToSection('why-us')}
            className="hover:text-[#1C1B1A] dark:hover:text-white transition-colors cursor-pointer"
          >
            Phương pháp 3B1B
          </button>
          <button
            onClick={() => scrollToSection('topics')}
            className="hover:text-[#1C1B1A] dark:hover:text-white transition-colors cursor-pointer"
          >
            Tài liệu & Mô phỏng
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
            className="p-2 rounded-xl border border-[#EAE4D9] dark:border-slate-800 text-[#5E5D59] dark:text-slate-300 hover:text-[#1C1B1A] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Contact Sales / Đăng nhập (subtle link) */}
          <button
            onClick={onOpenApp}
            className="hidden sm:block text-xs font-medium text-[#5E5D59] dark:text-slate-300 hover:text-[#1C1B1A] dark:hover:text-white transition-colors cursor-pointer px-2"
          >
            Trực tiếp
          </button>

          {/* Replit Signature Create Account / Open App Pill Button */}
          <button
            onClick={onOpenApp}
            className="px-4 sm:px-5 py-2 rounded-full border border-[#F26207] text-[#F26207] hover:bg-[#F26207] hover:text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer group bg-white/50 dark:bg-transparent"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Vào ứng dụng</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </header>
  );
};
