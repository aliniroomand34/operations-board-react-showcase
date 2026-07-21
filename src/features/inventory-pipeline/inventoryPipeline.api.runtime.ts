/**
 * Pipeline mock API runtime — thin facade over the shared demo store.
 */
export {
  DEMO_STORE_DELAY_MS,
  beginDemoStoreCall,
  cloneCurrentDemoStore,
  commitDemoStoreMutation,
  createDemoStoreError,
  getMutableDemoStore,
  nextAcquisitionJobId,
  nextCatalogSkuId,
  nextPipelineBatchId,
  resetDemoStore,
  setDemoStoreMockDelay,
  setDemoStoreMockFailure,
  subscribeDemoStorePipeline,
} from "@/mocks/demoStore.runtime";
