import { useState } from "react";
import { ArrowRight, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { calculateTotal, currentRates } from "@/mocks/rates";
import { generateReceipt } from "@/mocks/receipts";
import { useToast } from "@/hooks/use-toast";

type Step = 1 | 2 | 3 | 4;
type Status = "idle" | "processing" | "success" | "error";

const Enviar = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>(1);
  const [status, setStatus] = useState<Status>("idle");
  const [usd, setUsd] = useState("");
  const [recipient, setRecipient] = useState("");
  const [receipt, setReceipt] = useState<any>(null);

  const calculation = usd ? calculateTotal(parseFloat(usd)) : null;

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  const handleConfirm = () => {
    setStatus("processing");
    setStep(4);

    // Simulate transaction
    setTimeout(() => {
      const newReceipt = generateReceipt("juan.eth", recipient, parseFloat(usd), calculation?.mxn || 0);
      setReceipt(newReceipt);
      setStatus("success");
      toast({
        title: lang === "es" ? "¡Remesa enviada!" : "Remittance sent!",
        description: lang === "es" 
          ? `Código: ${newReceipt.code}` 
          : `Code: ${newReceipt.code}`,
      });
    }, 3000);
  };

  const resetForm = () => {
    setStep(1);
    setStatus("idle");
    setUsd("");
    setRecipient("");
    setReceipt(null);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-center text-foreground">
          {lang === "es" ? "Enviar remesa" : "Send remittance"}
        </h1>

        {/* Progress Steps */}
        <div className="mb-8 flex justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              <span className="mt-2 text-xs text-muted-foreground">
                {s === 1 && (lang === "es" ? "Monto" : "Amount")}
                {s === 2 && (lang === "es" ? "Destinatario" : "Recipient")}
                {s === 3 && (lang === "es" ? "Confirmación" : "Confirmation")}
                {s === 4 && (lang === "es" ? "Resultado" : "Result")}
              </span>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && (lang === "es" ? "Paso 1: Ingresa el monto" : "Step 1: Enter amount")}
              {step === 2 && (lang === "es" ? "Paso 2: Destinatario" : "Step 2: Recipient")}
              {step === 3 && (lang === "es" ? "Paso 3: Confirmar detalles" : "Step 3: Confirm details")}
              {step === 4 && (lang === "es" ? "Paso 4: Resultado" : "Step 4: Result")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Amount */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="usd">{lang === "es" ? "Monto en USD" : "Amount in USD"}</Label>
                  <Input
                    id="usd"
                    type="number"
                    placeholder="100"
                    value={usd}
                    onChange={(e) => setUsd(e.target.value)}
                  />
                </div>
                {calculation && (
                  <div className="rounded-lg bg-muted p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>{lang === "es" ? "Tipo de cambio:" : "Exchange rate:"}</span>
                      <span className="font-medium">{currentRates.usdToMxn} MXN/USD</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-success">
                      <span>{lang === "es" ? "Recibirá:" : "Will receive:"}</span>
                      <span>${calculation.mxn.toFixed(2)} MXN</span>
                    </div>
                  </div>
                )}
                <Button onClick={handleNext} disabled={!usd || parseFloat(usd) <= 0} className="w-full">
                  {lang === "es" ? "Continuar" : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 2: Recipient */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipient">
                    {lang === "es" ? "Alias ENS o correo" : "ENS alias or email"}
                  </Label>
                  <Input
                    id="recipient"
                    placeholder="mama@email.com"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    {lang === "es" ? "Atrás" : "Back"}
                  </Button>
                  <Button onClick={handleNext} disabled={!recipient} className="flex-1">
                    {lang === "es" ? "Continuar" : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && calculation && (
              <div className="space-y-4">
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{lang === "es" ? "Monto:" : "Amount:"}</span>
                    <span className="font-medium">${parseFloat(usd).toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{lang === "es" ? "Comisión (1.5%):" : "Fee (1.5%):"}</span>
                    <span className="font-medium">${calculation.fee.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{lang === "es" ? "Destinatario:" : "Recipient:"}</span>
                    <span className="font-medium">{recipient}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>{lang === "es" ? "Recibirá:" : "Will receive:"}</span>
                    <span className="text-success">${calculation.mxn.toFixed(2)} MXN</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    {lang === "es" ? "Atrás" : "Back"}
                  </Button>
                  <Button onClick={handleConfirm} className="flex-1 bg-gradient-primary">
                    {lang === "es" ? "Confirmar envío" : "Confirm send"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Result */}
            {step === 4 && (
              <div className="space-y-6 text-center">
                {status === "processing" && (
                  <div className="py-8">
                    <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary" />
                    <p className="mt-4 text-lg font-medium">
                      {lang === "es" ? "Procesando transacción..." : "Processing transaction..."}
                    </p>
                  </div>
                )}

                {status === "success" && receipt && (
                  <div className="space-y-4">
                    <CheckCircle2 className="h-16 w-16 mx-auto text-success" />
                    <h3 className="text-2xl font-bold text-success">
                      {lang === "es" ? "¡Remesa enviada!" : "Remittance sent!"}
                    </h3>
                    <div className="bg-muted rounded-lg p-6 space-y-3">
                      <div className="h-32 w-32 mx-auto bg-white rounded-lg flex items-center justify-center border-2 border-primary">
                        <div className="text-4xl font-mono font-bold text-primary">QR</div>
                      </div>
                      <p className="font-mono text-sm">
                        {lang === "es" ? "Código:" : "Code:"} <span className="font-bold">{receipt.code}</span>
                      </p>
                      <p className="text-xs text-muted-foreground break-all">
                        {lang === "es" ? "Enlace:" : "Link:"} https://tlalix.app/r/{receipt.code}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lang === "es" ? "Válido hasta:" : "Valid until:"}{" "}
                        {new Date(receipt.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button onClick={resetForm} className="w-full">
                      {lang === "es" ? "Enviar otra remesa" : "Send another remittance"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Enviar;
