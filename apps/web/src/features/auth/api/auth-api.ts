import type { AuthSession, AuthUser, LoginInput, SignupInput } from "@expense-tracker/shared";

import { apiRequest, setAuthToken } from "../../../shared/api";

type AuthSessionResponse = AuthSession;

type CurrentUserResponse = {
  user: AuthUser;
};

export const signup = async (input: SignupInput): Promise<AuthSession> => {
  const session = await apiRequest<AuthSessionResponse>("/auth/signup", {
    method: "POST",
    body: input,
    auth: false
  });

  setAuthToken(session.token);

  return session;
};

export const login = async (input: LoginInput): Promise<AuthSession> => {
  const session = await apiRequest<AuthSessionResponse>("/auth/login", {
    method: "POST",
    body: input,
    auth: false
  });

  setAuthToken(session.token);

  return session;
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await apiRequest<CurrentUserResponse>("/me");

  return response.user;
};
