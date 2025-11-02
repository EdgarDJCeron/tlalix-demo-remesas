import { useState, useEffect } from "react";
import { Search, Loader2, CheckCircle2, ExternalLink, Store, QrCode as QrCodeIcon, Copy } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QRCode } from "@/components/QRCode";
import { ENSDisplay } from "@/components/ENSDisplay";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGetRemittance } from "@/hooks/useTlalix";
import { formatUSDC, formatMXNFromContract, formatTimestamp, getRemittanceStatusText, getRemittanceStatusColor } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

const Recibir = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const [code, setCode] = useState("");
  const [searchCode, setSearchCode] = useState("");

  // Obtener código de la URL si existe
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get('code');
    if (codeFromUrl) {
      const upperCode = codeFromUrl.toUpperCase();
      setCode(upperCode);
      setSearchCode(upperCode);
    }
  }, []);

  // Get remittance data
  const { remittance, isLoading: isLoadingRemittance } = useGetRemittance(searchCode);

  const handleSearch = () => {
    if (code.trim().length >= 6) {
      setSearchCode(code.toUpperCase());
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(searchCode);
    toast({
      title: lang === "es" ? "Código copiado" : "Code copied",
      description: lang === "es" 
        ? "El código ha sido copiado al portapapeles" 
        : "The code has been copied to clipboard",
    });
  };

  const alreadyClaimed = remittance && remittance.isClaimed;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-center text-white">
          {lang === "es" ? "Recibir remesa" : "Receive remittance"}
        </h1>

        <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">
              {lang === "es" ? "Ingresa tu código" : "Enter your code"}
            </CardTitle>
            <CardDescription className="text-white/70">
              {lang === "es" 
                ? "Introduce el código que recibiste por WhatsApp" 
                : "Enter the code you received via WhatsApp"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="code" className="text-white">
                {lang === "es" ? "Código de remesa (Ej: ABC123)" : "Remittance code (Ex: ABC123)"}
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="code"
                  placeholder="ABC123"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  maxLength={10}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-lg font-mono bg-white/5 border-white/20 text-white placeholder:text-white/70"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={!code || isLoadingRemittance}
                  className="bg-[hsl(var(--color-celeste))] hover:bg-[hsl(var(--color-celeste)/0.8)] text-white"
                >
                  {isLoadingRemittance ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {!remittance && searchCode && !isLoadingRemittance && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400">
                {lang === "es" 
                  ? "Código no encontrado. Verifica e intenta nuevamente." 
                  : "Code not found. Please verify and try again."}
              </div>
            )}
          </CardContent>
        </Card>

        {remittance && (
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-white">
                  {lang === "es" ? "Tu remesa" : "Your remittance"}
                </CardTitle>
                <Badge className={getRemittanceStatusColor(remittance.status)}>
                  {getRemittanceStatusText(remittance.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Code */}
              <div className="bg-white p-6 rounded-lg mx-auto max-w-sm">
                <QRCode value={searchCode} size={256} />
              </div>

              {/* Código */}
              <div className="bg-[hsl(var(--color-celeste))] text-white p-4 rounded-lg text-center">
                <div className="text-sm opacity-90 mb-1">
                  {lang === "es" ? "Tu código" : "Your code"}
                </div>
                <div className="text-3xl font-bold font-mono tracking-wider mb-3">
                  {searchCode}
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleCopyCode}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {lang === "es" ? "Copiar código" : "Copy code"}
                </Button>
              </div>

              {/* Instrucciones */}
              {!alreadyClaimed && (
                <Alert className="border-blue-400/30 bg-blue-500/10">
                  <Store className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-400">
                    <div className="font-semibold mb-2">
                      {lang === "es" ? "¿Cómo retirar tu dinero?" : "How to withdraw your money?"}
                    </div>
                    <ol className="text-sm space-y-1 ml-4 list-decimal text-blue-300">
                      <li>{lang === "es" ? "Acude a una tienda afiliada Tlalix" : "Go to a Tlalix affiliated store"}</li>
                      <li>{lang === "es" ? "Muestra este código QR o diles el código" : "Show this QR code or tell them the code"}</li>
                      <li>{lang === "es" ? "La tienda procesará tu retiro" : "The store will process your withdrawal"}</li>
                      <li>{lang === "es" ? "Recibirás tu dinero en efectivo" : "You will receive your money in cash"}</li>
                    </ol>
                    <Button 
                      className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white" 
                      asChild
                    >
                      <a href="/retiro">
                        <Store className="mr-2 h-4 w-4" />
                        {lang === "es" ? "Ver tiendas cercanas" : "View nearby stores"}
                      </a>
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Montos */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                  <div className="text-sm text-white/70 mb-1">
                    {lang === "es" ? "Enviado" : "Sent"}
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {formatUSDC(remittance.amountUSD)}
                  </div>
                </div>
                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
                  <div className="text-sm text-lime-300 mb-1">
                    {lang === "es" ? "Recibirás" : "You'll receive"}
                  </div>
                  <div className="text-2xl font-bold text-lime-300">
                    {formatMXNFromContract(remittance.amountMXN)}
                  </div>
                </div>
              </div>

              {/* Destinatario */}
              <div className="space-y-2">
                <Label className="text-white/70">
                  {lang === "es" ? "Destinatario" : "Recipient"}
                </Label>
                <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                  <ENSDisplay address={remittance.recipient} />
                </div>
              </div>

              {/* Remitente */}
              <div className="space-y-2">
                <Label className="text-white/70">
                  {lang === "es" ? "De" : "From"}
                </Label>
                <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                  <ENSDisplay address={remittance.sender} />
                </div>
              </div>

              {/* Fecha */}
              <div className="text-sm text-white/70 text-center">
                {lang === "es" ? "Enviada el" : "Sent on"}: {formatTimestamp(remittance.timestamp)}
              </div>

              {/* Already Claimed */}
              {alreadyClaimed && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4">
                  <div className="flex items-center gap-2 text-lime-300 mb-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <p className="font-bold">
                      {lang === "es" ? "¡Remesa retirada!" : "Remittance withdrawn!"}
                    </p>
                  </div>
                  <p className="text-sm text-white/70">
                    {lang === "es" 
                      ? "Esta remesa ya fue retirada y procesada" 
                      : "This remittance has already been withdrawn and processed"}
                  </p>
                </div>
              )}

              {/* Link para comercios */}
              <div className="pt-4 border-t border-white/10">
                <Alert className="bg-white/5 border-white/10">
                  <Store className="h-4 w-4 text-white" />
                  <AlertDescription className="text-white">
                    <div className="font-semibold mb-1">
                      {lang === "es" ? "¿Eres un comercio?" : "Are you a business?"}
                    </div>
                    <p className="text-sm mb-2 text-white/70">
                      {lang === "es" 
                        ? "Si quieres procesar retiros de remesas en tu negocio" 
                        : "If you want to process remittance withdrawals in your business"}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/40" 
                      asChild
                    >
                      <a href="/comercio">
                        <Store className="mr-2 h-4 w-4" />
                        {lang === "es" ? "Ir al portal de comercios" : "Go to business portal"}
                      </a>
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Recibir;
