import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import year1Img from "@/assets/year1-classroom.jpg";
import year2Img from "@/assets/year2-fest.jpg";
import year3Img from "@/assets/year3-projects.jpg";
import year4Img from "@/assets/year4-farewell.jpg";

const years = [
  {
    year: "1st Year",
    period: "2022–2023",
    emoji: "🌱",
    color: "from-emerald-500 to-teal-400",
    glowColor: "shadow-emerald-500/30",
    image: year1Img,
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
    image: year2Img,
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
    image: year3Img,
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
    image: year4Img,
    tags: ["Placements", "Farewell", "Last Memories"],
    memories: [
      "Placement season — stress, success, and celebration 🎉",
      "Last chai breaks knowing they won't last forever",
      "Farewell photos with people we'll never forget",
      "Promising to stay in touch… and meaning it this time ❤️",
    ],
  },
];

export function JourneyTimeline() {
  return (
    <section id="timeline" className="py-20 lg:py-28 bg-card relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight mb-4">
            The Journey
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Four years that changed us forever
          </p>
        </motion.div>

        <div className="relative">
          {/* Gradient timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-px">
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
              {/* Glowing dot */}
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

              {/* Content card */}
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
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={item.image}
                      alt={`${item.year} memories`}
                      loading="lazy"
                      width={768}
                      height={512}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {item.period}
                      </span>
                      <h3 className="font-display font-bold text-xl text-foreground">
                        {item.year}
                      </h3>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="px-5 pt-4 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[10px] font-medium"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Memories */}
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

        {/* Emotional closing */}
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
