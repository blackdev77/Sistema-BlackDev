import { getPortalSession } from "@/app/actions/portal-auth";
import { redirect } from "next/navigation";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if the user is authenticated for the portal
  const session = await getPortalSession();
  if (!session) redirect("/portal/login");

  return (
    <div className="min-h-screen bg-background">
      {/* Portal Header */}
      <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
              <span className="text-black font-serif font-bold text-xs">B</span>
            </div>
            <span className="font-bold text-white tracking-wide text-sm">
              BLACK<span className="font-serif italic font-normal">Dev</span>
              <span className="text-muted-foreground ml-2 font-mono text-xs">Portal</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-white font-medium">{session.contactName}</p>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{session.clientName}</p>
            </div>
            <form action={async () => {
              "use server";
              const { portalLogout } = await import("@/app/actions/portal-auth");
              await portalLogout();
            }}>
              <button
                type="submit"
                className="text-xs font-mono text-muted-foreground hover:text-white transition-colors border border-border px-3 py-1.5 hover:border-white/30"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Portal Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
