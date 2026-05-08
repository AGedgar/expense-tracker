import type { z } from "zod";

import type { loginSchema, signupSchema } from "../schemas";

export type SignupInput = z.infer<typeof signupSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export type AuthUser = {
  userId: string;
  name: string;
  email: string;
};

export type AuthSession = {
  user: AuthUser;
  token: string;
};
