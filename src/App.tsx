import React, { useState, useEffect, useCallback } from 'react';
import { SUGGESTED_TOPICS } from './data/mockData';
import { 
  TopicData, 
  ChatMessage, 
  ThemeMode, 
  AppStateMode, 
  GeminiMathResponse, 
  VisualizationCard, 
  ParameterSlider, 
  ExplanationStep 
} from './types';
import { LandingPage } from './components/landing/LandingPage';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import { VisualizationPanel } from './components/VisualizationPanel';
import { ExplanationPanel } from './components/ExplanationPanel';
import { AnimationModal } from './components/AnimationModal';
import { FullscreenVisualModal } from './components/FullscreenVisualModal';
import { SkeletonLoader } from './components/SkeletonLoader';
import { ErrorStateCard } from './components/ErrorStateCard';
import { MessageSquare, LayoutTemplate } from 'lucide-react';

// Helper to convert Gemini response to TopicData structure
function createTopicFromGeminiResponse(
  data: GeminiMathResponse, 
  query: string
): TopicData {
  const sliders: ParameterSlider[] = Object.keys(data.params || {}).map((key) => {
    const range = data.param_ranges?.[key] || { min: -10, max: 10, step: 1 };
    return {
      id: key,
      name: range.name || key,
      symbol: range.symbol || key,
      min: range.min,
      max: range.max,
      step: range.step,
      defaultValue: data.params[key],
      unit: range.unit || ''
    };
  });

  const steps: ExplanationStep[] = (data.steps || []).map((s, idx) => ({
    id: idx + 1,
    title: s.title,
    summary: s.explanation ? s.explanation.slice(0, 80) + '...' : '',
    detail: s.explanation,
    explanation: s.explanation,
    formula: s.formula || '',
    visualHighlight: s.visualHighlight,
    keyTakeaway: s.keyTakeaway
  }));

  const topicId = `gemini-${data.topic}-${Date.now()}`;

  return {
    id: topicId,
    title: data.title || data.concept || 'Mô phỏng Toán học',
    category: data.topic.toUpperCase(),
    prompt: query,
    initialMessage: data.summary || `Phân tích mô phỏng cho: ${data.concept}`,
    formulaSummary: data.latex || '',
    params: sliders,
    steps,
    type: data.topic,
    concept: data.concept,
    defaultValues: { ...data.params },
    renderInfo: {
      domainX: [-10, 10],
      domainY: [-10, 10],
      title: data.title || data.concept || 'Mô phỏng Toán học Trực quan',
      description: data.summary || 'Tương tác thay đổi tham số để quan sát trực tiếp'
    }
  };
}

export default function App() {
  // Current active view: 'landing' | 'app'
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');

  // Theme state
  const [theme, setTheme] = useState<ThemeMode>('dark');
  
  // UI state modes: 'normal' | 'loading' | 'error'
  const [stateMode, setStateMode] = useState<AppStateMode>('normal');

  // Active topic
  const [activeTopic, setActiveTopic] = useState<TopicData>(SUGGESTED_TOPICS[0]);

  // Current parameter values for interactive visualization
  const [paramValues, setParamValues] = useState<Record<string, number>>(
    SUGGESTED_TOPICS[0].defaultValues
  );

  // Visualization Cards History
  const [cards, setCards] = useState<VisualizationCard[]>([]);
  const [activeCardId, setActiveCardId] = useState<string | undefined>(undefined);

  // Gemini loading state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Chat message thread
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      timestamp: '21:20',
      text: SUGGESTED_TOPICS[0].initialMessage,
      latex: SUGGESTED_TOPICS[0].formulaSummary,
      topicId: SUGGESTED_TOPICS[0].id,
      isInitial: true
    }
  ]);

  // Modals & In-place Animation Trigger
  const [isAnimationModalOpen, setIsAnimationModalOpen] = useState<boolean>(false);
  const [isFullscreenVisualOpen, setIsFullscreenVisualOpen] = useState<boolean>(false);
  const [animationTrigger, setAnimationTrigger] = useState<number>(0);

  const handleTriggerInPlaceAnimation = () => {
    setAnimationTrigger((prev) => prev + 1);
    setMobileTab('visual');
  };

  // Mobile active view tab ('visual' | 'chat')
  const [mobileTab, setMobileTab] = useState<'visual' | 'chat'>('visual');

  // Handle Dark / Light mode toggle
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Change topic handler (preset topics)
  const handleSelectTopic = (topic: TopicData) => {
    setActiveTopic(topic);
    setParamValues(topic.defaultValues);
    setActiveCardId(undefined);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-user`,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: topic.prompt
      },
      {
        id: `msg-${Date.now()}-bot`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: topic.initialMessage,
        latex: topic.formulaSummary,
        topicId: topic.id
      }
    ]);
  };

  // Handle selecting a saved card from history
  const handleSelectCard = (card: VisualizationCard) => {
    setActiveCardId(card.id);
    const reconstructedTopic = createTopicFromGeminiResponse(card.data, card.query);
    setActiveTopic(reconstructedTopic);
    setParamValues(card.currentParams || card.data.params);
  };

  // Handle opening app directly with a selected topic from Landing Page
  const handleSelectTopicAndOpenApp = (topic: TopicData) => {
    handleSelectTopic(topic);
    setCurrentView('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Real-time parameter slider change handler (purely client-side, no API call!)
  const handleParamChange = useCallback((paramId: string, value: number) => {
    setParamValues((prev) => {
      const next = { ...prev, [paramId]: value };
      // Sync current params into active card if present
      if (activeCardId) {
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.id === activeCardId ? { ...c, currentParams: next } : c
          )
        );
      }
      return next;
    });
  }, [activeCardId]);

  // Reset parameters to active topic defaults
  const handleResetTopic = () => {
    setParamValues(activeTopic.defaultValues);
  };

  // Main Gemini Structured Math Analysis Execution
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/math/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP status ${response.status}`);
      }

      const geminiResult: GeminiMathResponse = await response.json();

      if (!geminiResult.is_math_question) {
        // Handle non-math question gracefully without altering visualization canvas
        const nonMathMsg: ChatMessage = {
          id: `msg-${Date.now()}-ai-warning`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Câu hỏi của bạn dường như chưa chứa nội dung hoặc bài toán có thể mô phỏng hình học.\n\nBạn có thể hỏi về các chủ đề như:\n• Khảo sát hàm số & nghiệm phương trình bậc 2 f(x) = ax² + bx + c\n• Đường tròn lượng giác & giá trị sin, cos, tan\n• Bản chất hình học của đạo hàm và đường tiếp tuyến\n• Không gian vector 3 chiều Oxyz và phép chiếu\n• Chứng minh diện tích hình tròn S = πr² bằng phân rã nan quạt`,
          isNonMathWarning: true
        };
        setMessages((prev) => [...prev, nonMathMsg]);
      } else {
        // Valid Math Question: Create Card and Update Visualizer
        const newCardId = `card-${Date.now()}`;
        const newCard: VisualizationCard = {
          id: newCardId,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          query: text,
          data: geminiResult,
          currentParams: { ...geminiResult.params }
        };

        const newTopic = createTopicFromGeminiResponse(geminiResult, text);

        setCards((prev) => [newCard, ...prev]);
        setActiveCardId(newCardId);
        setActiveTopic(newTopic);
        setParamValues({ ...geminiResult.params });

        const aiMsg: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: geminiResult.summary || `Đã phân tích và tạo mô phỏng trực quan cho chủ đề "${geminiResult.title || text}". Bạn có thể kéo các thanh trượt bên phải để quan sát các thông số biến đổi theo thời gian thực.`,
          latex: geminiResult.latex,
          topicId: newTopic.id,
          cardId: newCardId
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err: any) {
      console.error('Failed to analyze math question:', err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Có lỗi xảy ra khi kết nối máy chủ phân tích toán học. Vui lòng thử lại câu hỏi của bạn.`,
        isNonMathWarning: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Ask question directly from Landing hero search and jump to app
  const handleAskQuestionAndOpenApp = (question: string) => {
    setCurrentView('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    handleSendMessage(question);
  };

  // Render Landing Page View
  if (currentView === 'landing') {
    return (
      <LandingPage
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenApp={() => {
          setCurrentView('app');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectTopicAndOpenApp={handleSelectTopicAndOpenApp}
        onAskQuestionAndOpenApp={handleAskQuestionAndOpenApp}
      />
    );
  }

  // Render App Dashboard View
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#121316] text-[#1C1B1A] dark:text-slate-100 font-sans transition-colors">
      
      {/* Top Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        stateMode={stateMode}
        onSelectStateMode={setStateMode}
        activeTopicTitle={activeTopic.title}
        onResetTopic={handleResetTopic}
        onGoToLanding={() => {
          setCurrentView('landing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Mobile Tab Switcher (Visible only on mobile / small screens) */}
      <div className="lg:hidden px-4 pt-3 pb-1 border-b border-[#EAE4D9] dark:border-white/10 bg-[#FAF7F2]/90 dark:bg-[#121316]/90 backdrop-blur-sm sticky top-16 z-20">
        <div className="grid grid-cols-2 p-1 rounded-xl bg-white dark:bg-white/5 border border-[#EAE4D9] dark:border-white/10 text-xs">
          <button
            onClick={() => setMobileTab('visual')}
            className={`py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              mobileTab === 'visual'
                ? 'bg-[#FAF7F2] dark:bg-white/10 text-[#F26207] shadow-xs font-semibold'
                : 'text-[#625F59] dark:text-slate-400'
            }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Mô phỏng & Giải thích</span>
          </button>
          
          <button
            onClick={() => setMobileTab('chat')}
            className={`py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              mobileTab === 'chat'
                ? 'bg-[#FAF7F2] dark:bg-white/10 text-[#F26207] shadow-xs font-semibold'
                : 'text-[#625F59] dark:text-slate-400'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Hội thoại AI ({messages.length})</span>
            {cards.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#F26207] text-white">
                {cards.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main App Body */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6">
        
        {/* State: ERROR STATE PREVIEW */}
        {stateMode === 'error' ? (
          <div className="py-8">
            <ErrorStateCard
              onRetry={() => setStateMode('normal')}
              onResetToDefaults={() => {
                handleResetTopic();
                setStateMode('normal');
              }}
            />
          </div>
        ) : stateMode === 'loading' ? (
          /* State: LOADING SKELETON PREVIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            <div className="hidden lg:block lg:col-span-5 h-[720px] bg-[#121316] text-gray-100 rounded-2xl border border-[#26282E] p-6 space-y-4 animate-shimmer overflow-hidden">
              <div className="h-6 w-48 bg-white/10 rounded"></div>
              <div className="h-14 bg-white/5 rounded-xl"></div>
              <div className="h-14 bg-white/5 rounded-xl"></div>
              <div className="h-14 bg-white/5 rounded-xl"></div>
            </div>
            <div className="lg:col-span-7">
              <SkeletonLoader />
            </div>
          </div>
        ) : (
          /* State: NORMAL 2-COLUMN GEOMETRIC BALANCE LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT ASIDE: 38-40% - Dark Chat, Topic Suggestions, & Saved Cards */}
            <aside className={`lg:col-span-5 xl:col-span-5 ${mobileTab === 'chat' ? 'block' : 'hidden lg:block'}`}>
              <div className="rounded-2xl border border-[#26282E] shadow-xl overflow-hidden h-[calc(100vh-7rem)] min-h-[600px] max-h-[860px] sticky top-20 bg-[#121316] text-gray-100">
                <ChatPanel
                  topics={SUGGESTED_TOPICS}
                  activeTopic={activeTopic}
                  onSelectTopic={handleSelectTopic}
                  cards={cards}
                  activeCardId={activeCardId}
                  onSelectCard={handleSelectCard}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onRequestAnimation={handleTriggerInPlaceAnimation}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            </aside>

            {/* RIGHT MAIN CANVAS: 60-62% - Light/Crisp Visual Stage & Step-by-Step */}
            <section className={`lg:col-span-7 xl:col-span-7 space-y-6 ${mobileTab === 'visual' ? 'block' : 'hidden lg:block'}`}>
              
              {/* 1. Geometric Visual Canvas & Realtime Parameter Panel */}
              <VisualizationPanel
                topic={activeTopic}
                paramValues={paramValues}
                onParamChange={handleParamChange}
                onOpenFullscreen={() => setIsFullscreenVisualOpen(true)}
                onRequestAnimation={handleTriggerInPlaceAnimation}
                animationTrigger={animationTrigger}
              />

              {/* 2. Step-by-Step Mathematical Explanation */}
              <ExplanationPanel
                topic={activeTopic}
                onRequestAnimation={handleTriggerInPlaceAnimation}
              />

            </section>

          </div>
        )}

      </main>

      {/* 3Blue1Brown Manim Animation Preview Modal */}
      <AnimationModal
        isOpen={isAnimationModalOpen}
        onClose={() => setIsAnimationModalOpen(false)}
        topic={activeTopic}
      />

      {/* Fullscreen Interactive Visualizer Modal */}
      <FullscreenVisualModal
        isOpen={isFullscreenVisualOpen}
        onClose={() => setIsFullscreenVisualOpen(false)}
        topic={activeTopic}
        paramValues={paramValues}
        onParamChange={handleParamChange}
      />

    </div>
  );
}
