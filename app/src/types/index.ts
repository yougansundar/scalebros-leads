export type BusinessCategory =
  | 'All'
  | 'Restaurants'
  | 'Textiles'
  | 'Supermarkets'
  | 'Healthcare & Clinics'
  | 'Automobile'
  | 'Real Estate'
  | 'Salons & Spas'
  | 'Jewellery'
  | 'Organic Stores'
  | 'Bakeries & Sweets';

export type MarketingGap =
  | 'No Website Found'
  | 'Needs AI Video Reels'
  | 'Low Social Media Presence'
  | 'Poor Google Reviews / Photos'
  | 'Outdated Menu / Catalog'
  | 'No Active Promotions';

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  city: string;
  address: string;
  phone: string; // raw input or scraped
  formattedPhone: string; // e.g., "+91 98765 43210"
  normalizedPhone: string; // e.g., "919876543210" for wa.me / intents
  gap: MarketingGap;
  gapReason: string;
  rating?: number;
  reviewCount?: number;
  website?: string;
  source: 'osm' | 'generator' | 'custom';
  selected: boolean;
  queueStatus: 'pending' | 'sent' | 'skipped';
  sentAt?: string;
  customNote?: string;
}

export type TemplateLanguage = 'tanglish' | 'tamil' | 'english' | 'offer';

export interface PitchTemplate {
  id: string;
  name: string;
  language: TemplateLanguage;
  badgeLabel: string;
  description: string;
  body: string;
  isDefault?: boolean;
}

export interface AgencySettings {
  agencyName: string;
  senderName: string;
  portfolioUrl: string;
  testPhoneNumber: string;
  autoMarkSent: boolean;
  useNativeIntent: boolean;
}

export type ActiveTab = 'discover' | 'pitch' | 'queue';
