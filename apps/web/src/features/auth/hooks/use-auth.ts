import type { LoginInput, SignupInput } from "@expense-tracker/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { clearAuthToken, getAuthToken } from "../../../shared/api";
import { getCurrentUser, login, signup } from "../api/auth-api";

const currentUserQueryKey = ["auth", "me"] as const;

export const useCurrentUser = () =>
  useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
    enabled: Boolean(getAuthToken()),
    retry: false
  });

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (session) => {
      queryClient.setQueryData(currentUserQueryKey, session.user);
    }
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SignupInput) => signup(input),
    onSuccess: (session) => {
      queryClient.setQueryData(currentUserQueryKey, session.user);
    }
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    clearAuthToken();
    queryClient.removeQueries({
      queryKey: currentUserQueryKey
    });
  };
};
