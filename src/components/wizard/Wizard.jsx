import { useState } from 'react';
import ProgressBar from './ProgressBar';
import StepNavigation from './StepNavigation';

// Placeholder step components
const Step1Placeholder = () => <div className="p-4">Step 1: Loan Type (coming soon)</div>;
const Step2Placeholder = () => <div className="p-4">Step 2: Personal Info (coming soon)</div>;
const Step3Placeholder = () => <div className="p-4">Step 3: KYC (coming soon)</div>;
const Step4Placeholder = () => <div className="p-4">Step 4: Address (coming soon)</div>;
const Step5Placeholder = () => <div className="p-4">Step 5: Employment (coming soon)</div>;
const Step6Placeholder = () => <div className="p-4">Step 6: Co-Applicant (conditional)</div>;
const Step7Placeholder = () => <div className="p-4">Step 7: Documents & Signature</div>;
const Step8Placeholder = () => <div className="p-4">Step 8: Review & Submit</div>;

const STEPS = [
  { id: 'loan-type', title: 'Loan Type', component: Step1Placeholder },
  { id: 'personal', title: 'Personal Info', component: Step2Placeholder },
  { id: 'kyc', title: 'KYC', component: Step3Placeholder },
  { id: 'address', title: 'Address', component: Step4Placeholder },
  { id: 'employment', title: 'Employment', component: Step5Placeholder },
  { id: 'co-applicant', title: 'Co-Applicant', component: Step6Placeholder },
  { id: 'documents', title: 'Documents', component: Step7Placeholder },
  { id: 'review', title: 'Review', component: Step8Placeholder },
];

export default function Wizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <ProgressBar steps={STEPS} currentStep={currentStep} />
          <div className="mt-8">
            <CurrentStepComponent />
          </div>
          <StepNavigation
            currentStep={currentStep}
            totalSteps={STEPS.length}
            onNext={nextStep}
            onPrev={prevStep}
          />
        </div>
      </div>
    </div>
  );
}