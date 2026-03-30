import { useState, useEffect, useCallback } from 'react';
import Canvas from './components/Canvas';
import Chat from './components/Chat';
import { Trophy, Timer, User, LayoutGrid, Sparkles, Pencil } from 'lucide-react';

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
  const [roundEnd, setRoundEnd] = useState(false);

  const startNewRound = useCallback(() => {
    setCurrentWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setTimeLeft(60);
    setMessages([]);
    setRoundEnd(false);
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setRoundEnd(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = useCallback((text: string) => {
    const isCorrect = text === currentWord;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: '我 (玩家1)',
      text: isCorrect ? '🎉 猜对了！答案是：' + text : text,
      isCorrect,
    };
    
    setMessages((prev) => [...prev, newMessage]);

    if (isCorrect) {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === '1' ? { ...p, score: p.score + 100 } : p
        )
      );
      setTimeout(() => {
        setRoundEnd(true);
      }, 1500);
    }
  }, [currentWord]);

  const isDrawingMode = players.find(p => p.id === '1')?.isDrawing || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 text-gray-900 font-sans p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl shadow-lg border-0 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg text-white backdrop-blur-sm">
            <LayoutGrid size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">UDREW IGUSS <Sparkles size={28} /></h1>
            <p className="text-xs text-blue-100 mt-1">协作绘画猜题游戏</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={`flex flex-col items-center px-4 py-2 rounded-xl backdrop-blur-sm transition-all ${
            timeLeft <= 10 ? 'bg-red-500 bg-opacity-20' : 'bg-white bg-opacity-10'
          }`}>
            <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">倒计时</span>
            <div className={`flex items-center gap-2 text-2xl font-black transition-colors ${
              timeLeft <= 10 ? 'text-red-300' : 'text-white'
            }`}>
              <Timer size={20} />
              <span>{timeLeft}s</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">当前题目</span>
            <div className="text-2xl font-black text-yellow-300 bg-white bg-opacity-10 px-4 py-1 rounded-lg backdrop-blur-sm">
              {isDrawingMode ? currentWord : '????'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 h-[600px] mb-6">
        
        {/* Players List */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-5 overflow-y-auto border-0 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-gray-600 uppercase mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
            <User size={16} /> 玩家列表
          </h3>
          <div className="space-y-3">
            {players.map((player, index) => (
              <div 
                key={player.id} 
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  player.isDrawing ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-amber-50 shadow-md' : 'border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-800">#{index + 1}</span>
                    <span className="font-bold text-sm text-gray-700">{player.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-semibold mt-1">🏆 {player.score} 分</span>
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
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg relative border-0 overflow-hidden">
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

      {/* Round End Modal */}
      {roundEnd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md">
            <h2 className="text-2xl font-black text-gray-800 mb-2">回合结束</h2>
            <p className="text-gray-600 mb-6">答案是：<span className="text-2xl font-bold text-blue-600">{currentWord}</span></p>
            <button
              onClick={startNewRound}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all"
            >
              开始下一回合
            </button>
          </div>
        </div>
      )}

      {/* Footer / Controls */}
      <footer className="w-full max-w-6xl flex justify-between items-center text-sm text-gray-600 font-medium bg-white bg-opacity-60 backdrop-blur-sm rounded-xl px-6 py-4 shadow-md">
        <div className="flex gap-4 text-gray-600">
          <span>📋 规则: 猜中得 100 分</span>
          <span>•</span>
          <span>🎨 轮流作画和猜题</span>
        </div>
        <div className="flex items-center gap-2 text-purple-600 font-bold hover:text-purple-700 transition-colors cursor-pointer">
          <Trophy size={16} />
          <span>排行榜</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
