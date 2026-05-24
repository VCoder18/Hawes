import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Map,
  MapPin,
  CalendarCheck,
  Route,
  Users,
  ArrowRight,
  Compass,
  Building2,
  Briefcase,
  TrendingUp,
  Search,
} from "lucide-react";
import { DestinationModal } from "@/components/DestinationModal";
import { LandingDestinationCard } from "@/components/LandingDestinationCard";
import { supabase } from "@/lib/supabase";
import logoAlt from "@/assets/images/Logo_Alt.png";
import logoMin from "@/assets/images/Logo_Min.png";
import bannerImg from "@/assets/images/banner.jpg";
import imgLarge1 from "@/assets/images/large_1.png";
import imgLarge2 from "@/assets/images/large_2.png";
import imgLarge3 from "@/assets/images/large_3.png";
import imgInsurance from "@/assets/images/insurance.png";
import imgSociety from "@/assets/images/society.png";
import imgTassili from "@/assets/images/tassili.jpg";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const C = {
  cream: "#FEFDE8",
  orange: "#E85500",
  darkGreen: "#0D1F09",
  medGreen: "#163B0C",
  brightGreen: "#00A800",
};

function CompassSVG({ size = 40, color = C.brightGreen, sw = 1.5 }: { size?: number; color?: string; sw?: number }) {
  const cx = size / 2;
  const r = size * 0.44;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden="true">
      <circle cx={cx} cy={cx} r={r} stroke={color} strokeWidth={sw} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        const isCard = i % 2 === 0;
        const outer = isCard ? r - sw / 2 : r * 0.7;
        const inner = r * 0.22;
        return (
          <line
            key={deg}
            x1={cx + Math.sin(a) * inner}
            y1={cx - Math.cos(a) * inner}
            x2={cx + Math.sin(a) * outer}
            y2={cx - Math.cos(a) * outer}
            stroke={color}
            strokeWidth={isCard ? sw * 1.6 : sw}
            strokeLinecap="round"
          />
        );
      })}
      <circle cx={cx} cy={cx} r={size * 0.065} fill={color} />
    </svg>
  );
}

function SectionLabel({ children, color = C.orange }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color, textTransform: "uppercase" }}>
      {children}
    </div>
  );
}

const fadeUp = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const fadeUpStrong = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
};

const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function SectionHeading({ label, title, subtitle, color = C.darkGreen }: { label: string; title: string; subtitle?: string; color?: string }) {
  return (
    <motion.div variants={fadeUp} className="max-w-2xl">
      <SectionLabel color={color === C.cream ? C.brightGreen : C.orange}>{label}</SectionLabel>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 900, color, lineHeight: 1.05, marginTop: 12 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color, opacity: 0.6, marginTop: 14, lineHeight: 1.7, maxWidth: 540 }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

function SmoothDivider({ from, to }: { from: string; to: string }) {
  return (
    <div
      className="w-full relative"
      style={{
        height: 64,
        marginTop: -32,
        marginBottom: -32,
        pointerEvents: "none",
        zIndex: 5,
        background: `linear-gradient(to bottom, ${from} 0%, ${from}00 30%, ${to}00 70%, ${to} 100%)`,
      }}
    />
  );
}

const FALLBACK_IMAGE = bannerImg;
const DEST_FALLBACKS = [
  { id: "1", name: "Sahara Desert", region: "Tamanrasset", rating: 4.8, type: "Desert", category: "desert", peopleVisiting: 1205 },
  { id: "2", name: "Casbah Algiers", region: "Algiers", rating: 4.6, type: "Historical", category: "historical", peopleVisiting: 892 },
  { id: "3", name: "Djurdjura Mountains", region: "Tizi Ouzou", rating: 4.7, type: "Mountains", category: "mountains", peopleVisiting: 623 },
  { id: "4", name: "Mediterranean Coast", region: "Oran", rating: 4.5, type: "Beach", category: "beach", peopleVisiting: 1456 },
  { id: "5", name: "Timgad Ruins", region: "Batna", rating: 4.4, type: "Archaeological", category: "historical", peopleVisiting: 456 },
  { id: "6", name: "M'zab Valley", region: "Ghardaïa", rating: 4.9, type: "Cultural", category: "cultural", peopleVisiting: 789 },
  { id: "7", name: "Hoggar Mountains", region: "Tamanrasset", rating: 4.7, type: "Mountains", category: "mountains", peopleVisiting: 534 },
  { id: "8", name: "Tassili n'Ajjer", region: "Illizi", rating: 4.8, type: "Nature", category: "nature", peopleVisiting: 612 },
];

const mockServices = [
  { id: "m1", name: "Desert Camping", image: imgLarge1 },
  { id: "m2", name: "Traditional Cuisine", image: imgLarge2 },
  { id: "m3", name: "Mountain Trekking", image: imgLarge3 },
  { id: "m4", name: "Travel Insurance", image: imgInsurance },
  { id: "m5", name: "Tuareg Guides", image: imgTassili },
  { id: "m6", name: "Community Tours", image: imgSociety },
  { id: "m7", name: "Sahara Expedition", image: bannerImg },
  { id: "m8", name: "Coastal Retreats", image: imgLarge1 },
  { id: "m9", name: "Cultural Workshops", image: imgLarge2 },
  { id: "m10", name: "Photography Tours", image: imgLarge3 },
  { id: "m11", name: "Eco Lodges", image: imgTassili },
  { id: "m12", name: "Historical Walks", image: imgSociety },
];

interface TripRow {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string;
  images?: string[];
  start_date: string;
  end_date: string;
  price: number | null;
  max_participants: number | null;
  min_participants: number | null;
  current_participants?: number | null;
  meeting_point?: string | null;
}

export default function LandingPage() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroCompassScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const heroCompassOpacity = useTransform(scrollYProgress, [0, 0.6], [0.04, 0]);

  const [selectedDestination, setSelectedDestination] = useState<any | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [trips, setTrips] = useState<TripRow[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [destinations, setDestinations] = useState<any[]>(DEST_FALLBACKS);
  const [destinationsLoading, setDestinationsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('id, name, image');
      const real = !error && data ? data.filter((s: any) => s.image) : [];
      const combined = [...real, ...mockServices];
      if (!cancelled) setServices(combined);
      if (!cancelled) setServicesLoading(false);
    };
    fetchServices();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchTrips = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const headers: Record<string, string> = {};
        if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
        const res = await fetch(`${API_BASE_URL}/trips?limit=8&offset=0`, { headers });
        if (res.ok) {
          const data = await res.json();
          const parsed = Array.isArray(data) ? data : data?.data ?? [];
          if (!cancelled) setTrips(parsed.slice(0, 8));
        }
      } catch {} finally {
        if (!cancelled) setTripsLoading(false);
      }
    };
    fetchTrips();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchDestinations = async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('id, name, region, rating, category, images, description')
        .limit(8);
      if (!error && data && data.length > 0) {
        const mapped = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          region: d.region ?? '',
          rating: d.rating ?? 4.5,
          type: d.category ?? '',
          category: d.category ?? '',
          peopleVisiting: 0,
          image: d.images?.[0] || FALLBACK_IMAGE,
        }));
        if (!cancelled) setDestinations(mapped);
      }
      if (!cancelled) setDestinationsLoading(false);
    };
    fetchDestinations();
    return () => { cancelled = true; };
  }, []);

  const formatPrice = (price: number | null) => {
    if (price == null || price === 0) return "FREE";
    return `DZD ${price}`;
  };

  return (
    <div className="w-full overflow-hidden">
      {/* ──────────────── HERO ──────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center" style={{ background: C.darkGreen }}>
        {/* Animated background logo */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ scale: heroCompassScale, opacity: heroCompassOpacity }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          >
            <img src={logoMin} alt="Hawes Logo" className="h-96 w-auto opacity-[0.15]" />
          </motion.div>
        </motion.div>

        {/* Floating small compasses */}
        <motion.div
          className="absolute pointer-events-none hidden lg:block"
          style={{ top: "15%", left: "8%" }}
          animate={{ y: [0, -12, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <CompassSVG size={28} color={`${C.orange}40`} sw={1.2} />
        </motion.div>
        <motion.div
          className="absolute pointer-events-none hidden lg:block"
          style={{ bottom: "20%", right: "10%" }}
          animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <CompassSVG size={22} color={`${C.brightGreen}40`} sw={1.2} />
        </motion.div>

        {/* Pulsing radial glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${C.medGreen}60 0%, transparent 70%)` }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.brightGreen})` }} />

        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 py-20">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
            <motion.div variants={fadeUp}>
              <SectionLabel>{t('landing.digitalTravelPlatform')}</SectionLabel>
            </motion.div>

            <motion.div variants={scaleIn} className="flex items-center gap-4">
              <img src={logoAlt} alt="Hawes" className="h-14 w-auto" />
              <img src={logoMin} alt="Hawes Min" className="h-8 w-auto opacity-60" />
            </motion.div>

            <motion.div variants={fadeUpStrong}>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2.5rem, 6.5vw, 4.8rem)", fontWeight: 900, color: C.orange, letterSpacing: "0.04em", lineHeight: 1 }}>
                {t('landing.discoverAlgeria')}
              </h1>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1rem, 2.2vw, 1.6rem)", color: C.cream, opacity: 0.7, fontWeight: 300, marginTop: 6 }}>
                {t('landing.beyondTheGuidebook')}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-4 my-3">
              <div className="h-px w-16" style={{ background: `${C.brightGreen}50` }} />
              <motion.div
                className="relative"
                style={{ width: 28, height: 28 }}
              >
                {/* Animated paper airplane */}
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2"
                  animate={{ x: [0, '100%', 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Paper airplane SVG */}
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                    <path d="M1 1L8 6L15 1" stroke="${C.brightGreen}" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6L4 9L8 12L12 9L8 6Z" fill="${C.brightGreen}" opacity="0.7"/>
                  </svg>
            </motion.div>
                {/* Dotted path */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px]" style={{
                  backgroundImage: 'radial-gradient(circle at 0px 0px, ${C.brightGreen} 1px, transparent 1px)',
                  backgroundSize: '8px 100%',
                  backgroundRepeat: 'repeat-x'
                }} />
              </motion.div>
              <div className="h-px w-16" style={{ background: `${C.brightGreen}50` }} />
            </motion.div>

            <motion.div variants={fadeUp}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(0.8rem, 1.2vw, 0.95rem)", color: C.cream, opacity: 0.6, maxWidth: 540, lineHeight: 1.8 }}>
                {t('landing.heroDescription')}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-5 mt-4">
              <Link
                to="/browse"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.04] active:scale-[0.97]"
                style={{ background: C.orange, color: C.cream, fontFamily: "'DM Sans', sans-serif" }}
              >
                <span>{t('landing.exploreDestinations')}</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex"
                >
                  <ArrowRight size={16} />
                </motion.span>
              </Link>
              <Link
                to="/register"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.04] active:scale-[0.97] hover:bg-white/15"
                style={{ background: `${C.cream}08`, color: C.cream, border: `1px solid ${C.cream}25`, fontFamily: "'DM Sans', sans-serif" }}
              >
                <span>{t('landing.startPlanning')}</span>
                <Compass size={16} className="transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-4 mt-4 flex-wrap justify-center">
              {[t('nav.destinations'), "→", t('nav.services'), "→", t('nav.trips'), "→", "Explore"].map((item, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: i % 2 === 0 ? "'Fraunces', serif" : "'DM Sans', sans-serif",
                    fontSize: i % 2 === 0 ? "0.85rem" : "1rem",
                    color: i % 2 === 0 ? C.cream : C.orange,
                    fontWeight: i % 2 === 0 ? 600 : 400,
                    opacity: i % 2 === 0 ? 0.7 : 0.5,
                  }}
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Smooth transition: dark → cream */}
      <SmoothDivider from={C.darkGreen} to={C.cream} />

      {/* ──────────────── FEATURES ──────────────── */}
      <section className="relative py-32 px-6 sm:px-12 lg:px-20" style={{ background: C.cream }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="max-w-6xl mx-auto">
          <SectionHeading
            label={t('landing.platformCapabilities')}
            title={t('landing.everythingYouNeed')}
            subtitle={t('landing.capabilitiesSubtitle')}
          />

          <div className="grid sm:grid-cols-2 gap-6 mt-16">
            {[
              {
                icon: <Map size={22} />,
                title: t('landing.featureDiscovery'),
                desc: t('landing.featureDiscoveryDesc'),
                accent: C.orange,
              },
              {
                icon: <CalendarCheck size={22} />,
                title: t('landing.featureBooking'),
                desc: t('landing.featureBookingDesc'),
                accent: C.brightGreen,
              },
              {
                icon: <Route size={22} />,
                title: t('landing.featureTripPlanning'),
                desc: t('landing.featureTripPlanningDesc'),
                accent: "#5AB8A0",
              },
              {
                icon: <Users size={22} />,
                title: t('landing.featureCommunity'),
                desc: t('landing.featureCommunityDesc'),
                accent: "#C8A040",
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="group rounded-2xl p-7 sm:p-8 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: `${C.darkGreen}07`,
                  border: `1px solid ${C.darkGreen}12`,
                  transitionProperty: "transform, box-shadow, border-color",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${f.accent}20`, color: f.accent }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.05rem", color: f.accent }}>
                  {f.title}
                </h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: C.darkGreen, opacity: 0.6, lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Smooth transition: cream → dark */}
      <SmoothDivider from={C.cream} to={C.darkGreen} />

      {/* ──────────────── DESTINATIONS PREVIEW ──────────────── */}
      <section className="relative py-32 px-6 sm:px-12 lg:px-20 overflow-hidden" style={{ background: C.darkGreen }}>
        <motion.div
          className="absolute right-[-80px] top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.04]"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        >
          <CompassSVG size={500} color={C.cream} sw={1.5} />
        </motion.div>

        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${C.medGreen}50 0%, transparent 70%)` }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${C.brightGreen}, ${C.orange})` }} />

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <SectionHeading
              label={t('landing.featuredDestinations')}
              title={t('landing.exploreFinest')}
              color={C.cream}
            />
            <motion.div variants={fadeUp}>
              <Link
                to="/browse"
                className="group inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-3"
                style={{ fontFamily: "'DM Sans', sans-serif", color: C.orange }}
              >
                {t('landing.browseAll')}
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex"
                >
                  <ArrowRight size={15} />
                </motion.span>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {destinationsLoading
              ? [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: `${C.cream}08`, border: `1px solid ${C.cream}12` }}>
                    <div className="h-40 sm:h-48 bg-gray-700" />
                    <div className="p-4 sm:p-5 space-y-3">
                      <div className="h-4 bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-700 rounded w-1/2" />
                      <div className="h-3 bg-gray-700 rounded w-1/3" />
                    </div>
                  </div>
                ))
              : destinations.slice(0, 8).map((d) => (
                  <LandingDestinationCard
                    key={d.id}
                    destination={d}
                    onClick={() => setSelectedDestination(d)}
                  />
                ))}
          </div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex items-center gap-3.5 px-6 py-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: `${C.brightGreen}10`, border: `1px solid ${C.brightGreen}25` }}
          >
            <Search size={16} color={C.brightGreen} className="shrink-0" />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: C.cream, opacity: 0.75 }}>
              {t('landing.filterBy')}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Smooth transition: dark → cream */}
      <SmoothDivider from={C.darkGreen} to={C.cream} />

      {/* ──────────────── SERVICES RIBBON ──────────────── */}
      <section className="relative py-32 overflow-hidden" style={{ background: C.cream }}>
        <div className="px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto mb-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
            <div className="flex items-end justify-between flex-wrap gap-6">
              <SectionHeading
                label={t('nav.services')}
                title={t('landing.ourServices')}
                subtitle={t('landing.servicesSubtitle')}
              />
              <motion.div variants={fadeUp}>
                <Link
                  to="/services"
                  className="group inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-3"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: C.orange }}
                >
                  {t('landing.viewAllServices')}
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-flex"
                  >
                    <ArrowRight size={15} />
                  </motion.span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Edge-to-edge marquee ribbon */}
        <div className="relative w-full" style={{ maskImage: 'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)' }}>
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee-track {
              display: flex;
              width: max-content;
              animation: marquee 40s linear infinite;
            }
            .marquee-track > * {
              flex-shrink: 0;
            }
            .marquee-track:hover {
              animation-play-state: paused;
            }
          `}</style>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="flex"
          >
            {servicesLoading ? (
              <div className="flex gap-4 px-6 sm:px-12 lg:px-20">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="flex-shrink-0 w-48 h-48 rounded-2xl bg-gray-200 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="marquee-track">
                {[...services, ...services].map((s, idx) => (
                  <Link
                    key={`${s.id}-${idx}`}
                    to="/services"
                    className="flex-shrink-0 w-48 h-48 rounded-2xl overflow-hidden group relative block transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg"
                  >
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { (e.target as HTMLImageElement).src = bannerImg; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white text-sm font-semibold">{s.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Smooth transition: cream → dark */}
      <SmoothDivider from={C.cream} to={C.darkGreen} />

      {/* ──────────────── TRIPS ──────────────── */}
      <section className="relative py-32 px-6 sm:px-12 lg:px-20 overflow-hidden" style={{ background: C.darkGreen }}>
        <motion.div
          className="absolute left-[-60px] top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03]"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
        >
          <CompassSVG size={400} color={C.cream} sw={1.5} />
        </motion.div>

        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${C.medGreen}50 0%, transparent 70%)` }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.brightGreen})` }} />

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <SectionHeading
              label={t('nav.trips')}
              title={t('landing.exploreTrips')}
              subtitle={t('landing.tripsSubtitle')}
              color={C.cream}
            />
            <motion.div variants={fadeUp}>
              <Link
                to="/trips"
                className="group inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-3"
                style={{ fontFamily: "'DM Sans', sans-serif", color: C.orange }}
              >
                {t('landing.viewAllTrips')}
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex"
                >
                  <ArrowRight size={15} />
                </motion.span>
              </Link>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="mt-12">
            {tripsLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: `${C.cream}08`, border: `1px solid ${C.cream}12` }}>
                    <div className="h-36 bg-gray-700" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-700 rounded w-1/2" />
                      <div className="h-3 bg-gray-700 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
             ) : trips.length > 0 ? (
               <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                 {trips
                   // Filter out draft trips (consistent with BrowseTrips)
                   .filter((trip) => {
                     const status = String((trip as any).status || "").toLowerCase();
                     return status !== "draft";
                   })
                   .map((trip) => (
                     <Link
                       key={trip.id}
                       to={`/trips/${trip.id}`}
                       className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                       style={{ background: `${C.cream}08`, border: `1px solid ${C.cream}12` }}
                     >
                    <div className="relative h-36 overflow-hidden bg-gray-800">
                      {trip.images && trip.images.length > 0 ? (
                        <img
                          src={trip.images[0]}
                          alt={trip.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Route className="size-8" style={{ color: `${C.cream}30` }} />
                        </div>
                      )}
                      {trip.difficulty && (
                        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400">
                          {trip.difficulty.charAt(0).toUpperCase() + trip.difficulty.slice(1)}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-2 line-clamp-1" style={{ fontFamily: "'Fraunces', serif", color: C.cream }}>
                        {trip.title}
                      </h3>
                       <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: C.cream, opacity: 0.45 }}>
                         <CalendarCheck size={12} />
                         <span>
                           {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : null}
                         </span>
                         {trip.meeting_point && (
                           <span className="ml-2">
                             <MapPin size={10} /> {trip.meeting_point}
                           </span>
                         )}
                       </div>
                       <div className="flex items-center justify-between text-xs">
                         <span className="font-bold" style={{ color: C.orange }}>
                           {formatPrice(trip.price)}
                         </span>
                         {trip.max_participants && (
                           <span style={{ color: C.cream, opacity: 0.4 }}>
                             <Users size={11} className="inline mr-0.5" />
                             {trip.current_participants ?? 0}/{trip.max_participants}
                           </span>
                         )}
                       </div>
                       <div className="mt-3">
                         <Link
                           to={`/join-trip/${trip.id}`}
                           className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[${C.orange}] text-[${C.cream}] text-sm font-semibold rounded-lg hover:bg-[${C.orange}]/90 transition-colors"
                         >
                           Join Trip
                           <ArrowRight size={16} className="ml-2" />
                         </Link>
                       </div>
                     </div>
                   </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 text-sm" style={{ color: C.cream, opacity: 0.4 }}>
                <Route size={24} className="mr-2" />
                No trips available yet
              </div>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Smooth transition: dark → cream */}
      <SmoothDivider from={C.darkGreen} to={C.cream} />

      {/* ──────────────── FOR PROFESSIONALS ──────────────── */}
      <section className="relative py-32 px-6 sm:px-12 lg:px-20" style={{ background: C.cream }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="max-w-6xl mx-auto">
          <SectionHeading
            label={t('landing.forProfessionals')}
            title={t('landing.growBusiness')}
            subtitle={t('landing.professionalsSubtitle')}
          />

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <motion.div
              variants={fadeUp}
              className="group rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-1"
              style={{ background: C.darkGreen }}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: C.orange }}>
                  <Briefcase size={18} color={C.cream} />
                </div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.1rem", color: C.cream }}>
                  {t('landing.agenciesGuides')}
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { t: t('landing.digitalStorefront'), d: t('landing.digitalStorefrontDesc') },
                  { t: t('landing.bookingManagement'), d: t('landing.bookingManagementDesc') },
                  { t: t('landing.analyticsDashboard'), d: t('landing.analyticsDashboardDesc') },
                ].map((item) => (
                  <div key={item.t} className="flex gap-3.5 group/item">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-[6px]" style={{ background: C.brightGreen }} />
                    <div>
                      <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "0.88rem", color: C.cream }}>{item.t}</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.76rem", color: C.cream, opacity: 0.52, marginTop: 3, lineHeight: 1.5 }}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="group rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-1"
              style={{ background: `${C.orange}10`, border: `1px solid ${C.orange}28` }}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: C.darkGreen }}>
                  <Building2 size={18} color={C.cream} />
                </div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.1rem", color: C.darkGreen }}>
                  {t('landing.serviceProviders')}
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { t: t('landing.listServices'), d: t('landing.listServicesDesc') },
                  { t: t('landing.clientManagement'), d: t('landing.clientManagementDesc') },
                  { t: t('landing.roleBasedAccess'), d: t('landing.roleBasedAccessDesc') },
                ].map((item) => (
                  <div key={item.t} className="flex gap-3.5 group/item">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-[6px]" style={{ background: C.orange }} />
                    <div>
                      <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "0.88rem", color: C.darkGreen }}>{item.t}</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.76rem", color: C.darkGreen, opacity: 0.58, marginTop: 3, lineHeight: 1.5 }}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={fadeUp}
            className="mt-12 flex items-center gap-3.5 px-6 py-4.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: `${C.brightGreen}08`, border: `1px solid ${C.brightGreen}18` }}
          >
            <TrendingUp size={16} color={C.brightGreen} className="shrink-0" />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: C.darkGreen, opacity: 0.65 }}>
              {t('landing.businessPlatform')}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Smooth transition: cream → dark */}
      <SmoothDivider from={C.cream} to={C.darkGreen} />

      {/* ──────────────── CTA ──────────────── */}
      <section className="relative py-32 px-6 sm:px-12 lg:px-20 overflow-hidden" style={{ background: C.darkGreen }}>
        {/* Full-width top HR */}
        <div className="absolute left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.brightGreen})` }} />

        {/* Rotating Logo_Min between the HRs */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        >
          <img src={logoMin} alt="" className="w-80 h-80 sm:w-96 sm:h-96 opacity-[0.06]" />
        </motion.div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${C.medGreen}50 0%, transparent 70%)` }} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-8"
        >
          <motion.div variants={scaleIn}>
            <img src={logoAlt} alt="Hawes" className="h-12 w-auto" />
          </motion.div>

          <motion.div variants={fadeUpStrong}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 900, color: C.orange, lineHeight: 1.05 }}>
              {t('landing.readyToExplore')}
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: C.cream, opacity: 0.6, marginTop: 14, maxWidth: 480, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
              {t('landing.ctaDescription')}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-5 mt-2">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.04] active:scale-[0.97]"
              style={{ background: C.orange, color: C.cream, fontFamily: "'DM Sans', sans-serif" }}
            >
              <span>{t('landing.joinAsTraveler')}</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex"
              >
                <ArrowRight size={16} />
              </motion.span>
            </Link>
            <Link
              to="/register"
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.04] active:scale-[0.97] hover:bg-white/15"
              style={{ background: `${C.cream}08`, color: C.cream, border: `1px solid ${C.cream}20`, fontFamily: "'DM Sans', sans-serif" }}
            >
              <span>{t('landing.listYourServices')}</span>
              <Building2 size={16} className="transition-transform duration-300 group-hover:scale-110" />
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-3 px-6 py-3.5 rounded-full transition-all duration-300 hover:bg-white/10" style={{ background: `${C.cream}06`, border: `1px solid ${C.cream}10` }}>
            <CompassSVG size={16} color={C.brightGreen} sw={1.5} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: C.cream, opacity: 0.5 }}>
              {t('landing.alreadyHaveAccount')} <Link to="/login" className="font-semibold underline underline-offset-2 transition-all duration-200 hover:opacity-80" style={{ color: C.brightGreen }}>{t('landing.signIn')}</Link>
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Destination Modal */}
      {selectedDestination && (
        <DestinationModal
          destination={selectedDestination}
          isSaved={false}
          onToggleSave={() => {}}
          onClose={() => setSelectedDestination(null)}
        />
      )}
    </div>
  );
}
