import { useState, useRef } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { CalendarPicker } from "@/components/CreateTrip/CalendarPicker";
import { ReviewSection } from "@/components/ReviewSection";
import FiltersModal from "@/components/FiltersModal";
import { DestinationModal } from "@/components/DestinationModal";
import { 
  Search, Plus, X, Upload, SlidersHorizontal, Calendar,
  Hotel, Car, Utensils, Users, Backpack, Check, DollarSign, Save, FileText,
} from "lucide-react";
import publ from "@/assets/images/society.png";
import priv from "@/assets/images/insurance.png";

// Import sub-components
import { StepHeader } from "@/components/CreateTrip/StepHeader";
import { ProgressIndicator } from "@/components/CreateTrip/ProgressIndicator";
import { DestinationCard } from "@/components/CreateTrip/DestinationCard";
import { SelectedTag } from "@/components/CreateTrip/SelectedTag";
import { PaginationControls } from "@/components/CreateTrip/PaginationControls";
import { ParticipantControl } from "@/components/CreateTrip/ParticipantControl";
import { MeetingLocationItem } from "@/components/CreateTrip/MeetingLocationItem";
import { PricingSummary } from "@/components/CreateTrip/PricingSummary";
import { FormNavigation } from "@/components/CreateTrip/FormNavigation";
import { TripPreviewPanel } from "@/components/CreateTrip/TripPreviewPanel";

// Import constants and types
import {
  STEPS,
  tripCategories,
  difficulties,
  activityOptions,
  includedOptions,
  ITEMS_PER_PAGE,
  destinationCategories,
  destinationsList,
} from "@/imports/constants";
import type { TripData, Filters, Destination } from "@/imports/types";

export default function CreateTrip() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [customActivity, setCustomActivity] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newMeetingLocation, setNewMeetingLocation] = useState("");
  const [newMeetingTime, setNewMeetingTime] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

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
    itinerary: "",
    activities: [],
    customActivities: [],
    included: [],
    whatToBring: "",
    maxParticipants: 10,
    minParticipants: 4,
    pricePerPerson: 0,
    coverImage: "",
    additionalImages: [],
  });

  const [filters, setFilters] = useState<Filters>({
    type: [],
    services: [],
    events: "all",
    distance: "all",
    rating: 0,
  });

  // File input refs
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);

  const updateTripData = (field: string, value: any) => {
    setTripData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof TripData, item: string) => {
    const currentArray = tripData[field] as string[];
    if (currentArray.includes(item)) {
      updateTripData(field, currentArray.filter(i => i !== item));
    } else {
      updateTripData(field, [...currentArray, item]);
    }
  };

  const addCustomActivity = () => {
    if (customActivity.trim()) {
      updateTripData("customActivities", [...tripData.customActivities, customActivity.trim()]);
      setCustomActivity("");
    }
  };

  const removeCustomActivity = (activity: string) => {
    updateTripData("customActivities", tripData.customActivities.filter(a => a !== activity));
  };

  const addMeetingLocation = () => {
    if (newMeetingLocation.trim() && newMeetingTime.trim()) {
      updateTripData("meetingLocations", [
        ...tripData.meetingLocations,
        { location: newMeetingLocation.trim(), time: newMeetingTime.trim() }
      ]);
      setNewMeetingLocation("");
      setNewMeetingTime("");
    }
  };

  const removeMeetingLocation = (index: number) => {
    updateTripData("meetingLocations", tripData.meetingLocations.filter((_, i) => i !== index));
  };

  const handleDateSelect = (date: string, isStart: boolean) => {
    if (isStart) {
      updateTripData("startDate", date);
      // Clear end date if starting a new selection or if it's before the new start date
      if (tripData.endDate && tripData.endDate < date) {
        updateTripData("endDate", "");
      }
    } else {
      // If date is empty, clear the end date
      if (date === "") {
        updateTripData("endDate", "");
      } else if (tripData.startDate && date >= tripData.startDate) {
        // Only set end date if it's after start date
        updateTripData("endDate", date);
      }
    }
  };

  const calculateDuration = () => {
    if (!tripData.startDate || !tripData.endDate) return null;
    
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    const nights = diffDays - 1;
    
    return { days: diffDays, nights };
  };

  const duration = calculateDuration();

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Filter destinations
  let filteredDestinations = destinationsList.filter(dest => {
    // Search filter
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.region.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    let matchesCategory = false;
    if (selectedCategory === "all") {
      matchesCategory = true;
    } else if (selectedCategory === "favorites") {
      matchesCategory = dest.isFavorite;
    } else {
      matchesCategory = dest.category === selectedCategory;
    }
    
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDestinations.length / ITEMS_PER_PAGE);
  const paginatedDestinations = filteredDestinations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get all selected activities
  const allActivities = [...tripData.activities, ...tripData.customActivities];

  // Handle cover image upload
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (images only)
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Cover image must be PNG or JPG');
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Cover image must be less than 10MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      updateTripData('coverImage', result);
    };
    reader.readAsDataURL(file);
  };

  // Handle additional media upload
  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024;
    const maxFiles = 6;

    // Check total file count
    if (tripData.additionalImages.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed. You already have ${tripData.additionalImages.length} files.`);
      return;
    }

    files.forEach((file) => {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} must be PNG, JPG, PDF, or DOCX`);
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        alert(`File ${file.name} exceeds 10MB limit`);
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setTripData(prev => ({
          ...prev,
          additionalImages: [...prev.additionalImages, { data: result, name: file.name, type: file.type }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Validation function
  const validateAndPublish = () => {
    // Step 1: Destinations
    if (tripData.destinations.length === 0) {
      alert("Please select at least one destination");
      setCurrentStep(1);
      return;
    }

    // Step 2: Trip Basics
    if (!tripData.title || !tripData.description || !tripData.category || !tripData.difficulty) {
      alert("Please fill in all required fields: Title, Description, Category, and Difficulty");
      setCurrentStep(2);
      return;
    }

    // Step 3: Schedule
    if (!tripData.startDate || !tripData.endDate) {
      alert("Please select both start and end dates");
      setCurrentStep(3);
      return;
    }

    // Step 4: Activities
    if (allActivities.length === 0) {
      alert("Please select at least one activity");
      setCurrentStep(4);
      return;
    }

    // Step 6: Participants & Pricing
    if (tripData.pricePerPerson <= 0) {
      alert("Please set a price per person");
      setCurrentStep(6);
      return;
    }

    // Step 7: Media
    if (!tripData.coverImage) {
      alert("Please upload a cover image");
      setCurrentStep(7);
      return;
    }

    // All validations passed
    alert("Trip published successfully!");
    console.log("Publishing trip:", tripData);
  };

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
        <ProgressIndicator currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 min-h-[600px]">
              {/* Step 1: Destination */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <StepHeader
                    title="Select Destinations"
                    description="Choose one or more destinations for your trip"
                  />

                  {/* Search and Filters */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text-[#ff5900]" />
                      <input
                        type="text"
                        placeholder="Search destinations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
                      />
                    </div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                        showFilters
                          ? "border-[#00b70d] bg-[#00b70d]/10 text-[#00b70d]"
                          : "border-[#e2e8f0] text-text-[#ff5900] hover:border-[#00b70d]/50"
                      }`}
                    >
                      <SlidersHorizontal className="size-5" />
                      <span className="hidden sm:inline">Filters</span>
                    </button>
                  </div>

                  {/* Filters */}
                  {showFilters && (
        <FiltersModal
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

                  {/* Category Filters */}
                  <div className="flex flex-wrap gap-2">
                    {destinationCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-1 ${
                          selectedCategory === category.id
                            ? "bg-[#00b70d] text-white"
                            : "bg-bg-[#ff5900] text-text-[#00b70d] hover:bg-[#e2e8f0]"
                        }`}
                      >
                        <category.icon className="size-4" />
                        {category.label}
                      </button>
                    ))}
                  </div>

                  {/* Selected Destinations */}
                  {tripData.destinations.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-text-[#00b70d]">Selected Destinations</h3>
                      <div className="flex flex-wrap gap-2">
                        {tripData.destinations.map((dest) => (
                          <SelectedTag
                            key={dest}
                            label={dest}
                            onRemove={() => toggleArrayItem("destinations", dest)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Destination List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {paginatedDestinations.map((dest) => (
                      <DestinationCard
                        key={dest.id}
                        destination={dest}
                        isSelected={tripData.destinations.includes(dest.name)}
                        onSelect={() => toggleArrayItem("destinations", dest.name)}
                        onDetails={() => setSelectedDestination(dest)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}

              {/* Step 2: Trip Basics */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <StepHeader
                    title="Trip Basics"
                    description="Provide essential information about your trip"
                  />

                  <div>
                    <label className="block font-semibold text-text-[#00b70d] mb-2">
                      Trip Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Sahara Desert Adventure"
                      value={tripData.title}
                      onChange={(e) => updateTripData("title", e.target.value)}
                      className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#00b70d] mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Describe your trip experience..."
                      value={tripData.description}
                      onChange={(e) => updateTripData("description", e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b70d] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#00b70d] mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {tripCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => updateTripData("category", cat)}
                          className={`px-4 py-3 rounded-xl font-medium transition-all ${
                            tripData.category === cat
                              ? "bg-[#00b70d] text-white"
                              : "bg-bg-[#ff5900] text-black hover:bg-[#e2e8f0]"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#00b70d] mb-2">
                      Difficulty Level <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {difficulties.map((diff) => (
                        <button
                          key={diff}
                          onClick={() => updateTripData("difficulty", diff)}
                          className={`px-4 py-3 rounded-xl font-medium transition-all ${
                            tripData.difficulty === diff
                              ? "bg-[#00b70d] text-white"
                              : "bg-bg-[#ff5900] text-black hover:bg-[#e2e8f0]"
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8">
                   <label className="block font-semibold text-[#00b70d] mb-3">
                   Trip Privacy <span className="text-red-500">*</span>
                   </label>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button
                       type="button"
                       onClick={() => updateTripData("scope", "public")}
                       className={`px-4 py-4 rounded-xl font-medium transition-all text-left border-2 flex flex-col gap-1 ${
                       tripData.scope === "public"
                       ? "border-[#00b70d] bg-[#00b70d]/5 text-[#00b70d]"
                       : "border-[#e2e8f0] text-gray-500 hover:border-[#00b70d]/30"
                       }
                       `}
                       >
                       <div className="flex items-center gap-2">
                         <span className="text-xl"><img src={publ} alt="public"className='h-[20px] w-[20px]' /></span>
                         <span className="font-bold">Public</span>
                        </div>
                       <p className="text-xs font-normal opacity-70">Visible to everyone in the community.</p>
                      </button>

                      <button
                       type="button"
                       onClick={() => updateTripData("scope", "private")}
                        className={`px-4 py-4 rounded-xl font-medium transition-all text-left border-2 flex flex-col gap-1 ${
                       tripData.scope === "private"
                       ? "border-[#00b70d] bg-[#00b70d]/5 text-[#00b70d]"
                       : "border-[#e2e8f0] text-gray-500 hover:border-[#00b70d]/30"
                       }
                       `}
                        >
                        <div className="flex items-center gap-2">
                          <span className="text-xl"><img src={priv} alt="private"className='h-[20px] w-[20px]' /></span>
                          <span className="font-bold">Private</span>
                        </div>
                        <p className="text-xs font-normal opacity-70">Only visible to you and people you invite.</p>
                      </button>
                   </div>
                 </div>
                </div>
              )}

              {/* Step 3: Schedule */}
              {currentStep === 3 && (
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
                        onDateSelect={handleDateSelect}
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
                            {new Date(tripData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(tripData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
                            onRemove={() => removeMeetingLocation(index)}
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
                        onChange={(e) => setNewMeetingLocation(e.target.value)}
                        className="sm:col-span-2 px-4 py-3 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
                      />
                      <input
                        type="text"
                        placeholder="e.g., 1:00 PM"
                        value={newMeetingTime}
                        onChange={(e) => setNewMeetingTime(e.target.value)}
                        className="px-4 py-3 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
                      />
                    </div>
                    <button
                      onClick={addMeetingLocation}
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
                    <textarea
                      placeholder="Day 1: Arrival and orientation&#10;Day 2: Desert exploration&#10;Day 3: Return journey"
                      value={tripData.itinerary}
                      onChange={(e) => updateTripData("itinerary", e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b70d] resize-none font-mono text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Activities */}
              {currentStep === 4 && (
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
                          onClick={() => toggleArrayItem("activities", activity)}
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
                        onChange={(e) => setCustomActivity(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addCustomActivity()}
                        className="flex-1 px-4 py-3 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b70d]"
                      />
                      <button
                        onClick={addCustomActivity}
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
                              onClick={() => removeCustomActivity(activity)}
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
              )}

              {/* Step 5: Logistics */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <StepHeader
                    title="Logistics"
                    description="Specify what's included and what participants should bring"
                  />

                  <div>
                    <label className="block font-semibold text-text-[#00b70d] mb-3">
                      What's Included
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {includedOptions.map((item) => {
                        const icons: Record<string, any> = {
                          Accommodation: Hotel,
                          Transport: Car,
                          Meals: Utensils,
                          Guide: Users,
                          Equipment: Backpack,
                          Insurance: Check,
                        };
                        const Icon = icons[item];
                        return (
                          <button
                            key={item}
                            onClick={() => toggleArrayItem("included", item)}
                            className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                              tripData.included.includes(item)
                                ? "bg-[#00b70d] text-white"
                                : "bg-bg-[#ff5900] text-text-[#00b70d] hover:bg-[#e2e8f0]"
                            }`}
                          >
                            <Icon className="size-5" />
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-text-[#00b70d] mb-2">
                      What Participants Should Bring
                    </label>
                    <textarea
                      placeholder="List items participants should bring:&#10;- Comfortable hiking shoes&#10;- Sunscreen and hat&#10;- Personal medication&#10;- Reusable water bottle"
                      value={tripData.whatToBring}
                      onChange={(e) => updateTripData("whatToBring", e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b70d] resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 6: Participants and Pricing */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <StepHeader
                    title="Participants & Pricing"
                    description="Set participant limits and pricing for your trip"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ParticipantControl
                      label="Minimum Participants"
                      value={tripData.minParticipants}
                      onIncrement={() =>
                        updateTripData("minParticipants", tripData.minParticipants + 1)
                      }
                      onDecrement={() =>
                        updateTripData("minParticipants", Math.max(1, tripData.minParticipants - 1))
                      }
                      onChange={(value) =>
                        updateTripData("minParticipants", Math.max(1, value))
                      }
                    />

                    <ParticipantControl
                      label="Maximum Participants"
                      value={tripData.maxParticipants}
                      onIncrement={() =>
                        updateTripData("maxParticipants", tripData.maxParticipants + 1)
                      }
                      onDecrement={() =>
                        updateTripData(
                          "maxParticipants",
                          Math.max(tripData.minParticipants, tripData.maxParticipants - 1)
                        )
                      }
                      onChange={(value) =>
                        updateTripData(
                          "maxParticipants",
                          Math.max(tripData.minParticipants, value)
                        )
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
                        onChange={(e) => updateTripData("pricePerPerson", parseInt(e.target.value) || 0)}
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
              )}

              {/* Step 7: Media */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <StepHeader
                    title="Media"
                    description="Upload images to showcase your trip"
                  />

                  <div>
                    <label className="block font-semibold text-text-[#00b70d] mb-2">
                      Cover Image <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-[#e2e8f0] rounded-xl p-8 text-center hover:border-[#00b70d] transition-colors cursor-pointer" onClick={() => coverImageInputRef.current?.click()}>
                      {tripData.coverImage ? (
                        <div className="relative">
                          <img
                            src={tripData.coverImage}
                            alt="Cover"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTripData("coverImage", "");
                            }}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            <X className="size-5" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="size-12 text-text-[#ff5900] mx-auto mb-3" />
                          <p className="font-medium text-text-[#00b70d] mb-1">Click to upload cover image</p>
                          <p className="text-sm text-text-[#ff5900]">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={coverImageInputRef}
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleCoverImageChange}
                      className="hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-text-[#00b70d] mb-2">
                      Additional Images (Optional)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {tripData.additionalImages.map((fileItem, index) => (
                        <div key={index} className="relative">
                          {fileItem.type.startsWith('image/') ? (
                            <img
                              src={fileItem.data}
                              alt={`Additional ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-32 bg-bg-[#ff5900] rounded-lg flex flex-col items-center justify-center">
                              <FileText className="size-8 text-[#00b70d] mb-2" />
                              <p className="text-xs text-text-[#00b70d] font-medium text-center px-2 line-clamp-2">{fileItem.name}</p>
                            </div>
                          )}
                          <button
                            onClick={() =>
                              updateTripData(
                                "additionalImages",
                                tripData.additionalImages.filter((_, i) => i !== index)
                              )
                            }
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ))}
                      {tripData.additionalImages.length < 6 && (
                        <div 
                          className="border-2 border-dashed border-[#e2e8f0] rounded-lg h-32 flex items-center justify-center hover:border-[#00b70d] transition-colors cursor-pointer"
                          onClick={() => additionalImagesInputRef.current?.click()}
                        >
                          <Plus className="size-8 text-text-[#ff5900]" />
                        </div>
                      )}
                    </div>
                    <input
                      ref={additionalImagesInputRef}
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleAdditionalImagesChange}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {/* Step 8: Review and Publish */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <StepHeader
                    title="Review & Publish"
                    description="Review your trip details before publishing"
                  />

                  {/* Review Sections */}
                  <div className="space-y-4">
                    <ReviewSection
                      title="Destinations"
                      onEdit={() => setCurrentStep(1)}
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
                      title="Trip Basics"
                      onEdit={() => setCurrentStep(2)}
                      content={
                        <div className="space-y-2 text-sm">
                          <p><span className="font-semibold">Title:</span> {tripData.title || "Not set"}</p>
                          <p><span className="font-semibold">Category:</span> {tripData.category || "Not set"}</p>
                          <p><span className="font-semibold">Difficulty:</span> {tripData.difficulty || "Not set"}</p>
                          <p><span className="font-semibold">Description:</span> {tripData.description || "Not set"}</p>
                        </div>
                      }
                    />

                    <ReviewSection
                      title="Schedule"
                      onEdit={() => setCurrentStep(3)}
                      content={
                        <div className="space-y-2 text-sm">
                          <p><span className="font-semibold">Dates:</span> {tripData.startDate || "Not set"} to {tripData.endDate || "Not set"}</p>
                          {duration && (
                            <p><span className="font-semibold">Duration:</span> {duration.days} Days, {duration.nights} Nights</p>
                          )}
                          <div>
                            <span className="font-semibold">Meeting Locations:</span>
                            {tripData.meetingLocations.length > 0 ? (
                              <ul className="ml-4 mt-1 space-y-1">
                                {tripData.meetingLocations.map((meeting, idx) => (
                                  <li key={idx}>• {meeting.location} - {meeting.time}</li>
                                ))}
                              </ul>
                            ) : (
                              <span> Not set</span>
                            )}
                          </div>
                          {tripData.itinerary && (
                            <div>
                              <p><span className="font-semibold">Itinerary:</span></p>
                              <p className="ml-4 whitespace-pre-wrap">{tripData.itinerary}</p>
                            </div>
                          )}
                        </div>
                      }
                    />

                    <ReviewSection
                      title="Activities"
                      onEdit={() => setCurrentStep(4)}
                      content={
                        <div className="flex flex-wrap gap-2">
                          {[...tripData.activities, ...tripData.customActivities].map((activity) => (
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
                      onEdit={() => setCurrentStep(5)}
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
                          {tripData.whatToBring && (
                            <div>
                              <p className="font-semibold text-sm">What to Bring:</p>
                              <p className="text-sm ml-4 whitespace-pre-wrap">{tripData.whatToBring}</p>
                            </div>
                          )}
                        </div>
                      }
                    />

                    <ReviewSection
                      title="Participants & Pricing"
                      onEdit={() => setCurrentStep(6)}
                      content={
                        <div className="space-y-2 text-sm">
                          <p><span className="font-semibold">Capacity:</span> {tripData.minParticipants} - {tripData.maxParticipants} participants</p>
                          <p><span className="font-semibold">Price:</span> {tripData.pricePerPerson.toLocaleString()} DZD per person</p>
                        </div>
                      }
                    />
                  </div>

                  {/* Publish Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#e2e8f0]">
                    <button className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-[#e2e8f0] rounded-xl font-medium text-text-[#00b70d] hover:bg-bg-[#ff5900] transition-colors">
                      <Save className="size-5" />
                      Save as Draft
                    </button>
                    <button 
                      onClick={validateAndPublish}
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-[#00b70d] text-white rounded-xl font-medium hover:bg-[#00b70d]-hover transition-colors">
                      <Check className="size-5" />
                      Publish Trip
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <FormNavigation
                currentStep={currentStep}
                totalSteps={STEPS.length}
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


