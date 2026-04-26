import { useState, useEffect } from "react";
import { ArrowRight, Loader2, CheckCircle2, XCircle, ExternalLink, RefreshCw, Search } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WalletStatus } from "@/components/WalletStatus";
import { QRCode } from "@/components/QRCode";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useCreateRemittance, useCalculateReceiveAmount, useIsCodeAvailable, useGetUserByAlias } from "@/hooks/useTlalix";
import { useUSDCBalance, useUSDCApprove, useUSDCFaucet } from "@/hooks/useUSDC";
import { formatUSDC, formatMXN, generateCode, formatPercentage } from "@/lib/format";

type Step = 1 | 2 | 3 | 4;
type Status = "idle" | "processing" | "success" | "error";

const Enviar = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  
  const [step, setStep] = useState<Step>(1);
  const [status, setStatus] = useState<Status>("idle");
  const [usd, setUsd] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientInput, setRecipientInput] = useState("");
  const [code, setCode] = useState("");
  const [txHash, setTxHash] = useState<string>("");
  const [isSearchingAlias, setIsSearchingAlias] = useState(false);

  // Web3 Hooks
  const { balance, refetch: refetchBalance } = useUSDCBalance(address);
  const { calculation } = useCalculateReceiveAmount(usd || "0");
  const { isAvailable } = useIsCodeAvailable(code);
  const { approve, isLoading: isApproving, isSuccess: isApproved, hash: approveHash } = useUSDCApprove();
  const { createRemittance, isLoading: isCreating, isSuccess, error: createError, hash: remittanceHash } = useCreateRemittance();
  const { requestFaucet, isLoading: isFaucetLoading } = useUSDCFaucet();
  const { user: aliasUser } = useGetUserByAlias(recipientInput.startsWith("@") ? recipientInput.slice(1) : "");

  // Cálculo local del monto MXN (para evitar el bug del contrato en el preview)
  const calculateLocalMXN = (usdAmount: string): { netUSD: bigint; amountMXN: bigint; fee: bigint } => {
    if (!usdAmount || parseFloat(usdAmount) <= 0) {
      return { netUSD: BigInt(0), amountMXN: BigInt(0), fee: BigInt(0) };
    }
    
    const amountUSD = BigInt(Math.floor(parseFloat(usdAmount) * 1000000)); // 6 decimales
    const fee = (amountUSD * BigInt(150)) / BigInt(10000); // 1.5%
    const netUSD = amountUSD - fee;
    
    // Cálculo CORRECTO del MXN
    // netUSD: 98,500,000 (98.50 con 6 decimales)
    // exchangeRate: 1750 (17.50 con 2 decimales implícitos)
    // Resultado final: centavos (2 decimales)
    //
    // 98.50 USD * 17.50 MXN/USD = 1,723.75 MXN = 172,375 centavos
    // Fórmula: (98,500,000 * 1750) / 1,000,000 = 172,375
    const amountMXN = (netUSD * BigInt(1750)) / BigInt(1000000);
    
    console.log('DEBUG Cálculo MXN:', {
      usdAmount,
      amountUSD: amountUSD.toString(),
      fee: fee.toString(),
      netUSD: netUSD.toString(),
      amountMXN: amountMXN.toString(),
      formatted: formatMXN(amountMXN)
    });
    
    return { netUSD, amountMXN, fee };
  };

  const localCalc = calculateLocalMXN(usd);

  // Auto-generate code when reaching step 2
  useEffect(() => {
    if (step === 2 && !code) {
      setCode(generateCode());
    }
  }, [step, code]);

  // Resolve alias to address
  useEffect(() => {
    if (recipientInput.startsWith("@")) {
      setIsSearchingAlias(true);
      const alias = recipientInput.slice(1);
      
      if (aliasUser && aliasUser.wallet && aliasUser.wallet !== '0x0000000000000000000000000000000000000000') {
        setRecipient(aliasUser.wallet);
        setIsSearchingAlias(false);
      } else if (alias.length >= 3) {
        setRecipient("");
        setIsSearchingAlias(false);
      }
    } else {
      setRecipient("");
      setIsSearchingAlias(false);
    }
  }, [recipientInput, aliasUser]);

  // Handle successful remittance creation
  useEffect(() => {
    if (isSuccess && remittanceHash) {
      setTxHash(remittanceHash);
      setStatus("success");
      setStep(4);
      refetchBalance();
      toast({
        title: lang === "es" ? "¡Remesa enviada!" : "Remittance sent!",
        description: lang === "es" 
          ? `Código de retiro: ${code}` 
          : `Withdrawal code: ${code}`,
      });
    }
  }, [isSuccess, remittanceHash, code, lang, toast, refetchBalance]);

  // Handle errors
  useEffect(() => {
    if (createError) {
      setStatus("error");
      toast({
        title: lang === "es" ? "Error" : "Error",
        description: lang === "es" 
          ? "Hubo un error al enviar la remesa. Intenta de nuevo." 
          : "There was an error sending the remittance. Try again.",
        variant: "destructive",
      });
    }
  }, [createError, lang, toast]);

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  const handleApprove = () => {
    if (usd && parseFloat(usd) > 0) {
      approve(usd);
    }
  };

  const handleConfirm = () => {
    if (!isApproved) {
      toast({
        title: lang === "es" ? "Aprobación requerida" : "Approval required",
        description: lang === "es" 
          ? "Primero debes aprobar el uso de USDC" 
          : "You must first approve USDC usage",
        variant: "destructive",
      });
      return;
    }

    if (usd && recipient && code && isAvailable) {
      setStatus("processing");
      
      // El contrato espera un alias (string) y busca la address
      // Para alias: enviar sin el @
      // Para ENS: enviar el nombre completo (vitalik.eth)
      // NO soportamos addresses directas (0x...)
      let aliasToSend = recipientInput;
      
      if (recipientInput.startsWith("@")) {
        aliasToSend = recipientInput.slice(1); // Quitar el @
      }
      
      createRemittance(usd, aliasToSend, code);
    }
  };

  const handleGenerateCode = () => {
    setCode(generateCode());
  };

  const handleFaucet = () => {
    requestFaucet();
    toast({
      title: lang === "es" ? "Solicitando USDC..." : "Requesting USDC...",
      description: lang === "es" 
        ? "Recibirás 1,000 USDC en unos momentos" 
        : "You will receive 1,000 USDC in a few moments",
    });
  };

  const resetForm = () => {
    setStep(1);
    setStatus("idle");
    setUsd("");
    setRecipient("");
    setRecipientInput("");
    setCode("");
    setTxHash("");
  };

  // Calculate values for display usando el cálculo local corregido
  const netUSD = localCalc.netUSD;
  const amountMXN = localCalc.amountMXN;
  const fee = localCalc.fee;
  const hasBalance = balance && parseFloat(usd || "0") > 0 
    ? balance >= BigInt(Math.floor(parseFloat(usd) * 1000000))
    : false;

  return (
    <div className="min-h-screen py-32 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-jade/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-oro/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-16 max-w-2xl relative z-10">
        <h1 className="mb-12 text-5xl md:text-6xl font-black text-center text-black animate-fade-in tracking-tighter" style={{ fontFamily: 'Cinzel, serif' }}>
          {lang === "es" ? "Enviar remesa" : "Send remittance"}
        </h1>

        {/* Wallet Status */}
        <div className="mb-8">
          <WalletStatus />
        </div>

        {/* Balance Card */}
        {isConnected && (
          <Card className="mb-8 bg-white border border-jade/20 animate-fade-in overflow-hidden shadow-[0_20px_50px_rgba(16,185,129,0.05)]">
            <CardContent className="pt-8">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-black/50 mb-1 font-medium tracking-widest uppercase">
                    {lang === "es" ? "Tu balance USDC" : "Your USDC balance"}
                  </p>
                  <p className="text-4xl font-bold text-black tracking-tight">{formatUSDC(balance)}</p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => refetchBalance()}
                    className="h-12 w-12 border-black/5 bg-black/[0.02] text-black hover:bg-black/[0.05] rounded-xl transition-all"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    onClick={handleFaucet}
                    disabled={isFaucetLoading}
                    className="bg-jade hover:bg-jade/90 text-white shadow-xl shadow-jade/20 rounded-xl px-6 font-bold"
                  >
                    {isFaucetLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      lang === "es" ? "Recargar USDC" : "Refill USDC"
                    )}
                  </Button>
                </div>
              </div>
              {!hasBalance && usd && parseFloat(usd) > 0 && (
                <div className="mt-4 p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-500 font-medium">
                    {lang === "es" ? "Balance insuficiente" : "Insufficient balance"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Progress Steps */}
        <div className="mb-12 flex justify-between animate-fade-in px-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center relative flex-1">
              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 shadow-lg ${
                  step >= s
                    ? "bg-jade text-white shadow-jade/20 scale-110"
                    : "bg-black/[0.02] text-black/40 border border-black/5"
                }`}
              >
                {s}
              </div>
              <span className={`mt-3 text-sm font-bold tracking-widest uppercase transition-colors duration-500 ${step >= s ? "text-jade" : "text-black/40"}`}>
                {s === 1 && (lang === "es" ? "Monto" : "Amount")}
                {s === 2 && (lang === "es" ? "Destino" : "Target")}
                {s === 3 && (lang === "es" ? "Confirmar" : "Confirm")}
                {s === 4 && (lang === "es" ? "Éxito" : "Success")}
              </span>
              
              {/* Connector */}
              {s < 4 && (
                <div className={`absolute top-6 left-[calc(50%+1.5rem)] w-[calc(100%-3rem)] h-0.5 transition-colors duration-500 ${step > s ? "bg-jade" : "bg-black/5"}`} />
              )}
            </div>
          ))}
        </div>

        <Card className="bg-white animate-slide-up border border-black/5 shadow-[0_40px_100px_rgba(0,0,0,0.08)] rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pt-10 px-10">
            <CardTitle className="text-3xl font-bold text-black tracking-tight" style={{ fontFamily: 'Forum, serif' }}>
              {step === 1 && (lang === "es" ? "Define el monto del envío" : "Define send amount")}
              {step === 2 && (lang === "es" ? "Identifica al destinatario" : "Identify recipient")}
              {step === 3 && (lang === "es" ? "Revisa los detalles" : "Review details")}
              {step === 4 && (lang === "es" ? "Estado de la transacción" : "Transaction status")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 pt-4 space-y-8">
            {/* Step 1: Amount */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="usd" className="text-black/60 font-medium tracking-wide ml-1">{lang === "es" ? "Monto en USDC" : "Amount in USDC"}</Label>
                  <div className="relative group">
                    <Input
                      id="usd"
                      type="number"
                      placeholder="0.00"
                      value={usd}
                      onChange={(e) => setUsd(e.target.value)}
                      disabled={!isConnected}
                      className="bg-black/[0.02] border-black/5 text-black placeholder:text-black/40 h-20 text-3xl font-bold rounded-2xl px-6 focus:border-jade/30 transition-all shadow-inner"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-black/40 font-bold text-xl pointer-events-none group-focus-within:text-jade transition-colors">
                      USDC
                    </div>
                  </div>
                  {!isConnected && (
                    <p className="mt-2 text-sm text-jade italic font-light">
                      {lang === "es" ? "Conecta tu wallet para iniciar el viaje" : "Connect your wallet to start the journey"}
                    </p>
                  )}
                </div>
                {usd && parseFloat(usd) > 0 && (
                  <div className="rounded-[2rem] bg-black/[0.01] border border-black/5 p-8 space-y-4 shadow-inner">
                    <div className="flex justify-between text-black/60 font-medium">
                      <span>{lang === "es" ? "Monto bruto:" : "Gross amount:"}</span>
                      <span className="text-black font-bold">{formatUSDC(BigInt(Math.floor(parseFloat(usd) * 1000000)))}</span>
                    </div>
                    <div className="flex justify-between text-black/60 font-medium">
                      <span>{lang === "es" ? "Comisión de red (1.5%):" : "Network fee (1.5%):"}</span>
                      <span className="text-oro font-bold">{formatUSDC(fee)}</span>
                    </div>
                    <div className="border-t border-black/5 pt-4 flex justify-between items-end">
                      <div>
                        <span className="text-black/40 text-sm font-bold uppercase tracking-widest">{lang === "es" ? "Recibirán en México:" : "Will receive in Mexico:"}</span>
                        <div className="text-5xl font-black text-jade tracking-tighter mt-1">{formatMXN(amountMXN)}</div>
                      </div>
                    </div>
                  </div>
                )}
                <Button 
                  onClick={handleNext} 
                  disabled={!isConnected || !usd || parseFloat(usd) <= 0 || !hasBalance} 
                  className="w-full h-18 py-8 bg-jade hover:bg-jade/90 text-white text-xl font-bold rounded-2xl transition-all duration-500 hover:scale-[1.02] shadow-2xl shadow-jade/20 group"
                >
                  {lang === "es" ? "Siguiente paso" : "Next step"} <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>
            )}

            {/* Step 2: Recipient */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="recipient" className="text-black/60 font-medium tracking-wide ml-1">
                    {lang === "es" ? "Alias del destinatario (Ej: @mama)" : "Recipient Alias (Ex: @mom)"}
                  </Label>
                  <div className="relative group">
                    <Input
                      id="recipient"
                      placeholder="@"
                      value={recipientInput}
                      onChange={(e) => setRecipientInput(e.target.value)}
                      className="bg-black/[0.02] border-black/5 text-black placeholder:text-black/40 h-16 text-xl font-medium rounded-2xl px-6 focus:border-jade/30 shadow-inner"
                    />
                    {isSearchingAlias && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-6 w-6 animate-spin text-jade" />
                      </div>
                    )}
                  </div>
                  
                  {/* Alias indicators */}
                  {recipientInput.startsWith("@") && recipient && (
                    <div className="p-4 bg-jade/5 border border-jade/10 rounded-2xl flex items-center gap-3 animate-fade-in">
                      <div className="h-8 w-8 bg-jade/10 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-jade" />
                      </div>
                      <p className="text-sm text-jade font-bold">
                        {lang === "es" ? "Destinatario validado:" : "Recipient validated:"} 
                        <span className="font-mono ml-1 opacity-60">{recipient.slice(0, 10)}...{recipient.slice(-6)}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="code" className="text-black/60 font-medium tracking-wide ml-1">
                    {lang === "es" ? "Código de seguridad de 6 dígitos" : "6-digit security code"}
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      id="code"
                      placeholder="X8Y2Z4"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      className="bg-black/[0.02] border-black/5 text-black h-16 text-2xl font-mono font-bold tracking-[0.5em] rounded-2xl px-6 focus:border-jade/30 flex-1 shadow-inner"
                    />
                    <Button 
                      onClick={handleGenerateCode} 
                      variant="outline"
                      className="h-16 px-6 border-black/5 bg-black/[0.02] text-black hover:bg-black/[0.05] rounded-2xl font-bold"
                    >
                      {lang === "es" ? "Generar" : "Generate"}
                    </Button>
                  </div>
                  {code && (
                    <div className="px-1">
                      {isAvailable ? (
                        <span className="text-jade text-sm font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> {lang === "es" ? "Código disponible" : "Code available"}
                        </span>
                      ) : (
                        <span className="text-red-500 text-sm font-bold flex items-center gap-1">
                          <XCircle className="h-3 w-3" /> {lang === "es" ? "Código ya en uso" : "Code already in use"}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setStep(1)} 
                    className="flex-1 h-16 text-black/60 hover:text-black hover:bg-black/[0.02] rounded-2xl font-bold"
                  >
                    {lang === "es" ? "Atrás" : "Back"}
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    disabled={!recipient || !code || code.length < 6 || !isAvailable || !recipientInput.startsWith("@")} 
                    className="flex-[2] h-16 bg-jade hover:bg-jade/90 text-white font-bold rounded-2xl shadow-2xl shadow-jade/20"
                  >
                    {lang === "es" ? "Continuar" : "Continue"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="rounded-[2.5rem] bg-black/[0.02] border border-black/5 p-8 space-y-6 shadow-inner">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-black/5">
                      <span className="text-black/60 font-medium uppercase tracking-widest text-sm">{lang === "es" ? "Destinatario" : "Recipient"}</span>
                      <span className="text-black font-bold">{recipientInput}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-black/5">
                      <span className="text-black/60 font-medium uppercase tracking-widest text-sm">{lang === "es" ? "Monto Envío" : "Send Amount"}</span>
                      <span className="text-black font-bold">{usd} USDC</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-black/5">
                      <span className="text-black/60 font-medium uppercase tracking-widest text-sm">{lang === "es" ? "Comisión" : "Fee"}</span>
                      <span className="text-oro font-bold">{formatUSDC(fee)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-black/5">
                      <span className="text-black/60 font-medium uppercase tracking-widest text-sm">{lang === "es" ? "Código" : "Code"}</span>
                      <span className="text-jade font-mono font-bold tracking-widest">{code}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 text-center">
                    <p className="text-black/60 text-sm font-bold uppercase tracking-widest mb-1">{lang === "es" ? "Recibirán exactamente" : "They will receive exactly"}</p>
                    <div className="text-6xl font-black text-black tracking-tighter">{formatMXN(amountMXN)}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  {!isApproved ? (
                    <Button 
                      onClick={handleApprove} 
                      disabled={isApproving}
                      className="w-full h-20 bg-white border border-jade/30 text-jade hover:bg-jade/5 rounded-2xl text-xl font-bold transition-all shadow-lg"
                    >
                      {isApproving ? (
                        <>
                          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                          {lang === "es" ? "Autorizando USDC..." : "Authorizing USDC..."}
                        </>
                      ) : (
                        <>1. {lang === "es" ? "Aprobar USDC" : "Approve USDC"}</>
                      )}
                    </Button>
                  ) : (
                    <div className="h-20 bg-jade/5 border border-jade/30 rounded-2xl flex items-center justify-center gap-3 animate-fade-in">
                      <CheckCircle2 className="h-6 w-6 text-jade" />
                      <span className="text-xl font-bold text-jade">{lang === "es" ? "USDC Autorizado" : "USDC Authorized"}</span>
                    </div>
                  )}

                  <Button 
                    onClick={handleConfirm} 
                    disabled={!isApproved || isCreating}
                    className="w-full h-20 bg-jade hover:bg-jade/90 text-white text-2xl font-bold rounded-2xl shadow-2xl shadow-jade/30 transition-all hover:scale-[1.02]"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-3 h-8 w-8 animate-spin" />
                        {lang === "es" ? "Procesando..." : "Processing..."}
                      </>
                    ) : (
                      <>{isApproved ? "2. " : ""}{lang === "es" ? "Confirmar Envío" : "Confirm Send"}</>
                    )}
                  </Button>
                </div>

                <Button 
                  variant="ghost" 
                  onClick={() => setStep(2)} 
                  className="w-full h-12 text-black/50 hover:text-black hover:bg-black/[0.02] rounded-xl font-bold"
                >
                  {lang === "es" ? "← Corregir datos" : "← Edit details"}
                </Button>
              </div>
            )}

            {/* Step 4: Result */}
            {step === 4 && (
              <div className="space-y-10 text-center py-6">
                {status === "processing" && (
                  <div className="animate-pulse space-y-6">
                    <div className="relative h-32 w-32 mx-auto">
                      <Loader2 className="h-32 w-32 animate-spin text-jade opacity-20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <RefreshCw className="h-12 w-12 text-jade animate-reverse-spin" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-black mb-2">
                        {lang === "es" ? "Escribiendo en la Blockchain" : "Writing to Blockchain"}
                      </h3>
                      <p className="text-black/60 text-lg font-light italic">
                        {lang === "es" ? "Tu dinero está viajando al Mictlán..." : "Your money is traveling to Mictlan..."}
                      </p>
                    </div>
                  </div>
                )}

                {status === "success" && txHash && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="h-24 w-24 bg-jade rounded-full mx-auto flex items-center justify-center shadow-[0_20px_50px_rgba(16,185,129,0.3)]">
                      <CheckCircle2 className="h-14 w-14 text-white" />
                    </div>
                    
                    <h3 className="text-4xl font-black text-black tracking-tight">
                      {lang === "es" ? "¡Envío Exitoso!" : "Transfer Successful!"}
                    </h3>
                    
                    <div className="bg-black/[0.01] border border-black/5 rounded-[2.5rem] p-10 space-y-8 shadow-inner">
                      <div className="flex justify-center bg-white p-6 rounded-[2rem] shadow-xl mx-auto w-fit border border-black/5">
                        <QRCode value={`https://tlalix.app/r/${code}`} size={180} level="M" />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-black/60 font-bold uppercase tracking-widest">
                          {lang === "es" ? "Código de retiro confidencial" : "Confidential withdrawal code"}
                        </p>
                        <div className="text-5xl font-black text-jade tracking-[0.2em] font-mono bg-white py-4 rounded-2xl shadow-md border border-black/5">{code}</div>
                        <p className="text-sm text-black/60 italic mt-4 px-6 leading-relaxed">
                          {lang === "es" 
                            ? "Comparte este código SOLO con el destinatario. Es necesario para retirar el efectivo." 
                            : "Share this code ONLY with the recipient. It is required to withdraw cash."}
                        </p>
                      </div>

                      <div className="pt-8 border-t border-black/5">
                        <p className="text-black/60 text-sm font-bold uppercase tracking-widest mb-2">
                          {lang === "es" ? "Recibo Digital" : "Digital Receipt"}
                        </p>
                        <a
                          href={`https://sepolia.scrollscan.com/tx/${txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:shadow-md rounded-xl text-sm font-medium text-jade transition-all border border-black/5"
                        >
                          {txHash.slice(0, 12)}...{txHash.slice(-10)}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    <Button 
                      onClick={resetForm} 
                      className="w-full h-20 bg-jade hover:bg-jade/90 text-white text-2xl font-bold rounded-2xl shadow-2xl shadow-jade/20 transition-all"
                    >
                      {lang === "es" ? "Hacer otro envío" : "Make another transfer"}
                    </Button>
                  </div>
                )}

                {status === "error" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="h-24 w-24 bg-red-500/10 rounded-full mx-auto flex items-center justify-center">
                      <XCircle className="h-14 w-14 text-red-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-red-500">
                      {lang === "es" ? "Fallo en la conexión" : "Connection failed"}
                    </h3>
                    <p className="text-black/60 text-lg">
                      {lang === "es" 
                        ? "Hubo un obstáculo en el viaje. Por favor intenta de nuevo." 
                        : "There was an obstacle in the journey. Please try again."}
                    </p>
                    <Button 
                      onClick={resetForm} 
                      variant="outline" 
                      className="w-full h-16 border-black/10 text-black hover:bg-black/[0.02] rounded-2xl text-xl font-bold"
                    >
                      {lang === "es" ? "Reintentar" : "Retry"}
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



