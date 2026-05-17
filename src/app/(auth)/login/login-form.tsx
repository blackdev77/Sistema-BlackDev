'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';

// Basic fingerprint generation for prototype
function generateFingerprint() {
  if (typeof window === 'undefined') return 'unknown';
  const data = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset()
  ].join('||');
  
  // Very simple hash for the string
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export default function LoginForm() {
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);
  const [fingerprint, setFingerprint] = useState('');
  const [userAgent, setUserAgent] = useState('');

  useEffect(() => {
    setFingerprint(generateFingerprint());
    setUserAgent(navigator.userAgent);
  }, []);

  return (
    <form action={dispatch} className="flex flex-col gap-4 bg-surface p-8 border border-border">
      <input type="hidden" name="fingerprint" value={fingerprint} />
      <input type="hidden" name="userAgent" value={userAgent} />
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-muted uppercase tracking-wider" htmlFor="email">
          Email Corporativo
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="nome@blackdev.com"
          required
          className="bg-background border border-border text-sm px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-white transition-shadow text-white placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-muted uppercase tracking-wider" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          type="password"
          name="password"
          required
          className="bg-background border border-border text-sm px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-white transition-shadow text-white placeholder:text-muted-foreground"
        />
      </div>

      <Button variant="primary" className="mt-4 w-full" disabled={isPending}>
        {isPending ? 'Autenticando...' : 'Entrar no Sistema'}
      </Button>

      {errorMessage && (
        <div className="mt-4 text-sm text-red-400 font-mono text-center bg-red-950/30 p-2 border border-red-900/50">
          {errorMessage}
        </div>
      )}
    </form>
  );
}
