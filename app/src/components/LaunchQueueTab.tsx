import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Business } from '../types';
import {
  Send,
  CheckCircle2,
  Clock,
  SkipForward,
  RotateCcw,
  Download,
  ShieldCheck,
  Phone,
  Flame,
  ArrowRight,
  ExternalLink,
  Sparkles,
  MapPin,
  Check,
} from 'lucide-react';
import { normalizePhoneNumber } from '../utils/phoneUtils';

export const LaunchQueueTab: React.FC = () => {
  const {
    queueBusinesses,
    sentCount,
    pendingCount,
    skippedCount,
    sendPitchToBusiness,
    markQueueStatus,
    resetQueueStatuses,
    sendSafeTestPitch,
    agencySettings,
    updateAgencySettings,
    exportCsv,
    exportJson,
    setActiveTab,
    triggerHaptic,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'sent' | 'skipped'>('all');
  const [testInputPhone, setTestInputPhone] = useState(agencySettings.testPhoneNumber || '9842154321');
  const [isTestSent, setIsTestSent] = useState(false);

  const totalInQueue = queueBusinesses.length;
  const progressPercent = totalInQueue > 0 ? Math.round((sentCount / totalInQueue) * 100) : 0;

  // Next pending lead for Rapid Fire mode
  const nextPendingLead = queueBusinesses.find((b) => b.queueStatus === 'pending');

  const filteredList = React.useMemo(() => {
    if (filterStatus === 'all') return queueBusinesses;
    return queueBusinesses.filter((b) => b.queueStatus === filterStatus);
  }, [queueBusinesses, filterStatus]);

  const handleRapidFireSend = () => {
    if (!nextPendingLead) return;
    triggerHaptic();
    sendPitchToBusiness(nextPendingLead);
  };

  const handleTestSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInputPhone.trim()) return;
    triggerHaptic();
    updateAgencySettings({ testPhoneNumber: testInputPhone.trim() });
    sendSafeTestPitch(testInputPhone.trim());
    setIsTestSent(true);
    setTimeout(() => setIsTestSent(false), 3000);
  };

  return (
    <div className="pb-32 space-y-4">
      {/* 1. Queue Progress & Metrics Bar */}
      <section className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Flame className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                WhatsApp Outreach Launchpad
              </h2>
              <p className="text-xs text-slate-400">
                1-Tap Personalized Native Intent Pipeline
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-extrabold text-emerald-400 font-mono tabular-nums">
              {progressPercent}%
            </div>
            <div className="text-[10px] text-slate-400">
              {sentCount} of {totalInQueue} Completed
            </div>
          </div>
        </div>

        {/* Progress Track */}
        <div className="w-full bg-[#0B0F19] h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
          <div className="bg-[#0B0F19] p-2 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Pending</div>
            <div className="text-sm font-bold text-amber-400 tabular-nums">{pendingCount}</div>
          </div>
          <div className="bg-[#0B0F19] p-2 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Sent ✓</div>
            <div className="text-sm font-bold text-emerald-400 tabular-nums">{sentCount}</div>
          </div>
          <div className="bg-[#0B0F19] p-2 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Skipped</div>
            <div className="text-sm font-bold text-slate-400 tabular-nums">{skippedCount}</div>
          </div>
        </div>
      </section>

      {/* 2. Rapid Fire 1-Tap Next Lead Focus Card */}
      {nextPendingLead ? (
        <section className="bg-gradient-to-b from-[#162544] to-[#131B2E] border-2 border-emerald-500/60 rounded-2xl p-4 space-y-3.5 shadow-xl shadow-emerald-950/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-full">
              NEXT TARGET IN QUEUE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {nextPendingLead.formattedPhone}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white font-display">
              {nextPendingLead.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
              <span className="font-semibold text-emerald-400">{nextPendingLead.category}</span>
              <span aria-hidden="true">·</span>
              <span>{nextPendingLead.city}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-medium">Gap: {nextPendingLead.gap}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {nextPendingLead.gapReason}
            </p>
          </div>

          {/* Big Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleRapidFireSend}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 text-sm transition-all"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>1-Tap Launch WhatsApp Pitch</span>
            </button>

            <button
              onClick={() => markQueueStatus(nextPendingLead.id, 'skipped')}
              title="Skip this lead"
              className="p-3 bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              <span className="hidden sm:inline">Skip</span>
            </button>
          </div>
        </section>
      ) : totalInQueue > 0 ? (
        <section className="bg-[#131B2E] border border-emerald-500/50 rounded-2xl p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white font-display">
            Queue Finished! All Pitches Sent
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Great outreach hustle! You contacted {sentCount} local businesses. Expect replies within 2-4 hours.
          </p>
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={resetQueueStatuses}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
            >
              Restart Queue
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950"
            >
              Find More Businesses
            </button>
          </div>
        </section>
      ) : (
        <section className="bg-[#131B2E] border border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <Send className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-display">
            Queue is Empty
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Go to the Discover tab to select local businesses, then tap the sticky &quot;OK • Send WhatsApp Pitch&quot; button.
          </p>
          <button
            onClick={() => {
              triggerHaptic();
              setActiveTab('discover');
            }}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl"
          >
            Go to Discover Tab
          </button>
        </section>
      )}

      {/* 3. Safe Test Mode Input */}
      <section className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white font-display">
              Safe Test Mode (Test on Your Number First)
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Zero Risk Check</span>
        </div>

        <form onSubmit={handleTestSend} className="flex gap-2">
          <div className="relative flex-1">
            <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={testInputPhone}
              onChange={(e) => setTestInputPhone(e.target.value)}
              placeholder="Enter your personal WhatsApp number..."
              className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isTestSent ? 'Sent to App!' : 'Send Test Pitch'}</span>
          </button>
        </form>
        <p className="text-[11px] text-slate-400">
          Sends your currently selected pitch template with dynamic business variables filled in to verify how it displays on WhatsApp before messaging leads.
        </p>
      </section>

      {/* 4. Outreach Queue List & Status Toggles */}
      {totalInQueue > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1 bg-[#131B2E] p-1 rounded-xl border border-slate-800 text-xs">
              {(['all', 'pending', 'sent', 'skipped'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                    filterStatus === status
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Export & Reset Actions */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={exportCsv}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1"
                title="Download leads as CSV"
              >
                <Download className="w-3 h-3" />
                <span>CSV</span>
              </button>

              <button
                onClick={resetQueueStatuses}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                title="Reset all statuses to Pending"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List items */}
          <div className="space-y-2">
            {filteredList.map((biz) => (
              <div
                key={biz.id}
                className={`p-3.5 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 ${
                  biz.queueStatus === 'sent'
                    ? 'bg-[#0f172a]/60 border-emerald-900/40 text-slate-400'
                    : biz.queueStatus === 'skipped'
                    ? 'bg-[#10141f] border-slate-800/50 opacity-60'
                    : 'bg-[#131B2E] border-slate-800 text-white'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold font-display truncate">
                      {biz.name}
                    </h4>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        biz.queueStatus === 'sent'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          : biz.queueStatus === 'skipped'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                      }`}
                    >
                      {biz.queueStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span>{biz.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{biz.formattedPhone}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400/90 truncate">{biz.gap}</span>
                  </div>
                </div>

                {/* Row Quick Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => sendPitchToBusiness(biz)}
                    className="p-2 bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-95 text-emerald-400 rounded-lg text-xs font-semibold transition-colors"
                    title="Send WhatsApp Pitch"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() =>
                      markQueueStatus(
                        biz.id,
                        biz.queueStatus === 'sent' ? 'pending' : 'sent'
                      )
                    }
                    className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
                      biz.queueStatus === 'sent'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                    }`}
                    title="Toggle Sent status"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
