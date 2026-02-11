"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Copy, ChevronsLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
  aspectRatio?: "square" | "video" | "portrait";
}

export function ComparisonSlider({
  beforeImage,
  afterImage,
  className,
  aspectRatio = "video",
}: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => setIsResizing(true), []);
  const handleMouseUp = useCallback(() => setIsResizing(false), []);
  
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;

      setSliderPosition(percentage);
    },
    [isResizing]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isResizing || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;

      setSliderPosition(percentage);
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove as any);
      window.addEventListener("touchend", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove as any);
      window.removeEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove as any);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp, handleTouchMove]);

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  }[aspectRatio];

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-white/10 select-none group cursor-ew-resize",
        aspectRatioClass,
        className
      )}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* After Image (Background) */}
      <div className="absolute inset-0">
        <Image
          src={afterImage}
          alt="After"
          fill
          className="object-cover"
          draggable={false}
        />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs text-white font-medium uppercase tracking-wider">
          Après
        </div>
      </div>

      {/* Before Image (Foreground - Clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <Image
          src={beforeImage}
          alt="Before"
          fill
          className="object-cover"
          draggable={false}
        />
         <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs text-white font-medium uppercase tracking-wider">
          Avant
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute inset-y-0 w-1 bg-white/80 cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-black/80">
          <ChevronsLeftRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
