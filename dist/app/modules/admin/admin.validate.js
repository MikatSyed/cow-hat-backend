"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidation = void 0;
const zod_1 = require("zod");
const createAdminZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string(),
        role: zod_1.z.enum(['admin']),
        password: zod_1.z.string(),
        name: zod_1.z.object({
            firstName: zod_1.z.string(),
            lastName: zod_1.z.string(),
        }),
        address: zod_1.z.string(),
    }),
});
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({
            required_error: 'phoneNumber is required',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
    }),
});
exports.AdminValidation = {
    createAdminZodSchema,
    loginZodSchema,
};
