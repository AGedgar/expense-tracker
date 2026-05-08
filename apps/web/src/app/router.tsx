import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AuthLayout } from "../shared/components/AuthLayout";
import { AppLayout } from "../shared/components/AppLayout";
import { LoadingState } from "../shared/components/LoadingState";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { PublicOnlyRoute } from "../shared/components/PublicOnlyRoute";

const LoginPage = lazy(() =>
  import("../features/auth/pages/LoginPage").then((module) => ({
    default: module.LoginPage
  }))
);
const SignupPage = lazy(() =>
  import("../features/auth/pages/SignupPage").then((module) => ({
    default: module.SignupPage
  }))
);
const DashboardPage = lazy(() =>
  import("../features/reports/pages/DashboardPage").then((module) => ({
    default: module.DashboardPage
  }))
);
const ExpensesPage = lazy(() =>
  import("../features/expenses/pages/ExpensesPage").then((module) => ({
    default: module.ExpensesPage
  }))
);
const CategoriesPage = lazy(() =>
  import("../features/categories/pages/CategoriesPage").then((module) => ({
    default: module.CategoriesPage
  }))
);

export const AppRouter = () => (
  <Suspense fallback={<LoadingState label="Loading page" />}>
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </Suspense>
);
