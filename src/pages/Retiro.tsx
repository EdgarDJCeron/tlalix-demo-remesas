import { useState } from "react";
import { MapPin, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockCashoutPoints, generatePIN } from "@/mocks/cashout";

const Retiro = () => {
  const { lang } = useLanguage();
  const [selectedPin, setSelectedPin] = useState<{ code: string; expiresAt: string } | null>(null);

  const handleGeneratePin = () => {
    const pin = generatePIN();
    setSelectedPin(pin);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-3xl font-bold text-center text-foreground">
          {lang === "es" ? "Puntos de retiro" : "Withdrawal points"}
        </h1>

        {/* Mock Map */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <div className="h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-t-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
              <div className="relative text-center">
                <MapPin className="h-16 w-16 mx-auto mb-2 text-primary" />
                <p className="text-muted-foreground">
                  {lang === "es" ? "Mapa interactivo (demo)" : "Interactive map (demo)"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockCashoutPoints.map((point) => (
            <Card key={point.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-lg">{point.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{point.city}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{point.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{point.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-success" />
                  <span className="font-medium text-success">
                    {lang === "es" ? "Comisión:" : "Fee:"} {(point.feePct * 100).toFixed(1)}%
                  </span>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-4" onClick={handleGeneratePin}>
                      {lang === "es" ? "Generar PIN" : "Generate PIN"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {lang === "es" ? "PIN de retiro" : "Withdrawal PIN"}
                      </DialogTitle>
                    </DialogHeader>
                    {selectedPin && (
                      <div className="space-y-6">
                        <div className="bg-muted rounded-lg p-8 text-center">
                          <div className="h-32 w-32 mx-auto bg-white dark:bg-background rounded-lg flex items-center justify-center mb-4 border-2 border-primary">
                            <div className="text-5xl font-mono font-bold text-primary">QR</div>
                          </div>
                          <p className="text-3xl font-mono font-bold mb-2">{selectedPin.code}</p>
                          <p className="text-sm text-muted-foreground">
                            {lang === "es" ? "Válido por 24 horas" : "Valid for 24 hours"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {lang === "es" ? "Expira:" : "Expires:"}{" "}
                            {new Date(selectedPin.expiresAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="rounded-lg bg-primary/10 border border-primary/20 p-4 text-sm">
                          {lang === "es" 
                            ? "📱 Muestra este código en la tienda para retirar tu dinero en efectivo." 
                            : "📱 Show this code at the store to withdraw your money in cash."}
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Retiro;
