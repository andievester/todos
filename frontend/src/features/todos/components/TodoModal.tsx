import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TodoForm, type TodoFormValues } from "./TodoForm";

interface TodoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo?: TodoFormValues | null;
}

export function TodoModal({ open, onOpenChange, todo }: TodoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <TodoForm initialData={todo} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
