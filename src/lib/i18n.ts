export type Language = "es" | "en";

interface Translations {
  [key: string]: {
    es: string;
    en: string;
  };
}

export const translations: Translations = {
  // Navbar
  "nav.home": { es: "Inicio", en: "Home" },
  "nav.send": { es: "Enviar", en: "Send" },
  "nav.receive": { es: "Recibir", en: "Receive" },
  "nav.history": { es: "Historial", en: "History" },
  "nav.cashout": { es: "Puntos de Retiro", en: "Cashout Points" },
  "nav.business": { es: "Empresas", en: "Business" },
  "nav.howItWorks": { es: "Cómo funciona", en: "How it works" },
  "nav.demo": { es: "Probar demo", en: "Try demo" },

  // Home
  "home.hero.title": { es: "Envía remesas en segundos, directo a pesos mexicanos", en: "Send remittances in seconds, straight to Mexican pesos" },
  "home.hero.subtitle": { es: "La forma más rápida y segura de enviar dinero a México usando stablecoins", en: "The fastest and safest way to send money to Mexico using stablecoins" },
  "home.hero.cta": { es: "Probar demo", en: "Try demo" },
  "home.hero.secondary": { es: "Ver cómo funciona", en: "See how it works" },

  // Footer
  "footer.privacy": { es: "Privacidad", en: "Privacy" },
  "footer.terms": { es: "Términos", en: "Terms" },
  "footer.contact": { es: "Contacto", en: "Contact" },
};

export const t = (key: string, lang: Language = "es"): string => {
  return translations[key]?.[lang] || key;
};
