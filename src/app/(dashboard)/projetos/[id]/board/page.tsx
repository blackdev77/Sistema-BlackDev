import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { BoardColumns } from "./BoardColumns";
import { MilestoneSidebar } from "./MilestoneSidebar";

export const dynamic = "force-dynamic";

export default async function ProjectBoardPage({ params }: { params: { id: string } }) {
  
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      tasks: {
        orderBy: { createdAt: "desc" }
      },
      milestones: {
        orderBy: { dueDate: "asc" }
      }
    }
  });

  if (!project) redirect("/projetos");

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col space-y-6 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-2">
          <Link href="/projetos" className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-white transition-colors">
            <ChevronLeft className="w-3 h-3" />
            VOLTAR PARA PROJETOS
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-serif font-bold text-white tracking-tight">{project.name}</h1>
            <Badge variant="success">{project.status}</Badge>
            <span className="text-sm text-muted-foreground">Cliente: {project.client.tradeName}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Kanban Board Area */}
        <div className="flex-1 overflow-x-auto pb-4">
          <BoardColumns projectId={project.id} tasks={project.tasks} />
        </div>

        {/* Milestones Area */}
        <div className="w-[300px] shrink-0 border-l border-border/50 pl-6 flex flex-col h-full overflow-y-auto">
          <MilestoneSidebar projectId={project.id} milestones={project.milestones} />
        </div>
      </div>

    </div>
  );
}
