import { useRoutes, Navigate } from "react-router-dom";
import { TodosRoutes } from "@/features/todos";
// import { AuthRoutes } from '@/features/auth'; <-- You will add this later

export const AppRoutes = () => {
  const routes = useRoutes([
    // If they go to /todos, load the Todos feature
    { path: "/todos/*", element: <TodosRoutes /> },

    // Default redirect (e.g., send them to todos on load for now)
    { path: "*", element: <Navigate to="/todos" replace /> },
  ]);

  return <>{routes}</>;
};
