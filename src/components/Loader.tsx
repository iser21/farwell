import { motion } from "framer-motion";

export function Loader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <motion.div
        className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
      <p className="mt-4 text-sm text-muted-foreground font-medium">Loading memories...</p>
    </div>
  );
}
