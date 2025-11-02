// Configuración de contratos deployados
// Actualizar después de hacer deploy en Remix

export const contracts = {
  // Scroll Sepolia (Testnet)
  scrollSepolia: {
    chainId: 534351,
    mockUSDC: {
      address: '0xa738389eae5876a054e418e9f0b4bf0de01dad75' as const,
      decimals: 6,
    },
    tlalix: {
      address: '0x10ae0d2369c6c4a740640cb032bb51cb5bb1c8ba' as const,
      // ABI se generará automáticamente desde el contrato
    },
  },
  
  // Scroll Mainnet (Producción)
  scroll: {
    chainId: 534352,
    usdc: {
      address: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
      decimals: 6,
    },
    tlalix: {
      address: '', // Deploy en producción
    },
  },
} as const;

// Helper para obtener configuración según la red
export function getContractConfig(chainId: number) {
  if (chainId === 534351) {
    return contracts.scrollSepolia;
  } else if (chainId === 534352) {
    return contracts.scroll;
  }
  throw new Error(`Unsupported chain ID: ${chainId}`);
}
