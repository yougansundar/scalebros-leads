import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Business,
  BusinessCategory,
  PitchTemplate,
  AgencySettings,
  ActiveTab,
} from '../types';
import { DEFAULT_TEMPLATES, formatPitchMessage } from '../data/defaultTemplates';
import { fetchBusinessesByCity } from '../services/businessService';
import { normalizePhoneNumber } from '../utils/phoneUtils';
import { openWhatsAppChat } from '../utils/whatsappUtils';

interface AppContextValue {
  // Discovery State
  businesses: Business[];
  currentCity: string;
  selectedCategory: BusinessCategory;
  searchQuery: string;
  isLoading: boolean;
  activeSource: 'osm' | 'generator' | 'hybrid';

  // Selection
  selectedBusinesses: Business[];
  selectedCount: number;

  // Tabs & View
  activeTab: ActiveTab;
  viewMode: 'mobile' | 'fluid';

  // Templates
  templates: PitchTemplate[];
  activeTemplate: PitchTemplate;
  activeTemplateId: string;

  // Agency Settings
  agencySettings: AgencySettings;

  // Outreach Queue Metrics
  queueBusinesses: Business[];
  sentCount: number;
  pendingCount: number;
  skippedCount: number;

  // Actions
  setCurrentCity: (city: string) => void;
  setSelectedCategory: (cat: BusinessCategory) => void;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setViewMode: (mode: 'mobile' | 'fluid') => void;
  setActiveTemplateId: (id: string) => void;

  searchBusinesses: (cityName: string) => Promise<void>;
  toggleSelectBusiness: (id: string) => void;
  selectAllInCategory: () => void;
  clearAllSelection: () => void;
  addCustomBusiness: (customData: {
    name: string;
    phone: string;
    category: BusinessCategory;
    gap?: string;
    address?: string;
  }) => void;

  updateTemplate: (updated: PitchTemplate) => void;
  resetTemplates: () => void;
  updateAgencySettings: (settings: Partial<AgencySettings>) => void;

  markQueueStatus: (id: string, status: 'pending' | 'sent' | 'skipped') => void;
  sendPitchToBusiness: (business: Business) => void;
  sendSafeTestPitch: (targetPhone?: string) => void;
  resetQueueStatuses: () => void;
  exportCsv: () => void;
  exportJson: () => void;
  triggerHaptic: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEYS = {
  BUSINESSES: 'leadflow_businesses_v1',
  TEMPLATES: 'leadflow_templates_v1',
  SETTINGS: 'leadflow_settings_v1',
  ACTIVE_TEMPLATE: 'leadflow_active_template_v1',
  VIEW_MODE: 'leadflow_view_mode_v1',
  LAST_CITY: 'leadflow_last_city_v1',
};

const DEFAULT_SETTINGS: AgencySettings = {
  agencyName: 'ScaleBros',
  senderName: 'ScaleBros Team',
  portfolioUrl: 'https://scalebros.com',
  testPhoneNumber: '9842154321',
  autoMarkSent: true,
  useNativeIntent: true,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCity, setCurrentCity] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.LAST_CITY) || 'Bodinayakanur';
  });
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSource, setActiveSource] = useState<'osm' | 'generator' | 'hybrid'>('generator');

  const [activeTab, setActiveTab] = useState<ActiveTab>('discover');
  const [viewMode, setViewMode] = useState<'mobile' | 'fluid'>(() => {
    return (localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as 'mobile' | 'fluid') || 'mobile';
  });

  // Templates
  const [templates, setTemplates] = useState<PitchTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return DEFAULT_TEMPLATES;
  });

  const [activeTemplateId, setActiveTemplateIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_TEMPLATE) || 'tanglish_pro';
  });

  // Agency Settings
  const [agencySettings, setAgencySettings] = useState<AgencySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (_e) {}
    return DEFAULT_SETTINGS;
  });

  // Haptic feedback helper
  const triggerHaptic = useCallback(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch (_e) {}
    }
  }, []);

  // Search businesses function
  const searchBusinesses = useCallback(async (cityName: string) => {
    const queryCity = cityName.trim() || 'Bodinayakanur';
    setIsLoading(true);
    setCurrentCity(queryCity);
    localStorage.setItem(STORAGE_KEYS.LAST_CITY, queryCity);

    try {
      const result = await fetchBusinessesByCity(queryCity);
      // Keep selection if business was already selected
      setBusinesses(result.businesses);
      setActiveSource(result.source);
      // Auto select first 3 businesses as ready starters
      if (result.businesses.length > 0) {
        setBusinesses((prev) =>
          prev.map((b, idx) => (idx < 3 ? { ...b, selected: true } : b))
        );
      }
    } catch (_err) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const savedBiz = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    if (savedBiz) {
      try {
        const parsed = JSON.parse(savedBiz);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBusinesses(parsed);
          return;
        }
      } catch (_e) {}
    }
    // If no saved businesses, run initial search for Bodinayakanur
    searchBusinesses(currentCity);
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (businesses.length > 0) {
      localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
    }
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(agencySettings));
  }, [agencySettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TEMPLATE, activeTemplateId);
  }, [activeTemplateId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
  }, [viewMode]);

  // Active Template
  const activeTemplate = useMemo(() => {
    return templates.find((t) => t.id === activeTemplateId) || templates[0] || DEFAULT_TEMPLATES[0];
  }, [templates, activeTemplateId]);

  const setActiveTemplateId = useCallback((id: string) => {
    setActiveTemplateIdState(id);
    triggerHaptic();
  }, [triggerHaptic]);

  // Selection helpers
  const toggleSelectBusiness = useCallback((id: string) => {
    triggerHaptic();
    setBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, selected: !b.selected } : b))
    );
  }, [triggerHaptic]);

  const selectAllInCategory = useCallback(() => {
    triggerHaptic();
    setBusinesses((prev) =>
      prev.map((b) => {
        if (selectedCategory === 'All' || b.category === selectedCategory) {
          return { ...b, selected: true };
        }
        return b;
      })
    );
  }, [selectedCategory, triggerHaptic]);

  const clearAllSelection = useCallback(() => {
    triggerHaptic();
    setBusinesses((prev) => prev.map((b) => ({ ...b, selected: false })));
  }, [triggerHaptic]);

  const addCustomBusiness = useCallback(
    (customData: {
      name: string;
      phone: string;
      category: BusinessCategory;
      gap?: string;
      address?: string;
    }) => {
      triggerHaptic();
      const phoneRes = normalizePhoneNumber(customData.phone);
      const newBiz: Business = {
        id: `custom-${Date.now()}`,
        name: customData.name,
        category: customData.category,
        city: currentCity,
        address: customData.address || `${currentCity} Market Area`,
        phone: customData.phone,
        formattedPhone: phoneRes.formatted,
        normalizedPhone: phoneRes.normalized,
        gap: (customData.gap as any) || 'Needs AI Video Reels',
        gapReason: 'Custom lead added for testing or direct agency outreach.',
        rating: 5.0,
        reviewCount: 1,
        source: 'custom',
        selected: true,
        queueStatus: 'pending',
      };

      setBusinesses((prev) => [newBiz, ...prev]);
    },
    [currentCity, triggerHaptic]
  );

  // Queue actions
  const markQueueStatus = useCallback(
    (id: string, status: 'pending' | 'sent' | 'skipped') => {
      triggerHaptic();
      setBusinesses((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                queueStatus: status,
                sentAt: status === 'sent' ? new Date().toISOString() : b.sentAt,
              }
            : b
        )
      );
    },
    [triggerHaptic]
  );

  const resetQueueStatuses = useCallback(() => {
    triggerHaptic();
    setBusinesses((prev) =>
      prev.map((b) => ({ ...b, queueStatus: 'pending', sentAt: undefined }))
    );
  }, [triggerHaptic]);

  // Send WhatsApp message to a specific business
  const sendPitchToBusiness = useCallback(
    (business: Business) => {
      triggerHaptic();
      const message = formatPitchMessage(activeTemplate.body, {
        businessName: business.name,
        category: business.category,
        city: business.city || currentCity,
        gap: business.gap,
        agencyName: agencySettings.agencyName,
        senderName: agencySettings.senderName,
      });

      openWhatsAppChat(business.normalizedPhone, message, agencySettings.useNativeIntent);

      if (agencySettings.autoMarkSent) {
        markQueueStatus(business.id, 'sent');
      }
    },
    [activeTemplate, currentCity, agencySettings, markQueueStatus, triggerHaptic]
  );

  // Safe Test Mode: Send test pitch to user's own number
  const sendSafeTestPitch = useCallback(
    (targetPhone?: string) => {
      triggerHaptic();
      const testPhone = targetPhone || agencySettings.testPhoneNumber || '9842154321';
      const sampleBiz = businesses.find((b) => b.selected) || businesses[0] || {
        name: 'Sample Royal Silks & Sarees',
        category: 'Textiles',
        city: currentCity,
        gap: 'Needs AI Video Reels',
      };

      const message = formatPitchMessage(activeTemplate.body, {
        businessName: sampleBiz.name,
        category: sampleBiz.category,
        city: sampleBiz.city || currentCity,
        gap: sampleBiz.gap,
        agencyName: agencySettings.agencyName,
        senderName: agencySettings.senderName,
      });

      const phoneRes = normalizePhoneNumber(testPhone);
      openWhatsAppChat(phoneRes.normalized, message, agencySettings.useNativeIntent);
    },
    [agencySettings, businesses, currentCity, activeTemplate, triggerHaptic]
  );

  // Template modifications
  const updateTemplate = useCallback(
    (updated: PitchTemplate) => {
      triggerHaptic();
      setTemplates((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    },
    [triggerHaptic]
  );

  const resetTemplates = useCallback(() => {
    triggerHaptic();
    setTemplates(DEFAULT_TEMPLATES);
    setActiveTemplateIdState(DEFAULT_TEMPLATES[0].id);
  }, [triggerHaptic]);

  const updateAgencySettings = useCallback(
    (newSettings: Partial<AgencySettings>) => {
      triggerHaptic();
      setAgencySettings((prev) => ({ ...prev, ...newSettings }));
    },
    [triggerHaptic]
  );

  // Selected businesses and queue
  const selectedBusinesses = useMemo(
    () => businesses.filter((b) => b.selected),
    [businesses]
  );

  const selectedCount = selectedBusinesses.length;

  const queueBusinesses = useMemo(
    () => businesses.filter((b) => b.selected),
    [businesses]
  );

  const sentCount = useMemo(
    () => queueBusinesses.filter((b) => b.queueStatus === 'sent').length,
    [queueBusinesses]
  );

  const pendingCount = useMemo(
    () => queueBusinesses.filter((b) => b.queueStatus === 'pending').length,
    [queueBusinesses]
  );

  const skippedCount = useMemo(
    () => queueBusinesses.filter((b) => b.queueStatus === 'skipped').length,
    [queueBusinesses]
  );

  // CSV Export
  const exportCsv = useCallback(() => {
    triggerHaptic();
    const rows = [
      ['ID', 'Business Name', 'Category', 'City', 'Phone', 'Normalized Phone', 'Gap Detected', 'Queue Status', 'Sent At'],
      ...businesses.map((b) => [
        b.id,
        `"${b.name.replace(/"/g, '""')}"`,
        b.category,
        b.city,
        b.formattedPhone,
        b.normalizedPhone,
        `"${b.gap}"`,
        b.queueStatus,
        b.sentAt || '',
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ScaleBros_${currentCity}_Leads.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [businesses, currentCity, triggerHaptic]);

  // JSON Export
  const exportJson = useCallback(() => {
    triggerHaptic();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(businesses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ScaleBros_${currentCity}_Leads.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [businesses, currentCity, triggerHaptic]);

  return (
    <AppContext.Provider
      value={{
        businesses,
        currentCity,
        selectedCategory,
        searchQuery,
        isLoading,
        activeSource,
        selectedBusinesses,
        selectedCount,
        activeTab,
        viewMode,
        templates,
        activeTemplate,
        activeTemplateId,
        agencySettings,
        queueBusinesses,
        sentCount,
        pendingCount,
        skippedCount,
        setCurrentCity,
        setSelectedCategory,
        setSearchQuery,
        setActiveTab,
        setViewMode,
        setActiveTemplateId,
        searchBusinesses,
        toggleSelectBusiness,
        selectAllInCategory,
        clearAllSelection,
        addCustomBusiness,
        updateTemplate,
        resetTemplates,
        updateAgencySettings,
        markQueueStatus,
        sendPitchToBusiness,
        sendSafeTestPitch,
        resetQueueStatuses,
        exportCsv,
        exportJson,
        triggerHaptic,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
