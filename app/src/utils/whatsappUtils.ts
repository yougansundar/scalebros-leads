/**
 * WhatsApp Deep Linking and URL Encoding Utilities
 * Supports native WhatsApp mobile intent with web / wa.me fallback
 * and high-fidelity Unicode encoding for Tamil, emojis, and multi-line pitches.
 */

import { normalizePhoneNumber } from './phoneUtils';

export interface WhatsAppUrls {
  phone: string;
  normalizedPhone: string;
  rawText: string;
  encodedText: string;
  nativeIntentUrl: string;
  webUrl: string;
  apiFallbackUrl: string;
}

/**
 * Generates properly encoded WhatsApp action links.
 * Uses encodeURIComponent which handles UTF-8 multi-byte glyphs (Tamil, emojis, line breaks).
 */
export function buildWhatsAppUrls(phone: string, text: string): WhatsAppUrls {
  const phoneRes = normalizePhoneNumber(phone);
  const normalizedPhone = phoneRes.normalized;

  // encodeURIComponent encodes spaces as %20 and newlines as %0A
  const encodedText = encodeURIComponent(text);

  const nativeIntentUrl = `whatsapp://send?phone=${normalizedPhone}&text=${encodedText}`;
  const webUrl = `https://wa.me/${normalizedPhone}?text=${encodedText}`;
  const apiFallbackUrl = `https://api.whatsapp.com/send?phone=${normalizedPhone}&text=${encodedText}`;

  return {
    phone,
    normalizedPhone,
    rawText: text,
    encodedText,
    nativeIntentUrl,
    webUrl,
    apiFallbackUrl,
  };
}

/**
 * Triggers sending WhatsApp message:
 * Attempts native intent on mobile devices; gracefully falls back to wa.me.
 */
export function openWhatsAppChat(phone: string, text: string, preferNative = true): void {
  const { nativeIntentUrl, webUrl } = buildWhatsAppUrls(phone, text);

  // Check if user agent is mobile device
  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile && preferNative) {
    // Attempt native intent
    const start = Date.now();
    window.location.href = nativeIntentUrl;

    // Fallback if app not installed or protocol handler doesn't respond
    setTimeout(() => {
      if (Date.now() - start < 1500) {
        window.open(webUrl, '_blank', 'noopener,noreferrer');
      }
    }, 1000);
  } else {
    // Desktop or web fallback
    window.open(webUrl, '_blank', 'noopener,noreferrer');
  }
}

export interface EncodingVerificationResult {
  label: string;
  sampleText: string;
  encodedLength: number;
  containsEncodedNewline: boolean;
  containsEncodedEmojis: boolean;
  roundTripMatch: boolean;
  notes: string;
}

/**
 * Self-verification test suite for multi-line Tamil, Tanglish, English, and emojis
 */
export function runEncodingVerificationSuite(): EncodingVerificationResult[] {
  const samples = [
    {
      label: 'Multi-line Tamil with Emojis',
      sampleText: 'வணக்கம் அன்பரே! 🙏\nஉங்கள் நிறுவனத்திற்கு AI விளம்பர வீடியோக்கள் தயார் செய்ய வேண்டுமா? 🎬🔥\n' +
        'இலவச டெமோ பார்க்க "YES" என பதிலளிக்கவும்.',
      notes: 'Contains Tamil Unicode glyphs, double newlines, and multi-byte emojis.',
    },
    {
      label: 'Tanglish Pro Pitch with Formatting',
      sampleText: 'Vanakkam sir! Unga business-ku Instagram Reels iruka? 🚀\n' +
        'Customer footfalls 3x aaga AI Video Ads help pannum! 📈\n' +
        'Sample video paaka reply pannunga.',
      notes: 'Tanglish phrasing with newlines, exclamation marks, and rocket/chart emojis.',
    },
    {
      label: 'English Agency Pitch with Special Symbols & Bullet Points',
      sampleText: 'Hi Team,\n' +
        'Noticed: "No Website Found & Low Social Media Presence".\n' +
        'Services:\n' +
        '• AI Ad Videos (Reels/Shorts)\n' +
        '• Creative Posters & 100% Free Demo.\n' +
        'Would you like to see a sample? Reply YES.',
      notes: 'Contains double quotes, bullet points, ampersand, percent signs, and newlines.',
    },
    {
      label: 'Special URL Characters Test',
      sampleText: 'Special: ?test=1&brand=LeadFlow#demo 100% discount! 🚀',
      notes: 'Contains ?, =, &, #, % characters which must be safely escaped.',
    },
  ];

  return samples.map((sample) => {
    const encoded = encodeURIComponent(sample.sampleText);
    const decoded = decodeURIComponent(encoded);
    const roundTripMatch = decoded === sample.sampleText;
    const containsEncodedNewline = encoded.includes('%0A');
    const containsEncodedEmojis = /%F0%9F/i.test(encoded);

    return {
      label: sample.label,
      sampleText: sample.sampleText,
      encodedLength: encoded.length,
      containsEncodedNewline,
      containsEncodedEmojis,
      roundTripMatch,
      notes: sample.notes,
    };
  });
}
