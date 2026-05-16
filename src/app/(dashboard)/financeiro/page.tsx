import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { PieChart, TrendingUp, TrendingDown, DollarSign, Download } from "lucide-react";
import { FinanceChart } from "@/components/financeiro/FinanceChart";

export const dynamic = "force-dynamic";

export default async function FinanceiroPage() {
  
  // Real data fetching (will return empty initially)
  const invoices = await prisma.invoice.findMany({
    orderBy: { dueDate: 'asc' },
    take: 15,
    include: { client: { select: { tradeName: true } } }
  });

  // Mock data for the chart since the DB is empty right now
  // In a real scenario, we would aggregate invoices and expenses by month.
  const chartData = [
    { month: 'Jan', revenue: 15000, expenses: 8000 },
    { month: 'Fev', revenue: 22000, expenses: 9500 },
    { month: 'Mar', revenue: 18500, expenses: 8200 },
    { month: 'Abr', revenue: 35000, expenses: 12000 },
    { month: 'Mai', revenue: 28000, expenses: 10500 },
    { month: 'Jun', revenue: 42000, expenses: 15000 },
  ];

  // If DB has invoices, use them. Otherwise, inject some MOCK rows for UI demonstration.
  const displayInvoices = invoices.length > 0 ? invoices : [
    { id: '1', client: { tradeName: 'TechCorp S/A' }, description: 'SaaS Development - Sprint 1', amount: 15000, status: 'PAID', dueDate: new Date('2026-05-10') },
    { id: '2', client: { tradeName: 'TechCorp S/A' }, description: 'SaaS Development - Sprint 2', amount: 15000, status: 'PENDING', dueDate: new Date('2026-05-25') },
    { id: '3', client: { tradeName: 'Vanguard Retail' }, description: 'E-commerce Redesign', amount: 8500, status: 'OVERDUE', dueDate: new Date('2026-05-01') },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
            <PieChart className="w-8 h-8 text-muted-foreground" />
            Cockpit Financeiro
          </h1>
          <p className="text-muted-foreground">Previsibilidade de caixa, faturamento e fluxo mensal.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar Relatório
          </Button>
          <Button variant="primary" className="gap-2">
            <DollarSign className="w-4 h-4" />
            Nova Fatura
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-surface/50">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">Receita (Mês)</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-3xl font-serif text-white">R$ 42.000</span>
            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-[10px]">+15%</Badge>
              <span className="text-xs text-muted-foreground">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface/50">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">A Receber</span>
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <span className="text-3xl font-serif text-white">R$ 15.000</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">2 faturas abertas</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface/50">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">Inadimplência</span>
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-3xl font-serif text-red-400">R$ 8.500</span>
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="text-[10px]">Atenção</Badge>
              <span className="text-xs text-muted-foreground">1 fatura atrasada</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface/50">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">Despesas</span>
              <TrendingDown className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-3xl font-serif text-white">R$ 15.000</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Operação Saudável</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Chart Area */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <h2 className="text-lg font-serif font-semibold">Fluxo de Caixa (YTD)</h2>
          <Card className="p-6">
            <FinanceChart data={chartData} />
          </Card>
        </div>

        {/* Invoices List */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-serif font-semibold">Próximos Vencimentos</h2>
          <Card>
            <div className="flex flex-col">
              {displayInvoices.map((inv: any) => (
                <div key={inv.id} className="flex flex-col gap-2 p-4 border-b border-border last:border-0 hover:bg-surface/80 transition-colors">
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium text-white">{inv.client?.tradeName}</span>
                    <span className="text-sm font-mono text-white">
                      R$ {inv.amount.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground truncate w-[60%]">{inv.description}</span>
                    <Badge 
                      variant={
                        inv.status === 'PAID' ? 'success' : 
                        inv.status === 'OVERDUE' ? 'destructive' : 
                        'warning'
                      }
                    >
                      {inv.status}
                    </Badge>
                  </div>
                  <span className="text-[10px] font-mono text-muted mt-2">
                    Vencimento: {inv.dueDate.toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
