import React from 'react';
import { Sparkles, ArrowRight, Github, Heart, Compass } from 'lucide-react';

interface LandingFooterProps {
  onOpenApp: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onOpenApp }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 transition-colors">
      
      {/* Final CTA Banner Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-700 shadow-xl relative overflow-hidden">
          
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-semibold">
              <Compass className="w-3.5 h-3.5" />
              HOÀN TOÀN MIỄN PHÍ & TRỰC QUAN
            </span>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold text-white tracking-normal" style={{ letterSpacing: '0px' }}>
              Sẵn sàng làm chủ toán học bằng thị giác?
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans font-light" style={{ letterSpacing: '0px' }}>
              Trải nghiệm ngay bộ công cụ mô phỏng toán học tương tác kết hợp hoạt họa Manim và diễn giải từng bước logic.
            </p>

            <div className="pt-3 flex flex-wrap justify-center gap-3">
              <button
                onClick={onOpenApp}
                className="px-6 py-3.5 rounded-xl bg-[#F26207] hover:bg-[#D95300] text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-orange-900/30 transition-all cursor-pointer hover:scale-105"
              >
                <span>Bắt đầu học miễn phí</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Bottom Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-800 pt-8 text-xs text-slate-400">
        
        {/* Brand Copyright */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#F26207] flex items-center justify-center text-white text-xs font-sans font-bold">
            M
          </div>
          <span style={{ letterSpacing: '0px' }}>© 2026 MathVisual Tutor. Nền tảng Giáo dục Toán học Trực quan.</span>
        </div>

        {/* Tech Stack badges */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
          <span>Coordinate Grid Engine</span>
          <span>•</span>
          <span>Manim Animation</span>
          <span>•</span>
          <span>Geometric Balance</span>
        </div>

      </div>

    </footer>
  );
};
