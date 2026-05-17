"use client";

import { useState } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { createExpense } from "@/app/actions/expense";
import { toast } from "sonner";

export function ExpenseFormSlideOver() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await createExpense(formData);
    
    if (result.success) {
      toast.success("Despesa cadastrada com sucesso!");
      setIsOpen(false);
    } else {
      toast.error(result.error || "Erro ao cadastrar despesa");
    }
    setIsPending(false);
  }

  return (
    <>
      <Button variant="primary" className="gap-2" onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4" />
        Nova Despesa
      </Button>

      <SlideOver 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Nova Despesa" 
        description="Registre um novo custo operacional, imposto ou pagamento."
      >
        <form action={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Descrição <span className="text-red-500">*</span></label>
              <input 
                name="description"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: Licença Vercel Pro"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Categoria <span className="text-red-500">*</span></label>
              <select 
                name="category"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
              >
                <option value="OPERACIONAL">Operacional</option>
                <option value="INFRAESTRUTURA">Infraestrutura / Software</option>
                <option value="IMPOSTO">Impostos / Taxas</option>
                <option value="FOLHA">Folha / Pró-labore</option>
                <option value="MARKETING">Marketing / Vendas</option>
              </select>
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
              {isPending ? "Salvando..." : "Registrar Despesa"}
            </Button>
          </div>
        </form>
      </SlideOver>
    </>
  );
}
