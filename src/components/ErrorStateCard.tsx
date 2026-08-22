import React from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  RotateCcw, 
  HelpCircle, 
  ArrowRight,
  FileCode,
  ShieldAlert
} from 'lucide-react';

interface ErrorStateCardProps {
  onRetry: () => void;
  onResetToDefaults: () => void;
}

export const ErrorStateCard: React.FC<ErrorStateCardProps> = ({
  onRetry,
  onResetToDefaults
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-white dark:bg-[#0E121A] rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-lg shadow-rose-950/5 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Top Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/80 flex items-center justify-center shrink-0 shadow-xs">
          <ShieldAlert className="w-6 h-6" />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100">
              Không thể dựng hình mô phỏng
            </h3>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold border border-rose-200/60 dark:border-rose-800/60">
              ERR_LATEX_EVAL
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Hệ thống phát hiện biểu thức toán học hoặc tham số truyền vào vượt quá miền xác định của hàm số ($a = 0$ làm mất tính bậc 2 hoặc chia cho 0).
          </p>
        </div>
      </div>

      {/* Code / Error Log Container */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2 text-[11px]">
          <span className="flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            Stack Trace Diagnostics
          </span>
          <span className="text-rose-400">Exit Code: 1</span>
        </div>
        <p className="text-rose-400">
          Uncaught MathDomainError: Quadratic coefficient `a` cannot be zero when solving ax² + bx + c = 0.
        </p>
        <p className="text-slate-400 text-[11px]">
          at QuadraticSolver.calculateRoots (solver.ts:42)
          <br />at renderSVGPlot (visualEngine.tsx:118)
        </p>
      </div>

      {/* Suggested Fixes */}
      <div className="bg-slate-50 dark:bg-[#131722] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2.5">
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Hướng xử lý đề xuất:
        </span>
        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
          <li>Kiểm tra lại hệ số $a \neq 0$ để đảm bảo đồ thị là một đường Parabol hợp lệ.</li>
          <li>Điều chỉnh thanh trượt hoặc nhấp đặt lại để khôi phục trạng thái chuẩn.</li>
          <li>Thử chọn một câu hỏi mẫu khác trong danh sách đề xuất bên cột trái.</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          onClick={onResetToDefaults}
          className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Đặt lại tham số gốc</span>
        </button>

        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Thử kết xuất lại (Retry)</span>
        </button>
      </div>

    </div>
  );
};
