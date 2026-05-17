"use client";

import { useActionState } from "react";
import { portalLogin } from "@/app/actions/portal-auth";

export default function PortalLoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(portalLogin, undefined);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto">
            <span className="text-black font-serif font-bold text-2xl">B</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">
              BLACK<span className="font-serif italic font-normal">Dev</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Portal do Cliente</p>
          </div>
        </div>

        {/* Login Form */}
        <form action={dispatch} className="flex flex-col gap-5 bg-surface p-8 border border-border">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-muted uppercase tracking-wider" htmlFor="portal-email">
              Seu Email
            </label>
            <input
              id="portal-email"
              type="email"
              name="email"
              placeholder="voce@empresa.com"
              required
              className="bg-background border border-border text-sm px-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-white transition-shadow text-white placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-muted uppercase tracking-wider" htmlFor="portal-password">
              Senha de Acesso
            </label>
            <input
              id="portal-password"
              type="password"
              name="password"
              required
              className="bg-background border border-border text-sm px-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-white transition-shadow text-white placeholder:text-muted-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full bg-white text-black font-medium py-2.5 text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {isPending ? "Verificando..." : "Acessar Portal"}
          </button>

          {errorMessage && (
            <div className="text-sm text-red-400 font-mono text-center bg-red-950/30 p-2 border border-red-900/50">
              {errorMessage}
            </div>
          )}
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Acesso exclusivo para clientes da BlackDev.<br />
          Caso não possua credenciais, entre em contato com seu gerente de projeto.
        </p>
      </div>
    </div>
  );
}
