import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PenLine, Heart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AutographEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export function AutographBook() {
  const [entries, setEntries] = useState<AutographEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("autograph_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setEntries(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();

    // Realtime subscription
    const channel = supabase
      .channel("autographs-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "autograph_messages" }, (payload) => {
        setEntries((prev) => [payload.new as AutographEntry, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedMessage) return;

    // Rate limiting: 10 seconds between submissions
    if (Date.now() - lastSubmit < 10000) {
      toast.error("Please wait a few seconds before submitting again");
      return;
    }

    if (trimmedName.length > 100) {
      toast.error("Name must be under 100 characters");
      return;
    }
    if (trimmedMessage.length > 300) {
      toast.error("Message must be under 300 characters");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("autograph_messages").insert({
      name: trimmedName.slice(0, 100),
      message: trimmedMessage.slice(0, 300),
    });
    setSubmitting(false);

    if (error) {
      toast.error("Failed to submit — please try again");
    } else {
      setLastSubmit(Date.now());
      setName("");
      setMessage("");
      toast.success("Autograph added! 🖊️");
    }
  };

  return (
    <section id="autographs" className="py-20 lg:py-28 bg-card">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight mb-4">
            Digital Autograph Book ✍️
          </h2>
          <p className="text-muted-foreground text-lg">
            Leave your mark — write something memorable
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-background rounded-2xl p-6 shadow-sm mb-10 space-y-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="autograph-name" className="text-sm font-medium">Your Name</Label>
            <Input
              id="autograph-name"
              placeholder="e.g. Arjun Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
              className="rounded-full"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="autograph-msg" className="text-sm font-medium">Your Message</Label>
            <Textarea
              id="autograph-msg"
              placeholder="Write something heartfelt, funny, or unforgettable..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={300}
              rows={3}
              required
              className="rounded-xl resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">{message.length}/300</p>
          </div>
          <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
            <PenLine className="w-4 h-4 mr-2" /> {submitting ? "Signing…" : "Sign the Book"}
          </Button>
        </motion.form>

        {/* Entries */}
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                className="bg-background rounded-2xl p-5 shadow-sm"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className="font-display font-semibold text-sm text-foreground">{entry.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-1">{entry.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-sm">
            No autographs yet — be the first to sign! 🌟
          </p>
        )}
      </div>
    </section>
  );
}
