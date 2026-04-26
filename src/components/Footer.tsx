import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";

export const Footer = () => {
  const { lang } = useLanguage();

  return (
    <footer className="relative mt-12 border-t border-black/5">
      <div className="bg-white pt-12 pb-12">
        <div className="container mx-auto px-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Tlalix Logo" 
                className="h-10 w-10 object-contain brightness-0 opacity-40"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm font-bold uppercase tracking-[0.2em] text-black/80">
              <a href="#" className="hover:text-jade transition-all duration-300 hover:tracking-[0.3em]">
                {t("footer.privacy", lang)}
              </a>
              <a href="#" className="hover:text-jade transition-all duration-300 hover:tracking-[0.3em]">
                {t("footer.terms", lang)}
              </a>
              <a href="#" className="hover:text-jade transition-all duration-300 hover:tracking-[0.3em]">
                {t("footer.contact", lang)}
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-black/40 tracking-widest uppercase">
            <p>© 2026 TLALIX LABS. {lang === "es" ? "PROTOCOLOS DE REMESAS" : "REMITTANCE PROTOCOLS"}.</p>
            <p className="flex items-center gap-2">
              <span className="h-1 w-1 bg-jade rounded-full" />
              {lang === "es" ? "HECHO EN MÉXICO PARA EL MUNDO" : "MADE IN MEXICO FOR THE WORLD"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};


