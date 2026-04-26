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
    <div className="min-h-screen py-32 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-jade/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-oro/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-16 max-w-2xl relative z-10">
        <h1 className="mb-12 text-5xl md:text-6xl font-black text-center text-black animate-fade-in tracking-tighter" style={{ fontFamily: 'Cinzel, serif' }}>
          {lang === "es" ? "Recibir remesa" : "Receive remittance"}
        </h1>

        <Card className="mb-8 bg-white border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pt-10 px-10">
            <CardTitle className="text-3xl font-bold text-black tracking-tight" style={{ fontFamily: 'Forum, serif' }}>
              {lang === "es" ? "Ingresa tu código" : "Enter your code"}
            </CardTitle>
            <CardDescription className="text-black/60 font-medium">
              {lang === "es" 
                ? "Introduce el código secreto que te compartieron" 
                : "Enter the secret code shared with you"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-10 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="code" className="text-black/80 font-medium tracking-wide ml-1">
                {lang === "es" ? "Código de remesa" : "Remittance code"}
              </Label>
              <div className="flex gap-3">
                <Input
                  id="code"
                  placeholder="X8Y2Z4"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  maxLength={10}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-16 text-2xl font-mono font-bold tracking-[0.4em] bg-black/[0.02] border-black/5 text-black placeholder:text-black/40 rounded-2xl px-6 focus:border-jade/30 shadow-inner"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={!code || isLoadingRemittance}
                  className="h-16 w-16 bg-jade hover:bg-jade/90 text-white rounded-2xl shadow-xl shadow-jade/20 transition-all"
                >
                  {isLoadingRemittance ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Search className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>

            {!remittance && searchCode && !isLoadingRemittance && (
              <div className="rounded-2xl bg-red-500/5 border border-red-500/10 p-4 text-sm text-red-500 font-medium animate-fade-in flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                {lang === "es" 
                  ? "Código no válido o no encontrado" 
                  : "Invalid or missing code"}
              </div>
            )}
          </CardContent>
        </Card>

        {remittance && (
          <Card className="bg-white border border-black/5 shadow-[0_40px_100px_rgba(0,0,0,0.08)] rounded-[3rem] overflow-hidden animate-slide-up">
            <CardHeader className="pt-10 px-10">
              <div className="flex justify-between items-center">
                <CardTitle className="text-3xl font-bold text-black tracking-tight" style={{ fontFamily: 'Forum, serif' }}>
                  {lang === "es" ? "Detalles del Envío" : "Transfer Details"}
                </CardTitle>
                <Badge className={`${getRemittanceStatusColor(remittance.status)} px-4 py-1.5 rounded-full text-sm font-black tracking-widest uppercase`}>
                  {getRemittanceStatusText(remittance.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-10 pb-10 space-y-10">
              {/* QR Code Container */}
              <div className="bg-gray-50 border border-black/5 p-8 rounded-[2.5rem] mx-auto w-fit shadow-inner">
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  <QRCode value={searchCode} size={220} />
                </div>
              </div>

              {/* Código Destacado */}
              <div className="bg-gray-50 border border-black/5 p-8 rounded-[2.5rem] text-center shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-jade/[0.02] blur-3xl" />
                <div className="relative z-10">
                  <div className="text-sm text-black/40 font-bold uppercase tracking-[0.2em] mb-2">
                    {lang === "es" ? "Código de Retiro" : "Withdrawal Code"}
                  </div>
                  <div className="text-5xl font-black font-mono tracking-[0.3em] text-jade mb-6">
                    {searchCode}
                  </div>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleCopyCode}
                    className="border-black/10 bg-white hover:bg-gray-50 text-black rounded-xl px-8 shadow-sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {lang === "es" ? "Copiar" : "Copy"}
                  </Button>
                </div>
              </div>

              {/* Montos */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/[0.01] border border-black/5 p-6 rounded-3xl shadow-inner">
                  <div className="text-sm text-black/60 font-bold uppercase tracking-widest mb-1">
                    {lang === "es" ? "Monto Original" : "Original Amount"}
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {formatUSDC(remittance.amountUSD)}
                  </div>
                </div>
                <div className="bg-jade/5 p-6 rounded-3xl border border-jade/20 shadow-inner">
                  <div className="text-sm text-jade/60 font-bold uppercase tracking-widest mb-1">
                    {lang === "es" ? "Monto a Recibir" : "To Receive"}
                  </div>
                  <div className="text-2xl font-black text-jade">
                    {formatMXNFromContract(remittance.amountMXN)}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              {!alreadyClaimed && (
                <div className="rounded-[2.5rem] bg-gray-50 border border-black/5 p-8 space-y-6 shadow-inner">
                  <div className="flex items-center gap-3 text-jade">
                    <Store className="h-6 w-6" />
                    <h4 className="text-xl font-bold">{lang === "es" ? "Cómo retirar efectivo" : "How to withdraw cash"}</h4>
                  </div>
                  <div className="space-y-4">
                    {[
                      lang === "es" ? "Busca una tienda afiliada en el mapa" : "Find an affiliated store on the map",
                      lang === "es" ? "Muestra este código QR al cajero" : "Show this QR code to the cashier",
                      lang === "es" ? "El cajero validará el retiro en segundos" : "The cashier will validate in seconds",
                      lang === "es" ? "Recibe tus pesos mexicanos al instante" : "Receive your Mexican pesos instantly"
                    ].map((step, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="h-6 w-6 rounded-full bg-jade/10 text-jade text-sm font-bold flex items-center justify-center shrink-0 mt-1">{i+1}</div>
                        <p className="text-black/80 font-medium">{step}</p>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full h-16 bg-jade hover:bg-jade/90 text-white rounded-2xl font-bold shadow-xl shadow-jade/20 transition-all" 
                    asChild
                  >
                    <a href="/retiro">
                      <Store className="mr-2 h-5 w-5" />
                      {lang === "es" ? "Ver mapa de puntos de retiro" : "View withdrawal points map"}
                    </a>
                  </Button>
                </div>
              )}

              {/* Info Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-4">
                  <span className="text-black/40 text-sm font-bold uppercase tracking-widest">{lang === "es" ? "Enviado por" : "Sent by"}</span>
                  <div className="text-black font-medium text-sm">
                    <ENSDisplay address={remittance.sender} />
                  </div>
                </div>
                <div className="flex justify-between items-center px-4">
                  <span className="text-black/40 text-sm font-bold uppercase tracking-widest">{lang === "es" ? "Fecha de envío" : "Sent date"}</span>
                  <span className="text-black font-medium text-sm">{formatTimestamp(remittance.timestamp)}</span>
                </div>
              </div>

              {/* Already Claimed */}
              {alreadyClaimed && (
                <div className="rounded-3xl bg-jade/5 border border-jade/20 p-8 text-center animate-fade-in shadow-inner">
                  <div className="h-16 w-16 bg-jade rounded-full mx-auto flex items-center justify-center shadow-xl shadow-jade/10 mb-4">
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-jade mb-2">
                    {lang === "es" ? "Remesa ya retirada" : "Remittance withdrawn"}
                  </h4>
                  <p className="text-black/60">
                    {lang === "es" 
                      ? "Esta transacción ya fue completada exitosamente" 
                      : "This transaction has been successfully completed"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Recibir;



