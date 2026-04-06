import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { type Legend, badgeConfig } from "./legendsData";

interface LegendModalProps {
  legend: Legend | null;
  onClose: () => void;
}

export function LegendModal({ legend, onClose }: LegendModalProps) {
  const [showNow, setShowNow] = useState(false);

  if (!legend) return null;

  return (
    <Dialog open={!!legend} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl">
        <VisuallyHidden>
          <DialogTitle>{legend.name}</DialogTitle>
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
          <div className="flex justify-center">
            <div className="max-w-[200px] w-full">
              <motion.div
                key={showNow ? "now" : "then"}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="aspect-square overflow-hidden rounded-xl bg-muted shadow-md"
              >
                <img
                  src={showNow ? legend.nowPhoto : legend.thenPhoto}
                  alt={legend.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <p className="text-xs text-muted-foreground text-center mt-2 italic">
                {showNow ? legend.nowCaption : legend.thenCaption}
              </p>
            </div>
          </div>

          {/* Name & description */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-display font-bold text-foreground">
              {legend.name}
            </h3>
            {legend.badge && (
              <Badge className={badgeConfig[legend.badge].color}>
                {legend.badge}
              </Badge>
            )}
            <p className="text-muted-foreground text-sm leading-relaxed">
              {legend.description}
            </p>
          </div>

          {/* Notes */}
          {legend.notes && legend.notes.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Batch Notes
              </p>
              {legend.notes.map((note, i) => (
                <p key={i} className="text-sm text-foreground/80 italic pl-3 border-l-2 border-primary/40">
                  "{note}"
                </p>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
