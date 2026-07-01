import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TodosHeader } from "../components/TodosHeader";
import { TodosTable } from "../components/TodosTable";
import { TodoModal } from "../components/TodoModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getTodos } from "../components/services/todos-service";
import type { TodoItem } from "../types";
import type { TodoFormValues } from "../components/TodoForm";

export const TodosPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoFormValues | null>(null);
  const [showCompleted, setShowCompleted] = useState<boolean>(false);

  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const handleOpenNew = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleEdit = (todo: TodoItem) => {
    const todoForForm = {
      ...todo,
      dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
    };

    setEditingTodo(todoForForm);
    setIsModalOpen(true);
  };

  const displayedTodos = showCompleted
    ? todos
    : todos.filter((todo) => !todo.isCompleted);

  console.log("displayedtodos:", displayedTodos);

  return (
    <div className="page-root">
      <TodosHeader onOpenNewTodo={handleOpenNew} />

      <main className="flex-1 md:p-6 overflow-hidden">
        <div className="mx-auto h-full flex flex-col">
          <div className="flex flex-row items-center justify-end space-x-2 pb-4 pr-4">
            <Checkbox
              id="is-completed-input"
              className="cursor-pointer"
              checked={showCompleted}
              onCheckedChange={() => setShowCompleted((prev) => !prev)}
            />
            <Label htmlFor="is-completed-input">Show completed</Label>
          </div>

          <div className="min-h-0 rounded-2xl bg-surface px-4 pb-2 flex w-full flex-col border border-input drop-shadow-sm">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading...
              </div>
            ) : isError ? (
              <div className="p-4 text-center text-destructive">
                Failed to load todos.
              </div>
            ) : (
              <TodosTable todos={displayedTodos} onRowClick={handleEdit} />
            )}
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
