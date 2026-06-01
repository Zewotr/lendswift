import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // ✅ import Zod
import ProgressBar from './ProgressBar';
import StepNavigation from './StepNavigation';
import Step1LoanType from '../../steps/Step1LoanType';
import Step2PersonalInfo from '../../steps/Step2PersonalInfo';
import { getStep1SchemaWithAge } from '../../steps/step1Schema';
import { step2Schema } from '../../steps/step2Schema';

// Helper: ensure every step returns a proper Zod schema
const getValidSchema = (step, formData) => {
  try {
    const schema = step.validate(formData);
    // If the step intentionally returns null (no validation), return empty schema
    if (schema === null) {
      return z.object({});
    }
    // If it's a valid Zod schema (has safeParse), return it
    if (schema && typeof schema.safeParse === 'function') {
      return schema;
    }
  } catch (err) {
    console.error(`Error in step ${step.id} validation:`, err);
  }
  // Fallback: empty schema that always passes validation
  return z.object({});
};

const STEPS = [
  {
    id: 'loan-type',
    title: 'Loan Type',
    component: Step1LoanType,
    validate: (formData) => getStep1SchemaWithAge(formData),
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
    validate: () => null,
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
    isVisible: (formData) => {
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

  const visibleSteps = STEPS.filter(step => step.isVisible(formData));
  const currentStep = visibleSteps[currentStepIndex];
  const isLastStep = currentStepIndex === visibleSteps.length - 1;

  // ✅ Dynamic resolver that always uses a valid Zod schema
  const dynamicResolver = async (data, context) => {
    const schema = getValidSchema(currentStep, data);
    try {
      const resolver = zodResolver(schema);
      const result = await resolver(data, context);
    // result should be { values, errors }
      return result;
    } catch (err) {
      console.error('zodResolver error:', err);
      return { values: data, errors: {} };
    }
  };

  const methods = useForm({
    defaultValues: formData,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: dynamicResolver,
  });

  const { trigger, handleSubmit, watch } = methods;

  useEffect(() => {
    const subscription = watch((value) => setFormData(value));
    return () => subscription.unsubscribe();
  }, [watch]);

  // Re-validate when DOB changes (cross-step)
  useEffect(() => {
    trigger();
  }, [formData.dateOfBirth, trigger]);

  const handleNext = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    if (isLastStep) {
      handleSubmit((data) => {
        console.log('Final submission:', data);
        alert('Application submitted! (demo)');
      })();
      return;
    }
    setCurrentStepIndex(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStepIndex(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const CurrentStepComponent = currentStep.component;

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <ProgressBar steps={visibleSteps} currentStep={currentStepIndex} />
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