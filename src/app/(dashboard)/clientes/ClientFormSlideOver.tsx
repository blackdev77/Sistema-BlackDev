"use client";

import { useState } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { createClient } from "@/app/actions/client";
import { toast } from "sonner";

export function ClientFormSlideOver() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await createClient(formData);
    
    if (result.success) {
      toast.success("Cliente criado com sucesso!");
      setIsOpen(false);
    } else {
      toast.error(result.error || "Erro ao criar cliente");
    }
    setIsPending(false);
  }

  return (
    <>
      <Button variant="primary" className="gap-2" onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4" />
        Novo Cliente
      </Button>

      <SlideOver 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Novo Cliente" 
        description="Cadastre uma nova empresa e seu contato principal no sistema."
      >
        <form action={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Dados da Empresa</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Nome Fantasia <span className="text-red-500">*</span></label>
              <input 
                name="tradeName"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: BlackDev"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Razão Social <span className="text-red-500">*</span></label>
              <input 
                name="legalName"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: BlackDev Tecnologia LTDA"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">CNPJ</label>
              <input 
                name="document"
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="00.000.000/0001-00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Classificação (Tier)</label>
              <select 
                name="tier"
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                defaultValue="STANDARD"
              >
                <option value="STANDARD">Standard</option>
                <option value="VIP">VIP</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/50">
            <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Contato Principal</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Nome do Contato <span className="text-red-500">*</span></label>
              <input 
                name="contactName"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: João Silva"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Email</label>
              <input 
                name="contactEmail"
                type="email"
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="joao@empresa.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Telefone / WhatsApp</label>
              <input 
                name="contactPhone"
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-border/50 flex justify-end gap-3 mt-auto">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Salvando..." : "Criar Cliente"}
            </Button>
          </div>
        </form>
      </SlideOver>
    </>
  );
}
