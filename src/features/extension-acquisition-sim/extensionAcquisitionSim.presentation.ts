import type { StepStatus } from "@/mocks/demoStore.types";

export function formatAccountLabels(
  accountIds: string[],
  labelsById: Record<string, string>,
): string {
  return accountIds.map((id) => labelsById[id] ?? id).join(", ");
}

export function stepStatusLabel(status: StepStatus): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "running":
      return "Running";
    case "success":
      return "Success";
    case "failed":
      return "Failed";
    case "paused":
      return "Paused";
    default:
      return status;
  }
}
