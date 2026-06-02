import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input, Checkbox, Select } from '../components/common';
import { usePinCodeLookup } from '../hooks/usePinCodeLookup';

const residenceTypeOptions = [
  { value: 'owned', label: 'Owned' },
  { value: 'rented', label: 'Rented' },
  { value: 'company', label: 'Company Provided' },
  { value: 'family', label: 'Family' },
];

export default function Step4Address() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const currentPinCodeRaw = watch('currentPinCode');
  const currentPinCode = currentPinCodeRaw?.toString() || '';
  const residenceType = watch('residenceType');
  const yearsAtCurrentAddress = watch('yearsAtCurrentAddress');
  const sameAsPermanent = watch('sameAsPermanent');

  const { city, state, postOffice, isLoading, error: pinError } = usePinCodeLookup(currentPinCode);

  // Auto-fill when PIN lookup returns data
  useEffect(() => {
    if (city) setValue('currentCity', city, { shouldValidate: true });
    if (state) setValue('currentState', state, { shouldValidate: true });
    if (postOffice) setValue('currentPostOffice', postOffice, { shouldValidate: true });
  }, [city, state, postOffice, setValue]);

  // Copy current to permanent when checkbox checked
  useEffect(() => {
    if (sameAsPermanent) {
      setValue('permanentAddressLine1', watch('currentAddressLine1'));
      setValue('permanentAddressLine2', watch('currentAddressLine2'));
      setValue('permanentPinCode', watch('currentPinCode'));
      setValue('permanentCity', watch('currentCity'));
      setValue('permanentState', watch('currentState'));
      setValue('permanentPostOffice', watch('currentPostOffice'));
    }
  }, [sameAsPermanent, watch, setValue]);

  // State mismatch warning
  const userState = watch('currentState');
  const stateMismatch = userState && state && userState !== state;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Current Address</h3>
      <Input
        label="Address Line 1"
        name="currentAddressLine1"
        register={register('currentAddressLine1', { required: 'Address required' })}
        error={errors.currentAddressLine1?.message}
        required
      />
      <Input
        label="Address Line 2 (optional)"
        name="currentAddressLine2"
        register={register('currentAddressLine2')}
        error={errors.currentAddressLine2?.message}
      />
      <Input
        label="PIN Code"
        name="currentPinCode"
        type="text"
        register={register('currentPinCode', {
          required: 'PIN code required',
          pattern: { value: /^\d{6}$/, message: '6 digits required' },
        })}
        error={errors.currentPinCode?.message || pinError}
        required
      />
      {isLoading && <div className="text-sm text-gray-500">Looking up PIN...</div>}
      <Input
        label="City"
        name="currentCity"
        register={register('currentCity', { required: 'City required' })}
        error={errors.currentCity?.message}
        required
      />
      <Input
        label="State"
        name="currentState"
        register={register('currentState', { required: 'State required' })}
        error={errors.currentState?.message}
        required
      />
      {stateMismatch && (
        <div className="text-warning text-sm">
          Warning: State ({userState}) differs from PIN code state ({state})
        </div>
      )}
      <Input
        label="Post Office"
        name="currentPostOffice"
        register={register('currentPostOffice', { required: 'Post office required' })}
        error={errors.currentPostOffice?.message}
        required
      />

      <Select
        label="Residence Type"
        name="residenceType"
        options={residenceTypeOptions}
        register={register('residenceType', { required: 'Select residence type' })}
        error={errors.residenceType?.message}
        required
      />

      {residenceType === 'rented' && (
        <Input
          label="Monthly Rent (₹)"
          name="rentAmount"
          type="number"
          register={register('rentAmount', { required: 'Rent amount required', valueAsNumber: true })}
          error={errors.rentAmount?.message}
          required
        />
      )}

      <Input
        label="Years at Current Address"
        name="yearsAtCurrentAddress"
        type="number"
        register={register('yearsAtCurrentAddress', { required: 'Years required', valueAsNumber: true })}
        error={errors.yearsAtCurrentAddress?.message}
        required
      />

      {yearsAtCurrentAddress < 1 && (
        <div className="border-l-4 pl-4 border-warning">
          <h4 className="font-medium">Previous Address</h4>
          <Input
            label="Previous Address Line 1"
            name="prevAddressLine1"
            register={register('prevAddressLine1', { required: 'Previous address required' })}
            error={errors.prevAddressLine1?.message}
            required
          />
          <Input
            label="Previous PIN Code"
            name="prevPinCode"
            type="text"
            register={register('prevPinCode', { pattern: /^\d{6}$/, message: '6 digits' })}
            error={errors.prevPinCode?.message}
          />
        </div>
      )}

      <hr className="my-4" />

      <Checkbox
        label="Same as current address for permanent address"
        name="sameAsPermanent"
        register={register('sameAsPermanent')}
      />

      {!sameAsPermanent && (
        <div>
          <h3 className="text-lg font-semibold mt-4">Permanent Address</h3>
          <Input
            label="Permanent Address Line 1"
            name="permanentAddressLine1"
            register={register('permanentAddressLine1', { required: 'Permanent address required' })}
            error={errors.permanentAddressLine1?.message}
            required
          />
          <Input
            label="Permanent Address Line 2 (optional)"
            name="permanentAddressLine2"
            register={register('permanentAddressLine2')}
          />
          <Input
            label="Permanent PIN Code"
            name="permanentPinCode"
            type="text"
            register={register('permanentPinCode', { required: 'PIN required', pattern: /^\d{6}$/ })}
            error={errors.permanentPinCode?.message}
            required
          />
          <Input
            label="Permanent City"
            name="permanentCity"
            register={register('permanentCity', { required: 'City required' })}
            error={errors.permanentCity?.message}
            required
          />
          <Input
            label="Permanent State"
            name="permanentState"
            register={register('permanentState', { required: 'State required' })}
            error={errors.permanentState?.message}
            required
          />
        </div>
      )}
    </div>
  );
}