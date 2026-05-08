import { z } from "zod";

const envSchema = z.object({
  AWS_REGION: z.string().min(1),
  DYNAMODB_TABLE_NAME: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().min(1).default("1h")
});

export type ApiEnv = z.infer<typeof envSchema>;

let cachedEnv: ApiEnv | undefined;

export const getEnv = (): ApiEnv => {
  if (cachedEnv) {
    return cachedEnv;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const missingVariables = Object.keys(result.error.flatten().fieldErrors);

    throw new Error(
      `Invalid environment configuration: ${missingVariables.join(", ")}`
    );
  }

  cachedEnv = result.data;
  return cachedEnv;
};

export const clearEnvCache = (): void => {
  cachedEnv = undefined;
};
