import { forwardRef, useState } from 'react';

const MaskedInput = forwardRef(({
  label,
  name,
  value,
  onChange,
  error,
  required,
  maskType = 'pan', // 'pan' or 'aadhaar'
  ...rest
}, ref) => {
  const [isMasked, setIsMasked] = useState(true);

  const toggleMask = () => setIsMasked(!isMasked);

  const getDisplayValue = (val) => {
    if (!val || !isMasked) return val || '';
    if (maskType === 'pan') {
      return `XXXXX${val.slice(-4)}`; // PAN show last 4
    }
    // Aadhaar: show last 4 digits
    return `XXXXXXXX${val.slice(-4)}`;
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
        <input
          ref={ref}
          id={id}
          name={name}
          type="text"
          value={getDisplayValue(value)}
          onChange={(e) => {
            // We need to pass the original, unmasked value upstream
            // This is simplified; for RHF you'd call onChange with the raw value
            if (onChange) onChange(e);
          }}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
            error ? 'border-error' : 'border-gray-300'
          }`}
          {...rest}
        />
        <button
          type="button"
          onClick={toggleMask}
          className="absolute right-2 top-2 text-xs text-primary underline"
        >
          {isMasked ? 'Show' : 'Hide'}
        </button>
      </div>
      {error && (
        <div role="alert" aria-live="polite" className="mt-1 text-sm text-error">{error}</div>
      )}
    </div>
  );
});

MaskedInput.displayName = 'MaskedInput';
export default MaskedInput;