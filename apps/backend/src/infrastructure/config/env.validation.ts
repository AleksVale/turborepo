import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  ADMIN_DEFAULT_PASSWORD: z.string().min(1),
  FACEBOOK_ACCESS_TOKEN: z.string().min(1),
  FACEBOOK_USER_ID: z.string().min(1),
  FACEBOOK_CLIENT_ID: z.string().min(1),
  FACEBOOK_CLIENT_SECRET: z.string().min(1),
  FACEBOOK_REDIRECT_URI: z.string().min(1),
  GOOGLE_ADS_CLIENT_ID: z.string().min(1),
  GOOGLE_ADS_CLIENT_SECRET: z.string().min(1),
  GOOGLE_ADS_DEVELOPER_TOKEN: z.string().min(1),
  GOOGLE_ADS_REFRESH_TOKEN: z.string().min(1),
  GOOGLE_ADS_REDIRECT_URI: z.string().min(1),
});

export type EnvVars = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvVars {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const formatted = result.error.errors
      .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration: ${formatted}`);
  }

  return result.data;
}
