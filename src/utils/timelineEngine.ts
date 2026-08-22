import { TopicData, TimelineScriptStep, TimelinePhase } from '../types';

export interface CompiledTimeline {
  duration: number; // in seconds, e.g. 14
  steps: TimelineScriptStep[];
}

export function compileTimelineScript(
  topic: TopicData,
  currentParams: Record<string, number>
): CompiledTimeline {
  const steps: TimelineScriptStep[] = [];
  const mathSteps = topic.steps || [];
  const stepCount = mathSteps.length;

  // 1. INTRO PHASE (0% -> 20%)
  steps.push({
    phase: 'intro',
    title: `Khởi tạo: ${topic.title}`,
    narration: topic.initialMessage || `Thiết lập không gian toán học và các đại lượng cơ bản cho ${topic.concept || topic.title}.`,
    formula: topic.formulaSummary,
    keyHighlight: 'Hệ trục tọa độ & thông số cơ sở',
    startPct: 0,
    endPct: 20,
    targetParams: { ...currentParams }
  });

  // 2. BUILD-UP PHASE (20% -> 65%)
  // Map through explanation steps or create 2-3 logical build steps
  if (stepCount > 0) {
    const buildPctSpan = 45; // from 20% to 65%
    const stepDuration = buildPctSpan / stepCount;

    mathSteps.forEach((s, idx) => {
      const start = 20 + idx * stepDuration;
      const end = start + stepDuration;
      
      // Calculate dynamic tweening parameters per step
      const stepTargetParams: Record<string, number> = { ...currentParams };
      
      // Fine-tune parameter animation depending on topic
      if (topic.type === 'calculus' || topic.type === 'derivative') {
        // DeltaX shrinks from large to small
        const progressFrac = (idx + 1) / stepCount;
        stepTargetParams.deltaX = Math.max(0.1, 1.5 * (1 - progressFrac * 0.7));
      } else if (topic.type === 'geometry_2d' || topic.type === 'circle_area') {
        const sliceStages = [8, 16, 32, 48, 64];
        stepTargetParams.slices = sliceStages[Math.min(idx, sliceStages.length - 1)];
      } else if (topic.type === 'trigonometry' || topic.type === 'trig_circle') {
        const targetAngle = currentParams.angleDeg ?? 45;
        stepTargetParams.angleDeg = targetAngle * ((idx + 1) / stepCount);
      }

      steps.push({
        phase: 'build-up',
        title: s.title || `Bước ${idx + 1}: Biến đổi & Dựng hình`,
        narration: s.explanation || s.detail || s.summary || `Khảo sát đặc tính và dựng các thành phần tương ứng của bài toán.`,
        formula: s.formula || topic.formulaSummary,
        keyHighlight: s.visualHighlight || `Bước tính toán ${idx + 1}`,
        startPct: start,
        endPct: end,
        targetParams: stepTargetParams
      });
    });
  } else {
    // Default build-up step if no sub-steps
    steps.push({
      phase: 'build-up',
      title: 'Dựng hình & Khảo sát hàm số',
      narration: 'Thiết lập các đường cong, vector và mối liên hệ đại số - hình học.',
      formula: topic.formulaSummary,
      keyHighlight: 'Biến đổi hình học theo kịch bản',
      startPct: 20,
      endPct: 65,
      targetParams: { ...currentParams }
    });
  }

  // 3. HIGHLIGHT PHASE (65% -> 85%)
  const highlightStep = mathSteps.find(s => s.visualHighlight || s.keyTakeaway) || mathSteps[mathSteps.length - 1];
  steps.push({
    phase: 'highlight',
    title: 'Điểm mấu chốt & Trực quan hóa',
    narration: highlightStep?.keyTakeaway || highlightStep?.visualHighlight || 'Nhấn mạnh điểm hội tụ, nghiệm của phương trình hoặc công thức mấu chốt.',
    formula: highlightStep?.formula || topic.formulaSummary,
    keyHighlight: highlightStep?.visualHighlight || 'Điểm mấu chốt',
    startPct: 65,
    endPct: 85,
    targetParams: { ...currentParams }
  });

  // 4. CONCLUSION PHASE (85% -> 100%)
  steps.push({
    phase: 'conclusion',
    title: 'Tổng kết & Kết quả Toán học',
    narration: `Đã hoàn tất chứng minh và mô phỏng ${topic.title}. Bạn có thể kéo các thanh trượt bất kỳ lúc nào để khảo sát thêm.`,
    formula: topic.formulaSummary,
    keyHighlight: 'Kết luận & Tổng quát hóa',
    startPct: 85,
    endPct: 100,
    targetParams: { ...currentParams }
  });

  return {
    duration: Math.max(10, Math.min(20, 8 + steps.length * 2)),
    steps
  };
}

export function interpolateParameters(
  topic: TopicData,
  currentParams: Record<string, number>,
  progressPct: number,
  compiledTimeline: CompiledTimeline
): Record<string, number> {
  const result: Record<string, number> = { ...currentParams };

  // Specific smooth parametric interpolation based on topic type
  const t = Math.max(0, Math.min(100, progressPct)) / 100; // 0 to 1

  if (topic.type === 'calculus' || topic.type === 'derivative') {
    const baseX0 = currentParams.x0 ?? 1.0;
    result.x0 = baseX0;
    
    // In build-up (0.2 -> 0.75), deltaX goes from 1.6 down to 0.05
    if (t < 0.2) {
      result.deltaX = 1.6;
    } else if (t < 0.75) {
      const phaseT = (t - 0.2) / 0.55;
      const easedT = phaseT * phaseT; // ease in acceleration towards 0
      result.deltaX = 1.6 - easedT * 1.52; // reaches 0.08
    } else {
      result.deltaX = 0.06;
    }
  } else if (topic.type === 'geometry_2d' || topic.type === 'circle_area') {
    const baseR = currentParams.radius ?? 4;
    result.radius = baseR;

    if (t < 0.25) {
      result.slices = 8;
    } else if (t < 0.45) {
      result.slices = 16;
    } else if (t < 0.65) {
      result.slices = 32;
    } else {
      result.slices = 64;
    }
  } else if (topic.type === 'trigonometry' || topic.type === 'trig_circle') {
    const targetAngle = currentParams.angleDeg ?? 45;
    if (t < 0.15) {
      result.angleDeg = 0;
    } else if (t < 0.7) {
      const phaseT = (t - 0.15) / 0.55;
      // smooth cubic bezier feel
      const eased = phaseT < 0.5 ? 2 * phaseT * phaseT : -1 + (4 - 2 * phaseT) * phaseT;
      result.angleDeg = Math.round(targetAngle * Math.min(1, Math.max(0, eased)));
    } else {
      result.angleDeg = targetAngle;
    }
  } else if (topic.type === 'geometry_3d' || topic.type === 'vector' || topic.type === 'vector_3d') {
    const targetVx = currentParams.vx ?? 3;
    const targetVy = currentParams.vy ?? 4;
    const targetVz = currentParams.vz ?? 3;

    if (t < 0.2) {
      result.vx = 0.5;
      result.vy = 0.5;
      result.vz = 0.5;
    } else if (t < 0.65) {
      const phaseT = (t - 0.2) / 0.45;
      result.vx = Number((targetVx * phaseT).toFixed(1));
      result.vy = Number((targetVy * phaseT).toFixed(1));
      result.vz = Number((targetVz * phaseT).toFixed(1));
    } else {
      result.vx = targetVx;
      result.vy = targetVy;
      result.vz = targetVz;
    }
  } else if (topic.type === 'algebra' || topic.type === 'quadratic' || topic.type === 'equation') {
    const targetA = currentParams.a ?? 1;
    const targetB = currentParams.b ?? -5;
    const targetC = currentParams.c ?? 6;

    if (t < 0.2) {
      result.a = targetA;
      result.b = 0;
      result.c = 0;
    } else if (t < 0.65) {
      const phaseT = (t - 0.2) / 0.45;
      result.a = targetA;
      result.b = Number((targetB * phaseT).toFixed(1));
      result.c = Number((targetC * phaseT).toFixed(1));
    } else {
      result.a = targetA;
      result.b = targetB;
      result.c = targetC;
    }
  }

  return result;
}
