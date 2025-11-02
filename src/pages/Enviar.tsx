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
    <div className="min-h-screen py-12 relative">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-center text-white animate-fade-in">
          {lang === "es" ? "Enviar remesa" : "Send remittance"}
        </h1>

        {/* Wallet Status */}
        <div className="mb-6">
          <WalletStatus />
        </div>

        {/* Balance Card */}
        {isConnected && (
          <Card className="mb-6 bg-white/5 backdrop-blur-sm border-white/10 animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-white/70">
                    {lang === "es" ? "Tu balance USDC:" : "Your USDC balance:"}
                  </p>
                  <p className="text-2xl font-bold text-white">{formatUSDC(balance)}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => refetchBalance()}
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/40"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleFaucet}
                    disabled={isFaucetLoading}
                    className="bg-[hsl(var(--color-celeste))] hover:bg-[hsl(var(--color-celeste)/0.8)] text-white shadow-lg"
                  >
                    {isFaucetLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      lang === "es" ? "Solicitar USDC" : "Request USDC"
                    )}
                  </Button>
                </div>
              </div>
              {!hasBalance && usd && parseFloat(usd) > 0 && (
                <p className="mt-2 text-sm text-red-400">
                  {lang === "es" ? "⚠️ Balance insuficiente" : "⚠️ Insufficient balance"}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Progress Steps */}
        <div className="mb-8 flex justify-between animate-fade-in">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  step >= s
                    ? "bg-[hsl(var(--color-celeste))] text-white"
                    : "bg-white/10 text-white/50 border border-white/20"
                }`}
              >
                {s}
              </div>
              <span className="mt-2 text-xs text-white/70">
                {s === 1 && (lang === "es" ? "Monto" : "Amount")}
                {s === 2 && (lang === "es" ? "Destinatario" : "Recipient")}
                {s === 3 && (lang === "es" ? "Confirmación" : "Confirmation")}
                {s === 4 && (lang === "es" ? "Resultado" : "Result")}
              </span>
            </div>
          ))}
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10 animate-slide-up">
          <CardHeader>
            <CardTitle className="text-white">
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
                  <Label htmlFor="usd" className="text-white">{lang === "es" ? "Monto en USD" : "Amount in USD"}</Label>
                  <Input
                    id="usd"
                    type="number"
                    placeholder="100"
                    value={usd}
                    onChange={(e) => setUsd(e.target.value)}
                    disabled={!isConnected}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/70"
                  />
                  {!isConnected && (
                    <p className="mt-2 text-sm text-white/70">
                      {lang === "es" ? "Conecta tu wallet para continuar" : "Connect your wallet to continue"}
                    </p>
                  )}
                </div>
                {usd && parseFloat(usd) > 0 && (
                  <div className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-2">
                    <div className="flex justify-between text-white">
                      <span>{lang === "es" ? "Monto:" : "Amount:"}</span>
                      <span className="font-medium">{formatUSDC(BigInt(Math.floor(parseFloat(usd) * 1000000)))}</span>
                    </div>
                    <div className="flex justify-between text-sm text-white/70">
                      <span>{lang === "es" ? "Comisión:" : "Fee:"}</span>
                      <span>{formatUSDC(fee)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between text-2xl font-bold text-[hsl(var(--color-celeste))]">
                      <span>{lang === "es" ? "Recibirá:" : "Will receive:"}</span>
                      <span>{formatMXN(amountMXN)}</span>
                    </div>
                  </div>
                )}
                <Button 
                  onClick={handleNext} 
                  disabled={!isConnected || !usd || parseFloat(usd) <= 0 || !hasBalance} 
                  className="w-full bg-[hsl(var(--color-celeste))] hover:bg-[hsl(var(--color-celeste)/0.8)] text-white transition-all duration-300 hover:scale-105"
                >
                  {lang === "es" ? "Continuar" : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 2: Recipient */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipient" className="text-white">
                    {lang === "es" ? "Alias del destinatario" : "Recipient Alias"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="recipient"
                      placeholder={lang === "es" ? "@mama" : "@mom"}
                      value={recipientInput}
                      onChange={(e) => setRecipientInput(e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/70"
                    />
                    {isSearchingAlias && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-[hsl(var(--color-celeste))]" />
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-white/70">
                    {lang === "es" 
                      ? "El destinatario debe tener un alias registrado. Ejemplo: @mama" 
                      : "Recipient must have a registered alias. Example: @mom"}
                  </p>
                  
                  {/* Alias found */}
                  {recipientInput.startsWith("@") && recipient && (
                    <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-xs text-lime-300">
                        ✓ {lang === "es" ? "Alias encontrado:" : "Alias found:"} 
                        <span className="font-mono ml-1">{recipient.slice(0, 6)}...{recipient.slice(-4)}</span>
                      </p>
                    </div>
                  )}
                  
                  {/* Alias not found */}
                  {recipientInput.startsWith("@") && !recipient && recipientInput.length > 3 && !isSearchingAlias && (
                    <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-xs text-red-400">
                        ✗ {lang === "es" ? "Alias no encontrado. El destinatario debe registrarse primero." : "Alias not found. Recipient must register first."}
                      </p>
                    </div>
                  )}
                  
                  {/* Must start with @ */}
                  {!recipientInput.startsWith("@") && recipientInput.length > 0 && (
                    <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-xs text-yellow-400">
                        ⚠️ {lang === "es" 
                          ? "El alias debe comenzar con @ (ejemplo: @mama)" 
                          : "Alias must start with @ (example: @mom)"}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="code" className="text-white">
                    {lang === "es" ? "Código de retiro" : "Withdrawal code"}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      placeholder="ABC123"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/70"
                    />
                    <Button 
                      onClick={handleGenerateCode} 
                      variant="outline"
                      className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/40"
                    >
                      {lang === "es" ? "Generar" : "Generate"}
                    </Button>
                  </div>
                  {code && (
                    <p className="mt-1 text-xs">
                      {isAvailable ? (
                        <span className="text-lime-300">✓ {lang === "es" ? "Código disponible" : "Code available"}</span>
                      ) : (
                        <span className="text-red-400">✗ {lang === "es" ? "Código no disponible" : "Code not available"}</span>
                      )}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)} 
                    className="flex-1 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/40"
                  >
                    {lang === "es" ? "Atrás" : "Back"}
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    disabled={
                      !recipient || 
                      !code || 
                      code.length < 6 || 
                      !isAvailable ||
                      !recipientInput.startsWith("@") // Must be an alias
                    } 
                    className="flex-1 bg-[hsl(var(--color-celeste))] hover:bg-[hsl(var(--color-celeste)/0.8)] text-white transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    {lang === "es" ? "Continuar" : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
                  <div className="flex justify-between text-white">
                    <span className="text-white/70">{lang === "es" ? "Monto:" : "Amount:"}</span>
                    <span className="font-medium">{formatUSDC(BigInt(Math.floor(parseFloat(usd) * 1000000)))}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span className="text-white/70">{lang === "es" ? "Comisión:" : "Fee:"}</span>
                    <span className="font-medium">{formatUSDC(fee)}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span className="text-white/70">{lang === "es" ? "Destinatario:" : "Recipient:"}</span>
                    <span className="font-medium text-sm">{recipient}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span className="text-white/70">{lang === "es" ? "Código:" : "Code:"}</span>
                    <span className="font-medium font-mono">{code}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold">
                    <span className="text-white">{lang === "es" ? "Recibirá:" : "Will receive:"}</span>
                    <span className="text-[hsl(var(--color-celeste))]">{formatMXN(amountMXN)}</span>
                  </div>
                </div>

                {/* Approval & Send Buttons */}
                <div className="space-y-2">
                  {!isApproved && (
                    <Button 
                      onClick={handleApprove} 
                      disabled={isApproving}
                      className="w-full bg-white/10 border border-white/20 hover:bg-white/20 text-white"
                      variant="outline"
                    >
                      {isApproving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {lang === "es" ? "Aprobando..." : "Approving..."}
                        </>
                      ) : (
                        <>1. {lang === "es" ? "Aprobar USDC" : "Approve USDC"}</>
                      )}
                    </Button>
                  )}
                  
                  {isApproved && (
                    <div className="p-3 bg-green-500/10 text-lime-300 border border-green-500/30 rounded-lg text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      {lang === "es" ? "USDC aprobado" : "USDC approved"}
                    </div>
                  )}

                  <Button 
                    onClick={handleConfirm} 
                    disabled={!isApproved || isCreating}
                    className="w-full bg-[hsl(var(--color-celeste))] hover:bg-[hsl(var(--color-celeste)/0.8)] text-white transition-all duration-300 hover:scale-105"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {lang === "es" ? "Enviando..." : "Sending..."}
                      </>
                    ) : (
                      <>
                        {isApproved ? "2. " : ""}{lang === "es" ? "Confirmar envío" : "Confirm send"}
                      </>
                    )}
                  </Button>
                </div>

                <Button 
                  variant="ghost" 
                  onClick={() => setStep(2)} 
                  className="w-full text-white hover:bg-white/10"
                >
                  {lang === "es" ? "← Atrás" : "← Back"}
                </Button>
              </div>
            )}

            {/* Step 4: Result */}
            {step === 4 && (
              <div className="space-y-6 text-center">
                {status === "processing" && (
                  <div className="py-8">
                    <Loader2 className="h-16 w-16 mx-auto animate-spin text-[hsl(var(--color-celeste))]" />
                    <p className="mt-4 text-lg font-medium text-white">
                      {lang === "es" ? "Procesando transacción en blockchain..." : "Processing blockchain transaction..."}
                    </p>
                    <p className="mt-2 text-sm text-white/70">
                      {lang === "es" ? "Esto puede tomar unos momentos" : "This may take a few moments"}
                    </p>
                  </div>
                )}

                {status === "success" && txHash && (
                  <div className="space-y-4">
                    <CheckCircle2 className="h-16 w-16 mx-auto text-[hsl(var(--color-celeste))] animate-fade-in" />
                    <h3 className="text-2xl font-bold text-[hsl(var(--color-celeste))] animate-slide-up">
                      {lang === "es" ? "¡Remesa enviada!" : "Remittance sent!"}
                    </h3>
                    
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4 animate-fade-in">
                      {/* QR Code Real */}
                      <div className="flex justify-center bg-white p-4 rounded-lg">
                        <QRCode 
                          value={`https://tlalix.app/r/${code}`}
                          size={200}
                          level="M"
                        />
                      </div>
                      
                      {/* Withdrawal Code */}
                      <div className="space-y-1">
                        <p className="text-sm text-white/70">
                          {lang === "es" ? "Código de retiro:" : "Withdrawal code:"}
                        </p>
                        <p className="font-mono text-3xl font-bold text-[hsl(var(--color-celeste))]">{code}</p>
                        <p className="text-xs text-white/70">
                          {lang === "es" 
                            ? "Comparte este código con el destinatario para que retire el dinero" 
                            : "Share this code with the recipient to withdraw the money"}
                        </p>
                      </div>

                      {/* Amount */}
                      <div className="pt-3 border-t border-white/10">
                        <p className="text-sm text-white/70">
                          {lang === "es" ? "El destinatario recibirá:" : "Recipient will receive:"}
                        </p>
                        <p className="text-2xl font-bold text-[hsl(var(--color-celeste))]">{formatMXN(amountMXN)}</p>
                      </div>

                      {/* Transaction Hash */}
                      <div className="pt-3 border-t border-white/10 text-left">
                        <p className="text-sm text-white/70 mb-2">
                          {lang === "es" ? "Transacción en blockchain:" : "Blockchain transaction:"}
                        </p>
                        <a
                          href={`https://sepolia.scrollscan.com/tx/${txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[hsl(var(--color-celeste))] hover:underline flex items-center gap-1 break-all"
                        >
                          {txHash.slice(0, 10)}...{txHash.slice(-8)}
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      </div>

                      {/* Share Link */}
                      <div className="text-left space-y-2">
                        <p className="text-xs text-white/70">
                          {lang === "es" ? "Enlace para reclamar:" : "Link to claim:"}
                        </p>
                        <div className="flex gap-2">
                          <div className="text-xs text-white/70 break-all bg-white/5 p-3 rounded flex-1 border border-white/10">
                            {window.location.origin}/recibir?code={code}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/40"
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/recibir?code=${code}`);
                              toast({
                                title: lang === "es" ? "¡Copiado!" : "Copied!",
                                description: lang === "es" 
                                  ? "Enlace copiado. Compártelo con el destinatario." 
                                  : "Link copied. Share it with the recipient.",
                              });
                            }}
                          >
                            {lang === "es" ? "Copiar" : "Copy"}
                          </Button>
                        </div>
                        <p className="text-xs text-white/70 italic">
                          {lang === "es" 
                            ? "💡 Comparte este enlace o el código con el destinatario para que pueda reclamar el dinero" 
                            : "💡 Share this link or code with the recipient so they can claim the money"}
                        </p>
                      </div>
                    </div>

                    <Button 
                      onClick={resetForm} 
                      className="w-full bg-[hsl(var(--color-celeste))] hover:bg-[hsl(var(--color-celeste)/0.8)] text-white transition-all duration-300 hover:scale-105"
                    >
                      {lang === "es" ? "Enviar otra remesa" : "Send another remittance"}
                    </Button>
                  </div>
                )}

                {status === "error" && (
                  <div className="space-y-4 animate-fade-in">
                    <XCircle className="h-16 w-16 mx-auto text-red-400" />
                    <h3 className="text-2xl font-bold text-red-400">
                      {lang === "es" ? "Error al enviar" : "Error sending"}
                    </h3>
                    <p className="text-white/70">
                      {lang === "es" 
                        ? "Hubo un problema al procesar tu remesa. Por favor intenta de nuevo." 
                        : "There was a problem processing your remittance. Please try again."}
                    </p>
                    <Button 
                      onClick={resetForm} 
                      variant="outline" 
                      className="w-full border-white/20 text-white hover:bg-white/10"
                    >
                      {lang === "es" ? "Intentar de nuevo" : "Try again"}
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
