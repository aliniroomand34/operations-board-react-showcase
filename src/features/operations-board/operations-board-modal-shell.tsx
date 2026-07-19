import { useEffect, useId, useRef, type ReactNode } from "react";
import { FaTimes } from "react-icons/fa";

export interface OperationsBoardModalShellProps {
  open: boolean;
  title: string;
  onClose?: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Dialog chrome only: backdrop, focus restore, Escape, labelled title.
 * Feature modals own their content and footer actions.
 */
export function OperationsBoardModalShell({
  open,
  title,
  onClose,
  children,
  footer,
}: OperationsBoardModalShellProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onClose) {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="popup-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="presentation"
      onClick={() => onClose?.()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="ops-modal outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-3 flex items-start justify-between gap-3 border-b border-[var(--border-muted)]/40 pb-3">
          <h3 id={titleId} className="ops-modal-title">
            {title}
          </h3>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-[var(--gray-800)] transition hover:bg-black/50 hover:text-[var(--fg)]"
              aria-label="Close dialog"
            >
              <FaTimes className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </header>
        <div className="text-sm text-[var(--gray-800)]">{children}</div>
        {footer ? (
          <footer className="ops-action-bar mt-4 justify-end border-t border-[var(--border-muted)]/35 pt-3">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
