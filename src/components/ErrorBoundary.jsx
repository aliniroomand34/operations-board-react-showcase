import React from "react";
import { FaExclamationTriangle, FaRedo, FaHome, FaArrowRight } from "react-icons/fa";

function ErrorDetailsPanel({ error, errorInfo, showDetails }) {
  if (!showDetails || !(error?.stack || errorInfo?.componentStack)) {
    return null;
  }

  return (
    <details className="w-full rounded-xl border border-amber-500/30 bg-amber-500/5 text-right">
      <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-amber-200/90 select-none">
        جزئیات فنی (حالت توسعه)
      </summary>
      <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words px-3 pb-3 text-left text-xs leading-relaxed text-amber-100/80 [direction:ltr]">
        {[error?.stack, errorInfo?.componentStack].filter(Boolean).join("\n\n")}
      </pre>
    </details>
  );
}

function ErrorBoundaryFallback({
  error,
  errorInfo,
  onRetry,
  showDetails,
  variant = "fullscreen",
  pageTitle,
  homeHref = "/",
  homeLabel = "صفحهٔ اصلی",
}) {
  const message =
    error?.message?.trim() ||
    "خطای غیرمنتظره‌ای رخ داد. لطفاً صفحه را دوباره بارگذاری کنید.";

  const isEmbedded = variant === "embedded";
  const shellClass = isEmbedded
    ? "flex min-h-[50svh] w-full items-center justify-center p-2 sm:p-4"
    : "flex min-h-svh w-full items-center justify-center bg-black/95 p-4 sm:p-6";

  const intro = isEmbedded
    ? pageTitle
      ? `بخش «${pageTitle}» درست بارگذاری نشد. می‌توانید دوباره تلاش کنید یا به صفحهٔ اصلی برگردید.`
      : "این بخش درست نمایش داده نشد. بقیهٔ برنامه در دسترس است."
    : "بخشی از برنامه درست نمایش داده نشد. می‌توانید دوباره تلاش کنید یا به صفحهٔ اصلی برگردید.";

  const retryLabel = isEmbedded ? "تلاش مجدد" : "بارگذاری مجدد";
  const HomeIcon = isEmbedded ? FaArrowRight : FaHome;

  return (
    <div className={shellClass} dir="rtl" role="alert" aria-live="assertive">
      <div className="w-full max-w-lg rounded-2xl border border-red-500/35 bg-gradient-to-b from-red-950/50 via-black/80 to-black/90 p-5 shadow-[0_0_40px_rgba(157,8,8,0.15)] sm:p-6">
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
                {pageTitle ? `خطا در «${pageTitle}»` : "خطا در این بخش"}
              </h2>
            ) : (
              <h1 className="text-xl font-bold text-[var(--fg)] sm:text-2xl">
                مشکلی پیش آمد
              </h1>
            )}
            <p className="text-sm leading-relaxed text-red-100/90 sm:text-base">
              {intro}
            </p>
          </div>

          <p className="w-full rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-right text-sm text-red-100">
            {message}
          </p>

          <div className="flex w-full flex-col gap-2 sm:flex-row-reverse sm:justify-center">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--fg)] px-4 py-2.5 text-sm font-semibold text-[var(--fg-inverted)] shadow-md transition hover:bg-[var(--fg-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
            >
              <FaRedo className="h-4 w-4 shrink-0" aria-hidden="true" />
              {retryLabel}
            </button>
            <a
              href={homeHref}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-muted)] bg-black/40 px-4 py-2.5 text-sm font-semibold text-[var(--fg)] transition hover:border-[var(--border)] hover:bg-[var(--bg-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg-muted)]"
            >
              <HomeIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {homeLabel}
            </a>
          </div>

          <ErrorDetailsPanel
            error={error}
            errorInfo={errorInfo}
            showDetails={showDetails}
          />
        </div>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry() {
    const { onRetry } = this.props;
    if (onRetry) {
      onRetry();
      this.setState({ hasError: false, error: null, errorInfo: null });
      return;
    }
    window.location.reload();
  }

  render() {
    const { hasError, error, errorInfo } = this.state;
    const {
      children,
      fallback: Fallback,
      showDetails = import.meta.env.DEV,
      variant = "fullscreen",
      pageTitle,
      homeHref,
      homeLabel,
    } = this.props;

    if (!hasError) {
      return children;
    }

    if (Fallback) {
      return (
        <Fallback
          error={error}
          errorInfo={errorInfo}
          onRetry={this.handleRetry}
        />
      );
    }

    return (
      <ErrorBoundaryFallback
        error={error}
        errorInfo={errorInfo}
        onRetry={this.handleRetry}
        showDetails={showDetails}
        variant={variant}
        pageTitle={pageTitle}
        homeHref={homeHref}
        homeLabel={homeLabel}
      />
    );
  }
}

export { ErrorBoundaryFallback };
export default ErrorBoundary;
