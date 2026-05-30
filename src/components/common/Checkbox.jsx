import { forwardRef } from 'react';

const Checkbox = forwardRef(({
  label,
  name,
  error,
  required,
  ...rest
}, ref) => {
  const id = `field-${name}`;

  return (
    <div className="mb-4">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            name={name}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            aria-describedby={error ? `${id}-error` : undefined}
            {...rest}
          />
        </div>
        <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
          {label} {required && <span className="text-error">*</span>}
        </label>
      </div>
      {error && (
        <div id={`${id}-error`} role="alert" aria-live="polite" className="mt-1 text-sm text-error">
          {error}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
export default Checkbox;