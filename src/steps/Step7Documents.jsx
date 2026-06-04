import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import FileUpload from '../components/common/FileUpload';
import SignatureCanvas from '../components/common/SignatureCanvas';

const Step7Documents = () => {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const loanType = watch('loanType');
  const employmentType = watch('employmentType');
  const panVerified = watch('panNumber') && !watch('panNumberError');

  const [uploadStatus, setUploadStatus] = useState({});

  // Determine document requirements
  const requiredDocs = {
    panCard: !panVerified,
    aadhaarCard: true,
    salarySlips: employmentType === 'salaried',
    bankStatements: true,
    itr: employmentType !== 'salaried',
    propertyDocs: loanType === 'home',
    businessReg: loanType === 'business',
    gstReturns: loanType === 'business',
    photograph: true,
  };

  const handleFileChange = (fieldName, files, uploadComplete = false) => {
    setValue(fieldName, files, { shouldValidate: true });
    if (uploadComplete) {
      setUploadStatus(prev => ({ ...prev, [fieldName]: files.length > 0 }));
    }
  };

  // Check if all required docs are uploaded (status true)
  const allRequiredUploaded = () => {
    for (const [doc, isRequired] of Object.entries(requiredDocs)) {
      if (isRequired && !uploadStatus[doc]) {
        return false;
      }
    }
    return true;
  };

  // Also ensure e-signature is provided
  const signature = watch('eSignature');
  const isSignatureValid = signature && signature !== '';

  // Expose validation to parent via useEffect (optional: set a global form validity)
  useEffect(() => {
    const isValid = allRequiredUploaded() && isSignatureValid;
    setValue('documentsStepValid', isValid, { shouldValidate: true });
  }, [uploadStatus, signature, setValue]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Required Documents</h3>
      {requiredDocs.panCard && (
        <FileUpload
          label="PAN Card Copy"
          name="panCard"
          onChange={(files, complete) => handleFileChange('panCard', files, complete)}
          required
        />
      )}
      {requiredDocs.aadhaarCard && (
        <FileUpload
          label="Aadhaar Card (Front + Back)"
          name="aadhaarCard"
          onChange={(files, complete) => handleFileChange('aadhaarCard', files, complete)}
          required
        />
      )}
      {requiredDocs.salarySlips && (
        <FileUpload
          label="Salary Slips (Last 3 months)"
          name="salarySlips"
          onChange={(files, complete) => handleFileChange('salarySlips', files, complete)}
          required
        />
      )}
      {requiredDocs.bankStatements && (
        <FileUpload
          label="Bank Statements (Last 6 months)"
          name="bankStatements"
          onChange={(files, complete) => handleFileChange('bankStatements', files, complete)}
          required
        />
      )}
      {requiredDocs.itr && (
        <FileUpload
          label="ITR (Last 2 years)"
          name="itr"
          onChange={(files, complete) => handleFileChange('itr', files, complete)}
          required
        />
      )}
      {requiredDocs.propertyDocs && (
        <FileUpload
          label="Property Documents"
          name="propertyDocs"
          onChange={(files, complete) => handleFileChange('propertyDocs', files, complete)}
          required
        />
      )}
      {requiredDocs.businessReg && (
        <FileUpload
          label="Business Registration Certificate"
          name="businessReg"
          onChange={(files, complete) => handleFileChange('businessReg', files, complete)}
          required
        />
      )}
      {requiredDocs.gstReturns && (
        <FileUpload
          label="GST Returns (Last 4 quarters)"
          name="gstReturns"
          onChange={(files, complete) => handleFileChange('gstReturns', files, complete)}
          required
        />
      )}
      {requiredDocs.photograph && (
        <FileUpload
          label="Passport Size Photograph"
          name="photograph"
          accept={['image/jpeg', 'image/png']}
          maxSize={2 * 1024 * 1024}
          maxFiles={1}
          onChange={(files, complete) => handleFileChange('photograph', files, complete)}
          required
        />
      )}

      <SignatureCanvas
        onChange={(sig) => {
          setValue('eSignature', sig, { shouldValidate: true });
        }}
        error={errors.eSignature?.message}
        required
      />
      
      {!allRequiredUploaded() && (
        <div className="bg-warning/10 border border-warning p-3 rounded text-warning text-sm">
          Please upload all required documents and wait for upload to complete.
        </div>
      )}
    </div>
  );
};

export default Step7Documents;