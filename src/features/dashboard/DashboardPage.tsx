import { useQuery } from "@tanstack/react-query";
import { getVendors } from "../../api/vendor.api";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import StatCard from "../../components/StatCard";

const DashboardPage = () => {
  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: getVendors,
  });

  if (isLoading) return <div className="p-6">Loading dashboard...</div>;

  const totalVendors = vendors.length;

  const active = vendors.filter(v => v.status === "active").length;
  const pending = vendors.filter(v => v.status === "pending").length;
  const suspended = vendors.filter(v => v.status === "suspended").length;

  const totalRevenue = vendors.reduce(
    (sum, v) => sum + v.totalRevenue,
    0
  );

  const totalOrders = vendors.reduce(
    (sum, v) => sum + v.totalOrders,
    0
  );

  const avgRating =
    vendors.reduce((sum, v) => sum + v.rating, 0) /
    (vendors.length || 1);

  const avgDeliveryTime =
    vendors.reduce((sum, v) => sum + v.avgDeliveryTime, 0) /
    (vendors.length || 1);

  // Monthly Growth Data
  const monthlyGrowth = vendors.reduce((acc: any, vendor) => {
    const month = new Date(vendor.createdAt).toLocaleString("default", {
      month: "short",
    });

    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const growthData = Object.entries(monthlyGrowth).map(
    ([month, count]) => ({
      month,
      count,
    })
  );

  // Orders Distribution by Range
  const orderBuckets = [
    { range: "0-50", count: 0 },
    { range: "51-200", count: 0 },
    { range: "201-500", count: 0 },
    { range: "500+", count: 0 },
  ];

  vendors.forEach(v => {
    if (v.totalOrders <= 50) orderBuckets[0].count++;
    else if (v.totalOrders <= 200) orderBuckets[1].count++;
    else if (v.totalOrders <= 500) orderBuckets[2].count++;
    else orderBuckets[3].count++;
  });

  // Top 5 Vendors by Orders
  const topVendors = vendors
    .sort((a, b) => b.totalOrders - a.totalOrders)
    .slice(0, 5)
    .map(v => ({
      name: v.businessName.substring(0, 15),
      orders: v.totalOrders,
    }));

  // Monthly Revenue Trend
  const monthlyRevenue = vendors.reduce((acc: any, vendor) => {
    const month = new Date(vendor.createdAt).toLocaleString("default", {
      month: "short",
    });

    acc[month] = (acc[month] || 0) + vendor.totalRevenue;
    return acc;
  }, {});

  const revenueTrendData = Object.entries(monthlyRevenue).map(
    ([month, revenue]) => ({
      month,
      revenue,
    })
  );

  // Vendor Status for Pie Chart
  const statusData = [
    { name: "Active", value: active },
    { name: "Pending", value: pending },
    { name: "Suspended", value: suspended },
  ];



  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Summary Cards - 8 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="Total Vendors" value={totalVendors} />
        <StatCard title="Active Vendors" value={active} />
        <StatCard title="Pending Vendors" value={pending} />
        <StatCard title="Suspended Vendors" value={suspended} />
        <StatCard title="Total Revenue" value={`₹ ${(totalRevenue / 1000).toFixed(1)}K`} />
        <StatCard title="Total Orders" value={totalOrders.toLocaleString()} />
        <StatCard title="Avg Rating" value={avgRating.toFixed(2)} />
        <StatCard title="Avg Delivery Time" value={`${avgDeliveryTime.toFixed(1)} days`} />
      </div>

      {/* Line Chart - Vendor Growth */}
      <div className="bg-white shadow rounded p-4 md:p-6 overflow-x-auto">
        <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">Vendor Growth (Line Chart)</h2>
        <p className="text-xs md:text-sm text-gray-500 mb-4">X-axis: Months | Y-axis: Number of Vendors added</p>
        <ResponsiveContainer width="100%" height={250} minWidth={300}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Grid - Responsive Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Pie Chart - Vendor Status Distribution */}
        <div className="bg-white shadow rounded p-4 md:p-6 overflow-x-auto">
          <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">Vendor Status Distribution</h2>
          <p className="text-xs md:text-sm text-gray-500 mb-4">Pie/Donut Chart</p>
          <ResponsiveContainer width="100%" height={250} minWidth={250}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}`}
              >
                <Cell fill="#22c55e" />
                <Cell fill="#f59e0b" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Orders Distribution */}
        <div className="bg-white shadow rounded p-4 md:p-6 overflow-x-auto">
          <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">Orders per Vendor Range</h2>
          <p className="text-xs md:text-sm text-gray-500 mb-4">Buckets: 0-50, 51-200, 201-500, 500+</p>
          <ResponsiveContainer width="100%" height={250} minWidth={250}>
            <BarChart data={orderBuckets}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart - Revenue Trend */}
        <div className="bg-white shadow rounded p-4 md:p-6 overflow-x-auto">
          <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">Revenue Trend (Area Chart)</h2>
          <p className="text-xs md:text-sm text-gray-500 mb-4">Monthly revenue trend over last 12 months</p>
          <ResponsiveContainer width="100%" height={250} minWidth={250}>
            <AreaChart data={revenueTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" fill="#10b981" stroke="#059669" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Horizontal Bar Chart - Top 5 Vendors by Orders */}
      <div className="bg-white shadow rounded p-4 md:p-6 overflow-x-auto">
        <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">Top 5 Vendors by Orders</h2>
        <p className="text-xs md:text-sm text-gray-500 mb-4">Showing vendor names and number of orders</p>
        <ResponsiveContainer width="100%" height={280} minWidth={300}>
          <BarChart
            data={topVendors}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="orders" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardPage;