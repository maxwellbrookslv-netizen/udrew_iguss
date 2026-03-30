import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Eraser, Pencil, Trash2 } from 'lucide-react';

interface CanvasProps {
  isDrawingMode: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ isDrawingMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingMode) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x;
    let y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  }, [isDrawingMode]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.beginPath();
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !isDrawingMode) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [isDrawing, isDrawingMode, brushSize, color, tool]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,rgba(255,251,245,0.9),rgba(255,241,230,0.85))] pt-16 relative">
      {isDrawingMode && (
        <div className="fairy-panel absolute left-4 top-4 z-10 flex flex-col gap-2 rounded-[24px] border border-[#ecd1af] bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(255,242,229,0.9))] p-3 shadow-[0_20px_34px_rgba(155,108,73,0.18)]">
          <div className="px-2 text-xs font-extrabold uppercase tracking-[0.24em] text-[#b77554]">工具栏</div>
          <button
            onClick={() => setTool('pencil')}
            className={`rounded-[16px] p-2 transition-all ${tool === 'pencil' ? 'border border-[#efc590] bg-[linear-gradient(135deg,#f2be68,#ee8d74)] text-white shadow-[0_12px_24px_rgba(214,130,87,0.28)]' : 'border border-[#ead8c9] bg-white/85 text-[#86543d] hover:bg-[#fff7f0]'}`}
            title="铅笔"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`rounded-[16px] p-2 transition-all ${tool === 'eraser' ? 'border border-[#efc590] bg-[linear-gradient(135deg,#f2be68,#ee8d74)] text-white shadow-[0_12px_24px_rgba(214,130,87,0.28)]' : 'border border-[#ead8c9] bg-white/85 text-[#86543d] hover:bg-[#fff7f0]'}`}
            title="橡皮擦"
          >
            <Eraser size={20} />
          </button>
          <button
            onClick={clearCanvas}
            className="rounded-[16px] border border-[#ead8c9] bg-white/85 p-2 text-[#cb6a63] transition-all hover:bg-[#fff2ef]"
            title="清空"
          >
            <Trash2 size={20} />
          </button>
          <div className="mt-2 border-t border-[#efdcc5] pt-2">
            <label className="mb-2 block px-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#b77554]">颜色</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-full cursor-pointer rounded-[14px] border border-[#ecd1af] bg-white p-1"
            />
          </div>
          <div className="mt-2 border-t border-[#efdcc5] pt-2">
            <label className="mb-2 block px-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#b77554]">笔刷大小</label>
            <div className="flex items-center gap-2 px-2">
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="accent-[#df8d6e] flex-1"
              />
              <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-black text-[#8f6345] shadow-sm">{brushSize}</span>
            </div>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className={`h-full w-full touch-none bg-white ${isDrawingMode ? 'cursor-crosshair' : 'cursor-default'}`}
      />
    </div>
  );
};

export default Canvas;
