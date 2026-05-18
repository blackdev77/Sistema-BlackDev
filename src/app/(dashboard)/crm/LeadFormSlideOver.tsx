"use client";

import { useState } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { createLead } from "@/app/actions/lead";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const leadSchema = z.object({
  companyName: z.string().min(2, "Empresa é obrigatória"),
  contactName: z.string().min(2, "Nome do contato é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  city: z.string().optional(),
  potential: z.enum(["LOW", "MEDIUM", "HIGH"]),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"]),
  value: z.number().min(0),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export function LeadFormSlideOver() {
  const [isOpen, setIsOpen] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      potential: "MEDIUM",
      urgency: "MEDIUM",
      value: 0
    }
  });

  const onSubmit = async (data: LeadFormValues) => {
    // Convert data to FormData for Server Action compatibility
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const result = await createLead(formData);
    
    if (result.success) {
      toast.success("Lead criado com sucesso!");
      reset();
      setIsOpen(false);
    } else {
      toast.error(result.error || "Erro ao criar lead");
    }
  };

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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Empresa & Contato</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Nome da Empresa <span className="text-red-500">*</span></label>
              <input 
                {...register("companyName")}
                className={`w-full bg-surface border ${errors.companyName ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-white'} px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 transition-shadow`}
                placeholder="Ex: Acme Corp"
              />
              {errors.companyName && <p className="text-xs text-red-400">{errors.companyName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Ponto de Contato <span className="text-red-500">*</span></label>
              <input 
                {...register("contactName")}
                className={`w-full bg-surface border ${errors.contactName ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-white'} px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 transition-shadow`}
                placeholder="Ex: João (CEO)"
              />
              {errors.contactName && <p className="text-xs text-red-400">{errors.contactName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Email</label>
                <input 
                  type="email"
                  {...register("email")}
                  className={`w-full bg-surface border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-white'} px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 transition-shadow`}
                  placeholder="joao@acme.com"
                />
                {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Telefone</label>
                <input 
                  {...register("phone")}
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Cidade</label>
              <input 
                {...register("city")}
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
                type="number"
                min="0"
                step="100"
                {...register("value", { valueAsNumber: true })}
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="5000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Potencial</label>
                <select 
                  {...register("potential")}
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                >
                  <option value="LOW">Baixo</option>
                  <option value="MEDIUM">Médio</option>
                  <option value="HIGH">Alto</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Urgência</label>
                <select 
                  {...register("urgency")}
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
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
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Criar Lead"}
            </Button>
          </div>
        </form>
      </SlideOver>
    </>
  );
}
