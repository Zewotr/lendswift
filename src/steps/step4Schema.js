import { z } from 'zod';

export const step4Schema = z.object({
  currentAddressLine1: z.string().min(5, 'Address required'),
  currentAddressLine2: z.string().optional(),
  currentPinCode: z.string().regex(/^\d{6}$/, '6-digit PIN'),
  currentCity: z.string().min(2),
  currentState: z.string().min(2),
  currentPostOffice: z.string().min(2),
  residenceType: z.enum(['owned', 'rented', 'company', 'family']),
  rentAmount: z.number().optional(),
  yearsAtCurrentAddress: z.number().min(0).max(50),
  prevAddressLine1: z.string().optional(),
  prevPinCode: z.string().optional(),
  sameAsPermanent: z.boolean().default(false),
  permanentAddressLine1: z.string().optional(),
  permanentAddressLine2: z.string().optional(),
  permanentPinCode: z.string().optional(),
  permanentCity: z.string().optional(),
  permanentState: z.string().optional(),
  permanentPostOffice: z.string().optional(),
}).refine(data => {
  if (!data.sameAsPermanent && !data.permanentAddressLine1) return false;
  return true;
}, { message: 'Permanent address required', path: ['permanentAddressLine1'] });