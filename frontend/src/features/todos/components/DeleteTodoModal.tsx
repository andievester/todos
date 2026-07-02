import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "./services/todos-service"; // Adjust path as needed
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react"; // Optional: for loading state

interface DeleteTodoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todoId?: number | string; // Pass the ID instead of a confirm function
  todoTitle?: string;
}

export function DeleteTodoModal({
  open,
  onOpenChange,
  todoId,
  todoTitle,
}: DeleteTodoModalProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await deleteTodo(id);
    },
    onSuccess: () => {
      // 1. Refresh the table
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      // 2. Close the modal
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Failed to delete todo:", error);
    },
  });

  const handleDelete = () => {
    if (todoId) {
      deleteMutation.mutate(Number(todoId));
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-surface border-input text-text-primary">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this todo:
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="italic">"{todoTitle}"?</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleteMutation.isPending}
            className="btn-surface btn-lg hover:bg-input/80 hover:text-text-primary"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={deleteMutation.isPending}
            className="btn-lg bg-red hover:brightness-110 text-text-primary"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
