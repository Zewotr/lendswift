import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input, Select, Checkbox } from '../components/common';
import { useVerification } from '../hooks/useVerification';

const relationshipOptions = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'businessPartner', label: 'Business Partner' },
];

export default function Step6CoApplicant() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const loanType = watch('loanType');
  const loanAmount = watch('loanAmount');
  const coApplicantPAN = watch('coApplicantPAN');
  const { isVerified, error: panError } = useVerification(coApplicantPAN, 'PAN');

  // Determine if step is required (already handled by Wizard visibility, but compute for UI)
  const isRequired = 
    loanType === 'home' ||
    (loanType === 'personal' && loanAmount > 500000) ||
    (loanType === 'business' && loanAmount > 2000000);

  // Set coApplicantRequired flag
  useEffect(() => {
    setValue('coApplicantRequired', isRequired);
  }, [isRequired, setValue]);

  if (!isRequired) {
    return <div className="p-4 text-gray-500">Co-applicant not required for this loan.</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Co-Applicant Details</h3>
      <Input
        label="Co-Applicant Full Name"
        name="coApplicantName"
        register={register('coApplicantName', { required: 'Name required' })}
        error={errors.coApplicantName?.message}
        required
      />
      <Select
        label="Relationship"
        name="relationship"
        options={relationshipOptions}
        register={register('relationship', { required: 'Relationship required' })}
        error={errors.relationship?.message}
        required
        placeholder="Select"
      />
      <Input
        label="Co-Applicant PAN"
        name="coApplicantPAN"
        register={register('coApplicantPAN', { required: 'PAN required' })}
        error={errors.coApplicantPAN?.message || panError}
        required
      />
      {isVerified && !panError && <div className="text-accent text-sm">✓ PAN verified</div>}
      <Input
        label="Co-Applicant Monthly Income (₹)"
        name="coApplicantIncome"
        type="number"
        register={register('coApplicantIncome', { required: 'Income required', valueAsNumber: true })}
        error={errors.coApplicantIncome?.message}
        required
      />
      <Checkbox
        label="I consent to sharing co-applicant information for loan processing"
        name="coApplicantConsent"
        register={register('coApplicantConsent', { required: 'Consent required' })}
        error={errors.coApplicantConsent?.message}
        required
      />
    </div>
  );
}