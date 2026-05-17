"use client";

import { useState } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { createInvoice } from "@/app/actions/invoice";
import { toast } from "sonner";

interface ClientOption {
  id: string;
  tradeName: string;
}

interface InvoiceFormSlideOverProps {
  clients: ClientOption[];
}

export function InvoiceFormSlideOver({ clients }: InvoiceFormSlideOverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await createInvoice(formData);
    
    if (result.success) {
      toast.success("Fatura criada com sucesso!");
      setIsOpen(false);
    } else {
      toast.error(result.error || "Erro ao criar fatura");
    }
    setIsPending(false);
  }

  return (
    <>
      <Button variant="primary" className="gap-2" onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4" />
        Nova Fatura
      </Button>

      <SlideOver 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Nova Fatura" 
        description="Emita uma nova cobrança para um cliente cadastrado."
      >
        <form action={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Cliente <span className="text-red-500">*</span></label>
              <select 
                name="clientId"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
              >
                <option value="">Selecione o cliente...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.tradeName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Descrição do Serviço <span className="text-red-500">*</span></label>
              <input 
                name="description"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: Consultoria UX - Parcela 1/3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Valor (R$) <span className="text-red-500">*</span></label>
                <input 
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Vencimento <span className="text-red-500">*</span></label>
                <input 
                  name="dueDate"
                  type="date"
                  required
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50 flex justify-end gap-3 mt-auto">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Salvando..." : "Emitir Fatura"}
            </Button>
          </div>
        </form>
      </SlideOver>
    </>
  );
}
