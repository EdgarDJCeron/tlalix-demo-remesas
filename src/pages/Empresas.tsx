import { Zap, Shield, Code, Globe, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const Empresas = () => {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-white pb-32 pt-40">
      <div className="container mx-auto px-16 relative z-10">
        
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <div>
            <div className="mb-10 inline-flex items-center gap-3 px-6 py-2 rounded-full bg-oro/10 border border-oro/30 animate-fade-in shadow-sm">
              <div className="h-2 w-2 rounded-full bg-oro animate-pulse" />
              <span className="text-sm font-black text-oro uppercase tracking-[0.4em]">
                {lang === "es" ? "PRÓXIMAMENTE 2026" : "COMING SOON 2026"}
              </span>
            </div>

            <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-jade/10 border border-jade/20">
              <div className="h-2 w-2 rounded-full bg-jade animate-pulse" />
              <span className="text-xs font-black text-jade uppercase tracking-[0.3em]">
                {lang === "es" ? "Acceso Corporativo" : "Corporate Access"}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-black mb-10 tracking-tighter uppercase leading-[0.9]" style={{ fontFamily: 'Cinzel, serif' }}>
              {lang === "es" ? "TLALIX BUSINESS" : "TLALIX BUSINESS"}
            </h1>
            
            <p className="text-2xl md:text-3xl text-black/80 font-light italic mb-12 max-w-xl" style={{ fontFamily: 'Caudex, serif' }}>
              {lang === "es" 
                ? "La infraestructura definitiva para la nómina y liquidación global en México." 
                : "The ultimate infrastructure for global payroll and settlement in Mexico."}
            </p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-10 bg-jade/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative aspect-[4/5] lg:aspect-square rounded-[4rem] overflow-hidden border border-black/5 shadow-2xl">
              <img 
                src="/images/business_pro.png" 
                alt="Tlalix Business Infrastructure" 
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[4000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent opacity-90" />
            </div>
          </div>
        </div>

        {/* B2B Pillars */}
        <div className="grid md:grid-cols-3 gap-12 mb-40">
          {[
            {
              icon: Zap,
              title: lang === "es" ? "Pagos Masivos" : "Mass Payouts",
              desc: lang === "es" ? "Liquida miles de remesas y nóminas en segundos con nuestra red optimizada." : "Settle thousands of remittances and payrolls in seconds with our optimized network."
            },
            {
              icon: Shield,
              title: lang === "es" ? "Compliance Total" : "Total Compliance",
              desc: lang === "es" ? "Infraestructura robusta con KYB, AML y reporteo fiscal automatizado." : "Robust infrastructure with automated KYB, AML, and tax reporting."
            },
            {
              icon: Globe,
              title: lang === "es" ? "Sin Fronteras" : "No Borders",
              desc: lang === "es" ? "Opera globalmente y liquida localmente sin necesidad de cuentas bancarias en México." : "Operate globally and settle locally without needing bank accounts in Mexico."
            }
          ].map((pillar, i) => (
            <div key={i} className="group p-10 border border-black/5 rounded-[3rem] bg-black/[0.01] hover:bg-white hover:shadow-xl transition-all duration-500">
              <div className="h-14 w-14 rounded-2xl bg-jade/10 flex items-center justify-center mb-8 group-hover:bg-jade/20 transition-colors">
                <pillar.icon className="h-7 w-7 text-jade" />
              </div>
              <h3 className="text-3xl font-black text-black mb-6 tracking-tight uppercase" style={{ fontFamily: 'Cinzel, serif' }}>{pillar.title}</h3>
              <p className="text-lg text-black/80 leading-relaxed font-light">{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* API Preview Section */}
        <div className="grid lg:grid-cols-2 gap-24 items-center mb-40">
          <div className="relative group">
            <div className="bg-gray-50 border border-black/5 rounded-[2.5rem] overflow-hidden shadow-xl">
              <div className="px-8 py-4 border-b border-black/5 flex items-center justify-between bg-black/[0.02]">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/10" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/10" />
                  <div className="h-3 w-3 rounded-full bg-green-500/10" />
                </div>
                <span className="text-xs font-black text-black/40 uppercase tracking-widest">Tlalix API v1.0</span>
              </div>
              <div className="p-10 font-mono text-sm overflow-x-auto bg-white/50">
                <pre className="text-black/80">
                  <code className="block mb-4">
                    <span className="text-jade font-bold">const</span> tlalix = <span className="text-oro font-bold">new</span> Tlalix(<span className="text-jade">'your_api_key'</span>);
                  </code>
                  <code className="block mb-4">
                    <span className="text-jade font-bold">await</span> tlalix.payouts.create(&#123;
                  </code>
                  <code className="block ml-4 mb-4">
                    amount: <span className="text-oro font-bold">50000</span>,<br />
                    currency: <span className="text-jade font-bold">'MXN'</span>,<br />
                    recipient: <span className="text-jade font-bold">'family_id_042'</span>,<br />
                    method: <span className="text-jade font-bold">'instant_cashout'</span>
                  </code>
                  <code className="block">
                    &#125;);
                  </code>
                </pre>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-black text-black mb-10 tracking-tighter uppercase leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
              {lang === "es" ? "DISEÑADO PARA DESARROLLADORES" : "DESIGNED FOR DEVELOPERS"}
            </h2>
            <div className="space-y-6">
              {[
                { t: lang === "es" ? "Documentación Clara" : "Clear Documentation", d: lang === "es" ? "Integra Tlalix en horas, no semanas." : "Integrate Tlalix in hours, not weeks." },
                { t: lang === "es" ? "Sandbox Ilimitado" : "Unlimited Sandbox", d: lang === "es" ? "Prueba tu flujo de pagos sin riesgos." : "Test your payment flow without risks." },
                { t: lang === "es" ? "Webhooks en Vivo" : "Live Webhooks", d: lang === "es" ? "Notificaciones en tiempo real sobre cada retiro." : "Real-time notifications for every cash-out." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-jade shrink-0" />
                  <div>
                    <h4 className="text-black font-bold tracking-tight">{item.t}</h4>
                    <p className="text-black/80 text-sm">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exclusive Partner Section */}
        <section className="relative rounded-[4rem] overflow-hidden border border-black/5 bg-gray-50/50">
          <div className="absolute inset-0 bg-gradient-to-br from-jade/[0.02] via-transparent to-oro/[0.02]" />
          <div className="relative p-12 md:p-24 text-center z-10">
            <h2 className="text-4xl md:text-6xl font-black text-black mb-10 tracking-tighter uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
              {lang === "es" ? "ÚNETE AL PROGRAMA DE PARTNERS" : "JOIN THE PARTNER PROGRAM"}
            </h2>
            <p className="text-xl md:text-2xl text-black/80 font-light italic mb-16 max-w-2xl mx-auto" style={{ fontFamily: 'Caudex, serif' }}>
              {lang === "es" 
                ? "Buscamos empresas visionarias para dar forma a la próxima generación de remesas corporativas." 
                : "We are looking for visionary companies to shape the next generation of corporate remittances."}
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center max-w-3xl mx-auto">
              <input 
                type="email" 
                placeholder={lang === "es" ? "correo@empresa.com" : "email@company.com"}
                className="h-20 px-8 rounded-3xl bg-white border border-black/10 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-jade/20 w-full md:flex-1 text-xl shadow-inner"
              />
              <Button size="lg" className="h-20 px-12 rounded-3xl bg-jade hover:bg-jade/90 text-white text-xl font-black uppercase tracking-widest shadow-xl shadow-jade/20 w-full md:w-auto">
                {lang === "es" ? "Aplicar ahora" : "Apply now"}
              </Button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Empresas;



