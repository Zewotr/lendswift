export default function ProgressBar({ steps, currentStep }) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
        <span>Step {currentStep + 1} of {steps.length}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
          aria-label={`Progress: step ${currentStep + 1} of ${steps.length}`}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500 overflow-x-auto">
        {steps.map((step, idx) => (
          <span
            key={step.id}
            className={`${idx === currentStep ? 'font-bold text-primary' : ''} ${
              idx < currentStep ? 'text-accent' : ''
            } whitespace-nowrap`}
          >
            {step.title}
          </span>
        ))}
      </div>
    </div>
  );
}