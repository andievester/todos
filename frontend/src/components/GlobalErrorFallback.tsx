import { Button } from "@/components/ui/button";
import { type FallbackProps } from "react-error-boundary";

export function GlobalErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-4 text-center">
      <h2 className="text-2xl font-bold text-red mb-4">
        Whoops! Something went wrong.
      </h2>
      <p className="mb-6 max-w-md">
        We hit an unexpected error. You can try reloading the page to fix the
        issue.
      </p>

      {import.meta.env.DEV && (
        <pre className="bg-input p-4 rounded-xl text-sm text-left w-full max-w-lg overflow-auto mb-6">
          {errorMessage}
        </pre>
      )}

      <Button className="btn-surface btn-lg" onClick={resetErrorBoundary}>
        Try Again
      </Button>
    </div>
  );
}
