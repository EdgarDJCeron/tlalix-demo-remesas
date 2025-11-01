import { useState } from "react";
import { CheckCircle2, Users, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockEmployees, Employee } from "@/mocks/employees";
import { useToast } from "@/hooks/use-toast";

const Empresas = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  const handlePayAll = () => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.status === "pending" ? { ...emp, status: "paid" } : emp))
    );
    toast({
      title: lang === "es" ? "¡Nómina pagada!" : "Payroll paid!",
      description: lang === "es" 
        ? "Todos los pagos fueron procesados exitosamente." 
        : "All payments were processed successfully.",
    });
  };

  const totalPending = employees
    .filter((emp) => emp.status === "pending")
    .reduce((sum, emp) => sum + emp.amount, 0);

  const benefits = [
    {
      icon: Zap,
      title: lang === "es" ? "Pagos instantáneos" : "Instant payments",
      description: lang === "es" 
        ? "Tu equipo recibe su nómina en segundos." 
        : "Your team receives their payroll in seconds.",
    },
    {
      icon: Shield,
      title: lang === "es" ? "100% trazable" : "100% traceable",
      description: lang === "es" 
        ? "Cada transacción queda registrada en blockchain." 
        : "Every transaction is recorded on blockchain.",
    },
    {
      icon: Users,
      title: lang === "es" ? "Sin complicaciones" : "Hassle-free",
      description: lang === "es" 
        ? "Sin cuentas bancarias internacionales." 
        : "No international bank accounts needed.",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <section className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            {lang === "es" ? "Nómina internacional, simple y segura" : "International payroll, simple and secure"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === "es" 
              ? "Paga a tu equipo remoto en México con Tlalix. Sin bancos, sin demoras, sin complicaciones." 
              : "Pay your remote team in Mexico with Tlalix. No banks, no delays, no complications."}
          </p>
        </section>

        {/* Benefits */}
        <section className="mb-12">
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Payroll Demo */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>
                  {lang === "es" ? "Nómina del mes" : "Monthly payroll"}
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {lang === "es" ? "Total pendiente:" : "Total pending:"}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      ${totalPending.toFixed(2)} USD
                    </p>
                  </div>
                  <Button 
                    onClick={handlePayAll} 
                    disabled={totalPending === 0}
                    className="bg-gradient-primary"
                  >
                    {lang === "es" ? "Pagar a todos" : "Pay all"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        {lang === "es" ? "Nombre" : "Name"}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        {lang === "es" ? "Puesto" : "Position"}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Wallet</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                        {lang === "es" ? "Monto" : "Amount"}
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        {lang === "es" ? "Estado" : "Status"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{emp.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{emp.position}</td>
                        <td className="py-3 px-4 font-mono text-sm">{emp.wallet}</td>
                        <td className="py-3 px-4 text-right font-medium">
                          ${emp.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {emp.status === "paid" ? (
                            <Badge variant="outline" className="bg-success/20 text-success-foreground border-success/30">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {lang === "es" ? "Pagado" : "Paid"}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-muted">
                              {lang === "es" ? "Pendiente" : "Pending"}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {employees.map((emp) => (
                  <Card key={emp.id}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{emp.name}</p>
                          <p className="text-sm text-muted-foreground">{emp.position}</p>
                        </div>
                        {emp.status === "paid" ? (
                          <Badge variant="outline" className="bg-success/20 text-success-foreground border-success/30">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {lang === "es" ? "Pagado" : "Paid"}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-muted">
                            {lang === "es" ? "Pendiente" : "Pending"}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs font-mono text-muted-foreground">{emp.wallet}</p>
                      <p className="text-lg font-bold">${emp.amount.toFixed(2)} USD</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Empresas;
