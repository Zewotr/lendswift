import { useFormContext } from 'react-hook-form';
import { Input, Checkbox } from '../components/common';
import { useVerification } from '../hooks/useVerification';

export default function Step3KYC() {
  const { register, watch, formState: { errors } } = useFormContext();
  const panValue = watch('panNumber') || '';
  const aadhaarValue = watch('aadhaarNumber') || '';

  const panVerification = useVerification(panValue, 'PAN');
  const aadhaarVerification = useVerification(aadhaarValue, 'Aadhaar');

  return (
    <div className="space-y-6">
      {/* PAN Field with verification */}
      <div>
        <Input
          label="PAN Number"
          name="panNumber"
          register={register('panNumber', { required: 'PAN is required' })}
          error={errors.panNumber?.message || panVerification.error}
          required
          helpText="e.g., ABCDE1234F (5 letters, 4 digits, 1 letter)"
        />
        {panVerification.isVerifying && (
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">...</svg>
            Verifying PAN...
          </div>
        )}
        {panVerification.isVerified && !panVerification.isVerifying && (
          <div className="flex items-center mt-1 text-sm text-accent">
            <span className="mr-1">✓</span> Verified
          </div>
        )}
      </div>

      {/* Aadhaar Field with verification */}
      <div>
        <Input
          label="Aadhaar Number"
          name="aadhaarNumber"
          register={register('aadhaarNumber', { required: 'Aadhaar is required' })}
          error={errors.aadhaarNumber?.message || aadhaarVerification.error}
          required
          helpText="12 digits (Verhoeff checksum validated)"
        />
        {aadhaarVerification.isVerifying && (
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">...</svg>
            Verifying Aadhaar...
          </div>
        )}
        {aadhaarVerification.isVerified && !aadhaarVerification.isVerifying && (
          <div className="flex items-center mt-1 text-sm text-accent">
            <span className="mr-1">✓</span> Verified
          </div>
        )}
      </div>

      {/* Aadhaar Consent Checkbox (mandatory) */}
      <Checkbox
        label="I consent to using my Aadhaar for identity verification as per RBI guidelines."
        name="aadhaarConsent"
        register={register('aadhaarConsent', { required: 'You must consent to Aadhaar verification' })}
        error={errors.aadhaarConsent?.message}
        required
      />

      {/* Optional fields – only shown conditionally (e.g., for Home Loan > 50L) */}
      <div className="border-t pt-4 mt-2">
        <p className="text-sm text-gray-500 mb-2">Optional Documents (if applicable)</p>
        <Input
          label="Voter ID (optional)"
          name="voterId"
          register={register('voterId')}
          error={errors.voterId?.message}
        />
        <Input
          label="Passport Number (optional)"
          name="passportNumber"
          register={register('passportNumber')}
          error={errors.passportNumber?.message}
        />
      </div>
    </div>
  );
}
