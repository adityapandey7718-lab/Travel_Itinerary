import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Sparkles, Users, Clock, Globe, Star, Plane, Hotel, Car, DollarSign, Search, Zap, Compass, Heart, Share2, Download } from "lucide-react";

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
    if (!fromCity || !toCity || !budget || !duration || !travelers) {
      alert("Please fill in all required fields");
      return;
    }

    setIsPlanning(true);
    setTravelPlan(null);

    try {
      const response = await fetch('/api/travel-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_city: fromCity,
          to_city: toCity,
          budget: parseFloat(budget),
          currency: currency,
          duration: parseInt(duration),
          travelers: parseInt(travelers)
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

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
    { name: "Bali", country: "Indonesia", image: "🌴", description: "Tropical paradise with rich culture", rating: 4.9, price: "₹45K" },
    { name: "Switzerland", country: "Europe", image: "🏔️", description: "Alpine beauty and adventure", rating: 4.8, price: "₹85K" },
    { name: "Japan", country: "Asia", image: "🗾", description: "Modern cities meet ancient traditions", rating: 4.7, price: "₹65K" },
    { name: "Maldives", country: "Indian Ocean", image: "🏝️", description: "Crystal clear waters and luxury", rating: 4.9, price: "₹55K" },
    { name: "New Zealand", country: "Oceania", image: "🌿", description: "Adventure and natural wonders", rating: 4.6, price: "₹95K" },
    { name: "Iceland", country: "Europe", image: "❄️", description: "Northern lights and geothermal wonders", rating: 4.8, price: "₹75K" }
  ];

  const popularFromCities = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">VoyageAI</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Explore</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Destinations</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto text-center max-w-5xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span>Powered by Advanced AI & Real-time Data</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight animate-fade-in">
            Discover Your
            <span className="gradient-text block">Perfect Journey</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-16 max-w-3xl mx-auto animate-fade-in">
            Experience the future of travel planning with AI-powered itineraries, real-time recommendations, and personalized adventures.
          </p>

          {/* Travel Planning Form */}
          {!travelPlan && (
            <Card className="max-w-4xl mx-auto glass-effect animate-fade-in">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white flex items-center justify-center space-x-2">
                  <Search className="h-6 w-6 text-purple-400" />
                  <span>Plan Your Adventure</span>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Tell us your preferences and let AI create your perfect travel experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Route Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300 flex items-center">
                      <Plane className="h-4 w-4 mr-2 text-purple-400" />
                      Departure City
                    </label>
                    <Input
                      placeholder="Mumbai, Delhi, Bangalore..."
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                      list="from-cities"
                    />
                    <datalist id="from-cities">
                      {popularFromCities.map((city) => (
                        <option key={city} value={city} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-pink-400" />
                      Destination
                    </label>
                    <Input
                      placeholder="Bali, Switzerland, Japan..."
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-pink-500"
                    />
                  </div>
                </div>

                {/* Budget and Currency */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-400" />
                      Total Budget
                    </label>
                    <Input
                      type="number"
                      placeholder="50000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-green-500"
                      min="1000"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300">Currency</label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                      Duration (Days)
                    </label>
                    <Input
                      type="number"
                      placeholder="5"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500"
                      min="1"
                      max="30"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-orange-400" />
                      Travelers
                    </label>
                    <Input
                      type="number"
                      placeholder="2"
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-500"
                      min="1"
                      max="20"
                    />
                  </div>
                </div>

                <Button
                  onClick={handlePlanTrip}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-14 text-lg font-semibold animate-glow"
                  disabled={isPlanning}
                >
                  {isPlanning ? (
                    <>
                      <Sparkles className="h-5 w-5 mr-3 animate-spin" />
                      Crafting Your Perfect Journey...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-3" />
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
              className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              size="lg"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Create New Journey
            </Button>
          )}
        </div>
      </section>

      {/* Results Section */}
      {travelPlan && (
        <section className="relative z-10 py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            {travelPlan.success && travelPlan.plan ? (
              <div className="animate-fade-in">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Your AI-Crafted Journey
                  </h2>
                  <p className="text-xl text-gray-300">
                    From {fromCity} to {travelPlan.plan.destination} • {duration} days • {travelers} travelers
                  </p>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-6 bg-white/10 backdrop-blur-md border border-white/20">
                    <TabsTrigger value="overview" className="text-white data-[state=active]:bg-purple-500/20">Overview</TabsTrigger>
                    <TabsTrigger value="places" className="text-white data-[state=active]:bg-purple-500/20">Places</TabsTrigger>
                    <TabsTrigger value="restaurants" className="text-white data-[state=active]:bg-purple-500/20">Dining</TabsTrigger>
                    <TabsTrigger value="maps" className="text-white data-[state=active]:bg-purple-500/20">Maps</TabsTrigger>
                    <TabsTrigger value="travel" className="text-white data-[state=active]:bg-purple-500/20">Transport</TabsTrigger>
                    <TabsTrigger value="itinerary" className="text-white data-[state=active]:bg-purple-500/20">Itinerary</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-8">
                    <Card className="glass-effect">
                      <CardHeader>
                        <CardTitle className="text-white">Journey Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-invert max-w-none">
                          <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                            {travelPlan.plan.overview}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="places" className="mt-8">
                    <Card className="glass-effect">
                      <CardHeader>
                        <CardTitle className="text-white">Must-Visit Places in {travelPlan.plan.destination}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-invert max-w-none">
                          <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                            {travelPlan.plan.attractive_places}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="restaurants" className="mt-8">
                    <Card className="glass-effect">
                      <CardHeader>
                        <CardTitle className="text-white">Culinary Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-invert max-w-none">
                          <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                            {travelPlan.plan.restaurants}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="maps" className="mt-8">
                    <div className="space-y-8">
                      {travelPlan.plan.maps.static_map_url && (
                        <Card className="glass-effect">
                          <CardHeader>
                            <CardTitle className="text-white">Destination Map</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <img 
                              src={travelPlan.plan.maps.static_map_url} 
                              alt="Destination map" 
                              className="w-full rounded-lg border border-white/20"
                            />
                          </CardContent>
                        </Card>
                      )}
                      
                      {travelPlan.plan.maps.interactive_map && (
                        <Card className="glass-effect">
                          <CardHeader>
                            <CardTitle className="text-white">Interactive Route Map</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div 
                              dangerouslySetInnerHTML={{ 
                                __html: travelPlan.plan.maps.interactive_map 
                              }}
                              className="w-full h-96 rounded-lg border border-white/20"
                            />
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="travel" className="mt-8">
                    <Card className="glass-effect">
                      <CardHeader>
                        <CardTitle className="text-white">Transportation Guide</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-invert max-w-none">
                          <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                            {travelPlan.plan.travel_methods}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="itinerary" className="mt-8">
                    <Card className="glass-effect">
                      <CardHeader>
                        <CardTitle className="text-white">Detailed Itinerary & Budget</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-invert max-w-none">
                          <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                            {travelPlan.plan.detailed_itinerary}
                          </div>
                          <hr className="my-8 border-white/20" />
                          <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                            {travelPlan.plan.budget_breakdown}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto glass-effect">
                <CardContent className="p-8 text-center">
                  <div className="text-red-400 mb-4">
                    <span className="text-4xl">❌</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Journey Creation Failed
                  </h3>
                  <p className="text-gray-300">
                    {travelPlan.error || "An unexpected error occurred. Please try again."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Popular Destinations */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trending Destinations
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the most popular destinations that travelers are loving right now
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularDestinations.map((destination, index) => (
              <Card key={index} className="group glass-effect hover:bg-white/20 transition-all duration-300 cursor-pointer animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-8">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{destination.image}</div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white group-hover:gradient-text transition-all duration-300">
                      {destination.name}
                    </h3>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      {destination.price}
                    </Badge>
                  </div>
                  <p className="text-gray-300 mb-4">{destination.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-300">{destination.rating}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">VoyageAI</span>
          </div>
          
          <div className="text-center text-gray-400">
            <p>&copy; 2024 VoyageAI. Crafting perfect journeys with AI & real-time data.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
