import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { CreditCard, Search, Filter, Download } from "lucide-react";
import { ExpenseFormSlideOver } from "./ExpenseFormSlideOver";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function DespesasPage() {
  const expenses = await prisma.expense.findMany({
    orderBy: { dueDate: 'asc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-muted-foreground" />
            Contas a Pagar (Despesas)
          </h1>
          <p className="text-muted-foreground">Controle de custos operacionais e infraestrutura.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <a href="/api/despesas/export">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </a>
          <ExpenseFormSlideOver />
        </div>
      </div>

      <Card>
        <div className="w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-mono text-muted uppercase tracking-wider border-b border-border bg-surface/50">
              <tr>
                <th className="px-6 py-4 font-normal">Descrição</th>
                <th className="px-6 py-4 font-normal">Categoria</th>
                <th className="px-6 py-4 font-normal">Valor</th>
                <th className="px-6 py-4 font-normal">Vencimento</th>
                <th className="px-6 py-4 font-normal text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4">
                    <EmptyState 
                      icon={CreditCard} 
                      title="Nenhuma despesa registrada" 
                      description="Nenhum custo operacional ou de infraestrutura foi lançado. Registre suas despesas para acompanhar o fluxo de caixa." 
                    />
                  </td>
                </tr>
              ) : expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-surface/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{expense.description}</td>
                  <td className="px-6 py-4 text-muted-foreground">{expense.category}</td>
                  <td className="px-6 py-4 font-mono text-xs text-white">R$ {expense.amount.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {expense.dueDate.toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant={expense.status === 'PAID' ? 'success' : 'warning'}>
                      {expense.status}
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