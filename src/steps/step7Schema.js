import { z } from 'zod';

export const step7Schema = z.object({
  documentsStepValid: z.boolean().refine(val => val === true, {
    message: 'Please upload all required documents and provide e-signature',
  }),
});