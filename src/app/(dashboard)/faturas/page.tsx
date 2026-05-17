import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { Receipt, Search, Filter } from "lucide-react";
import { InvoiceFormSlideOver } from "./InvoiceFormSlideOver";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function FaturasPage() {
  const invoices = await prisma.invoice.findMany({
    include: { client: { select: { tradeName: true } } },
    orderBy: { dueDate: 'asc' }
  });

  const clients = await prisma.client.findMany({
    select: { id: true, tradeName: true },
    orderBy: { tradeName: 'asc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
            <Receipt className="w-8 h-8 text-muted-foreground" />
            Contas a Receber (Faturas)
          </h1>
          <p className="text-muted-foreground">Controle de recebimentos e inadimplência.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar fatura..." 
              className="bg-surface border border-border text-sm pl-9 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-white transition-shadow text-white placeholder:text-muted-foreground"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <InvoiceFormSlideOver clients={clients} />
        </div>
      </div>

      <Card>
        <div className="w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-mono text-muted uppercase tracking-wider border-b border-border bg-surface/50">
              <tr>
                <th className="px-6 py-4 font-normal">Descrição</th>
                <th className="px-6 py-4 font-normal">Cliente</th>
                <th className="px-6 py-4 font-normal">Valor</th>
                <th className="px-6 py-4 font-normal">Vencimento</th>
                <th className="px-6 py-4 font-normal text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4">
                    <EmptyState 
                      icon={Receipt} 
                      title="Nenhuma fatura lançada" 
                      description="Seu controle financeiro está limpo. Crie uma nova fatura para começar a acompanhar seus recebimentos." 
                    />
                  </td>
                </tr>
              ) : invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-surface/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{invoice.description}</td>
                  <td className="px-6 py-4 text-muted-foreground">{invoice.client.tradeName}</td>
                  <td className="px-6 py-4 font-mono text-xs text-white">R$ {invoice.amount.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {invoice.dueDate.toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant={invoice.status === 'PAID' ? 'success' : invoice.status === 'OVERDUE' ? 'destructive' : 'warning'}>
                      {invoice.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}