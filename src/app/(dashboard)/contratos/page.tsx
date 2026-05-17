import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { FileSignature, Plus, Search, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ContratosPage() {
  const contracts = await prisma.contract.findMany({
    include: { client: { select: { tradeName: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
            <FileSignature className="w-8 h-8 text-muted-foreground" />
            Contratos
          </h1>
          <p className="text-muted-foreground">Documentos legais, assinaturas e escopos vigentes.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar contrato..." 
              className="bg-surface border border-border text-sm pl-9 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-white transition-shadow text-white placeholder:text-muted-foreground"
            />
          </div>
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Contrato
          </Button>
        </div>
      </div>

      <Card>
        <div className="w-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-mono text-muted uppercase tracking-wider border-b border-border bg-surface/50">
              <tr>
                <th className="px-6 py-4 font-normal">Título / Serviço</th>
                <th className="px-6 py-4 font-normal">Cliente</th>
                <th className="px-6 py-4 font-normal">Valor</th>
                <th className="px-6 py-4 font-normal">Vigência</th>
                <th className="px-6 py-4 font-normal text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhum contrato ativo no sistema.
                  </td>
                </tr>
              ) : contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-surface/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{contract.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">{contract.client.tradeName}</td>
                  <td className="px-6 py-4 font-mono text-xs text-white">R$ {contract.value.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {contract.startsAt ? contract.startsAt.toLocaleDateString('pt-BR') : '--'} até {contract.endsAt ? contract.endsAt.toLocaleDateString('pt-BR') : '--'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant={contract.status === 'SIGNED' ? 'success' : contract.status === 'DRAFT' ? 'outline' : 'warning'}>
                      {contract.status}
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