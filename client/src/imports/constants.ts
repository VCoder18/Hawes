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
  Landmark,
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

export const steps = [
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
  { id: "1", name: "Sahara Desert", region: "Tamanrasset", image: imgDunes, isFavorite: true },
  { id: "2", name: "Casbah Algiers", region: "Algiers", image: imgBackground4, isFavorite: false },
  { id: "3", name: "Djurdjura Mountains", region: "Tizi Ouzou", image: imgBackground5, isFavorite: true },
  { id: "4", name: "Mediterranean Coast", region: "Oran", image: imgDunes, isFavorite: false },
  { id: "5", name: "Timgad Ruins", region: "Batna", image: imgBackground4, isFavorite: false },
  { id: "6", name: "M'zab Valley", region: "Ghardaïa", image: imgBackground5, isFavorite: true },
  { id: "7", name: "Hoggar Mountains", region: "Tamanrasset", image: imgDunes, isFavorite: false },
  { id: "8", name: "Tassili n'Ajjer", region: "Illizi", image: imgBackground4, isFavorite: false },
];

export const difficulties = ["Easy", "Moderate", "Challenging", "Difficult"];
export const activityOptions = [
  "Hiking", "Camping", "Photography", "Wildlife Watching", "Rock Climbing",
  "Swimming", "Cycling", "Kayaking", "Cultural Tours", "Food Tasting"
];
export const includedOptions = ["Accommodation", "Transport", "Meals", "Guide", "Equipment", "Insurance", "Entertainment", "Miscellaneous"];
export const regionOptions = ["All Regions", "Tamanrasset", "Algiers", "Tizi Ouzou", "Oran", "Batna", "Ghardaïa"];

export const itemsPerPage = 6;

// BROWSE DESTINATIONS - Fixed category list
export const browseDestinationCategories = ["beach", "mountain", "desert", "forest", "historic", "city"];

// TRIP CREATION & BROWSE TRIPS - Category list (trip type categories)
export const tripCategories = ["Adventure", "Cultural", "Nature", "Historical", "Relaxation", "Photography"];

// BROWSE DESTINATIONS - Category to Icon mapping
export const categoryIconMap: { [key: string]: any } = {
  desert: Sun,
  mountain: Mountain,
  beach: Waves,
  forest: Trees,
  historic: Landmark,
  city: Landmark,
};

// BROWSE DESTINATIONS
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

// Mock destinations list
export const destinationsList: Destination[] = [
  {
    id: "1",
    name: "Sahara Desert",
    region: "Tamanrasset",
    image: imgDunes,
    rating: 4.8,
    reviews: 342,
    type: "Desert",
    category: "desert",
    description: "Experience the vast golden dunes of the Sahara Desert",
    peopleVisiting: 1205,
    tripsAvailable: 24,
    isFavorite: true,
    lat: 22.7927,
    lng: 5.5898,
    best_periods: ["05-01:09-30"],
  },
  {
    id: "2",
    name: "Casbah Algiers",
    region: "Algiers",
    image: imgBackground4,
    rating: 4.6,
    reviews: 521,
    type: "Historical",
    category: "historical",
    description: "Explore the historic Casbah with its traditional architecture",
    peopleVisiting: 892,
    tripsAvailable: 18,
    isFavorite: false,
    lat: 36.7538,
    lng: 3.0588,
    best_periods: ["03-01:05-31", "09-01:11-30"],
  },
  {
    id: "3",
    name: "Djurdjura Mountains",
    region: "Tizi Ouzou",
    image: imgBackground5,
    rating: 4.7,
    reviews: 467,
    type: "Mountains",
    category: "mountains",
    description: "Discover the majestic peaks of the Djurdjura Mountains",
    peopleVisiting: 623,
    tripsAvailable: 15,
    isFavorite: true,
    lat: 36.5931,
    lng: 4.0467,
    best_periods: ["06-01:09-30"],
  },
  {
    id: "4",
    name: "Mediterranean Coast",
    region: "Oran",
    image: imgDunes,
    rating: 4.5,
    reviews: 289,
    type: "Beach",
    category: "beach",
    description: "Relax on the beautiful Mediterranean beaches of Oran",
    peopleVisiting: 1456,
    tripsAvailable: 22,
    isFavorite: false,
    lat: 35.7521,
    lng: -0.6401,
    best_periods: ["06-01:09-30"],
  },
  {
    id: "5",
    name: "Timgad Ruins",
    region: "Batna",
    image: imgBackground4,
    rating: 4.4,
    reviews: 198,
    type: "Archaeological",
    category: "historical",
    description: "Uncover ancient Roman ruins at the archaeological site of Timgad",
    peopleVisiting: 456,
    tripsAvailable: 12,
    isFavorite: false,
    lat: 35.3025,
    lng: 6.4742,
    best_periods: ["03-01:05-31"],
  },
  {
    id: "6",
    name: "M'zab Valley",
    region: "Ghardaïa",
    image: imgBackground5,
    rating: 4.9,
    reviews: 401,
    type: "Cultural",
    category: "cultural",
    description: "Immerse yourself in the unique culture of M'zab Valley",
    peopleVisiting: 789,
    tripsAvailable: 19,
    isFavorite: true,
    lat: 32.4927,
    lng: 3.6615,
    best_periods: ["10-01:04-30"],
  },
  {
    id: "7",
    name: "Hoggar Mountains",
    region: "Tamanrasset",
    image: imgDunes,
    rating: 4.7,
    reviews: 312,
    type: "Mountains",
    category: "mountains",
    description: "Adventure awaits in the stunning Hoggar Mountains",
    peopleVisiting: 534,
    tripsAvailable: 14,
    isFavorite: false,
    lat: 23.3620,
    lng: 5.5169,
    best_periods: ["10-01:04-30"],
  },
  {
    id: "8",
    name: "Tassili n'Ajjer",
    region: "Illizi",
    image: imgBackground4,
    rating: 4.8,
    reviews: 298,
    type: "Nature",
    category: "nature",
    description: "Explore the natural wonders and rock formations of Tassili n'Ajjer",
    peopleVisiting: 612,
    tripsAvailable: 16,
    isFavorite: false,
    lat: 24.6705,
    lng: 9.4964,
    best_periods: ["10-01:04-30"],
  },
  {
    id: "9",
    name: "Constantine Bridge",
    region: "Constantine",
    image: imgBackground5,
    rating: 4.3,
    reviews: 176,
    type: "Landmark",
    category: "historical",
    description: "Marvel at the iconic Constantine Bridge and its architecture",
    peopleVisiting: 445,
    tripsAvailable: 10,
    isFavorite: false,
    lat: 36.3650,
    lng: 6.6143,
    best_periods: ["03-01:05-31", "09-01:11-30"],
  },
  {
    id: "10",
    name: "Annaba Beach",
    region: "Annaba",
    image: imgDunes,
    rating: 4.6,
    reviews: 425,
    type: "Beach",
    category: "beach",
    description: "Enjoy pristine beaches and coastal beauty at Annaba",
    peopleVisiting: 1234,
    tripsAvailable: 20,
    isFavorite: false,
    lat: 36.9001,
    lng: 7.7581,
    best_periods: ["06-01:09-30"],
  },
  {
    id: "11",
    name: "Sétif Roman Site",
    region: "Sétif",
    image: imgBackground4,
    rating: 4.5,
    reviews: 214,
    type: "Archaeological",
    category: "historical",
    description: "Discover the archaeological treasures of the Sétif Roman Site",
    peopleVisiting: 356,
    tripsAvailable: 11,
    isFavorite: false,
    lat: 36.1914,
    lng: 5.4141,
    best_periods: ["03-01:05-31"],
  },
  {
    id: "12",
    name: "Béjaïa Mountain",
    region: "Béjaïa",
    image: imgBackground5,
    rating: 4.4,
    reviews: 189,
    type: "Mountains",
    category: "mountains",
    description: "Trek through the scenic Béjaïa Mountain and its surroundings",
    peopleVisiting: 325,
    tripsAvailable: 13,
    isFavorite: false,
    lat: 36.7541,
    lng: 5.0841,
    best_periods: ["05-01:10-31"],
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

export const ALGERIAN_WILAYAS = [
  { value: 'Unknown', label: 'Unknown' },
  { value: 'Foreign', label: 'Foreign' },
  { value: '01-Adrar', label: '01-Adrar' },
  { value: '02-Chlef', label: '02-Chlef' },
  { value: '03-Laghouat', label: '03-Laghouat' },
  { value: '04-Oum El Bouaghi', label: '04-Oum El Bouaghi' },
  { value: '05-Batna', label: '05-Batna' },
  { value: '06-Béjaïa', label: '06-Béjaïa' },
  { value: '07-Biskra', label: '07-Biskra' },
  { value: '08-Béchar', label: '08-Béchar' },
  { value: '09-Blida', label: '09-Blida' },
  { value: '10-Bouïra', label: '10-Bouïra' },
  { value: '11-Tamanrasset', label: '11-Tamanrasset' },
  { value: '12-Tébessa', label: '12-Tébessa' },
  { value: '13-Tlemcen', label: '13-Tlemcen' },
  { value: '14-Tiaret', label: '14-Tiaret' },
  { value: '15-Tizi Ouzou', label: '15-Tizi Ouzou' },
  { value: '16-Alger', label: '16-Alger' },
  { value: '17-Djelfa', label: '17-Djelfa' },
  { value: '18-Jijel', label: '18-Jijel' },
  { value: '19-Sétif', label: '19-Sétif' },
  { value: '20-Saïda', label: '20-Saïda' },
  { value: '21-Skikda', label: '21-Skikda' },
  { value: '22-Sidi Bel Abbès', label: '22-Sidi Bel Abbès' },
  { value: '23-Annaba', label: '23-Annaba' },
  { value: '24-Guelma', label: '24-Guelma' },
  { value: '25-Constantine', label: '25-Constantine' },
  { value: '26-Médéa', label: '26-Médéa' },
  { value: '27-Mostaghanem', label: '27-Mostaghanem' },
  { value: '28-M\'Sila', label: '28-M\'Sila' },
  { value: '29-Mascara', label: '29-Mascara' },
  { value: '30-Oran', label: '30-Oran' },
  { value: '31-Idès', label: '31-Idès' },
  { value: '32-Relizane', label: '32-Relizane' },
  { value: '33-El Bayedh', label: '33-El Bayedh' },
  { value: '34-Illizi', label: '34-Illizi' },
  { value: '35-Bordj Baji Mokhtar', label: '35-Bordj Baji Mokhtar' },
  { value: '36-Ouargla', label: '36-Ouargla' },
  { value: '37-Hassi Messaoud', label: '37-Hassi Messaoud' },
  { value: '38-Khenchela', label: '38-Khenchela' },
  { value: '39-Souk Ahras', label: '39-Souk Ahras' },
  { value: '40-Tipaza', label: '40-Tipaza' },
  { value: '41-Mila', label: '41-Mila' },
  { value: '42-Aïn Defla', label: '42-Aïn Defla' },
  { value: '43-Aïn Témouchent', label: '43-Aïn Témouchent' },
  { value: '44-Ghardaïa', label: '44-Ghardaïa' },
  { value: '45-Relizane', label: '45-Relizane' },
  { value: '46-Tindouf', label: '46-Tindouf' },
  { value: '47-Tissemsilt', label: '47-Tissemsilt' },
  { value: '48-El Oued', label: '48-El Oued' },
  { value: '49-Kharga', label: '49-Kharga' },
  { value: '50-Souk El Ahad', label: '50-Souk El Ahad' },
  { value: '51-Saïda', label: '51-Saïda' },
  { value: '52-Djanet', label: '52-Djanet' },
  { value: '53-Touggourt', label: '53-Touggourt' },
  { value: '54-Tamanghasset', label: '54-Tamanghasset' },
  { value: '55-Tamentit', label: '55-Tamentit' },
  { value: '56-Béni Abbès', label: '56-Béni Abbès' },
  { value: '57-In Amenas', label: '57-In Amenas' },
  { value: '58-In Guezzam', label: '58-In Guezzam' },
];
