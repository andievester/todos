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
import { Loader2 } from "lucide-react";
import { useDeleteTodo } from "../hooks/useDeleteTodo";

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
  const { mutate: deleteTodo, isPending: isPendingDelete } = useDeleteTodo();
  const handleDelete = () => {
    if (todoId) {
      deleteTodo(Number(todoId), {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

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
          <AlertDialogCancel disabled={isPendingDelete}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPendingDelete}
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
