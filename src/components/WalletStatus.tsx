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
      <Card className="border-warning/50 bg-warning/10">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-warning" />
            <p className="text-sm text-warning-foreground">
              {lang === 'es' 
                ? '⚠️ Conecta tu wallet para enviar remesas reales'
                : '⚠️ Connect your wallet to send real remittances'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-success/50 bg-success/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-success" />
          {lang === 'es' ? 'Wallet Conectada' : 'Wallet Connected'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {lang === 'es' ? 'Dirección:' : 'Address:'}
          </span>
          <span className="font-mono text-xs">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {lang === 'es' ? 'Red:' : 'Network:'}
          </span>
          <Badge variant="outline" className="text-xs">
            {chain?.name || 'Unknown'}
          </Badge>
        </div>
        {balance && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {lang === 'es' ? 'Balance:' : 'Balance:'}
            </span>
            <span className="font-medium">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
