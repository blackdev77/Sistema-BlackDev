const fs = require('fs');
const path = require('path');

const routes = [
  { path: 'clientes', title: 'Clientes' },
  { path: 'propostas', title: 'Propostas' },
  { path: 'contratos', title: 'Contratos' },
  { path: 'tarefas', title: 'Tarefas & Backlog' },
  { path: 'docs', title: 'Documentação' },
  { path: 'faturas', title: 'Faturas' },
  { path: 'despesas', title: 'Despesas' },
  { path: 'assinaturas', title: 'Assinaturas' },
  { path: 'suporte', title: 'Suporte & Tickets' },
  { path: 'configuracoes', title: 'Configurações Globais' },
  { path: 'admin/users', title: 'Gestão de Equipe' },
  { path: 'admin/settings', title: 'Configurações de Sistema' }
];

const basePath = path.join(__dirname, 'src', 'app', '(dashboard)');

routes.forEach(route => {
  const dirPath = path.join(basePath, route.path);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const filePath = path.join(dirPath, 'page.tsx');
  
  const content = `import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] animate-in fade-in duration-500">
      <div className="flex flex-col items-center text-center max-w-md gap-4">
        <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mb-4">
          <span className="text-2xl">🚧</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-white tracking-tight">${route.title}</h1>
        <p className="text-muted-foreground text-sm">
          Este módulo está planejado para o próximo ciclo de desenvolvimento (Release 2.0). 
          A arquitetura de banco de dados já está preparada.
        </p>
        <Link href="/" className="mt-4">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}`;

  fs.writeFileSync(filePath, content);
});

console.log('Placeholder pages generated successfully.');
