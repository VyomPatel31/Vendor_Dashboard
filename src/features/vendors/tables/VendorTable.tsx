import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getVendorColumns } from "./VendorColumns";
import type { Vendor } from "../../../types/vendor.types";
import { useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import type { RowSelectionState } from "@tanstack/react-table";

interface Props {
  data: Vendor[];
  onSelectionChange?: (count: number, selectedIds: string[], selectedStatuses: string[], selectedRows?: any[]) => void;
  onStatusChange?: (vendorId: string, newStatus: string) => void;
  isScrollableContent?: boolean;
}

const VendorTable = ({ data, onSelectionChange, onStatusChange, isScrollableContent = false }: Props) => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  // row selection state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = getVendorColumns(onStatusChange);

  const handleSelectionChange = (updater: any) => {
    const newSelection = typeof updater === "function" ? updater(rowSelection) : updater;
    setRowSelection(newSelection);
    const selectedCount = Object.keys(newSelection).length;
    const selectedIds = Object.keys(newSelection).map(index => data[parseInt(index)].id);
    const selectedStatuses = Object.keys(newSelection).map(index => data[parseInt(index)].status);
    const selectedRows = Object.keys(newSelection).map(index => ({ original: data[parseInt(index)] }));
    onSelectionChange?.(selectedCount, selectedIds, selectedStatuses, selectedRows);
  };

  const table = useReactTable({
    data,
    columns,

    

    state: {
      sorting,
      rowSelection,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: handleSelectionChange,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    autoResetExpanded: false,
  });

  

  return (
    <div className={`flex flex-col h-full ${isScrollableContent ? "" : "border rounded-lg overflow-hidden bg-white shadow"}`}>
      {/* Table Section - Scrollable */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <div className="inline-block min-w-full">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="p-2 md:p-3 text-left font-semibold text-gray-700 text-xs md:text-sm cursor-pointer hover:bg-gray-200 transition-colors whitespace-nowrap"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={table.getAllColumns().length} className="p-6 text-center text-gray-500">
                    No vendors found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    className="border-t hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className="p-2 md:p-3 text-xs md:text-sm cursor-pointer"
                        onClick={() => cell.column.id !== "actions" && navigate(`/vendors/${row.original.id}`)}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination - Sticky at Bottom */}
      <div className={`flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 p-3 md:p-4 flex-shrink-0 ${
        isScrollableContent 
          ? "border-t bg-gray-50 rounded-b-lg" 
          : "border-t bg-gray-50"
      }`}>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 md:px-4 py-2 border border-gray-300 rounded text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            ← Previous
          </button>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 md:px-4 py-2 border border-gray-300 rounded text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            Next →
          </button>
        </div>

        <span className="text-xs md:text-sm text-gray-600 font-medium">
          Page <span className="font-bold">{table.getState().pagination.pageIndex + 1}</span> of{" "}
          <span className="font-bold">{table.getPageCount()}</span>
        </span>

        <select
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[5, 10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default VendorTable;
