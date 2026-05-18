import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const contracts = await prisma.contract.findMany({
      where: { deletedAt: null },
      include: {
        client: { select: { tradeName: true } },
        project: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    let csv = "\uFEFF";
    csv += "TÍTULO;CLIENTE;PROJETO;VALOR;VIGÊNCIA INÍCIO;VIGÊNCIA FIM;STATUS;ASSINADO EM;CRIADO EM\n";

    contracts.forEach(c => {
      const title = c.title || "";
      const clientName = c.client?.tradeName || "";
      const projectName = c.project?.name || "N/A";
      const value = c.value.toFixed(2).replace(".", ",");
      const startsAt = c.startsAt ? c.startsAt.toLocaleDateString("pt-BR") : "";
      const endsAt = c.endsAt ? c.endsAt.toLocaleDateString("pt-BR") : "";
      const status = c.status;
      const signedAt = c.signedAt ? c.signedAt.toLocaleDateString("pt-BR") : "";
      const createdAt = c.createdAt.toLocaleDateString("pt-BR");

      const safeTitle = title.replace(/"/g, '""');
      const safeClient = clientName.replace(/"/g, '""');
      const safeProject = projectName.replace(/"/g, '""');

      csv += `"${safeTitle}";"${safeClient}";"${safeProject}";${value};${startsAt};${endsAt};${status};${signedAt};${createdAt}\n`;
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=base_contratos.csv"
      }
    });
  } catch (error) {
    console.error("Export contracts error:", error);
    return NextResponse.json({ error: "Erro ao exportar contratos." }, { status: 500 });
  }
}
