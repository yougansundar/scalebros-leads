import React, { useState } from 'react';
import { X, Download, Terminal, Github, FileCode, Check, Copy, Smartphone } from 'lucide-react';

interface ApkExportModalProps {
  onClose: () => void;
}

export const ApkExportModal: React.FC<ApkExportModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'eas' | 'github' | 'standalone'>('eas');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const easCommand = 'npx eas build -p android --profile preview';
  const githubActionPath = '.github/workflows/android-apk.yml';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#131B2E] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Android APK & iOS Production Build Pipeline
              </h3>
              <p className="text-xs text-slate-400">
                Turn ScaleBros Leads into installable .apk and .ipa packages
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-[#0B0F19]/50 px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('eas')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'eas'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Method 1: 1-Command Expo EAS Build</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'github'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>Method 2: GitHub Actions CI/CD</span>
          </button>

          <button
            onClick={() => setActiveTab('standalone')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'standalone'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Config Files Included</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {activeTab === 'eas' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/50">
                <h4 className="font-bold text-emerald-300 text-sm mb-1">
                  Fastest Way: Instant Cloud APK via Expo EAS
                </h4>
                <p className="text-slate-300 leading-relaxed text-xs">
                  We pre-configured <code>eas.json</code> and <code>app.json</code> in this repository with Android package <code>com.leadflow.ai</code>. Run this single command in terminal to build and download your APK:
                </p>
              </div>

              <div className="relative p-3 bg-[#0B0F19] border border-slate-800 rounded-xl font-mono text-emerald-300 flex items-center justify-between">
                <code>{easCommand}</code>
                <button
                  onClick={() => copyToClipboard(easCommand, 'eas')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
                >
                  {copiedKey === 'eas' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'eas' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="space-y-2 pt-1 text-slate-300">
                <div className="font-semibold text-white">How it works:</div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-400 pl-1">
                  <li>Expo cloud automatically compiles the standalone Android package.</li>
                  <li>Outputs a direct QR code and downloadable <code>.apk</code> URL in your terminal.</li>
                  <li>Install directly on any Android smartphone without Google Play Console setup.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/50">
                <h4 className="font-bold text-indigo-300 text-sm mb-1">
                  Automated GitHub Actions Workflow (.github/workflows/android-apk.yml)
                </h4>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Whenever you push changes or trigger manual dispatch, GitHub Actions builds and attaches a downloadable <code>app-release.apk</code> artifact.
                </p>
              </div>

              <div className="p-3 bg-[#0B0F19] border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 space-y-1">
                <div className="text-slate-500">// Triggering via GitHub Web UI</div>
                <div>1. Go to repository &gt; <strong>Actions</strong> tab</div>
                <div>2. Select <strong>Build Android APK (Release)</strong></div>
                <div>3. Click <strong>Run workflow</strong></div>
                <div>4. Download <code>app-release.apk</code> from Artifacts</div>
              </div>

              <div className="p-3 bg-[#0B0F19] border border-slate-800 rounded-xl font-mono text-[11px] text-slate-400">
                File located at: <code className="text-emerald-400">{githubActionPath}</code>
              </div>
            </div>
          )}

          {activeTab === 'standalone' && (
            <div className="space-y-2.5">
              <p className="text-slate-300">
                All production build files are written and preserved in this repository:
              </p>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#0B0F19] border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold font-mono text-emerald-400">eas.json</div>
                    <div className="text-slate-400 text-[11px]">EAS build profile with <code>buildType: &quot;apk&quot;</code> preview profile</div>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono">Present</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0B0F19] border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold font-mono text-emerald-400">app.json</div>
                    <div className="text-slate-400 text-[11px]">Expo config with bundle identifiers & permissions</div>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono">Present</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0B0F19] border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold font-mono text-emerald-400">.github/workflows/android-apk.yml</div>
                    <div className="text-slate-400 text-[11px]">Complete CI/CD workflow producing <code>app-release.apk</code></div>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono">Present</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0B0F19]/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Package: <code className="text-emerald-400">com.leadflow.ai</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
