import {
  BoardCardList,
  BoardCardListItem,
  ColumnFrame,
} from "@/features/operations-board/OperationsBoardColumnFrame";
import {
  BOARD_CHROME_READY_COUNT_CLASS,
  BOARD_CHROME_READY_TITLE_CLASS,
  BOARD_STRIP_CLASS,
  PIPELINE_COLUMN_SHELL_CLASS,
  PIPELINE_COLUMN_TONE,
} from "@/features/shared/boardChrome";
import { InventoryPipelineBatchCard } from "./InventoryPipelineBatchCard";
import { PIPELINE_COLUMN_META, PIPELINE_COLUMNS } from "./inventoryPipeline.helpers";
import type { PipelineBatch, PipelineColumn } from "./inventoryPipeline.types";

export interface InventoryPipelineColumnsProps {
  batchesByColumn: Record<PipelineColumn, PipelineBatch[]>;
  activeBatchId: string | null;
  isSubmitting: boolean;
  onAdvance: (batchId: string) => void;
  onRetry: (batchId: string) => void;
  onArchive: (batchId: string) => void;
  onMarkProblem: (batchId: string) => void;
  onHandoff: (batchId: string) => void;
}

export function InventoryPipelineColumns({
  batchesByColumn,
  activeBatchId,
  isSubmitting,
  onAdvance,
  onRetry,
  onArchive,
  onMarkProblem,
  onHandoff,
}: InventoryPipelineColumnsProps) {
  return (
    <div
      className={BOARD_STRIP_CLASS}
      role="region"
      aria-label="Pipeline columns"
    >
      {PIPELINE_COLUMNS.map((column) => {
        const meta = PIPELINE_COLUMN_META[column];
        const batches = batchesByColumn[column];
        const isReady = column === "ready";

        return (
          <div key={column} className={PIPELINE_COLUMN_SHELL_CLASS}>
            <ColumnFrame
              title={meta.title}
              count={batches.length}
              toneClass={PIPELINE_COLUMN_TONE[column]}
              titleClassName={
                isReady ? BOARD_CHROME_READY_TITLE_CLASS : undefined
              }
              countClassName={
                isReady ? BOARD_CHROME_READY_COUNT_CLASS : undefined
              }
            >
              {batches.length === 0 ? (
                <p className="ops-empty" role="status">
                  {meta.emptyHint}
                </p>
              ) : (
                <BoardCardList>
                  {batches.map((batch) => (
                    <BoardCardListItem key={batch.id}>
                      <InventoryPipelineBatchCard
                        batch={batch}
                        column={column}
                        isActive={activeBatchId === batch.id}
                        isSubmitting={isSubmitting}
                        onAdvance={onAdvance}
                        onRetry={onRetry}
                        onArchive={onArchive}
                        onMarkProblem={onMarkProblem}
                        onHandoff={onHandoff}
                      />
                    </BoardCardListItem>
                  ))}
                </BoardCardList>
              )}
            </ColumnFrame>
          </div>
        );
      })}
    </div>
  );
}
