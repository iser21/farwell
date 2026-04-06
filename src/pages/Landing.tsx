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
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Journey", href: "#timeline" },
  { label: "Legends", href: "#legends" },
  { label: "Autographs", href: "#autographs" },
  { label: "Confessions", href: "#confessions" },
  { label: "Awards", href: "#awards" },
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
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-full hover:bg-muted hidden sm:inline-flex"
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
      <footer className="py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>by Batch 2022–2026</span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2026 Our Journey. All memories reserved.</p>
            <Link to="/admin" className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
