"use client";

import { Button } from "@/components/ui/button";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">Algo salió mal :(</h1>
      <p className="text-sm text-muted-foreground max-w-md">
        Ocurrió un error al procesar tu solicitud. Vuelve a intentarlo en unos
        momentos.
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground">Código: {error.digest}</p>
      )}
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
