import React from 'react';
import { Business } from '../types';
import { useApp } from '../context/AppContext';
import {
  Check,
  Phone,
  MapPin,
  ExternalLink,
  Send,
  Video,
  Globe,
  Share2,
  Star,
  FileQuestion,
  Sparkles,
} from 'lucide-react';

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const { toggleSelectBusiness, sendPitchToBusiness, triggerHaptic } = useApp();

  const getGapIcon = (gap: string) => {
    switch (gap) {
      case 'Needs AI Video Reels':
        return <Video className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'No Website Found':
        return <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
      case 'Low Social Media Presence':
        return <Share2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />;
      case 'Poor Google Reviews / Photos':
        return <Star className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'Outdated Menu / Catalog':
        return <FileQuestion className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
  };

  const getGapBadgeClass = (gap: string) => {
    switch (gap) {
      case 'Needs AI Video Reels':
        return 'bg-amber-950/40 border-amber-800/60 text-amber-300';
      case 'No Website Found':
        return 'bg-sky-950/40 border-sky-800/60 text-sky-300';
      case 'Low Social Media Presence':
        return 'bg-violet-950/40 border-violet-800/60 text-violet-300';
      case 'Poor Google Reviews / Photos':
        return 'bg-rose-950/40 border-rose-800/60 text-rose-300';
      case 'Outdated Menu / Catalog':
        return 'bg-cyan-950/40 border-cyan-800/60 text-cyan-300';
      default:
        return 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300';
    }
  };

  return (
    <div
      onClick={() => toggleSelectBusiness(business.id)}
      className={`relative rounded-2xl p-4 transition-all duration-150 cursor-pointer border ${
        business.selected
          ? 'bg-[#152038] border-emerald-500/80 shadow-lg shadow-emerald-950/30'
          : 'bg-[#131B2E] border-slate-800/90 hover:border-slate-700/80'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox & Business Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSelectBusiness(business.id);
            }}
            className={`w-6 h-6 rounded-lg mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
              business.selected
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'border border-slate-600 bg-slate-900/60 hover:border-slate-500'
            }`}
          >
            {business.selected && <Check className="w-4 h-4 stroke-[3]" />}
          </button>

          <div className="flex-1 min-w-0">
            {/* Business Title */}
            <h3 className="text-base font-bold text-white font-display truncate">
              {business.name}
            </h3>

            {/* Unboxed Metadata with · separator */}
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-400 mt-1">
              <span className="text-slate-300 font-medium">{business.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{business.city}</span>
              {business.rating && (
                <>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="flex items-center gap-1 text-amber-400 font-mono tabular-nums">
                    ★ {business.rating} ({business.reviewCount})
                  </span>
                </>
              )}
            </div>

            {/* Address */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{business.address}</span>
            </div>

            {/* Phone Number */}
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono mt-1">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="tracking-wide font-semibold text-slate-200">
                {business.formattedPhone}
              </span>
            </div>
          </div>
        </div>

        {/* Quick 1-Tap WhatsApp Pitch Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            sendPitchToBusiness(business);
          }}
          title="Send WhatsApp pitch directly"
          className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 text-emerald-400 border border-emerald-500/30 transition-all shrink-0 flex items-center gap-1"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Detected Marketing Gap Section */}
      <div className="mt-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between gap-2">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${getGapBadgeClass(business.gap)}`}>
            {getGapIcon(business.gap)}
            <span>{business.gap}</span>
          </div>

          {business.queueStatus === 'sent' && (
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              Sent ✓
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {business.gapReason}
        </p>
      </div>
    </div>
  );
};
