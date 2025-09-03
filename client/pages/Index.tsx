import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Cpu, 
  Network, 
  Database, 
  Terminal, 
  Shield, 
  Eye, 
  Brain, 
  Rocket, 
  Globe, 
  Star, 
  Code, 
  Lock, 
  Unlock,
  Settings,
  BarChart3,
  Activity,
  Wifi,
  Satellite,
  Orbit,
  RefreshCw,
  Clock,
  Users
} from "lucide-react";

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
  const [systemStatus, setSystemStatus] = useState("ONLINE");
  const [securityLevel, setSecurityLevel] = useState("MAXIMUM");

  const handlePlanTrip = async () => {
    if (!fromCity || !toCity || !budget || !duration || !travelers || !currency) {
      console.log('Validation failed:', { fromCity, toCity, budget, duration, travelers, currency });
      alert("SYSTEM ERROR: Incomplete parameters detected");
      return;
    }
    
    if (parseFloat(budget) <= 0 || parseInt(duration) <= 0 || parseInt(travelers) <= 0) {
      alert("CRITICAL ERROR: Invalid numerical values");
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
      
      const response = await fetch('/api/travel-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
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
        error: error instanceof Error ? error.message : 'SYSTEM FAILURE: Neural network overload detected'
      });
    } finally {
      setIsPlanning(false);
    }
  };

  const cyberpunkDestinations = [
    { name: "Neo-Tokyo", sector: "Cyber District", icon: "🏙️", threat: "HIGH", description: "Megacity of the future" },
    { name: "Cyber-Paris", sector: "Digital Quarter", icon: "🗼", threat: "MEDIUM", description: "Holographic romance" },
    { name: "Neo-Dubai", sector: "Floating City", icon: "🏗️", threat: "LOW", description: "Sky-high luxury" },
    { name: "Cyber-Goa", sector: "Beach Node", icon: "🏖️", threat: "MEDIUM", description: "Digital paradise" },
    { name: "Neo-Delhi", sector: "Tech Hub", icon: "🏛️", threat: "HIGH", description: "Ancient meets future" },
    { name: "Cyber-Mumbai", sector: "Port Matrix", icon: "🌊", threat: "MAXIMUM", description: "Gateway to tomorrow" }
  ];

  const cyberpunkCities = [
    "Neo-Mumbai", "Cyber-Delhi", "Digital-Bangalore", "Tech-Chennai", "Future-Kolkata", "Neo-Hyderabad", "Cyber-Pune", "Digital-Ahmedabad"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 matrix-bg relative overflow-hidden">
      {/* Animated scan line */}
      <div className="scan-line fixed inset-0 pointer-events-none z-50"></div>
      
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="border-b border-cyan-500/30 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Cpu className="h-10 w-10 text-cyan-400 cyber-glow" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-cyan-400 neon-text glitch" data-text="NEURAL NAVIGATOR">
                NEURAL NAVIGATOR
              </h1>
              <div className="flex items-center space-x-2 text-xs text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>SYSTEM: {systemStatus}</span>
                <span>|</span>
                <span>SECURITY: {securityLevel}</span>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-cyan-400">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4" />
                <span className="text-xs">CONNECTED</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span className="text-xs">SECURE</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span className="text-xs">ONLINE</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900">
              <Lock className="h-4 w-4 mr-2" />
              ACCESS
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-24 px-4 relative">
          <div className="container mx-auto text-center max-w-5xl">
            {/* Status Bar */}
            <div className="flex items-center justify-center space-x-6 mb-8">
              <div className="flex items-center space-x-2 bg-slate-800/50 border border-cyan-500/30 px-4 py-2 rounded-lg">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm font-mono">NEURAL CORE: ACTIVE</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/50 border border-purple-500/30 px-4 py-2 rounded-lg">
                <Satellite className="h-4 w-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-mono">SATELLITE: LOCKED</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/50 border border-yellow-500/30 px-4 py-2 rounded-lg">
                <BarChart3 className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-mono">AI: OPERATIONAL</span>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-yellow-400 neon-text mb-6 leading-tight">
              NEURAL
              <span className="block text-6xl md:text-8xl">ROUTING</span>
              <span className="block text-4xl md:text-6xl text-cyan-400">SYSTEM</span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto font-mono">
              Advanced AI-powered navigation matrix for optimal route calculation and destination analysis
            </p>

            {/* Main Interface */}
            {!travelPlan && (
              <Card className="max-w-4xl mx-auto shadow-2xl border-cyan-500/30 bg-slate-800/90 backdrop-blur">
                <CardHeader className="border-b border-cyan-500/30">
                  <CardTitle className="flex items-center justify-center space-x-3 text-cyan-400">
                    <Terminal className="h-6 w-6" />
                    <span className="text-2xl font-mono">NEURAL INTERFACE</span>
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-center">
                    Input coordinates for neural network processing and route optimization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-8">
                  {/* Route Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-cyan-400 flex items-center font-mono">
                        <Rocket className="h-4 w-4 mr-2" />
                        ORIGIN NODE
                      </label>
                      <Input
                        placeholder="Enter origin coordinates..."
                        value={fromCity}
                        onChange={(e) => setFromCity(e.target.value)}
                        className="border-cyan-500/30 bg-slate-700 text-cyan-100 placeholder:text-slate-500 font-mono"
                        list="origin-nodes"
                      />
                      <datalist id="origin-nodes">
                        {cyberpunkCities.map((city) => (
                          <option key={city} value={city} />
                        ))}
                      </datalist>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-purple-400 flex items-center font-mono">
                        <Globe className="h-4 w-4 mr-2" />
                        TARGET NODE
                      </label>
                      <Input
                        placeholder="Enter destination coordinates..."
                        value={toCity}
                        onChange={(e) => setToCity(e.target.value)}
                        className="border-purple-500/30 bg-slate-700 text-purple-100 placeholder:text-slate-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Parameters Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-yellow-400 flex items-center font-mono">
                        <Zap className="h-4 w-4 mr-2" />
                        ENERGY BUDGET
                      </label>
                      <Input
                        type="number"
                        placeholder="50000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="border-yellow-500/30 bg-slate-700 text-yellow-100 placeholder:text-slate-500 font-mono"
                        min="1000"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-green-400 font-mono">CURRENCY MATRIX</label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="border-green-500/30 bg-slate-700 text-green-100 font-mono">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-cyan-500/30">
                          <SelectItem value="INR">INR (₹)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="AED">AED (د.إ)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-pink-400 flex items-center font-mono">
                        <Clock className="h-4 w-4 mr-2" />
                        TIME CYCLE
                      </label>
                      <Input
                        type="number"
                        placeholder="5"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="border-pink-500/30 bg-slate-700 text-pink-100 placeholder:text-slate-500 font-mono"
                        min="1"
                        max="30"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-blue-400 flex items-center font-mono">
                        <Users className="h-4 w-4 mr-2" />
                        OPERATORS
                      </label>
                      <Input
                        type="number"
                        placeholder="2"
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        className="border-blue-500/30 bg-slate-700 text-blue-100 placeholder:text-slate-500 font-mono"
                        min="1"
                        max="20"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handlePlanTrip}
                    className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-yellow-500 hover:from-cyan-600 hover:via-purple-600 hover:to-yellow-600 text-slate-900 font-bold text-lg py-6 border-0"
                    size="lg"
                    disabled={isPlanning}
                  >
                    {isPlanning ? (
                      <>
                        <Brain className="h-5 w-5 mr-3 animate-spin" />
                        PROCESSING NEURAL MATRIX...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-3" />
                        INITIATE NEURAL ROUTING
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Reset Button */}
            {travelPlan && (
              <Button
                onClick={() => setTravelPlan(null)}
                className="mt-8 bg-gradient-to-r from-cyan-500 via-purple-500 to-yellow-500 hover:from-cyan-600 hover:via-purple-600 hover:to-yellow-600 text-slate-900 font-bold"
                size="lg"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                RESET NEURAL INTERFACE
              </Button>
            )}
          </div>
        </section>

        {/* Results Matrix */}
        {travelPlan && (
          <section className="py-16 px-4 bg-slate-800/50">
            <div className="container mx-auto max-w-7xl">
              {travelPlan.success && travelPlan.plan ? (
                <div>
                  <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 neon-text mb-4 font-mono">
                      NEURAL ROUTING COMPLETE
                    </h2>
                    <div className="flex items-center justify-center space-x-4 text-slate-300 font-mono">
                      <span>ORIGIN: {fromCity}</span>
                      <span className="text-cyan-400">→</span>
                      <span>TARGET: {travelPlan.plan.destination}</span>
                      <span className="text-purple-400">|</span>
                      <span>CYCLE: {duration} days</span>
                      <span className="text-yellow-400">|</span>
                      <span>OPERATORS: {travelers}</span>
                    </div>
                  </div>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-6 bg-slate-800 border-cyan-500/30">
                      <TabsTrigger value="overview" className="text-cyan-400 data-[state=active]:bg-cyan-500 data-[state=active]:text-slate-900">OVERVIEW</TabsTrigger>
                      <TabsTrigger value="places" className="text-purple-400 data-[state=active]:bg-purple-500 data-[state=active]:text-slate-900">LOCATIONS</TabsTrigger>
                      <TabsTrigger value="restaurants" className="text-yellow-400 data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-900">SUSTENANCE</TabsTrigger>
                      <TabsTrigger value="maps" className="text-green-400 data-[state=active]:bg-green-500 data-[state=active]:text-slate-900">CARTOGRAPHY</TabsTrigger>
                      <TabsTrigger value="travel" className="text-pink-400 data-[state=active]:bg-pink-500 data-[state=active]:text-slate-900">TRANSPORT</TabsTrigger>
                      <TabsTrigger value="itinerary" className="text-blue-400 data-[state=active]:bg-blue-500 data-[state=active]:text-slate-900">EXECUTION</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-8">
                      <Card className="border-cyan-500/30 bg-slate-800/90">
                        <CardHeader>
                          <CardTitle className="text-cyan-400 font-mono">MISSION BRIEFING</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-invert max-w-none">
                            <p className="text-slate-300 whitespace-pre-line font-mono">
                              {travelPlan.plan.overview}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="places" className="mt-8">
                      <Card className="border-purple-500/30 bg-slate-800/90">
                        <CardHeader>
                          <CardTitle className="text-purple-400 font-mono">TARGET LOCATIONS</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-invert max-w-none">
                            <div className="text-slate-300 whitespace-pre-line font-mono">
                              {travelPlan.plan.attractive_places}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="restaurants" className="mt-8">
                      <Card className="border-yellow-500/30 bg-slate-800/90">
                        <CardHeader>
                          <CardTitle className="text-yellow-400 font-mono">SUSTENANCE UNITS</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-invert max-w-none">
                            <div className="text-slate-300 whitespace-pre-line font-mono">
                              {travelPlan.plan.restaurants}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="maps" className="mt-8">
                      <div className="space-y-8">
                        {travelPlan.plan.maps.static_map_url && (
                          <Card className="border-green-500/30 bg-slate-800/90">
                            <CardHeader>
                              <CardTitle className="text-green-400 font-mono">TARGET ZONE MAP</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <img 
                                src={travelPlan.plan.maps.static_map_url} 
                                alt="Target zone map" 
                                className="w-full rounded-lg border border-green-500/30"
                              />
                            </CardContent>
                          </Card>
                        )}
                        
                        {travelPlan.plan.maps.interactive_map && (
                          <Card className="border-green-500/30 bg-slate-800/90">
                            <CardHeader>
                              <CardTitle className="text-green-400 font-mono">INTERACTIVE NAVIGATION MATRIX</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div 
                                dangerouslySetInnerHTML={{ 
                                  __html: travelPlan.plan.maps.interactive_map 
                                }}
                                className="w-full h-96 border border-green-500/30 rounded-lg"
                              />
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="travel" className="mt-8">
                      <Card className="border-pink-500/30 bg-slate-800/90">
                        <CardHeader>
                          <CardTitle className="text-pink-400 font-mono">TRANSPORTATION PROTOCOLS</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-invert max-w-none">
                            <div className="text-slate-300 whitespace-pre-line font-mono">
                              {travelPlan.plan.travel_methods}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="itinerary" className="mt-8">
                      <Card className="border-blue-500/30 bg-slate-800/90">
                        <CardHeader>
                          <CardTitle className="text-blue-400 font-mono">EXECUTION PROTOCOL & RESOURCE ALLOCATION</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-invert max-w-none">
                            <div className="text-slate-300 whitespace-pre-line font-mono">
                              {travelPlan.plan.detailed_itinerary}
                            </div>
                            <hr className="my-8 border-blue-500/30" />
                            <div className="text-slate-300 whitespace-pre-line font-mono">
                              {travelPlan.plan.budget_breakdown}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <Card className="max-w-2xl mx-auto border-red-500/30 bg-slate-800/90">
                  <CardContent className="p-8 text-center">
                    <div className="text-red-400 mb-6">
                      <Terminal className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-400 mb-4 font-mono">
                      NEURAL MATRIX FAILURE
                    </h3>
                    <p className="text-slate-400 font-mono">
                      {travelPlan.error || "Critical system error detected. Neural network offline."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Cyberpunk Destinations */}
        <section className="py-20 px-4 bg-slate-900/50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 neon-text mb-6 font-mono">
                NEURAL NETWORK NODES
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto font-mono">
                High-priority target zones for neural routing optimization
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cyberpunkDestinations.map((destination, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-cyan-500/30 bg-slate-800/90 backdrop-blur hover:border-cyan-400 hover:scale-105">
                  <CardContent className="p-8">
                    <div className="text-6xl mb-6 text-center">{destination.icon}</div>
                    <h3 className="text-2xl font-bold text-cyan-400 mb-3 group-hover:text-cyan-300 transition-colors font-mono text-center">
                      {destination.name}
                    </h3>
                    <p className="text-slate-400 text-center mb-4 font-mono">{destination.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-purple-400 font-mono">SECTOR: {destination.sector}</span>
                      <Badge 
                        variant="outline" 
                        className={`border-${destination.threat === 'HIGH' ? 'red' : destination.threat === 'MEDIUM' ? 'yellow' : 'green'}-500/50 text-${destination.threat === 'HIGH' ? 'red' : destination.threat === 'MEDIUM' ? 'yellow' : 'green'}-400 font-mono`}
                      >
                        THREAT: {destination.threat}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-slate-500 ml-2 font-mono">4.9/5</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/90 text-slate-300 py-16 px-4 border-t border-cyan-500/30">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <Cpu className="h-10 w-10 text-cyan-400" />
            <span className="text-3xl font-bold text-cyan-400 font-mono">NEURAL NAVIGATOR</span>
          </div>
          
          <div className="text-center text-slate-500 font-mono">
            <p>&copy; 2024 NEURAL NAVIGATOR. Advanced AI-powered routing system.</p>
            <p className="mt-2 text-sm">Powered by Neural Networks & Satellite Navigation Matrix</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
