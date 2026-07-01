import { AuthRoutes } from "@/features/auth";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { TodosRoutes } from "@/features/todos";
import { useRoutes, Navigate } from "react-router-dom";

export const AppRoutes = () => {
  return useRoutes([
    ...AuthRoutes,

    {
      path: "/todos",
      element: (
        <ProtectedRoute>
          <TodosRoutes />
        </ProtectedRoute>
      ),
    },

    { path: "/", element: <Navigate to="/todos" replace /> },
    { path: "*", element: <Navigate to="/todos" replace /> },
  ]);
};
