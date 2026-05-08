import type { APIGatewayProxyEventV2 } from "aws-lambda";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

import { getEnv } from "../env";
import { unauthorized } from "../errors";

export type JwtPayload = {
  userId: string;
  email: string;
};

export const signAuthToken = (payload: JwtPayload): string => {
  const env = getEnv();
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyAuthToken = (token: string): JwtPayload => {
  const env = getEnv();

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);

    if (
      typeof payload !== "object" ||
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string"
    ) {
      throw unauthorized("Invalid authentication token");
    }

    return {
      userId: payload.userId,
      email: payload.email
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw unauthorized("Invalid authentication token");
    }

    throw error;
  }
};

export const getBearerToken = (
  event: Pick<APIGatewayProxyEventV2, "headers">
): string => {
  const authorizationHeader =
    event.headers.authorization ?? event.headers.Authorization;

  if (!authorizationHeader) {
    throw unauthorized("Authorization header is required");
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw unauthorized("Authorization header must use Bearer token format");
  }

  return token;
};

export const requireAuth = (
  event: Pick<APIGatewayProxyEventV2, "headers">
): JwtPayload => verifyAuthToken(getBearerToken(event));
