import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/farewell/HeroSection";
import { JourneyTimeline } from "@/components/farewell/JourneyTimeline";
import { LegendsSection } from "@/components/farewell/LegendsSection";
import { AutographBook } from "@/components/farewell/AutographBook";
import { ConfessionsSection } from "@/components/farewell/ConfessionsSection";
import { FarewellMessage } from "@/components/farewell/FarewellMessage";
import { Heart } from "lucide-react";

const navLinks = [
  { label: "Journey", href: "#timeline" },
  { label: "Legends", href: "#legends" },
  { label: "Autographs", href: "#autographs" },
  { label: "Confessions", href: "#confessions" },
];

const Landing = () => {
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavVisible(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden scroll-smooth">
      {/* Navbar — hidden until scroll */}
      <motion.nav
        className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md"
        initial={{ y: -100 }}
        animate={{ y: navVisible ? 0 : -100 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-[72px] px-6 lg:px-8">
          <span className="font-display font-bold text-foreground text-lg tracking-tight">
            Batch 2022–2026
          </span>
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-full hover:bg-muted"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      <HeroSection />
      <JourneyTimeline />
      <LegendsSection />
      <AutographBook />
      <ConfessionsSection />
      <FarewellMessage />

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>by Batch 2022–2026</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Our Journey. All memories reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
