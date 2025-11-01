import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";

export const Footer = () => {
  const { lang } = useLanguage();

  return (
    <footer className="border-t bg-card mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-gradient-primary" />
            <span className="font-bold text-primary">Tlalix</span>
          </div>

          <div className="flex space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-accent transition-colors">
              {t("footer.privacy", lang)}
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              {t("footer.terms", lang)}
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              {t("footer.contact", lang)}
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2025 Tlalix. {lang === "es" ? "Demo educativo" : "Educational demo"}.
          </p>
        </div>
      </div>
    </footer>
  );
};
