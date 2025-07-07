import { z } from 'zod';

export const createUserZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters'),
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(1, 'Name cannot be empty'),
    gender: z.enum(['women', 'men', 'nonbinary'], {
      required_error: 'Gender is required',
    }),
    interestedIn: z.enum(['women', 'men', 'both'], {
      required_error: 'Interest preference is required',
    }),
    heightFeet: z
      .number({
        required_error: 'Height in feet is required',
      })
      .min(3, 'Height must be at least 3 feet')
      .max(8, 'Height cannot exceed 8 feet'),
    heightInches: z
      .number({
        required_error: 'Height in inches is required',
      })
      .min(0, 'Height in inches must be at least 0')
      .max(11, 'Height in inches cannot exceed 11'),
    address: z
      .string({
        required_error: 'Address is required',
      })
      .min(1, 'Address cannot be empty'),
    city: z
      .string({
        required_error: 'City is required',
      })
      .min(1, 'City cannot be empty'),
    state: z
      .string({
        required_error: 'State is required',
      })
      .min(1, 'State cannot be empty'),
    zipCode: z
      .string({
        required_error: 'Zip code is required',
      })
      .min(1, 'Zip code cannot be empty')
      .max(20, 'Zip code cannot exceed 20 characters'),
    profilePhotoUrl: z
      .string()
      .min(1, 'Profile photo URL cannot be empty')
      .optional(),
    // Optional fields
    birthday: z
      .string()
      .datetime('Invalid birthday format')
      .optional(),
    bio: z
      .string()
      .max(500, 'Bio cannot exceed 500 characters')
      .optional(),
    relationshipStatus: z
      .enum(['single', 'in_relationship', 'married', 'divorced', 'widowed', 'complicated'])
      .optional(),
    language: z
      .array(z.string().min(1, 'Language cannot be empty'))
      .min(1, 'At least one language is required')
      .optional(),
    work: z
      .string()
      .max(100, 'Work cannot exceed 100 characters')
      .optional(),
  }),
});

export const loginUserZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    password: z
      .string({
        required_error: 'Password is required',
      }),
  }),
});

export const refreshTokenZodSchema = z.object({
  body: z.object({
    refreshToken: z
      .string({
        required_error: 'Refresh token is required',
      })
      .min(1, 'Refresh token cannot be empty'),
  }),
}); 