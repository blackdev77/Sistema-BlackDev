import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [invoices, expenses] = await Promise.all([
      prisma.invoice.findMany({
        where: { deletedAt: null },
        include: { client: { select: { tradeName: true } } },
        orderBy: { dueDate: 'asc' }
      }),
      prisma.expense.findMany({
        where: { deletedAt: null },
        orderBy: { dueDate: 'asc' }
      })
    ]);

    // Use UTF-8 BOM (\uFEFF) to make sure Excel opens accents (ç, á, õ) correctly in Portuguese on Windows
    let csv = "\uFEFF";
    csv += "TIPO;CATEGORIA;CLIENTE/DESCRIÇÃO;VALOR;VENCIMENTO;STATUS;PAGO EM\n";

    invoices.forEach(inv => {
      const clientName = inv.client?.tradeName || "N/A";
      const desc = `${clientName} - ${inv.description}`;
      const amount = inv.amount.toFixed(2).replace(".", ",");
      const dueDate = inv.dueDate.toLocaleDateString("pt-BR");
      const status = inv.status === "PAID" ? "PAGO" : inv.status === "OVERDUE" ? "ATRASADO" : "PENDENTE";
      const paidAt = inv.paidAt ? inv.paidAt.toLocaleDateString("pt-BR") : "";
      
      const safeDesc = desc.replace(/"/g, '""');
      csv += `RECEITA;PROJETOS/SERVIÇOS;"${safeDesc}";${amount};${dueDate};${status};${paidAt}\n`;
    });

    expenses.forEach(exp => {
      const desc = exp.description;
      const amount = exp.amount.toFixed(2).replace(".", ",");
      const dueDate = exp.dueDate.toLocaleDateString("pt-BR");
      const status = exp.status === "PAID" ? "PAGO" : "PENDENTE";
      const paidAt = exp.paidAt ? exp.paidAt.toLocaleDateString("pt-BR") : "";
      
      const safeDesc = desc.replace(/"/g, '""');
      csv += `DESPESA;${exp.category};"${safeDesc}";${amount};${dueDate};${status};${paidAt}\n`;
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=relatorio_financeiro.csv"
      }
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Erro ao exportar dados." }, { status: 500 });
  }
}
