"use client";

import { useState } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { createProposal } from "@/app/actions/proposal";
import { toast } from "sonner";

interface LeadOption {
  id: string;
  companyName: string;
}

interface ClientOption {
  id: string;
  tradeName: string;
}

interface ProposalFormSlideOverProps {
  leads: LeadOption[];
  clients: ClientOption[];
}

export function ProposalFormSlideOver({ leads, clients }: ProposalFormSlideOverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await createProposal(formData);
    
    if (result.success) {
      toast.success("Proposta criada com sucesso!");
      setIsOpen(false);
    } else {
      toast.error(result.error || "Erro ao criar proposta");
    }
    setIsPending(false);
  }

  return (
    <>
      <Button variant="primary" className="gap-2" onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4" />
        Nova Proposta
      </Button>

      <SlideOver 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Nova Proposta Comercial" 
        description="Gere um escopo, orçamento e validade para um cliente cadastrado ou lead em negociação."
      >
        <form action={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Identificação & Destinatário</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Título da Proposta <span className="text-red-500">*</span></label>
              <input 
                name="title"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: Desenvolvimento de E-commerce Premium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Vincular a Lead</label>
                <select 
                  name="leadId"
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                  defaultValue=""
                >
                  <option value="">Nenhum lead selecionado</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>{lead.companyName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Ou Vincular a Cliente</label>
                <select 
                  name="clientId"
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                  defaultValue=""
                >
                  <option value="">Nenhum cliente selecionado</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.tradeName}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/50">
            <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Termos Financeiros, Validade & Status</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Valor Total (R$) <span className="text-red-500">*</span></label>
              <input 
                name="totalValue"
                type="number"
                min="1"
                step="0.01"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: 15000.00"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Prazo de Validade</label>
                <input 
                  name="validUntil"
                  type="date"
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Status da Negociação</label>
                <select 
                  name="status"
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                  defaultValue="DRAFT"
                >
                  <option value="DRAFT">Rascunho (Draft)</option>
                  <option value="SENT">Enviada (Sent)</option>
                  <option value="VIEWED">Visualizada (Viewed)</option>
                  <option value="ACCEPTED">Aceita (Accepted)</option>
                  <option value="REJECTED">Recusada (Rejected)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Condições de Pagamento <span className="text-red-500">*</span></label>
              <textarea 
                name="paymentTerms"
                required
                rows={3}
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow resize-none"
                placeholder="Ex: 50% de sinal e 50% na aprovação final do escopo."
              />
            </div>
          </div>

          <div className="pt-6 border-t border-border/50 flex justify-end gap-3 mt-auto">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Salvando..." : "Gerar Proposta"}
            </Button>
          </div>
        </form>
      </SlideOver>
    </>
  );
}
