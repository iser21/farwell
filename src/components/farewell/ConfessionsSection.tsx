import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircleHeart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Confession {
  id: string;
  message: string;
  status: string;
  created_at: string;
}

export function ConfessionsSection() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0);

  const fetchApproved = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("confessions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setConfessions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchApproved();

    // Realtime subscription for approved confessions
    const channel = supabase
      .channel("confessions-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "confessions" }, () => {
        fetchApproved();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    // Rate limiting: 15 seconds between submissions
    if (Date.now() - lastSubmit < 15000) {
      toast.error("Please wait before submitting another confession");
      return;
    }

    if (trimmed.length > 500) {
      toast.error("Confession must be under 500 characters");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("confessions").insert({
      message: trimmed.slice(0, 500),
    });
    setSubmitting(false);

    if (error) {
      toast.error("Failed to submit — please try again");
    } else {
      setLastSubmit(Date.now());
      setMessage("");
      toast.success("Confession submitted! It'll appear once approved 🤫");
    }
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
          <Button type="submit" disabled={submitting}>
            <MessageCircleHeart className="w-4 h-4 mr-2" /> {submitting ? "Submitting…" : "Submit Anonymously"}
          </Button>
        </motion.form>

        {/* Approved confessions */}
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : confessions.length > 0 ? (
          <div className="columns-1 sm:columns-2 gap-4 space-y-4">
            <AnimatePresence>
              {confessions.map((c, i) => (
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
            </AnimatePresence>
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
