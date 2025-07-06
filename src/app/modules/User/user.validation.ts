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

export const updateIdVerificationZodSchema = z.object({
  body: z.object({
    idType: z.enum(['NATIONAL_ID', 'PASSPORT'], {
      required_error: 'ID type is required',
    }),
    idPhotoUrl: z.string({
      required_error: 'ID photo URL is required',
    }),
    profilePhotoUrl: z.string({
      required_error: 'Profile photo URL is required',
    }),
    imageVerified: z.boolean({
      required_error: 'Image verification status is required',
    }),
  }),
});

export const updateGenderZodSchema = z.object({
  body: z.object({
    gender: z.enum(['WOMEN', 'MEN', 'NONBINARY'], {
      required_error: 'Gender is required',
    }),
  }),
});

export const updateInterestedInZodSchema = z.object({
  body: z.object({
    interestedIn: z.enum(['WOMEN', 'MEN', 'BOTH'], {
      required_error: 'Interest preference is required',
    }),
  }),
});

export const updateHeightZodSchema = z.object({
  body: z.object({
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
  }),
});

export const updateLocationZodSchema = z.object({
  body: z.object({
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
      .regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code format'),
  }),
}); 