import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PenLine, Heart } from "lucide-react";
import { toast } from "sonner";

interface AutographEntry {
  id: string;
  name: string;
  message: string;
  timestamp: number;
}

const STORAGE_KEY = "farewell-autographs";

function getEntries(): AutographEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function AutographBook() {
  const [entries, setEntries] = useState<AutographEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setEntries(getEntries());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedMessage) return;
    if (trimmedMessage.length > 300) {
      toast.error("Message must be under 300 characters");
      return;
    }

    const entry: AutographEntry = {
      id: crypto.randomUUID(),
      name: trimmedName.slice(0, 100),
      message: trimmedMessage.slice(0, 300),
      timestamp: Date.now(),
    };
    const updated = [entry, ...entries];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setEntries(updated);
    setName("");
    setMessage("");
    toast.success("Autograph added! 🖊️");
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
          <Button type="submit" className="w-full sm:w-auto">
            <PenLine className="w-4 h-4 mr-2" /> Sign the Book
          </Button>
        </motion.form>

        {/* Entries */}
        {entries.length > 0 && (
          <div className="space-y-4">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                className="bg-background rounded-2xl p-5 shadow-sm"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground">{entry.name}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-1">{entry.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {entries.length === 0 && (
          <p className="text-center text-muted-foreground text-sm">
            No autographs yet — be the first to sign! 🌟
          </p>
        )}
      </div>
    </section>
  );
}
