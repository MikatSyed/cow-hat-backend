// import { z } from 'zod'

// const createCUserZodSchema = z.object({
//   body: z.object({
//     phoneNumber: z.string(),
//     role: z.enum(['seller', 'buyer']),
//     password: z.string(),
//     name: z.object({
//       firstName: z.string(),
//       lastName: z.string(),
//     }),
//     address: z.string(),
//     budget: z.number(),
//     income: z.number(),
//   }),
// })

// const loginZodSchema = z.object({
//   body: z.object({
//     phoneNumber: z.string({
//       required_error: 'Phone Number is required',
//     }),
//     password: z.string({
//       required_error: 'Password is required',
//     }),
//   }),
// })

// export const UserValidation = {
//   createCUserZodSchema,
//   loginZodSchema,
// }
