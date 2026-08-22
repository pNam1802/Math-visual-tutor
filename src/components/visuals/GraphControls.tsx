import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface GraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  userZoom: number;
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  userZoom,
}) => {
  return (
    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-[#121620]/90 backdrop-blur-md px-1.5 py-1 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm z-10 select-none">
      <button
        type="button"
        onClick={onZoomIn}
        title="Phóng to (hoặc lăn chuột lên)"
        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#F26207] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={onZoomOut}
        title="Thu nhỏ (hoặc lăn chuột xuống)"
        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#F26207] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-700 mx-0.5" />
      <button
        type="button"
        onClick={onReset}
        title="Đặt lại góc nhìn mặc định"
        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#F26207] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center gap-1 text-[11px] font-mono font-medium"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        {Math.abs(userZoom - 1) > 0.05 && (
          <span className="text-[#F26207] font-semibold">{(userZoom * 100).toFixed(0)}%</span>
        )}
      </button>
    </div>
  );
};
