import { Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const ProtectedLayout = () => (
  <ProtectedRoute>
    <Outlet />
  </ProtectedRoute>
);

export default ProtectedLayout