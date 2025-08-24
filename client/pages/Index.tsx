import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Sparkles, Users, Clock, Globe, Star, Plane, Hotel, Car, DollarSign } from "lucide-react";

interface TravelPlan {
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

export default function Index() {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [duration, setDuration] = useState("");
  const [travelers, setTravelers] = useState("");
  const [isPlanning, setIsPlanning] = useState(false);
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);

  const handlePlanTrip = async () => {
    if (!fromCity || !toCity || !budget || !duration || !travelers || !currency) {
      console.log('Validation failed:', { fromCity, toCity, budget, duration, travelers, currency });
      alert("Please fill in all required fields");
      return;
    }
    
    // Additional validation
    if (parseFloat(budget) <= 0 || parseInt(duration) <= 0 || parseInt(travelers) <= 0) {
      alert("Budget, duration, and travelers must be positive numbers");
      return;
    }

    setIsPlanning(true);
    setTravelPlan(null);

    try {
      const requestBody = {
        from_city: fromCity,
        to_city: toCity,
        budget: parseFloat(budget),
        currency: currency,
        duration: parseInt(duration),
        travelers: parseInt(travelers)
      };
      
      console.log('Sending request:', requestBody);
      
      const response = await fetch('/.netlify/functions/api/travel-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      // Check if response has content before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        throw new Error(`Invalid response format: ${responseText}`);
      }

      const data = await response.json();
      setTravelPlan(data);
    } catch (error) {
      console.error('Error creating travel plan:', error);
      setTravelPlan({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create travel plan. Please try again.'
      });
    } finally {
      setIsPlanning(false);
    }
  };

  const popularDestinations = [
    { name: "Goa", country: "India", image: "🏖️", description: "Beautiful beaches and vibrant nightlife" },
    { name: "Kerala", country: "India", image: "🌴", description: "Backwaters and hill stations" },
    { name: "Rajasthan", country: "India", image: "🏰", description: "Royal palaces and desert adventures" },
    { name: "Paris", country: "France", image: "🗼", description: "City of lights and romance" },
    { name: "Tokyo", country: "Japan", image: "🏯", description: "Modern metropolis meets tradition" },
    { name: "Dubai", country: "UAE", image: "🏗️", description: "Luxury shopping and architecture" }
  ];

  const popularFromCities = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-sunset-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-ocean-500" />
            <span className="text-2xl font-bold text-gray-900">AI Travel Planner</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-ocean-500 transition-colors">Destinations</a>
            <a href="#" className="text-gray-600 hover:text-ocean-500 transition-colors">Features</a>
            <a href="#" className="text-gray-600 hover:text-ocean-500 transition-colors">About</a>
            <Button variant="outline" size="sm">Sign In</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center space-x-2 bg-sunset-100 text-sunset-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Powered by Gemini AI & Real-time Maps</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Plan Your Perfect
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-500 to-sunset-500"> AI Journey</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Get comprehensive travel plans with places to visit, restaurant recommendations, maps, and best travel routes powered by AI.
          </p>

          {/* Travel Planning Form - Hide when results are shown */}
          {!travelPlan && (
            <Card className="max-w-3xl mx-auto shadow-xl border-0 bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Create Your Travel Plan</span>
              </CardTitle>
              <CardDescription>
                Fill in your travel details and get a comprehensive AI-powered itinerary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Route Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Plane className="h-4 w-4 mr-1" />
                    From City
                  </label>
                  <Input
                    placeholder="Mumbai, Delhi, Bangalore..."
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    className="border-gray-200"
                    list="from-cities"
                  />
                  <datalist id="from-cities">
                    {popularFromCities.map((city) => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    To City (Destination)
                  </label>
                  <Input
                    placeholder="Paris, Goa, Dubai..."
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="border-gray-200"
                  />
                </div>
              </div>

              {/* Budget and Currency */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Total Budget
                  </label>
                  <Input
                    type="number"
                    placeholder="50000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="border-gray-200"
                    min="1000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Currency</label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="AED">AED (د.إ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Duration and Travelers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Duration (Days)
                  </label>
                  <Input
                    type="number"
                    placeholder="5"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="border-gray-200"
                    min="1"
                    max="30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Number of Travelers
                  </label>
                  <Input
                    type="number"
                    placeholder="2"
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="border-gray-200"
                    min="1"
                    max="20"
                  />
                </div>
              </div>

              <Button
                onClick={handlePlanTrip}
                className="w-full bg-gradient-to-r from-ocean-500 to-sunset-500 hover:from-ocean-600 hover:to-sunset-600 text-white"
                size="lg"
                disabled={isPlanning}
              >
                {isPlanning ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Creating Your Travel Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Travel Plan
                  </>
                )}
              </Button>
            </CardContent>
            </Card>
          )}

          {/* Show plan creation button when results are shown */}
          {travelPlan && (
            <Button
              onClick={() => setTravelPlan(null)}
              className="mt-8 bg-gradient-to-r from-ocean-500 to-sunset-500 hover:from-ocean-600 hover:to-sunset-600 text-white"
              size="lg"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Create New Travel Plan
            </Button>
          )}
        </div>
      </section>

      {/* Results Section */}
      {travelPlan && (
        <section className="py-16 px-4 bg-white/50">
          <div className="container mx-auto max-w-6xl">
            {travelPlan.success && travelPlan.plan ? (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Your AI Travel Plan
                  </h2>
                  <p className="text-lg text-gray-600">
                    From {fromCity} to {travelPlan.plan.destination} • {duration} days • {travelers} travelers
                  </p>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="places">Places</TabsTrigger>
                    <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                    <TabsTrigger value="maps">Maps</TabsTrigger>
                    <TabsTrigger value="travel">Travel Methods</TabsTrigger>
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Trip Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          <p className="text-gray-700 whitespace-pre-line">
                            {travelPlan.plan.overview}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="places" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Places to Visit in {travelPlan.plan.destination}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          <div className="text-gray-700 whitespace-pre-line">
                            {travelPlan.plan.attractive_places}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>


                  <TabsContent value="restaurants" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Restaurant Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          <div className="text-gray-700 whitespace-pre-line">
                            {travelPlan.plan.restaurants}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="maps" className="mt-6">
                    <div className="space-y-6">
                      {travelPlan.plan.maps.static_map_url && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Destination Map</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <img 
                              src={travelPlan.plan.maps.static_map_url} 
                              alt="Destination map" 
                              className="w-full rounded-lg border"
                            />
                          </CardContent>
                        </Card>
                      )}
                      
                      {travelPlan.plan.maps.interactive_map && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Interactive Route Map</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div 
                              dangerouslySetInnerHTML={{ 
                                __html: travelPlan.plan.maps.interactive_map 
                              }}
                              className="w-full h-96"
                            />
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="travel" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Best Ways to Travel</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          <div className="text-gray-700 whitespace-pre-line">
                            {travelPlan.plan.travel_methods}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="itinerary" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Detailed Itinerary & Budget</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          <div className="text-gray-700 whitespace-pre-line">
                            {travelPlan.plan.detailed_itinerary}
                          </div>
                          <hr className="my-6" />
                          <div className="text-gray-700 whitespace-pre-line">
                            {travelPlan.plan.budget_breakdown}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8 text-center">
                  <div className="text-red-500 mb-4">
                    <span className="text-4xl">❌</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Error Creating Travel Plan
                  </h3>
                  <p className="text-gray-600">
                    {travelPlan.error || "An unexpected error occurred. Please try again."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Popular Destinations */}
      <section className="py-16 px-4 bg-white/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore trending destinations loved by travelers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((destination, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{destination.image}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-ocean-600 transition-colors">
                    {destination.name}, {destination.country}
                  </h3>
                  <p className="text-gray-600">{destination.description}</p>
                  <div className="flex items-center mt-4 space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-500 ml-2">4.9/5</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Plane className="h-8 w-8 text-ocean-400" />
            <span className="text-2xl font-bold">AI Travel Planner</span>
          </div>
          
          <div className="text-center text-gray-400">
            <p>&copy; 2024 AI Travel Planner. Powered by Gemini AI & Geoapify Maps.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
