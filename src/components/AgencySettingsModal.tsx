import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Settings, Briefcase, User, Phone, Globe, Check } from 'lucide-react';
import { normalizePhoneNumber } from '../utils/phoneUtils';

interface AgencySettingsModalProps {
  onClose: () => void;
}

export const AgencySettingsModal: React.FC<AgencySettingsModalProps> = ({ onClose }) => {
  const { agencySettings, updateAgencySettings, triggerHaptic } = useApp();

  const [agencyName, setAgencyName] = useState(agencySettings.agencyName);
  const [senderName, setSenderName] = useState(agencySettings.senderName);
  const [portfolioUrl, setPortfolioUrl] = useState(agencySettings.portfolioUrl);
  const [testPhoneNumber, setTestPhoneNumber] = useState(agencySettings.testPhoneNumber);
  const [autoMarkSent, setAutoMarkSent] = useState(agencySettings.autoMarkSent);
  const [useNativeIntent, setUseNativeIntent] = useState(agencySettings.useNativeIntent);

  const phonePreview = normalizePhoneNumber(testPhoneNumber);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();
    updateAgencySettings({
      agencyName: agencyName.trim() || 'My Marketing Agency',
      senderName: senderName.trim() || 'Founder',
      portfolioUrl: portfolioUrl.trim(),
      testPhoneNumber: testPhoneNumber.trim(),
      autoMarkSent,
      useNativeIntent,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#131B2E] border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Agency Pitch Settings</h3>
              <p className="text-xs text-slate-400">Configure your branding & sender parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Agency Brand Name ({'{agency_name}'})
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="e.g. ScaleBros or ScaleBros Growth Agency"
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Your Name / Sign-off ({'{sender_name}'})
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Karthik Raja or Priya"
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Agency Portfolio / Reel Demo Link
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="e.g. https://nexusmedia.agency or Instagram link"
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Safe Test Mode: Your WhatsApp Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={testPhoneNumber}
                onChange={(e) => setTestPhoneNumber(e.target.value)}
                placeholder="Your mobile number for safe testing"
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            {testPhoneNumber && (
              <p className="text-[11px] text-emerald-400 mt-1 font-mono">
                Will be tested as: {phonePreview.formatted}
              </p>
            )}
          </div>

          {/* Toggle Switches */}
          <div className="pt-2 space-y-2 border-t border-slate-800">
            <label className="flex items-center justify-between cursor-pointer py-1">
              <div>
                <span className="text-xs font-medium text-slate-200">Auto-Mark Sent</span>
                <p className="text-[11px] text-slate-400">Mark lead as sent when tapping Send WhatsApp</p>
              </div>
              <input
                type="checkbox"
                checked={autoMarkSent}
                onChange={(e) => setAutoMarkSent(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 focus:ring-offset-slate-900 bg-slate-800 border-slate-700"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <div>
                <span className="text-xs font-medium text-slate-200">Native WhatsApp Intent</span>
                <p className="text-[11px] text-slate-400">Directly opens WhatsApp app via whatsapp:// protocol</p>
              </div>
              <input
                type="checkbox"
                checked={useNativeIntent}
                onChange={(e) => setUseNativeIntent(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 focus:ring-offset-slate-900 bg-slate-800 border-slate-700"
              />
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/40 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
