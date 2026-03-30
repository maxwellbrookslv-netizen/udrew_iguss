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
const pickRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: '我 (玩家1)', score: 0, isDrawing: true },
    { id: '2', name: '玩家2', score: 120, isDrawing: false },
    { id: '3', name: '玩家3', score: 85, isDrawing: false },
  ]);
  const [currentWord, setCurrentWord] = useState(() => pickRandomWord());
  const [timeLeft, setTimeLeft] = useState(60);
  const [roundEnd, setRoundEnd] = useState(false);

  const startNewRound = useCallback(() => {
    setCurrentWord(pickRandomWord());
    setTimeLeft(60);
    setMessages([]);
    setRoundEnd(false);
  }, []);

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
  const progress = (timeLeft / 60) * 100;

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-5 text-[#5a3825] md:px-8 md:py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-5%] top-8 h-40 w-40 rounded-full bg-[#ffe4b5]/60 blur-3xl md:h-64 md:w-64" />
        <div className="absolute right-[-3%] top-16 h-44 w-44 rounded-full bg-[#ffd6e7]/70 blur-3xl md:h-72 md:w-72" />
        <div className="absolute bottom-[-8%] left-1/3 h-48 w-48 rounded-full bg-[#ccebd8]/65 blur-3xl md:h-80 md:w-80" />
        <div className="absolute inset-x-0 top-24 mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-white/70 to-transparent" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-6">
        <header className="fairy-panel relative w-full overflow-hidden rounded-[32px] border border-[#f2d8b5]/80 bg-[linear-gradient(135deg,rgba(255,251,243,0.95),rgba(255,233,212,0.88))] p-6 shadow-[0_26px_60px_rgba(171,113,77,0.18)] md:p-8">
          <div className="absolute right-5 top-5 rounded-full bg-white/45 px-4 py-1 text-[11px] font-extrabold uppercase tracking-[0.38em] text-[#d07a60]">
            Fairy Match
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#efcfaa] bg-white/70 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.3em] text-[#b77454] shadow-sm">
                <LayoutGrid size={16} />
                梦境画会
              </div>

              <div className="space-y-3">
                <h1 className="fairy-title flex items-center gap-3 text-4xl leading-none text-[#7a4c2d] md:text-6xl">
                  UDREW IGUSS
                  <Sparkles size={30} className="text-[#e58b7b]" />
                </h1>
                <p className="max-w-2xl text-sm font-semibold leading-7 text-[#906347] md:text-base">
                  把对局放进森林童话绘本里。画板、聊天和积分规则保持不变，只让整个房间更像一场有晨雾、糖霜和星尘的猜画游戏。
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm font-bold text-[#8f6345]">
                <div className="rounded-full border border-[#edd1ad] bg-white/70 px-4 py-2 shadow-sm">花园赛场</div>
                <div className="rounded-full border border-[#edd1ad] bg-white/70 px-4 py-2 shadow-sm">糖霜色板</div>
                <div className="rounded-full border border-[#edd1ad] bg-white/70 px-4 py-2 shadow-sm">故事书布局</div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="fairy-panel rounded-[28px] border border-white/70 bg-white/65 p-5 shadow-[0_18px_40px_rgba(176,118,74,0.14)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.34em] text-[#c07e60]">倒计时</p>
                    <div className={`mt-2 flex items-center gap-2 text-3xl font-black ${timeLeft <= 10 ? 'text-[#d55f5f]' : 'text-[#7a4c2d]'}`}>
                      <Timer size={24} />
                      <span>{timeLeft}s</span>
                    </div>
                  </div>
                  <div className="rounded-full bg-[#fff1da] px-3 py-2 text-xs font-extrabold text-[#d28c3b]">
                    第 1 回合
                  </div>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/80">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${timeLeft <= 10 ? 'bg-gradient-to-r from-[#f08a7d] to-[#d35454]' : 'bg-gradient-to-r from-[#f3c36a] via-[#ef9fa1] to-[#d08ad8]'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="fairy-panel rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.8),rgba(255,243,231,0.76))] p-5 shadow-[0_18px_40px_rgba(176,118,74,0.14)]">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.34em] text-[#c07e60]">当前题目</p>
                <div className="mt-3 rounded-[20px] border border-[#f0d2b2] bg-[linear-gradient(135deg,#fffdf8,#ffe8ca)] px-4 py-5 text-center shadow-inner">
                  <div className="fairy-title text-4xl text-[#965129] md:text-5xl">
                    {isDrawingMode ? currentWord : '????'}
                  </div>
                  <p className="mt-2 text-xs font-bold tracking-[0.2em] text-[#b17d5a]">
                    {isDrawingMode ? '悄悄画出来，别说出口' : '先观察画面，再给出答案'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-12 bottom-0 h-px bg-gradient-to-r from-transparent via-white/85 to-transparent" />
        </header>

        <main className="grid h-auto w-full max-w-6xl flex-1 grid-cols-1 gap-6 lg:h-[640px] lg:grid-cols-4">
          <section className="fairy-panel fairy-scroll overflow-y-auto rounded-[30px] border border-[#efd6ba] bg-[linear-gradient(180deg,rgba(255,252,246,0.92),rgba(255,242,232,0.9))] p-5 shadow-[0_24px_50px_rgba(150,99,71,0.12)] lg:col-span-1">
            <div className="mb-5 flex items-center justify-between border-b border-[#efdcc4] pb-4">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.28em] text-[#a86f4e]">
                <User size={16} />
                玩家名单
              </h3>
              <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-extrabold text-[#ca865e] shadow-sm">
                3 位旅人
              </div>
            </div>

            <div className="space-y-3">
            {players.map((player, index) => (
              <div 
                key={player.id} 
                className={`rounded-[24px] border p-4 transition-all ${
                  player.isDrawing
                    ? 'border-[#efb26e] bg-[linear-gradient(135deg,rgba(255,242,216,0.98),rgba(255,224,205,0.92))] shadow-[0_16px_30px_rgba(222,159,87,0.22)]'
                    : 'border-[#f0e0cf] bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(253,244,236,0.88))] shadow-[0_10px_24px_rgba(159,120,93,0.09)]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-black shadow-sm ${
                      player.isDrawing ? 'bg-white text-[#da8b35]' : 'bg-[#fff4ea] text-[#c57b6c]'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-black text-[#72472e]">{player.name}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs font-bold text-[#b2795a]">
                        <Trophy size={14} />
                        {player.score} 分
                      </div>
                    </div>
                  </div>
                  {player.isDrawing && (
                    <div className="flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 text-xs font-black text-[#db7d52] shadow-sm">
                      <Pencil size={14} />
                      作画中
                    </div>
                  )}
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/70">
                  <div
                    className={`h-full rounded-full ${player.isDrawing ? 'bg-gradient-to-r from-[#f2ba62] to-[#ee8f77]' : 'bg-gradient-to-r from-[#f2d6b7] to-[#e7c5d9]'}`}
                    style={{ width: `${Math.min(100, (player.score / 150) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="fairy-panel relative overflow-hidden rounded-[32px] border border-[#efd6ba] bg-[linear-gradient(180deg,rgba(255,252,247,0.94),rgba(255,241,231,0.92))] shadow-[0_24px_50px_rgba(150,99,71,0.13)] lg:col-span-2">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4">
            <div className="rounded-full border border-white/80 bg-white/75 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.28em] text-[#b77554] shadow-sm">
              魔法画布
            </div>
            <div className="rounded-full bg-[#fff0dd]/90 px-4 py-2 text-xs font-extrabold text-[#ca865e] shadow-sm">
              {isDrawingMode ? '画出故事线索' : '等待画师施法'}
            </div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_38%)]" />
          <Canvas isDrawingMode={isDrawingMode} />
        </section>

        <section className="lg:col-span-1">
          <div className="mb-3 flex items-center justify-between px-2 text-sm font-black uppercase tracking-[0.24em] text-[#a86f4e]">
            <span>林间留言</span>
            <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] text-[#ca865e] shadow-sm">实时猜题</span>
          </div>
          <Chat 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isDrawingMode={isDrawingMode} 
          />
        </section>
      </main>

      {roundEnd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#5b3c2f]/30 p-4 backdrop-blur-sm">
          <div className="fairy-panel relative w-full max-w-md overflow-hidden rounded-[32px] border border-[#f1d6b1] bg-[linear-gradient(180deg,rgba(255,251,243,0.96),rgba(255,232,210,0.96))] p-8 text-center shadow-[0_28px_60px_rgba(124,76,45,0.26)]">
            <div className="absolute left-6 top-5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.34em] text-[#d07a60]">
              Story Clear
            </div>
            <div className="mt-6 flex justify-center text-[#e09264]">
              <Sparkles size={36} />
            </div>
            <h2 className="fairy-title mt-3 text-4xl text-[#7f4d2b]">回合结束</h2>
            <p className="mt-3 text-sm font-bold leading-7 text-[#936547]">
              这一页童话已经翻完，真正的谜底是
            </p>
            <p className="fairy-title mt-4 text-5xl text-[#b76343]">{currentWord}</p>
            <button
              onClick={startNewRound}
              className="mt-8 w-full rounded-[20px] border border-[#efc590] bg-[linear-gradient(135deg,#f2be68,#ee8d74)] px-5 py-4 text-base font-black text-white shadow-[0_16px_34px_rgba(214,130,87,0.35)] transition-transform hover:-translate-y-0.5"
            >
              翻到下一页
            </button>
          </div>
        </div>
      )}

      <footer className="fairy-panel flex w-full max-w-6xl flex-col items-start justify-between gap-4 rounded-[28px] border border-[#efd6ba] bg-[linear-gradient(135deg,rgba(255,252,247,0.88),rgba(255,239,229,0.82))] px-6 py-5 text-sm font-bold text-[#8d6348] shadow-[0_16px_34px_rgba(150,99,71,0.1)] md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white/75 px-4 py-2 shadow-sm">猜中得 100 分</span>
          <span className="rounded-full bg-white/75 px-4 py-2 shadow-sm">轮流作画和猜题</span>
          <span className="rounded-full bg-white/75 px-4 py-2 shadow-sm">童话主题仅改视觉</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#fff5e6,#ffe7dd)] px-4 py-2 text-[#c17154] shadow-sm">
          <Trophy size={16} />
          榜单仍按原规则结算
        </div>
      </footer>
      </div>
    </div>
  );
}

export default App;
