import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DOMAIN: z.string().min(1),
    GUEST_PASSWORD: z.string().min(1),
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
  runtimeEnv: {
    DOMAIN: process.env.DOMAIN,
    GUEST_PASSWORD: process.env.GUEST_PASSWORD,
    PAYLOAD_ADMIN_USER: process.env.PAYLOAD_ADMIN_USER,
    PAYLOAD_ADMIN_PASSWORD: process.env.PAYLOAD_ADMIN_PASSWORD,
    PAYLOAD_PROTECTED_TOKEN: process.env.PAYLOAD_PROTECTED_TOKEN,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    POSTGRES_CONNECTION_STRING: process.env.POSTGRES_CONNECTION_STRING,
    PROTECTED_EMAIL: process.env.PROTECTED_EMAIL,
    R2_BUCKET: process.env.R2_BUCKET,
    R2_ENDPOINT: process.env.R2_ENDPOINT,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    RESEND_FROM_ADDRESS_DEFAULT: process.env.RESEND_FROM_ADDRESS_DEFAULT,
    RESEND_FROM_NAME_DEFAULT: process.env.RESEND_FROM_NAME_DEFAULT,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    SERVER_URL: process.env.SERVER_URL,
  },
});
