import { motion } from "framer-motion";

const years = [
  {
    year: "1st Year",
    period: "2022–2023",
    caption: "Wide-eyed freshers finding our way through campus, making friends in canteens, and surviving our first exams.",
    emoji: "🌱",
    color: "bg-[hsl(170,60%,45%)]",
  },
  {
    year: "2nd Year",
    period: "2023–2024",
    caption: "Fests, late-night study sessions, first crushes, and figuring out what we actually wanted to do.",
    emoji: "🎉",
    color: "bg-[hsl(45,90%,50%)]",
  },
  {
    year: "3rd Year",
    period: "2024–2025",
    caption: "Internships, projects, leadership roles — we started becoming who we were meant to be.",
    emoji: "🚀",
    color: "bg-[hsl(250,60%,60%)]",
  },
  {
    year: "Final Year",
    period: "2025–2026",
    caption: "Placements, farewells, last chai breaks, and promises to stay in touch forever.",
    emoji: "🎓",
    color: "bg-primary",
  },
];

export function JourneyTimeline() {
  return (
    <section id="timeline" className="py-20 lg:py-28 bg-card">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
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
          <p className="text-muted-foreground text-lg">
            Four years that changed us forever
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-px" />

          {years.map((item, i) => (
            <motion.div
              key={item.year}
              className={`relative flex items-start mb-12 last:mb-0 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Dot */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-xl shadow-lg`}>
                  {item.emoji}
                </div>
              </div>

              {/* Content card */}
              <div className={`ml-20 md:ml-0 md:w-[calc(50%-40px)] ${i % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                <div className="bg-background rounded-2xl p-6 shadow-sm">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {item.period}
                  </span>
                  <h3 className="font-display font-bold text-xl text-foreground mt-1 mb-2">
                    {item.year}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
