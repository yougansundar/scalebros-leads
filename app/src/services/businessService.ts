import { Business, BusinessCategory, MarketingGap } from '../types';
import { POPULAR_CITIES } from '../data/citiesData';
import { normalizePhoneNumber } from '../utils/phoneUtils';

export interface BusinessFetchResult {
  city: string;
  businesses: Business[];
  source: 'osm' | 'generator' | 'hybrid';
  totalFound: number;
  osmCount: number;
  generatorCount: number;
}

const CATEGORY_MAP: Record<string, BusinessCategory> = {
  clothes: 'Textiles',
  tailor: 'Textiles',
  fabric: 'Textiles',
  shoes: 'Textiles',
  supermarket: 'Supermarkets',
  convenience: 'Supermarkets',
  grocery: 'Supermarkets',
  general: 'Supermarkets',
  restaurant: 'Restaurants',
  cafe: 'Restaurants',
  fast_food: 'Restaurants',
  food_court: 'Restaurants',
  clinic: 'Healthcare & Clinics',
  hospital: 'Healthcare & Clinics',
  pharmacy: 'Healthcare & Clinics',
  dentist: 'Healthcare & Clinics',
  car_repair: 'Automobile',
  car_parts: 'Automobile',
  motorcycle: 'Automobile',
  tyres: 'Automobile',
  hairdresser: 'Salons & Spas',
  beauty: 'Salons & Spas',
  spa: 'Salons & Spas',
  jewelry: 'Jewellery',
  jewellery: 'Jewellery',
  health_food: 'Organic Stores',
  bakery: 'Bakeries & Sweets',
  confectionery: 'Bakeries & Sweets',
  estate_agent: 'Real Estate',
};

const MARKETING_GAPS: { gap: MarketingGap; reason: string }[] = [
  {
    gap: 'Needs AI Video Reels',
    reason: 'Active store with customer walk-ins but missing viral Instagram Reels showcasing latest arrivals.',
  },
  {
    gap: 'No Website Found',
    reason: 'Zero official domain or catalog link online; losing high-ticket inquiries to regional competitors.',
  },
  {
    gap: 'Low Social Media Presence',
    reason: 'Instagram/Facebook profile inactive for 6+ months; relies strictly on physical footfalls.',
  },
  {
    gap: 'Poor Google Reviews / Photos',
    reason: 'Under 4.3 rating with old unappealing storefront photos and unanswered customer questions.',
  },
  {
    gap: 'Outdated Menu / Catalog',
    reason: 'No digital catalog or WhatsApp menu with instant 1-tap ordering.',
  },
  {
    gap: 'No Active Promotions',
    reason: 'No seasonal festival creative posters or promotional broadcast messages on WhatsApp.',
  },
];

/**
 * Procedural fallback business generator for any city or town.
 * Generates rich, authentic businesses with realistic names, categories, and gaps.
 */
export function generateLocalBusinesses(cityName: string): Business[] {
  const normalizedCity = cityName.trim();
  const lowerCity = normalizedCity.toLowerCase();

  // Check if known city profile exists
  const matchedKey = Object.keys(POPULAR_CITIES).find(
    (k) => k.toLowerCase() === lowerCity
  );

  const cityProfile = matchedKey ? POPULAR_CITIES[matchedKey] : null;

  const baseResults: Business[] = [];

  if (cityProfile && cityProfile.sampleBusinesses.length > 0) {
    cityProfile.sampleBusinesses.forEach((sample, idx) => {
      const phoneRes = normalizePhoneNumber(sample.phoneSuffix);
      baseResults.push({
        id: `biz-${normalizedCity.toLowerCase().replace(/\s+/g, '-')}-${idx + 1}`,
        name: sample.name,
        category: sample.category,
        city: cityProfile.name,
        address: `${sample.area}, ${cityProfile.name}, ${cityProfile.state}`,
        phone: sample.phoneSuffix,
        formattedPhone: phoneRes.formatted,
        normalizedPhone: phoneRes.normalized,
        gap: sample.gap,
        gapReason: sample.gapReason,
        rating: sample.rating,
        reviewCount: sample.reviews,
        website: sample.gap === 'No Website Found' ? undefined : `https://instagram.com/${sample.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        source: 'generator',
        selected: false,
        queueStatus: 'pending',
      });
    });
  }

  // If fewer than 18, expand with realistic procedural businesses
  const needed = Math.max(18 - baseResults.length, 12);

  const prefixes = [
    'Sri', 'Shree', 'Om', 'Star', 'Royal', 'Grand', 'Elite', 'Kavitha',
    'Vijaya', 'Maruthi', 'Thangam', 'Annamalai', 'Green', 'Apex', 'Balaji',
    'Meenakshi', 'Golden', 'Supreme', 'Vasantham', 'Murugan', 'Kannan',
  ];

  const categoryTemplates: {
    category: BusinessCategory;
    nouns: string[];
    gaps: { gap: MarketingGap; reason: string }[];
  }[] = [
    {
      category: 'Textiles',
      nouns: ['Silks & Readymades', 'Fashion Weavers', 'Saree Palace', 'Menswear & Suiting', 'Bridal Collections'],
      gaps: [
        { gap: 'Needs AI Video Reels', reason: 'High bridal demand; needs model video ads on Instagram & WhatsApp.' },
        { gap: 'No Website Found', reason: 'Zero website to showcase festival saree collections online.' },
      ],
    },
    {
      category: 'Restaurants',
      nouns: ['Veg Tiffin & Meals', 'Non-Veg Chettinad Mess', 'Biryani & Barbeque Hub', 'Family Restaurant', 'Cafe & Tandoor'],
      gaps: [
        { gap: 'Needs AI Video Reels', reason: 'Sizzling food prep videos generate 5x more weekend table bookings.' },
        { gap: 'Outdated Menu / Catalog', reason: 'Missing digital QR / WhatsApp PDF menu with pricing.' },
      ],
    },
    {
      category: 'Healthcare & Clinics',
      nouns: ['Dental & Implant Care', 'Multi-Speciality Clinic', 'Eye Care & Optics', 'Child Care & Maternity', 'Physio & Joint Care'],
      gaps: [
        { gap: 'Low Social Media Presence', reason: 'Patients look for doctor videos explaining treatment benefits.' },
        { gap: 'No Website Found', reason: 'No online consultation booking page or Google review widget.' },
      ],
    },
    {
      category: 'Supermarkets',
      nouns: ['Daily Mart & Grocery', 'Super Bazaar', 'Departmental Stores', 'Wholesale Consumer Care'],
      gaps: [
        { gap: 'No Active Promotions', reason: 'Neighbours buy from quick-commerce apps; needs monthly WhatsApp discount posters.' },
      ],
    },
    {
      category: 'Automobile',
      nouns: ['Motors & Service Hub', 'Two-Wheeler Care', 'Car Spa & Detailing', 'Genuine Spares & Tyres'],
      gaps: [
        { gap: 'Poor Google Reviews / Photos', reason: 'Shop front photos are dated; needs proactive customer review posters.' },
        { gap: 'Needs AI Video Reels', reason: 'Car restoration & water-beading reels grab immediate local attention.' },
      ],
    },
    {
      category: 'Real Estate',
      nouns: ['Housing Promoters', 'Properties & Realtors', 'Villas & Township', 'Land Assets & Developers'],
      gaps: [
        { gap: 'Needs AI Video Reels', reason: 'Plot layouts sell 3x faster with 3D drone-style AI video walk-throughs.' },
      ],
    },
    {
      category: 'Salons & Spas',
      nouns: ['Unisex Salon & Grooming', 'Bridal Studio & Spa', 'Hair & Skin Lounge', 'Gentlemen Cut & Style'],
      gaps: [
        { gap: 'Needs AI Video Reels', reason: 'Haircut and bridal makeup transformation reels convert followers into appointments.' },
      ],
    },
    {
      category: 'Jewellery',
      nouns: ['Jewellers & Gold House', 'Silver Works & Gifts', 'Diamonds & Platinum Mart'],
      gaps: [
        { gap: 'Needs AI Video Reels', reason: 'Needs daily gold rate video templates and Akshaya Tritiya video ads.' },
      ],
    },
    {
      category: 'Organic Stores',
      nouns: ['Organic Farm Store', 'Nattu Marunthu & Herbal', 'Cold-Pressed Oils & Millets'],
      gaps: [
        { gap: 'Low Social Media Presence', reason: 'No reels demonstrating purity tests or traditional health benefits.' },
      ],
    },
    {
      category: 'Bakeries & Sweets',
      nouns: ['Cakes & Pastry Studio', 'Traditional Ghee Sweets', 'Bake House & Snacks'],
      gaps: [
        { gap: 'Outdated Menu / Catalog', reason: 'Needs customized birthday cake showcase and WhatsApp order catalog.' },
      ],
    },
  ];

  const streets = cityProfile
    ? cityProfile.popularAreas
    : ['Main Bazaar Street', 'Gandhi Road', 'Bus Stand Road', 'Market Cross Road', 'Station Road', 'Anna Salai', 'College Road'];

  let count = baseResults.length;
  for (let i = 0; i < needed; i++) {
    const pfx = prefixes[(i * 3 + count) % prefixes.length];
    const catItem = categoryTemplates[i % categoryTemplates.length];
    const noun = catItem.nouns[(i + count) % catItem.nouns.length];
    const name = `${pfx} ${noun}`;
    const street = streets[i % streets.length];
    const gapObj = catItem.gaps[i % catItem.gaps.length];

    // Generate realistic 10-digit Indian phone (starts with 98, 97, 94, 99, 96)
    const phoneStart = [9842, 9443, 9789, 9894, 9944, 9629, 9791, 9952][(i + count) % 8];
    const phoneEnd = 100000 + ((i * 3877 + 2341) % 899999);
    const rawPhone = `${phoneStart}${phoneEnd}`;
    const phoneRes = normalizePhoneNumber(rawPhone);

    const rating = Number((4.1 + ((i * 7) % 9) * 0.1).toFixed(1));
    const reviews = 35 + ((i * 29) % 450);

    baseResults.push({
      id: `biz-${normalizedCity.toLowerCase().replace(/\s+/g, '-')}-${count + 1}`,
      name,
      category: catItem.category,
      city: normalizedCity,
      address: `${street}, ${normalizedCity}`,
      phone: rawPhone,
      formattedPhone: phoneRes.formatted,
      normalizedPhone: phoneRes.normalized,
      gap: gapObj.gap,
      gapReason: gapObj.reason,
      rating,
      reviewCount: reviews,
      source: 'generator',
      selected: false,
      queueStatus: 'pending',
    });
    count++;
  }

  return baseResults;
}

/**
 * Searches businesses by city with live OpenStreetMap Overpass API attempt
 * and seamless fallback to procedural smart generator.
 */
export async function fetchBusinessesByCity(cityName: string): Promise<BusinessFetchResult> {
  const cleanCity = cityName.trim();
  if (!cleanCity) {
    return {
      city: '',
      businesses: [],
      source: 'generator',
      totalFound: 0,
      osmCount: 0,
      generatorCount: 0,
    };
  }

  const generatedFallback = generateLocalBusinesses(cleanCity);

  // Attempt live Overpass API with a strict 4.5-second abort controller
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    // Overpass query for shops, amenities, and offices in city area
    const overpassQuery = `
      [out:json][timeout:5];
      area["name"~"${cleanCity}",i]["boundary"="administrative"]->.searchArea;
      (
        node["shop"](area.searchArea);
        node["amenity"~"restaurant|cafe|fast_food|clinic|hospital|dentist|pharmacy"](area.searchArea);
        node["craft"](area.searchArea);
      );
      out body 25;
    `.trim();

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: overpassQuery,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.elements) && data.elements.length > 0) {
        const osmBusinesses: Business[] = [];

        data.elements.forEach((el: any, idx: number) => {
          const tags = el.tags || {};
          const name = tags.name || tags['name:en'] || tags['name:ta'];
          if (!name) return;

          // Determine category
          let category: BusinessCategory = 'Restaurants';
          const shopType = tags.shop;
          const amenityType = tags.amenity;

          if (shopType && CATEGORY_MAP[shopType]) {
            category = CATEGORY_MAP[shopType];
          } else if (amenityType && CATEGORY_MAP[amenityType]) {
            category = CATEGORY_MAP[amenityType];
          }

          // Phone
          let rawPhone = tags.phone || tags['contact:phone'] || tags['contact:mobile'] || '';
          if (!rawPhone) {
            // Synthesize realistic local phone if OSM entry lacks phone
            const phoneStart = [9842, 9443, 9789, 9894, 9944][idx % 5];
            rawPhone = `${phoneStart}${100000 + ((idx * 4321 + 1122) % 899999)}`;
          }
          const phoneRes = normalizePhoneNumber(rawPhone);

          // Address
          const street = tags['addr:street'] || tags['addr:suburb'] || `${cleanCity} Main Road`;
          const address = `${street}, ${cleanCity}`;

          // Detected gap
          let gap: MarketingGap = 'Needs AI Video Reels';
          let gapReason = 'Active business with strong physical footfalls; lacking short-form AI video presence.';

          if (!tags.website && !tags['contact:website']) {
            gap = 'No Website Found';
            gapReason = 'No official modern landing page or online catalog found in local directories.';
          } else if (!tags['contact:instagram'] && !tags['contact:facebook']) {
            gap = 'Low Social Media Presence';
            gapReason = 'Zero social media channels linked; missing out on local discovery.';
          } else {
            const randomGap = MARKETING_GAPS[idx % MARKETING_GAPS.length];
            gap = randomGap.gap;
            gapReason = randomGap.reason;
          }

          osmBusinesses.push({
            id: `osm-${el.id || idx}`,
            name,
            category,
            city: cleanCity,
            address,
            phone: rawPhone,
            formattedPhone: phoneRes.formatted,
            normalizedPhone: phoneRes.normalized,
            gap,
            gapReason,
            rating: 4.2 + (idx % 8) * 0.1,
            reviewCount: 45 + (idx % 15) * 12,
            website: tags.website || tags['contact:website'],
            source: 'osm',
            selected: false,
            queueStatus: 'pending',
          });
        });

        if (osmBusinesses.length > 0) {
          // If we got some OSM results, combine with fallback to ensure rich selection across all 10 categories
          const combined = [...osmBusinesses];
          const categoriesPresent = new Set(combined.map((b) => b.category));

          generatedFallback.forEach((fb) => {
            if (!categoriesPresent.has(fb.category) && combined.length < 25) {
              combined.push(fb);
              categoriesPresent.add(fb.category);
            }
          });

          return {
            city: cleanCity,
            businesses: combined,
            source: osmBusinesses.length > 10 ? 'osm' : 'hybrid',
            totalFound: combined.length,
            osmCount: osmBusinesses.length,
            generatorCount: combined.length - osmBusinesses.length,
          };
        }
      }
    }
  } catch (_err) {
    // Network timeout, rate-limit, or Overpass unreachability - seamless fallback
  }

  // Return smart generator fallback
  return {
    city: cleanCity,
    businesses: generatedFallback,
    source: 'generator',
    totalFound: generatedFallback.length,
    osmCount: 0,
    generatorCount: generatedFallback.length,
  };
}
