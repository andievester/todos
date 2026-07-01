import { useState } from "react";
import { TodosHeader } from "../components/TodosHeader";
import { TodosTable, type TodoItem } from "../components/TodosTable";
import { TodoModal } from "../components/TodoModal";

export const TodosPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);

  const handleOpenNew = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleEdit = (todo: TodoItem) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  return (
    <div className="page-root bg-background text-text-primary">
      <TodosHeader onOpenNewTodo={handleOpenNew} />

      <main className="flex-1 p-6 md:p-8 overflow-hidden">
        <div className="mx-auto max-w-6xl h-full">
          <div className="rounded-2xl bg-surface px-4 pb-2 flex h-full w-full flex-col border border-input drop-shadow-sm">
            <TodosTable onRowClick={handleEdit} />
          </div>
        </div>
      </main>

      <TodoModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        todo={editingTodo}
      />
    </div>
  );
};
