import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { Receipt, Search, Filter } from "lucide-react";
import { InvoiceFormSlideOver } from "./InvoiceFormSlideOver";
import { Pagination } from "@/components/ui/Pagination";
import { InvoiceListTable } from "./InvoiceListTable";

export const dynamic = "force-dynamic";

export default async function FaturasPage(props: { searchParams?: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const take = 20;
  const skip = (page - 1) * take;

  const [invoices, total, clients] = await Promise.all([
    prisma.invoice.findMany({
      skip,
      take,
      include: { 
        client: { select: { tradeName: true } },
        payments: true
      },
      orderBy: { dueDate: 'asc' }
    }),
    prisma.invoice.count(),
    prisma.client.findMany({
      select: { id: true, tradeName: true },
      orderBy: { tradeName: 'asc' }
    })
  ]);

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
        <InvoiceListTable invoices={invoices} />
        <Pagination total={total} take={take} />
      </Card>
    </div>
  );
}