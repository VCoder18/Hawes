import { Check } from "lucide-react";
import { STEPS } from "@/imports/constants";

interface ProgressIndicatorProps {
  currentStep: number;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
      {/* Desktop Version - Horizontal with connecting lines */}
      <div className="hidden lg:flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`size-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  currentStep === step.id
                    ? "bg-[#ff5900] text-white scale-110"
                    : currentStep > step.id
                    ? "bg-[#00b70d] text-white"
                    : "bg-[#f1f5f9] text-[#64748b]"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="size-5" />
                ) : (
                  <step.icon className="size-5" />
                )}
              </div>
              <span
                className={`text-xs mt-2 font-medium text-center ${
                  currentStep === step.id ? "text-[#ff5900]" : "text-text-[#ff5900]"
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 mb-4 transition-all ${
                  currentStep > step.id ? "bg-[#00b70d]" : "bg-bg-[#ff5900]"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile/Tablet Version - Grid layout without connecting lines */}
      <div className="grid grid-cols-4 gap-4 lg:hidden">
        {STEPS.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={`size-10 rounded-full flex items-center justify-center font-bold transition-all ${
                currentStep === step.id
                  ? "bg-[#ff5900] text-white scale-110"
                  : currentStep > step.id
                  ? "bg-[#00b70d] text-white"
                  : "bg-bg-[#ff5900] text-text-[#ff5900]"
              }`}
            >
              {currentStep > step.id ? (
                <Check className="size-5" />
              ) : (
                <step.icon className="size-5" />
              )}
            </div>
            <span
              className={`text-[10px] mt-2 font-medium text-center ${
                currentStep === step.id ? "text-[#ff5900]" : "text-text-[#ff5900]"
              }`}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


