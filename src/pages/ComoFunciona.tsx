import { useState } from "react";
import { Send, Wallet, MapPin, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-primary-foreground md:text-5xl">
            {lang === "es" ? "Cómo funciona Tlalix paso a paso" : "How Tlalix works step by step"}
          </h1>
          <p className="text-lg text-primary-foreground/90 md:text-xl max-w-2xl mx-auto">
            {lang === "es" 
              ? "Sigue el recorrido de una remesa desde Juan (EE. UU.) hasta su mamá en México." 
              : "Follow the journey of a remittance from Juan (USA) to his mom in Mexico."}
          </p>
        </div>
      </section>

      {/* Acto 1 - Envío */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              {lang === "es" ? "Acto 1 – Envío (Juan en EE. UU.)" : "Act 1 – Sending (Juan in USA)"}
            </h2>
            <p className="text-muted-foreground">
              {lang === "es" 
                ? "Juan quiere enviar $100 USD a su mamá en México." 
                : "Juan wants to send $100 USD to his mom in Mexico."}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {acto1Steps.map((step, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Dialog open={openModal === "acto1"} onOpenChange={(open) => setOpenModal(open ? "acto1" : null)}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  {lang === "es" ? "Ver ejemplo visual" : "View visual example"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {lang === "es" ? "Proceso de envío" : "Sending process"}
                  </DialogTitle>
                </DialogHeader>
                <div className="bg-muted rounded-lg p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    {lang === "es" 
                      ? "Simulación visual del proceso de envío. En producción aquí se mostraría una interfaz interactiva." 
                      : "Visual simulation of the sending process. In production, an interactive interface would be shown here."}
                  </p>
                  <div className="bg-card border rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{lang === "es" ? "Monto a enviar:" : "Amount to send:"}</span>
                      <span className="text-2xl font-bold">$100 USD</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{lang === "es" ? "Tipo de cambio:" : "Exchange rate:"}</span>
                      <span>17.50 MXN/USD</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{lang === "es" ? "Comisión (1.5%):" : "Fee (1.5%):"}</span>
                      <span>$1.50 USD</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between items-center">
                      <span className="font-bold">{lang === "es" ? "Mamá recibe:" : "Mom receives:"}</span>
                      <span className="text-2xl font-bold text-success">$1,732.50 MXN</span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Acto 2 - Recepción */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              {lang === "es" ? "Acto 2 – Recepción (Mamá en México)" : "Act 2 – Receiving (Mom in Mexico)"}
            </h2>
            <p className="text-muted-foreground">
              {lang === "es" 
                ? "Mamá recibe una notificación y abre el enlace seguro." 
                : "Mom receives a notification and opens the secure link."}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {acto2Steps.map((step, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                    <step.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Acto 3 - Retiro */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              {lang === "es" ? "Acto 3 – Retiro (Comercio local)" : "Act 3 – Withdrawal (Local store)"}
            </h2>
            <p className="text-muted-foreground">
              {lang === "es" 
                ? "Mamá va a su tienda más cercana y retira en efectivo." 
                : "Mom goes to her nearest store and withdraws cash."}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {acto3Steps.map((step, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <step.icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Card className="max-w-md mx-auto bg-gradient-accent text-accent-foreground">
              <CardContent className="p-8">
                <div className="mb-4 h-32 w-32 mx-auto bg-white rounded-lg flex items-center justify-center">
                  <div className="text-6xl font-mono font-bold text-primary">QR</div>
                </div>
                <p className="text-sm mb-2">{lang === "es" ? "Código:" : "Code:"} 123456</p>
                <p className="text-sm mb-2">{lang === "es" ? "Monto:" : "Amount:"} $1,732.50 MXN</p>
                <p className="text-xs opacity-90">
                  {lang === "es" ? "Válido por 24 horas" : "Valid for 24 hours"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Educational Block */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            {lang === "es" 
              ? "Tlalix combina tecnología y educación" 
              : "Tlalix combines technology and education"}
          </h2>
          <p className="mb-8 text-lg opacity-90 max-w-2xl mx-auto">
            {lang === "es" 
              ? "Para que cualquier persona pueda enviar y recibir dinero con confianza, sin necesidad de conocimientos técnicos." 
              : "So anyone can send and receive money confidently, without needing technical knowledge."}
          </p>
          <Link to="/enviar">
            <Button size="lg" variant="secondary">
              {lang === "es" ? "Probar demo" : "Try demo"}
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="mb-8 text-3xl font-bold text-center text-foreground">
            {lang === "es" ? "Preguntas frecuentes" : "Frequently asked questions"}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
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
