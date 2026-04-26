import { useState, useEffect } from "react";
import { Search, Loader2, CheckCircle2, ExternalLink, Store, Scan, RefreshCw } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ENSDisplay } from "@/components/ENSDisplay";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGetRemittance, useClaimRemittance, useIsCashoutPoint, useRegisterCashoutPoint } from "@/hooks/useTlalix";
import { formatUSDC, formatMXNFromContract, formatTimestamp, getRemittanceStatusText, getRemittanceStatusColor } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

const Comercio = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const [code, setCode] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [claimHash, setClaimHash] = useState("");

  // Verificar si la wallet es cashout point
  const { isActive: isCashoutPoint, cashoutPoint, refetch: refetchCashoutStatus } = useIsCashoutPoint(address);
  
  // Hook para registrar como cashout point
  const { 
    registerCashoutPoint, 
    isLoading: isRegistering, 
    isSuccess: isRegistered,
    error: registerError 
  } = useRegisterCashoutPoint();

  // Get remittance data
  const { remittance, isLoading: isLoadingRemittance, refetch } = useGetRemittance(searchCode);
  
  // Claim remittance
  const { claimRemittance, isLoading: isClaiming, isSuccess: isClaimed, hash, error } = useClaimRemittance();

  const handleSearch = () => {
    if (code.trim().length >= 6) {
      setSearchCode(code.toUpperCase());
    }
  };

  // Handle successful registration
  useEffect(() => {
    if (isRegistered) {
      refetchCashoutStatus();
      toast({
        title: lang === "es" ? "¡Registrado exitosamente!" : "Successfully registered!",
        description: lang === "es" 
          ? "Tu comercio ya puede procesar retiros de remesas" 
          : "Your business can now process remittance withdrawals",
      });
    }
  }, [isRegistered, lang, toast, refetchCashoutStatus]);

  // Handle successful claim
  useEffect(() => {
    if (isClaimed && hash) {
      setClaimHash(hash);
      refetch();
      toast({
        title: lang === "es" ? "¡Retiro procesado!" : "Withdrawal processed!",
        description: lang === "es" 
          ? "Los fondos han sido transferidos a tu wallet. Entrega el efectivo al cliente." 
          : "Funds have been transferred to your wallet. Deliver cash to the customer.",
      });
    }
  }, [isClaimed, hash, lang, toast, refetch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: lang === "es" ? "Error al procesar retiro" : "Withdrawal processing error",
        description: lang === "es" 
          ? "No se pudo procesar el retiro. Verifica el código y que la remesa esté disponible." 
          : "Could not process withdrawal. Verify the code and that the remittance is available.",
        variant: "destructive",
      });
    }
  }, [error, lang, toast]);

  // Handle registration errors
  useEffect(() => {
    if (registerError) {
      toast({
        title: lang === "es" ? "Error al registrar comercio" : "Business registration error",
        description: lang === "es" 
          ? "No se pudo completar el registro. Intenta nuevamente." 
          : "Could not complete registration. Please try again.",
        variant: "destructive",
      });
    }
  }, [registerError, lang, toast]);

  const handleRegister = () => {
    // Registrar con fee 0% (o puedes permitir que el comercio elija su fee)
    registerCashoutPoint("Mi Comercio", "Mi Ubicación", 0);
  };

  const handleClaim = () => {
    if (!isConnected) {
      toast({
        title: lang === "es" ? "Wallet no conectada" : "Wallet not connected",
        description: lang === "es" 
          ? "Conecta tu wallet para continuar" 
          : "Connect your wallet to continue",
        variant: "destructive",
      });
      return;
    }

    // HARDCODED: Permitir a cualquier wallet conectada procesar retiros (para demo)
    // En producción, deberías verificar isCashoutPoint
    
    claimRemittance(searchCode);
  };

  // HARDCODED: Permitir claim a cualquier wallet conectada (para demo)
  // Una remesa se puede reclamar si está en estado ReadyForPickup (2) o Pending (0)
  const canClaim = remittance && 
    !remittance.isClaimed && 
    (remittance.status === 0 || remittance.status === 2) && 
    isConnected; // Ya no verifica isCashoutPoint
  const alreadyClaimed = remittance && (remittance.isClaimed || isClaimed);

  return (
    <div className="min-h-screen bg-white py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-jade/[0.02] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-oro/[0.02] blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-16 max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <div className="h-20 w-20 bg-jade/10 rounded-[2rem] mx-auto flex items-center justify-center mb-6 shadow-sm">
            <Store className="h-10 w-10 text-jade" />
          </div>
          <h1 className="text-4xl font-black text-black mb-3 tracking-tighter uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            {lang === "es" ? "Portal para Comercios" : "Business Portal"}
          </h1>
          <p className="text-black/60 text-lg font-light italic" style={{ fontFamily: 'Caudex, serif' }}>
            {lang === "es" 
              ? "Procesa retiros de remesas y entrega efectivo a tus clientes" 
              : "Process remittance withdrawals and deliver cash to your customers"}
          </p>
        </div>

        <Tabs defaultValue="claim" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-black/[0.02] p-1.5 rounded-[2rem] border border-black/5 h-auto">
            <TabsTrigger value="claim" className="py-4 rounded-[1.5rem] data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-jade font-bold transition-all">
              <Scan className="h-5 w-5 mr-2" />
              {lang === "es" ? "Procesar Retiro" : "Process Withdrawal"}
            </TabsTrigger>
            <TabsTrigger value="register" className="py-4 rounded-[1.5rem] data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-jade font-bold transition-all">
              <Store className="h-5 w-5 mr-2" />
              {lang === "es" ? "Mi Comercio" : "My Business"}
            </TabsTrigger>
          </TabsList>

          {/* TAB: Procesar Retiro */}
          <TabsContent value="claim" className="space-y-8 animate-fade-in">
            {isConnected && (
              <Alert className="border-jade/20 bg-jade/5 rounded-[2rem] p-6 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-jade mt-0.5" />
                <AlertDescription className="text-jade font-medium ml-2">
                  <span className="text-lg font-bold block mb-1">
                    {lang === "es" ? "Modo Demo Activo" : "Demo Mode Active"}
                  </span>
                  <span className="opacity-80">
                    {lang === "es" 
                      ? "Puedes procesar cualquier retiro de prueba para validar el flujo." 
                      : "You can process any test withdrawal to validate the flow."}
                  </span>
                </AlertDescription>
              </Alert>
            )}

            <Card className="bg-white border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.03)] rounded-[2.5rem] overflow-hidden">
              <CardHeader className="pt-10 px-10">
                <CardTitle className="text-2xl font-black text-black tracking-tight uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                  {lang === "es" ? "Validar Código" : "Validate Code"}
                </CardTitle>
                <CardDescription className="text-black/60">
                  {lang === "es" 
                    ? "Escanea el QR del cliente o ingresa el código manual" 
                    : "Scan the customer's QR or enter the manual code"}
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
                    <Search className="h-4 w-4" />
                    {lang === "es" 
                      ? "Código no encontrado. Verifica e intenta nuevamente." 
                      : "Code not found. Please verify and try again."}
                  </div>
                )}
              </CardContent>
            </Card>

            {remittance && (
              <Card className="bg-white border border-black/5 shadow-[0_40px_100px_rgba(0,0,0,0.08)] rounded-[3rem] overflow-hidden animate-slide-up">
                <CardHeader className="pt-10 px-10">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-black text-black tracking-tight uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                      {lang === "es" ? "Detalles del retiro" : "Withdrawal details"}
                    </CardTitle>
                    <Badge className={`${getRemittanceStatusColor(remittance.status)} px-4 py-1.5 rounded-full text-sm font-black tracking-widest uppercase`}>
                      {getRemittanceStatusText(remittance.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-10 pb-10 space-y-8">
                  {/* Código Destacado */}
                  <div className="bg-gray-50 border border-black/5 p-6 rounded-[2rem] text-center shadow-inner">
                    <div className="text-sm text-black/40 font-bold uppercase tracking-[0.3em] mb-1">
                      {lang === "es" ? "Identificador" : "Identifier"}
                    </div>
                    <div className="text-4xl font-black font-mono tracking-widest text-jade">
                      {searchCode}
                    </div>
                  </div>

                  {/* Montos */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/[0.01] border border-black/5 p-6 rounded-[2rem] shadow-inner">
                      <div className="text-sm text-black/60 font-bold uppercase tracking-widest mb-2">
                        {lang === "es" ? "Monto enviado" : "Amount sent"}
                      </div>
                      <div className="text-2xl font-bold text-black">
                        {formatUSDC(remittance.amountUSD)}
                      </div>
                    </div>
                    <div className="bg-jade/5 p-6 rounded-[2rem] border border-jade/20 shadow-inner">
                      <div className="text-sm text-jade/60 font-bold uppercase tracking-widest mb-2">
                        {lang === "es" ? "A entregar en efectivo" : "To deliver in cash"}
                      </div>
                      <div className="text-3xl font-black text-jade tracking-tighter">
                        {formatMXNFromContract(remittance.amountMXN)}
                      </div>
                    </div>
                  </div>

                  {/* Participantes */}
                  <div className="space-y-4 pt-4 border-t border-black/5">
                    <div className="flex justify-between items-center px-2">
                      <span className="text-black/40 text-sm font-black uppercase tracking-widest">{lang === "es" ? "Cliente" : "Customer"}</span>
                      <div className="text-black font-medium text-sm">
                        <ENSDisplay address={remittance.recipient} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <span className="text-black/40 text-sm font-black uppercase tracking-widest">{lang === "es" ? "Remitente" : "Sender"}</span>
                      <div className="text-black font-medium text-sm">
                        <ENSDisplay address={remittance.sender} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <span className="text-black/40 text-sm font-black uppercase tracking-widest">{lang === "es" ? "Enviada" : "Sent"}</span>
                      <span className="text-black font-medium text-sm">{formatTimestamp(remittance.timestamp)}</span>
                    </div>
                  </div>

                  {/* Botón de procesar */}
                  {canClaim && (
                    <Button 
                      className="w-full h-20 bg-jade hover:bg-jade/90 text-white text-xl font-black rounded-[2rem] shadow-2xl shadow-jade/20 transition-all hover:scale-[1.02] uppercase tracking-widest" 
                      onClick={handleClaim}
                      disabled={isClaiming}
                    >
                      {isClaiming ? (
                        <>
                          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                          {lang === "es" ? "Validando en Blockchain..." : "Validating on Blockchain..."}
                        </>
                      ) : (
                        <>
                          <Scan className="mr-3 h-6 w-6" />
                          {lang === "es" ? "Procesar y Liquidar" : "Process and Liquidate"}
                        </>
                      )}
                    </Button>
                  )}

                  {/* Ya procesado */}
                  {alreadyClaimed && (
                    <div className="rounded-[2rem] bg-jade/5 border border-jade/20 p-8 text-center animate-fade-in shadow-inner">
                      <div className="h-16 w-16 bg-jade rounded-full mx-auto flex items-center justify-center shadow-xl shadow-jade/10 mb-4">
                        <CheckCircle2 className="h-10 w-10 text-white" />
                      </div>
                      <h4 className="text-2xl font-black text-jade mb-2 uppercase">
                        {lang === "es" ? "Retiro Liquidado" : "Withdrawal Liquidated"}
                      </h4>
                      <p className="text-black/60 mb-6 font-light">
                        {lang === "es" 
                          ? "La transacción ha sido confirmada. Los fondos están en tu wallet." 
                          : "Transaction confirmed. Funds are in your wallet."}
                      </p>
                      {claimHash && (
                        <a
                          href={`https://sepolia.scrollscan.com/tx/${claimHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:shadow-md rounded-xl text-sm font-medium text-jade transition-all border border-black/5"
                        >
                          {lang === "es" ? "Ver comprobante digital" : "View digital receipt"}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* TAB: Mi Comercio */}
          <TabsContent value="register" className="space-y-8 animate-fade-in">
            <Card className="bg-white border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.03)] rounded-[2.5rem] overflow-hidden">
              <CardHeader className="pt-10 px-10">
                <CardTitle className="text-2xl font-black text-black tracking-tight uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                  {lang === "es" ? "Gestión de Comercio" : "Business Management"}
                </CardTitle>
                <CardDescription className="text-black/60">
                  {lang === "es" 
                    ? "Configura tu punto de retiro y consulta tu estado" 
                    : "Configure your withdrawal point and check your status"}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-10 pb-10 space-y-8">
                {!isConnected ? (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 bg-black/[0.02] rounded-full mx-auto flex items-center justify-center mb-6">
                      <RefreshCw className="h-8 w-8 text-black/10" />
                    </div>
                    <p className="text-xl text-black/50 font-light italic" style={{ fontFamily: 'Caudex, serif' }}>
                      {lang === "es" 
                        ? "Conecta tu wallet para gestionar tu comercio" 
                        : "Connect your wallet to manage your business"}
                    </p>
                  </div>
                ) : isCashoutPoint ? (
                  <div className="bg-jade/5 border border-jade/20 rounded-[2.5rem] p-10 shadow-inner">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-14 w-14 bg-jade rounded-full flex items-center justify-center shadow-lg shadow-jade/10">
                        <CheckCircle2 className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-jade uppercase">{lang === "es" ? "Comercio Autorizado" : "Authorized Business"}</h4>
                        <p className="text-black/60 text-sm font-medium">{address}</p>
                      </div>
                    </div>
                    
                    {cashoutPoint && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-jade/10">
                        <div className="space-y-1">
                          <span className="text-black/40 text-xs font-black uppercase tracking-widest">{lang === "es" ? "Nombre Comercial" : "Business Name"}</span>
                          <p className="text-black font-bold text-lg">{cashoutPoint.name}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-black/40 text-xs font-black uppercase tracking-widest">{lang === "es" ? "Ubicación" : "Location"}</span>
                          <p className="text-black font-bold text-lg">{cashoutPoint.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-oro/5 border border-oro/20 rounded-[2rem] p-8">
                      <div className="flex gap-4">
                        <Store className="h-8 w-8 text-oro shrink-0" />
                        <div>
                          <h4 className="text-oro font-black uppercase mb-1">{lang === "es" ? "Únete a la Red Tlalix" : "Join the Tlalix Network"}</h4>
                          <p className="text-black/60 text-sm leading-relaxed">
                            {lang === "es" 
                              ? "Convierte tu negocio en un punto de retiro. Aumenta tu flujo de clientes y gana comisiones por cada remesa procesada." 
                              : "Turn your business into a withdrawal point. Increase customer flow and earn commissions for each processed remittance."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: "Escanea", desc: "Valida el QR del cliente" },
                        { title: "Liquida", desc: "Recibe fondos en tu wallet" },
                        { title: "Entrega", desc: "Da el efectivo al cliente" },
                        { title: "Gana", desc: "Obtén beneficios por servicio" }
                      ].map((item, i) => (
                        <div key={i} className="bg-black/[0.01] border border-black/5 p-4 rounded-2xl flex items-center gap-4">
                          <div className="h-8 w-8 bg-white border border-black/5 rounded-lg flex items-center justify-center text-sm font-black text-jade shadow-sm">{i+1}</div>
                          <div>
                            <p className="text-sm font-black text-black uppercase tracking-tight">{item.title}</p>
                            <p className="text-sm text-black/60">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className="w-full h-16 bg-black hover:bg-black/90 text-white text-lg font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest" 
                      onClick={handleRegister}
                      disabled={isRegistering}
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                          {lang === "es" ? "Registrando en Scroll..." : "Registering on Scroll..."}
                        </>
                      ) : (
                        <>
                          <Store className="mr-3 h-5 w-5" />
                          {lang === "es" ? "Registrar mi comercio" : "Register my business"}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Comercio;



