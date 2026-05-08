import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";
import type { LoginInput } from "@expense-tracker/shared";
import { loginSchema } from "@expense-tracker/shared";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { ApiClientError } from "../../../shared/api";
import { AuthFormShell } from "../components/AuthFormShell";
import { useLogin } from "../hooks/use-auth";

export const LoginPage = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = handleSubmit(async (input) => {
    await loginMutation.mutateAsync(input);
    navigate("/dashboard", { replace: true });
  });
  const errorMessage =
    loginMutation.error instanceof ApiClientError
      ? loginMutation.error.message
      : undefined;

  return (
    <form onSubmit={onSubmit} aria-busy={loginMutation.isPending}>
      <AuthFormShell
        title="Log in"
        submitLabel="Log in"
        submittingLabel="Logging in..."
        isSubmitting={loginMutation.isPending}
        errorMessage={errorMessage}
        footerText="New here?"
        footerLinkLabel="Create account"
        footerTo="/signup"
      >
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              autoComplete="email"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              fullWidth
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              autoComplete="current-password"
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              fullWidth
            />
          )}
        />
        <input type="hidden" aria-hidden="true" />
      </AuthFormShell>
    </form>
  );
};
