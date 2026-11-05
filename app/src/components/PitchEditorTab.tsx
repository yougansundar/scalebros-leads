import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AVAILABLE_VARIABLES, formatPitchMessage } from '../data/defaultTemplates';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Eye,
  MessageSquare,
  Send,
  Zap,
} from 'lucide-react';

export const PitchEditorTab: React.FC = () => {
  const {
    templates,
    activeTemplate,
    activeTemplateId,
    setActiveTemplateId,
    updateTemplate,
    resetTemplates,
    agencySettings,
    selectedBusinesses,
    businesses,
    currentCity,
    sendSafeTestPitch,
    triggerHaptic,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [selectedPreviewBizId, setSelectedPreviewBizId] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Pick a business to render the live preview with
  const previewBusiness = React.useMemo(() => {
    if (selectedPreviewBizId) {
      const found = businesses.find((b) => b.id === selectedPreviewBizId);
      if (found) return found;
    }
    if (selectedBusinesses.length > 0) return selectedBusinesses[0];
    if (businesses.length > 0) return businesses[0];
    return {
      id: 'preview-sample',
      name: 'Sri Krishna Sweets & Bakery',
      category: 'Bakeries & Sweets',
      city: currentCity || 'Bodinayakanur',
      gap: 'Needs AI Video Reels',
      address: `Bazaar Street, ${currentCity}`,
      phone: '9842154321',
      formattedPhone: '+91 98421 54321',
      normalizedPhone: '919842154321',
      gapReason: 'Needs viral reels showcasing celebration cakes.',
      source: 'generator' as const,
      selected: true,
      queueStatus: 'pending' as const,
    };
  }, [selectedPreviewBizId, selectedBusinesses, businesses, currentCity]);

  // Rendered preview message
  const renderedMessage = React.useMemo(() => {
    return formatPitchMessage(activeTemplate.body, {
      businessName: previewBusiness.name,
      category: previewBusiness.category,
      city: previewBusiness.city || currentCity,
      gap: previewBusiness.gap,
      agencyName: agencySettings.agencyName,
      senderName: agencySettings.senderName,
    });
  }, [activeTemplate, previewBusiness, currentCity, agencySettings]);

  // Insert variable tag at cursor
  const handleInsertVariable = (variableKey: string) => {
    triggerHaptic();
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = activeTemplate.body;
    const newText = text.substring(0, start) + variableKey + text.substring(end);

    updateTemplate({
      ...activeTemplate,
      body: newText,
    });

    // Reset cursor after update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variableKey.length, start + variableKey.length);
    }, 10);
  };

  const handleCopyRendered = () => {
    triggerHaptic();
    navigator.clipboard.writeText(renderedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const charCount = activeTemplate.body.length;
  const wordCount = activeTemplate.body.trim().split(/\s+/).filter(Boolean).length;
  const readSeconds = Math.ceil(wordCount / 3.5);

  return (
    <div className="pb-32 space-y-4">
      {/* 1. Template Selector Tabs */}
      <section className="bg-[#131B2E] border border-slate-800 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 font-display flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Outreach Pitch Frameworks</span>
          </label>
          <button
            onClick={() => {
              if (window.confirm('Reset all templates to default copies?')) {
                resetTemplates();
              }
            }}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* 4 Template Selection Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {templates.map((tmpl) => {
            const isSelected = activeTemplateId === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => setActiveTemplateId(tmpl.id)}
                className={`p-2.5 rounded-xl text-left transition-all duration-150 border select-none ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500/80 text-white shadow-md shadow-emerald-950/30'
                    : 'bg-[#0B0F19] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                    isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tmpl.badgeLabel}
                  </span>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </div>
                <div className="text-xs font-bold font-display mt-1.5 truncate">
                  {tmpl.name.split('(')[0]}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 pt-1 leading-relaxed border-t border-slate-800/80">
          {activeTemplate.description}
        </p>
      </section>

      {/* 2. Variable Injection Buttons */}
      <section className="bg-[#131B2E] border border-slate-800 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">Insert Dynamic Variables</span>
          <span className="text-[11px] text-slate-500">Tap to insert at cursor</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {AVAILABLE_VARIABLES.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => handleInsertVariable(v.key)}
              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#0B0F19] hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 border border-indigo-900/40 hover:border-indigo-700/60 transition-colors flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-indigo-400" />
              <span>{v.key}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Pitch Editor Textarea */}
      <section className="bg-[#131B2E] border border-slate-800 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-white font-display flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Edit Pitch Template</span>
          </label>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
            <span>{charCount} chars</span>
            <span aria-hidden="true">·</span>
            <span>{wordCount} words</span>
            <span aria-hidden="true">·</span>
            <span>~{readSeconds}s read</span>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          rows={9}
          value={activeTemplate.body}
          onChange={(e) => {
            updateTemplate({
              ...activeTemplate,
              body: e.target.value,
            });
          }}
          className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl p-3 text-xs leading-relaxed text-white font-sans placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </section>

      {/* 4. Live WhatsApp Speech Bubble Preview */}
      <section className="bg-[#131B2E] border border-slate-800 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white font-display">
              Live WhatsApp Chat Preview
            </h3>
          </div>

          {/* Target Business Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Preview with:</span>
            <select
              value={selectedPreviewBizId || (previewBusiness ? previewBusiness.id : '')}
              onChange={(e) => setSelectedPreviewBizId(e.target.value)}
              className="bg-[#0B0F19] border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 max-w-[160px] truncate"
            >
              {businesses.slice(0, 15).map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* WhatsApp Chat Container */}
        <div className="bg-[#0B141A] border border-slate-800 rounded-2xl p-3.5 relative overflow-hidden">
          {/* Simulated WhatsApp Chat Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[10px]">
                {previewBusiness.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="font-semibold text-slate-200 truncate max-w-[200px]">
                {previewBusiness.name}
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">
              {previewBusiness.formattedPhone}
            </span>
          </div>

          {/* Outgoing Message Speech Bubble */}
          <div className="flex justify-end">
            <div className="bg-[#005C4B] text-slate-100 rounded-2xl rounded-tr-none px-3.5 py-2.5 max-w-[92%] shadow-md text-xs leading-relaxed whitespace-pre-wrap selection:bg-emerald-300 selection:text-slate-900">
              {renderedMessage}
              <div className="text-[9px] text-emerald-200/70 text-right mt-1.5 font-mono">
                12:45 PM · Delivered ✓✓
              </div>
            </div>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleCopyRendered}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Pitch Copied!' : 'Copy Formatted Pitch'}</span>
          </button>

          <button
            onClick={() => sendSafeTestPitch()}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-95 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Send test message to your own phone number"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Test on My WhatsApp</span>
          </button>
        </div>
      </section>
    </div>
  );
};
