import { useState, useEffect, useMemo } from "react";
import { DestinationModal } from "@/components/DestinationModal";
import { Compass } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/lib/supabase";

// Import step components
import { Step1SelectDestinations } from "@/components/CreateTrip/steps/Step1SelectDestinations";
import { Step2TripBasics } from "@/components/CreateTrip/steps/Step2TripBasics";
import { Step3ScheduleMapLibreAlt } from "@/components/CreateTrip/steps/Step3ScheduleMapLibreAlt";
import { Step4Activities } from "@/components/CreateTrip/steps/Step4Activities";
import { Step5Logistics } from "@/components/CreateTrip/steps/Step5Logistics";
import { Step6ParticipantsAndPricing } from "@/components/CreateTrip/steps/Step6ParticipantsAndPricing";
import { Step7Media } from "@/components/CreateTrip/steps/Step7Media";
import { Step8ReviewAndPublish } from "@/components/CreateTrip/steps/Step8ReviewAndPublish";

// Import layout and utility components
import { ProgressIndicator } from "@/components/CreateTrip/ProgressIndicator";
import { FormNavigation } from "@/components/CreateTrip/FormNavigation";
import { TripPreviewPanel } from "@/components/CreateTrip/TripPreviewPanel";

// Import constants and types
import {
  steps,
  itemsPerPage,
  destinationsList,
  categoryIconMap,
  browseDestinationCategories,
  includedOptions,
} from "@/imports/constants";
import type { TripData, Destination, MeetingLocation } from "@/imports/types";

const parseDestinationCoordinates = (destination: any): { lat: number; lng: number } | null => {
  if (Number.isFinite(destination?.lat) && Number.isFinite(destination?.lng)) {
    return { lat: Number(destination.lat), lng: Number(destination.lng) };
  }

  const coordinates = destination?.location?.coordinates;
  if (Array.isArray(coordinates) && coordinates.length >= 2) {
    const lng = Number(coordinates[0]);
    const lat = Number(coordinates[1]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
  }

  if (typeof destination?.location === "string") {
    const hex = destination.location.trim();
    if (/^[0-9a-fA-F]+$/.test(hex) && hex.length >= 42 && hex.length % 2 === 0) {
      try {
        const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
        const view = new DataView(bytes.buffer);
        const littleEndian = view.getUint8(0) === 1;
        const typeWithFlags = view.getUint32(1, littleEndian);
        const geometryType = typeWithFlags & 0xff;
        const hasSrid = (typeWithFlags & 0x20000000) !== 0;
        if (geometryType === 1) {
          let offset = 5 + (hasSrid ? 4 : 0);
          if (bytes.byteLength >= offset + 16) {
            const lng = view.getFloat64(offset, littleEndian);
            const lat = view.getFloat64(offset + 8, littleEndian);
            if (Number.isFinite(lat) && Number.isFinite(lng)) {
              return { lat, lng };
            }
          }
        }
      } catch {
        // Keep fallback parsing resilient for mixed PostGIS output formats.
      }
    }

    const match = destination.location.match(
      /POINT\s*\(\s*([+-]?[0-9]*\.?[0-9]+)\s+([+-]?[0-9]*\.?[0-9]+)\s*\)/i
    );
    if (match) {
      const lng = Number(match[1]);
      const lat = Number(match[2]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { lat, lng };
      }
    }
  }

  return null;
};

export default function CreateTrip() {
  const MAX_MEETING_POINTS = 20;
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  // Step 1: Destination filters
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [selectedPopularity, setSelectedPopularity] = useState<string | null>(null);
  const [hasTripsOnly, setHasTripsOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState(100);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>(destinationsList);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Step 3: Schedule
  const [newMeetingLocation, setNewMeetingLocation] = useState("");
  const [newMeetingTime, setNewMeetingTime] = useState("");
  const [newItinerarySummary, setNewItinerarySummary] = useState("");
  const [newItineraryDetails, setNewItineraryDetails] = useState("");
  const [expandedItinerary, setExpandedItinerary] = useState<Set<number>>(new Set());

  // Step 4: Activities
  const [customActivity, setCustomActivity] = useState("");

  const { favorites, isInitialized } = useFavorites();

  const [tripData, setTripData] = useState<TripData>({
    destinations: [],
    title: "",
    description: "",
    category: "",
    difficulty: "",
    startDate: "",
    endDate: "",
    meetingLocations: [],
    itinerary: [],
    activities: [],
    customActivities: [],
    included: [],
    excluded: [],
    whatToBring: [],
    maxParticipants: 10,
    minParticipants: 4,
    pricePerPerson: 0,
    coverImage: "",
    additionalImages: [],
  });

  // Document upload state (not stored in database)
  const [uploadedDocument, setUploadedDocument] = useState<{ data: string; name: string; type: string } | null>(null);

  // Fetch destinations from API with filters
  useEffect(() => {
    if (currentStep > maxStepReached) {
      setMaxStepReached(currentStep);
    }
  }, [currentStep, maxStepReached]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    // Build filters using query builder format
    const apiFilters: Record<string, any> = {};

    if (selectedCategory !== "all") {
      apiFilters.category = { operator: "eq", value: selectedCategory };
    }

    if (hasTripsOnly) {
      apiFilters.trip_ids = { operator: "eq", value: "has_trips" };
    }

    if (selectedMonth && selectedMonth !== "next-30") {
      const monthNum = selectedMonth.padStart(2, "0");
      const startDay = "01";
      const endDay =
        monthNum === "02" ? "28" : ["04", "06", "09", "11"].includes(monthNum) ? "30" : "31";
      apiFilters.best_periods = { operator: "eq", value: `${monthNum}-${startDay}:${monthNum}-${endDay}` };
    } else if (selectedMonth === "next-30") {
      apiFilters.best_periods = { operator: "eq", value: "03-01:04-30" };
    }

    // Build query params
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    if (Object.keys(apiFilters).length > 0) {
      params.append("filters", JSON.stringify(apiFilters));
    }

    const endpoint = `${API_BASE_URL}/destinations${params.toString() ? "?" + params.toString() : ""}`;

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((response) => {
        const fetchedDestinations = response.data || response || [];

        // Transform database destinations to UI format
        const transformed = fetchedDestinations.map((dbDest: any) => {
          const point = parseDestinationCoordinates(dbDest);

          if (!point) {
            console.warn("Destination is missing valid coordinates:", dbDest?.id, dbDest?.location);
          }

          return {
            id: dbDest.id,
            name: dbDest.name,
            type: dbDest.category,
            region: dbDest.region,
            image:
              dbDest.images?.[0] ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
            rating: 4.5,
            reviews: Math.floor(Math.random() * 200) + 10,
            peopleVisiting: Math.floor(Math.random() * 1000) + 50,
            tripsAvailable: dbDest.trip_ids?.length || 0,
            category: dbDest.category,
            description: dbDest.description || "",
            isFavorite: false,
            lat: point?.lat ?? Number.NaN,
            lng: point?.lng ?? Number.NaN,
            best_periods: dbDest.best_periods || [],
          };
        });

        setDestinations(transformed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch destinations from API:", err);
        setError("Using local data");
        setDestinations(destinationsList);
        setLoading(false);
      });
  }, [searchQuery, selectedCategory, selectedMonth, hasTripsOnly]);

  // Utility functions
  const updateTripData = (field: string, value: any) => {
    setTripData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof TripData, item: string) => {
    const currentArray = tripData[field] as string[];
    if (currentArray.includes(item)) {
      updateTripData(field, currentArray.filter((i) => i !== item));
    } else {
      updateTripData(field, [...currentArray, item]);
    }
  };

  const addMeetingLocationEntry = (entry: MeetingLocation) => {
    const location = entry.location.trim();
    const time = entry.time.trim();
    const isFirstMeetingPoint = tripData.meetingLocations.length === 0;

    if (!location || (isFirstMeetingPoint && !time)) return false;

    if (tripData.meetingLocations.length >= MAX_MEETING_POINTS) {
      alert(`You can only add up to ${MAX_MEETING_POINTS} meeting points.`);
      return false;
    }

    const isDuplicate = tripData.meetingLocations.some((existing) => {
      if (entry.placeId && existing.placeId && entry.placeId === existing.placeId) {
        return true;
      }

      if (
        typeof entry.lat === "number" &&
        typeof entry.lng === "number" &&
        typeof existing.lat === "number" &&
        typeof existing.lng === "number"
      ) {
        const latDiff = Math.abs(existing.lat - entry.lat);
        const lngDiff = Math.abs(existing.lng - entry.lng);
        return latDiff < 0.0001 && lngDiff < 0.0001;
      }

      return existing.location.toLowerCase() === location.toLowerCase() && existing.time === time;
    });

    if (isDuplicate) {
      alert("This meeting point is already in the list.");
      return false;
    }

    updateTripData("meetingLocations", [
      ...tripData.meetingLocations,
      {
        location,
        time,
        lat: entry.lat,
        lng: entry.lng,
        address: entry.address,
        placeId: entry.placeId,
      },
    ]);
    return true;
  };

  const addMeetingLocation = () => {
    const added = addMeetingLocationEntry({ location: newMeetingLocation, time: newMeetingTime });
    if (added) {
      setNewMeetingLocation("");
      setNewMeetingTime("");
    }
  };

  const removeMeetingLocation = (index: number) => {
    updateTripData(
      "meetingLocations",
      tripData.meetingLocations.filter((_, i) => i !== index)
    );
  };

  const reorderMeetingLocations = (reorderedLocations: MeetingLocation[]) => {
    updateTripData("meetingLocations", reorderedLocations);
  };

  const addItinerary = () => {
    if (newItinerarySummary.trim()) {
      updateTripData("itinerary", [
        ...tripData.itinerary,
        { summary: newItinerarySummary.trim(), details: newItineraryDetails.trim() },
      ]);
      setNewItinerarySummary("");
      setNewItineraryDetails("");
    }
  };

  const removeItinerary = (index: number) => {
    updateTripData(
      "itinerary",
      tripData.itinerary.filter((_, i) => i !== index)
    );
  };

  const updateItinerary = (index: number, newSummary: string, newDetails: string) => {
    const updated = [...tripData.itinerary];
    updated[index] = { summary: newSummary.trim(), details: newDetails.trim() };
    updateTripData("itinerary", updated);
  };

  const toggleItineraryExpanded = (index: number) => {
    const newExpanded = new Set(expandedItinerary);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItinerary(newExpanded);
  };

  const addCustomActivity = () => {
    if (customActivity.trim()) {
      updateTripData("customActivities", [...tripData.customActivities, customActivity.trim()]);
      setCustomActivity("");
    }
  };

  const removeCustomActivity = (activity: string) => {
    updateTripData(
      "customActivities",
      tripData.customActivities.filter((a) => a !== activity)
    );
  };

  const handleDateSelect = (date: string, isStart: boolean) => {
    if (isStart) {
      updateTripData("startDate", date);
      if (tripData.endDate && tripData.endDate < date) {
        updateTripData("endDate", "");
      }
    } else {
      if (date === "") {
        updateTripData("endDate", "");
      } else if (tripData.startDate && date >= tripData.startDate) {
        updateTripData("endDate", date);
      }
    }
  };

  const calculateDuration = () => {
    if (!tripData.startDate || !tripData.endDate) return null;

    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const nights = diffDays - 1;

    return { days: diffDays, nights };
  };

  const duration = calculateDuration();

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCoverImageChange = (file: File) => {
    const allowedTypes = ["image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Cover image must be PNG or JPG");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Cover image must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      updateTripData("coverImage", result);
    };
    reader.readAsDataURL(file);
  };

  const handleAdditionalImagesChange = (files: File[]) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
    ];
    const maxSize = 10 * 1024 * 1024;
    const maxFiles = 5;

    if (tripData.additionalImages.length + files.length > maxFiles) {
      alert(
        `Maximum ${maxFiles} images allowed. You already have ${tripData.additionalImages.length} images.`
      );
      return;
    }

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} must be PNG or JPG`);
        return;
      }

      if (file.size > maxSize) {
        alert(`File ${file.name} exceeds 10MB limit`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setTripData((prev) => ({
          ...prev,
          additionalImages: [
            ...prev.additionalImages,
            { data: result, name: file.name, type: file.type },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDocumentChange = (files: File[]) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 10 * 1024 * 1024;

    if (files.length === 0) return;

    const file = files[0];

    if (!allowedTypes.includes(file.type)) {
      alert(`File must be PDF or DOCX`);
      return;
    }

    if (file.size > maxSize) {
      alert(`File exceeds 10MB limit`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedDocument({ data: result, name: file.name, type: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDocument = () => {
    setUploadedDocument(null);
  };

  const buildStopsPayload = () => {
    console.log("buildStopsPayload called");
    console.log("tripData.meetingLocations:", tripData.meetingLocations);
    console.log("selectedDestinationPoints:", selectedDestinationPoints);
    
    const meetingStops = tripData.meetingLocations.map((meeting, index) => {
      console.log(`Processing meeting ${index}:`, {
        location: meeting.location,
        lat: meeting.lat,
        lng: meeting.lng,
        isFiniteLat: Number.isFinite(meeting.lat),
        isFiniteLng: Number.isFinite(meeting.lng),
      });

      if (!Number.isFinite(meeting.lat) || !Number.isFinite(meeting.lng)) {
        throw new Error(`Meeting stop ${index + 1} is missing map coordinates.`);
      }

      const stop = {
        stop_order: index,
        stop_type: "meeting" as const,
        destination_id: null,
        location: {
          type: "Point" as const,
          coordinates: [meeting.lng as number, meeting.lat as number],
        },
        label: meeting.location,
      };
      
      console.log(`Built meeting stop ${index}:`, stop);
      return stop;
    });

    const destinationStops = selectedDestinationPoints
      .filter((destination) => {
        const hasCoords = Number.isFinite(destination.lat) && Number.isFinite(destination.lng);
        if (!hasCoords) {
          console.warn(`Destination ${destination.name} missing valid coordinates:`, {
            id: destination.id,
            name: destination.name,
            lat: destination.lat,
            lng: destination.lng,
            isFiniteLat: Number.isFinite(destination.lat),
            isFiniteLng: Number.isFinite(destination.lng),
          });
        }
        return hasCoords;
      })
      .map((destination, index) => {
        const stop = {
          stop_order: meetingStops.length + index,
          stop_type: "destination" as const,
          destination_id: destination.id,
          location: {
            type: "Point" as const,
            coordinates: [destination.lng, destination.lat],
          },
          label: destination.name,
        };
        console.log(`Built destination stop ${index}:`, stop);
        return stop;
      });

    console.log("Meeting stops:", meetingStops);
    console.log("Destination stops:", destinationStops);
    const all = [...meetingStops, ...destinationStops];
    console.log("All stops combined:", all);
    return all;
  };

  const submitTrip = async (status: "draft" | "published") => {
    try {
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token;

      if (!accessToken) {
        alert("You need to be logged in to create a trip.");
        return;
      }

      let stops;
      try {
        stops = buildStopsPayload();
      } catch (error) {
        console.error("ERROR building stops payload:", error);
        throw error;
      }
      const allActivities = [...tripData.activities, ...tripData.customActivities];
      
      // Validate stops before sending
      console.log("Raw stops array:", stops);
      console.log("Stops array length:", stops.length);
      stops.forEach((stop, idx) => {
        console.log(`Stop [${idx}]:`, {
          stop_order: stop.stop_order,
          stop_type: stop.stop_type,
          destination_id: stop.destination_id,
          location_type: stop.location?.type,
          location_coords: stop.location?.coordinates,
          label: stop.label,
          keys: Object.keys(stop),
        });
      });
      
      // Parse itinerary: separate summary from description using first newline
      const itinerary = tripData.itinerary.map((item) => {
        const cleanedSummary = item.summary.trim().replace(/\\/g, "\\\\"); // Escape backslashes
        const cleanedDetails = item.details?.trim() || "";
        return cleanedDetails ? `${cleanedSummary}\n${cleanedDetails}` : cleanedSummary;
      });

      // Calculate not_included: preselected items NOT in included + custom excluded items
      const premadeNotIncluded = includedOptions.filter((item) => !tripData.included.includes(item));
      const allNotIncluded = [...premadeNotIncluded, ...tripData.excluded];

      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const payload = {
        title: tripData.title.trim().replace(/\\/g, "\\\\"),
        description: tripData.description.trim() ? tripData.description.trim().replace(/\\/g, "\\\\") : null,
        category: tripData.category.toLowerCase(),
        difficulty: tripData.difficulty.toLowerCase(),
        start_date: tripData.startDate,
        end_date: tripData.endDate,
        itinerary,
        what_to_bring: tripData.whatToBring,
        min_participants: tripData.minParticipants,
        max_participants: tripData.maxParticipants,
        price: tripData.pricePerPerson,
        status,
        activities: allActivities,
        included: tripData.included,
        not_included: allNotIncluded,
        returns_to_start: false,
        stops,
      };

      console.log("Trip payload:", payload);
      console.log("Payload stops specifically:", payload.stops);
      console.log("JSON stringified payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(`${API_BASE_URL}/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        console.error("Backend error:", errorData);
        throw new Error(JSON.stringify(errorData));
      }

      const createdTrip = await response.json();
      console.log("Trip saved:", createdTrip);
      alert(status === "published" ? "Trip published successfully!" : "Trip saved as draft successfully!");
    } catch (error) {
      console.error("Failed to submit trip:", error);
      alert(error instanceof Error ? error.message : "Failed to submit trip");
    }
  };

  const validateAndPublish = () => {
    if (tripData.destinations.length === 0) {
      alert("Please select at least one destination");
      setCurrentStep(1);
      return;
    }

    if (!tripData.title || !tripData.description || !tripData.category || !tripData.difficulty) {
      alert("Please fill in all required fields: Title, Description, Category, and Difficulty");
      setCurrentStep(2);
      return;
    }

    if (!tripData.startDate || !tripData.endDate) {
      alert("Please select both start and end dates");
      setCurrentStep(3);
      return;
    }

    const allActivities = [...tripData.activities, ...tripData.customActivities];
    if (allActivities.length === 0) {
      alert("Please select at least one activity");
      setCurrentStep(4);
      return;
    }

    if (tripData.pricePerPerson <= 0) {
      alert("Please set a price per person");
      setCurrentStep(6);
      return;
    }

    if (!tripData.coverImage) {
      alert("Please upload a cover image");
      setCurrentStep(7);
      return;
    }

    void submitTrip("published");
  };

  const saveDraft = () => {
    if (!tripData.title || !tripData.category || !tripData.difficulty || !tripData.startDate || !tripData.endDate) {
      alert("Draft needs: title, category, difficulty, start date and end date.");
      return;
    }

    void submitTrip("draft");
  };

  // Helper functions
  const matchesPopularityLevel = (level: string | null, peopleVisiting: number): boolean => {
    if (!level) return true;

    switch (level) {
      case "quiet":
        return peopleVisiting < 50;
      case "moderate":
        return peopleVisiting >= 50 && peopleVisiting < 200;
      case "popular":
        return peopleVisiting >= 200 && peopleVisiting < 500;
      case "very-popular":
        return peopleVisiting >= 500;
      default:
        return true;
    }
  };

  const getCategoryIcon = (category: string) => {
    return categoryIconMap[category.toLowerCase()] || Compass;
  };

  const centerLat = 36.7538;
  const centerLng = 3.0588;

  const calculateDistance = (lat: number, lng: number) => {
    const R = 6371;
    const dLat = ((lat - centerLat) * Math.PI) / 180;
    const dLng = ((lng - centerLng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((centerLat * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter destinations based on all filters
  let filteredDestinations = destinations.filter((dest) => {
    const matchesRating = dest.rating >= minRating;
    const matchesPopularity = matchesPopularityLevel(selectedPopularity, dest.peopleVisiting);

    let matchesDistance = true;
    if (dest.lat !== 0 && dest.lng !== 0) {
      const distance = calculateDistance(dest.lat, dest.lng);
      matchesDistance = distance <= maxDistance;
    }

    const matchesFavorites = !showFavoritesOnly || favorites[dest.id.toString()];
    const matchesCategory = selectedCategory === "all" || dest.category === selectedCategory;
    const matchesTrips = !hasTripsOnly || dest.tripsAvailable > 0;
    const matchesSearch =
      !searchQuery ||
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.region.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesRating &&
      matchesPopularity &&
      matchesDistance &&
      matchesFavorites &&
      matchesCategory &&
      matchesTrips &&
      matchesSearch
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);
  const paginatedDestinations = filteredDestinations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get all selected activities
  const allActivities = [...tripData.activities, ...tripData.customActivities];
  const selectedDestinationPoints = useMemo(
    () => {
      const byName = new globalThis.Map<string, Destination>();
      [...destinationsList, ...destinations].forEach((destination) => {
        byName.set(destination.name, destination);
      });
      return tripData.destinations
        .map((name) => byName.get(name))
        .filter((destination): destination is Destination => Boolean(destination));
    },
    [destinations, tripData.destinations]
  );

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-['Merriweather'] font-bold text-3xl md:text-4xl lg:text-5xl text-[#0d2805] mb-2">
          Create New Trip
        </h1>
        <p className="text-lg text-[#757575]">
          Follow the steps below to create an amazing trip experience
        </p>
      </div>

      {/* Progress Indicator */}
      <ProgressIndicator currentStep={currentStep} maxStepReached={maxStepReached} onStepClick={setCurrentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 min-h-[600px]">
            {/* Step 1: Select Destinations */}
            {currentStep === 1 && (
              <Step1SelectDestinations
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                minRating={minRating}
                setMinRating={setMinRating}
                selectedPopularity={selectedPopularity}
                setSelectedPopularity={setSelectedPopularity}
                hasTripsOnly={hasTripsOnly}
                setHasTripsOnly={setHasTripsOnly}
                maxDistance={maxDistance}
                setMaxDistance={setMaxDistance}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                showFavoritesOnly={showFavoritesOnly}
                setShowFavoritesOnly={setShowFavoritesOnly}
                loading={loading}
                error={error}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                tripData={tripData}
                toggleArrayItem={toggleArrayItem as (field: string, item: string) => void}
                setSelectedDestination={setSelectedDestination}
                paginatedDestinations={paginatedDestinations}
                totalPages={totalPages}
                isInitialized={isInitialized}
                browseDestinationCategories={browseDestinationCategories}
                getCategoryIcon={getCategoryIcon}
              />
            )}

            {/* Step 2: Trip Basics */}
            {currentStep === 2 && (
              <Step2TripBasics
                tripData={tripData}
                updateTripData={updateTripData}
              />
            )}

            {/* Step 3: Schedule */}
            {currentStep === 3 && (
              <Step3ScheduleMapLibreAlt
                tripData={tripData}
                selectedDestinations={selectedDestinationPoints}
                newMeetingLocation={newMeetingLocation}
                onMeetingLocationChange={setNewMeetingLocation}
                newMeetingTime={newMeetingTime}
                onMeetingTimeChange={setNewMeetingTime}
                newItinerarySummary={newItinerarySummary}
                onItinerarySummaryChange={setNewItinerarySummary}
                newItineraryDetails={newItineraryDetails}
                onItineraryDetailsChange={setNewItineraryDetails}
                expandedItinerary={expandedItinerary}
                onToggleItineraryExpanded={toggleItineraryExpanded}
                onDateSelect={handleDateSelect}
                duration={duration}
                onAddMeetingLocation={addMeetingLocation}
                onAddMeetingLocationEntry={addMeetingLocationEntry}
                onRemoveMeetingLocation={removeMeetingLocation}
                onReorderMeetingLocations={reorderMeetingLocations}
                onAddItinerary={addItinerary}
                onRemoveItinerary={removeItinerary}
                onUpdateItinerary={updateItinerary}
                maxMeetingPoints={MAX_MEETING_POINTS}
              />
            )}

            {/* Step 4: Activities */}
            {currentStep === 4 && (
              <Step4Activities
                tripData={tripData}
                onToggleActivity={(activity) => toggleArrayItem("activities", activity)}
                customActivity={customActivity}
                onCustomActivityChange={setCustomActivity}
                onAddCustomActivity={addCustomActivity}
                onRemoveCustomActivity={removeCustomActivity}
              />
            )}

            {/* Step 5: Logistics */}
            {currentStep === 5 && (
              <Step5Logistics
                tripData={tripData}
                onToggleIncluded={(item) => toggleArrayItem("included", item)}
                onAddWhatToBring={(item) => updateTripData("whatToBring", [...tripData.whatToBring, item])}
                onRemoveWhatToBring={(item) => updateTripData("whatToBring", tripData.whatToBring.filter((i) => i !== item))}
                onAddCustomIncluded={(item) => updateTripData("included", [...tripData.included, item])}
                onRemoveCustomIncluded={(item) => updateTripData("included", tripData.included.filter((i) => i !== item))}
                onAddExcluded={(item) => updateTripData("excluded", [...tripData.excluded, item])}
                onRemoveExcluded={(item) => updateTripData("excluded", tripData.excluded.filter((i) => i !== item))}
              />
            )}

            {/* Step 6: Participants and Pricing */}
            {currentStep === 6 && (
              <Step6ParticipantsAndPricing
                tripData={tripData}
                onMinParticipantsChange={(val) => updateTripData("minParticipants", val)}
                onMaxParticipantsChange={(val) => updateTripData("maxParticipants", val)}
                onPriceChange={(val) => updateTripData("pricePerPerson", val)}
              />
            )}

            {/* Step 7: Media */}
            {currentStep === 7 && (
              <Step7Media
                tripData={tripData}
                onCoverImageChange={handleCoverImageChange}
                onRemoveCoverImage={() => updateTripData("coverImage", "")}
                onAdditionalImagesChange={handleAdditionalImagesChange}
                onRemoveAdditionalImage={(index) => {
                  const updated = tripData.additionalImages.filter((_, i) => i !== index);
                  updateTripData("additionalImages", updated);
                }}
                uploadedDocument={uploadedDocument}
                onDocumentChange={handleDocumentChange}
                onRemoveDocument={handleRemoveDocument}
              />
            )}

            {/* Step 8: Review and Publish */}
            {currentStep === 8 && (
              <Step8ReviewAndPublish
                tripData={tripData}
                duration={duration}
                allActivities={allActivities}
                onPublish={validateAndPublish}
                onSaveDraft={saveDraft}
                onEditStep={setCurrentStep}
              />
            )}

            {/* Navigation Buttons */}
            <FormNavigation
              currentStep={currentStep}
              totalSteps={steps.length}
              onPrevious={prevStep}
              onNext={nextStep}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <TripPreviewPanel
          tripData={tripData}
          duration={duration}
          allActivities={allActivities}
        />
      </div>

      {/* Destination Modal */}
      {selectedDestination && (
        <DestinationModal
          destination={selectedDestination}
          isSaved={tripData.destinations.includes(selectedDestination.name)}
          onToggleSave={() => toggleArrayItem("destinations", selectedDestination.name)}
          onClose={() => setSelectedDestination(null)}
        />
      )}
    </>
  );
}


