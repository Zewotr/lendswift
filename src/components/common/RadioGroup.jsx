import { forwardRef } from 'react';

const RadioGroup = forwardRef(({
  label,
  name,
  options,
  error,
  required,
  layout = 'horizontal',
  ...rest
}, ref) => {
  const id = `field-${name}`;

  return (
    <div className="mb-4" role="radiogroup" aria-labelledby={`${id}-label`}>
      {label && (
        <span id={`${id}-label`} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-error">*</span>}
        </span>
      )}
      <div className={`flex ${layout === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-2'}`}>
        {options.map((opt) => (
          <label key={opt.value} className="inline-flex items-center">
            <input
              ref={ref}
              type="radio"
              name={name}
              value={opt.value}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              {...rest}
            />
            <span className="ml-2 text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <div role="alert" aria-live="polite" className="mt-1 text-sm text-error">{error}</div>
      )}
    </div>
  );
});

RadioGroup.displayName = 'RadioGroup';
export default RadioGroup;