import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";

export const Footer = () => {
  const { lang } = useLanguage();

  return (
    <footer className="relative mt-20">
      {/* Patrón de rombos arriba del footer */}
      <div 
        className="h-[25px] w-full"
        style={{
          backgroundColor: 'hsl(var(--color-azul-marino))',
          backgroundImage: 'url(/images/pattern-rombos.png)',
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
        }}
      />
      
      <div className="bg-[hsl(var(--color-azul-mar))] border-t border-[hsl(var(--color-celeste)/0.3)]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="Tlalix Logo" 
                className="h-8 w-8 object-contain animate-float"
              />
              <span className="font-bold text-white">Tlalix</span>
            </div>

            <div className="flex space-x-6 text-sm text-white/70">
              <a href="#" className="hover:text-[hsl(var(--color-celeste))] transition-colors duration-300">
                {t("footer.privacy", lang)}
              </a>
              <a href="#" className="hover:text-[hsl(var(--color-celeste))] transition-colors duration-300">
                {t("footer.terms", lang)}
              </a>
              <a href="#" className="hover:text-[hsl(var(--color-celeste))] transition-colors duration-300">
                {t("footer.contact", lang)}
              </a>
            </div>

            <p className="text-sm text-white/60">
              © 2025 Tlalix. {lang === "es" ? "Demo educativo" : "Educational demo"}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
