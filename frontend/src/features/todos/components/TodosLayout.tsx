import type { ReactNode } from "react";
import { TodosHeader } from "./TodosHeader";

type TodosLayoutProps = {
  children?: ReactNode;
};

// renders header and children (the todospage)

export const TodosLayout = ({ children }: TodosLayoutProps) => {
  return (
    <div className="page-root">
      <TodosHeader />

      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="mx-auto max-w-6xl h-full">{children}</div>
      </main>
    </div>
  );
};
