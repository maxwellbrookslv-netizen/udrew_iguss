import React, { useState, useRef, useEffect } from 'react';
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

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden border-0">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-blue-50 to-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg text-sm ${
              msg.isCorrect
                ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-md font-bold'
                : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
            }`}
          >
            <span className="font-bold text-xs uppercase tracking-widest">{msg.sender}:</span>
            <p className="mt-1">{msg.text}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {!isDrawingMode && (
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入你的猜测..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-bold"
          >
            <Send size={20} />
          </button>
        </form>
      )}
      {isDrawingMode && (
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 text-sm font-bold text-center">
          🎨 你正在画画，请查看上方题目
        </div>
      )}
    </div>
  );
};

export default Chat;
