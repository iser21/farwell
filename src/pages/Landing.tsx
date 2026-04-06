import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/farewell/HeroSection";
import { JourneyTimeline } from "@/components/farewell/JourneyTimeline";
import { LegendsSection } from "@/components/farewell/LegendsSection";
import { AutographBook } from "@/components/farewell/AutographBook";
import { ConfessionsSection } from "@/components/farewell/ConfessionsSection";
import { BatchAwards } from "@/components/farewell/BatchAwards";
import { FarewellMessage } from "@/components/farewell/FarewellMessage";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FooterAdmin } from "@/components/farewell/FooterAdmin";
import { Heart, Shield } from "lucide-react";
import { useFrontendAdmin } from "@/contexts/FrontendAdminContext";

const navLinks = [
  { label: "Journey", href: "#timeline" },
  { label: "Legends", href: "#legends" },
  { label: "Autographs", href: "#autographs" },
  { label: "Confessions", href: "#confessions" },
  { label: "Awards", href: "#awards" },
];

const Landing = () => {
  const [navVisible, setNavVisible] = useState(false);
  const { isAdmin, logout } = useFrontendAdmin();

  useEffect(() => {
    const handleScroll = () => setNavVisible(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden scroll-smooth">
      {/* Admin mode indicator */}
      {isAdmin && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground text-center text-xs py-1 flex items-center justify-center gap-2">
          <Shield className="w-3 h-3" />
          <span>Admin Mode</span>
          <button onClick={logout} className="underline ml-2 hover:opacity-80">Logout</button>
        </div>
      )}

      {/* Navbar */}
      <motion.nav
        className={`fixed w-full z-50 bg-background/90 backdrop-blur-md ${isAdmin ? "top-6" : "top-0"}`}
        initial={{ y: -100 }}
        animate={{ y: navVisible ? 0 : -100 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-[60px] sm:h-[72px] px-4 sm:px-6 lg:px-8">
          <span className="font-display font-bold text-foreground text-base sm:text-lg tracking-tight">
            Batch 2022–2026
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 sm:px-3 py-2 rounded-full hover:bg-muted hidden sm:inline-flex"
              >
                {link.label}
              </a>
            ))}
            <ThemeToggle />
          </div>
        </div>
      </motion.nav>

      <HeroSection />
      <JourneyTimeline />
      <LegendsSection />
      <AutographBook />
      <ConfessionsSection />
      <BatchAwards />
      <FarewellMessage />

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>by Batch 2022–2026</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-xs text-muted-foreground">© 2026 Our Journey. All memories reserved.</p>
            <FooterAdmin />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
