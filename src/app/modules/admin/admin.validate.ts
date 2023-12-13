import { z } from 'zod'

const createAdminZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string(),
    role: z.enum(['admin']),
    password: z.string(),
    name: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
    address: z.string(),
  }),
})

const loginZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'phoneNumber is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
})

export const AdminValidation = {
  createAdminZodSchema,
  loginZodSchema,
}
