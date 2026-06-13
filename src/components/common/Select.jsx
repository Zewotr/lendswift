import { forwardRef } from 'react';

const Select = forwardRef(({
    label,
    name,
    options = [],
    error,
    helpText,
    required,
    placeholder,
    register,
    ...rest
    }, ref) => {
    const id = `field-${name}`;


  let fieldProps = {};
  if (register && typeof register === 'function') {
    fieldProps = register(name, { required: required ? `${label} is required` : false });
  } else if (register && typeof register === 'object') {
    fieldProps = register;
  } else {
    fieldProps = { name };
  }

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        name={name}
        aria-required={required}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
          error ? 'border-error' : 'border-gray-300'
        }`}
        {...fieldProps}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {helpText && !error && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
      {error && (
        <div role="alert" aria-live="polite" className="mt-1 text-sm text-error">{error}</div>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
