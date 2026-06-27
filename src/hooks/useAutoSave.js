import { useEffect, useRef } from 'react';
import { encryptData } from '../utils/encryption';

export const useAutoSave = (formData, currentStep, interval = 30000) => {
  const timerRef = useRef();

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const saveObject = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        step: currentStep,
        loanType: formData.loanType,
        data: formData,
      };
      try {
        const encrypted = await encryptData(saveObject);
        localStorage.setItem('lendswift_draft', encrypted);
        
      } catch (err) {
      }
    }, interval);
    return () => clearTimeout(timerRef.current);
  }, [formData, currentStep, interval]);
};