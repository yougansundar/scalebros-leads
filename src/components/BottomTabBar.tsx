import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import { Compass, FileText, Send, Sparkles } from 'lucide-react';

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab, selectedCount, triggerHaptic } = useApp();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'discover',
      label: 'Discover',
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: 'pitch',
      label: 'Pitch Template',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'queue',
      label: 'Launch Queue',
      icon: <Send className="w-5 h-5" />,
      badge: selectedCount > 0 ? selectedCount : undefined,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1 safe-bottom">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic();
                setActiveTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-150 min-h-[52px] select-none ${
                isActive
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full min-w-[18px] text-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
