import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STUDENTS_PER_WALL, type Legend, type BadgeType, badgeConfig } from "./legendsData";
import { LegendCard } from "./LegendCard";
import { LegendModal } from "./LegendModal";
import { useStudents } from "@/hooks/useStudents";

function studentToLegend(s: { id: string; name: string; roll_number: string; first_year_image: string | null; final_year_image: string | null; description: string | null }, index: number): Legend {
  const id = index + 1;
  const placeholder = `https://i.pravatar.cc/400?img=${((index * 3) % 70) + 1}`;
  return {
    id,
    name: s.name,
    thenPhoto: s.first_year_image || placeholder,
    nowPhoto: s.final_year_image || placeholder,
    thenCaption: s.roll_number || `Student #${id}`,
    nowCaption: s.roll_number || `Student #${id}`,
    description: s.description || "",
  };
}

export function LegendsSection() {
  const { data: students = [], isLoading } = useStudents();
  const [currentWall, setCurrentWall] = useState(0);
  const [selected, setSelected] = useState<Legend | null>(null);
  const [highlighted, setHighlighted] = useState<number | null>(null);

  const legends = useMemo(() => students.map(studentToLegend), [students]);
  const totalWalls = Math.max(1, Math.ceil(legends.length / STUDENTS_PER_WALL));

  const walls = useMemo(() => {
    const result: Legend[][] = [];
    for (let i = 0; i < totalWalls; i++) {
      result.push(legends.slice(i * STUDENTS_PER_WALL, (i + 1) * STUDENTS_PER_WALL));
    }
    return result;
  }, [legends, totalWalls]);

  const goToWall = useCallback((index: number) => {
    setCurrentWall(Math.max(0, Math.min(index, totalWalls - 1)));
  }, [totalWalls]);

  const handleFindYourself = useCallback(() => {
    if (legends.length === 0) return;
    const randomLegend = legends[Math.floor(Math.random() * legends.length)];
    const wallIndex = Math.floor((randomLegend.id - 1) / STUDENTS_PER_WALL);
    setCurrentWall(wallIndex);
    setHighlighted(randomLegend.id);
    setTimeout(() => {
      const el = document.getElementById(`legend-card-${randomLegend.id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
    setTimeout(() => setHighlighted(null), 3500);
  }, [legends]);

  const currentStudents = walls[currentWall] || [];
  const wallStart = currentWall * STUDENTS_PER_WALL + 1;
  const wallEnd = wallStart + currentStudents.length - 1;

  if (isLoading) {
    return (
      <section className="py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (legends.length === 0) {
    return (
      <section className="py-20 text-center text-muted-foreground">
        <p>No students added yet.</p>
      </section>
    );
  }

  return (
    <>
      <section id="legends" className="py-12 sm:py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(30,30%,25%)] to-[hsl(30,25%,18%)] dark:from-[hsl(240,20%,10%)] dark:to-[hsl(240,25%,6%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary-foreground dark:text-foreground tracking-tight mb-3">
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

          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => goToWall(currentWall - 1)}
              disabled={currentWall === 0}
              className="text-primary-foreground/80 dark:text-foreground/80 hover:bg-card/20 disabled:opacity-30"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="flex flex-col items-center gap-2">
              <span className="text-primary-foreground/60 dark:text-muted-foreground text-sm">
                Wall {currentWall + 1} of {totalWalls} · #{wallStart}–{wallEnd}
              </span>
              <div className="flex gap-2">
                {Array.from({ length: totalWalls }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goToWall(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === currentWall
                        ? "bg-primary scale-125"
                        : "bg-primary-foreground/30 dark:bg-foreground/30 hover:bg-primary-foreground/50 dark:hover:bg-foreground/50"
                    }`}
                    aria-label={`Go to wall ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => goToWall(currentWall + 1)}
              disabled={currentWall === totalWalls - 1}
              className="text-primary-foreground/80 dark:text-foreground/80 hover:bg-card/20 disabled:opacity-30"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          <div className="relative min-h-[300px] sm:min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentWall}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 lg:gap-7"
              >
                {currentStudents.map((legend, i) => (
                  <LegendCard
                    key={legend.id}
                    legend={legend}
                    index={i}
                    isHighlighted={highlighted === legend.id}
                    onClick={setSelected}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <LegendModal legend={selected} onClose={() => setSelected(null)} />
    </>
  );
}
