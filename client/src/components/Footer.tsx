import { Twitter, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";
import logoAlt from "@/assets/images/Logo_Alt.png";

const C = {
  cream: "#FEFDE8",
  orange: "#E85500",
  darkGreen: "#0D1F09",
  brightGreen: "#00A800",
};

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="relative" style={{ background: C.darkGreen }}>
      {/* Gradient top border */}
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.brightGreen})` }} />

      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${C.brightGreen}15 0%, transparent 70%)` }} />

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="mb-4">
              <img src={logoAlt} alt="Hawes" className="h-8 w-auto" />
            </div>
            <p className="text-sm" style={{ color: C.cream, opacity: 0.5, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}>
              {t('footer.tagline')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-5 text-sm" style={{ fontFamily: "'Fraunces', serif", color: C.cream, letterSpacing: "0.05em", textTransform: "uppercase" }}>{t('footer.quickLinks')}</h4>
            <ul className="space-y-3 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {[t('footer.home'), t('footer.aboutUs'), t('footer.destinations')].map((link) => (
                <li key={link}>
                  <a href="#" className="transition-all duration-200 hover:translate-x-1 inline-block hover:opacity-90" style={{ color: C.cream, opacity: 0.5 }}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-5 text-sm" style={{ fontFamily: "'Fraunces', serif", color: C.cream, letterSpacing: "0.05em", textTransform: "uppercase" }}>{t('footer.support')}</h4>
            <ul className="space-y-3 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {[t('footer.helpCenter'), t('footer.contactUs'), t('footer.faq')].map((link) => (
                <li key={link}>
                  <a href="#" className="transition-all duration-200 hover:translate-x-1 inline-block hover:opacity-90" style={{ color: C.cream, opacity: 0.5 }}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-5 text-sm" style={{ fontFamily: "'Fraunces', serif", color: C.cream, letterSpacing: "0.05em", textTransform: "uppercase" }}>{t('footer.followUs')}</h4>
            <div className="flex gap-3">
              {[
                { icon: Twitter, href: "https://twitter.com" },
                { icon: Instagram, href: "https://instagram.com" },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-[${C.orange}25] hover:text-[${C.orange}]"
                  style={{ background: `${C.cream}08`, color: C.cream, opacity: 0.6 }}
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-8 text-center text-sm" style={{ borderTop: `1px solid ${C.cream}12`, color: C.cream, opacity: 0.35, fontFamily: "'DM Sans', sans-serif" }}>
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}