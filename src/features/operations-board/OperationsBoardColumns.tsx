import { useDroppable } from "@dnd-kit/core";
import {
  BOARD_CHROME_READY_COUNT_CLASS,
  BOARD_CHROME_READY_DROP_OVER_CLASS,
  BOARD_CHROME_READY_TITLE_CLASS,
  OPERATIONS_BOARD_COLUMN_TONE,
} from "@/features/shared/boardChrome";
import {
  BoardCardList,
  BoardCardListItem,
  ColumnFrame,
} from "./OperationsBoardColumnFrame";
import { ReadyBatchCard } from "./OperationsBoardBatchCard";
import {
  CompletedCard,
  InProgressCard,
  QueueClientCard,
} from "./OperationsBoardCards";
import { BOARD_COLUMN_META } from "./operationsBoard.helpers";
import type { InventoryBatch, OperationRequest } from "./operationsBoard.types";

export interface QueuedColumnProps {
  requests: OperationRequest[];
  assigningToRequestId: string | null;
  onOpenDetails: (request: OperationRequest) => void;
}

export function QueuedColumn({
  requests,
  assigningToRequestId,
  onOpenDetails,
}: QueuedColumnProps) {
  const meta = BOARD_COLUMN_META.queued;
  return (
    <ColumnFrame
      title={meta.title}
      count={requests.length}
      toneClass={OPERATIONS_BOARD_COLUMN_TONE.queued}
    >
      {requests.length === 0 ? (
        <p className="ops-empty" role="status">
          {meta.emptyHint}
        </p>
      ) : (
        <BoardCardList>
          {requests.map((request) => (
            <BoardCardListItem key={request.id}>
              <QueueClientCard
                request={request}
                onOpenDetails={onOpenDetails}
                isAssigning={assigningToRequestId === request.id}
              />
            </BoardCardListItem>
          ))}
        </BoardCardList>
      )}
    </ColumnFrame>
  );
}

export interface ReadyBatchesColumnProps {
  batches: InventoryBatch[];
}

export function ReadyBatchesColumn({ batches }: ReadyBatchesColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: "ready-batch-drop-zone" });

  return (
    <ColumnFrame
      title="Ready batches"
      count={batches.length}
      toneClass={OPERATIONS_BOARD_COLUMN_TONE.ready}
      headingId="ready-batches-column-heading"
      titleClassName={BOARD_CHROME_READY_TITLE_CLASS}
      countClassName={BOARD_CHROME_READY_COUNT_CLASS}
      sectionRef={setNodeRef}
      sectionClassName={isOver ? BOARD_CHROME_READY_DROP_OVER_CLASS : ""}
    >
      {batches.length === 0 ? (
        <p className="ops-empty" role="status">
          No ready batches in inventory.
        </p>
      ) : (
        <BoardCardList>
          {batches.map((batch) => (
            <BoardCardListItem key={batch.id}>
              <ReadyBatchCard batch={batch} />
            </BoardCardListItem>
          ))}
        </BoardCardList>
      )}
    </ColumnFrame>
  );
}

export interface InProgressColumnProps {
  requests: OperationRequest[];
  batchesForRequest: (request: OperationRequest) => InventoryBatch[];
  assigningToRequestId: string | null;
  onOpenDetails: (request: OperationRequest) => void;
  onAssignMore: (request: OperationRequest) => void;
}

export function InProgressColumn({
  requests,
  batchesForRequest,
  assigningToRequestId,
  onOpenDetails,
  onAssignMore,
}: InProgressColumnProps) {
  const meta = BOARD_COLUMN_META.inProgress;
  return (
    <ColumnFrame
      title={meta.title}
      count={requests.length}
      toneClass={OPERATIONS_BOARD_COLUMN_TONE.inProgress}
    >
      {requests.length === 0 ? (
        <p className="ops-empty" role="status">
          {meta.emptyHint}
        </p>
      ) : (
        <BoardCardList>
          {requests.map((request) => (
            <BoardCardListItem key={request.id}>
              <InProgressCard
                request={request}
                assignedBatches={batchesForRequest(request)}
                onOpenDetails={onOpenDetails}
                onAssignMore={onAssignMore}
                isAssigning={assigningToRequestId === request.id}
              />
            </BoardCardListItem>
          ))}
        </BoardCardList>
      )}
    </ColumnFrame>
  );
}

export interface CompletedColumnProps {
  requests: OperationRequest[];
  onOpenDetails: (request: OperationRequest) => void;
}

export function CompletedColumn({
  requests,
  onOpenDetails,
}: CompletedColumnProps) {
  const meta = BOARD_COLUMN_META.completed;
  return (
    <ColumnFrame
      title={meta.title}
      count={requests.length}
      toneClass={OPERATIONS_BOARD_COLUMN_TONE.completed}
    >
      {requests.length === 0 ? (
        <p className="ops-empty" role="status">
          {meta.emptyHint}
        </p>
      ) : (
        <BoardCardList>
          {requests.map((request) => (
            <BoardCardListItem key={request.id}>
              <CompletedCard
                request={request}
                onOpenDetails={onOpenDetails}
              />
            </BoardCardListItem>
          ))}
        </BoardCardList>
      )}
    </ColumnFrame>
  );
}
