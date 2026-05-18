import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      where: { deletedAt: null },
      orderBy: { tradeName: 'asc' }
    });

    let csv = "\uFEFF";
    csv += "NOME FANTASIA;RAZÃO SOCIAL;DOCUMENTO/CNPJ;TIER;STATUS;ENDEREÇO;CRIADO EM\n";

    clients.forEach(c => {
      const tradeName = c.tradeName || "";
      const legalName = c.legalName || "";
      const doc = c.document || "N/A";
      const tier = c.tier || "STANDARD";
      const status = c.status === "ACTIVE" ? "ATIVO" : "INATIVO";
      const address = c.address || "";
      const createdAt = c.createdAt.toLocaleDateString("pt-BR");

      const safeTrade = tradeName.replace(/"/g, '""');
      const safeLegal = legalName.replace(/"/g, '""');
      const safeAddr = address.replace(/"/g, '""');

      csv += `"${safeTrade}";"${safeLegal}";"${doc}";${tier};${status};"${safeAddr}";${createdAt}\n`;
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=base_clientes.csv"
      }
    });
  } catch (error) {
    console.error("Export clients error:", error);
    return NextResponse.json({ error: "Erro ao exportar clientes." }, { status: 500 });
  }
}
