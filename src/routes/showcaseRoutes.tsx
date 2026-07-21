import { Navigate, type RouteObject } from "react-router-dom";
import AdminDemoLayout from "@/layouts/AdminDemoLayout";
import { adminDemoStubItems } from "@/layouts/adminDemoNav";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import DemoStubPage from "@/pages/DemoStubPage";
import OverviewPage from "@/features/overview/OverviewPage";
import OperationsBoardPage from "@/features/operations-board/OperationsBoardPage";
import InventoryPipelinePage from "@/features/inventory-pipeline/InventoryPipelinePage";
import ExtensionAcquisitionSimPage from "@/features/extension-acquisition-sim/ExtensionAcquisitionSimPage";
import FinanceSummaryPage from "@/features/finance-summary/FinanceSummaryPage";
import TeamActivityPage from "@/features/team-activity/TeamActivityPage";

/**
 * Public showcase routes:
 * `/` redirects into the admin shell; interactive demos and honest stubs live under `/app/*`.
 * Legacy `/operations` redirects preserve old bookmarks.
 */
export const showcaseRoutes: RouteObject[] = [
  { index: true, element: <Navigate to="/app/overview" replace /> },
  { path: "operations", element: <Navigate to="/app/operations" replace /> },
  {
    path: "app",
    element: <AdminDemoLayout />,
    children: [
      { index: true, element: <Navigate to="overview" replace /> },
      { path: "overview", element: <OverviewPage /> },
      { path: "operations", element: <OperationsBoardPage /> },
      { path: "inventory", element: <InventoryPipelinePage /> },
      { path: "extension-sim", element: <ExtensionAcquisitionSimPage /> },
      { path: "finance", element: <FinanceSummaryPage /> },
      { path: "team", element: <TeamActivityPage /> },
      { path: "case-study", element: <HomePage /> },
      ...adminDemoStubItems.map((item) => ({
        path: item.to.replace("/app/", ""),
        element: <DemoStubPage title={item.stubTitle!} />,
      })),
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];
