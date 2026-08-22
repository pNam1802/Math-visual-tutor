import React, { useState, useRef, useCallback, useEffect } from 'react';

interface UseGraphPanZoomOptions {
  baseZoom?: number;
  minZoom?: number;
  maxZoom?: number;
}

export function useGraphPanZoom({
  baseZoom = 1,
  minZoom = 0.15,
  maxZoom = 12,
}: UseGraphPanZoomOptions = {}) {
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [userZoom, setUserZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetView = useCallback(() => {
    setPan({ x: 0, y: 0 });
    setUserZoom(1);
  }, []);

  const zoomIn = useCallback(() => {
    setUserZoom((z) => Math.min(z * 1.25, maxZoom));
  }, [maxZoom]);

  const zoomOut = useCallback(() => {
    setUserZoom((z) => Math.max(z / 1.25, minZoom));
  }, [minZoom]);

  // Pointer event handlers for dragging (smooth mouse pan)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    dragStartRef.current = null;
    setIsDragging(false);
  }, []);

  // Touch handlers for mobile pan & pinch-to-zoom
  const touchStartRef = useRef<{ x: number; y: number; panX: number; panY: number; dist?: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchStartRef.current = {
        x: t.clientX,
        y: t.clientY,
        panX: pan.x,
        panY: pan.y,
      };
      setIsDragging(true);
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      touchStartRef.current = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
        panX: pan.x,
        panY: pan.y,
        dist,
      };
    }
  }, [pan]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    if (e.touches.length === 1) {
      const t = e.touches[0];
      const dx = t.clientX - touchStartRef.current.x;
      const dy = t.clientY - touchStartRef.current.y;
      setPan({
        x: touchStartRef.current.panX + dx,
        y: touchStartRef.current.panY + dy,
      });
    } else if (e.touches.length === 2 && touchStartRef.current.dist) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const ratio = dist / touchStartRef.current.dist;
      setUserZoom((z) => Math.min(Math.max(z * ratio, minZoom), maxZoom));
      touchStartRef.current.dist = dist;
    }
  }, [maxZoom, minZoom]);

  const handleTouchEnd = useCallback(() => {
    touchStartRef.current = null;
    setIsDragging(false);
  }, []);

  // Non-passive wheel listener attached to container to prevent page scroll and enable smooth zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      setUserZoom((z) => Math.min(Math.max(z * zoomFactor, minZoom), maxZoom));
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [minZoom, maxZoom]);

  return {
    pan,
    userZoom,
    effectiveZoom: baseZoom * userZoom,
    isDragging,
    containerRef,
    resetView,
    zoomIn,
    zoomOut,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
