import { useAccount, useBalance } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const WalletStatus = () => {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });
  const { lang } = useLanguage();

  if (!isConnected) {
    return (
      <Card className="border-amber-200 bg-amber-50 animate-fade-in shadow-sm rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-800 font-medium italic">
              {lang === 'es' 
                ? 'Conecta tu wallet para iniciar el viaje de tus remesas'
                : 'Connect your wallet to start your remittance journey'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-black/5 bg-black/[0.01] animate-fade-in rounded-3xl overflow-hidden shadow-inner">
      <CardHeader className="pb-3 pt-6 px-6">
        <CardTitle className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 text-black/50">
          <div className="h-2 w-2 rounded-full bg-jade animate-pulse" />
          {lang === 'es' ? 'Protocolo Conectado' : 'Protocol Connected'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-6 pb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-black/60 font-medium">
            {lang === 'es' ? 'Dirección:' : 'Address:'}
          </span>
          <span className="font-mono text-sm text-black font-bold bg-white px-3 py-1 rounded-lg border border-black/5 shadow-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-black/60 font-medium">
            {lang === 'es' ? 'Red:' : 'Network:'}
          </span>
          <Badge variant="outline" className="text-xs font-black uppercase border-jade/20 text-jade bg-jade/5 px-2 py-0.5 rounded-full">
            {chain?.name || 'Unknown'}
          </Badge>
        </div>
        {balance && (
          <div className="flex items-center justify-between text-sm pt-2 border-t border-black/5">
            <span className="text-black/60 font-medium">
              {lang === 'es' ? 'Gas Nativo:' : 'Native Gas:'}
            </span>
            <span className="font-bold text-black">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


