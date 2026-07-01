export const Priority = {
  Low: 0,
  Medium: 1,
  High: 2,
} as const;

export type PriorityLevel = (typeof Priority)[keyof typeof Priority];

export interface TodoItem {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  priority?: PriorityLevel;
  userId: string;
  createdAt: string;
}

export type TodoFormData = {
  title: string;
  description?: string;
  isCompleted?: boolean;
  dueDate?: Date;
  priority?: number;
};

export type CreateTodoPayload = Omit<TodoItem, "id">;
