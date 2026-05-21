import { useState } from "react";
import { Plus, X, Calendar, ChevronDown, Pencil, Check } from "lucide-react";
import { StepHeader } from "@/components/CreateTrip/StepHeader";
import { CalendarPicker } from "@/components/CreateTrip/CalendarPicker";
import { MeetingLocationItem } from "@/components/CreateTrip/MeetingLocationItem";
import type { TripData } from "@/imports/types";

interface Step3Props {
  tripData: TripData;
  newMeetingLocation: string;
  onMeetingLocationChange: (val: string) => void;
  newMeetingTime: string;
  onMeetingTimeChange: (val: string) => void;
  onAddMeetingLocation: () => void;
  onRemoveMeetingLocation: (index: number) => void;
  newItinerarySummary: string;
  onItinerarySummaryChange: (val: string) => void;
  newItineraryDetails: string;
  onItineraryDetailsChange: (val: string) => void;
  onAddItinerary: () => void;
  onRemoveItinerary: (index: number) => void;
  onUpdateItinerary: (index: number, newSummary: string, newDetails: string) => void;
  expandedItinerary: Set<number>;
  onToggleItineraryExpanded: (index: number) => void;
  onDateSelect: (date: string, isStart: boolean) => void;
  duration: { days: number; nights: number } | null;
}

export function Step3Schedule({
  tripData,
  newMeetingLocation,
  onMeetingLocationChange,
  newMeetingTime,
  onMeetingTimeChange,
  onAddMeetingLocation,
  onRemoveMeetingLocation,
  newItinerarySummary,
  onItinerarySummaryChange,
  newItineraryDetails,
  onItineraryDetailsChange,
  onAddItinerary,
  onRemoveItinerary,
  onUpdateItinerary,
  expandedItinerary,
  onToggleItineraryExpanded,
  onDateSelect,
  duration,
}: Step3Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editSummary, setEditSummary] = useState("");
  const [editDetails, setEditDetails] = useState("");
  return (
    <div className="space-y-6">
      <StepHeader
        title="Schedule"
        description="Set the dates and meeting details for your trip"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <CalendarPicker
            startDate={tripData.startDate}
            endDate={tripData.endDate}
            onDateSelect={onDateSelect}
          />
        </div>

        {/* Date Summary Cards */}
        <div className="space-y-4">
          {/* Check-in Date */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-2 rounded-full bg-[#00b70d]" />
              <span className="text-xs font-semibold text-text-[#ff5900] uppercase">Check-in Date</span>
            </div>
            <p className="font-bold text-lg text-text-[#00b70d]">
              {tripData.startDate
                ? new Date(tripData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : "Not set"}
            </p>
          </div>

          {/* Duration */}
          {duration && (
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-2 rounded-full bg-[#ff5900]" />
                <span className="text-xs font-semibold text-text-[#ff5900] uppercase">Duration</span>
              </div>
              <p className="font-bold text-lg text-text-[#00b70d]">
                {duration.days} Days, {duration.nights} Nights
              </p>
            </div>
          )}

          {/* Dates Range */}
          {tripData.startDate && tripData.endDate && (
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-4 text-text-[#ff5900]" />
                <span className="text-xs font-semibold text-text-[#ff5900] uppercase">Dates</span>
              </div>
              <p className="text-sm text-text-[#00b70d]">
                {new Date(tripData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                {new Date(tripData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block font-semibold text-text-[#00b70d] mb-2">
          Meeting Locations <span className="text-red-500">*</span>
        </label>

        {/* Meeting Location List */}
        {tripData.meetingLocations.length > 0 && (
          <div className="mb-3 space-y-2">
            {tripData.meetingLocations.map((meeting, index) => (
              <MeetingLocationItem
                key={index}
                location={meeting.location}
                time={meeting.time}
                onRemove={() => onRemoveMeetingLocation(index)}
              />
            ))}
          </div>
        )}

        {/* Add Meeting Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="e.g., Central Station, Algiers"
            value={newMeetingLocation}
            onChange={(e) => onMeetingLocationChange(e.target.value)}
            className="sm:col-span-2 px-4 py-3 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
          />
          <input
            type="text"
            placeholder="e.g., 1:00 PM"
            value={newMeetingTime}
            onChange={(e) => onMeetingTimeChange(e.target.value)}
            className="px-4 py-3 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
          />
        </div>
        <button
          onClick={onAddMeetingLocation}
          className="mt-2 px-4 py-2 bg-[#00b70d] text-white rounded-lg font-medium hover:bg-[#00b70d]-hover transition-colors flex items-center gap-2"
        >
          <Plus className="size-4" />
          Add Meeting Location
        </button>
      </div>

      <div>
        <label className="block font-semibold text-text-[#00b70d] mb-2">
          Itinerary (Optional)
        </label>

        {/* Itinerary Items */}
        <div className="space-y-3 mb-4">
          {tripData.itinerary.map((item, index) => (
            <div key={index}>
              {editingIndex === index ? (
                <div className="bg-[#f8f8f4] border-2 border-[#00b70d] rounded-xl p-4 space-y-3">
                  <div>
                    <label className="text-sm font-semibold text-[#6a7282] block mb-2">
                      Day {index + 1}: Summary
                    </label>
                    <input
                      type="text"
                      value={editSummary}
                      onChange={(e) => setEditSummary(e.target.value)}
                      className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#6a7282] block mb-2">
                      Details (Optional)
                    </label>
                    <textarea
                      value={editDetails}
                      onChange={(e) => setEditDetails(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d] resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onUpdateItinerary(index, editSummary, editDetails);
                        setEditingIndex(null);
                      }}
                      className="flex-1 px-4 py-2 bg-[#00b70d] text-white rounded-lg font-medium hover:bg-[#00b70d]/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="size-4" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="flex-1 px-4 py-2 border-2 border-[#e2e8f0] text-[#6a7282] rounded-lg font-medium hover:bg-[#f8f8f4] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[rgba(229,225,220,0.5)] border border-[#d6d0c4] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onToggleItineraryExpanded(index)}
                      className="flex items-center gap-2 flex-1 hover:opacity-80 transition-opacity disabled:hover:opacity-100"
                      disabled={!item.details}
                    >
                      <ChevronDown
                        className={`size-5 transition-transform ${expandedItinerary.has(index) ? 'rotate-180' : ''} ${!item.details ? 'opacity-0' : ''}`}
                      />
                      <span className="text-left text-[#6a7282] flex-1 min-w-0" style={{ wordBreak: 'break-word', hyphens: 'auto' }}>
                        <span className="font-semibold text-[#00b70d]">Day {index + 1}:</span> {item.summary}
                      </span>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingIndex(index);
                          setEditSummary(item.summary);
                          setEditDetails(item.details || "");
                        }}
                        className="p-2 text-[#00b70d] hover:bg-[#00b70d]/10 rounded-lg transition-colors"
                      >
                        <Pencil className="size-5" />
                      </button>
                      <button
                        onClick={() => onRemoveItinerary(index)}
                        className="p-2 text-[#ff5900] hover:bg-[#ff5900]/10 rounded-lg transition-colors"
                      >
                        <X className="size-5" />
                      </button>
                    </div>
                  </div>
                  {expandedItinerary.has(index) && item.details && (
                    <p className="text-sm text-[#6a7282] whitespace-pre-wrap break-words">{item.details}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* New Itinerary Input */}
        <div className="space-y-3 p-4 bg-[#f8f8f4] rounded-xl border-2 border-dashed border-[#d6d0c4]">
          <div>
            <label className="text-sm font-semibold text-[#6a7282] block mb-2">
              Day {tripData.itinerary.length + 1}: Summary
            </label>
            <input
              type="text"
              placeholder="e.g., Arrival and orientation"
              value={newItinerarySummary}
              onChange={(e) => onItinerarySummaryChange(e.target.value)}
              className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#6a7282] block mb-2">
              Details (Optional)
            </label>
            <textarea
              placeholder="Add detailed information about this day..."
              value={newItineraryDetails}
              onChange={(e) => onItineraryDetailsChange(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d] resize-none"
            />
          </div>

          <button
            onClick={onAddItinerary}
            className="w-full px-4 py-2 bg-[#00b70d] text-white rounded-lg font-medium hover:bg-[#00b70d]-hover transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="size-4" />
            Add Day to Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}
