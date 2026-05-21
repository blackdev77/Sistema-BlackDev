"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // In a real app, this should be sent to Sentry/Datadog
    console.error("Global Error Caught:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full border-destructive/50">
        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-foreground">Algo deu errado!</h2>
            <p className="text-sm text-muted-foreground">
              Ocorreu um erro inesperado ao carregar esta página. Nossa equipe já foi notificada.
            </p>
          </div>
          <Button onClick={() => reset()} variant="outline" className="w-full">
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
