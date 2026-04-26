import { useState, useEffect } from "react";
import { Filter, Loader2, ExternalLink, RefreshCw } from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGetUserRemittances } from "@/hooks/useTlalix";
import { formatUSDC, formatMXNFromContract, formatTimestamp, getRemittanceStatusText, getRemittanceStatusColor, truncateAddress } from "@/lib/format";
import { ENSDisplay } from "@/components/ENSDisplay";
import { CONTRACTS } from "@/config/contracts";
import { TLALIX_ABI } from "@/config/abis";
import { scrollSepolia } from "wagmi/chains";

type RemittanceData = {
  code: string;
  sender: string;
  recipient: string;
  amountUSD: bigint;
  amountMXN: bigint;
  fee: bigint;
  timestamp: bigint;
  recipientAlias: string;
  status: number;
  isClaimed: boolean;
  cashoutPoint: string;
};

const Historial = () => {
  const { lang } = useLanguage();
  const { address, isConnected } = useAccount();
  const [filter, setFilter] = useState<number | "all">("all");
  const [remittances, setRemittances] = useState<RemittanceData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { remittanceCodes, isLoading, refetch } = useGetUserRemittances(address);

  // Debug: Log remittance codes
  useEffect(() => {
    console.log('🔍 Historial - Address:', address);
    console.log('🔍 Historial - Remittance codes:', remittanceCodes);
    console.log('🔍 Historial - Is loading:', isLoading);
  }, [address, remittanceCodes, isLoading]);

  // Fetch remittance details for each code
  useEffect(() => {
    const fetchRemittances = async () => {
      if (!remittanceCodes || remittanceCodes.length === 0) {
        setRemittances([]);
        setFetchError(null);
        return;
      }

      setIsLoadingData(true);
      setFetchError(null);
      
      try {
        // Create a client for reading contracts
        const { readContract } = await import('viem/actions');
        const { createPublicClient, http } = await import('viem');
        
        const client = createPublicClient({
          chain: scrollSepolia,
          transport: http()
        });

        // Fetch details for each remittance code
        const remittancePromises = remittanceCodes.map(async (code) => {
          try {
            // @ts-ignore - viem v2 type compatibility
            const data = await client.readContract({
              address: CONTRACTS.scrollSepolia.tlalix,
              abi: TLALIX_ABI,
              functionName: 'getRemittance',
              args: [code],
            }) as any;

            if (!data || data.sender === '0x0000000000000000000000000000000000000000') {
              return null;
            }

            return {
              code,
              sender: data.sender,
              recipient: data.recipient,
              amountUSD: data.amountUSD,
              amountMXN: data.amountMXN,
              fee: data.fee,
              timestamp: data.timestamp,
              recipientAlias: data.recipientAlias || truncateAddress(data.recipient),
              status: data.status,
              isClaimed: data.isClaimed,
              cashoutPoint: data.cashoutPoint,
            };
          } catch (error) {
            // Código inválido o no existe - ignorar silenciosamente
            console.log(`⚠️ Código ${code} no encontrado en el contrato`);
            return null;
          }
        });

        const results = await Promise.all(remittancePromises);
        const validRemittances = results.filter(Boolean) as RemittanceData[];
        
        // Sort by timestamp (most recent first)
        validRemittances.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
        
        console.log(`✅ Remesas cargadas: ${validRemittances.length} válidas de ${remittanceCodes.length} códigos totales`);
        setRemittances(validRemittances);
      } catch (error) {
        console.error("Error fetching remittances:", error);
        setFetchError(lang === "es" ? "Error al cargar el historial" : "Error loading history");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchRemittances();
  }, [remittanceCodes, lang]);

  const filteredRemittances = filter === "all" 
    ? remittances 
    : remittances.filter(r => r.status === filter);

  const getStatusColor = (status: number) => {
    return getRemittanceStatusColor(status);
  };

  const getStatusLabel = (status: number) => {
    const statusText = getRemittanceStatusText(status);
    return statusText;
  };

  return (
    <div className="min-h-screen py-32 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-jade/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-oro/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-16 relative z-10">
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter" style={{ fontFamily: 'Cinzel, serif' }}>
            {lang === "es" ? "Historial" : "History"}
          </h1>

          <div className="flex items-center gap-4 bg-black/[0.02] p-2 rounded-2xl border border-black/5 backdrop-blur-xl">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => refetch()}
              disabled={isLoading}
              className="h-12 w-12 text-black hover:bg-black/5 rounded-xl"
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <div className="h-6 w-px bg-black/10" />
            <Select value={filter.toString()} onValueChange={(v) => setFilter(v === "all" ? "all" : parseInt(v))}>
              <SelectTrigger className="w-[200px] h-12 bg-transparent border-none text-black font-bold focus:ring-0">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 opacity-30" />
                  <SelectValue placeholder={lang === "es" ? "Filtrar" : "Filter"} />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border-black/5 backdrop-blur-3xl rounded-xl shadow-2xl">
                <SelectItem value="all" className="text-black focus:bg-jade focus:text-white rounded-lg m-1">{lang === "es" ? "Todas" : "All"}</SelectItem>
                <SelectItem value="0" className="text-black focus:bg-jade focus:text-white rounded-lg m-1">{lang === "es" ? "Pendientes" : "Pending"}</SelectItem>
                <SelectItem value="2" className="text-black focus:bg-jade focus:text-white rounded-lg m-1">{lang === "es" ? "Listas" : "Ready"}</SelectItem>
                <SelectItem value="3" className="text-black focus:bg-jade focus:text-white rounded-lg m-1">{lang === "es" ? "Reclamadas" : "Claimed"}</SelectItem>
                <SelectItem value="4" className="text-black focus:bg-jade focus:text-white rounded-lg m-1">{lang === "es" ? "Expiradas" : "Expired"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Not Connected State */}
        {!isConnected && (
          <Card className="bg-white border border-black/5 py-24 text-center rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)]">
            <CardContent>
              <div className="h-20 w-20 bg-black/[0.02] rounded-full mx-auto flex items-center justify-center mb-6">
                <RefreshCw className="h-10 w-10 text-black/10" />
              </div>
              <p className="text-2xl text-black/50 font-light italic" style={{ fontFamily: 'Caudex, serif' }}>
                {lang === "es" 
                  ? "Conecta tu wallet para revelar tu rastro en el Mictlán" 
                  : "Connect your wallet to reveal your trail in the Mictlan"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isConnected && (isLoading || isLoadingData) && (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 w-full bg-black/[0.02] border border-black/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {isConnected && !isLoading && !isLoadingData && filteredRemittances.length === 0 && (
          <Card className="bg-white border border-black/5 py-24 text-center rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)]">
            <CardContent>
              <p className="text-2xl text-black/50 font-light italic mb-8" style={{ fontFamily: 'Caudex, serif' }}>
                {lang === "es" 
                  ? "No se han encontrado registros de tus viajes" 
                  : "No records of your journeys were found"}
              </p>
              <Button 
                size="lg"
                className="bg-jade hover:bg-jade/90 text-white rounded-2xl px-10 py-7 font-bold shadow-xl shadow-jade/20" 
                onClick={() => window.location.href = "/enviar"}
              >
                {lang === "es" ? "Iniciar primer envío" : "Start first transfer"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Desktop Table */}
        {isConnected && !isLoading && !isLoadingData && filteredRemittances.length > 0 && (
          <div className="hidden lg:block">
            <Card className="bg-white border border-black/5 rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.08)]">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="bg-black/[0.01] border-b border-black/5">
                      <th className="text-left py-6 px-8 text-sm font-black uppercase tracking-widest text-black/50">
                        {lang === "es" ? "Fecha del Viaje" : "Journey Date"}
                      </th>
                      <th className="text-left py-6 px-8 text-sm font-black uppercase tracking-widest text-black/50">
                        {lang === "es" ? "Código Secreto" : "Secret Code"}
                      </th>
                      <th className="text-left py-6 px-8 text-sm font-black uppercase tracking-widest text-black/50">
                        {lang === "es" ? "Destinatario" : "Recipient"}
                      </th>
                      <th className="text-right py-6 px-8 text-sm font-black uppercase tracking-widest text-black/50">USD</th>
                      <th className="text-right py-6 px-8 text-sm font-black uppercase tracking-widest text-black/50">MXN</th>
                      <th className="text-center py-6 px-8 text-sm font-black uppercase tracking-widest text-black/50">
                        {lang === "es" ? "Estado" : "Status"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {filteredRemittances.map((tx, index) => (
                      <tr 
                        key={index} 
                        className="group hover:bg-black/[0.01] cursor-pointer transition-all duration-300" 
                        onClick={() => window.location.href = `/recibir?code=${tx.code}`}
                      >
                        <td className="py-6 px-8 text-sm text-black/50 font-medium">
                          {formatTimestamp(tx.timestamp)}
                        </td>
                        <td className="py-6 px-8 text-lg font-mono font-black text-jade tracking-widest group-hover:scale-105 transition-transform origin-left">
                          {tx.code}
                        </td>
                        <td className="py-6 px-8 text-sm text-black">
                          {tx.recipientAlias && tx.recipientAlias !== truncateAddress(tx.recipient) ? (
                            <span className="font-bold">@{tx.recipientAlias}</span>
                          ) : (
                            <ENSDisplay address={tx.recipient} truncate={true} />
                          )}
                        </td>
                        <td className="py-6 px-8 text-right text-black/60 font-medium">{formatUSDC(tx.amountUSD)}</td>
                        <td className="py-6 px-8 text-right font-black text-black text-lg">
                          {formatMXNFromContract(tx.amountMXN)}
                        </td>
                        <td className="py-6 px-8 text-center">
                          <Badge className={`${getStatusColor(tx.status)} px-3 py-1 rounded-full text-xs font-black tracking-tighter uppercase`}>
                            {getStatusLabel(tx.status)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mobile / Tablet Cards */}
        {isConnected && !isLoading && !isLoadingData && filteredRemittances.length > 0 && (
          <div className="lg:hidden space-y-6">
            {filteredRemittances.map((tx, index) => (
              <Card 
                key={index} 
                className="bg-white border border-black/5 rounded-3xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 active:scale-95 shadow-md"
                onClick={() => window.location.href = `/recibir?code=${tx.code}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <div className="text-sm text-black/40 font-bold uppercase tracking-widest">{lang === "es" ? "Código" : "Code"}</div>
                    <div className="text-2xl font-black text-jade tracking-widest font-mono">{tx.code}</div>
                  </div>
                  <Badge className={`${getStatusColor(tx.status)} px-3 py-1 rounded-full text-xs font-black tracking-tighter uppercase`}>
                    {getStatusLabel(tx.status)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-sm text-black/40 font-bold uppercase tracking-widest mb-1">{lang === "es" ? "Para" : "For"}</div>
                    <div className="text-sm text-black font-bold">
                      {tx.recipientAlias && tx.recipientAlias !== truncateAddress(tx.recipient) ? (
                        <span>@{tx.recipientAlias}</span>
                      ) : (
                        <ENSDisplay address={tx.recipient} truncate={true} />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-black/40 font-bold uppercase tracking-widest mb-1">{lang === "es" ? "Monto" : "Amount"}</div>
                    <div className="text-lg font-black text-black">{formatMXNFromContract(tx.amountMXN)}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 flex justify-between items-center">
                  <div className="text-sm text-black/50 font-medium">
                    {formatTimestamp(tx.timestamp)}
                  </div>
                  <div className="text-sm text-black/50 font-bold flex items-center gap-1 group">
                    {lang === "es" ? "Detalles" : "Details"} <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Historial;



