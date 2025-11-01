import { useState } from "react";
import { Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockHistory, TransactionStatus } from "@/mocks/history";

const Historial = () => {
  const { lang } = useLanguage();
  const [filter, setFilter] = useState<TransactionStatus | "all">("all");

  const filteredHistory = filter === "all" 
    ? mockHistory 
    : mockHistory.filter(tx => tx.status === filter);

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case "confirmed": return "bg-success/20 text-success-foreground border-success/30";
      case "withdrawn": return "bg-primary/20 text-primary-foreground border-primary/30";
      case "pending": return "bg-muted text-muted-foreground";
      case "failed": return "bg-destructive/20 text-destructive-foreground border-destructive/30";
      case "timeout": return "bg-muted text-muted-foreground";
      default: return "bg-muted";
    }
  };

  const getStatusLabel = (status: TransactionStatus) => {
    const labels = {
      es: {
        confirmed: "Confirmada",
        withdrawn: "Retirada",
        pending: "Pendiente",
        failed: "Fallida",
        timeout: "Expirada",
      },
      en: {
        confirmed: "Confirmed",
        withdrawn: "Withdrawn",
        pending: "Pending",
        failed: "Failed",
        timeout: "Timeout",
      },
    };
    return labels[lang][status];
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground">
            {lang === "es" ? "Historial de transacciones" : "Transaction history"}
          </h1>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={(v) => setFilter(v as TransactionStatus | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={lang === "es" ? "Filtrar por estado" : "Filter by status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{lang === "es" ? "Todas" : "All"}</SelectItem>
                <SelectItem value="confirmed">{lang === "es" ? "Confirmadas" : "Confirmed"}</SelectItem>
                <SelectItem value="withdrawn">{lang === "es" ? "Retiradas" : "Withdrawn"}</SelectItem>
                <SelectItem value="pending">{lang === "es" ? "Pendientes" : "Pending"}</SelectItem>
                <SelectItem value="failed">{lang === "es" ? "Fallidas" : "Failed"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle>
                {lang === "es" ? "Transacciones" : "Transactions"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        {lang === "es" ? "Fecha" : "Date"}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        {lang === "es" ? "Destinatario" : "Recipient"}
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">USD</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">MXN</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                        {lang === "es" ? "Comisión" : "Fee"}
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        {lang === "es" ? "Estado" : "Status"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((tx) => (
                      <tr key={tx.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 text-sm">
                          {new Date(tx.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">{tx.recipient}</td>
                        <td className="py-3 px-4 text-sm text-right">${tx.usd.toFixed(2)}</td>
                        <td className="py-3 px-4 text-sm text-right font-medium">
                          ${tx.mxn.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-muted-foreground">
                          ${tx.fee.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline" className={getStatusColor(tx.status)}>
                            {getStatusLabel(tx.status)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredHistory.map((tx) => (
            <Card key={tx.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{tx.recipient}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(tx.status)}>
                    {getStatusLabel(tx.status)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">USD:</span>
                    <span className="ml-2 font-medium">${tx.usd.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">MXN:</span>
                    <span className="ml-2 font-medium">${tx.mxn.toFixed(2)}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">
                      {lang === "es" ? "Comisión:" : "Fee:"}
                    </span>
                    <span className="ml-2">${tx.fee.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Historial;
