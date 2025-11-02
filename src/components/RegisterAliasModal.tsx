import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, XCircle, User } from "lucide-react";
import { useAccount } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRegisterAlias, useGetUserByAlias } from "@/hooks/useTlalix";

interface RegisterAliasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const RegisterAliasModal = ({ open, onOpenChange, onSuccess }: RegisterAliasModalProps) => {
  const { lang } = useLanguage();
  const { address } = useAccount();
  const { toast } = useToast();
  
  const [alias, setAlias] = useState("");
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const { registerAlias, isLoading, isSuccess, error } = useRegisterAlias();
  const { user: existingUser } = useGetUserByAlias(alias);

  // Check alias availability
  useEffect(() => {
    if (!alias || alias.length < 3) {
      setIsAvailable(null);
      return;
    }

    const checkAvailability = async () => {
      setIsCheckingAvailability(true);
      
      // Wait a bit for user to finish typing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if alias is already taken
      const available = !existingUser || existingUser.wallet === '0x0000000000000000000000000000000000000000';
      setIsAvailable(available);
      setIsCheckingAvailability(false);
    };

    checkAvailability();
  }, [alias, existingUser]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: lang === "es" ? "¡Alias registrado!" : "Alias registered!",
        description: lang === "es" 
          ? `Tu alias "${alias}" ha sido registrado exitosamente.`
          : `Your alias "${alias}" has been registered successfully.`,
      });
      
      setAlias("");
      onOpenChange(false);
      
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [isSuccess, alias, lang, toast, onOpenChange, onSuccess]);

  // Handle error
  useEffect(() => {
    if (error) {
      toast({
        title: lang === "es" ? "Error" : "Error",
        description: lang === "es"
          ? "No se pudo registrar el alias. Inténtalo de nuevo."
          : "Could not register alias. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, lang, toast]);

  const handleRegister = () => {
    if (!alias || !isAvailable) return;
    registerAlias(alias);
  };

  const validateAlias = (value: string) => {
    // Only allow lowercase letters, numbers, and underscores
    return /^[a-z0-9_]*$/.test(value);
  };

  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (validateAlias(value)) {
      setAlias(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {lang === "es" ? "Registrar Alias" : "Register Alias"}
          </DialogTitle>
          <DialogDescription>
            {lang === "es"
              ? "Crea un nombre único para tu wallet. Será más fácil recibir remesas."
              : "Create a unique name for your wallet. It will be easier to receive remittances."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="alias">
              {lang === "es" ? "Alias" : "Alias"}
            </Label>
            <div className="relative">
              <Input
                id="alias"
                placeholder={lang === "es" ? "ej: juan_perez" : "e.g: john_doe"}
                value={alias}
                onChange={handleAliasChange}
                disabled={isLoading}
                className="pr-10"
              />
              {isCheckingAvailability && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
              {!isCheckingAvailability && isAvailable === true && alias.length >= 3 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
              )}
              {!isCheckingAvailability && isAvailable === false && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <XCircle className="h-4 w-4 text-red-500" />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {lang === "es"
                ? "Mínimo 3 caracteres. Solo letras minúsculas, números y guiones bajos."
                : "Minimum 3 characters. Only lowercase letters, numbers and underscores."}
            </p>
            {isAvailable === false && (
              <p className="text-xs text-red-500">
                {lang === "es"
                  ? "Este alias ya está en uso. Elige otro."
                  : "This alias is already taken. Choose another one."}
              </p>
            )}
            {isAvailable === true && alias.length >= 3 && (
              <p className="text-xs text-lime-300">
                {lang === "es"
                  ? "¡Este alias está disponible!"
                  : "This alias is available!"}
              </p>
            )}
          </div>

          <div className="bg-muted p-3 rounded-lg space-y-1">
            <p className="text-xs font-medium">
              {lang === "es" ? "Tu wallet:" : "Your wallet:"}
            </p>
            <p className="text-xs text-muted-foreground font-mono break-all">
              {address}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {lang === "es" ? "Cancelar" : "Cancel"}
          </Button>
          <Button
            onClick={handleRegister}
            disabled={
              isLoading ||
              !alias ||
              alias.length < 3 ||
              isAvailable === false ||
              isCheckingAvailability
            }
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {lang === "es" ? "Registrar" : "Register"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterAliasModal;
