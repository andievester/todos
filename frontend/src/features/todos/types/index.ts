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

export interface CreateTodoPayload {
  title: string;
  description?: string | null;
  isCompleted?: boolean;
  dueDate?: string | null;
  priority?: number;
}

export interface UpdateTodoPayload {
  title: string;
  description?: string | null;
  isCompleted?: boolean;
  dueDate?: string | null;
  priority?: number;
}
