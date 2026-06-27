import { useEffect } from 'react';
import { useFormContext, useController } from 'react-hook-form';
import { Input, Select } from '../components/common';

const employmentOptions = [
  { value: 'salaried', label: 'Salaried' },
  { value: 'selfEmployed', label: 'Self-Employed' },
  { value: 'businessOwner', label: 'Business Owner' },
];

const businessTypeOptions = [
  'Manufacturing', 'Trading', 'Services', 'Retail', 'Wholesale', 'Construction', 'IT', 'Others',
].map(v => ({ value: v, label: v }));

export default function Step5Employment() {
  const { control, register, watch, setValue, formState: { errors } } = useFormContext();
  
  // Use useController for the radio group – guarantees value updates
  const { field: radioField } = useController({
    name: 'employmentType',
    control,
    rules: { required: 'Select employment type' },
    defaultValue: 'salaried',
  });

  const employmentType = watch('employmentType'); // also watch directly
  const loanType = watch('loanType');


  // Cross-step: Business Loan forces Self-Employed or Business Owner
  useEffect(() => {
    if (loanType === 'business' && employmentType === 'salaried') {
      setValue('employmentType', 'businessOwner', { shouldValidate: true });
    }
  }, [loanType, employmentType, setValue]);

  return (
    <div className="space-y-6">
      {loanType === 'business' && employmentType === 'salaried' && (
        <div className="bg-warning/10 border border-warning text-warning p-3 rounded-md text-sm">
          ⚠️ Business Loan requires Self-Employed or Business Owner. Your selection has been adjusted.
        </div>
      )}

      {/* Radio Group with useController */}
      <div className="mb-4" role="radiogroup">
        <span className="block text-sm font-medium text-gray-700 mb-2">
          Employment Type <span className="text-error">*</span>
        </span>
        <div className="flex flex-col gap-2">
          {employmentOptions.map((opt) => (
            <label key={opt.value} className="inline-flex items-center">
              <input
                type="radio"
                name='employmentType'
                data-testid={opt.value}
                value={opt.value}
                checked={radioField.value === opt.value}
                onChange={() => {
                  radioField.onChange(opt.value);
                  // Trigger validation immediately
                  setValue('employmentType', opt.value, { shouldValidate: true });
                }}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
        {errors.employmentType && (
          <div role="alert" aria-live="polite" className="mt-1 text-sm text-error">
            {errors.employmentType.message}
          </div>
        )}
      </div>

      {/* Years of Experience */}
      <Input
        label="Years of Experience"
        name="yearsOfExperience"
        type="number"
        register={register('yearsOfExperience', { required: 'Experience required', valueAsNumber: true })}
        error={errors.yearsOfExperience?.message}
        required
      />

      {/* Salaried fields */}
      {employmentType === 'salaried' && (
        <div className="border-l-4 pl-4 border-primary space-y-4">
          <Input
            label="Company Name"
            name="companyName"
            register={register('companyName', { required: 'Company name required' })}
            error={errors.companyName?.message}
            required
          />
          <Input
            label="Designation"
            name="designation"
            register={register('designation', { required: 'Designation required' })}
            error={errors.designation?.message}
            required
          />
          <Input
            label="Monthly Net Salary (₹)"
            name="monthlyNetSalary"
            type="number"
            register={register('monthlyNetSalary', { required: 'Salary required', valueAsNumber: true })}
            error={errors.monthlyNetSalary?.message}
            required
          />
          <Input
            label="Office Address"
            name="officeAddress"
            register={register('officeAddress', { required: 'Office address required' })}
            error={errors.officeAddress?.message}
            required
          />
        </div>
      )}

      {/* Self-Employed fields */}
      {employmentType === 'selfEmployed' && (
        <div className="border-l-4 pl-4 border-primary space-y-4">
          <Input
            label="Business Name"
            name="businessName"
            register={register('businessName', { required: 'Business name required' })}
            error={errors.businessName?.message}
            required
          />
          <Select
            label="Business Type"
            name="businessType"
            options={businessTypeOptions}
            register={register}
            error={errors.businessType?.message}
            required
            placeholder="Select"
          />
          <Input
            label="Annual Turnover (₹)"
            name="annualTurnover"
            type="number"
            register={register('annualTurnover', { required: 'Turnover required', valueAsNumber: true })}
            error={errors.annualTurnover?.message}
            required
          />
          <Input
            label="Years in Business"
            name="yearsInBusiness"
            type="number"
            register={register('yearsInBusiness', { required: 'Years required', valueAsNumber: true })}
            error={errors.yearsInBusiness?.message}
            required
          />
          <Input
            label="Monthly Income (₹)"
            name="monthlyIncome"
            type="number"
            register={register('monthlyIncome', { required: 'Income required', valueAsNumber: true })}
            error={errors.monthlyIncome?.message}
            required
          />
          <Input
            label="Office/Business Address"
            name="officeAddress"
            register={register('officeAddress', { required: 'Address required' })}
            error={errors.officeAddress?.message}
            required
          />
        </div>
      )}

      {/* Business Owner fields (with GST) */}
      {employmentType === 'businessOwner' && (
        <div className="border-l-4 pl-4 border-primary space-y-4">
          <Input
            label="Business Name"
            name="businessName"
            register={register('businessName', { required: 'Business name required' })}
            error={errors.businessName?.message}
            required
          />
          <Select
            label="Business Type"
            name="businessType"
            options={businessTypeOptions}
            register={register}
            error={errors.businessType?.message}
            required
            placeholder="Select"
          />
          <Input
            label="Annual Turnover (₹)"
            name="annualTurnover"
            type="number"
            register={register('annualTurnover', { required: 'Turnover required', valueAsNumber: true })}
            error={errors.annualTurnover?.message}
            required
          />
          <Input
            label="Years in Business"
            name="yearsInBusiness"
            type="number"
            register={register('yearsInBusiness', { required: 'Years required', valueAsNumber: true })}
            error={errors.yearsInBusiness?.message}
            required
          />
          <Input
            label="Monthly Income (₹)"
            name="monthlyIncome"
            type="number"
            register={register('monthlyIncome', { required: 'Income required', valueAsNumber: true })}
            error={errors.monthlyIncome?.message}
            required
          />
          <Input
            label="GST Number"
            name="gstNumber"
            register={register('gstNumber', { required: 'GST number required' })}
            error={errors.gstNumber?.message}
            required
            helpText="15-character GSTIN (e.g., 22AAAAA0000A1Z)"
          />
          <Input
            label="Office/Business Address"
            name="officeAddress"
            register={register('officeAddress', { required: 'Address required' })}
            error={errors.officeAddress?.message}
            required
          />
        </div>
      )}
    </div>
  );
}