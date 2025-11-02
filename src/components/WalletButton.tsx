import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';

export const WalletButton = () => {
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { lang } = useLanguage();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnecting) {
    return (
      <Button size="sm" disabled className="bg-gradient-primary">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {lang === 'es' ? 'Conectando...' : 'Connecting...'}
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="bg-gradient-primary font-mono">
            <Wallet className="mr-2 h-4 w-4" />
            {formatAddress(address)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            {lang === 'es' ? 'Mi Wallet' : 'My Wallet'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="font-mono text-xs">
            {address}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => disconnect()} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            {lang === 'es' ? 'Desconectar' : 'Disconnect'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Usar el ConnectButton de RainbowKit con estilos personalizados
  return (
    <ConnectButton.Custom>
      {({ openConnectModal }) => (
        <Button 
          size="sm" 
          className="bg-gradient-primary"
          onClick={openConnectModal}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {lang === 'es' ? 'Conectar Wallet' : 'Connect Wallet'}
        </Button>
      )}
    </ConnectButton.Custom>
  );
};
