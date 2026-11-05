import React from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { viewMode } = useApp();

  if (viewMode === 'fluid') {
    return (
      <main className="max-w-4xl mx-auto px-4 py-4 min-h-[calc(100vh-60px)]">
        {children}
      </main>
    );
  }

  // Mobile Device Mockup Frame
  return (
    <div className="py-4 md:py-8 px-2 flex justify-center items-start min-h-[calc(100vh-60px)]">
      <div className="relative w-full max-w-[420px] bg-[#0B0F19] rounded-[44px] border-[8px] border-[#1E293B] shadow-2xl shadow-black/80 overflow-hidden flex flex-col min-h-[820px] ring-1 ring-slate-700/50">
        {/* Phone Speaker & Dynamic Island / Status Bar */}
        <div className="sticky top-0 z-40 bg-[#0B0F19] pt-2.5 px-6 pb-2 flex items-center justify-between text-slate-400 text-xs font-mono select-none">
          <span className="font-bold text-white text-[11px]">9:41</span>
          
          {/* Dynamic Island pill */}
          <div className="w-20 h-4 bg-black rounded-full mx-auto border border-slate-800/80 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto px-3.5 pt-2 pb-6">
          {children}
        </div>

        {/* Native Home Bar Indicator */}
        <div className="py-2 flex justify-center bg-[#0B0F19] select-none pointer-events-none">
          <div className="w-28 h-1 bg-slate-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};
