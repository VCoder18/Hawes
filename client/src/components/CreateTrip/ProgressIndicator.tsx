import { Check } from "lucide-react";
import { steps } from "@/imports/constants";

interface ProgressIndicatorProps {
  currentStep: number;
  maxStepReached?: number;
  onStepClick?: (stepId: number) => void;
}

export function ProgressIndicator({ currentStep, maxStepReached = currentStep, onStepClick }: ProgressIndicatorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
      {/* Desktop Version - Horizontal with connecting lines */}
      <div className="hidden lg:flex items-center justify-between">
        {steps.map((step, index) => {
          const canClick = step.id <= maxStepReached;
          return (
            <div key={step.id} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => {
                    if (canClick && onStepClick) {
                      onStepClick(step.id);
                    }
                  }}
                  disabled={!canClick}
                  className={`size-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    canClick ? "cursor-pointer hover:scale-105" : "cursor-not-allowed"
                  } ${
                    currentStep === step.id
                      ? "bg-[#ff5900] text-white scale-110"
                      : step.id < currentStep || step.id <= maxStepReached
                      ? "bg-[#00b70d] text-white"
                      : "bg-[#f1f5f9] text-[#64748b]"
                  }`}
                >
                {step.id < maxStepReached && step.id !== currentStep ? (
                    <Check className="size-5" />
                  ) : (
                    <step.icon className="size-5" />
                  )}
                </button>
                <span
                  className={`text-xs mt-2 font-medium text-center ${
                    currentStep === step.id ? "text-[#ff5900]" : "text-text-[#ff5900]"
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 mb-4 transition-all ${
                    step.id < currentStep || step.id < maxStepReached ? "bg-[#00b70d]" : "bg-bg-[#ff5900]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile/Tablet Version - Grid layout without connecting lines */}
      <div className="grid grid-cols-4 gap-4 lg:hidden">
        {steps.map((step) => {
          const canClick = step.id <= maxStepReached;
          return (
            <div key={step.id} className="flex flex-col items-center">
              <button
                onClick={() => {
                  if (canClick && onStepClick) {
                    onStepClick(step.id);
                  }
                }}
                disabled={!canClick}
                className={`size-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  canClick ? "cursor-pointer hover:scale-105" : "cursor-not-allowed"
                } ${
                  currentStep === step.id
                    ? "bg-[#ff5900] text-white scale-110"
                    : step.id < currentStep || step.id <= maxStepReached
                    ? "bg-[#00b70d] text-white"
                    : "bg-[#f1f5f9] text-[#64748b]"
                }`}
              >
                {step.id < maxStepReached && step.id !== currentStep ? (
                  <Check className="size-5" />
                ) : (
                  <step.icon className="size-5" />
                )}
              </button>
              <span
                className={`text-[10px] mt-2 font-medium text-center ${
                  currentStep === step.id ? "text-[#ff5900]" : "text-text-[#ff5900]"
                }`}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


