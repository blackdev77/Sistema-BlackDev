import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      where: { deletedAt: null },
      orderBy: { dueDate: 'asc' }
    });

    let csv = "\uFEFF";
    csv += "DESCRIÇÃO;CATEGORIA;VALOR;VENCIMENTO;STATUS;PAGO EM;CRIADO EM\n";

    expenses.forEach(e => {
      const desc = e.description || "";
      const cat = e.category || "OPERACIONAL";
      const value = e.amount.toFixed(2).replace(".", ",");
      const dueDate = e.dueDate.toLocaleDateString("pt-BR");
      const status = e.status === "PAID" ? "PAGO" : "PENDENTE";
      const paidAt = e.paidAt ? e.paidAt.toLocaleDateString("pt-BR") : "";
      const createdAt = e.createdAt.toLocaleDateString("pt-BR");

      const safeDesc = desc.replace(/"/g, '""');

      csv += `"${safeDesc}";${cat};${value};${dueDate};${status};${paidAt};${createdAt}\n`;
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=base_despesas.csv"
      }
    });
  } catch (error) {
    console.error("Export expenses error:", error);
    return NextResponse.json({ error: "Erro ao exportar despesas." }, { status: 500 });
  }
}
