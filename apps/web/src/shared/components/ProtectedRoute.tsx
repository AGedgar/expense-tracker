import { Navigate, Outlet, useLocation } from "react-router-dom";

import { clearAuthToken, getAuthToken } from "../api";
import { LoadingState } from "./LoadingState";
import { useCurrentUser } from "../../features/auth/hooks/use-auth";

export const ProtectedRoute = () => {
  const location = useLocation();
  const hasToken = Boolean(getAuthToken());
  const currentUserQuery = useCurrentUser();

  if (!hasToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (currentUserQuery.isLoading) {
    return <LoadingState label="Checking session" />;
  }

  if (currentUserQuery.isError) {
    clearAuthToken();

    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
