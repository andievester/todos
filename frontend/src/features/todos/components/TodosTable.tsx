import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, X } from "lucide-react";
import { format, isBefore, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteTodoModal } from "./DeleteTodoModal";
import type { TodoItem } from "../types";
import { PRIORITY_MAP } from "@/utils/constants";
import { cn } from "@/components/lib/utils";

export type User = {
  id: string;
  name: string;
};

const columnHelper = createColumnHelper<TodoItem>();

const getColumnClasses = (columnId: string) => {
  switch (columnId) {
    case "title":
      return "w-full px-6";
    case "dueDate":
      return "w-[150px] px-6";
    case "priority":
      return "w-[120px] text-right px-6";
    case "actions":
      return "w-[60px] text-right pr-6";
    default:
      return "px-6";
  }
};

interface TodosTableProps {
  todos: TodoItem[];
  onRowClick?: (todo: TodoItem) => void;
  isLoading?: boolean;
  isError?: boolean;
}

const SortIcon = ({ isSorted }: { isSorted: false | "asc" | "desc" }) => {
  const iconClasses = "ml-2 h-4 w-4";

  if (isSorted === "asc") return <ArrowUp className={iconClasses} />;
  if (isSorted === "desc") return <ArrowDown className={iconClasses} />;
  return <ArrowUpDown className={iconClasses} />;
};

export const TodosTable = ({
  todos,
  onRowClick,
  isLoading,
  isError,
}: TodosTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deletingTodo, setDeletingTodo] = useState<TodoItem | null>(null);

  const columns = [
    columnHelper.accessor("title", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Task
          <SortIcon isSorted={column.getIsSorted()} />
        </Button>
      ),
      cell: (info) => {
        const dueDate = info.row.original.dueDate;

        const isOverdue = dueDate
          ? isBefore(new Date(dueDate), startOfDay(new Date())) &&
            !info.row.original.isCompleted
          : false;

        return (
          <div className="flex items-center gap-3">
            {isOverdue && (
              <span className="text-[10px] text-red border border-red rounded px-1.5 py-0.5 uppercase tracking-wider font-semibold">
                Overdue
              </span>
            )}
            <span className="font-medium">{info.getValue() as string}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("dueDate", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Due Date
          <SortIcon isSorted={column.getIsSorted()} />
        </Button>
      ),
      cell: (info) => {
        const dateValue = info.getValue() as string | undefined;
        const dueDate = info.row.original.dueDate;

        const isOverdue = dueDate
          ? isBefore(new Date(dueDate), startOfDay(new Date())) &&
            !info.row.original.isCompleted
          : false;

        if (!dateValue) {
          return <span className="italic text-muted-foreground">Not set</span>;
        }

        return (
          <span className={cn("font-medium", isOverdue && "text-red")}>
            {format(new Date(dateValue), "MMM d, yyyy")}
          </span>
        );
      },
    }),
    columnHelper.accessor("priority", {
      header: ({ column }) => (
        <div className="flex justify-end w-full">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-mr-4"
          >
            Priority
            <SortIcon isSorted={column.getIsSorted()} />
          </Button>
        </div>
      ),
      cell: (info) => {
        const priorityValue = Number(
          info.getValue()
        ) as keyof typeof PRIORITY_MAP;

        const { label, colorClass } =
          PRIORITY_MAP[priorityValue] || PRIORITY_MAP[0];

        return <span className={cn(colorClass, "font-medium")}>{label}</span>;
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => {
        const todo = info.row.original;

        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setDeletingTodo(todo);
              }}
              className="text-muted-foreground hover:text-red hover:bg-red/30"
            >
              <X strokeWidth={3} />
            </Button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: todos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="flex h-full w-full flex-col">
      <div className="z-10 bg-surface">
        <Table className="table-fixed border-separate border-spacing-0 border-none bg-transparent w-full">
          <TableHeader className="border-none [&_tr]:border-none">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`border-b border-input py-2 ${getColumnClasses(
                      header.column.id
                    )}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
        </Table>
      </div>
      <div className="flex-1 overflow-y-auto pt-2">
        <Table className="table-fixed border-separate border-spacing-y-2 border-none bg-transparent w-full">
          <TableBody>
            {isLoading ? (
              <TableRow className="bg-transparent hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <span className="text-muted-foreground font-medium">
                    Loading...
                  </span>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow className="bg-transparent hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <span className="text-red font-medium">
                    Error loading todos.
                  </span>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={`group border-none bg-input drop-shadow-sm transition-all hover:bg-input/80 hover:drop-shadow-md cursor-pointer [&>td:first-child]:rounded-l-2xl [&>td:last-child]:rounded-r-2xl ${
                    row.original.isCompleted ? "line-through" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`py-2 ${getColumnClasses(cell.column.id)} ${
                        row.original.isCompleted && cell.column.id !== "actions"
                          ? "opacity-50"
                          : ""
                      }`}
                      onClick={(e) => {
                        if (cell.column.id === "actions") {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="bg-transparent hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <span className="font-medium">
                    No todos yet. Create one using the New + button!
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DeleteTodoModal
        open={!!deletingTodo}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeletingTodo(null);
        }}
        todoId={deletingTodo?.id}
        todoTitle={deletingTodo?.title}
      />
    </div>
  );
};
