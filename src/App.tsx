import { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import Chat from './components/Chat';
import { Trophy, Timer, User, LayoutGrid } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  isCorrect?: boolean;
}

interface Player {
  id: string;
  name: string;
  score: number;
  isDrawing: boolean;
}

const WORDS = ['苹果', '香蕉', '电脑', '自行车', '太阳', '月亮', '大象', '汉堡包', '雨伞', '书本'];

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: '我 (玩家1)', score: 0, isDrawing: true },
    { id: '2', name: '玩家2', score: 120, isDrawing: false },
    { id: '3', name: '玩家3', score: 85, isDrawing: false },
  ]);
  const [currentWord, setCurrentWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'round_end'>('playing');

  useEffect(() => {
    // 初始化游戏
    setCurrentWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = (text: string) => {
    const isCorrect = text === currentWord;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: '我 (玩家1)',
      text: isCorrect ? '猜对了！答案是：' + text : text,
      isCorrect,
    };
    
    setMessages((prev) => [...prev, newMessage]);

    if (isCorrect) {
      // 更新分数逻辑
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === '1' ? { ...p, score: p.score + 100 } : p
        )
      );
      // 可以在这里处理回合结束逻辑
    }
  };

  const isDrawingMode = players.find(p => p.id === '1')?.isDrawing || false;

  return (
    <div className="min-h-screen bg-blue-50 text-gray-900 font-sans p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-md border-b-4 border-blue-200">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-lg text-white">
            <LayoutGrid size={24} />
          </div>
          <h1 className="text-2xl font-black text-blue-600 tracking-tight">UDREW IGUSS</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center bg-gray-100 px-4 py-1 rounded-lg">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">倒计时</span>
            <div className="flex items-center gap-2 text-xl font-black text-blue-600">
              <Timer size={20} />
              <span>{timeLeft}s</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">当前题目</span>
            <div className="text-xl font-black text-orange-500">
              {isDrawingMode ? currentWord : '????'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 h-[600px]">
        
        {/* Players List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-4 overflow-y-auto border-b-4 border-gray-200">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
            <User size={16} /> 玩家列表
          </h3>
          <div className="space-y-3">
            {players.map((player) => (
              <div 
                key={player.id} 
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  player.isDrawing ? 'border-orange-400 bg-orange-50' : 'border-transparent bg-gray-50'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{player.name}</span>
                  <span className="text-xs text-gray-500 font-medium">得分: {player.score}</span>
                </div>
                {player.isDrawing && (
                  <div className="bg-orange-400 text-white p-1 rounded animate-pulse">
                    <Pencil size={14} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg relative border-b-4 border-gray-200 overflow-hidden">
          <Canvas isDrawingMode={isDrawingMode} />
        </div>

        {/* Chat/Guess Area */}
        <div className="lg:col-span-1 flex flex-col h-full overflow-hidden">
          <Chat 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isDrawingMode={isDrawingMode} 
          />
        </div>
      </main>

      {/* Footer / Controls */}
      <footer className="w-full max-w-6xl mt-6 flex justify-between items-center text-sm text-gray-400 font-medium">
        <div className="flex gap-4">
          <span>规则: 猜中得 100 分</span>
          <span>•</span>
          <span>正在开发中...</span>
        </div>
        <div className="flex items-center gap-2 text-blue-500 font-bold">
          <Trophy size={16} />
          <span>排行榜</span>
        </div>
      </footer>
    </div>
  );
}

// Helper icon for player list
const Pencil = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
    <path d="m15 5 4 4"/>
  </svg>
);

export default App;
