import { useState } from "react";
import type { CatalogItem } from "./inventoryPipeline.types";

interface InventoryPipelineCatalogPanelProps {
  catalog: CatalogItem[];
  isSubmitting: boolean;
  onAddCatalog: (label: string) => Promise<boolean>;
  onToggleCatalog: (skuId: string, enabled: boolean) => Promise<boolean>;
}

export function InventoryPipelineCatalogPanel({
  catalog,
  isSubmitting,
  onAddCatalog,
  onToggleCatalog,
}: InventoryPipelineCatalogPanelProps) {
  const [newLabel, setNewLabel] = useState("");

  const handleAdd = async () => {
    const ok = await onAddCatalog(newLabel);
    if (ok) setNewLabel("");
  };

  return (
    <section
      className="admin-page-panel rounded-2xl p-5 sm:p-6"
      aria-labelledby="catalog-panel-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="catalog-panel-heading"
            className="text-sm font-semibold uppercase tracking-wide text-[var(--fg)]"
          >
            Allowed catalog
          </h2>
          <p className="mt-1 text-sm text-[var(--gray-800)]">
            SKU allowlist for batch requests — enable or disable items without
            deleting history.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="New catalog item label"
          className="min-w-[200px] flex-1 rounded-lg border border-[var(--border-muted)]/45 bg-black/40 px-3 py-2 text-sm text-[var(--gray-900)] outline-none focus:border-[var(--border)]"
          aria-label="New catalog item label"
        />
        <button
          type="button"
          disabled={isSubmitting || !newLabel.trim()}
          onClick={() => void handleAdd()}
          className="ops-btn ops-btn-primary"
        >
          Add item
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border-muted)]/35 text-[var(--fg-muted)]">
              <th scope="col" className="px-2 py-2 font-medium">
                SKU
              </th>
              <th scope="col" className="px-2 py-2 font-medium">
                Label
              </th>
              <th scope="col" className="px-2 py-2 font-medium">
                Status
              </th>
              <th scope="col" className="px-2 py-2 font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {catalog.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-2 py-4 text-[var(--gray-800)]">
                  No catalog items yet.
                </td>
              </tr>
            ) : (
              catalog.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[var(--border-muted)]/20"
                >
                  <td className="px-2 py-2 font-mono text-xs text-[var(--fg-subtle)]">
                    {item.id}
                  </td>
                  <td className="px-2 py-2 text-[var(--gray-900)]">{item.label}</td>
                  <td className="px-2 py-2">
                    <span
                      className={
                        item.status === "enabled"
                          ? "ops-status-badge ops-status-badge--ready"
                          : "ops-status-badge ops-status-badge--queued"
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() =>
                        void onToggleCatalog(
                          item.id,
                          item.status !== "enabled",
                        )
                      }
                      className="ops-btn px-3 py-1 text-xs"
                    >
                      {item.status === "enabled" ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
