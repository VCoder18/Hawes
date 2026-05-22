import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TripCard } from "@/components/BrowseTrips/TripCard";
import type { TripData } from "@/imports/types";

interface TripPreviewPanelProps {
  tripData: TripData;
  duration: { days: number; nights: number } | null;
  allActivities: string[];
}

export function TripPreviewPanel({ tripData, duration, allActivities }: TripPreviewPanelProps) {
  const navigate = useNavigate();

  const previewTripCardData = useMemo(() => {
    const images = [
      ...(tripData.coverImage ? [tripData.coverImage] : []),
      ...tripData.additionalImages.map((image) => image.data),
    ];

    return {
      id: "preview-trip",
      title: tripData.title || "Trip Title",
      description: tripData.description || null,
      category: tripData.category || null,
      difficulty: tripData.difficulty || "moderate",
      start_date: tripData.startDate || "",
      end_date: tripData.endDate || "",
      price: tripData.pricePerPerson || 0,
      min_participants: tripData.minParticipants || 1,
      max_participants: tripData.maxParticipants || 1,
      current_participants: 0,
      images,
      stops: tripData.meetingLocations.map((meeting, index) => ({
        id: `preview-stop-${index}`,
        trip_id: "preview-trip",
        stop_type: "meeting",
        destination_id: null,
        location:
          typeof meeting.lat === "number" && typeof meeting.lng === "number"
            ? { lat: meeting.lat, lng: meeting.lng }
            : null,
        label: meeting.location || null,
        created_at: null,
        updated_at: null,
      })),
    };
  }, [tripData]);

  const previewJoinTripData = useMemo(
    () => ({
      id: "preview-trip",
      title: tripData.title || "Trip Title",
      description: tripData.description || "",
      category: tripData.category || "",
      difficulty: tripData.difficulty || "",
      startDate: tripData.startDate || "",
      endDate: tripData.endDate || "",
      price: tripData.pricePerPerson || 0,
      current_participants: 0,
      max_participants: tripData.maxParticipants || 1,
      min_participants: tripData.minParticipants || 1,
      images: [
        ...(tripData.coverImage ? [tripData.coverImage] : []),
        ...tripData.additionalImages.map((image) => image.data),
      ],
      stops: [
        ...tripData.meetingLocations.map((meeting, index) => ({
          id: `preview-meeting-${index}`,
          trip_id: "preview-trip",
          stop_type: "meeting",
          destination_id: null,
          location:
            typeof meeting.lat === "number" && typeof meeting.lng === "number"
              ? { lat: meeting.lat, lng: meeting.lng }
              : null,
          label: meeting.location || null,
          created_at: null,
          updated_at: null,
        })),
        ...tripData.destinations.map((destinationName, index) => ({
          id: `preview-destination-${index}`,
          trip_id: "preview-trip",
          stop_type: "destination",
          destination_id: null,
          location: null,
          label: destinationName,
          created_at: null,
          updated_at: null,
        })),
      ],
      itinerary: tripData.itinerary.map((item) =>
        item.details?.trim() ? `${item.summary.trim()}\n${item.details.trim()}` : item.summary.trim()
      ),
      activities: allActivities,
      included: tripData.included,
      not_included: tripData.excluded,
      what_to_bring: tripData.whatToBring,
    }),
    [allActivities, tripData]
  );

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
        <h3 className="font-['Lato'] font-bold text-xl text-text-[#00b70d] mb-4">
          Trip Preview
        </h3>
        <p className="text-sm text-[#757575] mb-4">
          This is the same card used in Browse Trips. Click it to open Join Trip.
        </p>

        <TripCard
          trip={previewTripCardData}
          onClick={() =>
            navigate("/trips/preview-trip", {
              state: { previewTrip: previewJoinTripData, fromCreatePreview: true },
            })
          }
          showBookmark={false}
        />

        {duration && (
          <p className="text-xs text-[#64748b] mt-3">
            {duration.days} days, {duration.nights} nights
          </p>
        )}

      </div>
    </div>
  );
}


