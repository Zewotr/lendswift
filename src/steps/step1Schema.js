import { z } from 'zod';

// Loan type specific rules
const loanTypeRules = {
  personal: { minAmount: 50000, maxAmount: 1000000, minTenure: 12, maxTenure: 60 },
  home: { minAmount: 50000, maxAmount: 10000000, minTenure: 60, maxTenure: 360 },
  business: { minAmount: 50000, maxAmount: 5000000, minTenure: 12, maxTenure: 120 },
};

const loanPurposeOptions = {
  personal: ['Debt Consolidation', 'Wedding', 'Medical Emergency', 'Travel', 'Home Renovation'],
  home: ['Purchase', 'Construction', 'Renovation', 'Plot Purchase'],
  business: ['Working Capital', 'Equipment Purchase', 'Expansion', 'Startup'],
};

// Base schema (will be refined dynamically)
export const step1BaseSchema = z.object({
  loanType: z.enum(['personal', 'home', 'business'], {
    required_error: 'Please select a loan type',
  }),
  loanAmount: z.number({
    required_error: 'Loan amount is required',
    invalid_type_error: 'Enter a valid number',
  }).positive('Amount must be positive'),
  loanTenure: z.number({
    required_error: 'Loan tenure is required',
    invalid_type_error: 'Enter a valid number',
  }).positive('Tenure must be positive'),
  loanPurpose: z.string({
    required_error: 'Please select a loan purpose',
  }).min(1, 'Purpose is required'),
  referralCode: z.string().optional(),
});

// Dynamic schema factory that depends on loan type
export const getStep1Schema = (loanType) => {
  const rules = loanTypeRules[loanType];
  if (!rules) return step1BaseSchema;

  return step1BaseSchema
    .refine(data => data.loanAmount >= rules.minAmount, {
      message: `Minimum loan amount for ${loanType} is ₹${rules.minAmount.toLocaleString('en-IN')}`,
      path: ['loanAmount'],
    })
    .refine(data => data.loanAmount <= rules.maxAmount, {
      message: `Maximum loan amount for ${loanType} is ₹${rules.maxAmount.toLocaleString('en-IN')}`,
      path: ['loanAmount'],
    })
    .refine(data => data.loanTenure >= rules.minTenure, {
      message: `Minimum tenure for ${loanType} is ${rules.minTenure} months`,
      path: ['loanTenure'],
    })
    .refine(data => data.loanTenure <= rules.maxTenure, {
      message: `Maximum tenure for ${loanType} is ${rules.maxTenure} months`,
      path: ['loanTenure'],
    });
};

export { loanPurposeOptions };