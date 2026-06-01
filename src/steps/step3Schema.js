import { z } from 'zod';

export const step3Schema = z.object({
  panNumber: z.string().min(1, 'PAN required'),
  aadhaarNumber: z.string().min(1, 'Aadhaar required'),
  aadhaarConsent: z.boolean().refine(v => v === true, 'You must consent'),
  voterId: z.string().optional(),
  passportNumber: z.string().optional(),
});