import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "../features/dashboard/DashboardPage";
import VendorsPage from "../features/vendors/VendorsPage";
import VendorDetailsPage from "../features/vendors/VendorsDetailsPage";
import Layout from "../components/Layout";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/vendors", element: <VendorsPage /> },
      { path: "/vendors/:id", element: <VendorDetailsPage /> },
    ],
  },
]);
