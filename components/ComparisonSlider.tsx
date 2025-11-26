import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ComparisonSliderProps {
  originalImage: string;
  generatedImage: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  originalImage,
  generatedImage,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => setIsResizing(true), []);
  const handleMouseUp = useCallback(() => setIsResizing(false), []);

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isResizing || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;

      setSliderPosition(percentage);
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove as any);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove as any);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden cursor-col-resize select-none shadow-2xl border border-slate-700 bg-slate-900"
    >
      {/* Background Image (After/Generated) */}
      <img
        src={generatedImage}
        alt="Redesigned Room"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Foreground Image (Before/Original) - Clipped */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden w-full"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={originalImage}
          alt="Original Room"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        {/* Label for Original */}
        <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
          ORIGINAL
        </div>
      </div>

       {/* Label for Generated */}
       <div className="absolute top-4 right-4 bg-indigo-600/80 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
          REIMAGINED
        </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg transform active:scale-110 transition-transform">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4 text-slate-800"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ComparisonSlider;