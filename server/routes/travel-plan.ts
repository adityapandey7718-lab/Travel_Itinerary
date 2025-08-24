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

async function callGeminiAI(prompt: string): Promise<string> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error("Gemini API key not configured");
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
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

export const handleTravelPlan: RequestHandler = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
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

    // Step 1: Research destination and get overview
    const overviewPrompt = `
As a travel expert, provide a comprehensive overview for a trip from ${from_city} to ${to_city}.

Trip Details:
- Duration: ${duration} days
- Travelers: ${travelers} people
- Total Budget: ₹${budgetINR.toLocaleString('en-IN')} (${currency} ${budget.toLocaleString()})
- Budget Category: ${budgetCategory}

Please provide a clean, engaging overview of what makes ${to_city} special and what travelers can expect from this destination. Write in simple, readable paragraphs without using markdown formatting, asterisks, hashes, or special symbols. Use plain text only.
`;

    const overview = await callGeminiAI(overviewPrompt);

    // Step 2: Get places to visit and attractions
    const placesPrompt = `
List the top 10-15 must-visit places and attractions in ${to_city} for a ${duration}-day trip with ${travelers} travelers on a ${budgetCategory} budget.

For each place, provide:
- Name of the place
- Brief description (1-2 lines)
- Why it's special
- Approximate time needed to visit
- Best time of day to visit
- Entry fees or costs (if any)

Please write in simple, clean paragraphs for each attraction. Do not use markdown formatting, asterisks, hashes, or special symbols. Use plain text with clear spacing between attractions. Number each attraction (1, 2, 3...) for easy reading.
`;

    const attractivePlaces = await callGeminiAI(placesPrompt);

    // Step 3: Get restaurant recommendations
    const restaurantsPrompt = `
Recommend restaurants and dining options in ${to_city} for ${travelers} people on a ${budgetCategory} budget (₹${budgetINR.toLocaleString('en-IN')} total budget).

Provide recommendations for:
1. Breakfast places (3-4 options)
2. Lunch options (4-5 options)
3. Dinner restaurants (4-5 options)
4. Street food and local snacks
5. Desserts and cafes

For each recommendation include restaurant name, location, cuisine type, signature dishes, price range per person, and why it's recommended.

Please write in simple, clean text without using markdown formatting, asterisks, hashes, or special symbols. Use plain paragraphs with clear spacing between different meal categories and restaurants.
`;

    const restaurants = await callGeminiAI(restaurantsPrompt);

    // Step 4: Get travel methods from source to destination
    const travelMethodsPrompt = `
Provide comprehensive travel options from ${from_city} to ${to_city}:

1. Flight options - Major airlines, flight duration, booking strategies, cost range for ${travelers} travelers, best airports
2. Train options (if applicable) - Routes, duration, class options, costs, booking tips
3. Bus or road options (if applicable) - Services, driving routes, duration, cost estimates
4. Local transportation in ${to_city} - Best ways to get around, public transport, taxi apps, walking areas
5. Transportation budget allocation - Recommended budget split for ${budgetCategory} category, cost-saving tips

Consider the ${duration}-day trip for ${travelers} people with a total budget of ₹${budgetINR.toLocaleString('en-IN')}.

Please write in simple, clean paragraphs without using markdown formatting, asterisks, hashes, or special symbols. Use plain text with clear spacing between different transportation options.
`;

    const travelMethods = await callGeminiAI(travelMethodsPrompt);

    // Step 5: Create detailed day-by-day itinerary with budget breakdown
    const itineraryPrompt = `
Create a detailed ${duration}-day itinerary for ${travelers} travelers from ${from_city} to ${to_city} with a total budget of ₹${budgetINR.toLocaleString('en-IN')} (${budgetCategory} category).

Budget Breakdown:
- Accommodation: ₹${Math.round(budgetBreakdown.accommodation).toLocaleString('en-IN')}
- Food: ₹${Math.round(budgetBreakdown.food).toLocaleString('en-IN')}
- Transport: ₹${Math.round(budgetBreakdown.transport).toLocaleString('en-IN')}
- Activities: ₹${Math.round(budgetBreakdown.activities).toLocaleString('en-IN')}
- Miscellaneous: ₹${Math.round(budgetBreakdown.miscellaneous).toLocaleString('en-IN')}

Create a time-based schedule for each day with morning, afternoon, and evening activities. For each time slot include the activity or location, duration, cost per person, transportation details, and tips.

Include realistic travel times between locations, specific attraction entry fees, meal costs, transportation costs, and cultural tips.

IMPORTANT: At the end of the itinerary, provide a comprehensive "BUDGET SPENT SUMMARY" section that includes:

1. Total accommodation costs for ${duration} days
2. Total food costs (all meals for ${travelers} people)
3. Total transportation costs (flights/trains + local transport)
4. Total activity and attraction costs
5. Total miscellaneous expenses
6. GRAND TOTAL SPENT for the entire trip
7. Comparison with allocated budget (₹${budgetINR.toLocaleString('en-IN')})
8. Amount saved or exceeded

Make sure all costs are realistic and add up correctly. Show both total costs and per-person costs.

Please write in simple, clean text without using markdown formatting, asterisks, hashes, pipes, or special symbols. Use plain paragraphs with clear spacing between days and time periods. Make the schedule practical and enjoyable within the budget.
`;

    const detailedItinerary = await callGeminiAI(itineraryPrompt);

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
