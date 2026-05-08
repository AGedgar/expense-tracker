import { Navigate, Outlet } from "react-router-dom";

import { getAuthToken } from "../api";

export const PublicOnlyRoute = () => {
  if (getAuthToken()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
