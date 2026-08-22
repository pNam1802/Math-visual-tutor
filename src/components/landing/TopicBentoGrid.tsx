import React from 'react';
import { motion } from 'motion/react';
import { TopicData } from '../../types';
import { SUGGESTED_TOPICS } from '../../data/mockData';
import { 
  ArrowUpRight, 
  Sparkles, 
  Compass, 
  Calculator, 
  TrendingUp, 
  Box, 
  CircleDot,
  Layers
} from 'lucide-react';

interface TopicBentoGridProps {
  onSelectTopicAndOpenApp: (topic: TopicData) => void;
}

export const TopicBentoGrid: React.FC<TopicBentoGridProps> = ({ onSelectTopicAndOpenApp }) => {
  return (
    <section id="topics" className="py-20 sm:py-28 bg-[#FAF7F2] dark:bg-[#121316] border-t border-[#EAE4D9] dark:border-[#26282E] relative transition-colors">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-900/60 text-[#F26207] font-mono text-xs font-semibold mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>KHO CHỦ ĐỀ TOÁN HỌC</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-[#F26207] dark:text-white leading-tight" style={{ letterSpacing: '0px' }}>
              Kho chủ đề trực quan hoá đa dạng
            </h2>
            <p className="text-[#3D3A35] dark:text-slate-300 text-base sm:text-lg mt-3 font-medium" style={{ letterSpacing: '0px' }}>
              Từ đại số trung học đến giải tích vi phân và hình học không gian 3D. Nhấp vào bất kỳ thẻ nào để mở bảng điều khiển tương tác.
            </p>
          </div>

          <div className="shrink-0">
            <span className="font-mono text-xs text-[#625F59] dark:text-slate-300 bg-white dark:bg-[#1A1C23] px-4 py-2 rounded-xl border border-[#EAE4D9] dark:border-[#26282E] shadow-2xs font-medium">
              5 Chủ đề có sẵn • Mở rộng liên tục
            </span>
          </div>
        </div>

        {/* Bento Grid (Asymmetrical Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
          
          {/* Card 1: Trig Unit Circle (Span 7 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            onClick={() => onSelectTopicAndOpenApp(SUGGESTED_TOPICS[1])}
            className="lg:col-span-7 bg-white dark:bg-[#181A20] rounded-2xl border border-[#EAE4D9] dark:border-[#26282E] p-6 sm:p-8 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-[#F26207] dark:hover:border-[#F26207] transition-all duration-200 relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 mb-6 z-10">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#F26207] px-2.5 py-1 rounded-md bg-orange-50 dark:bg-orange-950/80 border border-orange-200 dark:border-orange-800/60">
                  Lượng giác học
                </span>
                <h3 className="text-2xl font-bold text-[#1C1B1A] dark:text-white mt-2 group-hover:text-[#F26207] transition-colors" style={{ letterSpacing: '0px' }}>
                  Đường tròn lượng giác & Toạ độ pha
                </h3>
                <p className="text-xs sm:text-sm text-[#625F59] dark:text-slate-400 mt-1 max-w-md" style={{ letterSpacing: '0px' }}>
                  Khám phá mối liên hệ hình học tự nhiên giữa góc quay θ, giá trị sin, cos, tan và toạ độ điểm P(x,y) trên đường tròn đơn vị R=1.
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 border border-[#EAE4D9] dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-[#F26207] group-hover:text-white group-hover:border-transparent transition-colors shrink-0 shadow-xs">
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Visual Canvas Snapshot */}
            <div className="relative h-56 sm:h-64 bg-[#FAF7F2] dark:bg-[#0E1117] rounded-xl border border-[#EAE4D9] dark:border-slate-800 flex items-center justify-center overflow-hidden p-4">
              <svg viewBox="0 0 240 180" className="w-full h-full">
                <line x1="20" y1="90" x2="220" y2="90" stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" />
                <line x1="120" y1="10" x2="120" y2="170" stroke="currentColor" strokeWidth="1.2" className="text-slate-300 dark:text-slate-700" />
                <circle cx="120" cy="90" r="65" fill="none" stroke="#F26207" strokeWidth="2.5" className="dark:stroke-orange-500" />
                <polygon points="120,90 166,90 166,44" fill="#F26207" fillOpacity="0.08" />
                <line x1="120" y1="90" x2="166" y2="90" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" className="dark:stroke-emerald-400" />
                <line x1="166" y1="90" x2="166" y2="44" stroke="#F26207" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" className="dark:stroke-rose-400" />
                <line x1="120" y1="90" x2="166" y2="44" stroke="#FF7729" strokeWidth="2.5" strokeLinecap="round" className="dark:stroke-orange-400" />
                <circle cx="166" cy="44" r="5" fill="#FF7729" className="dark:fill-orange-400" />
                <text x="175" y="44" fill="#FF7729" fontSize="10" fontFamily="monospace" fontWeight="bold" className="dark:fill-orange-400">P(cos θ, sin θ)</text>
              </svg>
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white font-mono text-[11px]">
                x² + y² = 1
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[#625F59] dark:text-slate-400">
              <span className="font-mono">Tham số: Bán kính R, Góc quay θ</span>
              <span className="text-[#F26207] font-semibold group-hover:underline">Thử tương tác →</span>
            </div>
          </motion.div>

          {/* Card 2: Quadratic Parabola (Span 5 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            onClick={() => onSelectTopicAndOpenApp(SUGGESTED_TOPICS[0])}
            className="lg:col-span-5 bg-white dark:bg-[#181A20] rounded-2xl border border-[#EAE4D9] dark:border-[#26282E] p-6 sm:p-8 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-[#F26207] dark:hover:border-[#F26207] transition-all duration-200 relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 mb-4 z-10">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60">
                  Đại số & Hàm số
                </span>
                <h3 className="text-xl font-bold text-[#1C1B1A] dark:text-white mt-2 group-hover:text-[#F26207] transition-colors" style={{ letterSpacing: '0px' }}>
                  Phương trình bậc 2 & Parabol
                </h3>
                <p className="text-xs sm:text-sm text-[#625F59] dark:text-slate-400 mt-1" style={{ letterSpacing: '0px' }}>
                  Đỉnh cực trị V, trục đối xứng và số giao điểm với trục hoành phụ thuộc vào biệt thức Δ = b² - 4ac.
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 border border-[#EAE4D9] dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-[#F26207] group-hover:text-white group-hover:border-transparent transition-colors shrink-0 shadow-xs">
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Parabola Visual */}
            <div className="relative h-44 sm:h-48 bg-[#FAF7F2] dark:bg-[#0E1117] rounded-xl border border-[#EAE4D9] dark:border-slate-800 flex items-center justify-center overflow-hidden p-3">
              <svg viewBox="0 0 200 140" className="w-full h-full">
                <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" />
                <line x1="100" y1="10" x2="100" y2="130" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" />
                <path d="M 20,20 Q 100,160 180,20" fill="none" stroke="#F26207" strokeWidth="2.5" className="dark:stroke-orange-500" />
                <circle cx="100" cy="90" r="4.5" fill="#FF7729" className="dark:fill-orange-400" />
                <circle cx="55" cy="100" r="3.5" fill="#059669" className="dark:fill-emerald-400" />
                <circle cx="145" cy="100" r="3.5" fill="#059669" className="dark:fill-emerald-400" />
              </svg>
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 text-orange-300 font-mono text-[10px]">
                Δ = b² - 4ac &gt; 0
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[#625F59] dark:text-slate-400">
              <span className="font-mono">Hệ số: a, b, c</span>
              <span className="text-[#F26207] font-semibold group-hover:underline">Khám phá →</span>
            </div>
          </motion.div>

          {/* Card 3: Calculus & Derivative (Span 4 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            onClick={() => onSelectTopicAndOpenApp(SUGGESTED_TOPICS[2])}
            className="lg:col-span-4 bg-white dark:bg-[#181A20] rounded-2xl border border-[#EAE4D9] dark:border-[#26282E] p-6 sm:p-7 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-[#F26207] dark:hover:border-[#F26207] transition-all duration-200 relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#F26207] px-2.5 py-1 rounded-md bg-orange-50 dark:bg-orange-950/80 border border-orange-200 dark:border-orange-800/60">
                  Giải tích Vi phân
                </span>
                <h3 className="text-xl font-bold text-[#1C1B1A] dark:text-white mt-2 group-hover:text-[#F26207] transition-colors" style={{ letterSpacing: '0px' }}>
                  Đạo hàm & Cát tuyến tiệm cận
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 border border-[#EAE4D9] dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-[#F26207] group-hover:text-white transition-colors shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs text-[#625F59] dark:text-slate-400 mb-4" style={{ letterSpacing: '0px' }}>
              Hiểu bản chất vi phân lim Δy/Δx khi cát tuyến thu hẹp dần và tiến về tiếp tuyến chính xác.
            </p>

            <div className="h-40 bg-[#FAF7F2] dark:bg-[#0E1117] rounded-xl border border-[#EAE4D9] dark:border-slate-800 flex items-center justify-center overflow-hidden p-2 relative">
              <svg viewBox="0 0 160 120" className="w-full h-full">
                <path d="M 20,100 C 60,95 100,60 140,20" fill="none" stroke="#F26207" strokeWidth="2.5" className="dark:stroke-orange-500" />
                <line x1="20" y1="85" x2="140" y2="25" stroke="#FF7729" strokeWidth="2" strokeDasharray="3 3" className="dark:stroke-orange-400" />
                <circle cx="80" cy="65" r="4" fill="#FF7729" className="dark:fill-orange-400" />
                <circle cx="110" cy="45" r="3.5" fill="#059669" className="dark:fill-emerald-400" />
              </svg>
              <span className="absolute bottom-2 left-2 text-[10px] font-mono text-[#F26207]">Δx → 0</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-[#625F59] dark:text-slate-400">
              <span className="font-mono">f'(x₀) = slope</span>
              <span className="text-[#F26207] font-semibold group-hover:underline">Xem mô phỏng →</span>
            </div>
          </motion.div>

          {/* Card 4: 3D Vector Space (Span 4 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.25 }}
            onClick={() => onSelectTopicAndOpenApp(SUGGESTED_TOPICS[3])}
            className="lg:col-span-4 bg-white dark:bg-[#181A20] rounded-2xl border border-[#EAE4D9] dark:border-[#26282E] p-6 sm:p-7 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-[#F26207] dark:hover:border-[#F26207] transition-all duration-200 relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-sky-700 dark:text-sky-400 px-2.5 py-1 rounded-md bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800/60">
                  Không gian 3D
                </span>
                <h3 className="text-xl font-bold text-[#1C1B1A] dark:text-white mt-2 group-hover:text-[#F26207] transition-colors" style={{ letterSpacing: '0px' }}>
                  Hệ toạ độ Oxyz & Vector 3D
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 border border-[#EAE4D9] dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-[#F26207] group-hover:text-white transition-colors shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs text-[#625F59] dark:text-slate-400 mb-4" style={{ letterSpacing: '0px' }}>
              Dựng hình hộp toạ độ không gian 3 chiều Isometric, tính chuẩn vector độ dài ||v|| = √(x² + y² + z²).
            </p>

            <div className="h-40 bg-[#FAF7F2] dark:bg-[#0E1117] rounded-xl border border-[#EAE4D9] dark:border-slate-800 flex items-center justify-center overflow-hidden p-2 relative">
              <svg viewBox="0 0 160 120" className="w-full h-full">
                {/* 3 axes */}
                <line x1="80" y1="60" x2="30" y2="90" stroke="#F26207" strokeWidth="1.5" />
                <line x1="80" y1="60" x2="135" y2="85" stroke="#059669" strokeWidth="1.5" />
                <line x1="80" y1="60" x2="80" y2="15" stroke="#2563EB" strokeWidth="1.5" />
                {/* 3D vector */}
                <line x1="80" y1="60" x2="115" y2="30" stroke="#FF7729" strokeWidth="2.5" strokeLinecap="round" className="dark:stroke-orange-400" />
                <circle cx="115" cy="30" r="4" fill="#FF7729" className="dark:fill-orange-400" />
              </svg>
              <span className="absolute bottom-2 right-2 text-[10px] font-mono text-sky-700 dark:text-sky-400">||v|| Euclid</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-[#625F59] dark:text-slate-400">
              <span className="font-mono">Toạ độ (x, y, z)</span>
              <span className="text-[#F26207] font-semibold group-hover:underline">Xoay không gian →</span>
            </div>
          </motion.div>

          {/* Card 5: Integral Circle Area (Span 4 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            onClick={() => onSelectTopicAndOpenApp(SUGGESTED_TOPICS[4])}
            className="lg:col-span-4 bg-white dark:bg-[#181A20] rounded-2xl border border-[#EAE4D9] dark:border-[#26282E] p-6 sm:p-7 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-[#F26207] dark:hover:border-[#F26207] transition-all duration-200 relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#625F59] dark:text-slate-300 px-2.5 py-1 rounded-md bg-[#FAF7F2] dark:bg-slate-800 border border-[#EAE4D9] dark:border-slate-700">
                  Tích phân & Diện tích
                </span>
                <h3 className="text-xl font-bold text-[#1C1B1A] dark:text-white mt-2 group-hover:text-[#F26207] transition-colors" style={{ letterSpacing: '0px' }}>
                  Chứng minh diện tích A = πr²
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 border border-[#EAE4D9] dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-[#F26207] group-hover:text-white transition-colors shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs text-[#625F59] dark:text-slate-400 mb-4" style={{ letterSpacing: '0px' }}>
              Chia nhỏ hình tròn thành các nan quạt nêm ghép lại thành hình bình hành xấp xỉ có đáy πr và chiều cao r.
            </p>

            <div className="h-40 bg-[#FAF7F2] dark:bg-[#0E1117] rounded-xl border border-[#EAE4D9] dark:border-slate-800 flex items-center justify-center overflow-hidden p-2 relative">
              <svg viewBox="0 0 160 120" className="w-full h-full">
                <circle cx="50" cy="60" r="35" fill="none" stroke="#F26207" strokeWidth="2" strokeDasharray="3 3" className="dark:stroke-orange-500" />
                <path d="M 50,60 L 80,45 A 35 35 0 0 1 85,60 Z" fill="#FF7729" fillOpacity="0.4" stroke="#FF7729" strokeWidth="1.5" />
                <rect x="95" y="45" width="55" height="30" fill="#F26207" fillOpacity="0.15" stroke="#F26207" strokeWidth="1.5" className="dark:stroke-orange-500" />
              </svg>
              <span className="absolute bottom-2 left-2 text-[10px] font-mono text-[#F26207]">n nan quạt → ∞</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-[#625F59] dark:text-slate-400">
              <span className="font-mono">A = ∫ 2πr dr</span>
              <span className="text-[#F26207] font-semibold group-hover:underline">Trải nan quạt →</span>
            </div>
          </motion.div>

        </div>

      </div>

    </section>
  );
};
