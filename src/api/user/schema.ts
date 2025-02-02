import { z } from 'zod'

// TODO: Remove role as an input everywhere
export const findUserSchema = z.object({
  id: z.string(),
})

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'client']).optional().default('client'),
})

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'client']).optional().default('client'),
})

export const passwordResetInstructionsSchema = z.object({
  email: z.string().email('Invalid email'),
})

export const passwordResetQuerySchema = z.object({
  id: z.string(),
  token: z.string(),
})

export const passwordResetBodySchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
