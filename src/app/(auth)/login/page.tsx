import LoginForm from './login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">BlackDev</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-mono">Sistema Operacional</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}
