import { Outlet } from "react-router-dom";
import PublicRoute from "./PublicRoute";

const PublicLayout = () => (
  <PublicRoute>
    <Outlet />
  </PublicRoute>
);

export default PublicLayout