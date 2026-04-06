import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MessageCircleHeart, Shield, Check, X, Eye } from "lucide-react";
import { toast } from "sonner";

interface Confession {
  id: string;
  message: string;
  timestamp: number;
  status: "pending" | "approved" | "rejected";
}

const CONFESSIONS_KEY = "farewell-confessions";
const ADMIN_KEY = "farewell-admin-unlocked";
const ADMIN_PIN = "2026"; // Simple admin PIN

function getConfessions(): Confession[] {
  try {
    return JSON.parse(localStorage.getItem(CONFESSIONS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function ConfessionsSection() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPin, setAdminPin] = useState("");

  useEffect(() => {
    setConfessions(getConfessions());
    setIsAdmin(localStorage.getItem(ADMIN_KEY) === "true");
  }, []);

  const approved = confessions.filter((c) => c.status === "approved");
  const pending = confessions.filter((c) => c.status === "pending");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    if (trimmed.length > 500) {
      toast.error("Confession must be under 500 characters");
      return;
    }

    const confession: Confession = {
      id: crypto.randomUUID(),
      message: trimmed.slice(0, 500),
      timestamp: Date.now(),
      status: "pending",
    };
    const updated = [confession, ...confessions];
    localStorage.setItem(CONFESSIONS_KEY, JSON.stringify(updated));
    setConfessions(updated);
    setMessage("");
    toast.success("Confession submitted! It'll appear once approved 🤫");
  };

  const handleAdminLogin = () => {
    if (adminPin === ADMIN_PIN) {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_KEY, "true");
      setShowAdminPanel(true);
      setAdminPin("");
      toast.success("Admin mode activated");
    } else {
      toast.error("Wrong PIN");
    }
  };

  const updateStatus = (id: string, status: "approved" | "rejected") => {
    const updated = confessions.map((c) => (c.id === id ? { ...c, status } : c));
    localStorage.setItem(CONFESSIONS_KEY, JSON.stringify(updated));
    setConfessions(updated);
  };

  return (
    <section id="confessions" className="py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight mb-4">
            Confessions 🤫
          </h2>
          <p className="text-muted-foreground text-lg">
            Say what you never could — anonymously
          </p>
        </motion.div>

        {/* Submit form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl p-6 shadow-sm mb-10 space-y-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="confession-msg" className="text-sm font-medium">Your Confession</Label>
            <Textarea
              id="confession-msg"
              placeholder="I never told anyone but..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={3}
              required
              className="rounded-xl resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">{message.length}/500</p>
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit">
              <MessageCircleHeart className="w-4 h-4 mr-2" /> Submit Anonymously
            </Button>
            {!isAdmin && (
              <button
                type="button"
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Shield className="w-3 h-3" /> Admin
              </button>
            )}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="text-xs text-primary font-medium flex items-center gap-1"
              >
                <Eye className="w-3 h-3" /> {showAdminPanel ? "Hide" : "Review"} ({pending.length})
              </button>
            )}
          </div>
        </motion.form>

        {/* Admin login */}
        <AnimatePresence>
          {showAdminPanel && !isAdmin && (
            <motion.div
              className="bg-card rounded-2xl p-5 shadow-sm mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p className="text-sm text-muted-foreground mb-3">Enter admin PIN to review confessions</p>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="PIN"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="rounded-full w-32"
                  maxLength={10}
                />
                <Button size="sm" onClick={handleAdminLogin}>Unlock</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin panel — pending confessions */}
        <AnimatePresence>
          {showAdminPanel && isAdmin && pending.length > 0 && (
            <motion.div
              className="mb-10 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider mb-3">
                Pending Review ({pending.length})
              </h3>
              {pending.map((c) => (
                <div key={c.id} className="bg-card rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <p className="text-sm text-foreground leading-relaxed flex-1">"{c.message}"</p>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => updateStatus(c.id, "approved")}
                      className="w-8 h-8 rounded-full bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] flex items-center justify-center hover:opacity-80 transition-opacity"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateStatus(c.id, "rejected")}
                      className="w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-80 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Approved confessions */}
        {approved.length > 0 ? (
          <div className="columns-1 sm:columns-2 gap-4 space-y-4">
            {approved.map((c, i) => (
              <motion.div
                key={c.id}
                className="bg-card rounded-2xl p-5 shadow-sm break-inside-avoid"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <MessageCircleHeart className="w-5 h-5 text-primary mb-3" />
                <p className="text-foreground text-sm leading-relaxed italic">
                  "{c.message}"
                </p>
                <p className="text-xs text-muted-foreground mt-3">— Anonymous</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-sm">
            No confessions approved yet — submit yours above! 💬
          </p>
        )}
      </div>
    </section>
  );
}
