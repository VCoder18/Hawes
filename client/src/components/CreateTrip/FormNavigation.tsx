import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function FormNavigation({ currentStep, totalSteps, onPrevious, onNext }: FormNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-8 mt-8 border-t border-[#e2e8f0]">
      <button
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="flex items-center gap-2 px-6 py-3 border border-[#e2e8f0] rounded-xl font-medium text-text-[#00b70d] hover:bg-bg-[#ff5900] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="size-5" />
        Previous
      </button>

      {currentStep < totalSteps && (
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-[#00b70d] text-white rounded-xl font-medium hover:bg-[#00b70d]-hover transition-colors"
        >
          Next
          <ChevronRight className="size-5" />
        </button>
      )}
    </div>
  );
}


