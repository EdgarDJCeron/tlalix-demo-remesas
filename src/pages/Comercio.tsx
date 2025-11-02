import { useState, useEffect } from "react";
import { Search, Loader2, CheckCircle2, ExternalLink, Store, Scan } from "lucide-react";
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

    if (!isCashoutPoint) {
      toast({
        title: lang === "es" ? "No registrado" : "Not registered",
        description: lang === "es" 
          ? "Debes registrar tu comercio primero" 
          : "You must register your business first",
        variant: "destructive",
      });
      return;
    }

    claimRemittance(searchCode);
  };

  // Una remesa se puede reclamar si está en estado ReadyForPickup (2) o Pending (0)
  const canClaim = remittance && 
    !remittance.isClaimed && 
    (remittance.status === 0 || remittance.status === 2) && 
    isConnected && 
    isCashoutPoint;
  const alreadyClaimed = remittance && (remittance.isClaimed || isClaimed);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <Store className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {lang === "es" ? "Portal para Comercios" : "Business Portal"}
          </h1>
          <p className="text-muted-foreground">
            {lang === "es" 
              ? "Procesa retiros de remesas y entrega efectivo a tus clientes" 
              : "Process remittance withdrawals and deliver cash to your customers"}
          </p>
        </div>

        <Tabs defaultValue="claim" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="claim">
              <Scan className="h-4 w-4 mr-2" />
              {lang === "es" ? "Procesar Retiro" : "Process Withdrawal"}
            </TabsTrigger>
            <TabsTrigger value="register">
              <Store className="h-4 w-4 mr-2" />
              {lang === "es" ? "Mi Comercio" : "My Business"}
            </TabsTrigger>
          </TabsList>

          {/* TAB: Procesar Retiro */}
          <TabsContent value="claim" className="space-y-6">
            {/* Estado de registro */}
            {!isCashoutPoint && isConnected && (
              <Alert className="border-warning/20 bg-warning/10">
                <Store className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning">
                  {lang === "es" 
                    ? "⚠️ Debes registrar tu comercio antes de poder procesar retiros. Ve a la pestaña 'Mi Comercio'" 
                    : "⚠️ You must register your business before processing withdrawals. Go to the 'My Business' tab"}
                </AlertDescription>
              </Alert>
            )}

            {isCashoutPoint && (
              <Alert className="border-success/20 bg-success/10">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">
                  {lang === "es" 
                    ? "✓ Tu comercio está registrado y activo" 
                    : "✓ Your business is registered and active"}
                  {cashoutPoint && cashoutPoint.name && (
                    <span className="block text-sm mt-1">
                      {cashoutPoint.name}
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>
                  {lang === "es" ? "Escanear o ingresar código" : "Scan or enter code"}
                </CardTitle>
                <CardDescription>
                  {lang === "es" 
                    ? "Solicita al cliente que te muestre el código QR o el código alfanumérico" 
                    : "Ask the customer to show you the QR code or alphanumeric code"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="code">
                    {lang === "es" ? "Código de remesa" : "Remittance code"}
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="code"
                      placeholder="ABC123"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      maxLength={10}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="text-lg font-mono"
                    />
                    <Button onClick={handleSearch} disabled={!code || isLoadingRemittance}>
                      {isLoadingRemittance ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {!remittance && searchCode && !isLoadingRemittance && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
                    {lang === "es" 
                      ? "Código no encontrado. Verifica e intenta nuevamente." 
                      : "Code not found. Please verify and try again."}
                  </div>
                )}
              </CardContent>
            </Card>

            {remittance && (
              <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>
                      {lang === "es" ? "Detalles del retiro" : "Withdrawal details"}
                    </CardTitle>
                    <Badge className={getRemittanceStatusColor(remittance.status)}>
                      {getRemittanceStatusText(remittance.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Código */}
                  <div className="bg-gradient-primary text-primary-foreground p-4 rounded-lg text-center">
                    <div className="text-sm opacity-90 mb-1">
                      {lang === "es" ? "Código" : "Code"}
                    </div>
                    <div className="text-3xl font-bold font-mono tracking-wider">
                      {searchCode}
                    </div>
                  </div>

                  {/* Montos */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">
                        {lang === "es" ? "Monto enviado" : "Amount sent"}
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {formatUSDC(remittance.amountUSD)}
                      </div>
                    </div>
                    <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                      <div className="text-sm text-green-600 dark:text-green-400 mb-1">
                        {lang === "es" ? "Entregar en efectivo" : "Deliver in cash"}
                      </div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatMXNFromContract(remittance.amountMXN)}
                      </div>
                    </div>
                  </div>

                  {/* Destinatario */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      {lang === "es" ? "Cliente (destinatario)" : "Customer (recipient)"}
                    </Label>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <ENSDisplay address={remittance.recipient} />
                    </div>
                  </div>

                  {/* Remitente */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      {lang === "es" ? "Remitente" : "Sender"}
                    </Label>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <ENSDisplay address={remittance.sender} />
                    </div>
                  </div>

                  {/* Fecha */}
                  <div className="text-sm text-muted-foreground">
                    {lang === "es" ? "Enviada el" : "Sent on"}: {formatTimestamp(remittance.timestamp)}
                  </div>

                  {/* Botón de procesar */}
                  {canClaim && (
                    <Button 
                      className="w-full bg-gradient-primary h-14 text-lg" 
                      onClick={handleClaim}
                      disabled={isClaiming}
                    >
                      {isClaiming ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {lang === "es" ? "Procesando..." : "Processing..."}
                        </>
                      ) : (
                        <>
                          <Store className="mr-2 h-5 w-5" />
                          {lang === "es" ? "Procesar retiro y entregar efectivo" : "Process withdrawal and deliver cash"}
                        </>
                      )}
                    </Button>
                  )}

                  {/* Ya procesado */}
                  {alreadyClaimed && (
                    <div className="rounded-lg bg-success/10 border border-success/20 p-4">
                      <div className="flex items-center gap-2 text-success mb-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <p className="font-bold">
                          {lang === "es" ? "¡Retiro ya procesado!" : "Withdrawal already processed!"}
                        </p>
                      </div>
                      {claimHash && (
                        <a
                          href={`https://sepolia.scrollscan.com/tx/${claimHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          {lang === "es" ? "Ver transacción" : "View transaction"}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* No se puede procesar */}
                  {!canClaim && !alreadyClaimed && remittance && (
                    <div className="rounded-lg bg-muted border p-4 text-sm text-center text-muted-foreground">
                      {!isConnected 
                        ? (lang === "es" 
                            ? "Conecta tu wallet para procesar el retiro" 
                            : "Connect your wallet to process the withdrawal")
                        : !isCashoutPoint
                        ? (lang === "es" 
                            ? "Debes registrar tu comercio primero" 
                            : "You must register your business first")
                        : (lang === "es" 
                            ? "Esta remesa no está disponible para retiro" 
                            : "This remittance is not available for withdrawal")
                      }
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* TAB: Mi Comercio */}
          <TabsContent value="register" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {lang === "es" ? "Información del comercio" : "Business information"}
                </CardTitle>
                <CardDescription>
                  {lang === "es" 
                    ? "Registra tu comercio para poder procesar retiros de remesas" 
                    : "Register your business to process remittance withdrawals"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isConnected ? (
                  <Alert>
                    <AlertDescription>
                      {lang === "es" 
                        ? "Conecta tu wallet para continuar" 
                        : "Connect your wallet to continue"}
                    </AlertDescription>
                  </Alert>
                ) : isCashoutPoint ? (
                  <Alert className="border-success/20 bg-success/10">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <AlertDescription className="text-success">
                      <div className="font-bold mb-2">
                        {lang === "es" ? "✓ Comercio registrado y activo" : "✓ Business registered and active"}
                      </div>
                      {cashoutPoint && (
                        <div className="space-y-1 text-sm">
                          {cashoutPoint.name && (
                            <div>
                              <span className="opacity-75">{lang === "es" ? "Nombre:" : "Name:"}</span>{" "}
                              {cashoutPoint.name}
                            </div>
                          )}
                          {cashoutPoint.location && (
                            <div>
                              <span className="opacity-75">{lang === "es" ? "Ubicación:" : "Location:"}</span>{" "}
                              {cashoutPoint.location}
                            </div>
                          )}
                          {cashoutPoint.feePct !== undefined && (
                            <div>
                              <span className="opacity-75">{lang === "es" ? "Comisión:" : "Fee:"}</span>{" "}
                              {(cashoutPoint.feePct / 100).toFixed(2)}%
                            </div>
                          )}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert className="border-blue-500/20 bg-blue-500/10">
                      <Store className="h-4 w-4 text-blue-500" />
                      <AlertDescription className="text-blue-500">
                        {lang === "es" 
                          ? "Registra tu comercio para empezar a procesar retiros de remesas. Es gratis y solo toma un momento." 
                          : "Register your business to start processing remittance withdrawals. It's free and only takes a moment."}
                      </AlertDescription>
                    </Alert>

                    <div className="bg-muted/30 p-4 rounded-lg space-y-2 text-sm">
                      <h3 className="font-semibold">
                        {lang === "es" ? "¿Cómo funciona?" : "How does it work?"}
                      </h3>
                      <ul className="space-y-1 ml-4 list-disc text-muted-foreground">
                        <li>{lang === "es" ? "Los clientes llegan con un código QR o alfanumérico" : "Customers arrive with a QR or alphanumeric code"}</li>
                        <li>{lang === "es" ? "Escaneas o ingresas el código en esta plataforma" : "You scan or enter the code on this platform"}</li>
                        <li>{lang === "es" ? "Procesas el retiro (los fondos llegan a tu wallet)" : "You process the withdrawal (funds arrive to your wallet)"}</li>
                        <li>{lang === "es" ? "Entregas el efectivo equivalente al cliente" : "You deliver the equivalent cash to the customer"}</li>
                      </ul>
                    </div>

                    <Button 
                      className="w-full bg-gradient-primary h-12" 
                      onClick={handleRegister}
                      disabled={isRegistering}
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {lang === "es" ? "Registrando..." : "Registering..."}
                        </>
                      ) : (
                        <>
                          <Store className="mr-2 h-5 w-5" />
                          {lang === "es" ? "Registrar mi comercio" : "Register my business"}
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {isCashoutPoint && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {lang === "es" ? "Estadísticas" : "Statistics"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {lang === "es" 
                      ? "Próximamente: estadísticas de retiros procesados" 
                      : "Coming soon: processed withdrawals statistics"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Comercio;
