type StepIndicatorProps = {
  currentStep: number;
  steps: string[];
};

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <ol className="mb-8 flex flex-wrap gap-2 sm:gap-4">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const active = stepNumber === currentStep;
        const complete = stepNumber < currentStep;

        return (
          <li
            key={label}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm ${
              active
                ? "bg-green text-cream"
                : complete
                  ? "bg-green/15 text-green"
                  : "bg-white text-soil/50"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                active ? "bg-cream text-green" : "bg-soil/10"
              }`}
            >
              {stepNumber}
            </span>
            {label}
          </li>
        );
      })}
    </ol>
  );
}
