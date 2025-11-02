import { Link, useLocation } from "react-router-dom";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { WalletButton } from "@/components/WalletButton";
import AliasDisplay from "@/components/AliasDisplay";
import { t } from "@/lib/i18n";

export const Navbar = () => {
  const { lang, setLang } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: t("nav.home", lang) },
    { path: "/enviar", label: t("nav.send", lang) },
    { path: "/recibir", label: t("nav.receive", lang) },
    { path: "/historial", label: t("nav.history", lang) },
    { path: "/retiro", label: t("nav.cashout", lang) },
    { path: "/empresas", label: t("nav.business", lang) },
    { path: "/como-funciona", label: t("nav.howItWorks", lang) },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b backdrop-blur-xl" style={{ backgroundColor: 'hsl(var(--color-azul-mar)/0.95)', borderBottomColor: 'hsl(var(--color-celeste))' }}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 group">
          <img 
            src="/logo.png" 
            alt="Tlalix Logo" 
            className="h-14 w-14 object-contain group-hover:scale-110 transition-transform duration-300"
          />
          <span className="text-xl font-bold group-hover:text-[hsl(var(--color-celeste))] transition-colors duration-300" style={{ color: 'hsl(var(--color-blanco))' }}>Tlalix</span>
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative ${
                isActive(link.path)
                  ? "opacity-100"
                  : "opacity-80 hover:opacity-100"
              }`}
              style={{
                color: 'hsl(var(--color-blanco))',
                backgroundColor: isActive(link.path) 
                  ? 'hsl(var(--color-celeste))' 
                  : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive(link.path)) {
                  e.currentTarget.style.backgroundColor = 'hsl(var(--color-azul-marino))';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.path)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {link.label}
              {isActive(link.path) && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white animate-fade-in" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <AliasDisplay />
          
          <WalletButton />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            title="Toggle language"
            className="transition-all duration-300 hover:scale-110 border border-white/20"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'hsl(var(--color-blanco))'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'hsl(var(--color-celeste))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <Globe className="h-5 w-5" />
            <span className="sr-only">Toggle language</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};
