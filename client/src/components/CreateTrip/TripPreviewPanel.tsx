import { Users, DollarSign, MapPin, Calendar, Clock } from "lucide-react";
import type { TripData } from "@/imports/types";

interface TripPreviewPanelProps {
  tripData: TripData;
  duration: { days: number; nights: number } | null;
  allActivities: string[];
}

export function TripPreviewPanel({ tripData, duration, allActivities }: TripPreviewPanelProps) {
  const previewActivities = allActivities.slice(0, 3);

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
        <h3 className="font-['Lato'] font-bold text-xl text-text-[#00b70d] mb-4">
          Trip Preview
        </h3>

        <div className="space-y-4">
          {tripData.coverImage && (
            <img
              src={tripData.coverImage}
              alt="Cover"
              className="w-full h-40 object-cover rounded-xl"
            />
          )}

          <div>
            <h4 className="font-bold text-lg text-text-[#00b70d] mb-1">
              {tripData.title || "Trip Title"}
            </h4>
            {tripData.category && (
              <span className="inline-block bg-[#00b70d]/10 text-[#00b70d] px-3 py-1 rounded-full text-xs font-medium">
                {tripData.category}
              </span>
            )}
          </div>

          {tripData.destinations.length > 0 && (
            <div className="flex items-start gap-2">
              <MapPin className="size-4 text-text-[#ff5900] mt-0.5 shrink-0" />
              <span className="text-sm text-text-[#ff5900]">
                {tripData.destinations.join(", ")}
              </span>
            </div>
          )}

          {(tripData.startDate || tripData.endDate) && (
            <div className="flex items-start gap-2">
              <Calendar className="size-4 text-text-[#ff5900] mt-0.5 shrink-0" />
              <div className="text-sm text-text-[#ff5900]">
                {tripData.startDate && tripData.endDate ? (
                  <>
                    {new Date(tripData.startDate).toLocaleDateString()} -{" "}
                    {new Date(tripData.endDate).toLocaleDateString()}
                    {duration && (
                      <div className="text-xs text-[#00b70d] font-semibold mt-0.5">
                        {duration.days} Days, {duration.nights} Nights
                      </div>
                    )}
                  </>
                ) : (
                  "Dates not set"
                )}
              </div>
            </div>
          )}

          {tripData.meetingLocations.length > 0 && (
            <div className="border-t border-[#e2e8f0] pt-4">
              <span className="text-xs text-text-[#ff5900] block mb-2">
                Meeting Locations
              </span>
              <div className="space-y-1">
                {tripData.meetingLocations.map((meeting, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Clock className="size-3 text-text-[#ff5900] mt-0.5 shrink-0" />
                    <span className="text-xs text-text-[#00b70d]">
                      {meeting.location} - {meeting.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {previewActivities.length > 0 && (
            <div className="border-t border-[#e2e8f0] pt-4">
              <span className="text-xs text-text-[#ff5900] block mb-2">Activities</span>
              <div className="flex flex-wrap gap-1">
                {previewActivities.map((activity) => (
                  <span
                    key={activity}
                    className="bg-bg-[#ff5900] text-text-[#00b70d] px-2 py-1 rounded text-xs"
                  >
                    {activity}
                  </span>
                ))}
                {allActivities.length > 3 && (
                  <span className="bg-bg-[#ff5900] text-text-[#ff5900] px-2 py-1 rounded text-xs">
                    +{allActivities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 border-t border-[#e2e8f0] pt-4">
            <Users className="size-4 text-text-[#ff5900] mt-0.5 shrink-0" />
            <span className="text-sm text-text-[#ff5900]">
              {tripData.minParticipants} - {tripData.maxParticipants} participants
            </span>
          </div>

          <div className="flex items-start gap-2">
            <DollarSign className="size-4 text-text-[#ff5900] mt-0.5 shrink-0" />
            <span className="text-sm font-bold text-[#00b70d]">
              {tripData.pricePerPerson.toLocaleString()} DZD / person
            </span>
          </div>

          {tripData.difficulty && (
            <div className="pt-4 border-t border-[#e2e8f0]">
              <span className="text-xs text-text-[#ff5900]">Difficulty</span>
              <p className="font-medium text-text-[#00b70d]">{tripData.difficulty}</p>
            </div>
          )}

          {tripData.included.length > 0 && (
            <div className="pt-4 border-t border-[#e2e8f0]">
              <span className="text-xs text-text-[#ff5900] block mb-2">Included</span>
              <div className="flex flex-wrap gap-1">
                {tripData.included.map((item) => (
                  <span
                    key={item}
                    className="bg-bg-[#ff5900] text-text-[#00b70d] px-2 py-1 rounded text-xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


