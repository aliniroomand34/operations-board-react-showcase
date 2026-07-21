import type { CSSProperties } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { formatAmount } from "./operationsBoard.helpers";
import type { InventoryBatch } from "./operationsBoard.types";
import { CardShell } from "./OperationsBoardCardShell";

interface ReadyBatchCardProps {
  batch: InventoryBatch;
}

/**
 * Draggable inventory batch tile. Outer shell is the article; drag surface is a div
 * (dnd-kit sets role="button" via attributes — avoids nested article).
 */
export function ReadyBatchCard({ batch }: ReadyBatchCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: batch.id,
      data: { dragType: "batch", batch },
    });
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <CardShell>
      <div
        ref={setNodeRef}
        style={style}
        className={`ops-batch-card ${
          isDragging ? "opacity-60 ring-2 ring-[var(--fg-success)]" : ""
        }`}
        aria-label={`Ready batch ${batch.label}. Drag onto a queued client, or assign via client details.`}
        {...attributes}
        {...listeners}
      >
        <p className="text-[9px] font-bold leading-tight text-[var(--fg-success)]">
          {batch.label}
        </p>
        <p className="text-xs font-bold leading-tight text-white">
          {formatAmount(batch.capacity)}
        </p>
        <span className="ops-status-badge ops-status-badge--ready ops-status-badge--compact self-start">
          Ready
        </span>
      </div>
    </CardShell>
  );
}
