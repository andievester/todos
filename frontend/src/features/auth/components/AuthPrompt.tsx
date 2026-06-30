import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AuthPromptProps {
  message: string;
  actionText: string;
  path: "/login" | "/signup";
}

export function AuthPrompt({ message, actionText, path }: AuthPromptProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center text-sm text-muted-foreground">
      <span>{message}</span>
      <Button
        type="button"
        variant="link"
        className="ml-1.5 h-auto p-0 font-semibold"
        onClick={() => navigate(path)}
      >
        {actionText}
      </Button>
    </div>
  );
}
