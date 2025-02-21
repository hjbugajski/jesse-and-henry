import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    PAYLOAD_ADMIN_USER: z.string().min(1),
    PAYLOAD_ADMIN_PASSWORD: z.string().min(1),
    PAYLOAD_PROTECTED_TOKEN: z.string().min(1),
    PAYLOAD_SECRET: z.string().min(1),
    POSTGRES_CONNECTION_STRING: z.string().min(1),
    PROTECTED_EMAIL: z.string().min(1),
    R2_BUCKET: z.string().min(1),
    R2_ENDPOINT: z.string().min(1),
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    RESEND_FROM_ADDRESS_DEFAULT: z.string().min(1),
    RESEND_FROM_NAME_DEFAULT: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    SERVER_URL: z
      .string()
      .min(1)
      .transform((url) =>
        process.env.VERCEL_ENV === 'preview' ? `https://${process.env.VERCEL_URL}` : url,
      ),
  },
  experimental__runtimeEnv: process.env,
});
