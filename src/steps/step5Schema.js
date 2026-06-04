import { z } from 'zod';

// GST format: 15 characters, e.g., 22AAAAA0000A1Z
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// Common fields for all employment types
const baseFields = {
  employmentType: z.enum(['salaried', 'selfEmployed', 'businessOwner'], {
    required_error: 'Select employment type',
  }),
  yearsOfExperience: z.number({
    required_error: 'Years of experience required',
    invalid_type_error: 'Enter a number',
  }).min(0, 'Cannot be negative').max(50, 'Maximum 50 years'),
};

// Salaried specific
const salariedSchema = z.object({
  ...baseFields,
  employmentType: z.literal('salaried'),
  companyName: z.string().min(1, 'Company name required'),
  designation: z.string().min(1, 'Designation required'),
  monthlyNetSalary: z.number({
    required_error: 'Monthly net salary required',
    invalid_type_error: 'Enter a number',
  }).min(15000, 'Minimum monthly salary ₹15,000'),
  officeAddress: z.string().min(5, 'Office address required'),
});

// Self‑Employed specific (no GST)
const selfEmployedSchema = z.object({
  ...baseFields,
  employmentType: z.literal('selfEmployed'),
  businessName: z.string().min(1, 'Business name required'),
  businessType: z.string().min(1, 'Business type required'),
  annualTurnover: z.number({
    required_error: 'Annual turnover required',
  }).min(300000, 'Minimum annual turnover ₹3,00,000'),
  yearsInBusiness: z.number().min(2, 'Minimum 2 years in business'),
  monthlyIncome: z.number({
    required_error: 'Monthly income required',
  }).min(15000, 'Minimum monthly income ₹15,000'),
  officeAddress: z.string().min(5, 'Office address required'),
});

// Business Owner (with GST)
const businessOwnerSchema = z.object({
  ...baseFields,
  employmentType: z.literal('businessOwner'),
  businessName: z.string().min(1, 'Business name required'),
  businessType: z.string().min(1, 'Business type required'),
  annualTurnover: z.number({
    required_error: 'Annual turnover required',
  }).min(300000, 'Minimum turnover ₹3,00,000'),
  yearsInBusiness: z.number().min(2, 'Minimum 2 years'),
  monthlyIncome: z.number({
    required_error: 'Monthly income required',
  }).min(15000, 'Minimum monthly income ₹15,000'),
  gstNumber: z.string().regex(gstRegex, 'Invalid GST number (15 chars, proper format)'),
  officeAddress: z.string().min(5, 'Office address required'),
});

// Discriminated union – chooses one based on employmentType
export const step5Schema = z.discriminatedUnion('employmentType', [
  salariedSchema,
  selfEmployedSchema,
  businessOwnerSchema,
]);