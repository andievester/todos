import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "../services/todos-service";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DeleteTodoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todoId?: number | string;
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
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Failed to delete todo:", error);

      toast.error("Failed to delete todo", {
        description: "Please try again.",
      });
    },
  });

  const handleDelete = () => {
    if (todoId) {
      deleteMutation.mutate(Number(todoId));
    }
  };

  const isPendingDelete = deleteMutation.isPending;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this todo:
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="italic">"{todoTitle}"?</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={deleteMutation.isPending}
            className="bg-red hover:brightness-120"
          >
            {isPendingDelete ? (
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
