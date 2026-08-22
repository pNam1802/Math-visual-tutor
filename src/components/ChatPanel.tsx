import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  ArrowRight, 
  Calculator, 
  Compass, 
  TrendingUp, 
  Box, 
  CircleDot,
  History,
  Layers,
  Bot,
  User,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { TopicData, ChatMessage, VisualizationCard } from '../types';
import { KatexRenderer } from './KatexRenderer';

interface ChatPanelProps {
  topics: TopicData[];
  activeTopic: TopicData;
  onSelectTopic: (topic: TopicData) => void;
  cards: VisualizationCard[];
  activeCardId?: string;
  onSelectCard: (card: VisualizationCard) => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onRequestAnimation: () => void;
  isAnalyzing?: boolean;
  source?: 'gemini' | 'fallback';
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  topics,
  activeTopic,
  onSelectTopic,
  cards,
  activeCardId,
  onSelectCard,
  messages,
  onSendMessage,
  onRequestAnimation,
  isAnalyzing = false,
  source = 'gemini'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'cards' | 'topics'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat when messages change or isAnalyzing updates
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isAnalyzing, activeTab]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isAnalyzing) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const insertMathSymbol = (sym: string) => {
    setInputValue((prev) => prev + sym);
  };

  // Helper icons for suggested topics
  const getTopicIcon = (type: string) => {
    switch (type) {
      case 'quadratic':
      case 'algebra':
      case 'equation':
        return <Calculator className="w-4 h-4 text-orange-400" />;
      case 'trig_circle':
      case 'trigonometry':
        return <Compass className="w-4 h-4 text-emerald-400" />;
      case 'derivative':
      case 'calculus':
        return <TrendingUp className="w-4 h-4 text-amber-400" />;
      case 'vector_3d':
      case 'vector':
      case 'geometry_3d':
        return <Box className="w-4 h-4 text-sky-400" />;
      case 'circle_area':
      case 'geometry_2d':
        return <CircleDot className="w-4 h-4 text-orange-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-orange-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#121316] text-gray-100 border-r border-[#26282E] transition-colors">
      
      {/* Panel Top Header - MathVisual Brand */}
      <div className="p-4 sm:p-5 border-b border-[#26282E] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white mb-0.5">
            MathVisual<span className="text-[#F26207]">Tutor</span>
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-400 font-medium">
            Gia sư toán học trực quan 60 FPS
          </p>
        </div>

        {source === 'fallback' ? (
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/60 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Chế độ ngoại tuyến
          </span>
        ) : (
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Gemini Live
          </span>
        )}
      </div>

      {/* Navigation Sub-Tabs (Hội thoại / Thẻ mô phỏng / Gợi ý) */}
      <div className="px-4 pt-3 pb-1 border-b border-[#26282E] bg-white/5 flex gap-1">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-[#F26207] text-white shadow-xs'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Hội thoại ({messages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cards')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'cards'
              ? 'bg-[#F26207] text-white shadow-xs'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Thẻ đã tạo ({cards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('topics')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'topics'
              ? 'bg-[#F26207] text-white shadow-xs'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Chủ đề</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        
        {/* TAB 1: LIVE CHAT MESSAGES */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            
            {/* Quick Cards Banner if cards exist */}
            {cards.length > 0 && (
              <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-orange-300">
                  <Layers className="w-3.5 h-3.5 text-[#F26207]" />
                  <span>Đã lưu <strong>{cards.length}</strong> thẻ mô phỏng trong lịch sử</span>
                </div>
                <button
                  onClick={() => setActiveTab('cards')}
                  className="text-[11px] text-[#F26207] hover:underline font-semibold cursor-pointer"
                >
                  Xem thẻ &rarr;
                </button>
              </div>
            )}

            {/* Message bubbles */}
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 text-sm ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-[#F26207] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 shadow-xs text-sm sm:text-[15px] leading-relaxed ${
                      isUser
                        ? 'bg-[#F26207] text-white rounded-br-xs'
                        : msg.isNonMathWarning
                        ? 'bg-amber-950/40 text-amber-200 rounded-bl-xs border border-amber-500/30'
                        : 'bg-white/5 text-gray-200 rounded-bl-xs border border-white/10'
                    }`}
                  >
                    {msg.isNonMathWarning && (
                      <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1.5 text-sm sm:text-[15px]">
                        <AlertCircle className="w-4 h-4" />
                        <span>Chưa nhận diện câu hỏi toán học</span>
                      </div>
                    )}

                    <p className="whitespace-pre-line">{msg.text}</p>

                    {msg.latex && (
                      <div className="mt-2 p-2.5 rounded-xl bg-black/50 border border-white/10 overflow-x-auto text-orange-300 select-all text-sm">
                        <KatexRenderer latex={msg.latex} />
                      </div>
                    )}

                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-500">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <span className="text-[#F26207] font-medium font-mono">MathVisual Engine</span>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-lg bg-white/10 text-gray-300 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Analyzing Indicator */}
            {isAnalyzing && (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-gray-300 text-xs animate-pulse">
                <Loader2 className="w-4 h-4 text-[#F26207] animate-spin" />
                <span>Gemini đang phân tích biểu thức toán học và thiết lập slider...</span>
              </div>
            )}

            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />

          </div>
        )}

        {/* TAB 2: SAVED VISUALIZATION CARDS */}
        {activeTab === 'cards' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-gray-400 uppercase font-mono">
                Lịch sử thẻ mô phỏng
              </span>
              <span className="text-[11px] text-gray-500 font-mono">
                {cards.length} thẻ đã lưu
              </span>
            </div>

            {cards.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-xs space-y-2">
                <Layers className="w-8 h-8 mx-auto text-gray-600 opacity-60" />
                <p>Chưa có thẻ mô phỏng nào được tạo.</p>
                <p className="text-gray-600">Hãy gửi một câu hỏi toán học để tạo thẻ mới!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {cards.map((card) => {
                  const isSelected = card.id === activeCardId;
                  return (
                    <button
                      key={card.id}
                      onClick={() => onSelectCard(card)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all text-sm flex flex-col gap-2 cursor-pointer ${
                        isSelected
                          ? 'border-[#F26207] bg-[#F26207]/15 text-white ring-1 ring-[#F26207]'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#F26207] bg-[#F26207]/20 px-2 py-0.5 rounded">
                          {card.data.topic}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {card.timestamp}
                        </span>
                      </div>

                      <div className="font-semibold text-sm sm:text-base text-white">
                        {card.data.title || card.query}
                      </div>

                      <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-xs sm:text-sm text-orange-300 overflow-x-auto">
                        <KatexRenderer latex={card.data.latex} />
                      </div>

                      <div className="flex items-center justify-between text-xs sm:text-[13px] text-gray-400">
                        <span>{card.data.steps.length} bước giải trực quan</span>
                        <span className="text-[#F26207] font-medium">
                          {isSelected ? 'Đang hiển thị' : 'Mở thẻ →'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SUGGESTED TOPICS */}
        {activeTab === 'topics' && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase px-1 font-mono">
              Kho chủ đề mẫu
            </p>

            <div className="space-y-2">
              {topics.map((t) => {
                const isActive = t.id === activeTopic.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTopic(t);
                      setActiveTab('chat');
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-sm leading-relaxed flex items-start gap-3 group relative cursor-pointer ${
                      isActive
                        ? 'border-[#F26207] bg-[#F26207]/10 text-white shadow-md shadow-orange-950/40 ring-1 ring-[#F26207]'
                        : 'border-white/5 bg-white/5 hover:bg-white/10 text-gray-200'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isActive 
                        ? 'bg-[#F26207] text-white shadow-xs' 
                        : 'bg-white/5 text-gray-400 group-hover:bg-[#F26207]/20 group-hover:text-orange-300'
                    }`}>
                      {getTopicIcon(t.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono uppercase font-semibold text-[#F26207]">
                          {t.category}
                        </span>
                        {isActive && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-[#F59E0B] font-medium">
                            Đang chọn
                          </span>
                        )}
                      </div>
                      <p className="font-normal text-sm sm:text-[15px] text-gray-200 group-hover:text-white transition-colors">
                        {t.prompt}{' '}
                        <code className="font-mono text-orange-400 font-semibold ml-1 text-xs sm:text-sm">
                          {t.formulaSummary}
                        </code>
                      </p>
                    </div>

                    <ArrowRight className={`w-4 h-4 shrink-0 self-center transition-transform ${
                      isActive ? 'text-[#F26207] translate-x-0.5' : 'text-gray-600 group-hover:text-[#F26207] group-hover:translate-x-1'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Math Symbols Toolbar & Question Input Form */}
      <div className="p-4 sm:p-5 bg-[#121316] border-t border-[#26282E] space-y-3">
        
        {/* Quick math symbol insert bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[10px] text-gray-500 uppercase font-mono shrink-0 mr-1">Ký hiệu:</span>
          {['x²', '√x', 'π', 'θ', 'Δ', '∫', 'd/dx', '±', '≤', '≥', '∞'].map((symbol) => (
            <button
              key={symbol}
              type="button"
              onClick={() => insertMathSymbol(symbol)}
              className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-gray-300 hover:border-orange-400 hover:text-orange-400 hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            >
              {symbol}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <form onSubmit={handleFormSubmit} className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isAnalyzing ? "Gemini đang xử lý..." : "Hỏi về phương trình, đạo hàm, vector, hình học..."}
            disabled={isAnalyzing}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-4 pr-12 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F26207]/50 transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isAnalyzing}
            className="absolute right-2 top-2 h-9 w-9 bg-[#F26207] hover:bg-[#D95300] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-700/20 transition-all cursor-pointer disabled:opacity-40 disabled:hover:bg-[#F26207]"
            title="Gửi câu hỏi"
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>

      </div>

    </div>
  );
};
