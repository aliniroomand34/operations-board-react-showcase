import { InventoryPipelineBatchFormModal } from "./InventoryPipelineBatchFormModal";
import { InventoryPipelineCatalogPanel } from "./InventoryPipelineCatalogPanel";
import { InventoryPipelineColumns } from "./InventoryPipelineColumns";
import { InventoryPipelinePageHeader } from "./InventoryPipelinePageHeader";
import { InventoryPipelineStatusPanel } from "./InventoryPipelineStatusPanel";
import { useInventoryPipelineLogic } from "./useInventoryPipelineLogic";

/**
 * Inventory Pipeline page — catalog, batch request form, column workflow,
 * and handoff to the Operations Board.
 */
export default function InventoryPipelinePage() {
  const {
    snapshot,
    loading,
    error,
    batchesByColumn,
    isPipelineEmpty,
    showBatchForm,
    setShowBatchForm,
    isSubmitting,
    activeBatchId,
    loadPipeline,
    handleRetry,
    handleShowEmpty,
    handleShowErrorPreset,
    handleResetDemo,
    handleSimulateError,
    addCatalog,
    toggleCatalog,
    submitBatch,
    advanceBatch,
    retryBatch,
    archiveBatch,
    markProblem,
    handoffToBoard,
  } = useInventoryPipelineLogic();

  const showPipeline =
    !loading && !error && snapshot && !isPipelineEmpty;

  return (
    <section className="flex flex-col gap-5" aria-labelledby="inventory-pipeline-heading">
      <InventoryPipelinePageHeader
        loading={loading}
        onReload={() => void loadPipeline()}
        onShowEmpty={() => void handleShowEmpty()}
        onShowErrorPreset={() => void handleShowErrorPreset()}
        onSimulateError={() => void handleSimulateError()}
        onResetDemo={() => void handleResetDemo()}
        onOpenBatchForm={() => setShowBatchForm(true)}
      />

      <div aria-busy={loading} aria-describedby="inventory-pipeline-description">
        <InventoryPipelineStatusPanel
          loading={loading}
          error={error}
          isPipelineEmpty={isPipelineEmpty}
          onRetry={handleRetry}
          onResetDemo={() => void handleResetDemo()}
        />

        {showPipeline ? (
          <>
            <InventoryPipelineCatalogPanel
              catalog={snapshot.catalog}
              isSubmitting={isSubmitting}
              onAddCatalog={addCatalog}
              onToggleCatalog={toggleCatalog}
            />

            <InventoryPipelineColumns
              batchesByColumn={batchesByColumn}
              activeBatchId={activeBatchId}
              isSubmitting={isSubmitting}
              onAdvance={(id) => void advanceBatch(id)}
              onRetry={(id) => void retryBatch(id)}
              onArchive={(id) => void archiveBatch(id)}
              onMarkProblem={(id) => void markProblem(id)}
              onHandoff={(id) => void handoffToBoard(id)}
            />
          </>
        ) : null}

        {!loading && !error && snapshot && isPipelineEmpty ? (
          <InventoryPipelineCatalogPanel
            catalog={snapshot.catalog}
            isSubmitting={isSubmitting}
            onAddCatalog={addCatalog}
            onToggleCatalog={toggleCatalog}
          />
        ) : null}
      </div>

      {snapshot ? (
        <InventoryPipelineBatchFormModal
          open={showBatchForm}
          catalog={snapshot.catalog}
          linkedAccounts={snapshot.linkedAccounts}
          isSubmitting={isSubmitting}
          onClose={() => setShowBatchForm(false)}
          onSubmit={submitBatch}
        />
      ) : null}
    </section>
  );
}
