import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TodosHeaderProps {
  onOpenNewTodo: () => void;
}

export const TodosHeader = ({ onOpenNewTodo }: TodosHeaderProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <header className="flex items-center justify-between bg-background px-6 py-5 border-b border-surface">
      <div className="flex items-center gap-6">
        <h1 className="text-4xl font-semibold">My Todos</h1>
        <Button className="btn-surface btn-lg" onClick={onOpenNewTodo}>
          <span>New</span>
          <Plus className="text-green" strokeWidth={3} />
        </Button>
      </div>
      <Button className="p-0" onClick={handleLogout}>
        <LogOut className="text-red" strokeWidth={3} />
        <span>Logout</span>
      </Button>
    </header>
  );
};
