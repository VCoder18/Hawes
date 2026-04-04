import { Plus, X } from "lucide-react";
import { StepHeader } from "@/components/CreateTrip/StepHeader";
import { activityOptions } from "@/imports/constants";
import type { TripData } from "@/imports/types";

interface Step4Props {
  tripData: TripData;
  onToggleActivity: (activity: string) => void;
  customActivity: string;
  onCustomActivityChange: (val: string) => void;
  onAddCustomActivity: () => void;
  onRemoveCustomActivity: (activity: string) => void;
}

export function Step4Activities({
  tripData,
  onToggleActivity,
  customActivity,
  onCustomActivityChange,
  onAddCustomActivity,
  onRemoveCustomActivity,
}: Step4Props) {
  return (
    <div className="space-y-6">
      <StepHeader
        title="Activities"
        description="Select activities that will be available during the trip"
      />

      <div>
        <label className="block font-semibold text-text-[#00b70d] mb-3">
          Available Activities
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {activityOptions.map((activity) => (
            <button
              key={activity}
              onClick={() => onToggleActivity(activity)}
              className={`px-4 py-3 rounded-xl font-medium transition-all text-left ${
                tripData.activities.includes(activity)
                  ? "bg-[#00b70d] text-white"
                  : "bg-bg-[#ff5900] text-text-[#00b70d] hover:bg-[#e2e8f0]"
              }`}
            >
              {activity}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-semibold text-text-[#00b70d] mb-2">
          Custom Activities
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a custom activity..."
            value={customActivity}
            onChange={(e) => onCustomActivityChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onAddCustomActivity()}
            className="flex-1 px-4 py-3 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
          />
          <button
            onClick={onAddCustomActivity}
            className="px-6 py-3 bg-[#00b70d] text-white rounded-xl font-medium hover:bg-[#00b70d]-hover transition-colors"
          >
            <Plus className="size-5" />
          </button>
        </div>
      </div>

      {tripData.customActivities.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-text-[#00b70d]">Your Custom Activities</h3>
          <div className="flex flex-wrap gap-2">
            {tripData.customActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-[#ff5900]/10 text-[#ff5900] px-3 py-1.5 rounded-full"
              >
                <span className="text-sm font-medium">{activity}</span>
                <button
                  onClick={() => onRemoveCustomActivity(activity)}
                  className="hover:bg-[#ff5900]/20 rounded-full p-0.5"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
