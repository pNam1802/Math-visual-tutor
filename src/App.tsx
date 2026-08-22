import React, { useState, useEffect, useCallback } from 'react';
import { SUGGESTED_TOPICS } from './data/mockData';
import { 
  TopicData, 
  ChatMessage, 
  ThemeMode, 
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
import { FullscreenVisualModal } from './components/FullscreenVisualModal';
import { SkeletonLoader } from './components/SkeletonLoader';
import { ErrorStateCard } from './components/ErrorStateCard';
import { MessageSquare, LayoutTemplate } from 'lucide-react';

// Helper to convert Gemini response to TopicData structure
function createTopicFromGeminiResponse(
  data: GeminiMathResponse, 
  query: string
): TopicData {
  const defaultValues: Record<string, number> = {};
  const sliders: ParameterSlider[] = (data.parameters || []).map((p) => {
    defaultValues[p.key] = p.value;
    return {
      id: p.key,
      name: p.name || p.key,
      symbol: p.key,
      min: p.min,
      max: p.max,
      step: p.step,
      defaultValue: p.value,
      unit: p.unit || ''
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
    defaultValues,
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

  // Theme state with localStorage persistence
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem('mathvisual:theme');
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    } catch (e) {
      console.warn('Cannot read theme from localStorage:', e);
    }
    return 'dark';
  });

  // Visualization Cards History with localStorage persistence
  const [cards, setCards] = useState<VisualizationCard[]>(() => {
    try {
      const savedCards = localStorage.getItem('mathvisual:cards');
      if (savedCards) {
        const parsed = JSON.parse(savedCards);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Cannot read cards from localStorage:', e);
    }
    return [];
  });

  // Active Card ID with localStorage persistence
  const [activeCardId, setActiveCardId] = useState<string | undefined>(() => {
    try {
      const savedActiveCardId = localStorage.getItem('mathvisual:activeCardId');
      if (savedActiveCardId && savedActiveCardId !== 'undefined') {
        return JSON.parse(savedActiveCardId);
      }
    } catch (e) {
      console.warn('Cannot read activeCardId from localStorage:', e);
    }
    return undefined;
  });

  // Active topic (restored from active card if present, otherwise default)
  const [activeTopic, setActiveTopic] = useState<TopicData>(() => {
    try {
      const savedActiveCardId = localStorage.getItem('mathvisual:activeCardId');
      const savedCards = localStorage.getItem('mathvisual:cards');
      if (savedActiveCardId && savedCards) {
        const cardId = JSON.parse(savedActiveCardId);
        const parsedCards: VisualizationCard[] = JSON.parse(savedCards);
        const matched = parsedCards.find((c) => c.id === cardId);
        if (matched?.data) {
          return createTopicFromGeminiResponse(matched.data, matched.query);
        }
      }
    } catch (e) {
      console.warn('Cannot restore activeTopic from localStorage:', e);
    }
    return SUGGESTED_TOPICS[0];
  });

  // Current parameter values for interactive visualization
  const [paramValues, setParamValues] = useState<Record<string, number>>(() => {
    try {
      const savedActiveCardId = localStorage.getItem('mathvisual:activeCardId');
      const savedCards = localStorage.getItem('mathvisual:cards');
      if (savedActiveCardId && savedCards) {
        const cardId = JSON.parse(savedActiveCardId);
        const parsedCards: VisualizationCard[] = JSON.parse(savedCards);
        const matched = parsedCards.find((c) => c.id === cardId);
        if (matched) {
          return matched.currentParams || createTopicFromGeminiResponse(matched.data, matched.query).defaultValues;
        }
      }
    } catch (e) {
      console.warn('Cannot restore paramValues from localStorage:', e);
    }
    return SUGGESTED_TOPICS[0].defaultValues;
  });

  // Gemini loading state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [apiSource, setApiSource] = useState<'gemini' | 'fallback'>('gemini');

  // Chat message thread with localStorage persistence
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const defaultMessages: ChatMessage[] = [
      {
        id: 'msg-1',
        sender: 'assistant',
        timestamp: '21:20',
        text: SUGGESTED_TOPICS[0].initialMessage,
        latex: SUGGESTED_TOPICS[0].formulaSummary,
        topicId: SUGGESTED_TOPICS[0].id,
        isInitial: true
      }
    ];

    try {
      const savedMessages = localStorage.getItem('mathvisual:messages');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Cannot read messages from localStorage:', e);
    }
    return defaultMessages;
  });

  // Modals & In-place Animation Trigger
  const [isFullscreenVisualOpen, setIsFullscreenVisualOpen] = useState<boolean>(false);
  const [animationTrigger, setAnimationTrigger] = useState<number>(0);

  const handleTriggerInPlaceAnimation = () => {
    setAnimationTrigger((prev) => prev + 1);
    setMobileTab('visual');
  };

  // Mobile active view tab ('visual' | 'chat')
  const [mobileTab, setMobileTab] = useState<'visual' | 'chat'>('visual');

  // Persist theme to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mathvisual:theme', theme);
    } catch (e) {
      console.warn('Cannot save theme to localStorage:', e);
    }
  }, [theme]);

  // Persist cards to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mathvisual:cards', JSON.stringify(cards));
    } catch (e) {
      console.warn('Cannot save cards to localStorage:', e);
    }
  }, [cards]);

  // Persist activeCardId to localStorage
  useEffect(() => {
    try {
      if (activeCardId !== undefined) {
        localStorage.setItem('mathvisual:activeCardId', JSON.stringify(activeCardId));
      } else {
        localStorage.removeItem('mathvisual:activeCardId');
      }
    } catch (e) {
      console.warn('Cannot save activeCardId to localStorage:', e);
    }
  }, [activeCardId]);

  // Persist messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mathvisual:messages', JSON.stringify(messages));
    } catch (e) {
      console.warn('Cannot save messages to localStorage:', e);
    }
  }, [messages]);

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
    setParamValues(card.currentParams || reconstructedTopic.defaultValues);
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
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Máy chủ phản hồi mã lỗi HTTP ${response.status}`);
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
      } else if (geminiResult.supported === false) {
        // Handle unsupported mathematical concept gracefully without altering visualizer canvas or creating cards
        const unsupportedMsg: ChatMessage = {
          id: `msg-${Date.now()}-ai-unsupported`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Chủ đề toán học "${geminiResult.title || text}" hiện chưa có mô hình mô phỏng tương tác chuyên biệt trên hệ thống.\n\nHiện tại MathVisual Tutor hỗ trợ 5 mô hình mô phỏng chuyên sâu sau:\n1. Phương trình & Hàm số bậc hai (Parabol: hệ số a, b, c)\n2. Vòng tròn đơn vị & Lượng giác (Góc quay lượng giác θ, sin/cos)\n3. Bản chất hình học của Đạo hàm & Tiếp tuyến (Điểm xét x₀, bước nhảy Δx)\n4. Không gian Vector 3 chiều (Toạ độ vx, vy, vz trong Oxyz)\n5. Phân rã chứng minh diện tích hình tròn S = πr² (Bán kính R, số nan quạt n)\n\nBạn có thể thử đặt câu hỏi về một trong 5 chủ đề trên để trải nghiệm mô phỏng trực quan!`,
          isNonMathWarning: true
        };
        setMessages((prev) => [...prev, unsupportedMsg]);
      } else {
        // Valid Math Question: Create Card and Update Visualizer
        const defaultValues: Record<string, number> = {};
        (geminiResult.parameters || []).forEach((p) => {
          defaultValues[p.key] = p.value;
        });

        const newCardId = `card-${Date.now()}`;
        const newCard: VisualizationCard = {
          id: newCardId,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          query: text,
          data: geminiResult,
          currentParams: defaultValues
        };

        const newTopic = createTopicFromGeminiResponse(geminiResult, text);

        setCards((prev) => [newCard, ...prev]);
        setActiveCardId(newCardId);
        setActiveTopic(newTopic);
        setParamValues(defaultValues);
        if (geminiResult.source) {
          setApiSource(geminiResult.source);
        }

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
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F26207] text-white">
                {cards.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main App Body */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6">
        
        {/* NORMAL 2-COLUMN GEOMETRIC BALANCE LAYOUT */}
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
                source={apiSource}
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
              isAnalyzing={isAnalyzing}
            />

            {/* 2. Step-by-Step Mathematical Explanation */}
            <ExplanationPanel
              topic={activeTopic}
              onRequestAnimation={handleTriggerInPlaceAnimation}
            />

          </section>

        </div>

      </main>

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
