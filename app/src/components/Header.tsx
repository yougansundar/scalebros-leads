import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  Monitor,
  Settings,
  CheckCircle2,
  Download,
  Share2,
} from 'lucide-react';
import { AgencySettingsModal } from './AgencySettingsModal';
import { VerificationModal } from './VerificationModal';
import { ApkExportModal } from './ApkExportModal';

export const Header: React.FC = () => {
  const { viewMode, setViewMode, currentCity, businesses, selectedCount, triggerHaptic } = useApp();

  const [showSettings, setShowSettings] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showApkGuide, setShowApkGuide] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark with Uploaded ScaleBros Logo */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 px-2 bg-white rounded-lg flex items-center justify-center shadow-md shadow-black/40 border border-slate-700/50">
              <img
                src="/assets/aistudio/ScaleBros_Growth_Logo_69641325.png"
                alt="ScaleBros Leads"
                className="h-6 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white font-display">ScaleBros Leads</span>
                <span className="text-[10px] font-semibold tracking-wider text-rose-400 bg-rose-950/60 border border-rose-800/50 px-1.5 py-0.5 rounded">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Local Business Finder & WhatsApp Cold Outreach Engine
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation & Quick Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* View Mode Toggle */}
            <button
              onClick={() => {
                triggerHaptic();
                setViewMode(viewMode === 'mobile' ? 'fluid' : 'mobile');
              }}
              title={viewMode === 'mobile' ? 'Switch to Fluid Desktop View' : 'Switch to Mobile Device Frame'}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-1.5"
            >
              {viewMode === 'mobile' ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden md:inline">Fluid View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">Mobile Frame</span>
                </>
              )}
            </button>

            {/* Self-Verification Checks */}
            <button
              onClick={() => {
                triggerHaptic();
                setShowVerification(true);
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-1.5"
              title="Run Phone & URL Encoding Verification Suite"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Verification Checks</span>
            </button>

            {/* APK & Expo Build Setup */}
            <button
              onClick={() => {
                triggerHaptic();
                setShowApkGuide(true);
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 transition-colors flex items-center gap-1.5"
              title="Android APK & GitHub Actions Setup"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Build APK</span>
            </button>

            {/* Agency Settings */}
            <button
              onClick={() => {
                triggerHaptic();
                setShowSettings(true);
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              title="Agency Settings"
              aria-label="Agency Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      {showSettings && <AgencySettingsModal onClose={() => setShowSettings(false)} />}
      {showVerification && <VerificationModal onClose={() => setShowVerification(false)} />}
      {showApkGuide && <ApkExportModal onClose={() => setShowApkGuide(false)} />}
    </>
  );
};
