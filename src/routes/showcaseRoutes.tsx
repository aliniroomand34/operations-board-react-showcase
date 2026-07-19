import type { RouteObject } from "react-router-dom";
import ShowcaseLayout from "@/layouts/ShowcaseLayout";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import OperationsBoardPage from "@/features/operations-board/OperationsBoardPage";

/**
 * Public showcase routes only:
 * `/` landing, `/operations` board demo, `*` not found.
 * No auth guards, private admin surfaces, or live API routes.
 */
export const showcaseRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ShowcaseLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "operations", element: <OperationsBoardPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];
