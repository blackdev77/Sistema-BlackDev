"use client";

import { useTransition } from "react";
import { approveDevice, rejectDevice } from "@/app/actions/security";
import { Button } from "@/components/ui/Button";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function DeviceApprovalClient({ requestId, deviceId }: { requestId: string, deviceId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const res = await approveDevice(requestId, deviceId);
      if (res.success) {
        toast.success("Dispositivo aprovado com sucesso.", {
          description: "O parceiro já pode acessar o sistema."
        });
      } else {
        toast.error("Erro na aprovação", { description: res.error });
      }
    });
  };

  const handleReject = () => {
    const reason = prompt("Justificativa para recusa (Opcional):") || "Recusado pelo administrador";
    
    startTransition(async () => {
      const res = await rejectDevice(requestId, deviceId, reason);
      if (res.success) {
        toast.success("Acesso bloqueado.", {
          description: "O dispositivo foi permanentemente rejeitado."
        });
      } else {
        toast.error("Erro ao bloquear", { description: res.error });
      }
    });
  };

  return (
    <div className="flex gap-3">
      <Button 
        variant="outline" 
        className="border-red-500/50 text-red-400 hover:bg-red-500/10" 
        onClick={handleReject}
        disabled={isPending}
      >
        <XCircle className="w-4 h-4 mr-2" />
        Bloquear
      </Button>
      <Button 
        variant="primary" 
        className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500" 
        onClick={handleApprove}
        disabled={isPending}
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Autorizar Acesso
      </Button>
    </div>
  );
}
