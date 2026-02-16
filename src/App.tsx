import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./features/dashboard/DashboardPage";
import VendorsPage from "./features/vendors/VendorsPage";
import VendorDetailsPage from "./features/vendors/VendorsDetailsPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/vendors/:id" element={<VendorDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
