import { useRoutes, Navigate } from "react-router-dom";
import { TodosRoutes } from "@/features/todos";
import { AuthRoutes } from "@/features/auth";

export const AppRoutes = () => {
  const routes = useRoutes([
    // Todos remain under /todos/*
    { path: "/todos/*", element: <TodosRoutes /> },

    // Auth routes are now at the root
    ...AuthRoutes,

    // Default redirects
    { path: "/", element: <Navigate to="/todos" replace /> },
    { path: "*", element: <Navigate to="/todos" replace /> },
  ]);

  return <>{routes}</>;
};
