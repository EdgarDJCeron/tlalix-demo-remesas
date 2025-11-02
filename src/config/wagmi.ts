import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { scrollSepolia, scroll } from 'wagmi/chains';
import { rabbyWallet, metaMaskWallet, walletConnectWallet, coinbaseWallet } from '@rainbow-me/rainbowkit/wallets';

export const config = getDefaultConfig({
  appName: 'Tlalix',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'c380cc29c5e77777a053d6df0e808232',
  chains: [scrollSepolia, scroll],
  ssr: false,
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [
        rabbyWallet,
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
      ],
    },
  ],
});
