import { loginSchema, signupSchema } from "@expense-tracker/shared";

import { requireAuth } from "../../shared/auth";
import { createdResponse, okResponse, parseJsonBody } from "../../shared/http";
import { withErrorHandling } from "../../shared/http";
import { createAuthService } from "./auth.service";

const authService = createAuthService();

export const signup = withErrorHandling(async (event) => {
  const input = parseJsonBody(event, signupSchema);
  const session = await authService.signup(input);

  return createdResponse(session);
});

export const login = withErrorHandling(async (event) => {
  const input = parseJsonBody(event, loginSchema);
  const session = await authService.login(input);

  return okResponse(session);
});

export const me = withErrorHandling(async (event) => {
  const authUser = requireAuth(event);
  const user = await authService.getMe(authUser.email);

  return okResponse({ user });
});
