import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";

const Home = () => {
  const { lang } = useLanguage();

  const advantages = [
    {
      icon: DollarSign,
      title: lang === "es" ? "Comisión baja" : "Low fees",
      description: lang === "es" 
        ? "Solo 1.5% de comisión. Sin costos ocultos." 
        : "Only 1.5% commission. No hidden fees.",
    },
    {
      icon: Zap,
      title: lang === "es" ? "Envío instantáneo" : "Instant transfer",
      description: lang === "es" 
        ? "Tu dinero llega en segundos, no en días." 
        : "Your money arrives in seconds, not days.",
    },
    {
      icon: Shield,
      title: lang === "es" ? "100% seguro" : "100% secure",
      description: lang === "es" 
        ? "Tecnología blockchain para máxima seguridad." 
        : "Blockchain technology for maximum security.",
    },
    {
      icon: MapPin,
      title: lang === "es" ? "Retiros fáciles" : "Easy withdrawals",
      description: lang === "es" 
        ? "Miles de puntos de retiro en todo México." 
        : "Thousands of withdrawal points across Mexico.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Imagen de fondo con parallax */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700"
          style={{
            backgroundImage: 'url(/images/hero.jpeg)',
            transform: 'scale(1.1)',
          }}
        />
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--color-azul-marino))] via-transparent to-transparent" />
        
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl animate-slide-up text-glow">
              {t("home.hero.title", lang)}
            </h1>
            <p className="mb-8 text-lg text-white/90 md:text-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {t("home.hero.subtitle", lang)}
            </p>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-white animate-fade-in">
            {lang === "es" ? "¿Por qué Tlalix?" : "Why Tlalix?"}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {advantages.map((advantage, index) => (
              <Card 
                key={index} 
                className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 hover:-translate-y-2 transition-all duration-300 animate-slide-up group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 group-hover:bg-[hsl(var(--color-celeste)/0.2)] transition-all duration-300">
                    <advantage.icon className="h-6 w-6 text-white group-hover:text-[hsl(var(--color-celeste))] transition-colors duration-300" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    {advantage.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">{advantage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Fondo con efecto de brillo */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
        
        {/* Efecto de resplandor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--color-celeste)/0.15)] rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-6 text-4xl md:text-5xl font-bold text-white animate-fade-in" style={{ fontFamily: 'Cinzel, serif' }}>
              {lang === "es" ? "Listo para empezar?" : "Ready to start?"}
            </h2>
            <p className="mb-10 text-xl md:text-2xl text-white/80 animate-fade-in leading-relaxed" style={{ animationDelay: '0.1s' }}>
              {lang === "es" 
                ? "Prueba Tlalix ahora y descubre lo fácil que es enviar dinero a México." 
                : "Try Tlalix now and discover how easy it is to send money to Mexico."}
            </p>
            <Link to="/como-funciona">
              <Button 
                size="lg" 
                className="bg-[hsl(var(--color-celeste))] hover:bg-[hsl(var(--color-celeste)/0.9)] text-white text-lg px-10 py-6 shadow-2xl shadow-[hsl(var(--color-celeste)/0.4)] hover:shadow-[hsl(var(--color-celeste)/0.6)] transition-all duration-300 animate-fade-in hover:scale-110 border-2 border-white/20"
                style={{ animationDelay: '0.2s' }}
              >
                {lang === "es" ? "Ver cómo funciona" : "See how it works"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Xoloitzcuintle Section - Final */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in" style={{ fontFamily: 'Cinzel, serif' }}>
              {lang === "es" ? "¡Has llegado al Mictlán!" : "You've reached Mictlán!"}
            </h2>
            <p className="text-lg text-white/70 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {lang === "es" 
                ? "El xoloitzcuintle te guía en tu viaje. Envía con confianza." 
                : "The xoloitzcuintle guides you on your journey. Send with confidence."}
            </p>
          </div>
          
          {/* Imagen del xolo */}
          <div className="relative w-full max-w-6xl mx-auto">
            {/* La imagen */}
            <img 
              src="/images/xolo.png" 
              alt="Xoloitzcuintle guía espiritual" 
              className="w-full h-auto animate-fade-in relative z-10"
              style={{ animationDelay: '0.3s' }}
            />
            
            {/* Gradientes para integrar con el fondo */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--color-azul-marino))] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--color-azul-marino))] via-transparent to-[hsl(var(--color-azul-marino))] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[hsl(var(--color-azul-marino))] to-transparent pointer-events-none" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
