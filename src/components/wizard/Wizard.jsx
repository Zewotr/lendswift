import React, { useState, useEffect } from 'react'; // ✅ ensure React is imported
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ProgressBar from './ProgressBar';
import StepNavigation from './StepNavigation';
import Step1LoanType from '../../steps/Step1LoanType';
import Step2PersonalInfo from '../../steps/Step2PersonalInfo';
import Step3KYC from '../../steps/Step3KYC';
import Step4Address from '../../steps/Step4Address';
import Step5Employment from '../../steps/Step5Employment';
import Step6CoApplicant from '../../steps/Step6CoApplicant';
import { getStep1SchemaWithAge } from '../../steps/step1Schema';
import { step2Schema } from '../../steps/step2Schema';
import { step3Schema } from '../../steps/step3Schema';
import { step4Schema } from '../../steps/step4Schema';
import { step5Schema } from '../../steps/step5Schema';
import { step6Schema } from '../../steps/step6Schema';
import { useAutoSave } from '../../hooks/useAutoSave';
import { decryptData } from '../../utils/encryption';

// Helper to get valid schema (handles null steps)
const getValidSchema = (step, formData) => {
  try {
    const schema = step.validate(formData);
    if (schema && typeof schema.safeParse === 'function') return schema;
    if (schema === null) return z.object({}); // no validation
  } catch (err) {
    console.error(`Error in step ${step.id}:`, err);
  }
  return z.object({});
};

// Step registry
const STEPS = [
  {
    id: 'loan-type',
    title: 'Loan Type',
    component: Step1LoanType,
    validate: (data) => getStep1SchemaWithAge(data),
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
    component: Step3KYC,
    validate: () => step3Schema,
    isVisible: () => true,
  },
  {
    id: 'address',
    title: 'Address',
    component: Step4Address,
    validate: () => step4Schema,
    isVisible: () => true,
  },
  {
    id: 'employment',
    title: 'Employment',
    component: Step5Employment,
    validate: () => step5Schema,
    isVisible: () => true,
  },
  {
    id: 'co-applicant',
    title: 'Co-Applicant',
    component: Step6CoApplicant,
    validate: (formData) => {
      const { loanType, loanAmount } = formData;
      const isVisible = 
        loanType === 'home' ||
        (loanType === 'personal' && loanAmount > 500000) ||
        (loanType === 'business' && loanAmount > 2000000);
      return isVisible ? step6Schema : null;
    },
    isVisible: (formData) => {
      const { loanType, loanAmount } = formData;
      return loanType === 'home' ||
        (loanType === 'personal' && loanAmount > 500000) ||
        (loanType === 'business' && loanAmount > 2000000);
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
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [savedDraft, setSavedDraft] = useState(null);

  // Compute visible steps based on formData
  const visibleSteps = STEPS.filter(step => step.isVisible(formData));
  const currentStep = visibleSteps[currentStepIndex];
  const isLastStep = currentStepIndex === visibleSteps.length - 1;

  // Dynamic resolver
  const dynamicResolver = async (data, context) => {
    const schema = getValidSchema(currentStep, data);
    try {
      const resolver = zodResolver(schema);
      const result = await resolver(data, context);
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

  const { trigger, handleSubmit, watch, reset } = methods;

  // Sync formData with watch
  useEffect(() => {
    const subscription = watch((value) => setFormData(value));
    return () => subscription.unsubscribe();
  }, [watch]);

  // Re-validate when DOB changes (cross-step)
  useEffect(() => {
    trigger();
  }, [formData.dateOfBirth, trigger]);

  // Auto-save hook
  useAutoSave(formData, currentStepIndex, 30000);

  // Check for saved draft on mount
  useEffect(() => {
    const checkSavedDraft = async () => {
      const encrypted = localStorage.getItem('lendswift_draft');
      if (!encrypted) return;
      try {
        const decrypted = await decryptData(encrypted);
        const ageHours = (Date.now() - new Date(decrypted.timestamp)) / (1000 * 60 * 60);
        if (ageHours > 72) {
          localStorage.removeItem('lendswift_draft');
          return;
        }
        setSavedDraft(decrypted);
        setShowResumeModal(true);
      } catch (err) {
        console.error('Failed to load draft', err);
        localStorage.removeItem('lendswift_draft');
      }
    };
    checkSavedDraft();
  }, []);

  const handleResume = () => {
    if (savedDraft) {
      reset(savedDraft.data);
      setCurrentStepIndex(savedDraft.step);
      setShowResumeModal(false);
    }
  };

  const handleStartFresh = () => {
    localStorage.removeItem('lendswift_draft');
    setShowResumeModal(false);
    reset({});
    setCurrentStepIndex(0);
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    if (isLastStep) {
      handleSubmit((data) => {
        console.log('Final submission:', data);
        alert('Application submitted! (demo)');
        localStorage.removeItem('lendswift_draft'); // clear draft on submit
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

      {/* Resume Modal */}
      {showResumeModal && savedDraft && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">Resume Application?</h2>
            <p className="mb-4">
              You have a saved draft from {new Date(savedDraft.timestamp).toLocaleString()}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleResume}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Resume
              </button>
              <button
                onClick={handleStartFresh}
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}
    </FormProvider>
  );
}