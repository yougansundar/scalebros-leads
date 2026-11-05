/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomTabBar } from './components/BottomTabBar';
import { StickyBottomCTA } from './components/StickyBottomCTA';
import { MobileFrame } from './components/MobileFrame';
import { DiscoverTab } from './components/DiscoverTab';
import { PitchEditorTab } from './components/PitchEditorTab';
import { LaunchQueueTab } from './components/LaunchQueueTab';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      <Header />

      <MobileFrame>
        {activeTab === 'discover' && <DiscoverTab />}
        {activeTab === 'pitch' && <PitchEditorTab />}
        {activeTab === 'queue' && <LaunchQueueTab />}
      </MobileFrame>

      <StickyBottomCTA />
      <BottomTabBar />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
