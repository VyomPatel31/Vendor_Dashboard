import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { getVendors, bulkUpdateVendorStatus, bulkDeleteVendors } from "../../api/vendor.api";
import type { Vendor } from "../../types/vendor.types";
import VendorTable from "./tables/VendorTable";
import toast from "react-hot-toast";

const VendorsPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendors"],
    queryFn: getVendors,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusCounts, setStatusCounts] = useState({ active: 0, suspended: 0, pending: 0 });

  // Bulk status update mutation
  const bulkStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: string }) =>
      bulkUpdateVendorStatus({ ids, status: status as any }),
    onSuccess: (updatedVendors, { ids, status }) => {
      // Update cache without refetching to preserve pagination
      queryClient.setQueryData(["vendors"], (oldData: Vendor[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(vendor =>
          ids.includes(vendor.id) ? { ...vendor, status: status as any } : vendor
        );
      });
      
      // Update selected rows with new status without clearing selection
      const updatedRows = selectedRows.map(row => {
        if (ids.includes(row.original.id)) {
          return { ...row, original: { ...row.original, status } };
        }
        return row;
      });
      setSelectedRows(updatedRows);
      
      // Recalculate status counts
      const newCounts = {
        active: updatedRows.filter(r => r.original.status === "active").length,
        suspended: updatedRows.filter(r => r.original.status === "suspended").length,
        pending: updatedRows.filter(r => r.original.status === "pending").length,
      };
      setStatusCounts(newCounts);
      
      toast.success("Vendor status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update vendor status");
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => bulkDeleteVendors(ids),
    onSuccess: (_, ids) => {
      // Update cache without refetching to preserve pagination
      queryClient.setQueryData(["vendors"], (oldData: Vendor[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.filter(vendor => !ids.includes(vendor.id));
      });
      toast.success("Vendors deleted successfully");
      setSelectedCount(0);
      setSelectedRows([]);
      setSelectedIds([]);
    },
    onError: () => {
      toast.error("Failed to delete vendors");
    },
  });

  const handleBulkStatusChange = (status: string) => {
    if (selectedIds.length === 0) return;
    bulkStatusMutation.mutate({ ids: selectedIds, status });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.length} vendor(s)? This action cannot be undone.`)) {
      bulkDeleteMutation.mutate(selectedIds);
    }
  };


  const filteredVendors = useMemo(() => {
    

  if (!data) return [];

  return data.filter(vendor => {
    const matchesSearch =
      vendor.businessName.toLowerCase().includes(search.toLowerCase()) ||
      vendor.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || vendor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}, [data, search, statusFilter]);


  if (isLoading) return <div className="p-6">Loading vendors...</div>;
  if (isError) return <div className="p-6">Failed to load vendors</div>;

  const handleStatusChange = (vendorId: string, newStatus: string) => {
    // Update selectedRows if the changed vendor is in the selection
    const updatedRows = selectedRows.map(row =>
      row.original.id === vendorId
        ? { ...row, original: { ...row.original, status: newStatus } }
        : row
    );
    setSelectedRows(updatedRows);

    // Recalculate status counts
    const newCounts = {
      active: updatedRows.filter(r => r.original.status === "active").length,
      suspended: updatedRows.filter(r => r.original.status === "suspended").length,
      pending: updatedRows.filter(r => r.original.status === "pending").length,
    };
    setStatusCounts(newCounts);
  };

  return (
    <div className="p-4 md:p-6 h-screen flex flex-col">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Vendors</h1>

      {/* Search, Filter, and Count Section - Fixed at Top */}
      <div className="bg-white shadow rounded p-4 md:p-6 mb-4 flex-shrink-0">
        <div className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
          {/* Search Input */}
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full border border-gray-300 p-2 md:p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-ring"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-ring cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Selected Count Section - Mobile Responsive */}
        {selectedCount > 0 && (
          <div className="mt-4 md:mt-0 p-3 bg-blue-50 rounded border border-blue-200">
            <div className="flex flex-col gap-3">
              {/* Count Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Selected: </span>
                  <span className="text-blue-600 font-bold">{selectedCount}</span>
                </div>
                {statusCounts.active > 0 && (
                  <div>
                    <span className="font-semibold text-gray-700">Active: </span>
                    <span className="text-green-600 font-bold">{statusCounts.active}</span>
                  </div>
                )}
                {statusCounts.suspended > 0 && (
                  <div>
                    <span className="font-semibold text-gray-700">Suspended: </span>
                    <span className="text-red-600 font-bold">{statusCounts.suspended}</span>
                  </div>
                )}
                {statusCounts.pending > 0 && (
                  <div>
                    <span className="font-semibold text-gray-700">Pending: </span>
                    <span className="text-yellow-600 font-bold">{statusCounts.pending}</span>
                  </div>
                )}
              </div>

              {/* Bulk Action Buttons */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                <button
                  onClick={() => handleBulkStatusChange("active")}
                  disabled={bulkStatusMutation.isPending || bulkDeleteMutation.isPending}
                  className="px-3 py-2 bg-green-600 text-white text-xs md:text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {bulkStatusMutation.isPending ? "Updating..." : "Set Active"}
                </button>
                <button
                  onClick={() => handleBulkStatusChange("suspended")}
                  disabled={bulkStatusMutation.isPending || bulkDeleteMutation.isPending}
                  className="px-3 py-2 bg-red-600 text-white text-xs md:text-sm rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {bulkStatusMutation.isPending ? "Updating..." : "Suspend"}
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkStatusMutation.isPending || bulkDeleteMutation.isPending}
                  className="px-3 py-2 bg-gray-800 text-white text-xs md:text-sm rounded hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {bulkDeleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Table Container */}
      <div className="flex-1 min-h-0 overflow-y-auto rounded-lg shadow bg-white mb-4">
        <VendorTable 
          data={filteredVendors} 
          onSelectionChange={(count, ids, statuses, rows = []) => {
            setSelectedCount(count);
            setSelectedRows(rows);
            setSelectedIds(ids);
            
            // Calculate counts by status
            const counts = {
              active: statuses.filter(s => s === "active").length,
              suspended: statuses.filter(s => s === "suspended").length,
              pending: statuses.filter(s => s === "pending").length,
            };
            setStatusCounts(counts);
          }}
          onStatusChange={handleStatusChange}
          isScrollableContent={true}
        />
      </div>
    </div>
  );
};

export default VendorsPage;
