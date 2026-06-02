import { useFormContext } from 'react-hook-form';
import { Input, Select, RadioGroup } from '../components/common';

export default function Step2PersonalInfo() {
  const { register, formState: { errors }, watch } = useFormContext();
  const primaryMobile = watch('mobileNumber');

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const maritalOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
  ];

  return (
    <div className="space-y-6">
      <Input
        label="Full Name (as per PAN)"
        name="fullName"
        register={register('fullName', { required: 'Full name is required' })}
        error={errors.fullName?.message}
        required
      />

      <Input
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        register={register('dateOfBirth', { required: 'Date of birth required', valueAsDate: true })}
        error={errors.dateOfBirth?.message}
        required
        helpText="You must be 21–65 years old"
      />

      <RadioGroup
        label="Gender"
        name="gender"
        options={genderOptions}
        register={register('gender', { required: 'Select gender' })}
        error={errors.gender?.message}
        required
      />

      <Select
        label="Marital Status"
        name="maritalStatus"
        options={maritalOptions}
        register={register('maritalStatus', { required: 'Select marital status' })}
        error={errors.maritalStatus?.message}
        required
        placeholder="Select"
      />

      <Input
        label="Father's Name"
        name="fathersName"
        register={register('fathersName', { required: "Father's name required" })}
        error={errors.fathersName?.message}
        required
      />

      <Input
        label="Mother's Name"
        name="mothersName"
        register={register('mothersName', { required: "Mother's name required" })}
        error={errors.mothersName?.message}
        required
      />

      <Input
        label="Email Address"
        name="email"
        type="email"
        register={register('email', { required: 'Email is required' })}
        error={errors.email?.message}
        required
      />

      <Input
        label="Mobile Number"
        name="mobileNumber"
        type="tel"
        register={register('mobileNumber', { required: 'Mobile number required' })}
        error={errors.mobileNumber?.message}
        required
      />

      <Input
        label="Alternate Mobile (optional)"
        name="alternateMobile"
        type="tel"
        register={register('alternateMobile', {
          validate: (value) => {
            if (!value) return true;
            if (value === primaryMobile) return 'Must differ from primary mobile';
            if (!/^[6-9]\d{9}$/.test(value)) return 'Invalid mobile number';
            return true;
          },
        })}
        error={errors.alternateMobile?.message}
      />
    </div>
  );
}