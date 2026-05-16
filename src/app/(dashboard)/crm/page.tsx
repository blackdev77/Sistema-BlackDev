import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Plus, Filter, Search, MoreHorizontal } from "lucide-react"

// Mock data based on the CSV structure
const initialColumns = [
  {
    id: "novo",
    title: "Novo",
    leads: [
      { id: "1", company: "Clínica Vida Saúde", sector: "Saúde", contact: "Dr. Marcos", value: "R$ 15k" },
      { id: "2", company: "Advocacia Silva", sector: "Jurídico", contact: "Dra. Ana", value: "R$ 25k" },
    ]
  },
  {
    id: "contactado",
    title: "Contactado",
    leads: [
      { id: "3", company: "Construtora Apex", sector: "Engenharia", contact: "Carlos", value: "R$ 45k" },
    ]
  },
  {
    id: "reuniao",
    title: "Reunião",
    leads: [
      { id: "4", company: "Tech Solutions", sector: "TI", contact: "Fernanda", value: "R$ 80k" },
    ]
  },
  {
    id: "proposta",
    title: "Proposta",
    leads: [
      { id: "5", company: "Escola Aprender", sector: "Educação", contact: "Juliana", value: "R$ 12k" },
      { id: "6", company: "Logística Expresso", sector: "Transporte", contact: "Roberto", value: "R$ 35k" },
    ]
  },
  {
    id: "negociacao",
    title: "Negociação",
    leads: []
  },
  {
    id: "fechado",
    title: "Fechado",
    leads: [
      { id: "7", company: "Clínica Dental Sorriso", sector: "Saúde", contact: "Dr. João", value: "R$ 15k" },
    ]
  }
];

export default function CRMPage() {
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">Pipeline Comercial</h1>
          <p className="text-muted-foreground">Gestão de leads e oportunidades de negócio.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar lead..." 
              className="bg-surface border border-border text-sm pl-9 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-white transition-shadow text-white placeholder:text-muted-foreground"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 h-full pb-4 min-w-max">
          
          {initialColumns.map((column) => (
            <div key={column.id} className="w-[300px] flex flex-col h-full">
              {/* Column Header */}
              <div className="flex items-center justify-between py-3 mb-2 shrink-0 border-b border-border/50">
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{column.title}</h3>
                <span className="text-[10px] font-mono bg-surface border border-border px-2 py-0.5 text-muted-foreground">
                  {column.leads.length}
                </span>
              </div>
              
              {/* Drop Zone / Cards Container */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 custom-scrollbar">
                {column.leads.map((lead) => (
                  <Card key={lead.id} className="cursor-grab hover:border-border-hover transition-colors group">
                    <CardContent className="p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="text-muted-foreground border-border/50">{lead.sector}</Badge>
                        <button className="text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex flex-col">
                        <h4 className="font-serif text-lg font-bold text-white leading-tight">{lead.company}</h4>
                        <span className="text-sm text-muted-foreground mt-1">{lead.contact}</span>
                      </div>
                      
                      <div className="pt-3 border-t border-border/50 flex justify-between items-center mt-1">
                        <span className="text-[10px] font-mono text-muted uppercase">Estimativa</span>
                        <span className="text-sm font-mono text-white">{lead.value}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Empty Drop Zone Visual Indicator (optional) */}
                {column.leads.length === 0 && (
                  <div className="h-24 border border-dashed border-border/50 rounded-sm flex items-center justify-center">
                    <span className="text-[10px] font-mono text-muted uppercase">Solte aqui</span>
                  </div>
                )}
              </div>
            </div>
          ))}

        </div>
      </div>
      
    </div>
  )
}
