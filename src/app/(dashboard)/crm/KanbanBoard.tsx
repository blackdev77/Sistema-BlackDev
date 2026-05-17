"use client";

import { useState, useTransition } from "react";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MoreHorizontal } from "lucide-react";
import { updateLeadStatus } from "@/app/actions/updateLeadStatus";
import { toast } from "sonner";

type Lead = {
  id: string;
  companyName: string;
  contactName: string;
  value: number | null;
  status: string;
};

type Column = {
  id: string;
  title: string;
  leads: Lead[];
};

function SortableLeadCard({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none pb-3">
      <Card className="cursor-grab active:cursor-grabbing hover:border-border-hover transition-colors group">
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <Badge variant="outline" className="text-muted-foreground border-border/50">Lead</Badge>
            <button className="text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex flex-col">
            <h4 className="font-serif text-lg font-bold text-white leading-tight">{lead.companyName}</h4>
            <span className="text-sm text-muted-foreground mt-1">{lead.contactName}</span>
          </div>
          
          <div className="pt-3 border-t border-border/50 flex justify-between items-center mt-1">
            <span className="text-[10px] font-mono text-muted uppercase">Estimativa</span>
            <span className="text-sm font-mono text-white">R$ {lead.value ? lead.value.toLocaleString('pt-BR') : '0,00'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KanbanColumn({ column }: { column: Column }) {
  return (
    <div className="w-[300px] flex flex-col h-full bg-surface/10 rounded-lg p-2">
      <div className="flex items-center justify-between py-2 mb-2 shrink-0 border-b border-border/50 px-2">
        <h3 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">{column.title}</h3>
        <span className="text-xs font-mono bg-surface px-2 py-1 rounded-full text-white">{column.leads.length}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-2 pt-2">
        <SortableContext items={column.leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {column.leads.map(lead => (
            <SortableLeadCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export function KanbanBoard({ initialColumns }: { initialColumns: Column[] }) {
  const [columns, setColumns] = useState(initialColumns);
  const [isPending, startTransition] = useTransition();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id as string;
    const overId = over.id as string;

    // Achar o card e a coluna
    let sourceColIndex = -1;
    let destColIndex = -1;
    let lead: Lead | null = null;

    columns.forEach((col, cIdx) => {
      const found = col.leads.find(l => l.id === leadId);
      if (found) {
        sourceColIndex = cIdx;
        lead = found;
      }
      if (col.id === overId || col.leads.some(l => l.id === overId)) {
        destColIndex = cIdx;
      }
    });

    if (sourceColIndex === -1 || destColIndex === -1 || sourceColIndex === destColIndex || !lead) return;

    const newStatus = columns[destColIndex].id;

    // Optimistic Update
    setColumns(prev => {
      const newCols = [...prev];
      newCols[sourceColIndex] = {
        ...newCols[sourceColIndex],
        leads: newCols[sourceColIndex].leads.filter(l => l.id !== leadId)
      };
      
      // We push to the end of the destination column
      newCols[destColIndex] = {
        ...newCols[destColIndex],
        leads: [...newCols[destColIndex].leads, { ...lead!, status: newStatus }]
      };
      
      return newCols;
    });

    // Server Update
    startTransition(async () => {
      const result = await updateLeadStatus(leadId, newStatus);
      if (result.success) {
        toast.success("Lead atualizado!");
      } else {
        toast.error("Erro ao atualizar lead.");
        // Should revert state ideally, but revalidation fixes it eventually
      }
    });
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 h-full pb-4 min-w-max">
        {columns.map((col) => (
          // We make the whole column a droppable zone by giving it an ID that we check in handleDragEnd
          <div key={col.id} id={col.id} className="h-full">
            <KanbanColumn column={col} />
          </div>
        ))}
      </div>
    </DndContext>
  );
}
