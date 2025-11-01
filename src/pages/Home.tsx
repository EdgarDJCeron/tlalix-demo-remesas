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
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-6xl">
              {t("home.hero.title", lang)}
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl">
              {t("home.hero.subtitle", lang)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/enviar">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow">
                  {t("home.hero.cta", lang)} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/como-funciona">
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  {t("home.hero.secondary", lang)}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            {lang === "es" ? "¿Por qué Tlalix?" : "Why Tlalix?"}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {advantages.map((advantage, index) => (
              <Card 
                key={index} 
                className="border-border bg-card hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <advantage.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                    {advantage.title}
                  </h3>
                  <p className="text-muted-foreground">{advantage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            {lang === "es" ? "Listo para empezar?" : "Ready to start?"}
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            {lang === "es" 
              ? "Prueba Tlalix ahora y descubre lo fácil que es enviar dinero a México." 
              : "Try Tlalix now and discover how easy it is to send money to Mexico."}
          </p>
          <Link to="/como-funciona">
            <Button size="lg" className="bg-gradient-primary">
              {lang === "es" ? "Ver cómo funciona" : "See how it works"}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
