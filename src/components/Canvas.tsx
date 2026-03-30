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
    setIsDrawing(true);
    draw(e);
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
    <div className="flex flex-col h-full w-full bg-white overflow-hidden relative">
      {isDrawingMode && (
        <div className="absolute top-4 left-4 flex flex-col gap-2 bg-gradient-to-b from-white to-gray-100 p-3 rounded-lg shadow-lg z-10 border border-gray-200">
          <div className="text-xs font-bold text-gray-600 px-2 mb-1">工具栏</div>
          <button
            onClick={() => setTool('pencil')}
            className={`p-2 rounded-lg transition-all ${tool === 'pencil' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
            title="铅笔"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded-lg transition-all ${tool === 'eraser' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
            title="橡皮擦"
          >
            <Eraser size={20} />
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 rounded-lg bg-white text-red-500 hover:bg-red-50 border border-gray-200 transition-all"
            title="清空"
          >
            <Trash2 size={20} />
          </button>
          <div className="border-t border-gray-200 mt-2 pt-2">
            <label className="text-xs font-bold text-gray-600 block px-2 mb-2">颜色</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-8 cursor-pointer rounded-lg border border-gray-300"
            />
          </div>
          <div className="border-t border-gray-200 mt-2 pt-2">
            <label className="text-xs font-bold text-gray-600 block px-2 mb-2">笔刷大小</label>
            <div className="flex items-center gap-2 px-2">
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">{brushSize}</span>
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
        className={`w-full h-full touch-none ${isDrawingMode ? 'cursor-crosshair' : 'cursor-default'}`}
      />
    </div>
  );
};

export default Canvas;
