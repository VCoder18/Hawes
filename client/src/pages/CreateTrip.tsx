import { useState, useEffect, useMemo } from "react";
import { DestinationModal } from "@/components/DestinationModal";
import { Compass } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/useToast";
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
import {
  buildStopsPayload,
  calculateDistanceKm,
  dataUrlToFile,
  matchesPopularityLevel,
  sortIncludedByOptions,
} from "@/lib/create-trip-utils";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const MOCK_COVER_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wn9S9kAAAAASUVORK5CYII=";

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
  const [allFetchedDestinations, setAllFetchedDestinations] = useState<Destination[]>(destinationsList);
  const [totalDestinationResults, setTotalDestinationResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [submitAction, setSubmitAction] = useState<"draft" | "published" | null>(null);
  const [showFreeTripConfirmation, setShowFreeTripConfirmation] = useState(false);
  const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(true);
  const [freeTripConfirmCountdown, setFreeTripConfirmCountdown] = useState(5);

  // Step 3: Schedule
  const [newMeetingLocation, setNewMeetingLocation] = useState("");
  const [newMeetingTime, setNewMeetingTime] = useState("");
  const [newItinerarySummary, setNewItinerarySummary] = useState("");
  const [newItineraryDetails, setNewItineraryDetails] = useState("");
  const [expandedItinerary, setExpandedItinerary] = useState<Set<number>>(new Set());

  // Step 4: Activities
  const [customActivity, setCustomActivity] = useState("");

  const { favorites, isInitialized } = useFavorites();
  const { toast } = useToast();

  const showErrorToast = (message: string) => {
    toast({
      title: "Action failed",
      description: message,
      variant: "destructive",
    });
  };

  const showSuccessToast = (message: string) => {
    toast({
      title: "Success",
      description: message,
      variant: "success",
    });
  };

  const [tripData, setTripData] = useState<TripData>({
    destinations: [],
    title: "",
    description: "",
    scope: "public",
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

  // Optional document upload state
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
    try {
      const offset = (currentPage - 1) * itemsPerPage;

      let localDestinations = [...destinationsList];

      if (searchQuery.trim()) {
        const search = searchQuery.trim().toLowerCase();
        localDestinations = localDestinations.filter((destination) =>
          [destination.name, destination.region, destination.category, destination.description]
            .join(" ")
            .toLowerCase()
            .includes(search)
        );
      }

      if (selectedCategory !== "all") {
        localDestinations = localDestinations.filter(
          (destination) => destination.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      if (hasTripsOnly) {
        localDestinations = localDestinations.filter((destination) => (destination.tripsAvailable || 0) > 0);
      }

      if (selectedMonth && selectedMonth !== "next-30") {
        localDestinations = localDestinations.filter((destination) =>
          (destination.best_periods || []).some((period) => period.startsWith(`${selectedMonth}-`))
        );
      }

      const total = localDestinations.length;
      const paged = localDestinations.slice(offset, offset + itemsPerPage);

      setDestinations(paged);
      setAllFetchedDestinations((prev) => {
        const destinationMap = new Map(prev.map((destination) => [destination.id, destination]));
        paged.forEach((destination) => destinationMap.set(destination.id, destination));
        return Array.from(destinationMap.values());
      });
      setTotalDestinationResults(total);
    } catch (err) {
      console.error("Failed to load mock destinations:", err);
      setError("Using local data");
      const fallback = destinationsList.slice(0, itemsPerPage);
      setDestinations(fallback);
      setTotalDestinationResults(destinationsList.length);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    hasTripsOnly,
    maxDistance,
    minRating,
    searchQuery,
    selectedCategory,
    selectedMonth,
    selectedPopularity,
    showFavoritesOnly,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedMonth, hasTripsOnly]);

  useEffect(() => {
    if (!showFreeTripConfirmation) return;
    setFreeTripConfirmCountdown(5);
    setConfirmButtonDisabled(true);
    const timer = setInterval(() => {
      setFreeTripConfirmCountdown((prev) => {
        if (prev <= 1) {
          setConfirmButtonDisabled(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showFreeTripConfirmation]);

  // Utility functions
  const updateTripData = (field: string, value: any) => {
    setTripData((prev) => ({ ...prev, [field]: value }));
  };

  const sortIncludedItems = (items: string[]) => sortIncludedByOptions(items, includedOptions);

  const toggleArrayItem = (field: keyof TripData, item: string) => {
    const currentArray = tripData[field] as string[];
    const nextArray = currentArray.includes(item)
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];

    if (currentArray.includes(item)) {
      updateTripData(field, field === "included" ? sortIncludedItems(nextArray) : nextArray);
    } else {
      updateTripData(field, field === "included" ? sortIncludedItems(nextArray) : nextArray);
    }
  };

  const addMeetingLocationEntry = (entry: MeetingLocation) => {
    const location = entry.location.trim();
    const time = entry.time.trim();
    const isFirstMeetingPoint = tripData.meetingLocations.length === 0;

    if (!location || (isFirstMeetingPoint && !time)) return false;

    if (tripData.meetingLocations.length >= MAX_MEETING_POINTS) {
      showErrorToast(`You can only add up to ${MAX_MEETING_POINTS} meeting points.`);
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
      showErrorToast("This meeting point is already in the list.");
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
      showErrorToast("Cover image must be PNG or JPG");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showErrorToast("Cover image must be less than 10MB");
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
    const maxFiles = 6;

    if (tripData.additionalImages.length + files.length > maxFiles) {
      showErrorToast(
        `Maximum ${maxFiles} images allowed. You already have ${tripData.additionalImages.length} images.`
      );
      return;
    }

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        showErrorToast(`File ${file.name} must be PNG or JPG`);
        return;
      }

      if (file.size > maxSize) {
        showErrorToast(`File ${file.name} exceeds 10MB limit`);
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
      showErrorToast(`File must be PDF or DOCX`);
      return;
    }

    if (file.size > maxSize) {
      showErrorToast(`File exceeds 10MB limit`);
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

  const buildStops = () => buildStopsPayload(tripData.meetingLocations, selectedDestinationPoints);

  const generateMockupTrip = () => {
    const firstDestination = destinationsList[0];
    const secondDestination = destinationsList[1];
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 3);

    const formatDate = (d: Date) => d.toISOString().slice(0, 10);

    setTripData((prev) => ({
      ...prev,
      destinations: [firstDestination.name, secondDestination.name],
      title: "Quick Mockup Trip",
      description:
        "Auto-generated mock trip for quick API submission validation. Includes schedule, activities, logistics, pricing, and media.",
      scope: "public",
      category: "Adventure",
      difficulty: "Easy",
      startDate: formatDate(start),
      endDate: formatDate(end),
      meetingLocations: [
        {
          location: "Algiers Main Meetup",
          time: "08:30",
          lat: 36.7538,
          lng: 3.0588,
          address: "Algiers, Algeria",
        },
      ],
      itinerary: [
        {
          summary: "Day 1 - Meetup and Departure",
          details: "Gather participants, briefing, and move toward the first destination.",
        },
        {
          summary: "Day 2 - Exploration",
          details: "Guided activities and destination highlights.",
        },
      ],
      activities: ["Hiking", "Photography"],
      customActivities: ["Campfire Storytelling"],
      included: sortIncludedItems(["Accommodation", "Transport", "Guide"]),
      excluded: ["Personal expenses"],
      whatToBring: ["Water bottle", "Hiking shoes", "Sun protection"],
      maxParticipants: 12,
      minParticipants: 4,
      pricePerPerson: 3500,
      coverImage: MOCK_COVER_DATA_URL,
      additionalImages: [],
    }));

    setUploadedDocument(null);
    setCurrentStep(8);
    showSuccessToast("Mockup trip generated. You can submit immediately.");
  };

  const submitTrip = async (status: "draft" | "published") => {
    if (submitAction) return;
    setSubmitAction(status);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("You must be signed in before creating a trip.");
      }

      const stops = buildStops();
      const allActivities = [...tripData.activities, ...tripData.customActivities];

      const itinerary = tripData.itinerary
        .map((item) =>
          item.details?.trim()
            ? `${item.summary.trim()}\n${item.details.trim()}`
            : item.summary.trim()
        )
        .filter(Boolean);

      const payload = {
        title: tripData.title.trim(),
        description: tripData.description.trim() || undefined,
        category: tripData.category.toLowerCase(),
        difficulty: tripData.difficulty.toLowerCase(),
        start_date: tripData.startDate,
        end_date: tripData.endDate,
        status,
        activities: allActivities,
        itinerary,
        included: sortIncludedItems(tripData.included),
        not_included: tripData.excluded,
        what_to_bring: tripData.whatToBring,
        min_participants: tripData.minParticipants,
        max_participants: tripData.maxParticipants,
        price: Number(tripData.pricePerPerson) || 0,
        returns_to_start: false,
        stops,
      };

      const hasMedia = Boolean(tripData.coverImage || tripData.additionalImages.length || uploadedDocument);
      let response: Response;

      if (hasMedia) {
        const formData = new FormData();

        formData.append("title", payload.title);
        if (payload.description) formData.append("description", payload.description);
        formData.append("category", payload.category);
        formData.append("difficulty", payload.difficulty);
        formData.append("start_date", payload.start_date);
        formData.append("end_date", payload.end_date);
        formData.append("status", payload.status);
        formData.append("min_participants", String(payload.min_participants));
        formData.append("max_participants", String(payload.max_participants));
        formData.append("price", String(payload.price));
        formData.append("returns_to_start", "false");

        payload.activities.forEach((value, index) => formData.append(`activities[${index}]`, value));
        payload.itinerary.forEach((value, index) => formData.append(`itinerary[${index}]`, value));
        payload.included.forEach((value, index) => formData.append(`included[${index}]`, value));
        payload.not_included.forEach((value, index) => formData.append(`not_included[${index}]`, value));
        payload.what_to_bring.forEach((value, index) => formData.append(`what_to_bring[${index}]`, value));

        payload.stops.forEach((stop, index) => {
          formData.append(`stops[${index}][type]`, stop.type);
          formData.append(`stops[${index}][location][type]`, "Point");
          formData.append(`stops[${index}][location][coordinates][0]`, String(stop.location.coordinates[0]));
          formData.append(`stops[${index}][location][coordinates][1]`, String(stop.location.coordinates[1]));

          if (stop.label) {
            formData.append(`stops[${index}][label]`, stop.label);
          }

          if (stop.destination) {
            formData.append(`stops[${index}][destination]`, stop.destination);
          }
        });

        if (tripData.coverImage) {
          const coverFile = await dataUrlToFile({
            data: tripData.coverImage,
            name: "cover-image.png",
            type: "image/png",
          });
          formData.append("images", coverFile);
        }

        for (const imageDraft of tripData.additionalImages) {
          const file = await dataUrlToFile(imageDraft);
          formData.append("images", file);
        }

        if (uploadedDocument) {
          const attachmentFile = await dataUrlToFile(uploadedDocument);
          formData.append("attachment", attachmentFile);
        }

        response = await fetch(`${API_BASE_URL}/trips`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/trips`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to create trip (${response.status})`);
      }

      showSuccessToast(status === "published" ? "Trip published successfully!" : "Draft saved successfully!");
    } catch (error) {
      console.error("Failed to submit trip:", error);
      showErrorToast(error instanceof Error ? error.message : "Failed to submit trip");
    } finally {
      setSubmitAction(null);
    }
  };

  const validateAndPublish = () => {
    if (submitAction) return;

    if (tripData.destinations.length === 0) {
      showErrorToast("Please select at least one destination");
      setCurrentStep(1);
      return;
    }

    if (!tripData.title || !tripData.description || !tripData.category || !tripData.difficulty) {
      showErrorToast("Please fill in all required fields: Title, Description, Category, and Difficulty");
      setCurrentStep(2);
      return;
    }

    if (!tripData.startDate || !tripData.endDate) {
      showErrorToast("Please select both start and end dates");
      setCurrentStep(3);
      return;
    }

    const allActivities = [...tripData.activities, ...tripData.customActivities];
    if (allActivities.length === 0) {
      showErrorToast("Please select at least one activity");
      setCurrentStep(4);
      return;
    }

    if (tripData.pricePerPerson < 0) {
      showErrorToast("Please set a valid price per person");
      setCurrentStep(6);
      return;
    }

    if (!tripData.coverImage) {
      showErrorToast("Please upload a cover image");
      setCurrentStep(7);
      return;
    }

    if (tripData.pricePerPerson === 0) {
      setConfirmButtonDisabled(true);
      setShowFreeTripConfirmation(true);
      return;
    }

    void submitTrip("published");
  };

  const saveDraft = () => {
    if (submitAction) return;

    if (!tripData.title || !tripData.category || !tripData.difficulty || !tripData.startDate || !tripData.endDate) {
      showErrorToast("Draft needs: title, category, difficulty, start date and end date.");
      return;
    }

    void submitTrip("draft");
  };

  // Helper functions
  const getCategoryIcon = (category: string) => {
    return categoryIconMap[category.toLowerCase()] || Compass;
  };

  const centerLat = 36.7538;
  const centerLng = 3.0588;

  // Filter destinations based on all filters
  let filteredDestinations = destinations.filter((dest) => {
    const matchesRating = dest.rating >= minRating;
    const matchesPopularity = matchesPopularityLevel(selectedPopularity, dest.peopleVisiting);

    let matchesDistance = true;
    if (maxDistance < 100 && Number.isFinite(dest.lat) && Number.isFinite(dest.lng)) {
      const distance = calculateDistanceKm(dest.lat, dest.lng, centerLat, centerLng);
      matchesDistance = distance <= maxDistance;
    }

    const matchesFavorites = !showFavoritesOnly || favorites[dest.id.toString()];

    return (
      matchesRating &&
      matchesPopularity &&
      matchesDistance &&
        matchesFavorites
    );
  });

  // Pagination
    const totalPages = Math.max(1, Math.ceil(totalDestinationResults / itemsPerPage));
    const paginatedDestinations = filteredDestinations;

  useEffect(() => {
    const safeTotalPages = Math.max(1, totalPages);
    if (currentPage > safeTotalPages) {
      setCurrentPage(safeTotalPages);
    }
  }, [currentPage, totalPages]);

  // Get all selected activities
  const allActivities = [...tripData.activities, ...tripData.customActivities];
  const selectedDestinationPoints = useMemo(
    () => {
      const byName = new globalThis.Map<string, Destination>();
      // Use allFetchedDestinations instead of the filtered destinations to ensure previously selected destinations are found
      [...destinationsList, ...allFetchedDestinations].forEach((destination) => {
        byName.set(destination.name, destination);
      });
      return tripData.destinations
        .map((name) => byName.get(name))
        .filter((destination): destination is Destination => Boolean(destination));
    },
    [allFetchedDestinations, tripData.destinations]
  );

  return (
    <>
      <button
        type="button"
        onClick={generateMockupTrip}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-[#0d2805] px-5 py-3 text-sm font-semibold text-white shadow-xl hover:bg-[#165f0f] focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
      >
        Generate Mockup
      </button>

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
                onAddCustomIncluded={(item) =>
                  updateTripData("included", sortIncludedItems([...tripData.included, item]))
                }
                onRemoveCustomIncluded={(item) =>
                  updateTripData(
                    "included",
                    sortIncludedItems(tripData.included.filter((i) => i !== item)),
                  )
                }
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
                isSubmitting={submitAction !== null}
                submitAction={submitAction}
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

      {/* Free Trip Confirmation Modal */}
      {showFreeTripConfirmation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Are you sure the Trip is FREE?</h2>
            <p className="text-gray-600">
              This trip is set to a price of 0 DZD. Participants won't have to pay anything to join.
            </p>
            <div className="pt-4 flex gap-3">
              <button
                onClick={() => setShowFreeTripConfirmation(false)}
                className="flex-1 px-4 py-3 rounded-xl font-semibold border-2 border-gray-300 hover:border-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowFreeTripConfirmation(false);
                  void submitTrip("published");
                }}
                disabled={confirmButtonDisabled}
                className="flex-1 px-4 py-3 rounded-xl font-semibold bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {confirmButtonDisabled
                  ? `Confirm & Publish (${freeTripConfirmCountdown}s)`
                  : "Confirm & Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


