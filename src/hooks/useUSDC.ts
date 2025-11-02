import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { MOCK_USDC_ABI } from '@/config/abis';
import { parseUnits } from 'viem';

// Hook para obtener el balance de USDC
export function useUSDCBalance(address: `0x${string}` | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACTS.scrollSepolia.mockUSDC,
    abi: MOCK_USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  return {
    balance: data,
    isLoading,
    error,
    refetch,
  };
}

// Hook para solicitar USDC del faucet
export function useUSDCFaucet() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const requestFaucet = () => {
    // @ts-expect-error - wagmi v2 types issue
    writeContract({
      address: CONTRACTS.scrollSepolia.mockUSDC,
      abi: MOCK_USDC_ABI,
      functionName: 'faucet',
    });
  };

  return {
    requestFaucet,
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Hook para aprobar USDC al contrato Tlalix
export function useUSDCApprove() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (amount: string) => {
    // Convertir a formato con 6 decimales
    const amountInWei = parseUnits(amount, 6);
    
    // @ts-expect-error - wagmi v2 types issue
    writeContract({
      address: CONTRACTS.scrollSepolia.mockUSDC,
      abi: MOCK_USDC_ABI,
      functionName: 'approve',
      args: [CONTRACTS.scrollSepolia.tlalix, amountInWei],
    });
  };

  return {
    approve,
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Hook para obtener los decimales del token
export function useUSDCDecimals() {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACTS.scrollSepolia.mockUSDC,
    abi: MOCK_USDC_ABI,
    functionName: 'decimals',
  });

  return {
    decimals: data,
    isLoading,
    error,
  };
}
