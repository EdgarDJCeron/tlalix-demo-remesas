import { useState, useEffect } from "react";
import { User, UserPlus } from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import RegisterAliasModal from "./RegisterAliasModal";
import { CONTRACTS } from "@/config/contracts";
import { TLALIX_ABI } from "@/config/abis";
import { scrollSepolia } from "wagmi/chains";

const AliasDisplay = () => {
  const { lang } = useLanguage();
  const { address, isConnected } = useAccount();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [userAlias, setUserAlias] = useState<string | null>(null);

  // Read user data from contract
  const { data: userData, refetch } = useReadContract({
    address: CONTRACTS.scrollSepolia.tlalix,
    abi: TLALIX_ABI,
    functionName: 'userProfiles',
    args: address ? [address] : undefined,
    chainId: scrollSepolia.id,
  });

  useEffect(() => {
    if (userData) {
      const userProfile = userData as any;
      if (userProfile && userProfile.username && userProfile.username !== "") {
        setUserAlias(userProfile.username);
      } else {
        setUserAlias(null);
      }
    }
  }, [userData]);

  if (!isConnected) {
    return null;
  }

  const handleSuccess = () => {
    // Refetch user data after successful registration
    refetch();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {userAlias ? (
          <Badge variant="secondary" className="flex items-center gap-1 bg-white/10 text-white border border-white/20">
            <User className="h-3 w-3" />
            <span className="font-medium">@{userAlias}</span>
          </Badge>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-1 bg-white/5 text-white border-white/20 hover:bg-white/10 hover:text-white"
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">
              {lang === "es" ? "Registrar alias" : "Register alias"}
            </span>
          </Button>
        )}
      </div>

      <RegisterAliasModal
        open={showRegisterModal}
        onOpenChange={setShowRegisterModal}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default AliasDisplay;
