export interface Order {
  id: string;
  amount: number;
  status: "Completed" | "Pending" | "Cancelled";
  date: string;
}

export interface Vendor {
  id: string;
  businessName: string;
  email: string;
  rating: number;
  status: "active" | "pending" | "suspended";
  totalOrders: number;
  totalRevenue: number;
  avgDeliveryTime: number;
  createdAt: string;
  orders?: Order[];
}

// Utility function to generate dynamic orders based on vendor data
export function generateVendorOrders(vendor: Vendor, count: number = 5): Order[] {
  const orders: Order[] = [];
  const statuses: Array<"Completed" | "Pending" | "Cancelled"> = ["Completed", "Pending", "Cancelled"];
  const avgAmountPerOrder = vendor.totalRevenue / Math.max(vendor.totalOrders, 1);
  
  for (let i = 0; i < count; i++) {
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const createdDate = new Date(vendor.createdAt);
    const orderDate = new Date(createdDate.getTime() + Math.random() * (Date.now() - createdDate.getTime()));
    
    orders.push({
      id: `${vendor.id}-o${i + 1}`,
      amount: Math.round(avgAmountPerOrder * (0.7 + Math.random() * 0.6)),
      status: statuses[statusIndex],
      date: orderDate.toISOString().split('T')[0],
    });
  }
  
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
