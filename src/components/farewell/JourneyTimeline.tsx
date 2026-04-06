import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import year1Img from "@/assets/year1-classroom.jpg";
import year1FirstDay from "@/assets/year1-firstday.jpg";
import year1Study from "@/assets/year1-study.jpg";
import year2Img from "@/assets/year2-fest.jpg";
import year2Dance from "@/assets/year2-dance.jpg";
import year2Canteen from "@/assets/year2-canteen.jpg";
import year3Img from "@/assets/year3-projects.jpg";
import year3Presentation from "@/assets/year3-presentation.jpg";
import year3Internship from "@/assets/year3-internship.jpg";
import year4Img from "@/assets/year4-farewell.jpg";
import year4Graduation from "@/assets/year4-graduation.jpg";
import year4Group from "@/assets/year4-groupphoto.jpg";

interface YearImage {
  src: string;
  caption: string;
}

const years = [
  {
    year: "1st Year",
    period: "2022–2023",
    emoji: "🌱",
    color: "from-emerald-500 to-teal-400",
    glowColor: "shadow-emerald-500/30",
    images: [
      { src: year1Img, caption: "Orientation Day" },
      { src: year1FirstDay, caption: "First Lecture" },
      { src: year1Study, caption: "Library Sessions" },
    ] as YearImage[],
    tags: ["Orientation", "New Friends", "First Exams"],
    memories: [
      "Walking into campus with zero clue and full excitement",
      "Making lifelong friends over canteen chai ☕",
      "Surviving the first internals with last-night magic",
      "That one senior who scared us on Day 1 😂",
    ],
  },
  {
    year: "2nd Year",
    period: "2023–2024",
    emoji: "🎉",
    color: "from-amber-500 to-orange-400",
    glowColor: "shadow-amber-500/30",
    images: [
      { src: year2Img, caption: "College Fest" },
      { src: year2Dance, caption: "Stage Performance" },
      { src: year2Canteen, caption: "Canteen Vibes" },
    ] as YearImage[],
    tags: ["Fests", "Late Nights", "First Crush"],
    memories: [
      "College fests where we danced like nobody watched 💃",
      "Late-night study sessions that turned into gossip sessions",
      "First crushes, first heartbreaks, first real friendships",
      "Bunking lectures together became an art form 🎨",
    ],
  },
  {
    year: "3rd Year",
    period: "2024–2025",
    emoji: "🚀",
    color: "from-violet-500 to-purple-400",
    glowColor: "shadow-violet-500/30",
    images: [
      { src: year3Img, caption: "Project Season" },
      { src: year3Presentation, caption: "Presentations" },
      { src: year3Internship, caption: "Internship Life" },
    ] as YearImage[],
    tags: ["Internships", "Projects", "Growth"],
    memories: [
      "Internships that made us feel like real professionals",
      "Group projects where one person did all the work 😅",
      "Started figuring out what we actually want in life",
      "Leadership roles that taught us more than any textbook",
    ],
  },
  {
    year: "Final Year",
    period: "2025–2026",
    emoji: "🎓",
    color: "from-primary to-rose-400",
    glowColor: "shadow-primary/30",
    images: [
      { src: year4Img, caption: "Farewell Night" },
      { src: year4Graduation, caption: "Graduation Day" },
      { src: year4Group, caption: "Last Group Photo" },
    ] as YearImage[],
    tags: ["Placements", "Farewell", "Last Memories"],
    memories: [
      "Placement season — stress, success, and celebration 🎉",
      "Last chai breaks knowing they won't last forever",
      "Farewell photos with people we'll never forget",
      "Promising to stay in touch… and meaning it this time ❤️",
    ],
  },
];

function MiniCarousel({ images }: { images: YearImage[] }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative h-44 overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current].src}
          alt={images[current].caption}
          loading="lazy"
          width={768}
          height={512}
          className="w-full h-full object-cover absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

      {/* Caption */}
      <AnimatePresence mode="wait">
        <motion.span
          key={current}
          className="absolute top-3 right-3 text-[10px] font-medium bg-background/60 backdrop-blur-sm text-foreground px-2 py-0.5 rounded-full"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {images[current].caption}
        </motion.span>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-3.5 h-3.5 text-foreground" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-3.5 h-3.5 text-foreground" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              idx === current ? "bg-foreground w-4" : "bg-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function JourneyTimeline() {
  return (
    <section id="timeline" className="py-12 sm:py-20 lg:py-28 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight mb-4">
            The Journey
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Four years that changed us forever
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 sm:left-6 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-px hidden sm:block">
            <div className="w-full h-full bg-gradient-to-b from-emerald-500/60 via-amber-500/60 via-violet-500/60 to-primary/60 rounded-full" />
          </div>

          {years.map((item, i) => (
            <motion.div
              key={item.year}
              className={`relative flex items-start mb-16 last:mb-0 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl shadow-lg ${item.glowColor}`}
                  whileInView={{
                    boxShadow: [
                      "0 0 0 0 rgba(0,0,0,0)",
                      "0 0 20px 4px rgba(0,0,0,0.15)",
                      "0 0 0 0 rgba(0,0,0,0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  {item.emoji}
                </motion.div>
              </div>

              <div
                className={`ml-20 md:ml-0 md:w-[calc(50%-44px)] ${
                  i % 2 === 0 ? "md:pr-4" : "md:pl-4"
                }`}
              >
                <motion.div
                  className="group bg-background/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <MiniCarousel images={item.images} />

                  {/* Year info overlay */}
                  <div className="px-5 -mt-8 relative z-10">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {item.period}
                    </span>
                    <h3 className="font-display font-bold text-xl text-foreground">
                      {item.year}
                    </h3>
                  </div>

                  <div className="px-5 pt-3 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] font-medium">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <ul className="px-5 pb-5 pt-3 space-y-2">
                    {item.memories.map((memory, j) => (
                      <motion.li
                        key={j}
                        className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 + j * 0.08 }}
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                        {memory}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center mt-16 text-muted-foreground italic text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          "These weren't just years… they were chapters of our lives ❤️"
        </motion.p>
      </div>
    </section>
  );
}
