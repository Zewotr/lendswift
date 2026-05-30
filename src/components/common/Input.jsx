import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  helpText,
  required,
  ...rest
}, ref) => {
  const id = `field-${name}`;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
          error ? 'border-error' : 'border-gray-300'
        }`}
        {...rest}
      />
      {helpText && !error && (
        <p id={`${id}-help`} className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <div id={`${id}-error`} role="alert" aria-live="polite" className="mt-1 text-sm text-error">
          {error}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;