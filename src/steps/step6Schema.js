import { z } from 'zod';

export const step6Schema = z.object({
  coApplicantRequired: z.boolean(),
  coApplicantName: z.string().min(2, 'Name required').optional(),
  relationship: z.enum(['spouse', 'parent', 'sibling', 'businessPartner']).optional(),
  coApplicantPAN: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN format').optional(),
  coApplicantIncome: z.number().min(0).optional(),
  coApplicantConsent: z.boolean().refine(v => v === true, 'Consent required'),
}).refine(data => {
  // If coApplicantRequired is true, all fields must be filled
  if (data.coApplicantRequired) {
    return !!data.coApplicantName && !!data.relationship && !!data.coApplicantPAN && !!data.coApplicantIncome;
  }
  return true;
}, { message: 'Complete all co-applicant details', path: ['coApplicantName'] });