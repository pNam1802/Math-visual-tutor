import React, { useState, useEffect, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Grid, 
  Sliders,
  Minimize2,
  Download,
  Check,
  Loader2
} from 'lucide-react';
import { TopicData } from '../types';
import { QuadraticVisual } from './visuals/QuadraticVisual';
import { TrigCircleVisual } from './visuals/TrigCircleVisual';
import { DerivativeVisual } from './visuals/DerivativeVisual';
import { ThreeJs3DVisual } from './visuals/ThreeJs3DVisual';
import { CircleAreaVisual } from './visuals/CircleAreaVisual';
import { EquationVisual } from './visuals/EquationVisual';
import { exportVisualStageToPNG } from '../utils/exportVisualImage';

interface FullscreenVisualModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: TopicData;
  paramValues: Record<string, number>;
  onParamChange: (paramId: string, value: number) => void;
}

export const FullscreenVisualModal: React.FC<FullscreenVisualModalProps> = ({
  isOpen,
  onClose,
  topic,
  paramValues,
  onParamChange
}) => {
  const [zoom, setZoom] = useState<number>(1.25);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const handleDownloadPNG = async () => {
    if (isExporting || !stageRef.current) return;
    setIsExporting(true);
    try {
      const success = await exportVisualStageToPNG(stageRef.current, topic.title);
      if (success) {
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 2200);
      }
    } catch (err) {
      console.error('Export error in fullscreen:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Keyboard navigation, focus management & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Focus on close button when modal opens
    closeButtonRef.current?.focus();

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Handle Escape keydown
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderVisualEngine = () => {
    switch (topic.type) {
      case 'geometry_3d':
      case 'vector':
      case 'vector_3d':
        return (
          <ThreeJs3DVisual
            vx={paramValues.vx ?? 3}
            vy={paramValues.vy ?? 4}
            vz={paramValues.vz ?? 3}
            zoom={zoom}
            showGrid={showGrid}
            topic={topic.type}
            concept={topic.concept}
          />
        );

      case 'geometry_2d':
      case 'circle_area':
        return (
          <CircleAreaVisual
            radius={paramValues.radius ?? 4}
            slices={paramValues.slices ?? 16}
            zoom={zoom}
            showGrid={showGrid}
          />
        );

      case 'trigonometry':
      case 'trig_circle':
        return (
          <TrigCircleVisual
            angleDeg={paramValues.angleDeg ?? 45}
            zoom={zoom}
            showGrid={showGrid}
          />
        );

      case 'calculus':
      case 'derivative':
        return (
          <DerivativeVisual
            x0={paramValues.x0 ?? 1.0}
            deltaX={paramValues.deltaX ?? 0.8}
            zoom={zoom}
            showGrid={showGrid}
          />
        );

      case 'equation':
        return (
          <EquationVisual
            a={paramValues.a ?? 1}
            b={paramValues.b ?? -5}
            c={paramValues.c ?? 6}
            zoom={zoom}
            showGrid={showGrid}
            concept={topic.concept}
          />
        );

      case 'algebra':
      case 'quadratic':
      default:
        return (
          <QuadraticVisual
            a={paramValues.a ?? 1}
            b={paramValues.b ?? -5}
            c={paramValues.c ?? 6}
            zoom={zoom}
            showGrid={showGrid}
          />
        );
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label={topic.title}
      className="fixed inset-0 z-50 bg-[#121316] text-white flex flex-col animate-modal-fade-in"
    >
      
      {/* Top Navbar */}
      <div className="h-16 px-6 border-b border-[#26282E] flex items-center justify-between bg-[#181A20]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#F26207] text-white flex items-center justify-center font-bold">
            M
          </div>
          <div>
            <h3 className="font-heading font-bold text-base">{topic.renderInfo.title || topic.title}</h3>
            <p className="text-xs text-slate-400 font-sans">{topic.renderInfo.description || topic.formulaSummary}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
              showGrid ? 'bg-[#F26207] text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono text-xs text-slate-400">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1.25)}
            title="Đặt lại thu phóng (100%)"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-6 bg-slate-800 mx-1"></div>

          {/* Download PNG Button */}
          <button
            onClick={handleDownloadPNG}
            disabled={isExporting}
            title={`Tải ảnh PNG đồ thị (${topic.title})`}
            className={`p-2 rounded-xl text-xs transition-all border flex items-center gap-1.5 cursor-pointer ${
              exportSuccess
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-[#F26207]'
            }`}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#F26207]" />
            ) : exportSuccess ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="hidden sm:inline font-mono font-medium">
              {isExporting ? 'Đang xuất...' : exportSuccess ? 'Đã tải' : 'Tải PNG'}
            </span>
          </button>

          <div className="w-[1px] h-6 bg-slate-800 mx-1"></div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Đóng chế độ toàn màn hình"
            className="p-2 rounded-xl bg-[#F26207]/20 text-orange-400 hover:bg-[#F26207] hover:text-white transition-colors cursor-pointer"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area & Floating Parameter Dock */}
      <div 
        ref={stageRef}
        className="flex-1 relative flex items-center justify-center p-6 bg-[#0E1015] overflow-hidden"
      >
        {renderVisualEngine()}

        {/* Floating Parameter Dock at bottom */}
        {topic.params.length > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#181A20]/95 backdrop-blur-md p-4 rounded-2xl border border-[#26282E] shadow-2xl max-w-2xl w-full mx-4 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#F26207]" />
              <span className="text-xs font-mono font-bold text-slate-200">Điều chỉnh nhanh:</span>
            </div>

            <div className="flex flex-1 items-center gap-4 min-w-[280px]">
              {topic.params.slice(0, 3).map((param) => {
                const val = paramValues[param.id] ?? param.defaultValue;
                return (
                  <div key={param.id} className="flex-1 flex items-center gap-2">
                    <span className="font-mono text-xs text-[#F26207] font-bold">{param.symbol || param.name}:</span>
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={val}
                      onChange={(e) => onParamChange(param.id, parseFloat(e.target.value))}
                      className="w-full accent-[#F26207] cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                    />
                    <span className="font-mono text-xs text-slate-300 font-semibold">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
