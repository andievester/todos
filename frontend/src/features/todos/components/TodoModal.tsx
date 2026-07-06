import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TodoForm } from "./TodoForm";
import type { TodoItem } from "../types";

interface TodoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo?: TodoItem | null;
}

export function TodoModal({ open, onOpenChange, todo }: TodoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
        className="max-h-[90dvh] overflow-y-auto"
      >
        <TodoForm initialData={todo} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
