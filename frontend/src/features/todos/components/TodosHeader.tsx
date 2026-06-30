import { Button } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";

export const TodosHeader = () => {
  return (
    <header className="flex items-center justify-between bg-background px-6 py-5 border-b border-surface">
      <div className="flex items-center gap-6">
        <h1 className="text-4xl font-semibold">My Todos</h1>
        <Button className="btn-surface btn-lg">
          <span>New</span>
          <Plus className="text-green" strokeWidth={3} />
        </Button>
      </div>
      <Button>
        <LogOut className="text-red" strokeWidth={3} />
        <span>Logout</span>
      </Button>
    </header>
  );
};
