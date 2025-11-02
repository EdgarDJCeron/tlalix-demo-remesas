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
      <Button size="sm" disabled className="bg-[hsl(var(--color-celeste))] text-white">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {lang === 'es' ? 'Conectando...' : 'Connecting...'}
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="bg-[hsl(var(--color-celeste))] hover:bg-[hsl(var(--color-celeste)/0.8)] text-white font-mono border border-[hsl(var(--color-celeste))]">
            <Wallet className="mr-2 h-4 w-4" />
            {formatAddress(address)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-[hsl(var(--color-azul-mar))] border-white/20">
          <DropdownMenuLabel className="text-white">
            {lang === 'es' ? 'Mi Wallet' : 'My Wallet'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem className="font-mono text-xs text-white focus:bg-white/10 focus:text-white">
            {address}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem onClick={() => disconnect()} className="text-red-400 focus:bg-white/10 focus:text-red-400">
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
          className="bg-[hsl(var(--color-celeste))] hover:bg-[hsl(var(--color-celeste)/0.8)] text-white border border-[hsl(var(--color-celeste))]"
          onClick={openConnectModal}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {lang === 'es' ? 'Conectar Wallet' : 'Connect Wallet'}
        </Button>
      )}
    </ConnectButton.Custom>
  );
};
