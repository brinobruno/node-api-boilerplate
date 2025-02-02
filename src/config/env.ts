import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  console.log('Testing environment')
  config({ path: '.env.test', override: true })
} else {
  config() // Defaults to .env
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  PORT: z.coerce.number().default(4000),

  CLIENT_URL: z.string(),

  DATABASE_CLIENT: z.enum(['pg']),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),

  JWT_SECRET_KEY: z.string(),

  DATABASE_SYNCHRONIZE: z.coerce.boolean().default(false),

  ADMIN_USER_EMAIL: z.string(),
  ADMIN_USER_PASSWORD: z.string(),

  RESEND_API_KEY: z.string().optional(),
})

export const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
