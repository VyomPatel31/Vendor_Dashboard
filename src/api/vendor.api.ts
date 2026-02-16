import { api } from "./axios";
import type { Vendor } from "../types/vendor.types";

// GET all vendors
export const getVendors = async (): Promise<Vendor[]> => {
  const response = await api.get("/vendors");
  return response.data.vendor;
};

// GET vendor by ID
export const getVendorById = async (id: string): Promise<Vendor> => {
  const response = await api.get(`/vendors/${id}`);
  return response.data.vendor;
};

// UPDATE vendor status
export const updateVendorStatus = async ({
  id,
  status,
}: {
  id: string;
  status: Vendor["status"];
}): Promise<Vendor> => {
  const response = await api.patch(`/vendors/${id}/status`, { status });
  return response.data.vendor;
};

// BULK UPDATE vendor status
export const bulkUpdateVendorStatus = async ({
  ids,
  status,
}: {
  ids: string[];
  status: Vendor["status"];
}): Promise<void> => {
  await api.patch("/vendors/bulk/status", { ids, status });
};

// BULK DELETE vendors
export const bulkDeleteVendors = async (ids: string[]): Promise<void> => {
  await api.delete("/vendors/bulk", { data: { ids } });
};
