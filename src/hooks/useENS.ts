import { useState, useEffect } from 'react';
import { normalize } from 'viem/ens';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

// ENS resolution is always done on Mainnet (free to read)
const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

/**
 * Hook to resolve ENS names to addresses (free, read-only)
 * @param ensName - The ENS name to resolve (e.g., "vitalik.eth")
 * @returns address or null if not found
 */
export const useENSAddress = (ensName: string | undefined) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ensName || !ensName.endsWith('.eth')) {
      setAddress(null);
      setIsLoading(false);
      return;
    }

    const resolveENS = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const normalizedName = normalize(ensName);
        const resolvedAddress = await mainnetClient.getEnsAddress({
          name: normalizedName,
        });
        
        setAddress(resolvedAddress || null);
      } catch (err) {
        console.error('Error resolving ENS:', err);
        setError(err as Error);
        setAddress(null);
      } finally {
        setIsLoading(false);
      }
    };

    resolveENS();
  }, [ensName]);

  return { address, isLoading, error };
};

/**
 * Hook to resolve addresses to ENS names (reverse lookup, free)
 * @param address - The address to resolve
 * @returns ENS name or null if not found
 */
export const useENSName = (address: string | undefined) => {
  const [ensName, setEnsName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address || !address.startsWith('0x')) {
      setEnsName(null);
      setIsLoading(false);
      return;
    }

    const resolveENS = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const name = await mainnetClient.getEnsName({
          address: address as `0x${string}`,
        });
        
        setEnsName(name);
      } catch (err) {
        console.error('Error resolving ENS name:', err);
        setError(err as Error);
        setEnsName(null);
      } finally {
        setIsLoading(false);
      }
    };

    resolveENS();
  }, [address]);

  return { ensName, isLoading, error };
};

/**
 * Hook to get ENS avatar (free, read-only)
 * @param ensName - The ENS name
 * @returns avatar URL or null
 */
export const useENSAvatar = (ensName: string | undefined) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!ensName || !ensName.endsWith('.eth')) {
      setAvatar(null);
      setIsLoading(false);
      return;
    }

    const resolveAvatar = async () => {
      setIsLoading(true);
      
      try {
        const normalizedName = normalize(ensName);
        const avatarUrl = await mainnetClient.getEnsAvatar({
          name: normalizedName,
        });
        
        setAvatar(avatarUrl);
      } catch (err) {
        console.error('Error resolving ENS avatar:', err);
        setAvatar(null);
      } finally {
        setIsLoading(false);
      }
    };

    resolveAvatar();
  }, [ensName]);

  return { avatar, isLoading };
};
