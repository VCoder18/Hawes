import { X, Check } from "lucide-react";
import type { TripData } from "@/imports/types";
import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface JoinTripModalProps {
  trip: (TripData & { id: string }) | null;
  onClose: () => void;
}

export function JoinTripModal({ trip, onClose }: JoinTripModalProps) {
  const [fullTrip, setFullTrip] = useState<any>(null);

  useEffect(() => {
    if (trip?.id) {
      fetch(`${API_BASE_URL}/trips/${trip.id}`)
        .then(res => res.json())
        .then(data => setFullTrip(data))
        .catch(console.error);
    }
  }, [trip?.id]);

  if (!trip) return null;

  const serviceStops = (fullTrip?.stops || []).filter((stop: any) => {
    const t = String(stop?.type || stop?.stop_type || "").toLowerCase();
    return t === "service";
  });
  const attachedServices = serviceStops.map((stop: any) => stop.service_data || stop.serviceData || stop).filter(Boolean);

  const durationDays = trip.startDate && trip.endDate
    ? Math.ceil(
        (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] w-full sm:max-w-2xl overflow-y-auto shadow-2xl">
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 sm:p-6 flex justify-between items-center rounded-t-3xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {trip.title || "Trip Details"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="size-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Trip Cover Image */}
          {trip.coverImage && (
            <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-200">
              <img
                src={trip.coverImage}
                alt={trip.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}

          {/* Trip Overview */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Trip Overview</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {trip.description || "No description available"}
            </p>
          </section>

          {/* Trip Details Grid */}
          <section className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 font-medium mb-1">Difficulty</p>
              <p className="font-bold text-blue-600">{trip.difficulty || "N/A"}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 font-medium mb-1">Category</p>
              <p className="font-bold text-green-600">{trip.category || "N/A"}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 font-medium mb-1">Duration</p>
              <p className="font-bold text-purple-600">{durationDays} days</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 font-medium mb-1">Price/Person</p>
              <p className="font-bold text-orange-600">${trip.pricePerPerson || 0}</p>
            </div>
          </section>

          {/* Destinations */}
          {trip.destinations && trip.destinations.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Destinations</h3>
              <div className="flex flex-wrap gap-2">
                {trip.destinations.map((dest, idx) => (
                  <div
                    key={idx}
                    className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {dest}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Activities */}
          {trip.activities && trip.activities.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Activities</h3>
              <ul className="space-y-2">
                {trip.activities.map((activity, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{activity}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* What's Included */}
          {((trip.included && trip.included.length > 0) || attachedServices.length > 0) && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">What's Included</h3>
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                {attachedServices.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {attachedServices.map((svc: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-[#E8F5E9] text-[#4CAF50] border border-[#B8EBB8] rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3 h-3 shrink-0" />
                        <span>{svc.category ? svc.category.charAt(0).toUpperCase() + svc.category.slice(1) + ': ' : ''}{svc.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                {trip.included && trip.included.length > 0 && (
                  <ul className="space-y-3">
                    {trip.included.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          )}

          {/* What's Excluded */}
          {trip.excluded && trip.excluded.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">What's Excluded</h3>
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                <ul className="space-y-2">
                  {trip.excluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-red-500 font-bold text-lg">×</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* What to Bring */}
          {trip.whatToBring && trip.whatToBring.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">What to Bring</h3>
              <div className="grid grid-cols-2 gap-3">
                {trip.whatToBring.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Participants Info */}
          <section className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4">
            <p className="text-sm font-bold text-gray-900 mb-1">Limited Availability</p>
            <p className="text-xs text-gray-600">
              {trip.minParticipants || 0} - {trip.maxParticipants || 0} participants
            </p>
          </section>

          {/* Join Button */}
          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-colors">
            Join This Trip →
          </button>
        </div>
      </div>
    </div>
  );
}
