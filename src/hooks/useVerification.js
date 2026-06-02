// hooks/useVerification.js
import { useState, useEffect, useCallback } from 'react';
import { validatePAN, validateAadhaar } from '../utils/validators';

export const useVerification = (value, type) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(null);

  const verify = useCallback(async (inputValue) => {
    // Reset states
    setIsVerifying(false);
    setIsVerified(false);
    setError(null);

    if (!inputValue || inputValue.trim() === '') {
      setError(`${type} cannot be empty`);
      return;
    }

    // 1. Synchronous format check
    let isValidFormat = false;
    if (type === 'PAN') isValidFormat = validatePAN(inputValue);
    else if (type === 'Aadhaar') isValidFormat = validateAadhaar(inputValue);

    if (!isValidFormat) {
      setError(`Invalid ${type} format`);
      return;
    }

    // 2. Simulate async verification
    setIsVerifying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // In a real app you would call an API here
      setIsVerified(true);
      setError(null);
    } catch (err) {
      setError('Verification failed. Please try again.');
      setIsVerified(false);
    } finally {
      setIsVerifying(false);
    }
  }, [type]);

  // Trigger verification when value changes (on blur)
  useEffect(() => {
    if (value) verify(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]); // we don't want to re-run on verify change

  return { isVerifying, isVerified, error };
};