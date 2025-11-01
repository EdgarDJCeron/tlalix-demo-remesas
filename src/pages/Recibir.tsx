import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockReceipts } from "@/mocks/receipts";

const Recibir = () => {
  const { lang } = useLanguage();
  const [code, setCode] = useState("");
  const [receipt, setReceipt] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    const found = mockReceipts[code.toUpperCase()];
    if (found) {
      setReceipt(found);
      setNotFound(false);
    } else {
      setReceipt(null);
      setNotFound(true);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-center text-foreground">
          {lang === "es" ? "Recibir remesa" : "Receive remittance"}
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {lang === "es" ? "Ingresa tu código" : "Enter your code"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="code">
                {lang === "es" ? "Código de remesa (Ej: ABC123)" : "Remittance code (Ex: ABC123)"}
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="code"
                  placeholder="ABC123"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
                <Button onClick={handleSearch} disabled={!code}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {notFound && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
                {lang === "es" 
                  ? "Código no encontrado. Verifica e intenta nuevamente." 
                  : "Code not found. Please verify and try again."}
              </div>
            )}
          </CardContent>
        </Card>

        {receipt && (
          <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">
                {lang === "es" ? "Tu remesa está lista" : "Your remittance is ready"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white dark:bg-background rounded-lg p-8 text-center border">
                <div className="h-40 w-40 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-6xl font-mono font-bold text-primary">QR</div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {lang === "es" ? "Código:" : "Code:"} <span className="font-bold font-mono">{receipt.code}</span>
                </p>
                <p className="text-3xl font-bold text-success mb-2">
                  ${receipt.mxn.toFixed(2)} MXN
                </p>
                <p className="text-xs text-muted-foreground">
                  {lang === "es" ? "De:" : "From:"} {receipt.from}
                </p>
              </div>

              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{lang === "es" ? "Monto original:" : "Original amount:"}</span>
                  <span className="font-medium">${receipt.usd.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{lang === "es" ? "Estado:" : "Status:"}</span>
                  <span className="font-medium capitalize">{receipt.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{lang === "es" ? "Válido hasta:" : "Valid until:"}</span>
                  <span className="font-medium">{new Date(receipt.expiresAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
                <p className="text-sm text-center">
                  {lang === "es" 
                    ? "💡 Este QR es una demostración. En producción verificaría la transacción real en la blockchain." 
                    : "💡 This QR is a demonstration. In production it would verify the real transaction on the blockchain."}
                </p>
              </div>

              <Button className="w-full bg-gradient-primary" asChild>
                <a href="/retiro">
                  {lang === "es" ? "Ver puntos de retiro" : "View withdrawal points"}
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Recibir;
