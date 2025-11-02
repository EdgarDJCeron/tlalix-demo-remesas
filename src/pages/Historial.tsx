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
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-white">
            {lang === "es" ? "Historial de transacciones" : "Transaction history"}
          </h1>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              disabled={isLoading}
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/40"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Filter className="h-4 w-4 text-white/70" />
            <Select value={filter.toString()} onValueChange={(v) => setFilter(v === "all" ? "all" : parseInt(v))}>
              <SelectTrigger className="w-[180px] bg-white/5 border-white/20 text-white">
                <SelectValue placeholder={lang === "es" ? "Filtrar por estado" : "Filter by status"} />
              </SelectTrigger>
              <SelectContent className="bg-[hsl(var(--color-azul-marino))] border-white/20">
                <SelectItem value="all" className="text-white focus:bg-white/10 focus:text-white">{lang === "es" ? "Todas" : "All"}</SelectItem>
                <SelectItem value="0" className="text-white focus:bg-white/10 focus:text-white">{lang === "es" ? "Pendientes" : "Pending"}</SelectItem>
                <SelectItem value="1" className="text-white focus:bg-white/10 focus:text-white">{lang === "es" ? "Bloqueadas" : "Locked"}</SelectItem>
                <SelectItem value="2" className="text-white focus:bg-white/10 focus:text-white">{lang === "es" ? "Listas para retirar" : "Ready for pickup"}</SelectItem>
                <SelectItem value="3" className="text-white focus:bg-white/10 focus:text-white">{lang === "es" ? "Reclamadas" : "Claimed"}</SelectItem>
                <SelectItem value="4" className="text-white focus:bg-white/10 focus:text-white">{lang === "es" ? "Expiradas" : "Expired"}</SelectItem>
                <SelectItem value="5" className="text-white focus:bg-white/10 focus:text-white">{lang === "es" ? "Canceladas" : "Cancelled"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Not Connected State */}
        {!isConnected && (
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <p className="text-white/70">
                {lang === "es" 
                  ? "Conecta tu wallet para ver tu historial de transacciones" 
                  : "Connect your wallet to view your transaction history"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isConnected && (isLoading || isLoadingData) && (
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[hsl(var(--color-celeste))]" />
              <p className="text-white/70">
                {lang === "es" ? "Cargando historial..." : "Loading history..."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {isConnected && !isLoading && !isLoadingData && fetchError && (
          <Card className="border-red-500/20 bg-red-500/5 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <p className="text-red-400 mb-4">{fetchError}</p>
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/40"
              >
                {lang === "es" ? "Reintentar" : "Retry"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {isConnected && !isLoading && !isLoadingData && filteredRemittances.length === 0 && (
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <p className="text-white/70 mb-2">
                {lang === "es" 
                  ? "No se encontraron transacciones" 
                  : "No transactions found"}
              </p>
              {remittanceCodes && remittanceCodes.length > 0 && (
                <p className="text-sm text-white/50">
                  {lang === "es"
                    ? `(${remittanceCodes.length} códigos encontrados pero no pudieron cargarse)`
                    : `(${remittanceCodes.length} codes found but could not be loaded)`}
                </p>
              )}
              <Button 
                className="mt-4 bg-[hsl(var(--color-celeste))] hover:bg-[hsl(var(--color-celeste)/0.8)] text-white" 
                onClick={() => window.location.href = "/enviar"}
              >
                {lang === "es" ? "Enviar remesa" : "Send remittance"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Remittance Codes Display - removed, now we show full details */}

        {/* Desktop Table - with real data */}
        {isConnected && !isLoading && filteredRemittances.length > 0 && (
          <div className="hidden md:block">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === "es" ? "Transacciones" : "Transactions"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 font-medium text-white/70">
                          {lang === "es" ? "Fecha" : "Date"}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-white/70">
                          {lang === "es" ? "Código" : "Code"}
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-white/70">
                          {lang === "es" ? "Destinatario" : "Recipient"}
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-white/70">USD</th>
                        <th className="text-right py-3 px-4 font-medium text-white/70">MXN</th>
                        <th className="text-right py-3 px-4 font-medium text-white/70">
                          {lang === "es" ? "Comisión" : "Fee"}
                        </th>
                        <th className="text-center py-3 px-4 font-medium text-white/70">
                          {lang === "es" ? "Estado" : "Status"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRemittances.map((tx, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/10 cursor-pointer transition-colors" onClick={() => window.location.href = `/recibir?code=${tx.code}`}>
                          <td className="py-3 px-4 text-sm text-white">
                            {formatTimestamp(tx.timestamp)}
                          </td>
                          <td className="py-3 px-4 text-sm font-mono font-bold text-[hsl(var(--color-celeste))]">{tx.code}</td>
                          <td className="py-3 px-4 text-sm text-white">
                            {tx.recipientAlias && tx.recipientAlias !== truncateAddress(tx.recipient) ? (
                              <span className="font-medium">@{tx.recipientAlias}</span>
                            ) : (
                              <ENSDisplay address={tx.recipient} truncate={true} />
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-white">{formatUSDC(tx.amountUSD)}</td>
                          <td className="py-3 px-4 text-sm text-right font-medium text-white">
                            {formatMXNFromContract(tx.amountMXN)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-white/70">
                            {formatUSDC(tx.fee)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge variant="outline" className={getStatusColor(tx.status)}>
                              {getStatusLabel(tx.status)}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mobile Cards - with real data */}
        {isConnected && !isLoading && filteredRemittances.length > 0 && (
          <div className="md:hidden space-y-4">
            {filteredRemittances.map((tx, index) => (
              <Card key={index} className="cursor-pointer hover:bg-white/10 border-white/10 bg-white/5 backdrop-blur-sm transition-colors" onClick={() => window.location.href = `/recibir?code=${tx.code}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono font-bold text-[hsl(var(--color-celeste))]">{tx.code}</p>
                      <p className="text-sm text-white">
                        {tx.recipientAlias && tx.recipientAlias !== truncateAddress(tx.recipient) ? (
                          <span className="font-medium">@{tx.recipientAlias}</span>
                        ) : (
                          <ENSDisplay address={tx.recipient} truncate={true} />
                        )}
                      </p>
                      <p className="text-sm text-white/70">
                        {formatTimestamp(tx.timestamp)}
                      </p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(tx.status)}>
                      {getStatusLabel(tx.status)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-white">
                      <span className="text-white/70">USD:</span>
                      <span className="ml-2 font-medium">{formatUSDC(tx.amountUSD)}</span>
                    </div>
                    <div className="text-white">
                      <span className="text-white/70">MXN:</span>
                      <span className="ml-2 font-medium">{formatMXNFromContract(tx.amountMXN)}</span>
                    </div>
                    <div className="col-span-2 text-white">
                      <span className="text-white/70">
                        {lang === "es" ? "Comisión:" : "Fee:"}
                      </span>
                      <span className="ml-2">{formatUSDC(tx.fee)}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/40">
                    {lang === "es" ? "Ver detalles" : "View details"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Historial;
