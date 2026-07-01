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

interface DeleteTodoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  todoTitle?: string;
}

export function DeleteTodoModal({
  open,
  onOpenChange,
  onConfirm,
  todoTitle,
}: DeleteTodoModalProps) {
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
          <AlertDialogCancel className="btn-surface btn-lg hover:bg-input/80 hover:text-text-primary">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="btn-lg bg-red hover:brightness-110 text-text-primary"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
