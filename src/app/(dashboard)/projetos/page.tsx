import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { Briefcase, Plus, Search, Filter, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProjetosPage() {
  
  // Real data fetching
  const projects = await prisma.project.findMany({
    include: { client: { select: { tradeName: true } } },
    orderBy: { createdAt: 'desc' }
  });

  // MOCK fallback for UI demonstration if DB is empty
  const displayProjects = projects.length > 0 ? projects : [
    {
      id: '1',
      name: 'BlackDev OS (Internal)',
      client: { tradeName: 'BlackDev' },
      status: 'EXECUTION',
      progress: 65,
      tasksCount: 12,
      tasksDone: 8,
      dueDate: new Date('2026-06-15')
    },
    {
      id: '2',
      name: 'E-commerce App',
      client: { tradeName: 'Vanguard Retail' },
      status: 'PLANNING',
      progress: 10,
      tasksCount: 45,
      tasksDone: 4,
      dueDate: new Date('2026-08-01')
    },
    {
      id: '3',
      name: 'Landing Page Q3',
      client: { tradeName: 'TechCorp S/A' },
      status: 'REVIEW',
      progress: 95,
      tasksCount: 10,
      tasksDone: 9,
      dueDate: new Date('2026-05-20')
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-muted-foreground" />
            Operação & Projetos
          </h1>
          <p className="text-muted-foreground">Gestão de escopo, progresso e entregas técnicas.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar projeto..." 
              className="bg-surface border border-border text-sm pl-9 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-white transition-shadow text-white placeholder:text-muted-foreground"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Projeto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayProjects.map((project: any) => (
          <Card key={project.id} className="group hover:border-white/20 transition-colors flex flex-col h-full">
            <CardContent className="p-6 flex flex-col h-full gap-6">
              
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-serif font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {project.name}
                  </h3>
                  <span className="text-sm text-muted-foreground">{project.client?.tradeName}</span>
                </div>
                <Badge 
                  variant={
                    project.status === 'EXECUTION' ? 'success' : 
                    project.status === 'REVIEW' ? 'warning' : 
                    'default'
                  }
                >
                  {project.status}
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-2 mt-auto">
                <div className="flex justify-between text-xs font-mono text-muted uppercase tracking-wider">
                  <span>Progresso</span>
                  <span className="text-white">{project.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-border overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-1000" 
                    style={{ width: `${project.progress}%` }} 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{project.tasksDone || 0}/{project.tasksCount || 0} tasks</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{project.dueDate ? project.dueDate.toLocaleDateString('pt-BR') : 'Sem data'}</span>
                  </div>
                </div>
                
                <Link href={`/projetos/${project.id}/board`}>
                  <Button variant="ghost" size="sm" className="h-8 text-xs font-mono group/btn">
                    ABRIR BOARD
                    <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
