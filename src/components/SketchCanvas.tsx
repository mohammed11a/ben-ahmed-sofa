import React, { useRef, useState, useEffect } from 'react';
import { Eraser, RotateCcw, Palette, PenTool, Check } from 'lucide-react';

interface SketchCanvasProps {
  initialDataUrl?: string;
  onSave: (dataUrl: string) => void;
}

export const SketchCanvas: React.FC<SketchCanvasProps> = ({
  initialDataUrl,
  onSave
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentColor, setCurrentColor] = useState<string>('#f59e0b'); // amber
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [history, setHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.parentElement?.clientWidth || 500;
    canvas.height = 240;

    // Fill dark background grid
    drawGrid(ctx, canvas.width, canvas.height);

    // If initial image exists, draw it
    if (initialDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        saveHistoryState();
      };
      img.src = initialDataUrl;
    } else {
      saveHistoryState();
    }
  }, []);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const step = 20;

    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const saveHistoryState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), state]);
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveHistoryState();
    triggerSave();
  };

  const triggerSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawGrid(ctx, canvas.width, canvas.height);
    saveHistoryState();
    triggerSave();
  };

  const undo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // Remove current
    const prevState = newHistory[newHistory.length - 1];
    ctx.putImageData(prevState, 0, 0);
    setHistory(newHistory);
    triggerSave();
  };

  const colors = [
    { label: 'ذهبي', hex: '#f59e0b' },
    { label: 'أبيض', hex: '#ffffff' },
    { label: 'أزرق', hex: '#38bdf8' },
    { label: 'أحمر', hex: '#ef4444' },
    { label: 'أخضر', hex: '#10b981' }
  ];

  return (
    <div className="flex flex-col gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">لون القلم:</span>
          <div className="flex items-center gap-1.5">
            {colors.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setCurrentColor(c.hex)}
                style={{ backgroundColor: c.hex }}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  currentColor === c.hex ? 'border-amber-400 scale-110 shadow-md' : 'border-slate-700'
                }`}
                title={c.label}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">السمك:</span>
          {[2, 4, 6].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setLineWidth(w)}
              className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                lineWidth === w ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {w === 2 ? 'رفيع' : w === 4 ? 'وسط' : 'عريض'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={undo}
            disabled={history.length <= 1}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-all"
            title="تراجع"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تراجع</span>
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-all"
            title="مسح اللوحة"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>مسح</span>
          </button>
        </div>
      </div>

      <div className="relative w-full rounded-xl overflow-hidden border border-slate-700 cursor-crosshair touch-none">
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          className="w-full block bg-slate-900"
        />
        <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 bg-slate-950/70 px-2 py-0.5 rounded pointer-events-none">
          ارسم هنا شكل كروكي للكنب أو توزيع الزاوية والمقاسات ✍️
        </div>
      </div>
    </div>
  );
};
