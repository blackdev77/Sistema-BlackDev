"use client";

import { useState } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { createProposal } from "@/app/actions/proposal";
import { toast } from "sonner";

export function ProposalFormSlideOver({ leads }: { leads: { id: string, companyName: string }[] }) {
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
        description="Gere um escopo e orçamento baseado em um Lead existente."
      >
        <form action={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Título da Proposta <span className="text-red-500">*</span></label>
              <input 
                name="title"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: Desenvolvimento E-commerce"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Vincular a Lead (Opcional)</label>
              <select 
                name="leadId"
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
              >
                <option value="">Selecione um Lead...</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id}>{lead.companyName}</option>
                ))}
              </select>
            </div>

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

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Condições de Pagamento <span className="text-red-500">*</span></label>
              <textarea 
                name="paymentTerms"
                required
                rows={4}
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: 50% de sinal e 50% na entrega."
              />
            </div>

          </div>

          <div className="pt-6 border-t border-border/50 flex justify-end gap-3 mt-auto">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Criando..." : "Gerar Proposta"}
            </Button>
          </div>
        </form>
      </SlideOver>
    </>
  );
}
