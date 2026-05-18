"use client";

import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ContractDownload({ contractTitle }: { contractTitle: string }) {
  const handleDownload = () => {
    toast.success(`Download de "${contractTitle}" iniciado!`);
    
    // Simulate actual file download by generating a small text mock contract file
    const element = document.createElement("a");
    const file = new Blob([
      `==================================================\n`,
      `          CONTRATO DE PRESTAÇÃO DE SERVIÇOS       \n`,
      `==================================================\n\n`,
      `Documento: ${contractTitle}\n`,
      `Status: ASSINADO FORMALMENTE\n`,
      `Data de Simulação: ${new Date().toLocaleDateString("pt-BR")}\n\n`,
      `Este é um documento de simulação gerado pelo BlackDev OS.\n`,
      `Para contratos oficiais e de produção, contate o comercial.\n`,
    ], { type: 'text/plain' });
    
    element.href = URL.createObjectURL(file);
    element.download = `${contractTitle.toLowerCase().replace(/\s+/g, "_")}_simulado.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleDownload}
      className="p-2 border border-border bg-surface hover:bg-border text-muted-foreground hover:text-white transition-all"
      title="Baixar Contrato Simulado"
    >
      <Download className="w-4 h-4" />
    </Button>
  );
}
