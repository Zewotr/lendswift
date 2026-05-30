import { forwardRef, useState, useEffect } from 'react';

const formatIndianNumber = (value) => {
  if (!value && value !== 0) return '';
  const numStr = value.toString().replace(/,/g, '');
  const [integer, decimal] = numStr.split('.');
  const lastThree = integer.slice(-3);
  const otherNumbers = integer.slice(0, -3);
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') 
    + (otherNumbers ? ',' : '') + lastThree;
  return decimal ? `${formatted}.${decimal}` : formatted;
};

const CurrencyInput = forwardRef(({
  label,
  name,
  value,
  onChange,
  error,
  required,
  placeholder = '0',
  ...rest
}, ref) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value !== undefined && value !== null && value !== '') {
      setDisplayValue(formatIndianNumber(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e) => {
    const raw = e.target.value.replace(/,/g, '');
    const num = parseFloat(raw);
    const newValue = isNaN(num) ? '' : num;
    setDisplayValue(formatIndianNumber(newValue));
    if (onChange) onChange(newValue);
    // For React Hook Form compatibility
    if (ref && typeof ref === 'function') {
      ref(newValue);
    } else if (ref && ref.current) {
      const event = { target: { name, value: newValue } };
      ref.current(event);
    }
  };

  const id = `field-${name}`;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-2 text-gray-500">₹</span>
        <input
          ref={ref}
          id={id}
          name={name}
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
            error ? 'border-error' : 'border-gray-300'
          }`}
          {...rest}
        />
      </div>
      {error && (
        <div role="alert" aria-live="polite" className="mt-1 text-sm text-error">{error}</div>
      )}
    </div>
  );
});

CurrencyInput.displayName = 'CurrencyInput';
export default CurrencyInput;