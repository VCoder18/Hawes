import { StepHeader } from "@/components/CreateTrip/StepHeader";
import { ParticipantControl } from "@/components/CreateTrip/ParticipantControl";
import { PricingSummary } from "@/components/CreateTrip/PricingSummary";
import { DollarSign } from "lucide-react";
import type { TripData } from "@/imports/types";

interface Step6Props {
  tripData: TripData;
  onMinParticipantsChange: (val: number) => void;
  onMaxParticipantsChange: (val: number) => void;
  onPriceChange: (val: number) => void;
}

export function Step6ParticipantsAndPricing({
  tripData,
  onMinParticipantsChange,
  onMaxParticipantsChange,
  onPriceChange,
}: Step6Props) {
  return (
    <div className="space-y-6">
      <StepHeader
        title="Participants & Pricing"
        description="Set participant limits and pricing for your trip"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ParticipantControl
          label="Minimum Participants"
          value={tripData.minParticipants}
          onIncrement={() => onMinParticipantsChange(tripData.minParticipants + 1)}
          onDecrement={() => onMinParticipantsChange(Math.max(1, tripData.minParticipants - 1))}
          onChange={(value) => onMinParticipantsChange(Math.max(1, value))}
        />

        <ParticipantControl
          label="Maximum Participants"
          value={tripData.maxParticipants}
          onIncrement={() => onMaxParticipantsChange(tripData.maxParticipants + 1)}
          onDecrement={() =>
            onMaxParticipantsChange(Math.max(tripData.minParticipants, tripData.maxParticipants - 1))
          }
          onChange={(value) =>
            onMaxParticipantsChange(Math.max(tripData.minParticipants, value))
          }
        />
      </div>

      <div>
        <label className="block font-semibold text-text-[#00b70d] mb-2">
          Price Per Person (DZD) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text-[#ff5900]" />
          <input
            type="number"
            placeholder="0"
            value={tripData.pricePerPerson || ""}
            onChange={(e) => onPriceChange(parseInt(e.target.value) || 0)}
            className="w-full pl-12 pr-4 py-3 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b70d] text-lg font-bold"
          />
        </div>
      </div>

      <PricingSummary
        minParticipants={tripData.minParticipants}
        maxParticipants={tripData.maxParticipants}
        pricePerPerson={tripData.pricePerPerson}
      />
    </div>
  );
}
