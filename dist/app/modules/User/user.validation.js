"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByMoodValidationSchema = exports.updateUserProfileZodSchema = void 0;
const zod_1 = require("zod");
// User profile update validation
exports.updateUserProfileZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, 'Name cannot be empty')
            .optional(),
        gender: zod_1.z
            .enum(['women', 'men', 'nonbinary'])
            .optional(),
        interestedIn: zod_1.z
            .enum(['women', 'men', 'both'])
            .optional(),
        heightFeet: zod_1.z
            .number()
            .min(3, 'Height must be at least 3 feet')
            .max(8, 'Height cannot exceed 8 feet')
            .optional(),
        heightInches: zod_1.z
            .number()
            .min(0, 'Height in inches must be at least 0')
            .max(11, 'Height in inches cannot exceed 11')
            .optional(),
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
        address: zod_1.z
            .string()
            .min(1, 'Address cannot be empty')
            .optional(),
        city: zod_1.z
            .string()
            .min(1, 'City cannot be empty')
            .optional(),
        state: zod_1.z
            .string()
            .min(1, 'State cannot be empty')
            .optional(),
        zipCode: zod_1.z
            .string()
            .min(1, 'Zip code cannot be empty')
            .max(20, 'Zip code cannot exceed 20 characters')
            .optional(),
        profilePhotoUrl: zod_1.z
            .string()
            .min(1, 'Profile photo URL cannot be empty')
            .optional(),
    }),
});
exports.getUserByMoodValidationSchema = zod_1.z.object({
    query: zod_1.z.object({
        moods: zod_1.z
            .string({
            required_error: 'Moods are required',
        })
            .min(1, 'At least one mood is required'),
        limit: zod_1.z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val) : 20)),
    }),
});
