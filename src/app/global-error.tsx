"use client";

import { Button } from "@/components/ui/button";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error }: GlobalErrorProps) {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="text-2xl font-semibold">Algo salió mal :(</h1>

          <p className="text-sm text-muted-foreground max-w-md">
            Ocurrió un error inesperado. Vuelve a intentarlo en unos momentos.
          </p>

          {error.digest && (
            <p className="text-xs text-muted-foreground">
              Código: {error.digest}
            </p>
          )}

          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </body>
    </html>
  );
}