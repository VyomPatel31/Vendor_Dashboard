import type { ColumnDef } from "@tanstack/react-table";
import type { Vendor } from "../../../types/vendor.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVendorStatus } from "../../../api/vendor.api";
import toast from "react-hot-toast";

// Action Cell Component
const ActionCell = ({ row, onStatusChange }: { row: any; onStatusChange?: (vendorId: string, newStatus: string) => void }) => {
  const queryClient = useQueryClient();
  const vendor = row.original;

  const mutation = useMutation({
    mutationFn: (newStatus: Vendor["status"]) =>
      updateVendorStatus({ id: vendor.id, status: newStatus }),
    onSuccess: (_, newStatus) => {
      // Update cache without refetching to preserve pagination
      queryClient.setQueryData(["vendors"], (oldData: Vendor[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(v => (v.id === vendor.id ? { ...v, status: newStatus } : v));
      });
      toast.success("Vendor status updated");
      // Update the count when status changes
      onStatusChange?.(vendor.id, newStatus);
    },
    onError: () => {
      toast.error("Failed to update vendor status");
    },
  });

  return (
    <div className="flex gap-2">
      {vendor.status === "active" ? (
        <button
          className="text-red-600 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            mutation.mutate("suspended");
          }}
        >
          Suspend
        </button>
      ) : (
        <button
          className="text-green-600 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            mutation.mutate("active");
          }}
        >
          Active
        </button>
      )}
    </div>
  );
};

export const getVendorColumns = (onStatusChange?: (vendorId: string, newStatus: string) => void): ColumnDef<Vendor>[] => [


  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        onClick={(e) => e.stopPropagation()}
      />
    ),
  },

  {
    accessorKey: "businessName",
    header: "Vendor Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
    


      return (
        <span
          className={`px-2 py-1 rounded text-sm ${
            status === "active"
              ? "bg-green-100 text-green-700"
              : status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "totalOrders",
    header: "Orders",
  },
  {
    accessorKey: "totalRevenue",
    header: "Revenue",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    header: "Actions",
    cell: (props) => <ActionCell row={props.row} onStatusChange={onStatusChange} />,
  },
];
