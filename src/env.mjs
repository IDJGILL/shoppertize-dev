import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    AUTH_SECRET: z.string(),
    REVALIDATION_SECRET: z.string(),
    BACKEND_DOMAIN: z.string().url(),
    WOOCOMMERCE_CONSUMER_KEY: z.string(),
    WOOCOMMERCE_CONSUMER_SECRET: z.string(),
    WORDPRESS_WEBHOOK_SECRET_ENDPOINT: z.string().url(),
    WORDPRESS_APPLICATION_USERNAME: z.string(),
    WORDPRESS_APPLICATION_SECRET: z.string(),
    PHONEPE_MERCHANT_ID: z.string(),
    PHONEPE_MERCHANT_SALT_KEY: z.string(),
    PHONEPE_PAYMENT_API_URI: z.string().url(),
    PHONEPE_PAYMENT_STATUS_API_URI: z.string().url(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GRAPHQL_JWT_AUTH_SECRET_KEY: z.string(),
    GOOGLE_REDIRECT_URI: z.string().url(),
    OTP_LESS_CLIENT_ID: z.string(),
    OTP_LESS_CLIENT_SECRET: z.string(),
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    NIMBUS_EMAIL: z.string(),
    NIMBUS_PASSWORD: z.string(),
    SMTP_USER_EMAIL: z.string(),
    SMTP_USER_PASS: z.string(),
  },

  client: {
    NEXT_PUBLIC_FRONTEND_DOMAIN: z.string().url(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    REVALIDATION_SECRET: process.env.REVALIDATION_SECRET,
    BACKEND_DOMAIN: process.env.BACKEND_DOMAIN,
    NEXT_PUBLIC_FRONTEND_DOMAIN: process.env.NEXT_PUBLIC_FRONTEND_DOMAIN,
    WOOCOMMERCE_CONSUMER_KEY: process.env.WOOCOMMERCE_CONSUMER_KEY,
    WOOCOMMERCE_CONSUMER_SECRET: process.env.WOOCOMMERCE_CONSUMER_SECRET,
    WORDPRESS_WEBHOOK_SECRET_ENDPOINT:
      process.env.WORDPRESS_WEBHOOK_SECRET_ENDPOINT,
    WORDPRESS_APPLICATION_USERNAME: process.env.WORDPRESS_APPLICATION_USERNAME,
    WORDPRESS_APPLICATION_SECRET: process.env.WORDPRESS_APPLICATION_SECRET,
    PHONEPE_MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID,
    PHONEPE_MERCHANT_SALT_KEY: process.env.PHONEPE_MERCHANT_SALT_KEY,
    PHONEPE_PAYMENT_API_URI: process.env.PHONEPE_PAYMENT_API_URI,
    PHONEPE_PAYMENT_STATUS_API_URI: process.env.PHONEPE_PAYMENT_STATUS_API_URI,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GRAPHQL_JWT_AUTH_SECRET_KEY: process.env.GRAPHQL_JWT_AUTH_SECRET_KEY,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    OTP_LESS_CLIENT_ID: process.env.OTP_LESS_CLIENT_ID,
    OTP_LESS_CLIENT_SECRET: process.env.OTP_LESS_CLIENT_SECRET,

    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,

    NIMBUS_EMAIL: process.env.NIMBUS_EMAIL,
    NIMBUS_PASSWORD: process.env.NIMBUS_PASSWORD,

    SMTP_USER_EMAIL: process.env.SMTP_USER_EMAIL,
    SMTP_USER_PASS: process.env.SMTP_USER_PASS,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
