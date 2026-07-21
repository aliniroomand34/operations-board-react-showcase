/**
 * Synthetic demo store seed data — safe IDs and labels only.
 */
import {
  EMPTY_OPERATIONS_BOARD,
  ERROR_OPERATIONS_BOARD,
  INITIAL_OPERATIONS_BOARD,
  cloneOperationsBoard,
} from "@/mocks/operationsBoard.data";
import type {
  DemoStorePreset,
  DemoStoreSnapshot,
  FinanceSnapshot,
  TeamActivityEvent,
  TeamMember,
} from "./demoStore.types";

export const SAMPLE_BATCH_REQUEST = {
  linkedAccountIds: ["acct-001", "acct-002"],
  mode: "bulk" as const,
  targetPrice: 42.5,
  publishWindowHours: 6,
  lineItems: [
    { skuId: "sku-001", skuLabel: "Catalog Item A", quantity: 2 },
    { skuId: "sku-002", skuLabel: "Catalog Item B", quantity: 1 },
  ],
};

export const INITIAL_TEAM: TeamMember[] = [
  { id: "op-001", label: "Operator 001", role: "owner", active: true },
  { id: "op-002", label: "Operator 002", role: "operator", active: true },
  { id: "op-003", label: "Operator 003", role: "operator", active: true },
  { id: "op-004", label: "Operator 004", role: "operator", active: false },
];

export const INITIAL_TEAM_ACTIVITY: TeamActivityEvent[] = [
  {
    id: "evt-001",
    actorId: "op-002",
    actorLabel: "Operator 002",
    action: "Assigned batch",
    detail: "Assigned batch-001 to req-010",
    at: "2026-07-20T14:22:00.000Z",
  },
  {
    id: "evt-002",
    actorId: "op-001",
    actorLabel: "Operator 001",
    action: "Opened acquisition",
    detail: "Started job-001 for batch-pipe-001",
    at: "2026-07-20T13:05:00.000Z",
  },
  {
    id: "evt-003",
    actorId: "op-003",
    actorLabel: "Operator 003",
    action: "Completed operation",
    detail: "Marked req-020 completed",
    at: "2026-07-20T11:40:00.000Z",
  },
];

export const INITIAL_FINANCE: FinanceSnapshot = {
  volumeTrend: [
    { label: "Mon", amount: 4200, count: 4 },
    { label: "Tue", amount: 5100, count: 5 },
    { label: "Wed", amount: 3800, count: 3 },
    { label: "Thu", amount: 6400, count: 6 },
    { label: "Fri", amount: 7200, count: 7 },
    { label: "Sat", amount: 2900, count: 2 },
    { label: "Sun", amount: 3500, count: 3 },
  ],
  accountVolumes: [
    {
      accountId: "acct-001",
      accountLabel: "Linked Account 001",
      amount: 9200,
      count: 9,
    },
    {
      accountId: "acct-002",
      accountLabel: "Linked Account 002",
      amount: 7100,
      count: 7,
    },
    {
      accountId: "acct-003",
      accountLabel: "Linked Account 003",
      amount: 2800,
      count: 3,
    },
  ],
  settledCount: 12,
  unsettledCount: 5,
  successfulCount: 14,
  failedCount: 2,
  totalAmount: 33100,
};

const EMPTY_FINANCE: FinanceSnapshot = {
  volumeTrend: [],
  accountVolumes: [],
  settledCount: 0,
  unsettledCount: 0,
  successfulCount: 0,
  failedCount: 0,
  totalAmount: 0,
};

const ERROR_FINANCE: FinanceSnapshot = {
  ...INITIAL_FINANCE,
  settledCount: 4,
  unsettledCount: 11,
  successfulCount: 6,
  failedCount: 8,
  totalAmount: 18400,
  volumeTrend: [
    { label: "Mon", amount: 2100, count: 2 },
    { label: "Tue", amount: 1800, count: 2 },
    { label: "Wed", amount: 900, count: 1 },
    { label: "Thu", amount: 3200, count: 3 },
    { label: "Fri", amount: 1500, count: 2 },
    { label: "Sat", amount: 400, count: 1 },
    { label: "Sun", amount: 700, count: 1 },
  ],
};

export const INITIAL_DEMO_STORE: DemoStoreSnapshot = {
  catalog: [
    { id: "sku-001", label: "Catalog Item A", status: "enabled" },
    { id: "sku-002", label: "Catalog Item B", status: "enabled" },
    { id: "sku-003", label: "Catalog Item C", status: "disabled" },
  ],
  linkedAccounts: [
    { id: "acct-001", label: "Linked Account 001", online: true, capacity: 1200 },
    { id: "acct-002", label: "Linked Account 002", online: true, capacity: 850 },
    { id: "acct-003", label: "Linked Account 003", online: false, capacity: 400 },
  ],
  pipelineBatches: [
    {
      id: "batch-pipe-001",
      label: "Batch pipe-001",
      column: "acquiring",
      requestPayload: SAMPLE_BATCH_REQUEST,
      acquisitionJobId: "job-001",
      capacity: 3,
      createdAt: "2026-07-20T10:00:00.000Z",
    },
  ],
  acquisitionJobs: [
    {
      id: "job-001",
      batchId: "batch-pipe-001",
      status: "pending",
      payload: SAMPLE_BATCH_REQUEST,
      steps: [
        { id: "connect-session", label: "Connect session", status: "pending" },
        { id: "sync-capacity", label: "Sync capacity / balance", status: "pending" },
        { id: "acquire-items", label: "Acquire catalog items", status: "pending" },
        {
          id: "queue-packaging",
          label: "Queue packaging / publish window",
          status: "pending",
        },
        { id: "complete", label: "Complete acquisition", status: "pending" },
      ],
      itemProgress: [
        {
          skuId: "sku-001",
          skuLabel: "Catalog Item A",
          quantity: 2,
          acquired: 0,
          status: "pending",
        },
        {
          skuId: "sku-002",
          skuLabel: "Catalog Item B",
          quantity: 1,
          acquired: 0,
          status: "pending",
        },
      ],
      createdAt: "2026-07-20T10:00:00.000Z",
      forceErrorNext: false,
    },
  ],
  board: cloneOperationsBoard(INITIAL_OPERATIONS_BOARD),
  team: structuredClone(INITIAL_TEAM),
  teamActivity: structuredClone(INITIAL_TEAM_ACTIVITY),
  finance: structuredClone(INITIAL_FINANCE),
};

export const EMPTY_DEMO_STORE: DemoStoreSnapshot = {
  catalog: [],
  linkedAccounts: [],
  pipelineBatches: [],
  acquisitionJobs: [],
  board: cloneOperationsBoard(EMPTY_OPERATIONS_BOARD),
  team: [],
  teamActivity: [],
  finance: structuredClone(EMPTY_FINANCE),
};

/** Problem batches, failed acquisition job, and board backlog — error-path demo. */
export const ERROR_DEMO_STORE: DemoStoreSnapshot = {
  catalog: [
    { id: "sku-001", label: "Catalog Item A", status: "enabled" },
    { id: "sku-002", label: "Catalog Item B", status: "enabled" },
    { id: "sku-003", label: "Catalog Item C", status: "disabled" },
  ],
  linkedAccounts: [
    { id: "acct-001", label: "Linked Account 001", online: true, capacity: 900 },
    { id: "acct-002", label: "Linked Account 002", online: false, capacity: 600 },
    { id: "acct-003", label: "Linked Account 003", online: false, capacity: 200 },
  ],
  pipelineBatches: [
    {
      id: "batch-pipe-900",
      label: "Batch pipe-900",
      column: "problem",
      requestPayload: SAMPLE_BATCH_REQUEST,
      acquisitionJobId: "job-900",
      capacity: 3,
      createdAt: "2026-07-20T11:15:00.000Z",
    },
    {
      id: "batch-pipe-901",
      label: "Batch pipe-901",
      column: "review",
      requestPayload: {
        linkedAccountIds: ["acct-001"],
        mode: "unit",
        targetPrice: 18,
        publishWindowHours: 4,
        lineItems: [{ skuId: "sku-001", skuLabel: "Catalog Item A", quantity: 1 }],
      },
      acquisitionJobId: "job-901",
      capacity: 1,
      createdAt: "2026-07-20T11:30:00.000Z",
    },
  ],
  acquisitionJobs: [
    {
      id: "job-900",
      batchId: "batch-pipe-900",
      status: "failed",
      payload: SAMPLE_BATCH_REQUEST,
      steps: [
        { id: "connect-session", label: "Connect session", status: "success" },
        { id: "sync-capacity", label: "Sync capacity / balance", status: "success" },
        {
          id: "acquire-items",
          label: "Acquire catalog items",
          status: "failed",
          detail: "Mock acquire failure (error preset).",
        },
        {
          id: "queue-packaging",
          label: "Queue packaging / publish window",
          status: "pending",
        },
        { id: "complete", label: "Complete acquisition", status: "pending" },
      ],
      itemProgress: [
        {
          skuId: "sku-001",
          skuLabel: "Catalog Item A",
          quantity: 2,
          acquired: 1,
          status: "failed",
        },
        {
          skuId: "sku-002",
          skuLabel: "Catalog Item B",
          quantity: 1,
          acquired: 0,
          status: "pending",
        },
      ],
      createdAt: "2026-07-20T11:15:00.000Z",
      forceErrorNext: false,
    },
    {
      id: "job-901",
      batchId: "batch-pipe-901",
      status: "completed",
      payload: {
        linkedAccountIds: ["acct-001"],
        mode: "unit",
        targetPrice: 18,
        publishWindowHours: 4,
        lineItems: [{ skuId: "sku-001", skuLabel: "Catalog Item A", quantity: 1 }],
      },
      steps: [
        { id: "connect-session", label: "Connect session", status: "success" },
        { id: "sync-capacity", label: "Sync capacity / balance", status: "success" },
        { id: "acquire-items", label: "Acquire catalog items", status: "success" },
        {
          id: "queue-packaging",
          label: "Queue packaging / publish window",
          status: "success",
        },
        { id: "complete", label: "Complete acquisition", status: "success" },
      ],
      itemProgress: [
        {
          skuId: "sku-001",
          skuLabel: "Catalog Item A",
          quantity: 1,
          acquired: 1,
          status: "success",
        },
      ],
      createdAt: "2026-07-20T11:30:00.000Z",
      forceErrorNext: false,
    },
  ],
  board: cloneOperationsBoard(ERROR_OPERATIONS_BOARD),
  team: [
    { id: "op-001", label: "Operator 001", role: "owner", active: true },
    { id: "op-002", label: "Operator 002", role: "operator", active: true },
    { id: "op-003", label: "Operator 003", role: "operator", active: false },
  ],
  teamActivity: [
    {
      id: "evt-900",
      actorId: "op-002",
      actorLabel: "Operator 002",
      action: "Acquisition failed",
      detail: "job-900 moved batch-pipe-900 to Problem",
      at: "2026-07-20T11:20:00.000Z",
    },
    {
      id: "evt-901",
      actorId: "op-001",
      actorLabel: "Operator 001",
      action: "Opened review",
      detail: "batch-pipe-901 flagged for review",
      at: "2026-07-20T11:35:00.000Z",
    },
  ],
  finance: structuredClone(ERROR_FINANCE),
};

export function cloneDemoStore(snapshot: DemoStoreSnapshot): DemoStoreSnapshot {
  return structuredClone(snapshot);
}

export function resolveDemoStoreByPreset(preset: DemoStorePreset): DemoStoreSnapshot {
  switch (preset) {
    case "empty":
      return cloneDemoStore(EMPTY_DEMO_STORE);
    case "error":
      return cloneDemoStore(ERROR_DEMO_STORE);
    default:
      return cloneDemoStore(INITIAL_DEMO_STORE);
  }
}
