import { StepHeader } from "@/components/CreateTrip/StepHeader";
import { tripCategories, difficulties } from "@/imports/constants";
import type { TripData } from "@/imports/types";

interface Step2Props {
  tripData: TripData;
  updateTripData: (field: string, value: any) => void;
}

export function Step2TripBasics({ tripData, updateTripData }: Step2Props) {
  return (
    <div className="space-y-6">
      <StepHeader
        title="Trip Basics"
        description="Provide essential information about your trip"
      />

      <div>
        <label className="block font-semibold text-text-[#00b70d] mb-2">
          Trip Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Sahara Desert Adventure"
          value={tripData.title}
          onChange={(e) => updateTripData("title", e.target.value)}
          className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
        />
      </div>

      <div>
        <label className="block font-semibold text-text-[#00b70d] mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="Describe your trip experience..."
          value={tripData.description}
          onChange={(e) => updateTripData("description", e.target.value)}
          rows={5}
          className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b70d] resize-none"
        />
      </div>

      <div>
        <label className="block font-semibold text-text-[#00b70d] mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {tripCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateTripData("category", cat)}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                tripData.category === cat
                  ? "bg-[#00b70d] text-white"
                  : "bg-bg-[#ff5900] text-text-[#00b70d] hover:bg-[#e2e8f0]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-semibold text-text-[#00b70d] mb-2">
          Difficulty Level <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => updateTripData("difficulty", diff)}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                tripData.difficulty === diff
                  ? "bg-[#00b70d] text-white"
                  : "bg-bg-[#ff5900] text-text-[#00b70d] hover:bg-[#e2e8f0]"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
