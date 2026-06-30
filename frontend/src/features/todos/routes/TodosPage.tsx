import { TodosTable } from "../components/TodosTable";

export const TodosPage = () => {
  return (
    <div className="rounded-2xl bg-surface px-4 pb-2 flex h-full w-full flex-col">
      <TodosTable />
    </div>
  );
};
