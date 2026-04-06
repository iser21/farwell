import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroPhoto from "@/assets/hero-group-photo.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroPhoto}
          alt="Batch 2022–2026 group photo"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/80" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.p
          className="text-primary-foreground/80 text-sm sm:text-base font-medium tracking-widest uppercase mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Class of 2026
        </motion.p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-display font-bold text-primary-foreground tracking-tight leading-[1.1] mb-6">
          Our Journey
          <br />
          <span className="text-primary">Batch 2022–2026</span>
        </h1>
        <p className="text-primary-foreground/80 text-lg sm:text-xl mb-10 leading-relaxed">
          From strangers to family ❤️
        </p>
        <Button
          size="lg"
          className="text-base font-semibold px-8 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" })}
        >
          Explore Memories <ArrowDown className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ArrowDown className="w-5 h-5 text-primary-foreground/50" />
      </motion.div>
    </section>
  );
}
