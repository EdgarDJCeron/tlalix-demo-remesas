import { useState } from "react";
import { MapPin, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockCashoutPoints, CashoutPoint } from "@/mocks/cashout";
import { LeafletMap } from "@/components/LeafletMap";

const Retiro = () => {
  const { lang } = useLanguage();
  const [selectedPoint, setSelectedPoint] = useState<CashoutPoint | null>(null);

  const handleSelectPoint = (point: CashoutPoint) => {
    setSelectedPoint(point);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-3xl font-bold text-center text-white">
          {lang === "es" ? "Puntos de retiro" : "Withdrawal points"}
        </h1>

        {/* Mapa Leaflet con Puntos Marcados */}
        <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="h-[500px] rounded-lg overflow-hidden">
              <LeafletMap 
                points={mockCashoutPoints}
                selectedPoint={selectedPoint}
                onSelectPoint={handleSelectPoint}
              />
            </div>
          </CardContent>
        </Card>

        {/* Store List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockCashoutPoints.map((point) => (
            <Card 
              key={point.id} 
              className={`transition-all cursor-pointer border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 ${
                selectedPoint?.id === point.id ? 'ring-2 ring-[hsl(var(--color-celeste))]' : ''
              }`}
              onClick={() => handleSelectPoint(point)}
            >
              <CardHeader>
                <CardTitle className="text-lg text-white">{point.name}</CardTitle>
                <p className="text-sm text-white/70">{point.city}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-white/70 mt-0.5 flex-shrink-0" />
                  <span className="text-white/70">{point.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-white/70" />
                  <span className="text-white/70">{point.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-lime-300" />
                  <span className="font-medium text-lime-300">
                    {lang === "es" ? "Comisión:" : "Fee:"} {(point.feePct * 100).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Retiro;
