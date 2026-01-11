import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CalendarClock,
  CircleAlert,
  CircleDashed,
  LayoutGrid,
} from "lucide-react";
import { fetchTodo } from "../services/todoAPI";

import { ClipboardList } from "lucide-react";

const columnHelper = createColumnHelper("id");

export default function TableContainer() {
  const {
    data: todos = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodo,
  });

  //? Define columns
  const columns = [
    columnHelper.accessor("task", {
      header: () => (
        <span className="flex items-center gap-2">
          <ClipboardList /> Task
        </span>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("due_date", {
      header: () => (
        <span className="flex items-center gap-2">
          <CalendarClock /> Due Date
        </span>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("priority", {
      header: () => (
        <span className="flex items-center gap-2">
          <CircleAlert /> Priority
        </span>
      ),
      cell: (info) => info.value,
    }),

    columnHelper.accessor("category", {
      header: () => (
        <span className="flex items-center gap-2">
          <LayoutGrid /> Category
        </span>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("completed", {
      header: () => (
        <span className="flex items-center gap-2">
          <CircleDashed /> Status
        </span>
      ),
      cell: (info) => (info.getValue() ? "done" : "pending"),
    }),
  ];

  //? Create table instant

  const table = useReactTable({
    data: todos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error loading todos</div>;

  return (
    <div className="max-w-300 w-full m-auto mt-10">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-gray-100 text-left border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row, i) => {
            const priority = row.original.priority;

            const priorityClass =
              priority === "High"
                ? "border-red-500 bg-red-50"
                : priority === "Medium"
                ? "border-yellow-500 bg-yellow-50"
                : "border-green-500 bg-green-50";
            return (
              <tr key={row.id} className={`${priorityClass}`}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
