import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeJs3DVisualProps {
  vx?: number;
  vy?: number;
  vz?: number;
  zoom?: number;
  showGrid?: boolean;
  topic?: string;
  concept?: string;
  animationPhase?: 'intro' | 'build-up' | 'highlight' | 'conclusion';
}

export const ThreeJs3DVisual: React.FC<ThreeJs3DVisualProps> = ({
  vx = 3,
  vy = 4,
  vz = 3,
  zoom = 1,
  showGrid = true,
  topic = 'vector',
  concept = 'vector_3d_projection',
  animationPhase
}) => {
  const isHighlight = animationPhase === 'highlight';

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const arrowHelperRef = useRef<THREE.ArrowHelper | null>(null);
  const floorGridRef = useRef<THREE.GridHelper | null>(null);
  const boxHelperRef = useRef<THREE.LineSegments | null>(null);
  const pointMarkerRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; // transparent to inherit theme

    // Camera setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(9, 7, 10);
    camera.lookAt(0, 1.5, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffaa44, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Coordinate Axes (X: Red, Y: Green (Up), Z: Blue)
    const axesHelper = new THREE.AxesHelper(6);
    scene.add(axesHelper);

    // Floor Grid (Oxy / Oxz in Three.js coordinates)
    const grid = new THREE.GridHelper(12, 12, 0xf26207, 0x475569);
    grid.position.y = 0;
    scene.add(grid);
    floorGridRef.current = grid;

    // Interactive mouse & touch rotation state
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let rotationAngleX = 0.5;
    let rotationAngleY = 0.7;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };

      // Invert deltaX so dragging mouse right rotates the scene right
      rotationAngleY -= deltaX * 0.008;
      rotationAngleX = Math.max(-1.2, Math.min(1.2, rotationAngleX + deltaY * 0.008));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      rotationAngleY -= deltaX * 0.008;
      rotationAngleX = Math.max(-1.2, Math.min(1.2, rotationAngleX + deltaY * 0.008));
      if (e.cancelable) e.preventDefault();
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Orbit camera based on angles and zoom
      const distance = 14 / (zoom || 1);
      camera.position.x = distance * Math.cos(rotationAngleX) * Math.sin(rotationAngleY);
      camera.position.y = distance * Math.sin(rotationAngleX) + 1.5;
      camera.position.z = distance * Math.cos(rotationAngleX) * Math.cos(rotationAngleY);
      camera.lookAt(0, 1.5, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Update Vector 3D / Geometry elements when vx, vy, vz or zoom change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Toggle grid visibility
    if (floorGridRef.current) {
      floorGridRef.current.visible = showGrid;
    }

    // Clean up previous dynamic helpers
    if (arrowHelperRef.current) {
      scene.remove(arrowHelperRef.current);
      arrowHelperRef.current.dispose();
      arrowHelperRef.current = null;
    }
    if (pointMarkerRef.current) {
      scene.remove(pointMarkerRef.current);
      pointMarkerRef.current.geometry.dispose();
      pointMarkerRef.current = null;
    }
    if (boxHelperRef.current) {
      scene.remove(boxHelperRef.current);
      boxHelperRef.current.geometry.dispose();
      boxHelperRef.current = null;
    }

    // ThreeJS coordinate mapping: X=vx, Y=vz (up), Z=vy
    const targetVec = new THREE.Vector3(vx, vz, vy);
    const length = targetVec.length();
    const dir = length > 0.001 ? targetVec.clone().normalize() : new THREE.Vector3(0, 1, 0);

    // Create stylish 3D Vector Arrow
    const arrowColor = isHighlight ? 0xf59e0b : 0xf26207;
    const arrow = new THREE.ArrowHelper(
      dir,
      new THREE.Vector3(0, 0, 0),
      length,
      arrowColor,
      isHighlight ? 0.8 : 0.6,
      isHighlight ? 0.45 : 0.35
    );
    scene.add(arrow);
    arrowHelperRef.current = arrow;

    // Tip point sphere
    const sphereGeo = new THREE.SphereGeometry(isHighlight ? 0.25 : 0.18, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: isHighlight ? 0xf59e0b : 0xd97706,
      emissiveIntensity: isHighlight ? 0.9 : 0.3,
      roughness: 0.2,
      metalness: 0.8
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(vx, vz, vy);
    scene.add(sphere);
    pointMarkerRef.current = sphere;

    // 3D Bounding coordinate box lines
    const linePoints = [
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(vx, 0, 0),
      new THREE.Vector3(vx, 0, 0), new THREE.Vector3(vx, 0, vy),
      new THREE.Vector3(0, 0, vy), new THREE.Vector3(vx, 0, vy),
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, vy),
      // vertical pillars
      new THREE.Vector3(vx, 0, vy), new THREE.Vector3(vx, vz, vy),
      new THREE.Vector3(vx, 0, 0), new THREE.Vector3(vx, vz, 0),
      new THREE.Vector3(0, 0, vy), new THREE.Vector3(0, vz, vy),
      // top bounds
      new THREE.Vector3(vx, vz, 0), new THREE.Vector3(vx, vz, vy),
      new THREE.Vector3(0, vz, vy), new THREE.Vector3(vx, vz, vy),
      new THREE.Vector3(0, vz, 0), new THREE.Vector3(vx, vz, 0),
      new THREE.Vector3(0, vz, 0), new THREE.Vector3(0, vz, vy),
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, vz, 0)
    ];

    const boxGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const boxMat = new THREE.LineDashedMaterial({
      color: 0x94a3b8,
      dashSize: 0.2,
      gapSize: 0.1,
      opacity: 0.6,
      transparent: true
    });
    const boxLines = new THREE.LineSegments(boxGeo, boxMat);
    boxLines.computeLineDistances();
    scene.add(boxLines);
    boxHelperRef.current = boxLines;

  }, [vx, vy, vz, showGrid]);

  const norm = Math.sqrt(vx * vx + vy * vy + vz * vz);

  return (
    <div className="w-full h-full relative flex items-center justify-center select-none overflow-hidden min-h-[380px]">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Vector Telemetry Pill */}
      <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#121620]/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#EAE4D9] dark:border-white/10 shadow-sm text-xs font-mono flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F26207]"></span>
          <span className="font-bold text-[#F26207] dark:text-orange-400">
            v = ({vx}i + {vy}j + {vz}k)
          </span>
          <span className="text-[#8F8D88]">|</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            ||v|| = {norm.toFixed(3)}
          </span>
        </div>
        <div className="text-[11px] text-[#625F59] dark:text-slate-400 flex items-center gap-2">
          <span>Three.js WebGL 3D</span>
          <span>•</span>
          <span className="text-amber-500">Giữ chuột để xoay 360°</span>
        </div>
      </div>
    </div>
  );
};
