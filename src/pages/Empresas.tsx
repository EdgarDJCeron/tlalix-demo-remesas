import { Rocket, Zap, Shield, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Empresas = () => {
  const { lang } = useLanguage();

  const features = [
    {
      icon: Zap,
      title: lang === "es" ? "Pagos instantáneos" : "Instant payments",
      description: lang === "es" 
        ? "Tu equipo recibe su nómina en segundos" 
        : "Your team receives payroll in seconds",
    },
    {
      icon: Shield,
      title: lang === "es" ? "100% trazable" : "100% traceable",
      description: lang === "es" 
        ? "Cada transacción registrada en blockchain" 
        : "Every transaction recorded on blockchain",
    },
    {
      icon: Users,
      title: lang === "es" ? "Sin complicaciones" : "Hassle-free",
      description: lang === "es" 
        ? "Sin cuentas bancarias internacionales" 
        : "No international bank accounts needed",
    },
  ];

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-[hsl(var(--color-azul-marino))] via-[hsl(var(--color-azul-marino))]/95 to-[hsl(var(--color-azul-marino))]/90">
      <div className="container mx-auto px-4">
        {/* Coming Soon Hero */}
        <div className="relative mb-16 text-center pt-8">
          {/* Animated background */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[hsl(var(--color-celeste))]/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-lime-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[hsl(var(--color-celeste))]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
            <Clock className="h-4 w-4 text-lime-300 animate-pulse" />
            <span className="text-sm font-medium text-white">
              {lang === "es" ? "Próximamente" : "Coming Soon"}
            </span>
          </div>

          {/* Main Icon */}
          <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(var(--color-celeste))] to-lime-300 shadow-2xl animate-bounce">
            <Rocket className="h-12 w-12 text-white" />
          </div>

          {/* Title */}
          <h1 className="mb-6 text-5xl md:text-6xl font-bold text-white">
            {lang === "es" ? "Tlalix para Empresas" : "Tlalix for Business"}
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white font-semibold max-w-3xl mx-auto mb-4">
            {lang === "es" 
              ? "La forma más simple de pagar nómina internacional" 
              : "The simplest way to pay international payroll"}
          </p>
          
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {lang === "es" 
              ? "Estamos trabajando en una plataforma revolucionaria para que pagues a tu equipo remoto en México sin complicaciones." 
              : "We're building a revolutionary platform to pay your remote team in Mexico hassle-free."}
          </p>
        </div>

        {/* Features Preview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            {lang === "es" ? "¿Qué viene?" : "What's coming?"}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all group"
              >
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--color-celeste))]/20 to-lime-300/20 border border-white/10 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-8 w-8 text-lime-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/70">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQgOC4wNi0xOCAxOC0xOHMxOCA4LjA2IDE4IDE4LTguMDYgMTgtMTggMTgtMTgtOC4wNi0xOC0xOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          <CardContent className="p-8 md:p-12 text-center relative z-10">
            <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
              {lang === "es" ? "¿Quieres ser de los primeros?" : "Want to be among the first?"}
            </h3>
            <p className="text-lg text-white mb-8 max-w-2xl mx-auto drop-shadow-md">
              {lang === "es" 
                ? "Únete a nuestra lista de espera y recibe acceso anticipado cuando lancemos Tlalix para Empresas." 
                : "Join our waitlist and get early access when we launch Tlalix for Business."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <input 
                type="email" 
                placeholder={lang === "es" ? "tu@empresa.com" : "you@company.com"}
                className="px-6 py-4 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-300 w-full sm:flex-1 text-base"
              />
              <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-[hsl(var(--color-celeste))] to-lime-300 text-white font-bold hover:scale-105 transition-all shadow-lg hover:shadow-2xl w-full sm:w-auto text-base whitespace-nowrap">
                {lang === "es" ? "Unirme a la lista" : "Join waitlist"}
              </button>
            </div>
            <p className="text-base text-white mt-6 font-medium drop-shadow-md">
              {lang === "es" 
                ? "🚀 Lanzamiento estimado: Q1 2026" 
                : "🚀 Estimated launch: Q1 2026"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Empresas;
