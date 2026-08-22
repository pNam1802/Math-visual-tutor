import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  Plus, 
  RotateCw,
  Compass,
  TrendingUp,
  Box,
  CircleDot,
  Calculator,
  Layout,
  Smartphone,
  MousePointer,
  Layers,
  Video
} from 'lucide-react';
import { ThreeShaderBackground } from './ThreeShaderBackground';
import { HeroLiveMathDemo } from './HeroLiveMathDemo';
import { HowItWorksSection } from './HowItWorksSection';
import { TopicBentoGrid } from './TopicBentoGrid';
import { LandingNavbar } from './LandingNavbar';
import { LandingFooter } from './LandingFooter';
import { ThemeMode, TopicData } from '../../types';
import { SUGGESTED_TOPICS } from '../../data/mockData';

interface LandingPageProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenApp: () => void;
  onSelectTopicAndOpenApp: (topic: TopicData) => void;
  onAskQuestionAndOpenApp?: (question: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  theme,
  onToggleTheme,
  onOpenApp,
  onSelectTopicAndOpenApp,
  onAskQuestionAndOpenApp
}) => {
  const [promptText, setPromptText] = useState('');

  const categories = [
    { name: 'Lượng giác', icon: <Compass className="w-5 h-5" />, topicId: 'trig_circle' },
    { name: 'Giải tích', icon: <TrendingUp className="w-5 h-5" />, topicId: 'derivative' },
    { name: 'Không gian 3D', icon: <Box className="w-5 h-5" />, topicId: 'vector_3d' },
    { name: 'Đại số', icon: <Calculator className="w-5 h-5" />, topicId: 'quadratic' },
    { name: 'Hình học', icon: <CircleDot className="w-5 h-5" />, topicId: 'circle_area' },
  ];

  const examplePrompts = [
    { text: 'Đường tròn lượng giác & sin/cos', topicId: 'trig_circle' },
    { text: 'Đạo hàm & Cát tuyến tiếp tuyến', topicId: 'derivative' },
    { text: 'Parabol y = ax² + bx + c & Nghiệm Δ', topicId: 'quadratic' },
    { text: 'Không gian Vector 3D toạ độ Oxyz', topicId: 'vector_3d' },
    { text: 'Chứng minh công thức diện tích hình tròn πr²', topicId: 'circle_area' },
  ];

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) {
      onOpenApp();
      return;
    }
    if (onAskQuestionAndOpenApp) {
      onAskQuestionAndOpenApp(promptText);
    } else {
      const lower = promptText.toLowerCase();
      const match = SUGGESTED_TOPICS.find(t => 
        t.title.toLowerCase().includes(lower) || 
        t.prompt.toLowerCase().includes(lower) || 
        t.category.toLowerCase().includes(lower)
      ) || SUGGESTED_TOPICS[0];
      onSelectTopicAndOpenApp(match);
    }
  };

  const handleSelectExample = (topicId: string) => {
    const topic = SUGGESTED_TOPICS.find(t => t.id === topicId);
    if (!topic) {
      console.warn(`[LandingPage] Không tìm thấy topic với id: "${topicId}"`);
      return;
    }
    onSelectTopicAndOpenApp(topic);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#121316] text-[#1C1B1A] dark:text-slate-100 selection:bg-[#F26207] selection:text-white font-sans antialiased overflow-x-hidden transition-colors duration-200">
      
      {/* Top Fixed Header Navbar */}
      <LandingNavbar
        theme={theme}
        onToggleTheme={onToggleTheme}
        onOpenApp={onOpenApp}
      />

      {/* Hero Section - Replit Aesthetic Layout */}
      <section className="relative pt-32 pb-20 sm:pb-28 px-4 sm:px-6 overflow-hidden">
        
        {/* Subtle Mathematical Coordinate Canvas Grid */}
        <ThreeShaderBackground theme={theme} />

        <div className="relative z-10 max-w-4xl mx-auto w-full text-center space-y-8">
          
          {/* Replit-style Large Display Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-extrabold text-[#F26207] dark:text-white tracking-tight drop-shadow-xs"
            >
              {"Bạn muốn khám phá gì?".normalize("NFC")}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#3D3A35] dark:text-slate-300 max-w-2xl mx-auto font-medium">
              Trực quan hoá phương trình, giải tích và không gian vector 3D trong tích tắc — không cần cài đặt.
            </p>
          </motion.div>

          {/* Replit Signature Hero Prompt Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="max-w-2xl mx-auto"
          >
            <form
              onSubmit={handlePromptSubmit}
              className="relative bg-white dark:bg-[#1A1C23] border-2 border-[#F26207]/40 dark:border-[#F26207]/40 rounded-2xl p-4 sm:p-5 shadow-md shadow-orange-500/5 dark:shadow-none hover:border-[#F26207] focus-within:border-[#F26207] focus-within:ring-2 focus-within:ring-[#F26207]/20 transition-all text-left group"
            >
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Nhập bài toán, định lý hoặc phương trình muốn mô phỏng..."
                rows={2}
                className="w-full bg-transparent resize-none outline-none text-[#1C1B1A] dark:text-white placeholder-[#78756F] dark:placeholder-slate-400 text-sm sm:text-base font-sans"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handlePromptSubmit(e);
                  }
                }}
              />

              <div className="flex items-center justify-between pt-2 border-t border-[#EAE4D9] dark:border-white/5">
                <button
                  type="button"
                  onClick={onOpenApp}
                  className="p-1.5 rounded-lg text-[#625F59] dark:text-slate-400 hover:text-[#F26207] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  title="Mở thêm tuỳ chọn toán học"
                >
                  <Plus className="w-5 h-5" />
                </button>

                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-[#F26207] hover:bg-[#D95300] text-white flex items-center justify-center shadow-md shadow-orange-600/20 transition-all cursor-pointer transform hover:scale-105"
                  title="Khởi tạo mô phỏng"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>

          {/* Interactive Category Icons (Replit Style Carousel) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center justify-center gap-2 sm:gap-4 max-w-xl mx-auto pt-2"
          >
            <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto py-1">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleSelectExample(cat.topicId)}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1A1C23] border border-[#EAE4D9] dark:border-[#26282E] flex items-center justify-center text-[#5E5D59] dark:text-slate-300 group-hover:border-[#F26207] group-hover:text-[#F26207] group-hover:shadow-sm transition-all">
                    {cat.icon}
                  </div>
                  <span className="text-xs font-medium text-[#625F59] dark:text-slate-400 group-hover:text-[#1C1B1A] dark:group-hover:text-white transition-colors">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Example prompt pills with Try an example prompt ↺ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="space-y-3 pt-2"
          >
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#8F8D88] dark:text-slate-400 font-medium">
              <span>Gợi ý chủ đề nhanh</span>
              <RotateCw className="w-3 h-3" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
              {examplePrompts.map((p) => (
                <button
                  key={p.text}
                  onClick={() => handleSelectExample(p.topicId)}
                  className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1A1C23] border border-[#EAE4D9] dark:border-[#26282E] text-xs font-medium text-[#5E5D59] dark:text-slate-300 hover:text-[#1C1B1A] dark:hover:text-white hover:border-[#F26207] transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  {p.text}
                </button>
              ))}
            </div>
          </motion.div>

        </div>

      </section>

      {/* Live Interactive Math Canvas Showcase (Desmos / 3Blue1Brown) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#F26207] text-xs font-medium border border-orange-200 dark:border-orange-900/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trực quan hoá thời gian thực 60 FPS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#F26207] dark:text-white">
            Khám phá trực tiếp cơ chế toán học
          </h2>
        </div>
        <HeroLiveMathDemo onOpenApp={onOpenApp} />
      </section>

      {/* Section: Why Visual Math Works (3Blue1Brown Philosophy) */}
      <section id="why-us" className="py-16 sm:py-20 border-y border-[#EAE4D9] dark:border-[#26282E] bg-white dark:bg-[#15171D] relative transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/60 text-[#F26207] flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#1C1B1A] dark:text-white mb-1">Hiểu nhanh gấp 4 lần</h4>
                <p className="text-xs sm:text-sm text-[#625F59] dark:text-slate-400 leading-relaxed">
                  Não bộ xử lý hình ảnh nhanh hơn ký hiệu trừu tượng, giúp học sinh nắm vững trực giác toán học cốt lõi.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#1C1B1A] dark:text-white mb-1">Chuẩn mực 3Blue1Brown</h4>
                <p className="text-xs sm:text-sm text-[#625F59] dark:text-slate-400 leading-relaxed">
                  Phương pháp phân tích từng bước trên nền bảng đen cổ điển với chuyển động hình học sắc nét từng frame.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#1C1B1A] dark:text-white mb-1">Đồng bộ tham số tức thì</h4>
                <p className="text-xs sm:text-sm text-[#625F59] dark:text-slate-400 leading-relaxed">
                  Kéo thanh trượt góc, hệ số hoặc bán kính để chứng kiến toàn bộ công thức và đồ thị biến đổi tương ứng.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section: How it works (3 Steps) */}
      <HowItWorksSection onOpenApp={onOpenApp} />

      {/* Section: Topic Bento Grid Showcase */}
      <TopicBentoGrid onSelectTopicAndOpenApp={onSelectTopicAndOpenApp} />

      {/* Footer Section */}
      <LandingFooter onOpenApp={onOpenApp} />

    </div>
  );
};
