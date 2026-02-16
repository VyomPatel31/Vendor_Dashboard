import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getVendorById } from "../../api/vendor.api";
import { generateVendorOrders, type Order } from "../../types/vendor.types";
import { useMemo } from "react";

const VendorDetailsPage = () => {
  const { id } = useParams();

  const { data: vendor, isLoading, isError } = useQuery({
    queryKey: ["vendor", id],
    queryFn: () => getVendorById(id as string),
    enabled: !!id,
  });

  // Generate dynamic orders for this vendor - MUST be BEFORE conditional returns
  const recentOrders: Order[] = useMemo(
    () => vendor ? generateVendorOrders(vendor, 5) : [],
    [vendor]
  );

  if (isLoading) return <div className="p-6">Loading vendor...</div>;
  if (isError || !vendor)
    return <div className="p-6">Vendor not found</div>;


  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {vendor.businessName}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Vendor Details & Information</p>
      </div>

      {/* Basic Info Section - Responsive Grid */}
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold mb-4 text-gray-900">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
            <strong className="text-gray-700">Email:</strong>
            <span className="text-gray-600 break-all">{vendor.email}</span>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
            <strong className="text-gray-700">Status:</strong>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              vendor.status === "active"
                ? "bg-green-100 text-green-800"
                : vendor.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}>
              {vendor.status.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
            <strong className="text-gray-700">Rating:</strong>
            <span className="text-gray-600">⭐ {vendor.rating.toFixed(1)}</span>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
            <strong className="text-gray-700">Created:</strong>
            <span className="text-gray-600">{new Date(vendor.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Performance Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white shadow-md rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow">
          <p className="text-xs md:text-sm text-gray-600 font-medium">Total Orders</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{vendor.totalOrders}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow">
          <p className="text-xs md:text-sm text-gray-600 font-medium">Total Revenue</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
            ₹ {(vendor.totalRevenue / 1000).toFixed(1)}K
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow">
          <p className="text-xs md:text-sm text-gray-600 font-medium">Avg Delivery Time</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
            {vendor.avgDeliveryTime}
            <span className="text-sm ml-1">days</span>
          </p>
        </div>
      </div>

      {/* Orders Table - Responsive */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base md:text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 md:p-4 text-left text-xs md:text-sm font-semibold text-gray-700">Order ID</th>
                <th className="p-3 md:p-4 text-left text-xs md:text-sm font-semibold text-gray-700">Amount</th>
                <th className="p-3 md:p-4 text-left text-xs md:text-sm font-semibold text-gray-700">Status</th>
                <th className="p-3 md:p-4 text-left text-xs md:text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-t hover:bg-blue-50 transition-colors">
                  <td className="p-3 md:p-4 text-xs md:text-sm text-gray-900 font-medium">{order.id}</td>
                  <td className="p-3 md:p-4 text-xs md:text-sm text-gray-600">₹ {order.amount.toLocaleString()}</td>
                  <td className="p-3 md:p-4 text-xs md:text-sm">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 md:p-4 text-xs md:text-sm text-gray-600">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold mb-4 text-gray-900">Activity Log</h2>

        <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✔</span>
            <span>Vendor registered on {new Date(vendor.createdAt).toLocaleDateString()}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✔</span>
            <span>Current status: <strong className={vendor.status === "active" ? "text-green-600" : vendor.status === "pending" ? "text-yellow-600" : "text-red-600"}>{vendor.status.toUpperCase()}</strong></span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✔</span>
            <span>Total orders processed: <strong>{vendor.totalOrders.toLocaleString()}</strong></span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✔</span>
            <span>Average rating: <strong>⭐ {vendor.rating.toFixed(1)}/5</strong></span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✔</span>
            <span>Average delivery: <strong>{vendor.avgDeliveryTime} days</strong></span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✔</span>
            <span>Total revenue generated: <strong>₹ {(vendor.totalRevenue / 1000).toFixed(1)}K</strong></span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VendorDetailsPage;
