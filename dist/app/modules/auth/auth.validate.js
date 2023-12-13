"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string(),
        role: zod_1.z.enum(['seller', 'buyer']),
        password: zod_1.z.string(),
        name: zod_1.z.object({
            firstName: zod_1.z.string(),
            lastName: zod_1.z.string(),
        }),
        address: zod_1.z.string(),
        budget: zod_1.z.number(),
        income: zod_1.z.number(),
    }),
});
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({
            required_error: 'Phone Number is required',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh Token is required',
        }),
    }),
});
exports.AuthValidation = {
    createUserZodSchema,
    loginZodSchema,
    refreshTokenZodSchema,
};
