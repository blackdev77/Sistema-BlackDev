"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Receipt } from "lucide-react";
import { InvoiceDetailsModal } from "./InvoiceDetailsModal";

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

interface InvoiceListTableProps {
  invoices: Invoice[];
}

export function InvoiceListTable({ invoices }: InvoiceListTableProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  return (
    <>
      <div className="w-full overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] font-mono text-muted uppercase tracking-wider border-b border-border bg-surface/50">
            <tr>
              <th className="px-6 py-4 font-normal">Descrição</th>
              <th className="px-6 py-4 font-normal">Cliente</th>
              <th className="px-6 py-4 font-normal">Valor</th>
              <th className="px-6 py-4 font-normal">Vencimento</th>
              <th className="px-6 py-4 font-normal text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4">
                  <EmptyState 
                    icon={Receipt} 
                    title="Nenhuma fatura lançada" 
                    description="Seu controle financeiro está limpo. Crie uma nova fatura para começar a acompanhar seus recebimentos." 
                  />
                </td>
              </tr>
            ) : invoices.map((invoice) => (
              <tr 
                key={invoice.id} 
                onClick={() => setSelectedInvoice(invoice)}
                className="hover:bg-surface/80 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 font-medium text-white group-hover:text-blue-400 transition-colors">
                  {invoice.description}
                </td>
                <td className="px-6 py-4 text-muted-foreground">{invoice.client?.tradeName}</td>
                <td className="px-6 py-4 font-mono text-xs text-white">
                  R$ {invoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                  {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-right">
                  <Badge variant={invoice.status === 'PAID' ? 'success' : invoice.status === 'OVERDUE' ? 'destructive' : 'warning'}>
                    {invoice.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedInvoice && (
        <InvoiceDetailsModal 
          invoice={selectedInvoice}
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </>
  );
}
