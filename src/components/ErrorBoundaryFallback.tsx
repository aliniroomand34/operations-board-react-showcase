import React from "react";
import { FaExclamationTriangle, FaRedo, FaHome, FaArrowRight } from "react-icons/fa";

interface ErrorDetailsPanelProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
}

function ErrorDetailsPanel({ error, errorInfo, showDetails }: ErrorDetailsPanelProps) {
  if (!showDetails || !(error?.stack || errorInfo?.componentStack)) {
    return null;
  }

  return (
    <details className="w-full rounded-xl border border-[var(--border-muted)]/40 bg-black/40 text-left">
      <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-[var(--fg-subtle)] select-none">
        Technical details (development)
      </summary>
      <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words px-3 pb-3 text-left text-xs leading-relaxed text-[var(--gray-800)] [direction:ltr]">
        {[error?.stack, errorInfo?.componentStack].filter(Boolean).join("\n\n")}
      </pre>
    </details>
  );
}

export interface ErrorBoundaryFallbackProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  onRetry: () => void;
  showDetails?: boolean;
  variant?: "fullscreen" | "embedded";
  pageTitle?: string;
  homeHref?: string;
  homeLabel?: string;
}

/**
 * Presentational fallback for ErrorBoundary.
 * Encapsulates alert copy, actions, and optional tech details — not catch/retry state.
 */
export function ErrorBoundaryFallback({
  error,
  errorInfo,
  onRetry,
  showDetails,
  variant = "fullscreen",
  pageTitle,
  homeHref = "/",
  homeLabel = "Home",
}: ErrorBoundaryFallbackProps) {
  const message =
    error?.message?.trim() ||
    "An unexpected error occurred. Please reload the page.";

  const isEmbedded = variant === "embedded";
  const shellClass = isEmbedded
    ? "flex min-h-[50svh] w-full items-center justify-center p-2 sm:p-4"
    : "ops-shell flex min-h-svh w-full items-center justify-center p-4 sm:p-6";

  const intro = isEmbedded
    ? pageTitle
      ? `"${pageTitle}" failed to load. You can retry or return home.`
      : "This section failed to render. The rest of the app may still work."
    : "Part of the app failed to render. You can retry or return home.";

  const retryLabel = isEmbedded ? "Try again" : "Reload";
  const HomeIcon = isEmbedded ? FaArrowRight : FaHome;

  return (
    <section className={shellClass} role="alert" aria-live="assertive">
      <div className="ops-panel w-full max-w-lg rounded-2xl border-[var(--border-error)]/40 p-5 shadow-[0_0_40px_rgba(157,8,8,0.18)] sm:p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-error)]/60 bg-[var(--bg-error)]/80 text-[var(--fg-error)]"
            aria-hidden="true"
          >
            <FaExclamationTriangle className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            {isEmbedded ? (
              <h2 className="text-lg font-bold text-[var(--fg)] sm:text-xl">
                {pageTitle ? `Error in “${pageTitle}”` : "Section error"}
              </h2>
            ) : (
              <h1 className="text-xl font-bold text-[var(--fg)] sm:text-2xl">
                Something went wrong
              </h1>
            )}
            <p className="text-sm leading-relaxed text-[var(--gray-800)] sm:text-base">
              {intro}
            </p>
          </div>

          <p className="w-full rounded-xl border border-[var(--border-error)]/30 bg-[var(--bg-error)]/25 px-3 py-2 text-left text-sm text-[var(--fg-error)]">
            {message}
          </p>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <button type="button" onClick={onRetry} className="ops-btn ops-btn-primary gap-2 px-4 py-2.5 text-sm">
              <FaRedo className="h-4 w-4 shrink-0" aria-hidden="true" />
              {retryLabel}
            </button>
            <a href={homeHref} className="ops-btn gap-2 px-4 py-2.5 text-sm">
              <HomeIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {homeLabel}
            </a>
          </div>

          <ErrorDetailsPanel
            error={error}
            errorInfo={errorInfo}
            showDetails={Boolean(showDetails)}
          />
        </div>
      </div>
    </section>
  );
}
