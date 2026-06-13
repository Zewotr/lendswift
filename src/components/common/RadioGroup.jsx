// import { forwardRef } from 'react';

// const RadioGroup = forwardRef(({
//   label,
//   name,
//   options,
//   error,
//   required,
//   layout = 'horizontal',
//   register,
//   ...rest
// }, ref) => {
//   const id = `field-${name}`;

//   let registration = {};
//   if (register && typeof register === 'function') {
//     registration = register(name, { required: required ? `${label} is required` : false });
//   } else if (register && typeof register === 'object') {
//     registration = register;
//   } else {
//     registration = { name };
//   }

//   return (
//     <div className="mb-4" role="radiogroup" aria-labelledby={`${id}-label`}>
//       {label && (
//         <span id={`${id}-label`} className="block text-sm font-medium text-gray-700 mb-2">
//           {label} {required && <span className="text-error">*</span>}
//         </span>
//       )}
//       <div className={`flex ${layout === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-2'}`}>
//         {options.map((opt) => (
//           <label key={opt.value} className="inline-flex items-center">
//             <input
//               type="radio"
//               value={opt.value}
//               className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
//               {...registration}
//               data-testid={opt['data-testid']} // Pass data-testid for testing
//               {...rest}
//             />
//             <span className="ml-2 text-sm text-gray-700">{opt.label}</span>
//           </label>
//         ))}
//       </div>
//       {error && (
//         <div role="alert" aria-live="polite" className="mt-1 text-sm text-error">{error}</div>
//       )}
//     </div>
//   );
// });

// RadioGroup.displayName = 'RadioGroup';
// export default RadioGroup;
import { forwardRef } from 'react';

const RadioGroup = forwardRef(({
  label,
  name,
  options,
  error,
  required,
  layout = 'horizontal',
  register,
  ...rest
}, ref) => {
  let registration = {};
  if (register && typeof register === 'function') {
    registration = register(name, { required: required ? `${label} is required` : false });
  } else if (register && typeof register === 'object') {
    registration = register;
  } else {
    registration = { name };
  }

  return (
    <fieldset className="mb-4">
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-error">*</span>}
      </legend>
      <div className={`flex ${layout === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-2'}`}>
        {options.map((opt) => (
          <label key={opt.value} className="inline-flex items-center">
            <input
              type="radio"
              value={opt.value}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              aria-required={required}
              {...registration}
              data-testid={opt['data-testid']}
              {...rest}
            />
            <span className="ml-2 text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <div role="alert" aria-live="polite" className="mt-1 text-sm text-error">{error}</div>
      )}
    </fieldset>
  );
});

RadioGroup.displayName = 'RadioGroup';
export default RadioGroup;