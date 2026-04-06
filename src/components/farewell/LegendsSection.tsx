import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Star, Laugh, BookOpen, Music, Award, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type BadgeType = "Topper" | "Class Clown" | "Artist" | "Musician" | "MVP" | "Chai Lover";

const badgeConfig: Record<BadgeType, { icon: typeof Star; color: string }> = {
  Topper: { icon: Award, color: "bg-warning text-warning-foreground" },
  "Class Clown": { icon: Laugh, color: "bg-primary text-primary-foreground" },
  Artist: { icon: BookOpen, color: "bg-success text-success-foreground" },
  Musician: { icon: Music, color: "bg-accent text-accent-foreground" },
  MVP: { icon: Star, color: "bg-primary text-primary-foreground" },
  "Chai Lover": { icon: Coffee, color: "bg-warning text-warning-foreground" },
};

interface Legend {
  id: number;
  name: string;
  thenPhoto: string;
  nowPhoto: string;
  thenCaption: string;
  nowCaption: string;
  description: string;
  notes?: string[];
  badge?: BadgeType;
}

const legends: Legend[] = [
  {
    id: 1,
    name: "Arjun Sharma",
    thenPhoto: "https://i.pravatar.cc/400?img=11",
    nowPhoto: "https://i.pravatar.cc/400?img=12",
    thenCaption: "Lost on campus, carrying 5 textbooks",
    nowCaption: "Placed at Google, carries a MacBook and confidence",
    description: "The class topper who secretly watched anime during lectures 🎌",
    notes: ["Never missed a deadline", "His notes saved the entire batch"],
    badge: "Topper",
  },
  {
    id: 2,
    name: "Priya Nair",
    thenPhoto: "https://i.pravatar.cc/400?img=5",
    nowPhoto: "https://i.pravatar.cc/400?img=9",
    thenCaption: "Shy girl in the last bench",
    nowCaption: "President of the cultural committee",
    description: "Organized every fest and still topped the exams — legend 👑",
    notes: ["Her laugh could be heard across the corridor"],
    badge: "MVP",
  },
  {
    id: 3,
    name: "Ravi Kumar",
    thenPhoto: "https://i.pravatar.cc/400?img=33",
    nowPhoto: "https://i.pravatar.cc/400?img=53",
    thenCaption: "The guy who asked 'is attendance mandatory?'",
    nowCaption: "Startup founder with 3 failed and 1 successful venture",
    description: "Bunked 60% of classes, attended 100% of canteen sessions 🍕",
    notes: ["Always had a business idea during lectures", "The canteen staff knew his order by heart"],
    badge: "Class Clown",
  },
  {
    id: 4,
    name: "Sneha Desai",
    thenPhoto: "https://i.pravatar.cc/400?img=44",
    nowPhoto: "https://i.pravatar.cc/400?img=45",
    thenCaption: "Notes queen with color-coded highlighters",
    nowCaption: "Data scientist who still uses color-coded everything",
    description: "Her notes circulated more than the professors' materials 📚",
    notes: ["Had a different pen for every subject"],
    badge: "Artist",
  },
  {
    id: 5,
    name: "Kabir Mehta",
    thenPhoto: "https://i.pravatar.cc/400?img=59",
    nowPhoto: "https://i.pravatar.cc/400?img=60",
    thenCaption: "Guitar in one hand, coffee in the other",
    nowCaption: "Software engineer by day, musician by night",
    description: "Turned every gathering into an impromptu concert 🎸",
    notes: ["Played at every farewell since 2023"],
    badge: "Musician",
  },
  {
    id: 6,
    name: "Ananya Iyer",
    thenPhoto: "https://i.pravatar.cc/400?img=20",
    nowPhoto: "https://i.pravatar.cc/400?img=25",
    thenCaption: "First one in the library every morning",
    nowCaption: "Pursuing PhD at MIT — no surprises there",
    description: "Asked questions that even the professors had to Google 🧠",
    notes: ["Once corrected a textbook error", "Her study group was legendary"],
    badge: "Topper",
  },
  {
    id: 7,
    name: "Rohan Patel",
    thenPhoto: "https://i.pravatar.cc/400?img=14",
    nowPhoto: "https://i.pravatar.cc/400?img=15",
    thenCaption: "The chai-break coordinator",
    nowCaption: "Product manager who still coordinates breaks",
    description: "If there was a chai break, Rohan organized it ☕",
    notes: ["Knew every tea stall in a 5km radius"],
    badge: "Chai Lover",
  },
  {
    id: 8,
    name: "Meera Joshi",
    thenPhoto: "https://i.pravatar.cc/400?img=32",
    nowPhoto: "https://i.pravatar.cc/400?img=36",
    thenCaption: "Always drawing in the margins",
    nowCaption: "UX designer at a top design studio",
    description: "Her doodles were better than most presentations 🎨",
    badge: "Artist",
  },
];

// Deterministic pseudo-random based on id
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function getCardTransform(id: number) {
  const rotation = (seededRandom(id) - 0.5) * 12; // -6 to 6 deg
  const yOffset = (seededRandom(id * 7) - 0.5) * 20; // -10 to 10px
  return { rotation, yOffset };
}

export function LegendsSection() {
  const [selected, setSelected] = useState<Legend | null>(null);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [showNow, setShowNow] = useState(false);

  const handleFindYourself = useCallback(() => {
    const randomLegend = legends[Math.floor(Math.random() * legends.length)];
    setHighlighted(randomLegend.id);
    const el = document.getElementById(`legend-card-${randomLegend.id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setHighlighted(null), 3000);
  }, []);

  const cards = useMemo(() => legends.map((legend) => {
    const { rotation, yOffset } = getCardTransform(legend.id);
    return { ...legend, rotation, yOffset };
  }), []);

  return (
    <>
      <section id="legends" className="py-20 lg:py-28 relative overflow-hidden">
        {/* Cork board background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(30,30%,25%)] to-[hsl(30,25%,18%)] dark:from-[hsl(240,20%,10%)] dark:to-[hsl(240,25%,6%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground dark:text-foreground tracking-tight mb-3">
              The Legends Wall 🏆
            </h2>
            <p className="text-primary-foreground/70 dark:text-muted-foreground text-lg mb-6">
              The unforgettable faces of Batch 2022–2026
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFindYourself}
                className="bg-card/90 text-card-foreground border-border hover:bg-card"
              >
                <Search className="w-4 h-4 mr-1" />
                Find Yourself
              </Button>
            </div>
          </motion.div>

          {/* Memory Wall Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {cards.map((legend, i) => {
              const isHighlighted = highlighted === legend.id;
              const badgeInfo = legend.badge ? badgeConfig[legend.badge] : null;

              return (
                <motion.div
                  key={legend.id}
                  id={`legend-card-${legend.id}`}
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  style={{ marginTop: legend.yOffset }}
                >
                  <motion.button
                    onClick={() => setSelected(legend)}
                    className={`group relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm transition-shadow duration-300 ${
                      isHighlighted ? "ring-4 ring-primary ring-offset-2 ring-offset-background" : ""
                    }`}
                    style={{ rotate: `${legend.rotation}deg` }}
                    whileHover={{ scale: 1.08, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Pin */}
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 w-5 h-5 rounded-full bg-destructive shadow-md border-2 border-destructive-foreground/30" />

                    {/* Polaroid Card */}
                    <div className="bg-card rounded-sm pt-3 px-3 pb-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-300 w-[160px] sm:w-[180px]">
                      <div className="aspect-square overflow-hidden rounded-sm bg-muted">
                        <img
                          src={legend.nowPhoto}
                          alt={legend.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <p className="mt-3 text-center text-sm font-display font-semibold text-card-foreground truncate">
                        {legend.name}
                      </p>
                    </div>

                    {/* Badge */}
                    {badgeInfo && (
                      <div className={`absolute -top-1 -right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-sm ${badgeInfo.color}`}>
                        <badgeInfo.icon className="w-3 h-3" />
                        {legend.badge}
                      </div>
                    )}

                    {/* Highlight pulse */}
                    {isHighlighted && (
                      <motion.div
                        className="absolute inset-0 rounded-sm border-2 border-primary"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Profile Modal */}
      <AnimatePresence>
        {selected && (
          <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
            <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl">
              <VisuallyHidden>
                <DialogTitle>{selected.name}</DialogTitle>
              </VisuallyHidden>

              <div className="p-6 space-y-5">
                {/* Then vs Now toggle */}
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Label className={`text-sm font-medium transition-colors ${!showNow ? "text-foreground" : "text-muted-foreground"}`}>
                    Then 📸
                  </Label>
                  <Switch checked={showNow} onCheckedChange={setShowNow} />
                  <Label className={`text-sm font-medium transition-colors ${showNow ? "text-foreground" : "text-muted-foreground"}`}>
                    Now ✨
                  </Label>
                </div>

                {/* Photo */}
                <div className="flex gap-4 justify-center">
                  <div className="flex-1 max-w-[200px]">
                    <motion.div
                      key={showNow ? "now" : "then"}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="aspect-square overflow-hidden rounded-xl bg-muted shadow-md"
                    >
                      <img
                        src={showNow ? selected.nowPhoto : selected.thenPhoto}
                        alt={selected.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <p className="text-xs text-muted-foreground text-center mt-2 italic">
                      {showNow ? selected.nowCaption : selected.thenCaption}
                    </p>
                  </div>
                </div>

                {/* Name & description */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-display font-bold text-foreground">
                    {selected.name}
                  </h3>
                  {selected.badge && (
                    <Badge className={badgeConfig[selected.badge].color}>
                      {selected.badge}
                    </Badge>
                  )}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {selected.description}
                  </p>
                </div>

                {/* Notes */}
                {selected.notes && selected.notes.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Batch Notes
                    </p>
                    {selected.notes.map((note, i) => (
                      <p key={i} className="text-sm text-foreground/80 italic pl-3 border-l-2 border-primary/40">
                        "{note}"
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
