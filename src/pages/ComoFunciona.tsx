import { useState } from "react";
import { Send, Wallet, MapPin, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const ComoFunciona = () => {
  const { lang } = useLanguage();
  const [openModal, setOpenModal] = useState<string | null>(null);

  const acto1Steps = [
    {
      icon: Wallet,
      title: lang === "es" ? "1. Conectar wallet" : "1. Connect wallet",
      description: lang === "es" 
        ? "Juan conecta su wallet de MetaMask o usa su correo electrónico." 
        : "Juan connects his MetaMask wallet or uses his email.",
    },
    {
      icon: Send,
      title: lang === "es" ? "2. Ingresar destinatario" : "2. Enter recipient",
      description: lang === "es" 
        ? "Escribe el alias ENS o correo de mamá: mama@email.com" 
        : "Enter mom's ENS alias or email: mama@email.com",
    },
    {
      icon: Check,
      title: lang === "es" ? "3. Confirmar transacción" : "3. Confirm transaction",
      description: lang === "es" 
        ? "Revisa el monto, comisión (1.5%) y tipo de cambio." 
        : "Review amount, fee (1.5%) and exchange rate.",
    },
    {
      icon: Send,
      title: lang === "es" ? "4. Generar enlace" : "4. Generate link",
      description: lang === "es" 
        ? "Se crea un link seguro /r/ABC123 y un QR para compartir." 
        : "A secure link /r/ABC123 and QR code are created to share.",
    },
  ];

  const acto2Steps = [
    {
      icon: Send,
      title: lang === "es" ? "1. Abrir enlace" : "1. Open link",
      description: lang === "es" 
        ? "Mamá recibe el link por WhatsApp y lo abre en su celular." 
        : "Mom receives the link via WhatsApp and opens it on her phone.",
    },
    {
      icon: Wallet,
      title: lang === "es" ? "2. Crear wallet rápida" : "2. Create quick wallet",
      description: lang === "es" 
        ? "Si no tiene wallet, Tlalix crea una automáticamente." 
        : "If she doesn't have a wallet, Tlalix creates one automatically.",
    },
    {
      icon: Check,
      title: lang === "es" ? "3. Verificar correo" : "3. Verify email",
      description: lang === "es" 
        ? "Confirma su identidad con un código de 6 dígitos." 
        : "Confirms her identity with a 6-digit code.",
    },
    {
      icon: Wallet,
      title: lang === "es" ? "4. Ver saldo" : "4. View balance",
      description: lang === "es" 
        ? "Ve su saldo en MXN listo para retirar en efectivo." 
        : "Sees her balance in MXN ready to withdraw in cash.",
    },
  ];

  const acto3Steps = [
    {
      icon: MapPin,
      title: lang === "es" ? "1. Seleccionar tienda" : "1. Select store",
      description: lang === "es" 
        ? "Busca el punto de retiro más cercano: OXXO, Aurrera, etc." 
        : "Finds the nearest withdrawal point: OXXO, Aurrera, etc.",
    },
    {
      icon: Send,
      title: lang === "es" ? "2. Generar PIN/QR" : "2. Generate PIN/QR",
      description: lang === "es" 
        ? "Tlalix crea un código de 6 dígitos válido por 24 horas." 
        : "Tlalix creates a 6-digit code valid for 24 hours.",
    },
    {
      icon: Check,
      title: lang === "es" ? "3. Retirar efectivo" : "3. Withdraw cash",
      description: lang === "es" 
        ? "Muestra el QR en la tienda y recibe pesos mexicanos." 
        : "Shows the QR code at the store and receives Mexican pesos.",
    },
  ];

  const faqs = [
    {
      question: lang === "es" ? "¿Necesito saber de criptomonedas?" : "Do I need to know about cryptocurrencies?",
      answer: lang === "es" 
        ? "No. Tlalix se encarga de toda la complejidad técnica. Solo necesitas un correo electrónico." 
        : "No. Tlalix handles all the technical complexity. You only need an email address.",
    },
    {
      question: lang === "es" ? "¿Qué pasa si pierdo conexión?" : "What happens if I lose connection?",
      answer: lang === "es" 
        ? "La transacción queda guardada en la blockchain. Puedes recuperarla con tu enlace único." 
        : "The transaction is saved on the blockchain. You can recover it with your unique link.",
    },
    {
      question: lang === "es" ? "¿Puedo retirar sin wallet?" : "Can I withdraw without a wallet?",
      answer: lang === "es" 
        ? "Sí. Genera un PIN de 6 dígitos y retira en cualquier comercio afiliado." 
        : "Yes. Generate a 6-digit PIN and withdraw at any affiliated store.",
    },
    {
      question: lang === "es" ? "¿Qué seguridad ofrece Tlalix?" : "What security does Tlalix offer?",
      answer: lang === "es" 
        ? "Usa tecnología blockchain, encriptación de extremo a extremo y verificación de identidad." 
        : "Uses blockchain technology, end-to-end encryption and identity verification.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-jade/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-16 text-center relative z-10">
          <h1 className="mb-8 text-4xl md:text-5xl font-black text-black tracking-tighter uppercase leading-[0.9]" style={{ fontFamily: 'Cinzel, serif' }}>
            {lang === "es" ? "EL VIAJE DE TU DINERO" : "YOUR MONEY'S JOURNEY"}
          </h1>
          <p className="text-xl text-black/60 md:text-2xl max-w-2xl mx-auto font-light italic" style={{ fontFamily: 'Caudex, serif' }}>
            {lang === "es" 
              ? "Sigue el recorrido de una remesa desde el envío digital hasta el efectivo en mano." 
              : "Follow the journey of a remittance from digital sending to cash in hand."}
          </p>
        </div>
      </section>

      {/* Acto 1 - Envío */}
      <section className="py-24 bg-gray-50/50 border-y border-black/5">
        <div className="container mx-auto px-16">
          <div className="mb-16 text-center">
            <Badge className="bg-jade/10 text-jade hover:bg-jade/20 border-jade/20 mb-6 px-4 py-1.5 rounded-full text-sm font-black tracking-widest uppercase">
              {lang === "es" ? "Acto 1: El Origen" : "Act 1: The Origin"}
            </Badge>
            <h2 className="mb-6 text-4xl md:text-5xl font-black text-black tracking-tight uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
              {lang === "es" ? "ENVÍO DESDE EE. UU." : "SENDING FROM USA"}
            </h2>
            <p className="text-lg text-black/60 font-light max-w-xl mx-auto">
              {lang === "es" 
                ? "Juan inicia el viaje enviando $100 USD de forma instantánea." 
                : "Juan starts the journey by sending $100 USD instantly."}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
            {acto1Steps.map((step, index) => (
              <Card key={index} className="bg-white border-black/5 hover:shadow-xl transition-all duration-500 rounded-[2.5rem] p-4">
                <CardHeader>
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-jade/10 group-hover:bg-jade/20 transition-colors">
                    <step.icon className="h-7 w-7 text-jade" />
                  </div>
                  <CardTitle className="text-xl font-black text-black tracking-tight uppercase leading-tight">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-black/60 font-light leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Dialog open={openModal === "acto1"} onOpenChange={(open) => setOpenModal(open ? "acto1" : null)}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-14 px-8 border-black/10 bg-white hover:bg-gray-50 text-black font-bold rounded-2xl shadow-sm">
                  {lang === "es" ? "Ver desglose de costos" : "View cost breakdown"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white border-black/5 rounded-[3rem] p-10">
                <DialogHeader className="mb-8">
                  <DialogTitle className="text-3xl font-black text-black tracking-tighter uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                    {lang === "es" ? "Transparencia Total" : "Total Transparency"}
                  </DialogTitle>
                </DialogHeader>
                <div className="bg-gray-50 rounded-[2.5rem] p-10 shadow-inner">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center text-black/60 font-medium">
                      <span>{lang === "es" ? "Monto a enviar:" : "Amount to send:"}</span>
                      <span className="text-2xl font-bold text-black">$100.00 USDC</span>
                    </div>
                    <div className="flex justify-between items-center text-black/60 font-medium">
                      <span>{lang === "es" ? "Tipo de cambio:" : "Exchange rate:"}</span>
                      <span className="text-black">17.50 MXN/USD</span>
                    </div>
                    <div className="flex justify-between items-center text-black/60 font-medium">
                      <span>{lang === "es" ? "Comisión de red (1.5%):" : "Network fee (1.5%):"}</span>
                      <span className="text-oro font-bold">$1.50 USDC</span>
                    </div>
                    <div className="border-t border-black/10 pt-6 flex flex-col items-center gap-2">
                      <span className="text-black/40 text-sm font-black uppercase tracking-widest">{lang === "es" ? "Mamá recibe en México:" : "Mom receives in Mexico:"}</span>
                      <span className="text-5xl font-black text-jade tracking-tighter">$1,723.75 MXN</span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Acto 2 - Recepción */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-16">
          <div className="mb-16 text-center">
            <Badge className="bg-oro/10 text-oro border-oro/20 mb-6 px-4 py-1.5 rounded-full text-sm font-black tracking-widest uppercase">
              {lang === "es" ? "Acto 2: El Enlace" : "Act 2: The Link"}
            </Badge>
            <h2 className="mb-6 text-4xl md:text-5xl font-black text-black tracking-tight uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
              {lang === "es" ? "RECEPCIÓN EN MÉXICO" : "RECEIVING IN MEXICO"}
            </h2>
            <p className="text-lg text-black/60 font-light max-w-xl mx-auto">
              {lang === "es" 
                ? "Mamá abre el link y ve su saldo disponible al instante." 
                : "Mom opens the link and sees her balance available instantly."}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {acto2Steps.map((step, index) => (
              <Card key={index} className="bg-white border-black/5 hover:shadow-xl transition-all duration-500 rounded-[2.5rem] p-4">
                <CardHeader>
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-oro/10">
                    <step.icon className="h-7 w-7 text-oro" />
                  </div>
                  <CardTitle className="text-xl font-black text-black tracking-tight uppercase leading-tight">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-black/60 font-light leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Acto 3 - Retiro */}
      <section className="py-24 bg-gray-50/50 border-y border-black/5">
        <div className="container mx-auto px-16">
          <div className="mb-16 text-center">
            <Badge className="bg-jade/10 text-jade border-jade/20 mb-6 px-4 py-1.5 rounded-full text-sm font-black tracking-widest uppercase">
              {lang === "es" ? "Acto 3: La Realidad" : "Act 3: The Reality"}
            </Badge>
            <h2 className="mb-6 text-4xl md:text-5xl font-black text-black tracking-tight uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
              {lang === "es" ? "RETIRO DE EFECTIVO" : "CASH WITHDRAWAL"}
            </h2>
            <p className="text-lg text-black/60 font-light max-w-xl mx-auto">
              {lang === "es" 
                ? "El último paso: convertir el valor digital en pesos físicos." 
                : "The last step: converting digital value into physical pesos."}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mb-16">
            {acto3Steps.map((step, index) => (
              <Card key={index} className="bg-white border-black/5 hover:shadow-xl transition-all duration-500 rounded-[2.5rem] p-4">
                <CardHeader>
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-jade/10">
                    <step.icon className="h-7 w-7 text-jade" />
                  </div>
                  <CardTitle className="text-xl font-black text-black tracking-tight uppercase leading-tight">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-black/60 font-light leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Card className="max-w-md mx-auto bg-white border border-black/5 rounded-[3rem] p-10 shadow-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-jade/[0.03] to-transparent pointer-events-none" />
              <CardContent className="p-0 relative z-10">
                <div className="mb-10 bg-gray-50 p-6 rounded-[2rem] shadow-inner mx-auto w-fit border border-black/5">
                  <div className="h-32 w-32 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <div className="text-4xl font-black text-jade font-mono">QR</div>
                  </div>
                </div>
                <div className="space-y-2 mb-8">
                  <p className="text-sm text-black/40 font-black uppercase tracking-[0.3em]">{lang === "es" ? "Código Confidencial" : "Confidential Code"}</p>
                  <p className="text-4xl font-black text-black font-mono tracking-widest">123456</p>
                </div>
                <div className="pt-6 border-t border-black/5">
                  <p className="text-2xl font-black text-jade tracking-tighter">$1,723.75 MXN</p>
                  <p className="text-xs text-black/50 font-bold uppercase tracking-widest mt-2">
                    {lang === "es" ? "Válido por 24 horas" : "Valid for 24 hours"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Educational Block */}
      <section className="py-32 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-jade/[0.02] pointer-events-none" />
        <div className="container mx-auto px-16 text-center relative z-10">
          <h2 className="mb-8 text-4xl md:text-6xl font-black text-black tracking-tighter uppercase leading-[1.1]" style={{ fontFamily: 'Cinzel, serif' }}>
            {lang === "es" 
              ? "CONSTRUYENDO EL FUTURO CON CONFIANZA" 
              : "BUILDING THE FUTURE WITH CONFIDENCE"}
          </h2>
          <p className="mb-12 text-xl text-black/60 font-light italic max-w-2xl mx-auto" style={{ fontFamily: 'Caudex, serif' }}>
            {lang === "es" 
              ? "Tlalix elimina la complejidad técnica para que el valor fluya libremente entre familias." 
              : "Tlalix removes technical complexity so value flows freely between families."}
          </p>
          <Link to="/enviar">
            <Button size="lg" className="h-20 px-16 bg-jade hover:bg-jade/90 text-white text-xl font-black rounded-3xl shadow-2xl shadow-jade/20 uppercase tracking-widest">
              {lang === "es" ? "Probar demo ahora" : "Try demo now"}
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-gray-50/50 border-t border-black/5">
        <div className="container mx-auto px-16 max-w-3xl">
          <h2 className="mb-16 text-4xl font-black text-center text-black tracking-tighter uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            {lang === "es" ? "Preguntas frecuentes" : "Frequently asked questions"}
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white border border-black/5 rounded-[2rem] px-8 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-left font-black text-black hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-black/60 text-lg font-light pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default ComoFunciona;



