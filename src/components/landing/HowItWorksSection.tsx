import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Sliders, Film, ArrowRight, CheckCircle2, Sparkles, Compass } from 'lucide-react';

interface HowItWorksSectionProps {
  onOpenApp: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onOpenApp }) => {
  const steps = [
    {
      stepNumber: '01',
      title: 'Hỏi bài toán bất kỳ',
      subtitle: 'Tự nhiên & Trực quan',
      description: 'Nhập phương trình, câu hỏi lý thuyết hoặc bài toán bằng tiếng Việt. Hệ thống hỗ trợ bàn phím toán học và nhận diện ký hiệu tức thì.',
      icon: <MessageSquare className="w-6 h-6 text-[#F26207]" />,
      badge: 'Input',
      illustration: (
        <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#0E1117] border border-[#EAE4D9] dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#625F59] dark:text-slate-400 border-b border-[#EAE4D9] dark:border-slate-800 pb-1.5">
            <span>Query Prompt</span>
            <span className="text-[#F26207] font-bold">LaTeX Parser</span>
          </div>
          <p className="text-[#1C1B1A] dark:text-white font-sans">"Minh hoạ ý nghĩa hình học của đường tròn lượng giác..."</p>
          <div className="inline-block px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/80 text-[#F26207] border border-orange-200 dark:border-orange-800/60 text-[10px]">
            x² + y² = 1 • (cos θ, sin θ)
          </div>
        </div>
      )
    },
    {
      stepNumber: '02',
      title: 'Tương tác trực quan 2D & 3D',
      subtitle: 'Thao tác không độ trễ',
      description: 'Đồ thị toạ độ, hàm số và vector không gian tự động dựng hình với các thanh trượt tham số real-time, phản hồi mượt mà từng thay đổi.',
      icon: <Sliders className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      badge: 'Interactive Canvas',
      illustration: (
        <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#0E1117] border border-[#EAE4D9] dark:border-slate-800 text-xs space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-[#625F59] dark:text-slate-400">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Realtime Slider
            </span>
            <span className="font-mono font-bold text-[#F26207]">θ = 45°</span>
          </div>
          <div className="h-1.5 bg-[#EAE4D9] dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-[#F26207] rounded-full"></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#625F59] dark:text-slate-400">
            <span>cos = 0.71</span>
            <span>sin = 0.71</span>
            <span>tan = 1.00</span>
          </div>
        </div>
      )
    },
    {
      stepNumber: '03',
      title: 'Hiểu sâu qua Animation Manim',
      subtitle: 'Bảng đen phong cách 3Blue1Brown',
      description: 'Khám phá video diễn giải từng bước logic với hoạt họa bảng đen toán học cao cấp, giúp ghi nhớ bản chất thay vì học vẹt công thức.',
      icon: <Film className="w-6 h-6 text-orange-600 dark:text-orange-400" />,
      badge: 'Manim 3B1B Engine',
      illustration: (
        <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#0E1117] border border-[#EAE4D9] dark:border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-orange-600 dark:text-orange-400 font-mono font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Frame-by-Frame
            </span>
            <span className="px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 text-[10px] font-mono font-semibold border border-orange-200 dark:border-orange-800/60">60 FPS</span>
          </div>
          <div className="h-9 rounded-lg bg-white dark:bg-slate-900 border border-[#EAE4D9] dark:border-slate-800 flex items-center justify-center font-mono text-[11px] text-[#F26207] font-bold">
            d/dx [sin(x)] = cos(x)
          </div>
          <p className="text-xs text-[#625F59] dark:text-slate-400 font-sans">
            Biểu diễn tiếp tuyến xoay quanh đường cong theo thời gian thực
          </p>
        </div>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative bg-[#FAF7F2] dark:bg-[#121316] transition-colors">
      
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center px-4 mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-900/60 text-[#F26207] font-mono text-xs font-semibold mb-4">
          <Compass className="w-3.5 h-3.5" />
          <span>PHƯƠNG PHÁP TRỰC QUAN HOÁ</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-[#F26207] dark:text-white tracking-normal leading-tight mb-4">
          Cách MathVisual giúp bạn hiểu sâu toán học
        </h2>
        
        <p className="text-base sm:text-lg text-[#3D3A35] dark:text-slate-300 leading-relaxed font-medium">
          Chuyển đổi các định lý trừu tượng thành trải nghiệm thị giác sống động chỉ qua 3 bước tinh gọn.
        </p>
      </div>

      {/* 3 Step Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group relative bg-white dark:bg-[#181A20] rounded-2xl border border-[#EAE4D9] dark:border-[#26282E] p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:border-[#F26207] dark:hover:border-[#F26207] transition-all duration-200 hover:-translate-y-0.5"
            >
              <div>
                {/* Step Top Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] dark:bg-slate-800/80 border border-[#EAE4D9] dark:border-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>
                  
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-slate-300 dark:text-slate-700 group-hover:text-[#F26207] transition-colors">
                    {step.stepNumber}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#F26207]">
                    {step.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-[#1C1B1A] dark:text-white mt-1">
                    {step.title}
                  </h3>
                </div>

                <p className="text-sm text-[#625F59] dark:text-slate-400 leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              {/* Step Mini Illustration */}
              <div className="mt-auto">
                {step.illustration}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner inside How it works */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenApp}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#F26207] hover:bg-[#D95300] text-white font-semibold text-sm shadow-md shadow-orange-700/20 transition-all cursor-pointer hover:scale-105"
          >
            <span>Trải nghiệm trực tiếp ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </section>
  );
};
