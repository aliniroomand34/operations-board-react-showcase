import React from "react";
import {
  ErrorBoundaryFallback,
  type ErrorBoundaryFallbackProps,
} from "./ErrorBoundaryFallback";

export type { ErrorBoundaryFallbackProps };
export { ErrorBoundaryFallback };

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
    onRetry: () => void;
  }>;
  showDetails?: boolean;
  variant?: "fullscreen" | "embedded";
  pageTitle?: string;
  homeHref?: string;
  homeLabel?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onRetry?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Class boundary only — catch/retry state. Fallback UI lives in ErrorBoundaryFallback.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
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

export default ErrorBoundary;
