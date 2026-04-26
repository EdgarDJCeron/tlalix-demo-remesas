import { useState } from "react";
import { MapPin, Clock, DollarSign, Search, ArrowRight, Store } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockCashoutPoints, CashoutPoint } from "@/mocks/cashout";
import { LeafletMap } from "@/components/LeafletMap";
import { Input } from "@/components/ui/input";

const Retiro = () => {
  const { lang } = useLanguage();
  const [selectedPoint, setSelectedPoint] = useState<CashoutPoint | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectPoint = (point: CashoutPoint) => {
    setSelectedPoint(point);
  };

  const filteredPoints = mockCashoutPoints.filter(point => 
    point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    point.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white pb-32 pt-40">
      <div className="container mx-auto px-16 relative z-10">
        <div className="max-w-4xl mb-20">
          <h1 className="text-4xl md:text-5xl font-black text-black mb-8 tracking-tighter uppercase leading-[0.9]" style={{ fontFamily: 'Cinzel, serif' }}>
            {lang === "es" ? "RED DE RETIRO" : "WITHDRAWAL NETWORK"}
          </h1>
          <p className="text-xl text-black/80 font-light max-w-2xl leading-relaxed" style={{ fontFamily: 'Caudex, serif' }}>
            {lang === "es" 
              ? "Encuentra el punto más cercano para cobrar tus remesas de forma instantánea y segura en todo el país." 
              : "Find the nearest point to cash out your remittances instantly and securely across the country."}
          </p>
        </div>

        {/* Precision Map Container */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white border border-black/5 shadow-[0_40px_100px_rgba(0,0,0,0.05)] rounded-[2rem] overflow-hidden group">
              <CardContent className="p-0">
                <div className="h-[500px] relative">
                  <LeafletMap 
                    points={mockCashoutPoints}
                    selectedPoint={selectedPoint}
                    onSelectPoint={handleSelectPoint}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats - Light Premium Version */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: lang === "es" ? "Puntos" : "Points", value: "20,000+", icon: MapPin, color: "text-jade", bg: "bg-jade/10" },
                { label: lang === "es" ? "Comisión" : "Fee", value: "1.5%", icon: DollarSign, color: "text-oro", bg: "bg-oro/10" },
                { label: lang === "es" ? "Tiempo" : "Time", value: "< 2 min", icon: Clock, color: "text-black", bg: "bg-black/5" },
              ].map((stat, i) => (
                <div key={i} className="p-8 border border-black/5 rounded-[2rem] bg-black/[0.01] group hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3].map(dot => (
                        <div key={dot} className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-jade' : i === 1 ? 'bg-oro' : 'bg-black'} opacity-10 animate-pulse`} style={{ animationDelay: `${dot * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-xs font-bold text-black/40 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                  <p className="text-3xl font-black text-black tracking-tighter mb-4">{stat.value}</p>
                  
                  {/* Graphical Indicator */}
                  <div className="relative h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                    <div 
                      className={`absolute inset-y-0 left-0 ${stat.color.replace('text-', 'bg-')} opacity-30 rounded-full transition-all duration-1000 group-hover:opacity-60`} 
                      style={{ width: i === 0 ? '85%' : i === 1 ? '15%' : '10%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search and List */}
          <div className="space-y-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 group-focus-within:text-jade transition-colors" />
              <Input 
                placeholder={lang === "es" ? "Buscar ciudad o local..." : "Search city or store..."}
                className="bg-black/[0.02] border-black/5 pl-12 h-14 rounded-2xl text-black placeholder:text-black/40 focus-visible:ring-jade/20 shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredPoints.map((point) => (
                <div 
                  key={point.id}
                  onClick={() => handleSelectPoint(point)}
                  className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                    selectedPoint?.id === point.id 
                      ? 'bg-jade/5 border-jade/20 shadow-xl scale-[1.02]' 
                      : 'bg-black/[0.01] border-black/5 hover:bg-white hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    {/* Business Logo Only */}
                    <div className="h-14 w-14 rounded-xl bg-white flex items-center justify-center p-2 shrink-0 shadow-md border border-black/5">
                      <img 
                        src={point.logo} 
                        alt={point.name} 
                        className="h-full w-full object-contain"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-bold text-black tracking-tight uppercase leading-tight">{point.name}</h3>
                          <p className="text-xs font-bold text-jade uppercase tracking-widest mt-1">{point.city}</p>
                        </div>
                        {selectedPoint?.id === point.id && <ArrowRight className="h-4 w-4 text-jade animate-pulse" />}
                      </div>
                      <p className="text-sm text-black/50 mt-2 line-clamp-1">{point.address}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Retiro;



