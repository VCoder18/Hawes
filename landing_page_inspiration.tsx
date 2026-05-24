import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Map, Users, Briefcase, TrendingUp, Bot, CreditCard, Languages, Smartphone, Star, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ─── Brand palette ────────────────────────────────────────────────────────────
const C = {
  cream: "#FEFDE8",
  orange: "#E85500",
  darkGreen: "#0D1F09",
  medGreen: "#163B0C",
  brightGreen: "#00A800",
};

// ─── Compass SVG ──────────────────────────────────────────────────────────────
function CompassSVG({
  size = 40,
  color = C.brightGreen,
  sw = 1.5,
}: {
  size?: number;
  color?: string;
  sw?: number;
}) {
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

// ─── Hawes wordmark ───────────────────────────────────────────────────────────
function HawesLogo({
  size = 40,
  textColor = C.darkGreen,
  compassColor = C.brightGreen,
}: {
  size?: number;
  textColor?: string;
  compassColor?: string;
}) {
  return (
    <div className="flex items-center" style={{ gap: size * 0.07 }}>
      <span
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 800,
          fontSize: size,
          color: textColor,
          letterSpacing: "0.02em",
          lineHeight: 1,
        }}
      >
        HAW
      </span>
      <CompassSVG size={size * 1.05} color={compassColor} sw={size * 0.038} />
      <span
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 800,
          fontSize: size,
          color: textColor,
          letterSpacing: "0.02em",
          lineHeight: 1,
        }}
      >
        ES
      </span>
    </div>
  );
}

// ─── Shared slide wrapper ─────────────────────────────────────────────────────
function Slide({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: bg }}>
      {children}
    </div>
  );
}

// ─── Gradient top bar ─────────────────────────────────────────────────────────
function TopBar({ from = C.orange, to = C.brightGreen }: { from?: string; to?: string }) {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-[3px] z-10"
      style={{ background: `linear-gradient(90deg, ${from}, ${to})` }}
    />
  );
}

// ─── SLIDE 1: Cover ───────────────────────────────────────────────────────────
function CoverSlide() {
  return (
    <Slide bg={C.darkGreen}>
      <TopBar />
      {/* Giant background compass */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
        <CompassSVG size={680} color={C.cream} sw={2} />
      </div>
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${C.medGreen}60 0%, transparent 70%)`,
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8">
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: C.orange,
            fontSize: "0.65rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
          }}
        >
          Multidisciplinary Project · 2025 – 2026
        </div>

        <HawesLogo size={58} textColor={C.cream} compassColor={C.brightGreen} />

        <div className="text-center mt-1">
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1rem",
              color: C.cream,
              opacity: 0.7,
              fontWeight: 300,
            }}
          >
            Digital Travel Platform for
          </div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "3.8rem",
              fontWeight: 900,
              color: C.orange,
              letterSpacing: "0.1em",
              lineHeight: 1,
            }}
          >
            ALGERIA
          </div>
        </div>

        <div className="flex items-center gap-4 my-1">
          <div className="h-px w-16" style={{ background: `${C.brightGreen}50` }} />
          <CompassSVG size={18} color={C.brightGreen} sw={1.5} />
          <div className="h-px w-16" style={{ background: `${C.brightGreen}50` }} />
        </div>

        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.68rem",
            color: C.cream,
            opacity: 0.4,
            textAlign: "center",
            maxWidth: 440,
            lineHeight: 1.6,
          }}
        >
          Higher School of Computer and Digital Sciences and Technologies
        </div>

        <div className="grid grid-cols-3 gap-x-10 gap-y-2.5 mt-3">
          {[
            "Badreddine SAIDANI",
            "Mohammed Anis KOUA",
            "Sonia KHEREDDINE",
            "Ikram SADOK",
            "Ines Malika BESSAM",
            "Damia AHMED SAID",
          ].map((name) => (
            <div
              key={name}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.78rem",
                color: C.cream,
                opacity: 0.72,
                textAlign: "center",
              }}
            >
              {name}
            </div>
          ))}
        </div>

        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.7rem",
            color: C.brightGreen,
            opacity: 0.85,
            marginTop: 6,
          }}
        >
          Supervisor: Bellal HAFHOUF
        </div>
      </div>
    </Slide>
  );
}

// ─── SLIDE 2: Agenda ──────────────────────────────────────────────────────────
function AgendaSlide() {
  const chapters = [
    { num: "01", title: "Overview of Hawes", sub: "Context, problem statement & objectives" },
    { num: "02", title: "System Analysis", sub: "Target users, requirements & use cases" },
    { num: "03", title: "System Design", sub: "Architecture, diagrams & data models" },
    { num: "04", title: "Implementation & Testing", sub: "Tech stack, features & validation results" },
    { num: "05", title: "Conclusions & Future Work", sub: "Key achievements & roadmap ahead" },
  ];

  return (
    <Slide bg={C.cream}>
      <TopBar from={C.orange} to={C.orange} />
      <div className="absolute inset-0 flex">
        {/* Dark left panel */}
        <div
          className="flex flex-col justify-between py-12 px-10 w-[280px] shrink-0"
          style={{ background: C.darkGreen }}
        >
          <div>
            <HawesLogo size={22} textColor={C.cream} compassColor={C.brightGreen} />
            <div className="mt-10">
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "2.6rem",
                  fontWeight: 900,
                  color: C.cream,
                  lineHeight: 1.05,
                }}
              >
                AGENDA
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.62rem",
                  color: C.cream,
                  opacity: 0.38,
                  letterSpacing: "0.18em",
                  marginTop: 8,
                  textTransform: "uppercase",
                }}
              >
                Presentation Outline
              </div>
            </div>
          </div>
          <div className="opacity-10">
            <CompassSVG size={100} color={C.brightGreen} sw={1.5} />
          </div>
        </div>

        {/* Chapter list */}
        <div className="flex flex-col justify-center flex-1 px-14 gap-5">
          {chapters.map((ch, i) => (
            <div key={ch.num} className="flex items-start gap-5">
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: C.orange,
                  opacity: 0.2 + 0.16 * i,
                  lineHeight: 1,
                  minWidth: 36,
                  marginTop: 2,
                }}
              >
                {ch.num}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    color: C.darkGreen,
                  }}
                >
                  {ch.title}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.78rem",
                    color: C.darkGreen,
                    opacity: 0.5,
                    marginTop: 2,
                  }}
                >
                  {ch.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// ─── SLIDE 3: Algeria Context ─────────────────────────────────────────────────
function ContextSlide() {
  const gems = [
    { emoji: "🌊", label: "Mediterranean Coast", desc: "Turquoise beaches & coastal towns" },
    { emoji: "⛰️", label: "Atlas Mountains", desc: "Lush forests & trekking trails" },
    { emoji: "🏜️", label: "Sahara Desert", desc: "Golden dunes & oasis villages" },
    { emoji: "🏛️", label: "Roman Heritage", desc: "Timgad, Djémila, Tipaza" },
  ];

  return (
    <Slide bg={C.cream}>
      <TopBar from={C.brightGreen} to={C.brightGreen} />
      <div className="absolute inset-0 flex flex-col justify-center px-16 gap-6">
        <div className="flex items-end gap-3 flex-wrap">
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "3.2rem",
              fontWeight: 800,
              color: C.darkGreen,
              lineHeight: 1,
            }}
          >
            {"Algeria's"}
          </div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "3.2rem",
              fontWeight: 300,
              fontStyle: "italic",
              color: C.orange,
              lineHeight: 1,
            }}
          >
            Hidden Wealth
          </div>
        </div>

        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.92rem",
            color: C.darkGreen,
            opacity: 0.68,
            maxWidth: 660,
            lineHeight: 1.75,
          }}
        >
          Algeria is the <strong>largest country in Africa</strong>, blessed with remarkable geographical and
          cultural diversity — yet remains one of the world's most underleveraged tourism destinations. Digital
          visibility for hidden gems is minimal, and logistical burdens on travelers remain high.
        </div>

        <div className="grid grid-cols-4 gap-4">
          {gems.map((g) => (
            <div key={g.label} className="rounded-2xl p-5 flex flex-col gap-2.5" style={{ background: C.darkGreen }}>
              <div className="text-3xl">{g.emoji}</div>
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  color: C.cream,
                }}
              >
                {g.label}
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.74rem",
                  color: C.cream,
                  opacity: 0.55,
                  lineHeight: 1.4,
                }}
              >
                {g.desc}
              </div>
            </div>
          ))}
        </div>

        <div className="border-l-[3px] pl-5" style={{ borderColor: C.orange }}>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontStyle: "italic",
              fontSize: "0.98rem",
              color: C.darkGreen,
              opacity: 0.7,
              lineHeight: 1.6,
            }}
          >
            "Planning a trip in Algeria historically required navigating unintegrated social media pages, making
            phone calls for bookings, and relying on word-of-mouth for guide verification."
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ─── SLIDE 4: Problem ─────────────────────────────────────────────────────────
function ProblemSlide() {
  const problems = [
    {
      emoji: "📱",
      title: "Scattered Discovery",
      desc: "Destinations fragmented across Instagram, Facebook, and unverified social media with no central hub",
    },
    {
      emoji: "📞",
      title: "Offline Bookings",
      desc: "Transport, guides, and accommodation booked via phone calls — zero transparency or digital trail",
    },
    {
      emoji: "🤝",
      title: "No Community",
      desc: "No platform for travelers to share safety tips, reviews, or find companions for remote group trips",
    },
    {
      emoji: "🏪",
      title: "Invisible Providers",
      desc: "Local guides and guesthouses lack a dedicated professional platform to reach their target audience",
    },
  ];

  return (
    <Slide bg={C.cream}>
      <TopBar from={C.orange} to={C.orange} />
      <div className="absolute inset-0 flex flex-col justify-center px-16 gap-6">
        <div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.3em",
              color: C.orange,
              textTransform: "uppercase",
            }}
          >
            Chapter 01 · Problem Statement
          </div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "3rem",
              fontWeight: 900,
              color: C.darkGreen,
              lineHeight: 1.05,
              marginTop: 6,
            }}
          >
            The Planning Gap
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
              color: C.darkGreen,
              opacity: 0.62,
              maxWidth: 560,
              marginTop: 10,
              lineHeight: 1.7,
            }}
          >
            A traveler discovers a spot on Instagram, searches for a guide on Facebook, and handles payments via
            phone. This lack of integration creates high friction for travelers and missed revenue for local businesses.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {problems.map((p) => (
            <div
              key={p.title}
              className="flex gap-4 rounded-xl p-5"
              style={{
                background: `${C.darkGreen}07`,
                border: `1px solid ${C.darkGreen}12`,
              }}
            >
              <div className="text-3xl shrink-0 mt-0.5">{p.emoji}</div>
              <div>
                <div
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: C.darkGreen,
                  }}
                >
                  {p.title}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.78rem",
                    color: C.darkGreen,
                    opacity: 0.58,
                    marginTop: 4,
                    lineHeight: 1.55,
                  }}
                >
                  {p.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// ─── SLIDE 5: Solution ────────────────────────────────────────────────────────
function SolutionSlide() {
  const pillars = [
    { icon: <Map size={18} />, label: "Discovery", desc: "GIS-mapped destinations & rich media content", accent: C.orange },
    { icon: <Briefcase size={18} />, label: "Transaction", desc: "Secure booking flows for all tourism services", accent: C.brightGreen },
    { icon: <Users size={18} />, label: "Social", desc: "Profiles, forums & traveler matching", accent: "#5AB8A0" },
    { icon: <TrendingUp size={18} />, label: "Management", desc: "Provider dashboard, analytics & revenue tracking", accent: "#C8A040" },
  ];

  return (
    <Slide bg={C.darkGreen}>
      <TopBar from={C.brightGreen} to={C.orange} />
      {/* Background compass */}
      <div
        className="absolute right-[-80px] top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.05]"
      >
        <CompassSVG size={560} color={C.cream} sw={1.5} />
      </div>

      <div className="absolute inset-0 flex flex-col justify-center px-16 gap-6">
        <div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.3em",
              color: C.brightGreen,
              textTransform: "uppercase",
            }}
          >
            Our Answer to the Problem
          </div>
          <div className="flex items-baseline gap-4 mt-3 flex-wrap">
            <HawesLogo size={42} textColor={C.cream} compassColor={C.brightGreen} />
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1.8rem",
                fontWeight: 300,
                fontStyle: "italic",
                color: C.cream,
                opacity: 0.65,
              }}
            >
              — A Smart Travel Ecosystem
            </div>
          </div>
        </div>

        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.9rem",
            color: C.cream,
            opacity: 0.68,
            maxWidth: 620,
            lineHeight: 1.75,
          }}
        >
          Hawes consolidates the entire travel lifecycle into one unified, trusted platform — connecting
          travelers with transportation, accommodation, local guides, and a community of fellow explorers.
        </div>

        <div className="grid grid-cols-4 gap-4">
          {pillars.map((p) => (
            <div
              key={p.label}
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ background: `${C.cream}06`, border: `1px solid ${C.cream}10` }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${p.accent}25`, color: p.accent }}
              >
                {p.icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: p.accent,
                  }}
                >
                  {p.label}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.76rem",
                    color: C.cream,
                    opacity: 0.5,
                    marginTop: 4,
                    lineHeight: 1.5,
                  }}
                >
                  {p.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Discovery-to-Transaction flow */}
        <div className="flex items-center gap-3">
          {["Discover", "→", "Book", "→", "Connect", "→", "Explore"].map((item, i) => (
            <div
              key={i}
              style={{
                fontFamily: i % 2 === 0 ? "'Fraunces', serif" : "'DM Sans', sans-serif",
                fontSize: i % 2 === 0 ? "0.95rem" : "1.1rem",
                color: i % 2 === 0 ? C.cream : C.orange,
                fontWeight: i % 2 === 0 ? 600 : 400,
                opacity: i % 2 === 0 ? 0.8 : 0.6,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// ─── SLIDE 6: Key Objectives ──────────────────────────────────────────────────
function ObjectivesSlide() {
  const objectives = [
    {
      num: "01",
      title: "Centralization of Services",
      desc: "One-stop shop for discovering destinations and booking accommodation, transport, dining, and guides",
    },
    {
      num: "02",
      title: "Promote Local Tourism",
      desc: "Highlight underrated spots and support economic growth of local communities across Algeria",
    },
    {
      num: "03",
      title: "Social Connectivity",
      desc: "Enable users to connect, share reviews, and find companions for group adventures",
    },
    {
      num: "04",
      title: "Provider Empowerment",
      desc: "Give agencies and independent guides a digital storefront to manage trips efficiently",
    },
    {
      num: "05",
      title: "Simplification",
      desc: "Reduce trip planning from days of effort to minutes with one unified interface",
    },
  ];

  return (
    <Slide bg={C.cream}>
      <TopBar from={C.brightGreen} to={C.brightGreen} />
      <div className="absolute inset-0 flex">
        {/* Left column */}
        <div className="flex flex-col justify-between py-12 pl-12 pr-6 w-[240px] shrink-0">
          <HawesLogo size={20} textColor={C.darkGreen} compassColor={C.brightGreen} />
          <div>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "2.8rem",
                fontWeight: 900,
                color: C.darkGreen,
                lineHeight: 1.0,
              }}
            >
              KEY
              <br />
              OBJEC-
              <br />
              TIVES
            </div>
            <div className="mt-4 w-8 h-[3px]" style={{ background: C.orange }} />
          </div>
          <div className="opacity-[0.07]">
            <CompassSVG size={90} color={C.darkGreen} sw={1.5} />
          </div>
        </div>

        {/* Objectives */}
        <div className="flex flex-col justify-center flex-1 pr-14 gap-4">
          {objectives.map((obj) => (
            <div key={obj.num} className="flex gap-5 items-start">
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color: C.orange,
                  opacity: 0.75,
                  lineHeight: 1,
                  minWidth: 34,
                  marginTop: 1,
                }}
              >
                {obj.num}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: C.darkGreen,
                  }}
                >
                  {obj.title}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.78rem",
                    color: C.darkGreen,
                    opacity: 0.55,
                    marginTop: 3,
                    lineHeight: 1.5,
                  }}
                >
                  {obj.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// ─── SLIDE 7: Target Users ────────────────────────────────────────────────────
function UsersSlide() {
  return (
    <Slide bg={C.cream}>
      <TopBar from={C.orange} to={C.orange} />
      <div className="absolute inset-0 flex flex-col justify-center px-16 gap-6">
        <div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.3em",
              color: C.orange,
              textTransform: "uppercase",
            }}
          >
            Chapter 02 · Target Users
          </div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "2.8rem",
              fontWeight: 900,
              color: C.darkGreen,
              lineHeight: 1,
              marginTop: 6,
            }}
          >
            Who Is Hawes For?
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Travelers */}
          <div className="rounded-2xl p-7" style={{ background: C.darkGreen }}>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: C.orange }}
              >
                <Users size={18} color={C.cream} />
              </div>
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 700,
                  fontSize: "1.15rem",
                  color: C.cream,
                }}
              >
                Travelers
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { t: "Information Seekers", d: 'Verified details on "hidden gems" and cultural landmarks' },
                { t: "Planners", d: "Minimize friction by booking transport and stay in one place" },
                { t: "Social Explorers", d: "Build travel profiles, share reviews, find group companions" },
              ].map((item) => (
                <div key={item.t} className="flex gap-3">
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0 mt-[5px]"
                    style={{ background: C.brightGreen }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontWeight: 600,
                        fontSize: "0.88rem",
                        color: C.cream,
                      }}
                    >
                      {item.t}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.76rem",
                        color: C.cream,
                        opacity: 0.52,
                        marginTop: 2,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.d}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Organizers */}
          <div
            className="rounded-2xl p-7"
            style={{
              background: `${C.orange}10`,
              border: `1px solid ${C.orange}28`,
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: C.darkGreen }}
              >
                <Briefcase size={18} color={C.cream} />
              </div>
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 700,
                  fontSize: "1.15rem",
                  color: C.darkGreen,
                }}
              >
                Tourism Professionals
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { t: "Travel Agencies", d: "Digitize booking process, reach younger tech-savvy demographics" },
                { t: "Independent Guides", d: "Verified locals offering specialized cultural or mountain tours" },
                {
                  t: "Service Providers",
                  d: "Guesthouses (Dar Diafa), eco-lodges, restaurants & transport fleets",
                },
              ].map((item) => (
                <div key={item.t} className="flex gap-3">
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0 mt-[5px]"
                    style={{ background: C.orange }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontWeight: 600,
                        fontSize: "0.88rem",
                        color: C.darkGreen,
                      }}
                    >
                      {item.t}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.76rem",
                        color: C.darkGreen,
                        opacity: 0.58,
                        marginTop: 2,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.d}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ─── SLIDE 8: Architecture ────────────────────────────────────────────────────
function ArchitectureSlide() {
  return (
    <Slide bg={C.darkGreen}>
      <TopBar from={C.brightGreen} to={C.brightGreen} />
      <div className="absolute inset-0 flex flex-col justify-center px-16 gap-5">
        <div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.3em",
              color: C.brightGreen,
              textTransform: "uppercase",
            }}
          >
            Chapter 03 · System Design
          </div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "2.8rem",
              fontWeight: 900,
              color: C.cream,
              lineHeight: 1,
              marginTop: 6,
            }}
          >
            Three-Tier Architecture
          </div>
        </div>

        {/* Tier diagram */}
        <div className="flex items-stretch gap-3 mt-2">
          {/* Frontend */}
          <div
            className="flex-1 rounded-2xl p-6 flex flex-col gap-3"
            style={{ background: `${C.orange}18`, border: `1px solid ${C.orange}35` }}
          >
            <div className="text-2xl">🖥️</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1rem", color: C.orange }}>
              Frontend
            </div>
            <div className="flex flex-col gap-1.5">
              {["React.js + TypeScript", "Tailwind CSS + ShadCN", "Vite — fast builds"].map((t) => (
                <div
                  key={t}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: C.cream, opacity: 0.6 }}
                >
                  · {t}
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center justify-center gap-1.5 w-14 shrink-0">
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.56rem",
                color: C.cream,
                opacity: 0.35,
                textAlign: "center",
              }}
            >
              REST
            </div>
            <div style={{ color: `${C.cream}40`, fontSize: "1.4rem" }}>⇄</div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.56rem",
                color: C.cream,
                opacity: 0.35,
                textAlign: "center",
              }}
            >
              WS
            </div>
          </div>

          {/* Backend */}
          <div
            className="flex-1 rounded-2xl p-6 flex flex-col gap-3"
            style={{ background: `${C.brightGreen}12`, border: `1px solid ${C.brightGreen}28` }}
          >
            <div className="text-2xl">⚙️</div>
            <div
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1rem", color: C.brightGreen }}
            >
              Backend
            </div>
            <div className="flex flex-col gap-1.5">
              {["NestJS Framework", "RESTful API + WebSocket", "Prisma ORM"].map((t) => (
                <div
                  key={t}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: C.cream, opacity: 0.6 }}
                >
                  · {t}
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center justify-center gap-1.5 w-14 shrink-0">
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.56rem",
                color: C.cream,
                opacity: 0.35,
                textAlign: "center",
              }}
            >
              SQL
            </div>
            <div style={{ color: `${C.cream}40`, fontSize: "1.4rem" }}>⇄</div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.56rem",
                color: C.cream,
                opacity: 0.35,
                textAlign: "center",
              }}
            >
              RLS
            </div>
          </div>

          {/* Database */}
          <div
            className="flex-1 rounded-2xl p-6 flex flex-col gap-3"
            style={{ background: `${C.cream}06`, border: `1px solid ${C.cream}12` }}
          >
            <div className="text-2xl">🗄️</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1rem", color: C.cream }}>
              Database
            </div>
            <div className="flex flex-col gap-1.5">
              {["PostgreSQL via Supabase", "Row-Level Security", "Supabase S3 Storage"].map((t) => (
                <div
                  key={t}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: C.cream, opacity: 0.6 }}
                >
                  · {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data flow label */}
        <div
          className="rounded-xl px-5 py-3 flex items-center gap-4"
          style={{ background: `${C.cream}05`, border: `1px solid ${C.cream}08` }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.6rem",
              color: C.brightGreen,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Data Flow
          </span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.76rem",
              color: C.cream,
              opacity: 0.52,
            }}
          >
            User → React Frontend → NestJS REST API → Backend Services → PostgreSQL (Supabase)
          </span>
        </div>

        {/* NFR badges */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: "⚡", label: "Performance", val: "Vite + caching" },
            { icon: "🔒", label: "Security", val: "RLS + Supabase Auth" },
            { icon: "📈", label: "Scalability", val: "NestJS modules" },
            { icon: "🔄", label: "CI/CD", val: "Vercel + Render" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: `${C.cream}05` }}
            >
              <div>{item.icon}</div>
              <div>
                <div
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: C.cream,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.68rem",
                    color: C.cream,
                    opacity: 0.45,
                  }}
                >
                  {item.val}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// ─── SLIDE 9: Tech Stack ──────────────────────────────────────────────────────
function TechStackSlide() {
  const stack = [
    { name: "React.js", role: "Frontend UI framework", color: "#61DAFB", bg: "#001829" },
    { name: "NestJS", role: "Backend REST API", color: "#E0234E", bg: "#1A0010" },
    { name: "PostgreSQL", role: "Relational database", color: "#6EB1E3", bg: "#0A1525" },
    { name: "Supabase", role: "Auth + Storage + DB", color: "#3ECF8E", bg: "#0A2218" },
    { name: "Prisma", role: "Type-safe ORM", color: "#8B9CF8", bg: "#0A0A1F" },
    { name: "TypeScript", role: "Type safety", color: "#4A9EDD", bg: "#001020" },
    { name: "Figma", role: "UI/UX design & prototyping", color: "#F24E1E", bg: "#1A0800" },
    { name: "Jira + Discord", role: "SCRUM & communication", color: "#85A8FF", bg: "#080E20" },
  ];

  return (
    <Slide bg={C.cream}>
      <TopBar from={C.orange} to={C.orange} />
      <div className="absolute inset-0 flex flex-col justify-center px-16 gap-6">
        <div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.3em",
              color: C.orange,
              textTransform: "uppercase",
            }}
          >
            Chapter 04 · Technology Choices
          </div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "2.8rem",
              fontWeight: 900,
              color: C.darkGreen,
              lineHeight: 1,
              marginTop: 6,
            }}
          >
            PERN-Influenced Stack
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.88rem",
              color: C.darkGreen,
              opacity: 0.6,
              marginTop: 8,
              maxWidth: 560,
            }}
          >
            Chosen for performance, developer experience, community support, and alignment with modern cloud
            deployment practices.
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {stack.map((tech) => (
            <div key={tech.name} className="rounded-xl p-4 flex flex-col gap-2" style={{ background: tech.bg }}>
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: tech.color,
                }}
              >
                {tech.name}
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.73rem",
                  color: "#ffffff",
                  opacity: 0.5,
                  lineHeight: 1.4,
                }}
              >
                {tech.role}
              </div>
            </div>
          ))}
        </div>

        {/* SCRUM methodology */}
        <div
          className="rounded-xl px-5 py-4 flex items-center gap-4"
          style={{ background: `${C.darkGreen}08`, border: `1px solid ${C.darkGreen}12` }}
        >
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: C.darkGreen,
              whiteSpace: "nowrap",
            }}
          >
            SCRUM Methodology
          </div>
          <div className="w-px h-6" style={{ background: `${C.darkGreen}20` }} />
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8rem",
              color: C.darkGreen,
              opacity: 0.62,
            }}
          >
            Jira for sprint & backlog management · Discord for daily communication · Iterative delivery with
            CI/CD pipelines · Vercel (frontend) + Render (backend) deployment
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ─── SLIDE 10: Key Features ───────────────────────────────────────────────────
function FeaturesSlide() {
  const features = [
    {
      emoji: "🗺️",
      title: "Unified Discovery Engine",
      desc: "GIS-mapped destination database with high-quality media, weather insights, and geolocation-based recommendations for hidden gems across Algeria",
      color: C.orange,
    },
    {
      emoji: "📅",
      title: "Integrated Booking System",
      desc: "Reserve accommodation, mobility services (bus/private car), and professional guides — all in one seamless flow with real-time confirmation notifications",
      color: C.brightGreen,
    },
    {
      emoji: "👥",
      title: "Social & Community Hub",
      desc: 'User-generated travel forums and the "User Match" feature connecting travelers heading to the same destination for group adventures',
      color: "#5AB8A0",
    },
    {
      emoji: "📊",
      title: "Professional Dashboard",
      desc: "Organizers publish trips, manage reservations, track revenue, and view weekly booking trend charts — all from a dedicated management interface",
      color: "#C8A040",
    },
  ];

  return (
    <Slide bg={C.darkGreen}>
      <TopBar from={C.orange} to={C.brightGreen} />
      <div className="absolute inset-0 flex flex-col justify-center px-16 gap-6">
        <div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.3em",
              color: C.brightGreen,
              textTransform: "uppercase",
            }}
          >
            Implementation · Application Walkthrough
          </div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "2.8rem",
              fontWeight: 900,
              color: C.cream,
              lineHeight: 1,
              marginTop: 6,
            }}
          >
            What Hawes Delivers
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-6 flex flex-col gap-3"
              style={{ background: `${C.cream}06`, border: `1px solid ${C.cream}10` }}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{f.emoji}</div>
                <div
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: f.color,
                  }}
                >
                  {f.title}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.8rem",
                  color: C.cream,
                  opacity: 0.62,
                  lineHeight: 1.65,
                }}
              >
                {f.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Auth note */}
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-xl"
          style={{ background: `${C.orange}15`, border: `1px solid ${C.orange}28` }}
        >
          <div className="text-lg">🔑</div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8rem",
              color: C.cream,
              opacity: 0.75,
            }}
          >
            Role-based authentication (Supabase Auth) routes travelers, organizers, and administrators to
            their tailored dashboards. Real-time updates via WebSocket integration.
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ─── SLIDE 11: Future Works ───────────────────────────────────────────────────
function FutureSlide() {
  const items = [
    { icon: <Bot size={16} />, title: "AI Recommendation", desc: "Personalized travel suggestions using ML on Algerian tourism data" },
    { icon: <Map size={16} />, title: "Offline Maps", desc: "Downloadable maps for remote areas like Tassili N'Ajjer & Hoggar" },
    { icon: <CreditCard size={16} />, title: "Payment Gateway", desc: "Algerian-market-compliant online payment system" },
    { icon: <Languages size={16} />, title: "Multi-language", desc: "Arabic and French interfaces for domestic travelers" },
    { icon: <Smartphone size={16} />, title: "Mobile App", desc: "Native iOS & Android with GPS and push notifications" },
    { icon: <Star size={16} />, title: "Verified Reviews", desc: "Review validation tied to confirmed bookings" },
    { icon: <MessageSquare size={16} />, title: "Social Platform", desc: "Direct chat, posts, and community travel forums" },
  ];

  return (
    <Slide bg={C.cream}>
      <TopBar from={C.brightGreen} to={C.brightGreen} />
      <div className="absolute inset-0 flex flex-col justify-center px-16 gap-5">
        <div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.3em",
              color: C.brightGreen,
              textTransform: "uppercase",
            }}
          >
            Chapter 05 · Looking Ahead
          </div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "2.8rem",
              fontWeight: 900,
              color: C.darkGreen,
              lineHeight: 1,
              marginTop: 6,
            }}
          >
            Future Works
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem",
              color: C.darkGreen,
              opacity: 0.58,
              marginTop: 8,
            }}
          >
            Continuous research, user feedback, and emerging technology will ensure Hawes continues to grow.
          </div>
        </div>

        {/* First 4 items in dark cards */}
        <div className="grid grid-cols-4 gap-3">
          {items.slice(0, 4).map((item) => (
            <div key={item.title} className="rounded-xl p-4 flex flex-col gap-2.5" style={{ background: C.darkGreen }}>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${C.orange}28`, color: C.orange }}
              >
                {item.icon}
              </div>
              <div
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "0.85rem", color: C.cream }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.72rem",
                  color: C.cream,
                  opacity: 0.5,
                  lineHeight: 1.45,
                }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Last 3 items in lighter cards */}
        <div className="grid grid-cols-3 gap-3">
          {items.slice(4).map((item) => (
            <div
              key={item.title}
              className="rounded-xl p-4 flex flex-col gap-2.5"
              style={{ background: `${C.darkGreen}08`, border: `1px solid ${C.darkGreen}15` }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${C.brightGreen}18`, color: C.brightGreen }}
              >
                {item.icon}
              </div>
              <div
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "0.85rem", color: C.darkGreen }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.72rem",
                  color: C.darkGreen,
                  opacity: 0.52,
                  lineHeight: 1.45,
                }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// ─── SLIDE 12: Team & Thank You ───────────────────────────────────────────────
function TeamSlide() {
  const team = [
    "Badreddine SAIDANI",
    "Mohammed Anis KOUA",
    "Sonia KHEREDDINE",
    "Ikram SADOK",
    "Ines Malika BESSAM",
    "Damia AHMED SAID",
  ];

  const avatarColors = [C.orange, C.brightGreen, `${C.cream}28`, C.orange, C.brightGreen, `${C.cream}28`];
  const textColors = [C.cream, C.cream, C.cream, C.cream, C.cream, C.cream];

  return (
    <Slide bg={C.darkGreen}>
      <TopBar from={C.brightGreen} to={C.orange} />
      {/* Giant background compass */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
        <CompassSVG size={680} color={C.cream} sw={2} />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.62rem",
            letterSpacing: "0.38em",
            color: C.brightGreen,
            textTransform: "uppercase",
          }}
        >
          Our Team
        </div>

        <HawesLogo size={46} textColor={C.cream} compassColor={C.brightGreen} />

        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "2.8rem",
            fontWeight: 900,
            color: C.orange,
            letterSpacing: "0.06em",
            lineHeight: 1,
          }}
        >
          THANK YOU
        </div>

        <div className="w-12 h-px" style={{ background: `${C.cream}25` }} />

        <div className="grid grid-cols-3 gap-x-10 gap-y-4 mt-2">
          {team.map((name, i) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background: avatarColors[i],
                  color: textColors[i],
                  fontFamily: "'Fraunces', serif",
                }}
              >
                {name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.78rem",
                  color: C.cream,
                  opacity: 0.78,
                  textAlign: "center",
                }}
              >
                {name}
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex items-center gap-3 px-6 py-3 rounded-full mt-1"
          style={{ background: `${C.cream}07`, border: `1px solid ${C.cream}12` }}
        >
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem",
              color: C.cream,
              opacity: 0.5,
            }}
          >
            Supervised by
          </div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "0.9rem", color: C.brightGreen }}>
            Bellal HAFHOUF
          </div>
        </div>

        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.68rem",
            color: C.cream,
            opacity: 0.3,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Higher School of Computer and Digital Sciences and Technologies
          <br />
          Academic Year 2025 – 2026
        </div>
      </div>
    </Slide>
  );
}

// ─── Slide registry ───────────────────────────────────────────────────────────
const SLIDES = [
  CoverSlide,
  AgendaSlide,
  ContextSlide,
  ProblemSlide,
  SolutionSlide,
  ObjectivesSlide,
  UsersSlide,
  ArchitectureSlide,
  TechStackSlide,
  FeaturesSlide,
  FutureSlide,
  TeamSlide,
];

const SLIDE_LABELS = [
  "Cover",
  "Agenda",
  "Context",
  "Problem",
  "Solution",
  "Objectives",
  "Users",
  "Architecture",
  "Tech Stack",
  "Features",
  "Future Works",
  "Team",
];

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [current, setCurrent] = useState(0);
  const dirRef = useRef(1);

  const go = useCallback(
    (to: number) => {
      if (to < 0 || to >= SLIDES.length) return;
      dirRef.current = to > current ? 1 : -1;
      setCurrent(to);
    },
    [current]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") go(current + 1);
      else if (e.key === "ArrowLeft") go(current - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current, go]);

  const SlideComponent = SLIDES[current];
  const progress = ((current + 1) / SLIDES.length) * 100;

  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: C.darkGreen }}>
      {/* Slide area */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          initial={{ x: dirRef.current * 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -dirRef.current * 60, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <SlideComponent />
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] z-20 pointer-events-none">
        <motion.div
          className="h-full"
          style={{ background: C.orange, opacity: 0.5 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Prev button */}
      {current > 0 && (
        <button
          onClick={() => go(current - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-30"
          style={{ background: `${C.cream}12`, color: C.cream }}
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Next button */}
      {current < SLIDES.length - 1 && (
        <button
          onClick={() => go(current + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-30"
          style={{ background: `${C.cream}12`, color: C.cream }}
          aria-label="Next slide"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Bottom navigation */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className="rounded-full transition-all duration-200"
            style={{
              width: i === current ? 22 : 6,
              height: 6,
              background: i === current ? C.orange : `${C.cream}30`,
            }}
            aria-label={`Go to ${SLIDE_LABELS[i]}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div
        className="absolute bottom-[14px] right-6 z-30 tabular-nums"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.64rem",
          color: `${C.cream}40`,
          letterSpacing: "0.05em",
        }}
      >
        {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>

      {/* Slide label */}
      <div
        className="absolute bottom-[14px] left-6 z-30"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.64rem",
          color: `${C.cream}35`,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {SLIDE_LABELS[current]}
      </div>
    </div>
  );
}
