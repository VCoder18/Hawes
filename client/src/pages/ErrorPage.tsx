import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import RonoroaWanderer from "@/components/RonoroaWanderer";
import { Compass, Home, Luggage, MapPin, Plane } from "lucide-react";

interface ErrorPageProps {
  errorCode?: 404 | 403 | 500 | 503;
}

const algierianLocations = ["Ighzer Ouzarif", "Ikoubab", "La Residence"];

const errorData = {
  404: {
    title: "Page Not Found",
    description: "Looks like you've wandered off the map! This destination doesn't exist in our travel guide.",
    funMessageTemplate: "Maybe you took a wrong turn at {location}?",
  },
  403: {
    title: "Access Forbidden",
    description: "Sorry, this destination is off-limits! You don't have permission to visit this page.",
    funMessage: "This area is reserved for VIP travelers only.",
  },
  500: {
    title: "Server Error",
    description: "Our travel servers hit some turbulence! We're working hard to get things back on track.",
    funMessage: "Even the best navigators sometimes need a compass reset.",
  },
  503: {
    title: "Service Unavailable",
    description: "We're temporarily closed for maintenance! Our team is preparing for your next adventure.",
    funMessage: "Currently restocking our travel gear. Be back soon!",
  },
};

export default function ErrorPage({ errorCode = 404 }: ErrorPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [randomLocation, setRandomLocation] = useState("");

  const error = errorData[errorCode];

  useEffect(() => {
    const lastLocation = localStorage.getItem("errorPageLastLocation");
    const candidates =
      algierianLocations.length > 1
        ? algierianLocations.filter((location) => location !== lastLocation)
        : algierianLocations;

    const newLocation =
      candidates[Math.floor(Math.random() * candidates.length)] ??
      algierianLocations[0] ??
      "Algeria";

    localStorage.setItem("errorPageLastLocation", newLocation);
    setRandomLocation(newLocation);
  }, []);

  const funMessage =
    "funMessageTemplate" in error
      ? error.funMessageTemplate.replace("{location}", randomLocation)
      : error.funMessage;

  return (
    <div className="bg-[#ffffe8] h-screen w-full overflow-hidden flex flex-col">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex items-center justify-center px-4 py-8 overflow-visible">
        <div className="max-w-4xl w-full text-center">
          <div className="relative mb-6 sm:mb-8 overflow-visible">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
              <Luggage
                className="absolute -top-4 sm:-top-8 left-[15%] text-[#00b70d] opacity-30 animate-bounce"
                style={{ animationDelay: "0s", animationDuration: "3s" }}
                size={32}
              />
              <Compass
                className="absolute top-0 right-[20%] text-[#ff5900] opacity-30 animate-spin"
                style={{ animationDuration: "8s" }}
                size={32}
              />
              <Plane
                className="absolute -bottom-2 sm:-bottom-4 right-[15%] text-[#00b70d] opacity-30"
                style={{ animation: "float 4s ease-in-out infinite" }}
                size={40}
              />
              <MapPin
                className="absolute bottom-4 sm:bottom-8 left-[20%] text-[#ff5900] opacity-30 animate-pulse"
                size={28}
              />
            </div>

            <div className="relative inline-block">
              <div className="text-[120px] sm:text-[160px] md:text-[200px] lg:text-[240px] leading-none font-['Merriweather'] font-black text-transparent bg-clip-text bg-gradient-to-br from-[#00b70d] via-[#ff5900] to-[#00b70d] select-none animate-gradient">
                {errorCode}
              </div>

              <div className="absolute inset-0 text-[120px] sm:text-[160px] md:text-[200px] lg:text-[240px] leading-none font-['Merriweather'] font-black text-[#00b70d] opacity-10 blur-2xl -z-10">
                {errorCode}
              </div>

              <div className="absolute top-1/2 left-0 w-12 h-12 sm:w-16 sm:h-16 bg-[#00b70d] rounded-full opacity-20 blur-xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
              <div
                className="absolute top-1/2 right-0 w-14 h-14 sm:w-20 sm:h-20 bg-[#ff5900] rounded-full opacity-20 blur-xl transform translate-x-1/2 -translate-y-1/2 animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-['Merriweather'] font-bold text-[#0d2805] mb-3 px-4">
            {error.title}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#757575] mb-2 max-w-2xl mx-auto px-4">
            {error.description}
          </p>

          <p className="text-sm sm:text-base text-[#00b70d] italic mb-8 sm:mb-12 px-4">{funMessage}</p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <a
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00b70d] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium hover:bg-[#00a00c] transition-all transform hover:scale-105 shadow-lg"
            >
              <Home size={20} />
              Back to Home
            </a>
            <a
              href="/browse"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#00b70d] border-2 border-[#00b70d] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium hover:bg-[#00b70d] hover:text-white transition-all transform hover:scale-105 shadow-lg"
            >
              <Compass size={20} />
              Browse Destinations
            </a>
          </div>

          <div className="mt-8 sm:mt-12 flex justify-center gap-2 opacity-30">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#00b70d]"
                style={{
                  animation: "bounce 1.5s ease-in-out infinite",
                  animationDelay: `${i * 0.1}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        <RonoroaWanderer enabled={errorCode === 404} />
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}