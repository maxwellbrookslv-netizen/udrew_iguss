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
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg text-sm ${
              msg.isCorrect
                ? 'bg-green-100 text-green-800 border border-green-200 font-bold'
                : 'bg-gray-50 text-gray-700'
            }`}
          >
            <span className="font-bold mr-2">{msg.sender}:</span>
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {!isDrawingMode && (
        <form onSubmit={handleSubmit} className="p-3 border-t bg-gray-50 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入你的猜测..."
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      )}
      {isDrawingMode && (
        <div className="p-3 border-t bg-blue-50 text-blue-800 text-sm font-medium text-center">
          你正在画画，请查看上方题目
        </div>
      )}
    </div>
  );
};

export default Chat;
