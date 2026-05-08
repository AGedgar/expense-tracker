import type { SignupInput } from "@expense-tracker/shared";
import { signupSchema } from "@expense-tracker/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { ApiClientError } from "../../../shared/api";
import { AuthFormShell } from "../components/AuthFormShell";
import { useSignup } from "../hooks/use-auth";

export const SignupPage = () => {
  const navigate = useNavigate();
  const signupMutation = useSignup();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = handleSubmit(async (input) => {
    await signupMutation.mutateAsync(input);
    navigate("/dashboard", { replace: true });
  });
  const errorMessage =
    signupMutation.error instanceof ApiClientError
      ? signupMutation.error.message
      : undefined;

  return (
    <form onSubmit={onSubmit} aria-busy={signupMutation.isPending}>
      <AuthFormShell
        title="Create account"
        submitLabel="Create account"
        submittingLabel="Creating account..."
        isSubmitting={signupMutation.isPending}
        errorMessage={errorMessage}
        footerText="Already have an account?"
        footerLinkLabel="Log in"
        footerTo="/login"
      >
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              autoComplete="name"
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              fullWidth
            />
          )}
        />
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
              autoComplete="new-password"
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              fullWidth
            />
          )}
        />
      </AuthFormShell>
    </form>
  );
};
