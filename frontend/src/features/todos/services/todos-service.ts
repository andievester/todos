import { axiosInstance } from "@/lib/axios";
import type { CreateTodoPayload, TodoItem, UpdateTodoPayload } from "../types";

const TODOS_API_ENDPOINT = "/todos";

export const getTodos = async (): Promise<TodoItem[]> => {
  const response = await axiosInstance.get<TodoItem[]>(TODOS_API_ENDPOINT);
  return response.data;
};

export const createTodo = async (
  data: CreateTodoPayload
): Promise<TodoItem> => {
  const response = await axiosInstance.post<TodoItem>(TODOS_API_ENDPOINT, data);
  return response.data;
};

export const updateTodo = async (
  id: number,
  data: UpdateTodoPayload
): Promise<TodoItem> => {
  const response = await axiosInstance.put<TodoItem>(
    `${TODOS_API_ENDPOINT}/${id}`,
    data
  );
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${TODOS_API_ENDPOINT}/${id}`);
};
