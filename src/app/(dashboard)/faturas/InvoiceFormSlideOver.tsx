"use client";

import { useState } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { createInvoice } from "@/app/actions/invoice";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface ClientOption {
  id: string;
  tradeName: string;
}

interface InvoiceFormSlideOverProps {
  clients: ClientOption[];
}

const invoiceSchema = z.object({
  clientId: z.string().uuid("Selecione um cliente válido"),
  description: z.string().min(2, "Descrição é obrigatória"),
  amount: z.number().min(0.01, "O valor deve ser maior que zero"),
  dueDate: z.string().min(1, "A data de vencimento é obrigatória"),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export function InvoiceFormSlideOver({ clients }: InvoiceFormSlideOverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
  });

  const onSubmit = async (data: InvoiceFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const result = await createInvoice(formData);
    
    if (result.success) {
      toast.success("Fatura criada com sucesso!");
      reset();
      setIsOpen(false);
    } else {
      toast.error(result.error || "Erro ao criar fatura");
    }
  };

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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Cliente <span className="text-red-500">*</span></label>
              <select 
                {...register("clientId")}
                className={`w-full bg-surface border ${errors.clientId ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-white'} px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 transition-shadow`}
              >
                <option value="">Selecione o cliente...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.tradeName}</option>
                ))}
              </select>
              {errors.clientId && <p className="text-xs text-red-400">{errors.clientId.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Descrição do Serviço <span className="text-red-500">*</span></label>
              <input 
                {...register("description")}
                className={`w-full bg-surface border ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-white'} px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 transition-shadow`}
                placeholder="Ex: Consultoria UX - Parcela 1/3"
              />
              {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Valor (R$) <span className="text-red-500">*</span></label>
                <input 
                  type="number"
                  step="0.01"
                  {...register("amount", { valueAsNumber: true })}
                  className={`w-full bg-surface border ${errors.amount ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-white'} px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 transition-shadow`}
                  placeholder="0.00"
                />
                {errors.amount && <p className="text-xs text-red-400">{errors.amount.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Vencimento <span className="text-red-500">*</span></label>
                <input 
                  type="date"
                  {...register("dueDate")}
                  className={`w-full bg-surface border ${errors.dueDate ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-white'} px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 transition-shadow`}
                />
                {errors.dueDate && <p className="text-xs text-red-400">{errors.dueDate.message}</p>}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50 flex justify-end gap-3 mt-auto">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Emitir Fatura"}
            </Button>
          </div>
        </form>
      </SlideOver>
    </>
  );
}
