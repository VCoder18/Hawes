import { Check, Save } from "lucide-react";
import { StepHeader } from "@/components/CreateTrip/StepHeader";
import { ReviewSection } from "@/components/ReviewSection";
import { includedOptions } from "@/imports/constants";
import type { TripData } from "@/imports/types";

interface Step8Props {
  tripData: TripData;
  mergedStops: Array<{ id: string; label: string; type: "meeting" | "destination"; time?: string }>;
  duration: { days: number; nights: number } | null;
  allActivities: string[];
  onPublish: () => void;
  onSaveDraft: () => void;
  onEditStep: (step: number) => void;
}

export function Step8ReviewAndPublish({
  tripData,
  mergedStops,
  duration,
  allActivities,
  onPublish,
  onSaveDraft,
  onEditStep,
}: Step8Props) {
  const premadeNotIncluded = includedOptions.filter((item) => !tripData.included.includes(item));
  return (
    <div className="space-y-6">
      <StepHeader
        title="Review & Publish"
        description="Review your trip details before publishing"
      />

      {/* Review Sections */}
      <div className="space-y-4">
        <ReviewSection
<<<<<<< Updated upstream
          title="Destinations"
          onEdit={() => onEditStep(1)}
          content={
            <div className="flex flex-wrap gap-2">
              {tripData.destinations.map((dest) => (
                <span
                  key={dest}
                  className="bg-[#00b70d]/10 text-[#00b70d] px-3 py-1 rounded-full text-sm font-medium"
                >
                  {dest}
                </span>
              ))}
            </div>
          }
        />

        <ReviewSection
=======
>>>>>>> Stashed changes
          title="Trip Basics"
          onEdit={() => onEditStep(2)}
          content={
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Title:</span> {tripData.title || "Not set"}
              </p>
              <p>
                <span className="font-semibold">Category:</span> {tripData.category || "Not set"}
              </p>
              <p>
                <span className="font-semibold">Difficulty:</span> {tripData.difficulty || "Not set"}
              </p>
              <p>
                <span className="font-semibold">Description:</span> {tripData.description || "Not set"}
              </p>
            </div>
          }
        />

        <ReviewSection
          title="Schedule"
          onEdit={() => onEditStep(3)}
          content={
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Dates:</span> {tripData.startDate || "Not set"} to{' '}
                {tripData.endDate || "Not set"}
              </p>
              {duration && (
                <p>
                  <span className="font-semibold">Duration:</span> {duration.days} Days, {duration.nights} Nights
                </p>
              )}
              <div>
                <span className="font-semibold">Stops & Destinations:</span>
                {mergedStops.length > 0 ? (
                  <ul className="ml-4 mt-1 space-y-1">
<<<<<<< Updated upstream
                    {tripData.meetingLocations.map((meeting, idx) => (
                      <li key={idx}>
                        • {meeting.location} - {meeting.time}
=======
                    {mergedStops.map((stop) => (
                      <li key={stop.id} className="break-words flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center size-4 rounded-full text-[10px] font-bold ${
                            stop.type === "destination"
                              ? "bg-[#fff1e8] text-[#ff5900]"
                              : "bg-[#e9fbe9] text-[#00b70d]"
                          }`}
                        >
                          {stop.type === "destination" ? "D" : "S"}
                        </span>
                        <span>
                          {stop.label}
                          {stop.time ? ` - ${stop.time}` : ""}
                        </span>
>>>>>>> Stashed changes
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span> Not set</span>
                )}
              </div>
              {tripData.itinerary && tripData.itinerary.length > 0 && (
                <div>
                  <p>
                    <span className="font-semibold">Itinerary:</span>
                  </p>
                  <ul className="ml-4 space-y-2">
                    {tripData.itinerary.map((item, index) => (
                      <li key={index}>
                        <p className="font-medium">
                          Day {index + 1}: {item.summary}
                        </p>
                        {item.details && (
                          <p className="text-sm text-[#6a7282] whitespace-pre-wrap">{item.details}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          }
        />

        <ReviewSection
          title="Activities"
          onEdit={() => onEditStep(4)}
          content={
            <div className="flex flex-wrap gap-2">
              {allActivities.map((activity) => (
                <span
                  key={activity}
                  className="bg-bg-[#ff5900] text-text-[#00b70d] px-3 py-1 rounded-full text-sm"
                >
                  {activity}
                </span>
              ))}
            </div>
          }
        />

        <ReviewSection
          title="Logistics"
          onEdit={() => onEditStep(5)}
          content={
            <div className="space-y-2">
              {tripData.included.length > 0 && (
                <div>
                  <p className="font-semibold text-sm mb-2">What's Included:</p>
                  <div className="flex flex-wrap gap-2">
                    {tripData.included.map((item) => (
                      <span
                        key={item}
                        className="bg-[#00b70d]/10 text-[#00b70d] px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(premadeNotIncluded.length > 0 || tripData.excluded.length > 0) && (
                <div>
                  <p className="font-semibold text-sm mb-2">What's Not Included:</p>
                  <div className="flex flex-wrap gap-2">
                    {premadeNotIncluded.map((item) => (
                      <span
                        key={item}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                    {tripData.excluded.map((item) => (
                      <span
                        key={item}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {tripData.whatToBring.length > 0 && (
                <div>
                  <p className="font-semibold text-sm">What to Bring:</p>
                  <ul className="text-sm ml-4 space-y-1 mt-2">
                    {tripData.whatToBring.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="text-[#00b70d]">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          }
        />

        <ReviewSection
          title="Participants & Pricing"
          onEdit={() => onEditStep(6)}
          content={
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Capacity:</span> {tripData.minParticipants} - {tripData.maxParticipants}{' '}
                participants
              </p>
              <p>
                <span className="font-semibold">Price:</span> {tripData.pricePerPerson.toLocaleString()} DZD per
                person
              </p>
              <p>
                <span className="font-semibold">Total Revenue:</span> {(tripData.pricePerPerson * tripData.maxParticipants).toLocaleString()} DZD
              </p>
              <p>
                <span className="font-semibold">Platform Fee (10%):</span> {(tripData.pricePerPerson * tripData.maxParticipants * 0.1).toLocaleString()} DZD
              </p>
              <p className="font-semibold border-t border-[#e2e8f0] pt-2">
                <span>Net Revenue:</span> {(tripData.pricePerPerson * tripData.maxParticipants * 0.9).toLocaleString()} DZD
              </p>
            </div>
          }
        />
      </div>

      {/* Publish Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#e2e8f0]">
        <button
          onClick={onSaveDraft}
          className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-[#e2e8f0] rounded-xl font-medium text-text-[#00b70d] hover:bg-bg-[#ff5900] transition-colors"
        >
          <Save className="size-5" />
          Save as Draft
        </button>
        <button
          onClick={onPublish}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-[#00b70d] text-white rounded-xl font-medium hover:bg-[#00b70d]-hover transition-colors"
        >
          <Check className="size-5" />
          Publish Trip
        </button>
      </div>
    </div>
  );
}
