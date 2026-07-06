import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "../services/todos-service";
import { toast } from "sonner";
import { TODOS_QUERY_KEY } from "./useTodos";

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await deleteTodo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to delete todo:", error);
      toast.error("Failed to delete todo", {
        description: "Please try again.",
      });
    },
  });
}
