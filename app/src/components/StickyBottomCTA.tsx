import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, ArrowRight, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const StickyBottomCTA: React.FC = () => {
  const { activeTab, setActiveTab, selectedCount, triggerHaptic } = useApp();

  // Show only when on 'discover' tab and at least 1 business is selected
  if (activeTab !== 'discover' || selectedCount === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="fixed bottom-[68px] left-0 right-0 z-30 px-4 pointer-events-none"
      >
        <div className="max-w-md mx-auto pointer-events-auto">
          <button
            onClick={() => {
              triggerHaptic();
              setActiveTab('queue');
            }}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] text-slate-950 font-bold py-3.5 px-5 rounded-2xl shadow-xl shadow-emerald-950/60 flex items-center justify-between border border-emerald-300/30 transition-all duration-150"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-950/20 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-slate-950" />
              </div>
              <div className="text-left">
                <div className="text-sm font-extrabold font-display leading-tight">
                  OK • Send WhatsApp Pitch
                </div>
                <div className="text-[11px] font-semibold text-slate-900/80">
                  {selectedCount} target {selectedCount === 1 ? 'business' : 'businesses'} ready
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950/15 px-3 py-1.5 rounded-xl text-xs font-bold font-mono">
              <span>Launch</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
