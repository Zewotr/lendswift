import { z } from 'zod';

// Helper: calculate age from Date of Birth
export const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Base schema for Step 2
export const step2Schema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s.]+$/, 'Only letters, spaces, and periods allowed'),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
    invalid_type_error: 'Invalid date',
  }).refine((dob) => {
    const age = calculateAge(dob);
    return age >= 21;
  }, 'You must be at least 21 years old')
    .refine((dob) => {
      const age = calculateAge(dob);
      return age <= 65;
    }, 'Maximum age is 65 years'),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Please select gender' }),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed'], { required_error: 'Select marital status' }),
  fathersName: z.string()
    .min(2, "Father's name is required")
    .max(100, 'Too long')
    .regex(/^[a-zA-Z\s.]+$/, 'Only letters, spaces, and periods'),
  mothersName: z.string()
    .min(2, "Mother's name is required")
    .max(100, 'Too long')
    .regex(/^[a-zA-Z\s.]+$/, 'Only letters, spaces, and periods'),
  email: z.string().email('Enter a valid email address'),
  mobileNumber: z.string()
    .regex(/^[6-9]\d{9}$/, 'Mobile number must be 10 digits starting with 6,7,8,9'),
  alternateMobile: z.string()
    .regex(/^[6-9]\d{9}$/, 'Invalid mobile number')
    .optional()
    .or(z.literal('')),
}).refine((data) => {
  // If alternateMobile is provided, it must differ from mobileNumber
  if (data.alternateMobile && data.alternateMobile !== data.mobileNumber) return true;
  if (!data.alternateMobile) return true;
  return false;
}, {
  message: 'Alternate mobile number must be different from primary mobile',
  path: ['alternateMobile'],
});