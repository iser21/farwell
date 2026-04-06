import { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const legends = [
  {
    name: "Arjun Sharma",
    thenPhoto: "https://i.pravatar.cc/300?img=11",
    nowPhoto: "https://i.pravatar.cc/300?img=12",
    thenCaption: "Lost on campus, carrying 5 textbooks",
    nowCaption: "Placed at Google, carries a MacBook and confidence",
    description: "The class topper who secretly watched anime during lectures 🎌",
  },
  {
    name: "Priya Nair",
    thenPhoto: "https://i.pravatar.cc/300?img=5",
    nowPhoto: "https://i.pravatar.cc/300?img=9",
    thenCaption: "Shy girl in the last bench",
    nowCaption: "President of the cultural committee",
    description: "Organized every fest and still topped the exams — legend 👑",
  },
  {
    name: "Ravi Kumar",
    thenPhoto: "https://i.pravatar.cc/300?img=33",
    nowPhoto: "https://i.pravatar.cc/300?img=53",
    thenCaption: "The guy who asked 'is attendance mandatory?'",
    nowCaption: "Startup founder with 3 failed and 1 successful venture",
    description: "Bunked 60% of classes, attended 100% of canteen sessions 🍕",
  },
  {
    name: "Sneha Desai",
    thenPhoto: "https://i.pravatar.cc/300?img=44",
    nowPhoto: "https://i.pravatar.cc/300?img=45",
    thenCaption: "Notes queen with color-coded highlighters",
    nowCaption: "Data scientist who still uses color-coded everything",
    description: "Her notes circulated more than the professors' materials 📚",
  },
  {
    name: "Kabir Mehta",
    thenPhoto: "https://i.pravatar.cc/300?img=59",
    nowPhoto: "https://i.pravatar.cc/300?img=60",
    thenCaption: "Guitar in one hand, coffee in the other",
    nowCaption: "Software engineer by day, musician by night",
    description: "Turned every gathering into an impromptu concert 🎸",
  },
  {
    name: "Ananya Iyer",
    thenPhoto: "https://i.pravatar.cc/300?img=20",
    nowPhoto: "https://i.pravatar.cc/300?img=25",
    thenCaption: "First one in the library every morning",
    nowCaption: "Pursuing PhD at MIT — no surprises there",
    description: "Asked questions that even the professors had to Google 🧠",
  },
];

export function LegendsSection() {
  const [showNow, setShowNow] = useState(false);

  return (
    <section id="legends" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight mb-4">
            The Legends 🏆
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            The unforgettable faces of Batch 2022–2026
          </p>

          {/* Then vs Now toggle */}
          <div className="flex items-center justify-center gap-3">
            <Label htmlFor="then-now" className={`text-sm font-medium transition-colors ${!showNow ? "text-foreground" : "text-muted-foreground"}`}>
              Then 📸
            </Label>
            <Switch id="then-now" checked={showNow} onCheckedChange={setShowNow} />
            <Label htmlFor="then-now" className={`text-sm font-medium transition-colors ${showNow ? "text-foreground" : "text-muted-foreground"}`}>
              Now ✨
            </Label>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {legends.map((legend, i) => (
            <motion.div
              key={legend.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-[220px] overflow-hidden relative">
                  <motion.img
                    key={showNow ? "now" : "then"}
                    src={showNow ? legend.nowPhoto : legend.thenPhoto}
                    alt={legend.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-foreground/60 to-transparent p-3">
                    <p className="text-primary-foreground text-xs italic">
                      {showNow ? legend.nowCaption : legend.thenCaption}
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg text-foreground mb-1">
                    {legend.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {legend.description}
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
