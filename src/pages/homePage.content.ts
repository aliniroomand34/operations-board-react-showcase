/**
 * Landing copy for the public Home case study.
 * Scale / system layers are documented private-context only — not live in this demo.
 */

export const SYSTEM_CONTEXT = [
  {
    kicker: "Intake",
    title: "Automation Intake",
    body: "Private source system accepted workflow events from an automation intake bot before they reached the operations surface.",
  },
  {
    kicker: "Operator tooling",
    title: "Operator Extensions",
    body: "Browser-based operator extensions reduced friction for common actions and fed confirmed work back into the workflow services.",
  },
  {
    kicker: "Orchestration",
    title: "Workflow Backend",
    body: "Backend workflow services owned validation, state transitions, and auditability behind the board UI.",
  },
  {
    kicker: "Coordination",
    title: "Realtime / Redis Coordination",
    body: "Production architecture used Redis-backed transient state and realtime channels for live operational updates — mocked here.",
  },
] as const;

/**
 * Scale / volume signals from the private source system.
 * Wording stays category-safe (no private product, commerce slang, or privileged surface names).
 */
export const SCALE_SIGNALS = [
  {
    title: "Settlement & finance summaries",
    body: "Operator-facing summaries for settled vs unsettled work and related financial ops — so teams could see cashflow posture without leaving the workflow surface.",
  },
  {
    title: "Resource pool ≤30 sources",
    body: "A managed pool of unnamed inventory sources (security: no public labels). Each source had its own daily capacity ceiling; when exhausted, routing rotated by same-day usage. Parallel lanes were supported; under load, work could fail over to a freer operator system.",
  },
  {
    title: "Bulk intake → extension queue",
    body: "High-volume operation requests were composed across the pool, then handed to a browser extension that executed them sequentially with a queue — paced delays, rate limits, retry/backoff, and session-health checks to reduce provider risk.",
  },
  {
    title: "Client fulfillment paths",
    body: "Clients could request fulfillment; operators ran manual steps or automated handoffs depending on policy — same domain language as the public board (client / operation request).",
  },
  {
    title: "Clients & transactions registry",
    body: "Persistent registry for clients and transaction history so operators could audit who requested what, when it moved, and how it settled.",
  },
  {
    title: "Post-operation verification",
    body: "After client-side completion, an extension pass could re-check that the operation landed correctly before the workflow marked it trusted.",
  },
  {
    title: "Realtime alerts & errors",
    body: "WebSocket channel pushed live warnings and failures to operator surfaces — high-signal ops noise without polling every few seconds.",
  },
  {
    title: "Team concurrency & roles",
    body: "Designed for ~20 concurrent primary operators, ~50 concurrent clients, two owner-level operators, plus one audit/oversight role for pool review and accountability.",
  },
  {
    title: "Live presence / connection health",
    body: "Realtime connection status for inventory sources and operator extensions — heartbeat-style presence so admins saw what was online before assigning load.",
  },
  {
    title: "Ops resilience patterns",
    body: "Production context also leaned on bounded queues / backpressure, idempotent state transitions, reconnect backoff, and Redis-backed locks or rate coordination — the board was the human projection of that machinery.",
  },
] as const;

export const SHIPPED_SURFACES = [
  {
    title: "Overview",
    route: "/app/overview",
    body: "KPI cards, Recharts pie/bar panels, and summary tables wired to the shared mock store — counts move after board and pipeline actions.",
  },
  {
    title: "Inventory Pipeline",
    route: "/app/inventory",
    body: "Allowed catalog, batch request form, column workflow, and handoff to the Operations Board.",
  },
  {
    title: "Extension Acquisition Simulator",
    route: "/app/extension-sim",
    body: "In-app simulation of operator extension acquisition — honesty banner, paced steps from form payload.",
  },
  {
    title: "Operations Board",
    route: "/app/operations",
    body: "Queue → assign → in progress → complete with drag/drop and keyboard assign path.",
  },
  {
    title: "Finance Summary",
    route: "/app/finance",
    body: "Demo — synthetic finance KPIs and charts from the shared mock store. No live billing.",
  },
  {
    title: "Team Activity",
    route: "/app/team",
    body: "Demo — synthetic org graph and activity feed. No real RBAC or member management.",
  },
] as const;

export const IMPLEMENTATION = [
  {
    title: "Shared mock store",
    body: "Single in-memory source of truth for board, pipeline, extension jobs, and overview KPIs.",
  },
  {
    title: "Modular feature architecture",
    body: "UI / Logic / API / helpers split per surface — same pattern as production-shaped code.",
  },
  {
    title: "Behavior tests under CI",
    body: "Vitest + RTL on helpers, store mutations, route shell, and primary operator workflows.",
  },
] as const;

export type WorkflowCycleTone = "demo" | "context";

export type WorkflowCycleNode = {
  label: string;
};

/**
 * Workflow cycles for Home.
 * `demo` = implemented on the public board; `context` = private system only.
 */
export const WORKFLOW_CYCLES = [
  {
    id: "board",
    tone: "demo" as WorkflowCycleTone,
    title: "Board lifecycle",
    blurb: "What this demo actually runs — queue through complete.",
    nodes: [
      { label: "Queue" },
      { label: "Assign" },
      { label: "In progress" },
      { label: "Complete" },
    ] satisfies WorkflowCycleNode[],
    loopHint: "operator continues with next request",
  },
  {
    id: "pool",
    tone: "context" as WorkflowCycleTone,
    title: "Resource pool cycle",
    blurb: "≤30 unnamed sources — capacity check, rotate, failover under load.",
    nodes: [
      { label: "Pick source" },
      { label: "Capacity OK?" },
      { label: "Use / parallel" },
      { label: "Rotate / failover" },
    ] satisfies WorkflowCycleNode[],
    loopHint: "usage-aware routing resets daily ceilings",
  },
  {
    id: "bulk-extension",
    tone: "context" as WorkflowCycleTone,
    title: "Bulk → extension queue",
    blurb: "High-volume intake → paced sequential execution → verify.",
    nodes: [
      { label: "Bulk request" },
      { label: "Extension queue" },
      { label: "Paced exec" },
      { label: "Verify" },
    ] satisfies WorkflowCycleNode[],
    loopHint: "retry / backoff on session risk",
  },
  {
    id: "fulfillment",
    tone: "context" as WorkflowCycleTone,
    title: "Client fulfillment",
    blurb: "Client asks → manual or automated path → registry.",
    nodes: [
      { label: "Client ask" },
      { label: "Manual / auto" },
      { label: "Fulfill" },
      { label: "Registry" },
    ] satisfies WorkflowCycleNode[],
    loopHint: "feeds settlement + audit trail",
  },
  {
    id: "settlement",
    tone: "context" as WorkflowCycleTone,
    title: "Settlement cycle",
    blurb: "Completed work lands settled or unsettled in finance summaries.",
    nodes: [
      { label: "Done ops" },
      { label: "Classify" },
      { label: "Settled" },
      { label: "Unsettled" },
    ] satisfies WorkflowCycleNode[],
    loopHint: "summaries refresh for operators",
  },
  {
    id: "realtime",
    tone: "context" as WorkflowCycleTone,
    title: "Realtime presence & alerts",
    blurb: "Heartbeats + WebSocket push keep sources / extensions visible.",
    nodes: [
      { label: "Heartbeat" },
      { label: "Redis state" },
      { label: "WebSocket" },
      { label: "Alert / UI" },
    ] satisfies WorkflowCycleNode[],
    loopHint: "reconnect backoff under load",
  },
] as const;
