import { Check, Loader2, Save } from "lucide-react";
import { StepHeader } from "@/components/CreateTrip/StepHeader";
import { ReviewSection } from "@/components/ReviewSection";
import { includedOptions } from "@/imports/constants";
import type { TripData } from "@/imports/types";

interface Step8Props {
  tripData: TripData;
  mergedStops: Array<{ id: string; label: string; type: "meeting" | "destination" | "service"; time?: string }>;
  duration: { days: number; nights: number } | null;
  allActivities: string[];
  onPublish: () => void;
  onSaveDraft: () => void;
  onEditStep: (step: number) => void;
  onUpdateScope: (scope: "public" | "private") => void;
  isSubmitting: boolean;
  submitAction: "draft" | "published" | null;
}

export function Step8ReviewAndPublish({
  tripData,
  mergedStops,
  duration,
  allActivities,
  onPublish,
  onSaveDraft,
  onEditStep,
  isSubmitting,
  submitAction,
  onUpdateScope,
}: Step8Props) {
  const premadeIncluded = includedOptions.filter((item) => tripData.included.includes(item));
  const customIncluded = tripData.included.filter((item) => !includedOptions.includes(item));
  const maxGrossRevenue = Math.floor(tripData.pricePerPerson * tripData.maxParticipants);
  const platformFee = Math.floor(maxGrossRevenue * 0.1);
  const netRevenue = Math.floor(maxGrossRevenue - platformFee);
  return (
    <div className="space-y-6">
      <StepHeader
        title="Review & Publish"
        description="Review your trip details before publishing"
      />

      {/* Review Sections */}
      <div className="space-y-4 break-words">
        <ReviewSection
          title="Trip Basics"
          onEdit={() => onEditStep(2)}
          content={
            <div className="space-y-2 text-sm break-words">
              <p className="break-words">
                <span className="font-semibold">Title:</span> {tripData.title || "Not set"}
              </p>
              <p className="break-words">
                <span className="font-semibold">Category:</span> {tripData.category || "Not set"}
              </p>
              <p className="break-words">
                <span className="font-semibold">Difficulty:</span> {tripData.difficulty || "Not set"}
              </p>
              <p className="break-words whitespace-pre-wrap">
                <span className="font-semibold">Description:</span> {tripData.description || "Not set"}
              </p>
            </div>
          }
        />

        <ReviewSection
          title="Schedule"
          onEdit={() => onEditStep(3)}
          content={
            <div className="space-y-2 text-sm break-words">
              <p className="break-words">
                <span className="font-semibold">Dates:</span> {tripData.startDate || "Not set"} to{' '}
                {tripData.endDate || "Not set"}
              </p>
              {duration && (
                <p className="break-words">
                  <span className="font-semibold">Duration:</span> {duration.days} Days, {duration.nights} Nights
                </p>
              )}
              <div>
                <span className="font-semibold">Stops & Destinations:</span>
                {mergedStops.length > 0 ? (
                  <ul className="ml-4 mt-1 space-y-1">
                    {mergedStops.map((stop) => (
                      <li key={stop.id} className="break-words flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center size-4 rounded-full text-[10px] font-bold ${
                            stop.type === "destination"
                              ? "bg-[#fff1e8] text-[#ff5900]"
                              : stop.type === "service"
                                ? "bg-[#e8f0fe] text-[#0a84ff]"
                                : "bg-[#e9fbe9] text-[#00b70d]"
                          }`}
                        >
                          {stop.type === "destination" ? "D" : stop.type === "service" ? "SV" : "S"}
                        </span>
                        <span>
                          {stop.label}
                          {stop.time ? ` - ${stop.time}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span> Not set</span>
                )}
              </div>
              {tripData.itinerary && tripData.itinerary.length > 0 && (
                <div className="mt-4">
                  <p>
                    <span className="font-semibold">Itinerary:</span>
                  </p>
                  <ul className="ml-4 space-y-2 mt-2">
                    {tripData.itinerary.map((item, index) => (
                      <li key={index} className="break-words">
                        <p className="font-medium break-words">
                          Day {index + 1}: {item.summary}
                        </p>
                        {item.details && (
                          <p className="text-sm text-[#6a7282] whitespace-pre-wrap break-words">{item.details}</p>
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
                  className="bg-[#ff59001A] text-[#ff5900] px-3 py-1 rounded-full text-sm break-words max-w-full font-medium"
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
                    {premadeIncluded.map((item) => (
                      <span
                        key={item}
                        className="bg-[#00b70d]/10 text-[#00b70d] px-3 py-1 rounded-full text-sm font-medium break-words max-w-full"
                      >
                        {item}
                      </span>
                    ))}
                    {customIncluded.map((item) => (
                      <span
                        key={item}
                        className="bg-[#00b70d]/10 text-[#00b70d] px-3 py-1 rounded-full text-sm font-medium break-words max-w-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {tripData.excluded.length > 0 && (
                <div>
                  <p className="font-semibold text-sm mb-2">What's Not Included:</p>
                  <div className="flex flex-wrap gap-2">
                    {tripData.excluded.map((item) => (
                      <span
                        key={item}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium break-words max-w-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {tripData.whatToBring.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold text-sm">What to Bring:</p>
                  <ul className="text-sm ml-4 space-y-1 mt-2">
                    {tripData.whatToBring.map((item) => (
                      <li key={item} className="flex items-start gap-2 break-words">
                        <span className="text-[#00b70d]">•</span>
                        <span className="break-words">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tripData.selectedServices.length > 0 && (
                <div className="mt-3">
                  <p className="font-semibold text-sm mb-2">Services:</p>
                  <div className="flex flex-wrap gap-2">
                    {tripData.selectedServices.map((service) => (
                      <span
                        key={service.id}
                        className="bg-[#e8f0fe] text-[#0a84ff] px-3 py-1 rounded-full text-sm font-medium break-words max-w-full"
                      >
                        {service.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          }
        />

        <ReviewSection
          title="Participants & Pricing"
          onEdit={() => onEditStep(6)}
          content={
            <div className="space-y-2 text-sm break-words">
              <p className="break-words">
                <span className="font-semibold">Capacity:</span> {tripData.minParticipants} - {tripData.maxParticipants}{' '}
                participants
              </p>
              <p className="break-words">
                <span className="font-semibold">Price:</span> {tripData.pricePerPerson.toLocaleString()} DZD per
                person
              </p>
              <p className="break-words">
                <span className="font-semibold">Total Revenue:</span> {maxGrossRevenue.toLocaleString()} DZD
              </p>
              <p className="break-words">
                <span className="font-semibold">Platform Fee (10%):</span> {platformFee.toLocaleString()} DZD
              </p>
              <div className="font-semibold border-t border-[#e2e8f0] pt-2 flex justify-between">
                <span>Net Revenue:</span>
                <span className="text-[#00b70d]">{netRevenue.toLocaleString()} DZD</span>
              </div>
            </div>
          }
        />

        {/* Visibility Section */}
        <ReviewSection
          title="Trip Visibility"
          onEdit={() => onEditStep(2)} // Edit in Trip Basics step
          content={
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Visibility:</span>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={tripData.scope === 'public'}
                      onChange={(e) => onUpdateScope('public')}
                      className="h-4 w-4 text-[#00b70d] border-gray-300 focus:ring-[#00b70d]"
                    />
                    <span className="text-sm font-medium">Public</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={tripData.scope === 'private'}
                      onChange={(e) => onUpdateScope('private')}
                      className="h-4 w-4 text-[#00b70d] border-gray-300 focus:ring-[#00b70d]"
                    />
                    <span className="text-sm font-medium">Private (Invite Only)</span>
                  </label>
                </div>
              </div>
              {tripData.scope === 'private' && (
                <div className="mt-2 text-sm text-[#6b7280]">
                  <p className="font-medium mb-1">How it works:</p>
                  <p className="break-words">
                    Only people with the invite link can find and join this trip. Share the link from your dashboard.
                  </p>
                </div>
              )}
            </div>
          }
        />
      </div>

      {/* Publish Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#e2e8f0]">
        <button
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-[#e2e8f0] rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitAction === "draft" ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
          {submitAction === "draft" ? "Saving Draft..." : "Save as Draft"}
        </button>
        <button
          onClick={onPublish}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-[#00b70d] text-white rounded-xl font-bold hover:bg-[#00a00a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
        >
          {submitAction === "published" ? <Loader2 className="size-5 animate-spin" /> : <Check className="size-5" />}
          {submitAction === "published" ? "Publishing Trip..." : "Publish Trip"}
        </button>
      </div>
    </div>
  );
}
