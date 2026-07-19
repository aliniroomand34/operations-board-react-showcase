/**
 * Public domain-helper surface for the Operations Board.
 * Implementation is split by responsibility; consumers should import from this barrel.
 */
export {
  formatAmount,
  formatRequestedAt,
} from "./operationsBoard.format";

export {
  QUEUE_CLIENT_DROP_PREFIX,
  queueClientDropId,
  parseQueueClientDropId,
  resolvePendingDragAssign,
} from "./operationsBoard.dnd";

export {
  indexBatchesById,
  resolveBatchesForRequest,
  sumAssignedCapacity,
  computeRemainingAssignable,
  getReadyBatches,
  validateBatchAssignment,
} from "./operationsBoard.capacity";

export {
  BOARD_COLUMN_META,
  buildProgressRingBackground,
  buildRequestDetailTiles,
} from "./operationsBoard.presentation";
