import { useState, useEffect } from 'react';
import pinData from '../utils/pinCodeData.json';

export const usePinCodeLookup = (pinCode) => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postOffice, setPostOffice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pinCode || pinCode.length !== 6) {
      setCity('');
      setState('');
      setPostOffice('');
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate network delay
    const timer = setTimeout(() => {
      const entry = pinData[pinCode];
      if (entry) {
        setCity(entry.city);
        setState(entry.state);
        setPostOffice(entry.postOffice);
        setError(null);
      } else {
        setCity('');
        setState('');
        setPostOffice('');
        setError('PIN code not found in our database');
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pinCode]);

  return { city, state, postOffice, isLoading, error };
};