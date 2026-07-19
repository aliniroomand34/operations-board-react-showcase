import { createBrowserRouter } from "react-router-dom";
import ShowcaseLayout from "@/layouts/ShowcaseLayout";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import OperationsBoardPage from "@/features/operations-board/OperationsBoardPage";

/**
 * Public showcase routes only:
 * `/` landing, `/operations` board demo, `*` not found.
 * No auth guards, admin/god/shop surfaces, or live API routes.
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <ShowcaseLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "operations", element: <OperationsBoardPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
