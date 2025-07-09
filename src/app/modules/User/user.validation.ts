import { z } from 'zod';

// User profile update validation
export const updateUserProfileZodSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name cannot be empty')
      .optional(),
    gender: z
      .enum(['women', 'men', 'nonbinary'])
      .optional(),
    interestedIn: z
      .enum(['women', 'men', 'both'])
      .optional(),
    heightFeet: z
      .number()
      .min(3, 'Height must be at least 3 feet')
      .max(8, 'Height cannot exceed 8 feet')
      .optional(),
    heightInches: z
      .number()
      .min(0, 'Height in inches must be at least 0')
      .max(11, 'Height in inches cannot exceed 11')
      .optional(),
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
    address: z
      .string()
      .min(1, 'Address cannot be empty')
      .optional(),
    city: z
      .string()
      .min(1, 'City cannot be empty')
      .optional(),
    state: z
      .string()
      .min(1, 'State cannot be empty')
      .optional(),
    zipCode: z
      .string()
      .min(1, 'Zip code cannot be empty')
      .max(20, 'Zip code cannot exceed 20 characters')
      .optional(),
    profilePhotoUrl: z
      .string()
      .min(1, 'Profile photo URL cannot be empty')
      .optional(),
  }),
});

export const getUserByMoodValidationSchema = z.object({
  query: z.object({
    moods: z
      .string({
        required_error: 'Moods are required',
      })
      .min(1, 'At least one mood is required'),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 20)),
  }),
});

// OTP validation schemas
export const requestOtpZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format')
      .min(1, 'Email cannot be empty'),
  }),
});

export const verifyOtpZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format')
      .min(1, 'Email cannot be empty'),
    otp: z
      .string({
        required_error: 'OTP is required',
      })
      .length(6, 'OTP must be exactly 6 digits')
      .regex(/^\d{6}$/, 'OTP must contain only numbers'),
  }),
});

export const changePasswordZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format')
      .min(1, 'Email cannot be empty'),
    oldPassword: z
      .string({
        required_error: 'Old password is required',
      })
      .min(6, 'Password must be at least 6 characters'),
    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .min(6, 'Password must be at least 6 characters'),
  }),
});

export const resetPasswordZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format')
      .min(1, 'Email cannot be empty'),
    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .min(6, 'Password must be at least 6 characters'),
  }),
}); 