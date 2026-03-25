// CREATE TRIP

import {
  MapPin,
  Compass,
  Calendar,
  Mountain,
  Backpack,
  Users,
  Image as ImageIcon,
  Check,
  Globe,
  Heart,
  Sun,
  Waves,
  Building2,
  Theater,
  Trees,
} from "lucide-react";

// Import destination images for preview
import imgDunes from "@/assets/images/banner.jpg";
import imgBackground4 from "@/assets/images/banner.jpg";
import imgBackground5 from "@/assets/images/banner.jpg";

// Import post grid square images
import square1 from "@/assets/images/square_1.png";
import square2 from "@/assets/images/square_2.png";
import square3 from "@/assets/images/square_3.png";
import square4 from "@/assets/images/square_4.png";

// Import profile images for follower cards
import espioPfp from "@/assets/images/espio_pfp.png";
import shadowPfp from "@/assets/images/shadow_pfp.jpg";
import tailsPfp from "@/assets/images/tails_pfp.png";

// Import recommended and upcoming large images
import large1 from "@/assets/images/large_1.png";
import large2 from "@/assets/images/large_2.png";

export const STEPS = [
  { id: 1, name: "Destination", icon: MapPin },
  { id: 2, name: "Trip Basics", icon: Compass },
  { id: 3, name: "Schedule", icon: Calendar },
  { id: 4, name: "Activities", icon: Mountain },
  { id: 5, name: "Logistics", icon: Backpack },
  { id: 6, name: "Participants", icon: Users },
  { id: 7, name: "Media", icon: ImageIcon },
  { id: 8, name: "Review", icon: Check },
];

export const availableDestinations = [
  { id: 1, name: "Sahara Desert", region: "Tamanrasset", image: imgDunes, isFavorite: true },
  { id: 2, name: "Casbah Algiers", region: "Algiers", image: imgBackground4, isFavorite: false },
  { id: 3, name: "Djurdjura Mountains", region: "Tizi Ouzou", image: imgBackground5, isFavorite: true },
  { id: 4, name: "Mediterranean Coast", region: "Oran", image: imgDunes, isFavorite: false },
  { id: 5, name: "Timgad Ruins", region: "Batna", image: imgBackground4, isFavorite: false },
  { id: 6, name: "M'zab Valley", region: "Ghardaïa", image: imgBackground5, isFavorite: true },
  { id: 7, name: "Hoggar Mountains", region: "Tamanrasset", image: imgDunes, isFavorite: false },
  { id: 8, name: "Tassili n'Ajjer", region: "Illizi", image: imgBackground4, isFavorite: false },
];

export const tripCategories = ["Adventure", "Cultural", "Nature", "Historical", "Relaxation", "Photography"];
export const difficulties = ["Easy", "Moderate", "Challenging", "Difficult"];
export const activityOptions = [
  "Hiking", "Camping", "Photography", "Wildlife Watching", "Rock Climbing",
  "Swimming", "Cycling", "Kayaking", "Cultural Tours", "Food Tasting"
];
export const includedOptions = ["Accommodation", "Transport", "Meals", "Guide", "Equipment", "Insurance"];
export const regionOptions = ["All Regions", "Tamanrasset", "Algiers", "Tizi Ouzou", "Oran", "Batna", "Ghardaïa"];

export const ITEMS_PER_PAGE = 4;

// BROWSE DESTINATIONS

import imgBackground3 from "@/assets/images/banner.jpg";
import imgBackground6 from "@/assets/images/banner.jpg";
import imgBackground7 from "@/assets/images/banner.jpg";
import imgBackground8 from "@/assets/images/banner.jpg";
import imgBackground from "@/assets/images/banner.jpg";
import imgBackground1 from "@/assets/images/banner.jpg";
import type { Category, Destination } from "./types";

export const destinationCategories: Category[] = [
  { id: "all", label: "All", icon: Globe },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "desert", label: "Desert", icon: Sun },
  { id: "beach", label: "Beach", icon: Waves },
  { id: "mountains", label: "Mountains", icon: Mountain },
  { id: "historical", label: "Historical", icon: Building2 },
  { id: "cultural", label: "Cultural", icon: Theater },
  { id: "nature", label: "Nature", icon: Trees },
];

export const destinationsList: Destination[] = [
  {
    id: 1,
    name: "Sahara Desert",
    type: "Desert",
    region: "Tamanrasset",
    image: imgDunes,
    rating: 4.9,
    reviews: 342,
    peopleVisiting: 1250,
    availableEvents: 3,
    tripsAvailable: 24,
    category: "desert",
    isFavorite: true,
  },
  {
    id: 2,
    name: "Casbah Algiers",
    type: "Historic",
    region: "Algiers",
    image: imgBackground4,
    rating: 4.7,
    reviews: 210,
    peopleVisiting: 890,
    availableEvents: 5,
    tripsAvailable: 18,
    category: "historical",
    isFavorite: false,
  },
  {
    id: 3,
    name: "Djurdjura Mountains",
    type: "Mountain",
    region: "Tizi Ouzou",
    image: imgBackground5,
    rating: 4.8,
    reviews: 156,
    peopleVisiting: 670,
    availableEvents: 0,
    tripsAvailable: 15,
    category: "mountains",
    isFavorite: true,
  },
  {
    id: 4,
    name: "Mediterranean Coast",
    type: "Coast",
    region: "Oran",
    image: imgBackground6,
    rating: 4.6,
    reviews: 189,
    peopleVisiting: 1100,
    availableEvents: 2,
    tripsAvailable: 21,
    category: "beach",
    isFavorite: false,
  },
  {
    id: 5,
    name: "Timgad Ruins",
    type: "Ancient",
    region: "Batna",
    image: imgBackground7,
    rating: 4.9,
    reviews: 278,
    peopleVisiting: 820,
    availableEvents: 4,
    tripsAvailable: 12,
    category: "historical",
    isFavorite: false,
  },
  {
    id: 6,
    name: "M'zab Valley",
    type: "Culture",
    region: "Ghardaïa",
    image: imgBackground8,
    rating: 4.7,
    reviews: 165,
    peopleVisiting: 540,
    availableEvents: 3,
    tripsAvailable: 16,
    category: "cultural",
    isFavorite: true,
  },
  {
    id: 7,
    name: "Tassili n'Ajjer",
    type: "Desert",
    region: "Illizi",
    image: imgBackground3,
    rating: 4.8,
    reviews: 201,
    peopleVisiting: 430,
    availableEvents: 1,
    tripsAvailable: 9,
    category: "desert",
    isFavorite: false,
  },
  {
    id: 8,
    name: "Constantine Bridges",
    type: "Historic",
    region: "Constantine",
    image: imgBackground,
    rating: 4.6,
    reviews: 145,
    peopleVisiting: 760,
    availableEvents: 0,
    tripsAvailable: 19,
    category: "historical",
    isFavorite: false,
  },
  {
    id: 9,
    name: "Jijel Beaches",
    type: "Coast",
    region: "Jijel",
    image: imgBackground1,
    rating: 4.5,
    reviews: 198,
    peopleVisiting: 980,
    availableEvents: 2,
    tripsAvailable: 22,
    category: "beach",
    isFavorite: false,
  },
  {
    id: 10,
    name: "Hoggar Mountains",
    type: "Mountain",
    region: "Tamanrasset",
    image: imgBackground5,
    rating: 4.8,
    reviews: 234,
    peopleVisiting: 590,
    availableEvents: 0,
    tripsAvailable: 11,
    category: "mountains",
    isFavorite: false,
  },
  {
    id: 11,
    name: "Tipasa Ruins",
    type: "Ancient",
    region: "Tipasa",
    image: imgBackground7,
    rating: 4.7,
    reviews: 176,
    peopleVisiting: 720,
    availableEvents: 3,
    tripsAvailable: 14,
    category: "historical",
    isFavorite: false,
  },
  {
    id: 12,
    name: "Chréa National Park",
    type: "Nature",
    region: "Blida",
    image: imgBackground3,
    rating: 4.6,
    reviews: 167,
    peopleVisiting: 810,
    availableEvents: 1,
    tripsAvailable: 17,
    category: "nature",
    isFavorite: false,
  },
];

// PROFILE

import type { ProfilePost, RecommendedItem } from "./types";

export const profileStats = {
  tripsCreated: 12,
  tripsJoined: 45,
  destinations: 8,
  followers: "1.2k",
};

export const profilePosts: ProfilePost[] = [
  {
    img: square1,
    views: "2.4k views",
    icon: "p1a900f00",
    likes: 243,
    comments: 18
  },
  {
    img: square2,
    views: "8.1k views",
    icon: "p1bc83290",
    likes: 512,
    comments: 42,
    showOverlay: true
  },
  {
    img: square3,
    views: "1.3k views",
    icon: "p1a900f00",
    likes: 156,
    comments: 23
  },
  {
    img: square4,
    views: "3.3k views",
    icon: "p1bc83290",
    likes: 287,
    comments: 31
  },
  {
    img: square1,
    views: "3.8k views",
    icon: "p1a900f00",
    likes: 421,
    comments: 54
  },
  {
    img: square2,
    views: "2.7k views",
    icon: "p1bc83290",
    likes: 198,
    comments: 27
  },
  {
    img: square3,
    views: "5.2k views",
    icon: "p1a900f00",
    likes: 643,
    comments: 89
  },
  {
    img: square4,
    views: "4.6k views",
    icon: "p1bc83290",
    likes: 378,
    comments: 45
  }
];

export const followerImages = [
  { url: espioPfp, alt: "Espio" },
  { url: shadowPfp, alt: "Shadow" },
  { url: tailsPfp, alt: "Tails" }
];

export const recommendedItems: RecommendedItem[] = [
  {
    id: "taghit-oasis",
    image: large1,
    title: "Taghit Oasis",
    description: "Because you visited Ghardaia",
    rating: 4.8
  },
  {
    id: "yemma-gouraya",
    image: large2,
    title: "Yemma Gouraya",
    description: "Based on your interest in Algiers",
    rating: 4.7
  }
];

// EDIT PROFILE

import { Twitter, Youtube, Facebook, Instagram, Linkedin } from "lucide-react";
import type { SettingsMenuItem, SocialLink } from "./types";

export const settingsMenuItems: SettingsMenuItem[] = [
  { id: "profile", label: "Profile", active: true },
  { id: "security", label: "Security", active: false },
  { id: "notifications", label: "Notifications", active: false },
  { id: "billing", label: "Billing", active: false },
];

export const socialLinks: SocialLink[] = [
  {
    id: "twitter",
    icon: Twitter,
    placeholder: "Twitter/X username",
    label: "Twitter"
  },
  {
    id: "youtube",
    icon: Youtube,
    placeholder: "YouTube channel URL",
    label: "YouTube"
  },
  {
    id: "facebook",
    icon: Facebook,
    placeholder: "Facebook profile URL",
    label: "Facebook"
  },
  {
    id: "instagram",
    icon: Instagram,
    placeholder: "Instagram username",
    label: "Instagram"
  },
  {
    id: "linkedin",
    icon: Linkedin,
    placeholder: "LinkedIn profile URL",
    label: "LinkedIn"
  },
];

export const privacySettings = [
  {
    id: "profileVisibility",
    title: "Profile Visibility",
    description: "Make your profile visible to everyone",
    defaultChecked: true
  },
  {
    id: "showActivityStatus",
    title: "Show Activity Status",
    description: "Let others see when you're active",
    defaultChecked: true
  },
  {
    id: "showTripHistory",
    title: "Show Trip History",
    description: "Display your past trips on your profile",
    defaultChecked: false
  },
];
