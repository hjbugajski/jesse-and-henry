import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    PAYLOAD_ADMIN_USER: z.string().min(1),
    PAYLOAD_ADMIN_PASSWORD: z.string().min(1),
    PAYLOAD_SECRET: z.string().min(1),
    POSTGRES_CONNECTION_STRING: z.string().min(1),
    RESEND_FROM_ADDRESS_DEFAULT: z.string().min(1),
    RESEND_FROM_NAME_DEFAULT: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    SERVER_URL: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
});
