import { Route, Routes } from "react-router-dom";
import { TodosPage } from "./TodosPage";

export const TodosRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TodosPage />} />
    </Routes>
  );
};
