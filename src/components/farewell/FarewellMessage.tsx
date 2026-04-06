import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const CONFETTI_PIECES = [
  { x: -110, y: 20, size: 14, color: "hsl(2 100% 70%)", shape: "circle" as const, rot: 0 },
  { x: -72, y: 42, size: 10, color: "hsl(48 100% 62%)", shape: "square" as const, rot: 35 },
  { x: -38, y: 12, size: 16, color: "hsl(122 48% 61%)", shape: "circle" as const, rot: 0 },
  { x: 0, y: 10, size: 12, color: "hsl(319 84% 69%)", shape: "circle" as const, rot: 15 },
  { x: 56, y: 14, size: 14, color: "hsl(48 100% 62%)", shape: "square" as const, rot: 50 },
  { x: 104, y: 20, size: 12, color: "hsl(122 48% 61%)", shape: "circle" as const, rot: -30 },
  { x: -132, y: 54, size: 6, color: "hsl(217 90% 63%)", shape: "circle" as const, rot: 0 },
  { x: 126, y: 48, size: 10, color: "hsl(319 84% 69%)", shape: "square" as const, rot: 22 },
];

export function FarewellMessage() {
  return (
    <section className="pt-8 sm:pt-10 lg:pt-16 pb-12 sm:pb-20 lg:pb-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative pt-16 lg:pt-20">
          {/* Floating heart icon */}
          <div className="absolute inset-x-0 top-0 z-20 flex justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.85 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring", stiffness: 220, damping: 18 }}
              className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-xl"
            >
              <Heart className="w-10 h-10 text-primary-foreground fill-primary-foreground" />
            </motion.div>
          </div>

          <div className="bg-foreground rounded-[2rem] relative overflow-hidden px-6 pt-20 pb-16 lg:px-10 lg:pt-24 lg:pb-20">
            {/* Confetti pieces */}
            <div className="absolute inset-x-0 top-5 flex justify-center pointer-events-none">
              {CONFETTI_PIECES.map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ left: `calc(50% + ${p.x}px)`, top: p.y }}
                  initial={{ opacity: 0, scale: 0, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0, rotate: p.rot }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.04, duration: 0.5, type: "spring", stiffness: 250, damping: 15 }}
                >
                  <div
                    style={{
                      width: p.size,
                      height: p.size,
                      borderRadius: p.shape === "circle" ? "50%" : 2,
                      backgroundColor: p.color,
                    }}
                  />
                </motion.div>
              ))}
            </div>

            <div className="text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-primary-foreground tracking-tight">
                  Until We Meet Again
                </h2>
                <p className="text-primary-foreground/70 text-lg mb-6 max-w-lg mx-auto text-balance leading-relaxed">
                  Four years flew by in what felt like four days. We laughed, we cried, we grew.
                  No matter where life takes us, this batch will always be home.
                </p>
                <p className="text-primary-foreground/50 text-sm italic">
                  "Don't cry because it's over. Smile because it happened." 🌟
                </p>
                <div className="mt-8 flex items-center justify-center gap-2 text-primary-foreground/60 text-sm">
                  <Heart className="w-4 h-4 text-primary fill-primary" />
                  <span>Batch 2022–2026 Forever</span>
                  <Heart className="w-4 h-4 text-primary fill-primary" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
