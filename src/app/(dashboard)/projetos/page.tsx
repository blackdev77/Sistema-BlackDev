import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { Briefcase, Plus, Search, Filter, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Pagination } from "@/components/ui/Pagination";
import { ProjectFormSlideOver } from "./ProjectFormSlideOver";

export const dynamic = "force-dynamic";

export default async function ProjetosPage(props: { searchParams?: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const take = 12; // Grid of 3, so 12 items = 4 rows
  const skip = (page - 1) * take;

  const [projects, total, clients] = await Promise.all([
    prisma.project.findMany({
      skip,
      take,
      include: { 
        client: { select: { tradeName: true } },
        tasks: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.project.count(),
    prisma.client.findMany({
      select: { id: true, tradeName: true },
      where: { status: 'ACTIVE' },
      orderBy: { tradeName: 'asc' }
    })
  ]);

  const displayProjects = projects.map(p => {
    const tasksCount = p.tasks.length;
    const tasksDone = p.tasks.filter(t => t.status === "DONE").length;
    const progress = tasksCount === 0 ? 0 : Math.round((tasksDone / tasksCount) * 100);
    
    return {
      ...p,
      tasksCount,
      tasksDone,
      progress
    }
  });

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
          <ProjectFormSlideOver clients={clients} />
        </div>
      </div>

      {displayProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border/50 bg-surface/20 rounded-lg text-center space-y-4">
          <Briefcase className="w-12 h-12 text-muted-foreground/60" />
          <div>
            <h3 className="text-lg font-medium text-white">Nenhum projeto encontrado</h3>
            <p className="text-sm text-muted-foreground mt-1">Crie o seu primeiro projeto para começar a gerenciar sua operação técnica.</p>
          </div>
          <ProjectFormSlideOver clients={clients} />
        </div>
      ) : (
        <>
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

          <div className="bg-surface/50 rounded p-2">
             <Pagination total={total} take={take} />
          </div>
        </>
      )}

    </div>
  );
}
