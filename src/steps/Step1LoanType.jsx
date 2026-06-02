import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { RadioGroup, Select, Input } from '../components/common';
import { loanPurposeOptions } from './step1Schema';

export default function Step1LoanType() {
  const { register, watch, formState: { errors } } = useFormContext();
  const loanType = watch('loanType');

  // Ensure default value for loanType to avoid empty options on first render
  const currentLoanType = loanType || 'personal';

  const loanTypeOptions = [
    { value: 'personal', label: 'Personal Loan (up to ₹10 Lakh)' },
    { value: 'home', label: 'Home Loan (up to ₹1 Crore)' },
    { value: 'business', label: 'Business Loan (up to ₹50 Lakh)' },
  ];

  const purposeOptions = loanPurposeOptions[currentLoanType].map(opt => ({ value: opt, label: opt }));

  return (
    <div className="space-y-6">
     <RadioGroup
        label="Loan Type"
        name="loanType"
        options={loanTypeOptions}
        {...register('loanType', { required: 'Select loan type' })}
        error={errors.loanType?.message}
        required
        />

      <Input
        label="Loan Amount (₹)"
        name="loanAmount"
        type="number"
        register={register('loanAmount', { 
            required: 'Loan amount is required', 
            valueAsNumber: true 
        })}
        error={errors.loanAmount?.message}
        required
        
        />

      <Input
        label="Loan Tenure (months)"
        name="loanTenure"
        type="number"
        register={register('loanTenure', { 
            required: 'Loan tenure is required', 
            valueAsNumber: true 
        })}
        error={errors.loanTenure?.message}
        required
        />

      <Select
        key={loanType} // force remount to reset value when loan type changes
        label="Loan Purpose"
        name="loanPurpose"
        options={purposeOptions}
        register={register}
        error={errors.loanPurpose?.message}
        placeholder="Select a purpose"
        required
      />

      <Input
        label="Referral Code (optional)"
        name="referralCode"
        placeholder="ABC123"
        register={register('referralCode')}
        error={errors.referralCode?.message}
      />
    </div>
  );
}