import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, X } from "lucide-react";
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

export type Priority = "Low" | "Medium" | "High";

type User = {
  id: string;
  name: string;
};

export type TodoItem = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
  dueDate: Date;
  priority: Priority;
  userId: string;
  user: User;
};

const mockUser: User = { id: "u-1", name: "Alex" };

const initialData: TodoItem[] = [
  {
    id: "4",
    title: "Fix broken build pipeline",
    description: "Urgent fix required",
    isCompleted: false,
    createdAt: new Date("2026-06-01T00:00:00"),
    dueDate: new Date("2026-06-20T00:00:00"),
    priority: "High",
    userId: mockUser.id,
    user: mockUser,
  },
  {
    id: "1",
    title: "Update security dependencies",
    description: "Bump all npm packages to patch CVEs",
    isCompleted: false,
    createdAt: new Date("2026-06-25T00:00:00"),
    dueDate: new Date("2026-07-02T00:00:00"),
    priority: "High",
    userId: mockUser.id,
    user: mockUser,
  },
  {
    id: "2",
    title: "Write documentation for Sync API",
    description: "Cover the interleaving algorithm",
    isCompleted: false,
    createdAt: new Date("2026-06-28T00:00:00"),
    dueDate: new Date("2026-07-05T00:00:00"),
    priority: "Medium",
    userId: mockUser.id,
    user: mockUser,
  },
  {
    id: "3",
    title: "Refactor layout structure",
    description: "Move layouts to feature folders",
    isCompleted: false,
    createdAt: new Date("2026-06-29T00:00:00"),
    dueDate: new Date("2026-08-30T00:00:00"),
    priority: "Low",
    userId: mockUser.id,
    user: mockUser,
  },
  {
    id: "4",
    title: "Completed Task 1",
    description: "",
    isCompleted: true,
    createdAt: new Date("2026-06-29T00:00:00"),
    dueDate: new Date("2026-07-30T00:00:00"),
    priority: "Low",
    userId: mockUser.id,
    user: mockUser,
  },
  {
    id: "5",
    title: "Completed Task 2",
    description: "",
    isCompleted: true,
    createdAt: new Date("2026-06-29T00:00:00"),
    dueDate: new Date("2026-06-30T00:00:00"),
    priority: "Low",
    userId: mockUser.id,
    user: mockUser,
  },
];

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

// TODO: refactor some of this
// TODO: pass in value for show completed and filter tasks

interface TodosTableProps {
  onRowClick?: (todo: TodoItem) => void;
}

export const TodosTable = ({ onRowClick }: TodosTableProps) => {
  const [data, setData] = useState<TodoItem[]>(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);

  // const handleDelete = (id: string) => {
  //   setData((prev) => prev.filter((item) => item.id !== id));
  // };

  const [isDeleting, setIsDeleting] = useState(false);

  const columns = [
    columnHelper.accessor("title", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Task
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => {
        // Only mark as overdue if the date has passed AND it is not completed
        const isOverdue =
          isBefore(info.row.original.dueDate, startOfDay(new Date())) &&
          !info.row.original.isCompleted;

        return (
          <div className="flex items-center gap-3">
            {isOverdue && (
              <span className="text-[10px] text-red border border-red rounded px-1.5 py-0.5 uppercase tracking-wider">
                Overdue
              </span>
            )}
            <span className="text-text-primary font-medium">
              {info.getValue()}
            </span>
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => {
        // Only mark as overdue if the date has passed AND it is not completed
        const isOverdue =
          isBefore(info.row.original.dueDate, startOfDay(new Date())) &&
          !info.row.original.isCompleted;

        return (
          <span
            className={isOverdue ? "text-red font-medium" : "text-text-primary"}
          >
            {format(info.getValue(), "MMM d, yyyy")}
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: (info) => {
        const priority = info.getValue();
        const colorClass =
          priority === "High"
            ? "text-red"
            : priority === "Medium"
            ? "text-yellow"
            : "text-green";

        return <span className={`${colorClass}`}>{priority}</span>;
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => {
        const { id, title } = info.row.original;

        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleting(true);
              }}
              className="text-text-primary/50 hover:text-red hover:bg-red/10"
            >
              <X strokeWidth={3} />
            </Button>

            <DeleteTodoModal
              open={isDeleting}
              onOpenChange={setIsDeleting}
              onConfirm={() => {
                console.log(id);
                setIsDeleting(false);
              }}
              todoTitle={title}
            />
          </div>
        );
      },
    }),
  ];

  // TODO: check this warning

  const table = useReactTable({
    data,
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
                    className={`border-b border-input py-2 text-text-primary ${getColumnClasses(
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={`group border-none bg-input drop-shadow-sm transition-all hover:bg-input/80 hover:drop-shadow-md cursor-pointer [&>td:first-child]:rounded-l-2xl [&>td:last-child]:rounded-r-2xl ${
                    row.original.isCompleted ? "line-through opacity-60" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`py-2 ${getColumnClasses(cell.column.id)}`}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
