/**
 * Inventory Pipeline domain types — re-export shared demo store shapes and
 * add feature-level snapshot / result contracts.
 */
export type {
  AcquisitionItemProgress,
  AcquisitionJob,
  AcquisitionJobStatus,
  AcquisitionStep,
  AcquisitionStepId,
  BatchRequestLineItem,
  BatchRequestMode,
  BatchRequestPayload,
  CatalogItem,
  CatalogItemStatus,
  DemoStorePreset,
  DemoStoreSnapshot,
  LinkedAccount,
  PipelineBatch,
  PipelineColumn,
  StepStatus,
} from "@/mocks/demoStore.types";

/** Full pipeline snapshot returned by the mock API. */
export type InventoryPipelineSnapshot = import("@/mocks/demoStore.types").DemoStoreSnapshot;

/** Result of submitting a batch request — includes navigation targets. */
export interface SubmitBatchRequestResult {
  snapshot: InventoryPipelineSnapshot;
  jobId: string;
  batchId: string;
}

/** Result of handing a ready batch off to the Operations Board. */
export interface HandoffToBoardResult {
  snapshot: InventoryPipelineSnapshot;
  boardBatchId: string;
}
