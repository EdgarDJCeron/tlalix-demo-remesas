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
      <Button size="sm" disabled className="bg-jade/10 text-jade border border-jade/20">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {lang === 'es' ? 'Conectando...' : 'Connecting...'}
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="bg-black/5 hover:bg-black/10 text-black font-mono border border-black/10 shadow-none">
            <Wallet className="mr-2 h-4 w-4 text-jade" />
            {formatAddress(address)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white border border-black/5 shadow-2xl rounded-2xl p-2 z-[110]">
          <DropdownMenuLabel className="text-black/60 text-xs font-black uppercase tracking-widest px-3 py-2">
            {lang === 'es' ? 'Mi Wallet' : 'My Wallet'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-black/5" />
          <DropdownMenuItem className="font-mono text-sm text-black/80 focus:bg-jade/5 focus:text-jade rounded-xl cursor-pointer">
            <div className="truncate w-full">{address}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-black/5" />
          <DropdownMenuItem onClick={() => disconnect()} className="text-red-500 focus:bg-red-50 focus:text-red-600 rounded-xl cursor-pointer">
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
          className="bg-jade hover:bg-jade/90 text-white font-bold border border-jade/10 shadow-lg shadow-jade/20 rounded-xl"
          onClick={openConnectModal}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {lang === 'es' ? 'Conectar Wallet' : 'Connect Wallet'}
        </Button>
      )}
    </ConnectButton.Custom>
  );
};


