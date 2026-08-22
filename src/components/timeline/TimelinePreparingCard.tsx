import React, { useEffect, useState } from 'react';
import { Sparkles, Code2, Cpu } from 'lucide-react';
import { TopicData } from '../../types';

interface TimelinePreparingCardProps {
  topic: TopicData;
  onReady: () => void;
}

export const TimelinePreparingCard: React.FC<TimelinePreparingCardProps> = ({
  topic,
  onReady
}) => {
  const [prepProgress, setPrepProgress] = useState<number>(15);
  const [statusText, setStatusText] = useState<string>('Khởi tạo kịch bản vector...');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPrepProgress(45);
      setStatusText(`Biên dịch các bước diễn giải sang Timeline Stages (${topic.steps?.length || 4} giai đoạn)...`);
    }, 350);

    const t2 = setTimeout(() => {
      setPrepProgress(85);
      setStatusText('Nạp quỹ đạo biến thiên tham số & WebGL Coordinate Engine...');
    }, 750);

    const t3 = setTimeout(() => {
      setPrepProgress(100);
      setStatusText('Hoàn tất kịch bản hoạt cảnh! Bắt đầu phát...');
      setTimeout(() => {
        onReady();
      }, 250);
    }, 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [topic, onReady]);

  return (
    <div className="absolute inset-0 z-30 bg-[#121316]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-200">
      <div className="max-w-md w-full space-y-5">
        
        {/* Animated Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-[#F26207] flex items-center justify-center mx-auto shadow-lg shadow-orange-950/50 relative">
          <Sparkles className="w-7 h-7 animate-pulse text-[#F26207]" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#F26207] animate-ping"></span>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-heading font-bold text-lg text-slate-100">
            Khởi tạo Hoạt cảnh Giải thích Chi tiết
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            Chuỗi hoạt cảnh có kịch bản chạy trực tiếp trong Canvas/WebGL theo thời gian thực (3Blue1Brown style)
          </p>
        </div>

        {/* Progress Bar & Real-time ETA */}
        <div className="space-y-2 bg-[#181A20] p-4 rounded-2xl border border-[#26282E]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-orange-400 font-medium flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              {statusText}
            </span>
            <span className="text-slate-400 font-bold">{prepProgress}%</span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-600 to-[#F26207] transition-all duration-300 rounded-full"
              style={{ width: `${prepProgress}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
            <span>Thời gian dự kiến: ~1.0 giây</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Code2 className="w-3 h-3" />
              Client-side Vector
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 font-sans italic">
          * Hoạt cảnh được render trực tiếp bằng mã nguồn vector & toán học tại trình duyệt, không thông qua render video server.
        </p>

      </div>
    </div>
  );
};
