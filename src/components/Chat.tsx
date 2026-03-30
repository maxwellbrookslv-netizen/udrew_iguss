import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  isCorrect?: boolean;
}

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isDrawingMode: boolean;
}

const Chat: React.FC<ChatProps> = ({ messages, onSendMessage, isDrawingMode }) => {
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  }, [inputValue, onSendMessage]);

  return (
    <div className="fairy-panel flex h-full flex-col overflow-hidden rounded-[30px] border border-[#efd6ba] bg-[linear-gradient(180deg,rgba(255,252,247,0.94),rgba(255,242,233,0.92))] shadow-[0_24px_50px_rgba(150,99,71,0.12)]">
      <div className="border-b border-[#efdcc5] bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(255,241,229,0.72))] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-[0.28em] text-[#b77554]">猜题对话</div>
            <div className="mt-1 text-sm font-bold text-[#8f6345]">把你的答案投进树屋信箱</div>
          </div>
          <div className="rounded-full bg-white/80 px-3 py-2 text-[11px] font-extrabold text-[#cc8560] shadow-sm">
            {messages.length} 条消息
          </div>
        </div>
      </div>

      <div className="fairy-scroll flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,249,241,0.72),rgba(255,255,255,0.4))] px-4 py-4">
        {messages.length === 0 && (
          <div className="mb-4 rounded-[24px] border border-dashed border-[#efcfaa] bg-white/65 px-4 py-5 text-sm font-bold leading-7 text-[#a27559] shadow-sm">
            还没有人发言。现在的聊天区会像童话便签一样显示每条猜测，答对时会自动高亮。
          </div>
        )}

        <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-[22px] border px-4 py-3 text-sm shadow-sm ${
              msg.isCorrect
                ? 'border-[#e8b55c] bg-[linear-gradient(135deg,#f6ca71,#ef8f77)] text-white'
                : 'border-[#f0dfcf] bg-white/85 text-[#6f4730]'
            }`}
          >
            <span className={`text-[11px] font-extrabold uppercase tracking-[0.24em] ${msg.isCorrect ? 'text-white/90' : 'text-[#bb7d5d]'}`}>
              {msg.sender}
            </span>
            <p className="mt-2 font-bold leading-6">{msg.text}</p>
          </div>
        ))}
        </div>
        <div ref={chatEndRef} />
      </div>

      {!isDrawingMode && (
        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-[#efdcc5] bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,240,230,0.86))] p-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入你的猜测..."
            className="flex-1 rounded-[18px] border border-[#eccfb3] bg-white/85 px-4 py-3 text-[#6f4730] shadow-sm outline-none transition-all placeholder:text-[#c89a77] focus:border-[#e39c7b] focus:ring-2 focus:ring-[#f8d0bd]"
          />
          <button
            type="submit"
            className="rounded-[18px] border border-[#efc590] bg-[linear-gradient(135deg,#f2be68,#ee8d74)] px-4 text-white shadow-[0_14px_28px_rgba(214,130,87,0.26)] transition-transform hover:-translate-y-0.5"
          >
            <Send size={20} />
          </button>
        </form>
      )}
      {isDrawingMode && (
        <div className="border-t border-[#efdcc5] bg-[linear-gradient(135deg,rgba(255,247,228,0.9),rgba(255,231,218,0.95))] p-4 text-center text-sm font-black text-[#b77554]">
          你正在作画，本回合请把谜底藏进线条和颜色里。
        </div>
      )}
    </div>
  );
};

export default Chat;
