import { randomUUID } from "node:crypto";

import type { AuthSession, AuthUser, LoginInput, SignupInput } from "@expense-tracker/shared";
import { PREDEFINED_CATEGORIES } from "@expense-tracker/shared";

import { hashPassword, signAuthToken, verifyPassword } from "../../shared/auth";
import { conflict, unauthorized } from "../../shared/errors";
import { mapUserItemToAuthUser } from "./auth.mapper";
import {
  buildPredefinedCategoryItem,
  buildUserItem,
  createAuthRepository
} from "./auth.repository";
import type { AuthRepository } from "./auth.repository";

export type AuthService = {
  signup: (input: SignupInput) => Promise<AuthSession>;
  login: (input: LoginInput) => Promise<AuthSession>;
  getMe: (email: string) => Promise<AuthUser>;
};

export const createAuthService = (
  repository: AuthRepository = createAuthRepository()
): AuthService => ({
  async signup(input) {
    const existingUser = await repository.findUserByEmail(input.email);

    if (existingUser) {
      throw conflict("A user with this email already exists");
    }

    const now = new Date().toISOString();
    const userId = randomUUID();
    const passwordHash = await hashPassword(input.password);
    const user = buildUserItem(
      {
        userId,
        name: input.name,
        email: input.email,
        passwordHash
      },
      now
    );
    const categories = PREDEFINED_CATEGORIES.map((category) =>
      buildPredefinedCategoryItem(
        {
          userId,
          categoryId: category.id,
          name: category.name
        },
        now
      )
    );

    await repository.createUserWithCategories(user, categories);

    const authUser = mapUserItemToAuthUser(user);

    return {
      user: authUser,
      token: signAuthToken({
        userId: authUser.userId,
        email: authUser.email
      })
    };
  },

  async login(input) {
    const user = await repository.findUserByEmail(input.email);

    if (!user) {
      throw unauthorized("Invalid email or password");
    }

    const passwordMatches = await verifyPassword(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw unauthorized("Invalid email or password");
    }

    const authUser = mapUserItemToAuthUser(user);

    return {
      user: authUser,
      token: signAuthToken({
        userId: authUser.userId,
        email: authUser.email
      })
    };
  },

  async getMe(email) {
    const user = await repository.findUserByEmail(email);

    if (!user) {
      throw unauthorized("Invalid authentication token");
    }

    return mapUserItemToAuthUser(user);
  }
});
