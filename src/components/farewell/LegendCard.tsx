import { memo } from "react";
import { motion } from "framer-motion";
import { type Legend, type BadgeType, badgeConfig, getCardTransform } from "./legendsData";
import { AdminImageWrapper } from "@/components/admin/AdminImageWrapper";

interface LegendCardProps {
  legend: Legend;
  index: number;
  isHighlighted: boolean;
  onClick: (legend: Legend) => void;
}

export const LegendCard = memo(function LegendCard({ legend, index, isHighlighted, onClick }: LegendCardProps) {
  const { rotation, yOffset } = getCardTransform(legend.id);
  const badgeInfo = legend.badge ? badgeConfig[legend.badge] : null;

  return (
    <motion.div
      id={`legend-card-${legend.id}`}
      className="flex justify-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      style={{ marginTop: typeof window !== "undefined" && window.innerWidth < 640 ? 0 : yOffset }}
    >
      <motion.button
        onClick={() => onClick(legend)}
        className={`group relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm transition-shadow duration-300 ${
          isHighlighted ? "ring-4 ring-primary ring-offset-2 ring-offset-background" : ""
        }`}
        style={{ rotate: typeof window !== "undefined" && window.innerWidth < 640 ? "0deg" : `${rotation}deg` }}
        whileHover={{ scale: 1.08, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Pin */}
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 w-5 h-5 rounded-full bg-destructive shadow-md border-2 border-destructive-foreground/30" />

        {/* Polaroid */}
        <div className="bg-card rounded-sm pt-3 px-3 pb-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-300 w-[140px] sm:w-[155px] lg:w-[165px]">
          <AdminImageWrapper
            contentKey={`profile_img_${legend.id}`}
            folder="profiles"
            className="aspect-square overflow-hidden rounded-sm"
          >
            {(dbUrl) => (
              <img
                src={dbUrl || legend.nowPhoto}
                alt={legend.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = legend.nowPhoto;
                }}
              />
            )}
          </AdminImageWrapper>
          <p className="mt-2.5 text-center text-xs sm:text-sm font-display font-semibold text-card-foreground truncate">
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
});
