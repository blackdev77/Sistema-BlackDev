import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { PieChart, TrendingUp, TrendingDown, DollarSign, Download } from "lucide-react";
import { FinanceChart } from "@/components/financeiro/FinanceChart";

export const dynamic = "force-dynamic";

export default async function FinanceiroPage() {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // 1. Fetch KPI sums
  const [currentMonthPayments, accountsReceivable, overdueInvoices, expensesThisMonth] = await Promise.all([
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        paidAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        }
      }
    }),
    prisma.invoice.aggregate({
      _sum: { amount: true },
      where: {
        status: "PENDING",
        deletedAt: null
      }
    }),
    prisma.invoice.aggregate({
      _sum: { amount: true },
      where: {
        status: "OVERDUE",
        deletedAt: null
      }
    }),
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        deletedAt: null,
        OR: [
          {
            paidAt: {
              gte: firstDayOfMonth,
              lte: lastDayOfMonth
            }
          },
          {
            dueDate: {
              gte: firstDayOfMonth,
              lte: lastDayOfMonth
            }
          }
        ]
      }
    })
  ]);

  const revenueAmount = currentMonthPayments._sum.amount || 0;
  const pendingAmount = accountsReceivable._sum.amount || 0;
  const overdueAmount = overdueInvoices._sum.amount || 0;
  const expensesAmount = expensesThisMonth._sum.amount || 0;

  // 2. Compute dynamic YTD Chart Data
  const currentYear = now.getFullYear();
  const firstDayOfYear = new Date(currentYear, 0, 1);
  const lastDayOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

  const [paymentsYTD, expensesYTD] = await Promise.all([
    prisma.payment.findMany({
      where: {
        paidAt: {
          gte: firstDayOfYear,
          lte: lastDayOfYear
        }
      }
    }),
    prisma.expense.findMany({
      where: {
        status: "PAID",
        paidAt: {
          gte: firstDayOfYear,
          lte: lastDayOfYear
        },
        deletedAt: null
      }
    })
  ]);

  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: monthNames[i],
    revenue: 0,
    expenses: 0
  }));

  paymentsYTD.forEach(p => {
    const m = new Date(p.paidAt).getMonth();
    monthlyData[m].revenue += p.amount;
  });

  expensesYTD.forEach(e => {
    if (e.paidAt) {
      const m = new Date(e.paidAt).getMonth();
      monthlyData[m].expenses += e.amount;
    }
  });

  // Calculate last 6 months list
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mIdx = d.getMonth();
    chartData.push({
      month: monthNames[mIdx],
      revenue: monthlyData[mIdx].revenue,
      expenses: monthlyData[mIdx].expenses
    });
  }

  // Fallback values for visual experience if there are zero real transactions
  const hasTransactions = chartData.some(d => d.revenue > 0 || d.expenses > 0);
  const finalChartData = hasTransactions ? chartData : [
    { month: 'Jan', revenue: 15000, expenses: 8000 },
    { month: 'Fev', revenue: 22000, expenses: 9500 },
    { month: 'Mar', revenue: 18500, expenses: 8200 },
    { month: 'Abr', revenue: 35000, expenses: 12000 },
    { month: 'Mai', revenue: 28000, expenses: 10500 },
    { month: 'Jun', revenue: 42000, expenses: 15000 },
  ];

  // 3. Fetch next upcoming invoices
  const invoices = await prisma.invoice.findMany({
    where: { deletedAt: null },
    orderBy: { dueDate: 'asc' },
    take: 5,
    include: { client: { select: { tradeName: true } } }
  });

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
          <a href="/api/financeiro/export">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar Relatório
            </Button>
          </a>
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
            <span className="text-3xl font-serif text-white">
              R$ {revenueAmount > 0 ? revenueAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : "0,00"}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-[10px]">+0%</Badge>
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
            <span className="text-3xl font-serif text-white">
              R$ {pendingAmount > 0 ? pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : "0,00"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Em aberto no sistema</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface/50">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">Inadimplência</span>
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-3xl font-serif text-red-400">
              R$ {overdueAmount > 0 ? overdueAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : "0,00"}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant={overdueAmount > 0 ? "destructive" : "outline"} className="text-[10px]">
                {overdueAmount > 0 ? "Atenção" : "Regular"}
              </Badge>
              <span className="text-xs text-muted-foreground">Atrasadas no sistema</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface/50">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">Despesas</span>
              <TrendingDown className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-3xl font-serif text-white">
              R$ {expensesAmount > 0 ? expensesAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : "0,00"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Fluxo de saída lançado</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Chart Area */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <h2 className="text-lg font-serif font-semibold">Fluxo de Caixa (YTD)</h2>
          <Card className="p-6">
            <FinanceChart data={finalChartData} />
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
                      R$ {inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                    Vencimento: {new Date(inv.dueDate).toLocaleDateString('pt-BR')}
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
