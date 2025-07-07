"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenZodSchema = exports.loginUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
exports.createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email('Invalid email format'),
        password: zod_1.z
            .string({
            required_error: 'Password is required',
        })
            .min(6, 'Password must be at least 6 characters'),
        name: zod_1.z
            .string({
            required_error: 'Name is required',
        })
            .min(1, 'Name cannot be empty'),
        gender: zod_1.z.enum(['women', 'men', 'nonbinary'], {
            required_error: 'Gender is required',
        }),
        interestedIn: zod_1.z.enum(['women', 'men', 'both'], {
            required_error: 'Interest preference is required',
        }),
        heightFeet: zod_1.z
            .number({
            required_error: 'Height in feet is required',
        })
            .min(3, 'Height must be at least 3 feet')
            .max(8, 'Height cannot exceed 8 feet'),
        heightInches: zod_1.z
            .number({
            required_error: 'Height in inches is required',
        })
            .min(0, 'Height in inches must be at least 0')
            .max(11, 'Height in inches cannot exceed 11'),
        address: zod_1.z
            .string({
            required_error: 'Address is required',
        })
            .min(1, 'Address cannot be empty'),
        city: zod_1.z
            .string({
            required_error: 'City is required',
        })
            .min(1, 'City cannot be empty'),
        state: zod_1.z
            .string({
            required_error: 'State is required',
        })
            .min(1, 'State cannot be empty'),
        zipCode: zod_1.z
            .string({
            required_error: 'Zip code is required',
        })
            .min(1, 'Zip code cannot be empty')
            .max(20, 'Zip code cannot exceed 20 characters'),
        profilePhotoUrl: zod_1.z
            .string()
            .min(1, 'Profile photo URL cannot be empty')
            .optional(),
        // Optional fields
        birthday: zod_1.z
            .string()
            .datetime('Invalid birthday format')
            .optional(),
        bio: zod_1.z
            .string()
            .max(500, 'Bio cannot exceed 500 characters')
            .optional(),
        relationshipStatus: zod_1.z
            .enum(['single', 'in_relationship', 'married', 'divorced', 'widowed', 'complicated'])
            .optional(),
        language: zod_1.z
            .array(zod_1.z.string().min(1, 'Language cannot be empty'))
            .min(1, 'At least one language is required')
            .optional(),
        work: zod_1.z
            .string()
            .max(100, 'Work cannot exceed 100 characters')
            .optional(),
    }),
});
exports.loginUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email('Invalid email format'),
        password: zod_1.z
            .string({
            required_error: 'Password is required',
        }),
    }),
});
exports.refreshTokenZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z
            .string({
            required_error: 'Refresh token is required',
        })
            .min(1, 'Refresh token cannot be empty'),
    }),
});
