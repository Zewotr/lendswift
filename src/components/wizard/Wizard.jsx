import { useState, useRef, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ProgressBar from './ProgressBar';
import StepNavigation from './StepNavigation';
import Step1LoanType from '../../steps/Step1LoanType';
import Step2PersonalInfo from '../../steps/Step2PersonalInfo';
// Other steps will be imported later
import { getStep1Schema } from '../../steps/step1Schema';
import { step2Schema } from '../../steps/step2Schema';

// Step registry (order, component, title, visibility condition, validation schema getter)
const STEPS = [
  {
    id: 'loan-type',
    title: 'Loan Type',
    component: Step1LoanType,
    validate: (data) => getStep1Schema(data.loanType),
    isVisible: () => true,
  },
  {
    id: 'personal',
    title: 'Personal Info',
    component: Step2PersonalInfo,
    validate: () => step2Schema,
    isVisible: () => true,
  },
  {
    id: 'kyc',
    title: 'KYC',
    component: () => <div className="p-4">Step 3: KYC (coming soon)</div>,
    validate: () => null, // no validation until implemented
    isVisible: () => true,
  },
  {
    id: 'address',
    title: 'Address',
    component: () => <div className="p-4">Step 4: Address (coming soon)</div>,
    validate: () => null,
    isVisible: () => true,
  },
  {
    id: 'employment',
    title: 'Employment',
    component: () => <div className="p-4">Step 5: Employment (coming soon)</div>,
    validate: () => null,
    isVisible: () => true,
  },
  {
    id: 'co-applicant',
    title: 'Co-Applicant',
    component: () => <div className="p-4">Step 6: Co-Applicant (conditional)</div>,
    validate: () => null,
    // Example conditional visibility – will be dynamic later
    isVisible: (formData) => {
      // Personal > 5L or Home always or Business > 20L
      const { loanType, loanAmount } = formData;
      if (loanType === 'home') return true;
      if (loanType === 'personal' && loanAmount > 500000) return true;
      if (loanType === 'business' && loanAmount > 2000000) return true;
      return false;
    },
  },
  {
    id: 'documents',
    title: 'Documents',
    component: () => <div className="p-4">Step 7: Documents & Signature (coming soon)</div>,
    validate: () => null,
    isVisible: () => true,
  },
  {
    id: 'review',
    title: 'Review',
    component: () => <div className="p-4">Step 8: Review & Submit (coming soon)</div>,
    validate: () => null,
    isVisible: () => true,
  },
];

export default function Wizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const formRef = useRef();

  // Compute visible steps based on current form data
  const visibleSteps = STEPS.filter(step => step.isVisible(formData));
  const currentStep = visibleSteps[currentStepIndex];
  const isLastStep = currentStepIndex === visibleSteps.length - 1;

  const methods = useForm({
    defaultValues: formData,
    resolver: async (data, context) => {
      // Get schema for current step (if any)
      const schema = currentStep.validate(data);
      if (!schema) return { values: data, errors: {} };
      const resolver = zodResolver(schema);
      const result = await resolver(data, context);
      return result;
    },
    mode: 'onChange', // re-run validation on change for real-time feedback
  });

  const { handleSubmit, trigger, getValues, reset } = methods;

  // Keep local formData in sync with react-hook-form values
  useEffect(() => {
    const subscription = methods.watch((value) => {
      setFormData(value);
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  // On step change, re-trigger validation for the new step (to show errors)
  useEffect(() => {
    trigger();
  }, [currentStepIndex, trigger]);

  const handleNext = async () => {
    // Validate current step fields
    const isValid = await trigger();
    if (!isValid) return;

    // If last step, submit the form
    if (isLastStep) {
      handleSubmit(onSubmit)();
      return;
    }

    // Move to next visible step
    setCurrentStepIndex(prev => prev + 1);
    // Optional: scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStepIndex(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = (data) => {
    console.log('Final form submission:', data);
    alert('Application submitted successfully! (demo)');
    // Here you would send data to backend, clear localStorage, etc.
  };

  const CurrentStepComponent = currentStep.component;

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <ProgressBar
              steps={visibleSteps}
              currentStep={currentStepIndex}
            />
            <div className="mt-8">
              <CurrentStepComponent />
            </div>
            <StepNavigation
              currentStep={currentStepIndex}
              totalSteps={visibleSteps.length}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}