import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
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
import { useState } from "react";

const columnHelper = createColumnHelper("id");

export default function TableContainer() {
  const [sorting, setSorting] = useState([]);

  const {
    data: todos = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodo,
  });

  console.log(sorting);

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
      sortingFn: "datetime",
    }),

    columnHelper.accessor("priority", {
      header: () => (
        <span className="flex items-center gap-2">
          <CircleAlert /> Priority
        </span>
      ),
      cell: (info) => info.getValue(),
      sortingFn: (rowA, rowB) => {
        const priorityOrder = { Low: 1, Medium: 2, High: 3 };
        const a = priorityOrder[rowA.original.priority] || 0;
        const b = priorityOrder[rowB.original.priority] || 0;

        return a - b;
      },
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

  function handleSorting(e) {
    const value = e.target.value;
    if (!value) return setSorting([]);

    setSorting([{ id: value, desc: false }]);
  }

  //? Create table instant
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: todos,
    columns,
    state: { sorting }, // sorting state
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error loading todos</div>;

  return (
    <div className="max-w-300 w-full m-auto mt-10">
      <div className="flex justify-between p-2">
        <div>
          <input type="text" />
        </div>

        <select
          className="shadow-md p-2 rounded-lg focus:outline-0"
          value={sorting[0]?.id || ""}
          onChange={handleSorting}
        >
          <option value="" disabled>
            Sort by
          </option>
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
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
          {table.getRowModel().rows.map((row) => {
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
