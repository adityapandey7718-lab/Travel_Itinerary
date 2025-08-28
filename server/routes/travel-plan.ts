import { RequestHandler } from "express";

interface TravelPlanRequest {
  from_city: string;
  to_city: string;
  budget: number;
  currency: string;
  duration: number;
  travelers: number;
}

interface TravelPlanResponse {
  success: boolean;
  plan?: {
    destination: string;
    overview: string;
    places_to_visit: string[];
    restaurants: string;
    maps: {
      static_map_url?: string;
      interactive_map?: string;
    };
    attractive_places: string;
    travel_methods: string;
    budget_breakdown: string;
    detailed_itinerary: string;
  };
  error?: string;
}

// Currency conversion rates to INR
const CURRENCY_RATES = {
  "INR": 1.0,
  "USD": 83.0,
  "EUR": 89.0,
  "GBP": 105.0,
  "AED": 22.6
};

/**
 * Remove unwanted formatting symbols from AI text outputs while preserving new lines and readability.
 */
function sanitizeAiText(text: string): string {
  if (!text) return text;
  // Remove common markdown/formatting symbols: asterisks, hashes, backticks, pipes
  const withoutSymbols = text.replace(/[\*#`|]/g, "");
  // Remove bullet unicode characters
  const withoutBullets = withoutSymbols.replace(/[\u2022\u25CF\u25AA]/g, "");
  // Normalize excessive spaces but keep newlines
  const normalized = withoutBullets.replace(/[\t\r]/g, "").replace(/ {2,}/g, " ");
  return normalized.trim();
}

// Budget categories based on per person per day in INR
const BUDGET_CATEGORIES = {
  budget: 1000,
  "mid-range": 3000,
  luxury: 8000
};

function convertToINR(amount: number, currency: string): number {
  return amount * (CURRENCY_RATES[currency as keyof typeof CURRENCY_RATES] || 1.0);
}

function getBudgetCategory(budgetINR: number, days: number, travelers: number): string {
  const perPersonPerDay = budgetINR / (days * travelers);
  
  if (perPersonPerDay < BUDGET_CATEGORIES.budget) {
    return "very_low";
  } else if (perPersonPerDay < BUDGET_CATEGORIES["mid-range"]) {
    return "budget";
  } else if (perPersonPerDay < BUDGET_CATEGORIES.luxury) {
    return "mid-range";
  } else {
    return "luxury";
  }
}

function createBudgetBreakdown(totalBudget: number, category: string) {
  let breakdown;
  
  if (category === "budget" || category === "very_low") {
    breakdown = {
      accommodation: totalBudget * 0.35,
      food: totalBudget * 0.25,
      transport: totalBudget * 0.20,
      activities: totalBudget * 0.15,
      miscellaneous: totalBudget * 0.05
    };
  } else if (category === "mid-range") {
    breakdown = {
      accommodation: totalBudget * 0.40,
      food: totalBudget * 0.25,
      transport: totalBudget * 0.15,
      activities: totalBudget * 0.15,
      miscellaneous: totalBudget * 0.05
    };
  } else { // luxury
    breakdown = {
      accommodation: totalBudget * 0.45,
      food: totalBudget * 0.20,
      transport: totalBudget * 0.15,
      activities: totalBudget * 0.15,
      miscellaneous: totalBudget * 0.05
    };
  }

  return breakdown;
}

function generateMockTravelPlan(body: any): TravelPlanResponse {
  const { from_city, to_city, budget, currency, duration, travelers } = body || {};
  const budgetINR = typeof budget === 'number' ? convertToINR(budget, currency || 'INR') : 0;
  const budgetCategory = budgetINR && duration && travelers ? getBudgetCategory(budgetINR, duration, travelers) : 'budget';
  const breakdown = budgetINR ? createBudgetBreakdown(budgetINR, budgetCategory) : { accommodation: 0, food: 0, transport: 0, activities: 0, miscellaneous: 0 };

  const overview = sanitizeAiText(`A pleasant trip from ${from_city || 'your city'} to ${to_city || 'destination'} over ${duration || '?'} days for ${travelers || '?'} travelers.`);
  const attractivePlaces = sanitizeAiText(`1. Central Park - Relaxing green space.\n2. City Museum - Local history and culture.`);
  const restaurants = sanitizeAiText(`Breakfast: Cozy Cafe; Lunch: Downtown Deli; Dinner: Riverside Grill.`);
  const travelMethods = sanitizeAiText(`Flights, trains, and local taxis are available with budget options for ${budgetCategory}.`);
  const budgetBreakdownText = sanitizeAiText(`Accommodation: ₹${Math.round(breakdown.accommodation).toLocaleString('en-IN')}\nFood: ₹${Math.round(breakdown.food).toLocaleString('en-IN')}\nTransport: ₹${Math.round(breakdown.transport).toLocaleString('en-IN')}\nActivities: ₹${Math.round(breakdown.activities).toLocaleString('en-IN')}\nMiscellaneous: ₹${Math.round(breakdown.miscellaneous).toLocaleString('en-IN')}`);
  const detailedItinerary = sanitizeAiText(`Day 1: Arrival and city walk. Day 2: Museums and markets. Day 3: Parks and riverfront.`);

  return {
    success: true,
    plan: {
      destination: to_city || 'destination',
      overview,
      places_to_visit: [],
      restaurants,
      maps: {},
      attractive_places: attractivePlaces,
      travel_methods: travelMethods,
      budget_breakdown: budgetBreakdownText,
      detailed_itinerary: detailedItinerary,
    },
  };
}

async function getCoordinates(city: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // Try Google Maps API first
    const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY;
    if (googleMapsKey) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${googleMapsKey}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
          }
        }
      } catch (googleError) {
        console.log('Google Maps API failed, trying Geoapify fallback:', googleError);
      }
    }

    // Fallback to Geoapify
    const geoapifyKey = process.env.GEOAPIFY_API_KEY;
    if (!geoapifyKey) return null;

    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&apiKey=${geoapifyKey}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const coords = data.features[0].geometry.coordinates;
      return { lat: coords[1], lng: coords[0] };
    }

    return null;
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return null;
  }
}

async function getStaticMap(lat: number, lng: number): Promise<string | null> {
  try {
    // Try Google Maps API first
    const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY;
    if (googleMapsKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=12&size=600x400&markers=color:red%7C${lat},${lng}&key=${googleMapsKey}`;

        // Test if the URL works by making a HEAD request
        const testResponse = await fetch(url, { method: 'HEAD' });
        if (testResponse.ok) {
          return url;
        }
      } catch (googleError) {
        console.log('Google Maps static map failed, trying Geoapify fallback:', googleError);
      }
    }

    // Fallback to Geoapify
    const geoapifyKey = process.env.GEOAPIFY_API_KEY;
    if (!geoapifyKey) return null;

    const url = `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${lng},${lat}&zoom=12&marker=lonlat:${lng},${lat};type:material;color:%23ff0000;size:large&apiKey=${geoapifyKey}`;

    return url;
  } catch (error) {
    console.error('Error creating static map:', error);
    return null;
  }
}

// Simple rate limiting
let lastCallTime = 0;
const MIN_INTERVAL = 2000; // 2 seconds between calls

async function callGeminiAI(prompt: string): Promise<string> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error("Gemini API key not configured");
  }

  // Validate prompt
  if (!prompt || prompt.length > 30000) {
    throw new Error("Invalid prompt: too long or empty");
  }

  // Rate limiting
  const now = Date.now();
  if (now - lastCallTime < MIN_INTERVAL) {
    const waitTime = MIN_INTERVAL - (now - lastCallTime);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  lastCallTime = Date.now();

      try {
      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4000,
        }
      };

      console.log('Sending request to Gemini API:', {
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`,
        promptLength: prompt.length,
        requestBody
      });

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

    if (!response.ok) {
      let errorMessage = `Gemini API error: ${response.status} - ${response.statusText}`;
      
      try {
        const errorData = await response.text();
        console.error('Gemini API error response:', errorData);
        
        if (response.status === 429) {
          errorMessage = "Gemini API rate limit exceeded. Please wait a few minutes and try again.";
        } else if (response.status === 400) {
          errorMessage = `Gemini API bad request: ${errorData}`;
        } else if (response.status === 403) {
          errorMessage = "Gemini API key invalid or quota exceeded. Please check your API key.";
        }
      } catch (parseError) {
        console.error('Could not parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    const aiResponse = await response.json();
    
    if (!aiResponse.candidates || !aiResponse.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini AI');
    }

    return aiResponse.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini AI call failed:', error);
    throw error;
  }
}

async function generatePlanViaGemini(params: {
  from_city: string;
  to_city: string;
  budgetINR: number;
  currency: string;
  budget: number;
  duration: number;
  travelers: number;
  budgetCategory: string;
  budgetBreakdown: { accommodation: number; food: number; transport: number; activities: number; miscellaneous: number };
}): Promise<{
  overview: string;
  attractive_places: string;
  restaurants: string;
  travel_methods: string;
  detailed_itinerary: string;
}> {
  const { from_city, to_city, budgetINR, currency, budget, duration, travelers, budgetCategory, budgetBreakdown } = params;

  const jsonPrompt = `You are a helpful travel planner.
Return ONLY a compact JSON object with these string fields: overview, attractive_places, restaurants, travel_methods, detailed_itinerary.
Do not include markdown, code fences, or any additional commentary.

Context:
From: ${from_city}
To: ${to_city}
Duration: ${duration} days
Travelers: ${travelers}
Budget: INR ${budgetINR.toLocaleString('en-IN')} (input: ${currency} ${budget.toLocaleString()})
Budget Category: ${budgetCategory}
Budget Breakdown (INR totals):
  accommodation=${Math.round(budgetBreakdown.accommodation)}
  food=${Math.round(budgetBreakdown.food)}
  transport=${Math.round(budgetBreakdown.transport)}
  activities=${Math.round(budgetBreakdown.activities)}
  miscellaneous=${Math.round(budgetBreakdown.miscellaneous)}

Guidelines:
- overview: simple paragraphs on what makes ${to_city} special.
- attractive_places: numbered list (plain text) of 10-15 attractions with short details.
- restaurants: plain text for breakfast/lunch/dinner/street food with price ranges.
- travel_methods: flights/trains/bus/local transport and budget split, plain text.
- detailed_itinerary: day-by-day schedule with morning/afternoon/evening, realistic costs; include a final BUDGET SPENT SUMMARY.
`;

  const raw = await callGeminiAI(jsonPrompt);

  try {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    const jsonSlice = start !== -1 && end !== -1 ? raw.slice(start, end + 1) : raw;
    const parsed = JSON.parse(jsonSlice);
    return {
      overview: String(parsed.overview || ''),
      attractive_places: String(parsed.attractive_places || ''),
      restaurants: String(parsed.restaurants || ''),
      travel_methods: String(parsed.travel_methods || ''),
      detailed_itinerary: String(parsed.detailed_itinerary || ''),
    };
  } catch (e) {
    // Fallback: if JSON parsing fails, return the entire text as overview to avoid complete failure
    return {
      overview: raw,
      attractive_places: '',
      restaurants: '',
      travel_methods: '',
      detailed_itinerary: '',
    };
  }
}

export const handleTravelPlan: RequestHandler = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    
    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key not found in environment variables');
      return res.status(500).json({
        success: false,
        error: "Gemini API key not configured. Please check your environment variables."
      } as TravelPlanResponse);
    }

    // Check if we should use mock mode (when API quota is exceeded)
    const useMockMode = process.env.USE_MOCK_MODE === 'true' || req.headers['x-mock-mode'] === 'true';
    
    if (useMockMode) {
      console.log('Using mock mode for travel plan generation');
      const mockPlan = generateMockTravelPlan(req.body);
      return res.json(mockPlan);
    }
    
    const { from_city, to_city, budget, currency, duration, travelers }: TravelPlanRequest = req.body;

    // Validate inputs
    if (!from_city || !to_city || !budget || !duration || !travelers) {
      console.log('Missing fields:', { from_city, to_city, budget, duration, travelers });
      return res.status(400).json({
        success: false,
        error: "Missing required fields: from_city, to_city, budget, duration, or travelers"
      } as TravelPlanResponse);
    }

    if (budget <= 0 || duration <= 0 || travelers <= 0) {
      return res.status(400).json({
        success: false,
        error: "Budget, duration, and travelers must be positive numbers"
      } as TravelPlanResponse);
    }

    // Convert budget to INR and determine category
    const budgetINR = convertToINR(budget, currency);
    const budgetCategory = getBudgetCategory(budgetINR, duration, travelers);
    const budgetBreakdown = createBudgetBreakdown(budgetINR, budgetCategory);

    // Single Gemini call returning JSON with all sections
    const combined = await generatePlanViaGemini({
      from_city,
      to_city,
      budgetINR,
      currency,
      budget,
      duration,
      travelers,
      budgetCategory,
      budgetBreakdown,
    });
    const overview = sanitizeAiText(combined.overview);
    const attractivePlaces = sanitizeAiText(combined.attractive_places);
    const restaurants = sanitizeAiText(combined.restaurants);
    const travelMethods = sanitizeAiText(combined.travel_methods);
    const detailedItinerary = sanitizeAiText(combined.detailed_itinerary);

    // Step 6: Get coordinates and create maps
    const [fromCoords, toCoords] = await Promise.all([
      getCoordinates(from_city),
      getCoordinates(to_city)
    ]);

    let staticMapUrl = null;
    let interactiveMap = null;

    if (toCoords) {
      staticMapUrl = await getStaticMap(toCoords.lat, toCoords.lng);

      // Create simple interactive map HTML
      if (fromCoords) {
        interactiveMap = `
          <div style="width: 100%; height: 400px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <iframe
              width="100%"
              height="400"
              src="https://maps.google.com/maps?q=${toCoords.lat},${toCoords.lng}&hl=es&z=12&output=embed"
              style="border: none;">
            </iframe>
          </div>
        `;
      }
    }

    // Step 7: Create budget breakdown text
    const budgetBreakdownText = `
BUDGET BREAKDOWN (Total: ₹${budgetINR.toLocaleString('en-IN')} / ${currency} ${budget.toLocaleString()})

Per Person Cost: ₹${Math.round(budgetINR / travelers).toLocaleString('en-IN')}
Budget Category: ${budgetCategory.charAt(0).toUpperCase() + budgetCategory.slice(1)}
Trip Duration: ${duration} days

Accommodation: ₹${Math.round(budgetBreakdown.accommodation).toLocaleString('en-IN')} (${Math.round((budgetBreakdown.accommodation/budgetINR)*100)}%) - ₹${Math.round(budgetBreakdown.accommodation/travelers).toLocaleString('en-IN')} per person

Food & Dining: ₹${Math.round(budgetBreakdown.food).toLocaleString('en-IN')} (${Math.round((budgetBreakdown.food/budgetINR)*100)}%) - ₹${Math.round(budgetBreakdown.food/travelers).toLocaleString('en-IN')} per person

Transportation: ₹${Math.round(budgetBreakdown.transport).toLocaleString('en-IN')} (${Math.round((budgetBreakdown.transport/budgetINR)*100)}%) - ₹${Math.round(budgetBreakdown.transport/travelers).toLocaleString('en-IN')} per person

Activities & Sightseeing: ₹${Math.round(budgetBreakdown.activities).toLocaleString('en-IN')} (${Math.round((budgetBreakdown.activities/budgetINR)*100)}%) - ₹${Math.round(budgetBreakdown.activities/travelers).toLocaleString('en-IN')} per person

Miscellaneous & Emergency: ₹${Math.round(budgetBreakdown.miscellaneous).toLocaleString('en-IN')} (${Math.round((budgetBreakdown.miscellaneous/budgetINR)*100)}%) - ₹${Math.round(budgetBreakdown.miscellaneous/travelers).toLocaleString('en-IN')} per person

Money-Saving Tips for ${budgetCategory} Budget:
${budgetCategory === 'very_low' || budgetCategory === 'budget' ?
  'Book accommodations in advance for better rates. Use public transportation. Eat at local restaurants and street food. Look for free attractions and activities. Travel during off-peak seasons.' :
  budgetCategory === 'mid-range' ?
  'Mix of budget and mid-range accommodations. Combination of local and upscale dining. Use mix of public and private transportation. Include both free and paid attractions. Book popular restaurants in advance.' :
  'Premium accommodations and experiences. Fine dining and exclusive restaurants. Private transportation options. VIP attraction access and tours. Luxury shopping and spa experiences.'
}
`;

    const travelPlan: TravelPlanResponse = {
      success: true,
      plan: {
        destination: to_city,
        overview: overview,
        places_to_visit: [], // Not used in current format, included in attractive_places
        restaurants: restaurants,
        maps: {
          static_map_url: staticMapUrl || undefined,
          interactive_map: interactiveMap || undefined
        },
        attractive_places: attractivePlaces,
        travel_methods: travelMethods,
        budget_breakdown: budgetBreakdownText,
        detailed_itinerary: detailedItinerary
      }
    };

    res.json(travelPlan);

  } catch (error) {
    console.error('Travel planning error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate travel plan'
    } as TravelPlanResponse);
  }
};
