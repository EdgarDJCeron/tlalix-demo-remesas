import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, MapPin, DollarSign, Globe, Clock, TrendingUp, ShieldCheck, Eye, Lock } from "lucide-react";
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
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image with optimized overlay for Light Mode */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/hero_pro.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-16 pt-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text Content */}
            <div className="text-left">
              <h1 className="mb-8 text-5xl font-black tracking-tight text-black md:text-7xl lg:text-7xl animate-slide-up leading-[0.9]" style={{ fontFamily: 'Cinzel, serif' }}>
                {lang === "es" ? (
                  <>
                    <span className="block mb-2">ENVÍA REMESAS</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-jade via-black to-oro">EN SEGUNDOS</span>
                    <span className="block text-2xl md:text-3xl mt-6 opacity-90 font-bold tracking-widest text-black/80 uppercase">Directo a pesos mexicanos</span>
                  </>
                ) : (
                  <>
                    <span className="block mb-2">SEND REMITTANCES</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-jade via-black to-oro">IN SECONDS</span>
                    <span className="block text-2xl md:text-3xl mt-6 opacity-90 font-bold tracking-widest text-black/80 uppercase">Direct to mexican pesos</span>
                  </>
                )}
              </h1>
              
              <p className="mb-12 max-w-2xl text-xl text-black/80 md:text-2xl animate-fade-in leading-relaxed font-light italic" style={{ animationDelay: '0.2s', fontFamily: 'Caudex, serif' }}>
                {t("home.hero.subtitle", lang)}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Link to="/enviar">
                  <Button 
                    size="lg" 
                    className="bg-jade hover:bg-jade/90 text-white text-xl px-12 py-9 shadow-xl shadow-jade/20 transition-all duration-500 hover:scale-105 rounded-2xl group"
                  >
                    {lang === "es" ? "Enviar ahora" : "Send now"}
                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link to="/como-funciona">
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="border-black/10 bg-white/50 text-black hover:bg-black/5 text-xl px-12 py-9 rounded-2xl backdrop-blur-xl transition-all duration-500 shadow-sm"
                  >
                    {lang === "es" ? "Descubre como" : "Discover how"}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Real-time Exchange Rate Card - Light Premium */}
            <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="absolute -inset-10 bg-jade/5 blur-[100px] rounded-full animate-pulse" />
              <Card className="bg-white/80 backdrop-blur-2xl border border-black/5 p-10 rounded-[3rem] relative z-10 overflow-hidden group hover:border-jade/20 transition-all duration-500 shadow-[0_40px_80px_rgba(0,0,0,0.08)]">
                <div className="absolute top-0 right-0 p-8">
                  <div className="flex h-3 w-3 rounded-full bg-jade animate-ping opacity-20" />
                  <div className="absolute top-8 right-8 h-3 w-3 rounded-full bg-jade shadow-[0_0_15px_#10B981]" />
                </div>
                
                  <div className="space-y-6">
                    <p className="text-sm font-black text-black/40 uppercase tracking-[0.3em] mb-4">
                      {lang === "es" ? "Paridad de Mercado y Tasas" : "Market Parity & Rates"}
                    </p>
                    
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-black/[0.02] border border-black/5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-jade/10 flex items-center justify-center overflow-hidden">
                          <img src="https://flagcdn.com/w80/mx.png" alt="Mexico Flag" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-black/50 uppercase tracking-widest">
                            {lang === "es" ? "Peso Mexicano" : "Mexican Peso"}
                          </p>
                          <p className="text-xl font-black text-black">1.00 <span className="text-jade text-sm font-bold ml-1">MXNB</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-1.5 w-1.5 rounded-full bg-jade ml-auto mb-1 animate-pulse" />
                        <p className="text-xs font-bold text-jade uppercase tracking-tighter">
                          {lang === "es" ? "Verificado 1:1" : "Verified 1:1"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-black/[0.02] border border-black/5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-oro/10 flex items-center justify-center overflow-hidden">
                          <img src="https://flagcdn.com/w80/us.png" alt="USA Flag" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-black/50 uppercase tracking-widest">
                            {lang === "es" ? "Dólar Estadounidense" : "US Dollar"}
                          </p>
                          <p className="text-xl font-black text-black">1.00 <span className="text-oro text-sm font-bold ml-1">USDC</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-1.5 w-1.5 rounded-full bg-oro ml-auto mb-1 animate-pulse" />
                        <p className="text-xs font-bold text-oro uppercase tracking-tighter">
                          {lang === "es" ? "Estable 1:1" : "Stable 1:1"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-black/40 uppercase tracking-[0.2em]">
                          {lang === "es" ? "Puente Global" : "Global Bridge"}
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-black text-black tracking-tighter">19.42</span>
                          <span className="text-sm font-bold text-jade">MXN/USD</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-black/5 flex items-center justify-center">
                    <p className="text-xs font-black text-black/40 uppercase tracking-[0.3em]">
                      {lang === "es" ? "Actualizado en tiempo real" : "Real-time updates"}
                    </p>
                  </div>

                {/* Decorative background grid */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              </Card>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-jade/20 to-transparent" />
      </section>

      {/* Advantages Section - Minimalist Luxury Light */}
      <section className="py-20 relative overflow-hidden bg-gray-50/50">
        <div className="container mx-auto px-16 relative z-10">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-10 tracking-tighter uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
              {lang === "es" ? "EL ESTÁNDAR TLALIX" : "THE TLALIX STANDARD"}
            </h2>
            <p className="text-2xl md:text-3xl text-black/80 font-light italic" style={{ fontFamily: 'Caudex, serif' }}>
              {lang === "es" 
                ? "Excelencia financiera definida por la simplicidad y la seguridad." 
                : "Financial excellence defined by simplicity and security."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-black/5">
            {advantages.map((advantage, index) => (
              <div 
                key={index} 
                className="group p-12 border-b lg:border-b-0 lg:border-r border-black/5 transition-all duration-500 hover:bg-white shadow-sm hover:shadow-xl rounded-3xl lg:rounded-none"
              >
                <div className="mb-12 relative">
                  <div className="h-12 w-12 text-jade group-hover:scale-110 transition-transform duration-500">
                    <advantage.icon className="h-full w-full stroke-[1.5]" />
                  </div>
                  {/* Subtle numbering */}
                  <span className="absolute -top-4 -right-4 text-4xl font-black text-black/[0.03] select-none">0{index + 1}</span>
                </div>
                
                <h3 className="text-3xl font-bold text-black mb-6 tracking-tight" style={{ fontFamily: 'Forum, serif' }}>
                  {advantage.title}
                </h3>
                
                <p className="text-lg text-black/80 leading-relaxed font-light group-hover:text-black transition-colors">
                  {advantage.description}
                </p>

                <div className="mt-12 h-1 w-0 bg-jade group-hover:w-full transition-all duration-700 opacity-30" />
              </div>
            ))}
          </div>
        </div>

        {/* Ambient background glow - very subtle */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-jade/5 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* Withdrawal Network Section */}
      <section className="py-20 bg-white relative overflow-hidden border-t border-black/5">
        <div className="container mx-auto px-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Visual Part */}
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -inset-4 bg-jade/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative rounded-[3.5rem] overflow-hidden border border-black/5 shadow-2xl aspect-video lg:aspect-square">
                <img 
                  src="/images/withdrawal_pro.png" 
                  alt="Tlalix Withdrawal Network" 
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[4000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40" />
              </div>
            </div>

            {/* Text Part */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-5xl font-black text-black mb-10 tracking-tighter uppercase leading-[1.1]" style={{ fontFamily: 'Cinzel, serif' }}>
                {lang === "es" ? "TU DINERO EN CUALQUIER LUGAR" : "YOUR MONEY ANYWHERE"}
              </h2>
              <div className="space-y-8">
                <p className="text-xl text-black/80 leading-relaxed font-light" style={{ fontFamily: 'Caudex, serif' }}>
                  {lang === "es" 
                    ? "Con la red de retiro más amplia de México, tu familia puede cobrar en segundos en más de 20,000 puntos autorizados."
                    : "With the widest withdrawal network in Mexico, your family can cash out in seconds at over 20,000 authorized locations."}
                </p>
                
                <div className="grid grid-cols-2 gap-6 py-8 border-y border-black/5">
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-jade" />
                    <span className="text-sm font-black text-black/80 uppercase tracking-[0.2em]">OXXO</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-jade" />
                    <span className="text-sm font-black text-black/80 uppercase tracking-[0.2em]">{lang === "es" ? "Farmacias" : "Pharmacies"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-jade" />
                    <span className="text-sm font-black text-black/80 uppercase tracking-[0.2em]">{lang === "es" ? "Bancos Nacionales" : "National Banks"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-jade" />
                    <span className="text-sm font-black text-black/80 uppercase tracking-[0.2em]">Cajeros RED</span>
                  </div>
                </div>

                <Link to="/retiro">
                  <Button variant="link" className="text-jade p-0 h-auto text-lg hover:gap-4 transition-all gap-2 group">
                    {lang === "es" ? "Explorar puntos de retiro" : "Explore withdrawal points"}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-20 bg-gray-50/50 border-t border-black/5 overflow-hidden">
        <div className="container mx-auto px-16">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -left-10 top-0 h-full w-px bg-gradient-to-b from-jade via-jade/20 to-transparent opacity-30" />
              
              <h2 className="text-3xl md:text-5xl font-black text-black leading-[1.1] tracking-tighter uppercase mb-12" style={{ fontFamily: 'Cinzel, serif' }}>
                {lang === "es" ? (
                  <>
                    EL DINERO NO TIENE <span className="text-jade">FRONTERAS.</span><br />
                    NOSOTROS TAMPOCO.
                  </>
                ) : (
                  <>
                    MONEY HAS NO <span className="text-jade">BORDERS.</span><br />
                    NEITHER DO WE.
                  </>
                )}
              </h2>
              <div className="space-y-12">
                <p className="text-xl md:text-2xl text-black/80 max-w-xl font-light leading-relaxed" style={{ fontFamily: 'Caudex, serif' }}>
                  {lang === "es" 
                    ? "Tlalix es la evolución natural del intercambio de valor. Un estándar diseñado para quienes entienden que el futuro no se espera, se construye."
                    : "Tlalix is the natural evolution of value exchange. A standard designed for those who understand that the future is not waited for, it is built."}
                </p>
                <div className="flex items-center gap-6">
                  <div className="h-px w-32 bg-jade opacity-30" />
                  <div className="h-2 w-2 rounded-full bg-jade/20" />
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-jade/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative rounded-[3.5rem] overflow-hidden border border-black/5 shadow-2xl">
                <img 
                  src="/images/manifesto_pro.png" 
                  alt="Tlalix Manifesto" 
                  className="w-full h-auto scale-105 group-hover:scale-100 transition-transform duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent opacity-90" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Efficiency Comparison Section */}
      <section className="py-20 bg-white border-t border-black/5">
        <div className="container mx-auto px-16">
            <div className="mb-20">
              <h2 className="text-3xl md:text-5xl font-black text-black tracking-tighter uppercase leading-[1.1]" style={{ fontFamily: 'Cinzel, serif' }}>
                {lang === "es" ? "POR QUÉ CAMBIAR TU FORMA DE ENVIAR" : "WHY CHANGE THE WAY YOU SEND"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-black/5">
              {/* Header */}
              <div className="hidden md:contents">
                <div className="p-8 text-xs font-black uppercase tracking-[0.2em] bg-black/[0.02] text-black/50">Beneficio</div>
                <div className="p-8 text-xs font-black uppercase tracking-[0.2em] bg-black/[0.02] text-black/50">Bancos y Agencias</div>
                <div className="p-8 text-xs font-black uppercase tracking-[0.2em] bg-jade/5 text-jade">El Estándar Tlalix</div>
              </div>

              {/* Rows */}
              {[
                { icon: Clock, concept: lang === "es" ? "Disponibilidad" : "Availability", trad: lang === "es" ? "Días de espera" : "Days of waiting", tlx: lang === "es" ? "Dinero al instante" : "Instant money" },
                { icon: TrendingUp, concept: lang === "es" ? "Tu Dinero" : "Your Money", trad: lang === "es" ? "Comisiones altas" : "High fees", tlx: lang === "es" ? "Recibes mucho más" : "You receive much more" },
                { icon: ShieldCheck, concept: lang === "es" ? "Tranquilidad" : "Peace of Mind", trad: lang === "es" ? "Sin rastreo claro" : "No clear tracking", tlx: lang === "es" ? "Control total 24/7" : "Total control 24/7" }
              ].map((row, i) => (
                <React.Fragment key={i}>
                  <div className="p-8 border-b border-black/5 flex items-center gap-4">
                    <row.icon className="h-5 w-5 text-jade/40" />
                    <p className="text-lg font-bold uppercase tracking-tight text-black">{row.concept}</p>
                  </div>
                  <div className="p-8 border-b border-black/5 flex flex-col justify-center bg-black/[0.01]">
                    <p className="text-lg text-black/80">{row.trad}</p>
                  </div>
                  <div className="p-8 border-b border-black/5 flex flex-col justify-center bg-jade/[0.01]">
                    <p className="text-xl font-black text-jade">{row.tlx}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
      </section>

      {/* Human Infrastructure Section */}
      <section className="py-20 bg-gray-50/50 relative overflow-hidden border-t border-black/5">
        <div className="container mx-auto px-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-black mb-10 tracking-tighter uppercase leading-[1.1]" style={{ fontFamily: 'Cinzel, serif' }}>
                {lang === "es" ? "TU TRANQUILIDAD ES NUESTRA PRIORIDAD" : "YOUR PEACE OF MIND IS OUR PRIORITY"}
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="h-px w-12 bg-jade mt-3" />
                  <p className="text-lg text-black/80 leading-relaxed font-light">
                    {lang === "es" 
                      ? "Hemos diseñado una red que cuida cada peso como si fuera nuestro. No necesitas entender de tecnología para saber que tu dinero está seguro y siempre disponible."
                      : "We have designed a network that cares for every cent as if it were our own. You don't need to understand technology to know your money is safe and always available."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-12 pt-12">
                  <div className="group">
                    <div className="h-12 w-12 rounded-2xl bg-jade/10 flex items-center justify-center mb-6 group-hover:bg-jade/20 transition-colors">
                      <Eye className="h-6 w-6 text-jade" />
                    </div>
                    <p className="text-3xl font-black text-black tracking-tighter">100%</p>
                    <p className="text-xs font-bold text-black/40 uppercase tracking-widest mt-2">
                      {lang === "es" ? "Transparente" : "Transparent"}
                    </p>
                  </div>
                  <div className="group">
                    <div className="h-12 w-12 rounded-2xl bg-jade/10 flex items-center justify-center mb-6 group-hover:bg-jade/20 transition-colors">
                      <Lock className="h-6 w-6 text-jade" />
                    </div>
                    <p className="text-3xl font-black text-black tracking-tighter uppercase">
                      {lang === "es" ? "SIEMPRE" : "ALWAYS"}
                    </p>
                    <p className="text-xs font-bold text-black/40 uppercase tracking-widest mt-2">
                      {lang === "es" ? "Protegido" : "Protected"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cinematic Image Container */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-jade/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative aspect-square rounded-[3.5rem] overflow-hidden border border-black/5 shadow-2xl">
                <img 
                  src="/images/security_pro.png" 
                  alt="Tlalix Security and Trust" 
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[3000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent opacity-90" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;



