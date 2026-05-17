"use client";

import { useState } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { createLead } from "@/app/actions/lead";
import { toast } from "sonner";

export function LeadFormSlideOver() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await createLead(formData);
    
    if (result.success) {
      toast.success("Lead criado com sucesso!");
      setIsOpen(false);
    } else {
      toast.error(result.error || "Erro ao criar lead");
    }
    setIsPending(false);
  }

  return (
    <>
      <Button variant="primary" className="gap-2" onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4" />
        Novo Lead
      </Button>

      <SlideOver 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Novo Lead" 
        description="Adicione uma nova oportunidade de negócio ao pipeline."
      >
        <form action={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Empresa & Contato</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Nome da Empresa <span className="text-red-500">*</span></label>
              <input 
                name="companyName"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: Acme Corp"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Ponto de Contato <span className="text-red-500">*</span></label>
              <input 
                name="contactName"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: João (CEO)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Email</label>
                <input 
                  name="email"
                  type="email"
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                  placeholder="joao@acme.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Telefone</label>
                <input 
                  name="phone"
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Cidade</label>
              <input 
                name="city"
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: São Paulo, SP"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/50">
            <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Negociação</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Valor Estimado (R$)</label>
              <input 
                name="value"
                type="number"
                min="0"
                step="100"
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="5000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Potencial</label>
                <select 
                  name="potential"
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                  defaultValue="MEDIUM"
                >
                  <option value="LOW">Baixo</option>
                  <option value="MEDIUM">Médio</option>
                  <option value="HIGH">Alto</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Urgência</label>
                <select 
                  name="urgency"
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                  defaultValue="MEDIUM"
                >
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50 flex justify-end gap-3 mt-auto">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Salvando..." : "Criar Lead"}
            </Button>
          </div>
        </form>
      </SlideOver>
    </>
  );
}
