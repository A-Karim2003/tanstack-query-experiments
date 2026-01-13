import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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

const columnHelper = createColumnHelper();

export default function TableContainer() {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 2,
  });

  const {
    data: todos = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodo,
  });

  //? Define columns
  /* columns array is used for defining the columns for the table. Each object in the array represents a column.
   */
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
      sortingFn: (rowA, rowB) => {
        const rowACategory = rowA.original.category;
        const rowBCategory = rowB.original.category;

        return rowACategory.localeCompare(rowBCategory);
      },
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

  function handleFiltering(e) {
    const value = e.target.value;
    table.setGlobalFilter(value);
  }

  //? Create table instant
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: todos,
    columns,
    state: { sorting, globalFilter, pagination }, // Describes how data is manipulated

    getCoreRowModel: getCoreRowModel(), // processes raw data into rows that the table can use.
    getSortedRowModel: getSortedRowModel(), // sorts rows based on `sorting` state
    getFilteredRowModel: getFilteredRowModel(), // needed for client-side global filtering
    getPaginationRowModel: getPaginationRowModel(),

    globalFilterFn: "includesString",
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error loading todos</div>;

  return (
    <div className="max-w-300 w-full m-auto mt-10">
      <div className="flex justify-between p-2">
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="border border-slate-200 shadow-md shadow-amber-200 rounded-lg w-100 p-2"
            value={globalFilter ?? ""}
            onChange={handleFiltering}
          />
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
          <option value="category">Category</option>
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
      <div className="flex items-center justify-between py-4">
        <div className="">
          <div>
            Showing <b>{pagination.pageIndex + 1}</b> to <b>10</b> of{" "}
            <b>{todos.length}</b> results
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          {/* First Page Button */}
          <button
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {"<<"}
          </button>

          {/* Previous Page Button */}
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {"<"}
          </button>

          {/* Next Page Button */}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {">"}
          </button>

          {/* Last Page Button */}
          <button
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {">>"}
          </button>

          {/* Page Info */}
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>

          {/* Page Size Selector */}
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border p-1 rounded"
          >
            {[5, 10, 20].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
