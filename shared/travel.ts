export interface TravelPlanRequest {
  destination: string;
  duration: string;
  travelers: string;
  interests: string;
  budget?: string;
  travelDates?: {
    start: string;
    end: string;
  };
}

export interface TravelPlanResponse {
  success: boolean;
  itinerary?: {
    destination: string;
    overview: string;
    days: DayPlan[];
    recommendations: Recommendations;
    estimatedCost: string;
  };
  error?: string;
}

export interface DayPlan {
  day: number;
  date: string;
  theme: string;
  activities: Activity[];
  meals: MealRecommendation[];
  transportation: string[];
}

export interface Activity {
  time: string;
  name: string;
  description: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  duration: string;
  cost: string;
  category: 'sightseeing' | 'culture' | 'adventure' | 'relaxation' | 'food' | 'shopping' | 'entertainment';
}

export interface MealRecommendation {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  restaurant: string;
  cuisine: string;
  location: string;
  estimatedCost: string;
  rating: number;
}

export interface Recommendations {
  hotels: HotelRecommendation[];
  restaurants: RestaurantRecommendation[];
  attractions: AttractionRecommendation[];
  tips: string[];
}

export interface HotelRecommendation {
  name: string;
  category: string;
  location: string;
  priceRange: string;
  rating: number;
  amenities: string[];
}

export interface RestaurantRecommendation {
  name: string;
  cuisine: string;
  location: string;
  priceRange: string;
  rating: number;
  specialties: string[];
}

export interface AttractionRecommendation {
  name: string;
  category: string;
  location: string;
  description: string;
  estimatedTime: string;
  bestTimeToVisit: string;
  rating: number;
}

export interface LocationSearchRequest {
  query: string;
  type?: 'city' | 'attraction' | 'restaurant' | 'hotel';
  limit?: number;
}

export interface LocationSearchResponse {
  success: boolean;
  results?: LocationResult[];
  error?: string;
}

export interface LocationResult {
  name: string;
  formatted: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: string;
  country: string;
  state?: string;
  city?: string;
}
