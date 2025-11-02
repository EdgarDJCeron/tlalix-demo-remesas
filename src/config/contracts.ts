// Configuración de contratos deployados
// Actualizar después de hacer deploy en Remix

export const CONTRACTS = {
  // Scroll Sepolia (Testnet)
  scrollSepolia: {
    chainId: 534351,
    mockUSDC: '0xa738389eae5876a054e418e9f0b4bf0de01dad75' as `0x${string}`,
    tlalix: '0x10ae0d2369c6c4a740640cb032bb51cb5bb1c8ba' as `0x${string}`,
  },
  
  // Scroll Mainnet (Producción)
  scroll: {
    chainId: 534352,
    usdc: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4' as `0x${string}`,
    tlalix: '' as `0x${string}`, // Deploy en producción
  },
} as const;

// Exportar también como objeto simple para compatibilidad
export const contracts = CONTRACTS;

// Helper para obtener configuración según la red
export function getContractConfig(chainId: number) {
  if (chainId === 534351) {
    return CONTRACTS.scrollSepolia;
  } else if (chainId === 534352) {
    return CONTRACTS.scroll;
  }
  throw new Error(`Unsupported chain ID: ${chainId}`);
}

