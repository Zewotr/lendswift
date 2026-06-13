import React, { useState, useEffect, useMemo } from 'react';
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
import Step7Documents from '../../steps/Step7Documents';
import Step8Review from '../../steps/Step8Review';
import { getStep1SchemaWithAge } from '../../steps/step1Schema';
import { step2Schema } from '../../steps/step2Schema';
import { step3Schema } from '../../steps/step3Schema';
import { step4Schema } from '../../steps/step4Schema';
import { step5Schema } from '../../steps/step5Schema';
import { step6Schema } from '../../steps/step6Schema';
import { useAutoSave } from '../../hooks/useAutoSave';
import { encryptData, decryptData } from '../../utils/encryption'; // make sure encryptData is exported

// Helper: get a valid Zod schema (or empty if none)
const getValidSchema = (step, formData) => {
  try {
    const schema = step.validate(formData);
    if (schema && typeof schema.safeParse === 'function') return schema;
    if (schema === null) return z.object({});
  } catch (err) {
    console.error(`Error in step ${step.id}:`, err);
  }
  return z.object({});
};

// Step definitions (review uses handleEditStep which will be defined inside Wizard)
const getSteps = (handleEditStep) => [
  { id: 'loan-type', title: 'Loan Type', component: Step1LoanType, validate: (data) => getStep1SchemaWithAge(data), isVisible: () => true },
  { id: 'personal', title: 'Personal Info', component: Step2PersonalInfo, validate: () => step2Schema, isVisible: () => true },
  { id: 'kyc', title: 'KYC', component: Step3KYC, validate: () => step3Schema, isVisible: () => true },
  { id: 'address', title: 'Address', component: Step4Address, validate: () => step4Schema, isVisible: () => true },
  { id: 'employment', title: 'Employment', component: Step5Employment, validate: () => step5Schema, isVisible: () => true },
  {
    id: 'co-applicant',
    title: 'Co-Applicant',
    component: Step6CoApplicant,
    validate: (data) => {
      const { loanType, loanAmount } = data;
      const visible = loanType === 'home' || (loanType === 'personal' && loanAmount > 500000) || (loanType === 'business' && loanAmount > 2000000);
      return visible ? step6Schema : null;
    },
    isVisible: (data) => {
      const { loanType, loanAmount } = data;
      return loanType === 'home' || (loanType === 'personal' && loanAmount > 500000) || (loanType === 'business' && loanAmount > 2000000);
    },
  },
  { id: 'documents', title: 'Documents', component: Step7Documents, validate: () => null, isVisible: () => true },
  { id: 'review', title: 'Review & Submit', component: (props) => <Step8Review {...props} onEditStep={handleEditStep} />, validate: () => null, isVisible: () => true },
];

export default function Wizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [savedDraft, setSavedDraft] = useState(null);

  // --- Helper to manually save the current form state (used on step change) ---
  const manualSave = async (data, stepIdx) => {
    const saveObject = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      step: stepIdx,
      loanType: data.loanType,
      data: data,
    };
    try {
      const encrypted = await encryptData(saveObject);
      localStorage.setItem('lendswift_draft', encrypted);
      console.log('Manual save on step change');
    } catch (err) {
      console.error('Manual save failed', err);
    }
  };

  const handleEditStep = (stepId) => {
    const index = visibleSteps.findIndex(step => step.id === stepId);
    if (index !== -1) setCurrentStepIndex(index);
  };

  const steps = getSteps(handleEditStep);
  const visibleSteps = useMemo(() => steps.filter(step => step.isVisible(formData)), [formData]);
  const currentStep = visibleSteps[currentStepIndex];
  const isLastStep = currentStepIndex === visibleSteps.length - 1;

  // Dynamic resolver
  const dynamicResolver = async (data, context) => {
    if (!currentStep) return { values: data, errors: {} };
    const schema = getValidSchema(currentStep, data);
    try {
      const resolver = zodResolver(schema);
      return await resolver(data, context);
    } catch (err) {
      return { values: data, errors: {} };
    }
  };

  const methods = useForm({
    defaultValues: formData,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: dynamicResolver,
  });

  const { trigger, handleSubmit, watch, reset, getValues } = methods;

  // 1️⃣ Keep local formData in sync with form values (for conditional visibility)
  useEffect(() => {
    const subscription = watch((value) => setFormData(value));
    return () => subscription.unsubscribe();
  }, [watch]);

  // 2️⃣ Force revalidation when DOB changes (cross-step)
  useEffect(() => {
    trigger();
  }, [formData.dateOfBirth, trigger]);

  // 3️⃣ Auto‑save every 30 seconds
  useAutoSave(formData, currentStepIndex, 30000);

  // 4️⃣ Save manually whenever step changes (to capture data before navigation)
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      manualSave(formData, currentStepIndex);
    }
  }, [currentStepIndex, formData]);

  // 5️⃣ Check for saved draft on mount
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
    if (!currentStep) return;
    const isValid = await trigger();
    if (!isValid) return;

    if (isLastStep) {
      handleSubmit((data) => {
        console.log('Final submission:', data);
        alert('Application submitted!');
        localStorage.removeItem('lendswift_draft');
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

  if (!currentStep) return <div className="p-8 text-center">Loading wizard...</div>;
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
      {showResumeModal && savedDraft && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">Resume Application?</h2>
            <p className="mb-4">Saved draft from {new Date(savedDraft.timestamp).toLocaleString()}</p>
            <div className="flex gap-3">
              <button onClick={handleResume} className="bg-primary text-white px-4 py-2 rounded-md">Resume</button>
              <button onClick={handleStartFresh} className="bg-gray-300 px-4 py-2 rounded-md">Start Fresh</button>
            </div>
          </div>
        </div>
      )}
    </FormProvider>
  );
}