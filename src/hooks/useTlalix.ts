import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { TLALIX_ABI } from '@/config/abis';
import { parseUnits } from 'viem';

// Hook para registrar alias de usuario
export function useRegisterAlias() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const registerAlias = (alias: string) => {
    // @ts-expect-error - wagmi v2 types issue
    writeContract({
      address: CONTRACTS.scrollSepolia.tlalix,
      abi: TLALIX_ABI,
      functionName: 'registerAlias',
      args: [alias],
    });
  };

  return {
    registerAlias,
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Hook para crear remesa
export function useCreateRemittance() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createRemittance = (amountUSD: string, recipientAddress: string, code: string) => {
    // Convertir USD a formato con 6 decimales (USDC usa 6 decimales)
    const amountInWei = parseUnits(amountUSD, 6);
    
    // IMPORTANTE: El contrato espera recipientAlias (string)
    // Si es una address (0x...), el contrato NO la encontrará como alias
    // y asignará msg.sender como recipient (BUG del contrato)
    // 
    // Solución temporal: Enviar la address como string y el contrato
    // intentará buscarla como alias. Si no existe, usará msg.sender.
    // 
    // TODO: Deploy contrato actualizado que acepte address directamente
    
    // @ts-expect-error - wagmi v2 types issue
    writeContract({
      address: CONTRACTS.scrollSepolia.tlalix,
      abi: TLALIX_ABI,
      functionName: 'createRemittance',
      args: [amountInWei, recipientAddress, code],
    });
  };

  return {
    createRemittance,
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Hook para reclamar remesa (directamente por el destinatario)
export function useClaimRemittance() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claimRemittance = (code: string) => {
    // @ts-expect-error - wagmi v2 types issue
    writeContract({
      address: CONTRACTS.scrollSepolia.tlalix,
      abi: TLALIX_ABI,
      functionName: 'claimRemittance',
      args: [code],
    });
  };

  return {
    claimRemittance,
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Hook para registrar wallet como punto de retiro (cashout point)
export function useRegisterCashoutPoint() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const registerCashoutPoint = (name: string, location: string, feePct: number) => {
    writeContract({
      address: CONTRACTS.scrollSepolia.tlalix,
      abi: TLALIX_ABI,
      functionName: 'registerCashoutPoint',
      args: [name, location, BigInt(Math.round(feePct * 100))],
    });
  };

  return {
    registerCashoutPoint,
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Hook para verificar si una wallet es cashout point
export function useIsCashoutPoint(address: string | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACTS.scrollSepolia.tlalix,
    abi: TLALIX_ABI,
    functionName: 'cashoutPoints',
    args: address ? [address as `0x${string}`] : undefined,
  });

  const cashoutPoint = data as any;
  const isActive = cashoutPoint ? cashoutPoint.isActive : false;

  return {
    isActive,
    cashoutPoint,
    isLoading,
    error,
    refetch,
  };
}

// Hook para obtener datos de una remesa
export function useGetRemittance(code: string) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACTS.scrollSepolia.tlalix,
    abi: TLALIX_ABI,
    functionName: 'getRemittance',
    args: [code],
  });

  return {
    remittance: data,
    isLoading,
    error,
    refetch,
  };
}

// Hook para verificar si un código está disponible
export function useIsCodeAvailable(code: string) {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACTS.scrollSepolia.tlalix,
    abi: TLALIX_ABI,
    functionName: 'isCodeAvailable',
    args: [code],
  });

  return {
    isAvailable: data,
    isLoading,
    error,
  };
}

// Hook para obtener el perfil de usuario por alias
export function useGetUserByAlias(alias: string) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACTS.scrollSepolia.tlalix,
    abi: TLALIX_ABI,
    functionName: 'getUserByAlias',
    args: [alias],
  });

  return {
    user: data,
    isLoading,
    error,
    refetch,
  };
}

// Hook para obtener las remesas de un usuario
export function useGetUserRemittances(userAddress: `0x${string}` | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACTS.scrollSepolia.tlalix,
    abi: TLALIX_ABI,
    functionName: 'getUserRemittances',
    args: userAddress ? [userAddress] : undefined,
  });

  return {
    remittanceCodes: data,
    isLoading,
    error,
    refetch,
  };
}

// Hook para calcular el monto a recibir
export function useCalculateReceiveAmount(amountUSD: string) {
  // Convertir USD a formato con 6 decimales
  const amountInWei = amountUSD ? parseUnits(amountUSD, 6) : BigInt(0);
  
  const { data, isLoading, error } = useReadContract({
    address: CONTRACTS.scrollSepolia.tlalix,
    abi: TLALIX_ABI,
    functionName: 'calculateReceiveAmount',
    args: [amountInWei],
  });

  return {
    calculation: data, // [netUSD, amountMXN, fee]
    isLoading,
    error,
  };
}

// Hook para obtener las estadísticas de la plataforma
export function useGetStats() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACTS.scrollSepolia.tlalix,
    abi: TLALIX_ABI,
    functionName: 'getStats',
  });

  return {
    stats: data, // [totalRemittances, totalVolume, platformBalance, exchangeRate, platformFeePct]
    isLoading,
    error,
    refetch,
  };
}

// Hook para obtener el tipo de cambio
export function useExchangeRate() {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACTS.scrollSepolia.tlalix,
    abi: TLALIX_ABI,
    functionName: 'exchangeRate',
  });

  return {
    exchangeRate: data,
    isLoading,
    error,
  };
}

// Hook para obtener la comisión de la plataforma
export function usePlatformFee() {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACTS.scrollSepolia.tlalix,
    abi: TLALIX_ABI,
    functionName: 'platformFeePct',
  });

  return {
    platformFeePct: data,
    isLoading,
    error,
  };
}
