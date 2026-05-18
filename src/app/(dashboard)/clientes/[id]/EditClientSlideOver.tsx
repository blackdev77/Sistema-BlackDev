"use client";

import { useState } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Edit2, UploadCloud, Building2, Trash2 } from "lucide-react";
import { updateClient } from "@/app/actions/client";
import { toast } from "sonner";

interface ClientData {
  id: string;
  legalName: string;
  tradeName: string;
  document: string | null;
  address: string | null;
  logoUrl: string | null;
  status: string;
  tier: string;
}

interface EditClientSlideOverProps {
  client: ClientData;
}

export function EditClientSlideOver({ client }: EditClientSlideOverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string | null>(client.logoUrl);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("O arquivo deve ser menor que 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setLogoBase64(base64String);
      toast.success("Logo carregada com sucesso!");
    };
    reader.readAsDataURL(file);
  };

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    
    // Add the logo base64 if it has changed/exists
    if (logoBase64) {
      formData.set("logoUrl", logoBase64);
    } else {
      formData.set("logoUrl", "");
    }

    const result = await updateClient(client.id, formData);
    
    if (result.success) {
      toast.success("Cliente atualizado com sucesso!");
      setIsOpen(false);
    } else {
      toast.error(result.error || "Erro ao atualizar cliente");
    }
    setIsPending(false);
  }

  return (
    <>
      <Button variant="outline" className="gap-2" onClick={() => setIsOpen(true)}>
        <Edit2 className="w-4 h-4" />
        Editar Cliente
      </Button>

      <SlideOver 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Editar Dados do Cliente" 
        description="Atualize as informações comerciais, classificação e identidade visual da conta."
      >
        <form action={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-4">
            
            {/* Logo Upload Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white block">Logotipo da Empresa</label>
              <div className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-surface/30">
                <div className="w-16 h-16 rounded-md bg-white border border-border flex items-center justify-center shrink-0 overflow-hidden relative group">
                  {logoBase64 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={logoBase64} 
                      alt="Logo preview" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-black/40" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded bg-surface border border-border hover:border-white/20 text-xs text-white font-mono transition-colors">
                      <UploadCloud className="w-3.5 h-3.5" />
                      Enviar Logo
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleLogoUpload}
                      />
                    </label>
                    {logoBase64 && (
                      <button
                        type="button"
                        onClick={() => setLogoBase64(null)}
                        className="p-1.5 rounded bg-rose-950/20 border border-rose-900/40 text-rose-400 hover:bg-rose-900/40 hover:text-rose-300 transition-colors"
                        title="Remover Logo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">Suporta PNG, JPG, SVG. Máx. 2MB. Convertido e armazenado diretamente no banco de dados.</p>
                </div>
              </div>
            </div>

            {/* General Info */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Nome Fantasia <span className="text-red-500">*</span></label>
              <input 
                name="tradeName"
                defaultValue={client.tradeName}
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: BlackDev"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Razão Social <span className="text-red-500">*</span></label>
              <input 
                name="legalName"
                defaultValue={client.legalName}
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                placeholder="Ex: BlackDev Tecnologia LTDA"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">CNPJ</label>
                <input 
                  name="document"
                  defaultValue={client.document || ""}
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                  placeholder="00.000.000/0001-00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Classificação (Tier)</label>
                <select 
                  name="tier"
                  defaultValue={client.tier}
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                >
                  <option value="STANDARD">Standard</option>
                  <option value="VIP">VIP</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Status da Conta</label>
                <select 
                  name="status"
                  defaultValue={client.status}
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                >
                  <option value="ACTIVE">Ativo</option>
                  <option value="INACTIVE">Inativo</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Endereço Comercial</label>
                <input 
                  name="address"
                  defaultValue={client.address || ""}
                  className="w-full bg-surface border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
                  placeholder="Cidade, Estado ou endereço completo"
                />
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-border/50 flex justify-end gap-3 mt-auto">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </SlideOver>
    </>
  );
}
