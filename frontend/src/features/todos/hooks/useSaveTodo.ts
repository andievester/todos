import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo, updateTodo } from "../services/todos-service";
import type { TodoFormValues } from "../components/TodoForm";
import { toast } from "sonner";
import { TODOS_QUERY_KEY } from "./useTodos";

type SaveTodoArgs = {
  id?: number;
  data: TodoFormValues;
};

export function useSaveTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: SaveTodoArgs) => {
      const payload = {
        title: data.title,
        description: data.description || null,
        isCompleted: data.isCompleted ?? false,
        priority: data.priority,
        dueDate: data.dueDate ? data.dueDate.toISOString() : null,
      };

      if (id) {
        return await updateTodo(id, payload);
      }
      return await createTodo(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to save todo:", error);
      toast.error("Failed to save todo", {
        description: "Please try again.",
      });
    },
  });
}
