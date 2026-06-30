import { TodosHeader } from "../components/TodosHeader";
import { TodosTable } from "../components/TodosTable";

export const TodosPage = () => {
  return (
    <div className="page-root bg-background text-text-primary">
      <TodosHeader />

      <main className="flex-1 p-6 md:p-8 overflow-hidden">
        <div className="mx-auto max-w-6xl h-full">
          <div className="rounded-2xl bg-surface px-4 pb-2 flex h-full w-full flex-col border border-input drop-shadow-sm">
            <TodosTable />
          </div>
        </div>
      </main>
    </div>
  );
};
