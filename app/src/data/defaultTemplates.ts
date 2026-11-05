import { PitchTemplate } from '../types';

export const DEFAULT_TEMPLATES: PitchTemplate[] = [
  {
    id: 'tanglish_pro',
    name: 'Tanglish Pro (High Engagement)',
    language: 'tanglish',
    badgeLabel: 'Tanglish',
    description: 'Casual, high-converting Tamil-English blend. Ideal for shop owners & local businesses in Tamil Nadu.',
    body: `Vanakkam {business_name} team! 🙏

Naan {agency_name}-la irundhu pesren. Unga {category} business in {city}-ku periya growth potential iruku! 🚀

Naanga unga digital profile analyze pannom, oru important gap notice pannom:
👉 *{gap}*

Ippo ellam customers Instagram & WhatsApp-la AI Reels & Videos paathu dhaan unga store-ku varanga.

Naanga local {category} businesses-ku help pandrom:
🎬 High-Converting AI Ad Videos (Reels & Shorts)
🎨 Creative Social Media Posters & Festival Offers
🚀 Modern High-Speed Website & Google Ranking

Unga {business_name}-ku oru *FREE 15-Second Sample AI Video Ad* ready panni kaatalaama? No charge! 

Just reply *'YES'* here on WhatsApp, sample video anuparen! 🔥`,
    isDefault: true,
  },
  {
    id: 'tamil_pure',
    name: 'Pure Tamil (Formal & Respectful)',
    language: 'tamil',
    badgeLabel: 'தமிழ்',
    description: 'Respectful, formal Tamil script. Excellent for traditional textiles, jewellers, and healthcare clinics.',
    body: `வணக்கம் {business_name} நிர்வாகத்தினருக்கு! 🙏

நாங்கள் {agency_name} நிறுவனத்தில் இருந்து தொடர்பு கொள்கிறோம். {city}-ல் சிறந்த முறையில் இயங்கி வரும் உங்கள் {category} நிறுவனத்தின் வளர்ச்சிக்கு எங்கள் மனமார்ந்த வாழ்த்துகள்! 💐

உங்கள் ஆன்லைன் விளம்பர அமைப்பை ஆய்வு செய்தபோது:
👉 *{gap}* இருப்பது கவனத்திற்கு வந்தது.

இன்றைய காலகட்டத்தில் வாடிக்கையாளர்களை அதிக அளவில் ஈர்க்க:
🎬 பிரத்யேக AI விளம்பர வீடியோக்கள் & Instagram Reels
🎨 கண்கவர் திருவிழா & பண்டிகை சமூக வலைத்தள போஸ்டர்கள்
🌐 நவீன மொபைல் வலைத்தளம் & கூகுள் மேப் மேலாண்மை

உங்கள் {business_name} நிறுவனத்திற்கு ஒரு *இலவச மாதிரி AI வீடியோ விளம்பரத்தை (Free Sample Reel)* தயாரித்து அனுப்ப விரும்புகிறோம்.

இதை பார்க்க விருப்பமா? உடனே *'DEMO'* என இந்த வாட்ஸ்அப்பில் பதில் அனுப்பவும்! 🚀`,
  },
  {
    id: 'english_agency',
    name: 'English Agency (ROI & Growth)',
    language: 'english',
    badgeLabel: 'English',
    description: 'Professional, results-driven copy focusing on footfalls, ROI, and outranking competitors.',
    body: `Hi {business_name} Team,

I came across your {category} in {city} and was really impressed by your reputation!

While reviewing your online presence, our agency team noticed an immediate growth opportunity:
👉 *{gap}*

Most leading businesses in {city} are generating 3x more local inquiries and walk-ins using short AI Video Reels and high-converting mobile pages.

At {agency_name}, we help {category} brands with:
⚡ Cinematic AI Ad Videos (Customized for Instagram & WhatsApp Status)
⚡ Daily Brand Posters & Festival Creative Packages
⚡ Ultra-fast Mobile Websites with Direct WhatsApp Order Buttons

Would you be open to seeing a *100% Free Custom AI Video Ad Concept* we crafted for {business_name}? No obligations at all.

Best regards,
{sender_name}
{agency_name}`,
  },
  {
    id: 'free_ai_demo',
    name: 'Free AI Video Demo Hook',
    language: 'offer',
    badgeLabel: 'Free Offer',
    description: 'Irresistible free value upfront. Creates curiosity and prompts instant 1-tap replies.',
    body: `Hey {business_name}! 🚀 Quick gift for you.

We noticed *{gap}* for your {category} in {city}.

To show you what's possible, our creative team already generated a **Free 15-second Sample AI Video Reel** showcasing {business_name} to help bring you more customers this weekend! 🎥✨

Can I send over the preview video link here on WhatsApp?

Just drop a quick thumbs up 👍 or reply *'SEND'*!`,
  },
];

export const AVAILABLE_VARIABLES = [
  { key: '{business_name}', label: 'Business Name', example: 'Sri Murugan Silks' },
  { key: '{category}', label: 'Category', example: 'Textiles' },
  { key: '{city}', label: 'City / Town', example: 'Bodinayakanur' },
  { key: '{gap}', label: 'Detected Gap', example: 'Needs AI Video Reels' },
  { key: '{agency_name}', label: 'Your Agency', example: 'Nexus Digital Media' },
  { key: '{sender_name}', label: 'Your Name', example: 'Karthik' },
];

/**
 * Replaces all placeholder tokens with actual business and agency metadata.
 */
export function formatPitchMessage(
  templateBody: string,
  params: {
    businessName: string;
    category: string;
    city: string;
    gap: string;
    agencyName: string;
    senderName: string;
  }
): string {
  return templateBody
    .replace(/{business_name}/g, params.businessName || 'Business')
    .replace(/{category}/g, params.category || 'Business')
    .replace(/{city}/g, params.city || 'your area')
    .replace(/{gap}/g, params.gap || 'Digital Presence Gap')
    .replace(/{agency_name}/g, params.agencyName || 'Our Agency')
    .replace(/{sender_name}/g, params.senderName || 'Team');
}
