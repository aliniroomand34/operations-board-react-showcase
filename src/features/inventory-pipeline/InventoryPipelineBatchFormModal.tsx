import { useMemo, useState } from "react";
import { OperationsBoardModalShell } from "@/features/operations-board/OperationsBoardModalShell";
import { getEnabledCatalogItems } from "./inventoryPipeline.helpers";
import type {
  BatchRequestLineItem,
  BatchRequestMode,
  BatchRequestPayload,
  CatalogItem,
  LinkedAccount,
} from "./inventoryPipeline.types";

interface InventoryPipelineBatchFormModalProps {
  open: boolean;
  catalog: CatalogItem[];
  linkedAccounts: LinkedAccount[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: BatchRequestPayload) => Promise<boolean>;
}

function emptyLineItem(catalog: CatalogItem[]): BatchRequestLineItem {
  const enabled = getEnabledCatalogItems(catalog);
  const first = enabled[0];
  return {
    skuId: first?.id ?? "",
    skuLabel: first?.label ?? "",
    quantity: 1,
  };
}

export function InventoryPipelineBatchFormModal({
  open,
  catalog,
  linkedAccounts,
  isSubmitting,
  onClose,
  onSubmit,
}: InventoryPipelineBatchFormModalProps) {
  const enabledCatalog = useMemo(
    () => getEnabledCatalogItems(catalog),
    [catalog],
  );
  const onlineAccounts = useMemo(
    () => linkedAccounts.filter((a) => a.online),
    [linkedAccounts],
  );

  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(
    () => onlineAccounts.slice(0, 1).map((a) => a.id),
  );
  const [mode, setMode] = useState<BatchRequestMode>("bulk");
  const [targetPrice, setTargetPrice] = useState("42.5");
  const [publishWindowHours, setPublishWindowHours] = useState("6");
  const [lineItems, setLineItems] = useState<BatchRequestLineItem[]>(() =>
    enabledCatalog.length ? [emptyLineItem(catalog)] : [],
  );

  const toggleAccount = (accountId: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId],
    );
  };

  const updateLineItem = (
    index: number,
    patch: Partial<BatchRequestLineItem>,
  ) => {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  const handleSkuChange = (index: number, skuId: string) => {
    const sku = catalog.find((c) => c.id === skuId);
    if (!sku) return;
    updateLineItem(index, { skuId: sku.id, skuLabel: sku.label });
  };

  const addLineItem = () => {
    setLineItems((prev) => [...prev, emptyLineItem(catalog)]);
  };

  const removeLineItem = (index: number) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const payload: BatchRequestPayload = {
      linkedAccountIds: selectedAccountIds,
      mode,
      targetPrice: Number(targetPrice),
      publishWindowHours: Number(publishWindowHours),
      lineItems,
    };
    const ok = await onSubmit(payload);
    if (ok) onClose();
  };

  const canSubmit =
    enabledCatalog.length > 0 &&
    onlineAccounts.length > 0 &&
    selectedAccountIds.length > 0 &&
    lineItems.length > 0 &&
    lineItems.every((item) => item.skuId && item.quantity >= 1);

  return (
    <OperationsBoardModalShell
      open={open}
      title="New batch request"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="ops-btn"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting || !canSubmit}
            onClick={() => void handleSubmit()}
            className="ops-btn ops-btn-primary"
          >
            {isSubmitting ? "Submitting…" : "Submit & open simulator"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--fg)]">
            Linked accounts
          </legend>
          <ul className="flex flex-col gap-2">
            {onlineAccounts.length === 0 ? (
              <li className="text-[var(--fg-error)]">No online linked accounts.</li>
            ) : (
              onlineAccounts.map((account) => (
                <li key={account.id}>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedAccountIds.includes(account.id)}
                      onChange={() => toggleAccount(account.id)}
                    />
                    <span>
                      {account.label}{" "}
                      <span className="font-mono text-xs text-[var(--fg-muted)]">
                        ({account.id})
                      </span>
                    </span>
                  </label>
                </li>
              ))
            )}
          </ul>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs">
            <span className="font-semibold uppercase tracking-wide text-[var(--fg)]">
              Mode
            </span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as BatchRequestMode)}
              className="rounded-lg border border-[var(--border-muted)]/45 bg-black/40 px-3 py-2 text-sm text-[var(--gray-900)]"
            >
              <option value="unit">Unit</option>
              <option value="bulk">Bulk</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs">
            <span className="font-semibold uppercase tracking-wide text-[var(--fg)]">
              Target price
            </span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="rounded-lg border border-[var(--border-muted)]/45 bg-black/40 px-3 py-2 text-sm text-[var(--gray-900)]"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs sm:col-span-2">
            <span className="font-semibold uppercase tracking-wide text-[var(--fg)]">
              Publish window (hours)
            </span>
            <input
              type="number"
              min="1"
              step="1"
              value={publishWindowHours}
              onChange={(e) => setPublishWindowHours(e.target.value)}
              className="rounded-lg border border-[var(--border-muted)]/45 bg-black/40 px-3 py-2 text-sm text-[var(--gray-900)]"
            />
          </label>
        </div>

        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--fg)]">
            Catalog SKUs
          </legend>
          {enabledCatalog.length === 0 ? (
            <p className="text-[var(--fg-error)]">
              Enable at least one catalog item before submitting.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {lineItems.map((item, index) => (
                <li key={index} className="flex flex-wrap items-end gap-2">
                  <label className="flex min-w-[160px] flex-1 flex-col gap-1 text-xs">
                    SKU
                    <select
                      value={item.skuId}
                      onChange={(e) => handleSkuChange(index, e.target.value)}
                      className="rounded-lg border border-[var(--border-muted)]/45 bg-black/40 px-2 py-1.5 text-sm"
                    >
                      {enabledCatalog.map((sku) => (
                        <option key={sku.id} value={sku.id}>
                          {sku.label} ({sku.id})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex w-24 flex-col gap-1 text-xs">
                    Qty
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateLineItem(index, {
                          quantity: Number(e.target.value),
                        })
                      }
                      className="rounded-lg border border-[var(--border-muted)]/45 bg-black/40 px-2 py-1.5 text-sm"
                    />
                  </label>
                  {lineItems.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      className="ops-btn px-2 py-1 text-xs"
                    >
                      Remove
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            disabled={enabledCatalog.length === 0}
            onClick={addLineItem}
            className="ops-btn mt-2 px-3 py-1 text-xs"
          >
            Add SKU line
          </button>
        </fieldset>
      </div>
    </OperationsBoardModalShell>
  );
}
