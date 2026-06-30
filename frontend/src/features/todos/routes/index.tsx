import { Route, Routes } from "react-router-dom";
import { TodosLayout } from "../components/TodosLayout";
import { TodosPage } from "./TodosPage";

export const TodosRoutes = () => {
  return (
    <TodosLayout>
      <Routes>
        <Route path="/" element={<TodosPage />} />
        {/* If you add a "Todo Detail" page later, it goes here */}
        {/* <Route path="/:id" element={<TodoDetailPage />} /> */}
      </Routes>
    </TodosLayout>
  );
};
