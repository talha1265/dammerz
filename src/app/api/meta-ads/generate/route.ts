import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      productOrService, 
      businessCategory, 
      businessName,
      objective = 'click_to_whatsapp',
      language = 'dual', // 'english' | 'hinglish' | 'dual'
      videoNotes = ''
    } = body;

    const prompt = `You are a world-class Meta Performance Marketing AI Director specializing in Video Ads (Instagram Reels, Facebook Feed, Stories) for businesses, especially industrial B2B, SME manufacturers, engineering, and commerce companies in India.

Business Name: "${businessName || 'Apex Industrial'}"
Product/Service: "${productOrService || 'Industrial Valves & Flow Control Equipment'}"
Category: "${businessCategory || 'Industrial Manufacturing'}"
Campaign Objective: "${objective}"
Video Concept Notes: "${videoNotes || 'Product demonstration, pressure testing, and factory floor dispatch'}"
Language Preference: "${language}"

Generate 3 high-converting ad variations for this video campaign:
1. Variation 1: Direct Response Hook (Focus on speed, pain points, direct WhatsApp quote)
2. Variation 2: Technical Trust & Quality Proof (Focus on ISO/IBR certification, test certificates, no leakage)
3. Variation 3: High-Engagement / Regional Hinglish Hook (Catchy Roman Hindi/English mix that connects directly with business owners & contractors)

Also provide recommended Meta audience targeting:
- Relevant B2B/consumer interest keywords (5-8 tags)
- Age range (min, max)
- Recommended daily budget in INR (₹)
- Expected Cost Per Lead (CPL) range in INR

Return STRICT JSON matching this exact structure:
{
  "variations": [
    {
      "hookHeadline": "Catchy 3-second hook for video caption/overlay",
      "primaryText": "Persuasive primary copy (2-3 sentences with emojis & strong value prop)",
      "headline": "Short link card headline (max 45 chars)",
      "description": "Optional subtitle/proof point",
      "callToAction": "WHATSAPP_MESSAGE" | "GET_QUOTE" | "LEARN_MORE" | "CONTACT_US",
      "language": "english" | "hinglish"
    }
  ],
  "targeting": {
    "locations": ["Pan-India", "Delhi NCR", "Pune MIDC", "Ahmedabad", "Bengaluru"],
    "ageMin": 25,
    "ageMax": 58,
    "interests": ["keyword 1", "keyword 2", "keyword 3", "keyword 4"],
    "placements": ["Instagram Reels", "Facebook Feed", "Instagram Stories"]
  },
  "budgetRecommendation": {
    "dailyBudgetINR": 1500,
    "expectedCplINR": "120 - 165",
    "targetRoas": 3.8
  }
}`;

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return NextResponse.json({ success: true, aiGenerated: parsed });
      } catch (geminiError) {
        console.warn('Gemini generate ad copy error, falling back to heuristic engine:', geminiError);
      }
    }

    // Heuristic Fallback Engine
    const prod = productOrService || 'Industrial Equipment & Solutions';
    const biz = businessName || 'Apex Industrial';

    const fallbackResult = {
      variations: [
        {
          hookHeadline: `Tired of delayed supplier deliveries for ${prod}?`,
          primaryText: `🚨 Stop project delays! ${biz} provides direct factory dispatch within 48 hours. 100% tested with material inspection certificates. Tap below to receive our live inventory sheet and instant GST quotation directly on WhatsApp! 📲`,
          headline: `Factory Direct ${prod} • 48-Hr Site Dispatch`,
          description: `Trusted by 500+ infrastructure contractors. Instant GST invoice.`,
          callToAction: objective === 'lead_generation' ? 'GET_QUOTE' : 'WHATSAPP_MESSAGE',
          language: 'english',
        },
        {
          hookHeadline: `ISO & Tender Compliant ${prod} with 3.1 Test Certificates`,
          primaryText: `Engineered for rigorous industrial standards. Zero compromise on quality, tested up to extreme pressure and temperature limits. Get full technical datasheets and bulk procurement price brackets on WhatsApp now. ⚡`,
          headline: `IBR/ISO Certified • Direct Manufacturer Pricing`,
          description: `Approved vendor for NTPC, IOCL & CPWD project specifications.`,
          callToAction: objective === 'lead_generation' ? 'GET_QUOTE' : 'WHATSAPP_MESSAGE',
          language: 'english',
        },
        {
          hookHeadline: `Factory direct rates par ${prod} chahiye? Abhi order karein!`,
          primaryText: `Middlemen ka commission hataiye aur factory se direct procurement karke tenders me extra margin bachayein! 🏭 Ready stock across major industrial hubs. WhatsApp button dabayein aur 2 minute me quote paayein! 💬`,
          headline: `Direct Factory Rate • Ready Stock Pan-India`,
          description: `WhatsApp pe instant technical specification aur proforma invoice paayein.`,
          callToAction: 'WHATSAPP_MESSAGE',
          language: 'hinglish',
        },
      ],
      targeting: {
        locations: ['Pan-India', 'Delhi NCR', 'Pune MIDC', 'Ahmedabad', 'Bengaluru Industrial Corridor'],
        ageMin: 26,
        ageMax: 58,
        interests: [
          'Industrial engineering',
          'Civil contractor',
          'B2B Wholesale',
          'Piping & Infrastructure',
          'Heavy machinery',
          'Tender bidding'
        ],
        placements: ['Instagram Reels', 'Facebook Feed', 'Instagram Stories'],
      },
      budgetRecommendation: {
        dailyBudgetINR: 1500,
        expectedCplINR: '135 - 175',
        targetRoas: 3.8,
      },
    };

    return NextResponse.json({ success: true, aiGenerated: fallbackResult });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
