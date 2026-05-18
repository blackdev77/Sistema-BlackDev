"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, Receipt, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { markInvoiceAsPaid, deleteInvoice } from "@/app/actions/invoice";
import { toast } from "sonner";

interface Payment {
  id: string;
  amount: number;
  method: string;
  paidAt: Date | string;
}

interface Invoice {
  id: string;
  description: string;
  amount: number;
  status: string;
  dueDate: Date | string;
  paidAt: Date | string | null;
  client: {
    tradeName: string;
  };
  payments?: Payment[];
}

interface InvoiceDetailsModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceDetailsModal({ invoice, isOpen, onClose }: InvoiceDetailsModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  async function handleMarkAsPaid() {
    setIsPending(true);
    const result = await markInvoiceAsPaid(invoice.id, "PIX");
    if (result.success) {
      toast.success("Fatura liquidada com sucesso!");
      onClose();
    } else {
      toast.error(result.error || "Erro ao liquidar fatura");
    }
    setIsPending(false);
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir esta fatura?")) return;
    setIsDeleting(true);
    const result = await deleteInvoice(invoice.id);
    if (result.success) {
      toast.success("Fatura excluída com sucesso!");
      onClose();
    } else {
      toast.error(result.error || "Erro ao excluir fatura");
    }
    setIsDeleting(false);
  }

  const formattedDueDate = new Date(invoice.dueDate).toLocaleDateString('pt-BR');
  const formattedPaidAt = invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString('pt-BR') : null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Centered Modal */}
      <div 
        className={`fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-background border border-border shadow-2xl transition-all duration-300 flex flex-col p-6 rounded-lg ${
          isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-start justify-between pb-4 border-b border-border/50">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-muted-foreground" />
              Detalhamento de Fatura
            </h2>
            <p className="text-sm text-muted-foreground">Vencimento em {formattedDueDate}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-white hover:bg-surface rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-6 pt-6">
          {/* Main Info */}
          <div className="bg-surface/50 border border-border/50 p-4 rounded-lg flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-muted uppercase tracking-wider">Valor da Fatura</span>
              <div className="text-2xl font-mono font-bold text-white">
                R$ {invoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <Badge variant={invoice.status === 'PAID' ? 'success' : invoice.status === 'OVERDUE' ? 'destructive' : 'warning'}>
              {invoice.status === 'PAID' ? 'Liquidada' : invoice.status === 'OVERDUE' ? 'Atrasada' : 'Pendente'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-muted uppercase">Descrição</span>
              <p className="text-sm font-medium text-white">{invoice.description}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono text-muted uppercase">Cliente</span>
              <p className="text-sm font-medium text-white">{invoice.client?.tradeName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-muted uppercase">Data de Emissão</span>
              <p className="text-sm text-white">{formattedDueDate}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono text-muted uppercase">Data de Liquidação</span>
              <p className="text-sm text-white">{formattedPaidAt || "--"}</p>
            </div>
          </div>

          {/* Payments Section */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            <h3 className="text-xs font-mono text-muted uppercase tracking-wider">Histórico de Transações</h3>
            
            {invoice.payments && invoice.payments.length > 0 ? (
              <div className="space-y-2">
                {invoice.payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center bg-surface/30 p-2 border border-border/30 rounded text-xs">
                    <span className="text-white font-mono">{payment.method}</span>
                    <div className="flex gap-4 items-center">
                      <span className="text-muted-foreground">{new Date(payment.paidAt).toLocaleDateString('pt-BR')}</span>
                      <span className="text-emerald-400 font-mono">R$ {payment.amount.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground italic">Nenhum pagamento registrado para esta fatura.</div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="pt-6 border-t border-border/50 flex justify-between gap-3 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            className="gap-2 text-red-400 border-red-950/50 hover:bg-red-950/20"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
            Excluir Fatura
          </Button>

          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Fechar</Button>
            {invoice.status !== "PAID" && (
              <Button 
                type="button" 
                variant="primary" 
                className="gap-2 bg-emerald-600 hover:bg-emerald-500 border-none"
                onClick={handleMarkAsPaid}
                disabled={isPending}
              >
                <CheckCircle className="w-4 h-4" />
                Liquidado (Marcar como Pago)
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
