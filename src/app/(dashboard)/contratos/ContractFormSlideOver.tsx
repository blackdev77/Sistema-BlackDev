"use client";

import { useState } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { createContract } from "@/app/actions/contract";
import { toast } from "sonner";

interface ClientOption {
  id: string;
  tradeName: string;
}

interface ProjectOption {
  id: string;
  name: string;
}

interface ContractFormSlideOverProps {
  clients: ClientOption[];
  projects: ProjectOption[];
}

export function ContractFormSlideOver({ clients, projects }: ContractFormSlideOverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await createContract(formData);
    
    if (result.success) {
      toast.success("Contrato criado com sucesso!");
      setIsOpen(false);
    } else {
      toast.error(result.error || "Erro ao criar contrato");
    }
    setIsPending(false);
  }

  return (
    <>
      <Button variant="primary" className="gap-2" onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4" />
        Novo Contrato
      </Button>

      <SlideOver 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Novo Contrato" 
        description="Cadastre um novo contrato legal associando-o a um cliente e projeto (opcional)."
      >
        <form action={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Identificação & Escopo</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Título do Contrato <span className="text-red-500">*</span></label>
              <input 
                name="title"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: Prestação de Serviços de Desenvolvimento Web 2026"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Cliente <span className="text-red-500">*</span></label>
              <select 
                name="clientId"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                defaultValue=""
              >
                <option value="" disabled>Selecione um cliente...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.tradeName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Projeto (Opcional)</label>
              <select 
                name="projectId"
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                defaultValue=""
              >
                <option value="">Nenhum projeto vinculado</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/50">
            <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Termos Financeiros e Vigência</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Valor do Contrato (R$) <span className="text-red-500">*</span></label>
              <input 
                name="value"
                type="number"
                step="0.01"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: 55000.00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Status</label>
              <select 
                name="status"
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                defaultValue="DRAFT"
              >
                <option value="DRAFT">Rascunho (Draft)</option>
                <option value="PENDING_SIGNATURE">Assinatura Pendente</option>
                <option value="SIGNED">Assinado (Vigente)</option>
                <option value="EXPIRED">Expirado</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Início da Vigência</label>
                <input 
                  name="startsAt"
                  type="date"
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Fim da Vigência</label>
                <input 
                  name="endsAt"
                  type="date"
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50 flex justify-end gap-3 mt-auto">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Salvando..." : "Criar Contrato"}
            </Button>
          </div>
        </form>
      </SlideOver>
    </>
  );
}
