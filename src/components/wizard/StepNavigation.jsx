export default function StepNavigation({ currentStep, totalSteps, onNext, onPrev }) {
  return (
    <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentStep === 0}
        className={`px-6 py-2 rounded-md font-medium ${
          currentStep === 0
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        } transition`}
        aria-label="Previous step"
      >
        Previous
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={currentStep === totalSteps - 1}
        className={`px-6 py-2 rounded-md font-medium text-white ${
          currentStep === totalSteps - 1
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary hover:bg-primary/90'
        } transition`}
        aria-label="Next step"
      >
        {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
      </button>
    </div>
  );
}