import { useQuery } from "@tanstack/react-query";
import { getTodos } from "../services/todos-service";

export const TODOS_QUERY_KEY = ["todos"];

export function useTodos() {
  return useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: getTodos,
  });
}
