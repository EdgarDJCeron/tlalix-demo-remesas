import { useENSName, useENSAvatar } from "@/hooks/useENS";
import { truncateAddress } from "@/lib/format";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ENSDisplayProps {
  address: string;
  showAvatar?: boolean;
  truncate?: boolean;
}

/**
 * Component that displays ENS name if available, otherwise shows truncated address
 * Optionally shows ENS avatar
 */
export const ENSDisplay = ({ address, showAvatar = false, truncate = true }: ENSDisplayProps) => {
  const { ensName, isLoading: isLoadingName } = useENSName(address);
  const { avatar, isLoading: isLoadingAvatar } = useENSAvatar(ensName || undefined);

  if (!address) return null;

  const displayName = ensName || (truncate ? truncateAddress(address) : address);

  if (isLoadingName) {
    return (
      <span className="inline-flex items-center gap-1 text-white">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span className="font-mono">{truncate ? truncateAddress(address) : address}</span>
      </span>
    );
  }

  if (showAvatar && ensName) {
    return (
      <span className="inline-flex items-center gap-2 text-white">
        {!isLoadingAvatar && avatar && (
          <Avatar className="h-5 w-5">
            <AvatarImage src={avatar} alt={ensName} />
            <AvatarFallback>{ensName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
        <span className={ensName ? "font-medium" : "font-mono"}>
          {displayName}
        </span>
      </span>
    );
  }

  return (
    <span className={`text-white ${ensName ? "font-medium" : "font-mono"}`}>
      {displayName}
    </span>
  );
};
