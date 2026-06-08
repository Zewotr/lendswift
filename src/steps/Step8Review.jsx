import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { calculateEMI, getInterestRate, getTotalCost, getProcessingFee, formatIndianCurrency } from '../utils/emiCalculator';

const Section = ({ title, onEdit, children }) => (
  <div className="border-b pb-4 mb-4">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <button
        type="button"
        onClick={onEdit}
        className="text-sm bg-blue-50 text-primary px-3 py-1 rounded-md hover:bg-blue-100 transition"
      >
        Edit
      </button>
    </div>
    <div className="text-gray-700 space-y-1">{children}</div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between text-sm py-0.5">
    <span className="font-medium">{label}:</span>
    <span>{value || '—'}</span>
  </div>
);

export default function Step8Review({ onEditStep }) {
  const formContext = useFormContext();
  if (!formContext) return <div className="p-4">Loading form context...</div>;

  const { watch } = formContext;

  // Wait for essential data to avoid "undefined" values
  const loanType = watch('loanType');
  if (!loanType) return <div className="p-4">Loading your application data...</div>;

  // Watch all relevant fields
  const values = {
    loanType: watch('loanType'),
    loanAmount: watch('loanAmount'),
    loanTenure: watch('loanTenure'),
    loanPurpose: watch('loanPurpose'),
    fullName: watch('fullName'),
    dateOfBirth: watch('dateOfBirth'),
    gender: watch('gender'),
    maritalStatus: watch('maritalStatus'),
    email: watch('email'),
    mobileNumber: watch('mobileNumber'),
    employmentType: watch('employmentType'),
    monthlyNetSalary: watch('monthlyNetSalary'),
    monthlyIncome: watch('monthlyIncome'),
    companyName: watch('companyName'),
    businessName: watch('businessName'),
    coApplicantName: watch('coApplicantName'),
    coApplicantIncome: watch('coApplicantIncome'),
  };

  const monthlyIncome = values.monthlyNetSalary || values.monthlyIncome || 0;
  const totalIncome = monthlyIncome + (values.coApplicantIncome || 0);
  const rate = getInterestRate(values.loanType);
  const emi = calculateEMI(values.loanAmount, rate, values.loanTenure);
  const totalCost = getTotalCost(emi, values.loanTenure, values.loanAmount);
  const processingFee = getProcessingFee(values.loanAmount);

  const [consents, setConsents] = useState({
    accuracy: false,
    creditCheck: false,
    terms: false,
    communications: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [applicationRef, setApplicationRef] = useState('');

  const allConsentsChecked = Object.values(consents).every(v => v === true);

  const handleConsentChange = (key) => {
    setConsents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = () => {
    if (!allConsentsChecked) return;
    const ref = `LND-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    setApplicationRef(ref);
    setShowSuccess(true);
    localStorage.removeItem('lendswift_draft');
    console.log('Application submitted:', values);
  };

  const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-IN') : '—';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review Your Application</h2>

      {/* Pre-Approval Summary */}
      <div className="bg-primary/5 border border-primary rounded-lg p-4">
        <h3 className="text-xl font-bold text-primary mb-2">Pre‑Approval Summary</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <DetailRow label="Loan Amount" value={`₹ ${formatIndianCurrency(values.loanAmount)}`} />
          <DetailRow label="Tenure" value={`${values.loanTenure} months`} />
          <DetailRow label="Interest Rate" value={`${rate}% p.a.`} />
          <DetailRow label="Monthly EMI" value={`₹ ${formatIndianCurrency(emi)}`} />
          <DetailRow label="Total Cost of Borrowing" value={`₹ ${formatIndianCurrency(totalCost)}`} />
          <DetailRow label="Processing Fee" value={`₹ ${formatIndianCurrency(processingFee)}`} />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          *EMI calculated on reducing balance method. Processing fee: 1% (min ₹2,000, max ₹25,000).
        </div>
      </div>

      {/* Sections with Edit buttons */}
      <Section title="Loan Details" onEdit={() => onEditStep('loan-type')}>
        <DetailRow label="Loan Type" value={values.loanType?.toUpperCase()} />
        <DetailRow label="Amount" value={`₹ ${formatIndianCurrency(values.loanAmount)}`} />
        <DetailRow label="Tenure" value={`${values.loanTenure} months`} />
        <DetailRow label="Purpose" value={values.loanPurpose} />
      </Section>

      <Section title="Personal Information" onEdit={() => onEditStep('personal')}>
        <DetailRow label="Full Name" value={values.fullName} />
        <DetailRow label="Date of Birth" value={formatDate(values.dateOfBirth)} />
        <DetailRow label="Gender" value={values.gender} />
        <DetailRow label="Marital Status" value={values.maritalStatus} />
        <DetailRow label="Email" value={values.email} />
        <DetailRow label="Mobile" value={values.mobileNumber} />
      </Section>

      <Section title="Employment & Income" onEdit={() => onEditStep('employment')}>
        <DetailRow label="Employment Type" value={values.employmentType} />
        {values.employmentType === 'salaried' && <DetailRow label="Company" value={values.companyName} />}
        {(values.employmentType === 'selfEmployed' || values.employmentType === 'businessOwner') && (
          <DetailRow label="Business" value={values.businessName} />
        )}
        <DetailRow label="Monthly Income" value={`₹ ${formatIndianCurrency(monthlyIncome)}`} />
        {values.coApplicantName && (
          <DetailRow label="Co‑applicant" value={`${values.coApplicantName} (₹ ${formatIndianCurrency(values.coApplicantIncome)})`} />
        )}
        <DetailRow label="Total Household Income" value={`₹ ${formatIndianCurrency(totalIncome)}`} />
        <div className={`text-xs mt-1 ${emi > totalIncome * 0.5 ? 'text-error' : 'text-accent'}`}>
          EMI to Income Ratio: {totalIncome ? ((emi / totalIncome) * 100).toFixed(1) : '0'}%
          {emi > totalIncome * 0.5 && ' (Exceeds recommended 50%)'}
        </div>
      </Section>

      {/* Consents */}
      <div className="space-y-2 border-t pt-4">
        <label className="flex items-start gap-2">
          <input type="checkbox" name='consentAccuracy' checked={consents.accuracy} onChange={() => handleConsentChange('accuracy')} />
          <span className="text-sm">I confirm that all information provided is accurate and complete.</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" name='consentCreditCheck' checked={consents.creditCheck} onChange={() => handleConsentChange('creditCheck')} />
          <span className="text-sm">I authorise LendSwift to check my credit score via CIBIL/Equifax.</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" name='consentTerms' checked={consents.terms} onChange={() => handleConsentChange('terms')} />
          <span className="text-sm">I agree to the Terms and Conditions (view PDF).</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" name='consentCommunications' checked={consents.communications} onChange={() => handleConsentChange('communications')} />
          <span className="text-sm">I consent to receive communications regarding this application.</span>
        </label>
      </div>

      {/* Submit button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!allConsentsChecked}
        className={`w-full py-3 rounded-md font-semibold text-white transition ${
          allConsentsChecked ? 'bg-accent hover:bg-accent/90' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Submit Application
      </button>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-4">Application Reference Number:</p>
            <p className="text-2xl font-mono font-bold text-primary mb-4">{applicationRef}</p>
            <p className="text-sm text-gray-500 mb-4">We will review and get back to you within 3 business days.</p>
            <button
              type="button"
              data-testid="close-modal"
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-2 rounded-md"
            >
              Start New Application
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
