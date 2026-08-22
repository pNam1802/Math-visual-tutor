export type ThemeMode = 'dark' | 'light';

export type AppStateMode = 'normal' | 'loading' | 'error';

export type MathTopicCategory = 
  | 'geometry_2d'
  | 'geometry_3d'
  | 'algebra'
  | 'trigonometry'
  | 'vector'
  | 'calculus'
  | 'equation';

export interface ParameterSlider {
  id: string;
  name: string;
  symbol: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
  description?: string;
}

export interface ExplanationStep {
  id: number;
  title: string;
  summary?: string;
  formula?: string;
  explanation?: string;
  detail?: string;
  visualHighlight?: string;
  keyTakeaway?: string;
}

export interface MathParamRange {
  min: number;
  max: number;
  step: number;
  name?: string;
  unit?: string;
  symbol?: string;
}

export interface MathStep {
  title: string;
  explanation: string;
  formula?: string;
  visualHighlight?: string;
  keyTakeaway?: string;
}

export interface GeminiMathResponse {
  is_math_question: boolean;
  topic: MathTopicCategory;
  concept: string;
  title?: string;
  summary?: string;
  params: Record<string, number>;
  param_ranges: Record<string, MathParamRange>;
  latex: string;
  steps: MathStep[];
}

export interface VisualizationCard {
  id: string;
  timestamp: string;
  query: string;
  data: GeminiMathResponse;
  currentParams: Record<string, number>;
}

export interface TopicData {
  id: string;
  title: string;
  category: string;
  prompt: string;
  initialMessage: string;
  formulaSummary: string;
  params: ParameterSlider[];
  steps: ExplanationStep[];
  type: MathTopicCategory | 'quadratic' | 'trig_circle' | 'derivative' | 'vector_3d' | 'circle_area';
  concept?: string;
  defaultValues: Record<string, number>;
  renderInfo: {
    domainX: [number, number];
    domainY: [number, number];
    title: string;
    description: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  latex?: string;
  topicId?: string;
  cardId?: string;
  isInitial?: boolean;
  isNonMathWarning?: boolean;
}

export type TimelinePhase = 'intro' | 'build-up' | 'highlight' | 'conclusion';

export interface TimelineScriptStep {
  phase: TimelinePhase;
  title: string;
  narration: string;
  formula?: string;
  keyHighlight?: string;
  startPct: number; // 0 to 100
  endPct: number;   // 0 to 100
  targetParams?: Record<string, number>;
}

export interface AnimationTimelineState {
  isPlaying: boolean;
  progress: number; // 0 to 100
  currentTime: number;
  duration: number; // in seconds
  speed: number;
  phase: TimelinePhase;
  currentStepIndex: number;
  activeScriptStep: TimelineScriptStep;
  interpolatedParams: Record<string, number>;
}

