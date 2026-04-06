import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { PenLine, Heart, MessageCircle, Camera, Smile, Eye } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { containsBannedWords } from "@/lib/wordFilter";

type Category = "appreciation" | "funny" | "memory";

interface AutographEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
  likes: number;
  category: Category;
}

const CATEGORIES: { value: Category; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "appreciation", label: "Appreciation", icon: <Heart className="w-3.5 h-3.5" />, color: "bg-primary/10 text-primary border-primary/20" },
  { value: "funny", label: "Funny", icon: <Smile className="w-3.5 h-3.5" />, color: "bg-warning/10 text-warning border-warning/20" },
  { value: "memory", label: "Memory", icon: <Camera className="w-3.5 h-3.5" />, color: "bg-success/10 text-success border-success/20" },
];

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase();
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 10) return "Just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const AVATAR_COLORS = [
  "bg-primary/20 text-primary",
  "bg-success/20 text-success",
  "bg-warning/20 text-warning",
  "bg-destructive/20 text-destructive",
  "bg-accent text-accent-foreground",
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

type Tab = "recent" | "liked";

export function AutographBook() {
  const [entries, setEntries] = useState<AutographEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<Category>("appreciation");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0);
  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("autograph-likes");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("recent");

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("autograph_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setEntries(data as AutographEntry[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
    const channel = supabase
      .channel("autographs-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "autograph_messages" }, (payload) => {
        setEntries((prev) => [payload.new as AutographEntry, ...prev]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "autograph_messages" }, (payload) => {
        setEntries((prev) => prev.map((e) => e.id === (payload.new as AutographEntry).id ? (payload.new as AutographEntry) : e));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const displayEntries = useMemo(() => {
    if (tab === "liked") return [...entries].sort((a, b) => b.likes - a.likes);
    return entries;
  }, [entries, tab]);

  const handleLike = async (entry: AutographEntry) => {
    const alreadyLiked = likedIds.has(entry.id);
    const newLikes = alreadyLiked ? Math.max(0, entry.likes - 1) : entry.likes + 1;

    // Optimistic update
    setEntries((prev) => prev.map((e) => e.id === entry.id ? { ...e, likes: newLikes } : e));
    const newLikedIds = new Set(likedIds);
    if (alreadyLiked) newLikedIds.delete(entry.id);
    else newLikedIds.add(entry.id);
    setLikedIds(newLikedIds);
    localStorage.setItem("autograph-likes", JSON.stringify([...newLikedIds]));

    await supabase.from("autograph_messages").update({ likes: newLikes }).eq("id", entry.id);
  };

  const validateForm = (): boolean => {
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedMessage) {
      toast.error("Please fill in both fields");
      return false;
    }
    if (trimmedName.length > 100) {
      toast.error("Name must be under 100 characters");
      return false;
    }
    if (trimmedMessage.length > 300) {
      toast.error("Message must be under 300 characters");
      return false;
    }
    if (containsBannedWords(trimmedName) || containsBannedWords(trimmedMessage)) {
      toast.error("Please keep it fun and respectful ❤️");
      return false;
    }
    if (Date.now() - lastSubmit < 10000) {
      toast.error("Please wait a few seconds before submitting again");
      return false;
    }
    return true;
  };

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) setPreviewOpen(true);
  };

  const handleSubmit = async () => {
    setPreviewOpen(false);
    setSubmitting(true);
    const { error } = await supabase.from("autograph_messages").insert({
      name: name.trim().slice(0, 100),
      message: message.trim().slice(0, 300),
      category,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to submit — please try again");
    } else {
      setLastSubmit(Date.now());
      setName("");
      setMessage("");
      setCategory("appreciation");
      toast.success("Autograph added! 🖊️");
    }
  };

  const categoryMeta = CATEGORIES.find((c) => c.value === category)!;

  return (
    <section id="autographs" className="py-20 lg:py-28 bg-card">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight mb-3">
            Digital Autograph Book ✍️
          </h2>
          <p className="text-muted-foreground text-lg">
            Leave your mark — write something memorable
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handlePreview}
          className="relative bg-background rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50 mb-10 space-y-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted-foreground text-center">Keep it fun and respectful ❤️</p>

          <div className="space-y-1.5">
            <Label htmlFor="autograph-name" className="text-sm font-medium">Your Name</Label>
            <Input
              id="autograph-name"
              placeholder="e.g. Arjun Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
              className="rounded-full transition-shadow focus:shadow-[0_0_0_3px_hsl(var(--ring)/0.15)]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="autograph-msg" className="text-sm font-medium">Your Message</Label>
            <Textarea
              id="autograph-msg"
              placeholder="Write something they'll remember after years…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={300}
              rows={3}
              required
              className="rounded-xl resize-none transition-shadow focus:shadow-[0_0_0_3px_hsl(var(--ring)/0.15)]"
            />
            <p className="text-[11px] text-muted-foreground/60 text-right tabular-nums">{message.length}/300</p>
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all ${
                    category === cat.value
                      ? cat.color + " ring-2 ring-ring/20"
                      : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={submitting} className="gap-2">
              <Eye className="w-4 h-4" /> Preview & Sign
            </Button>
            {submitting && (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </motion.form>

        {/* Preview Modal */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display">Preview Your Autograph</DialogTitle>
              <DialogDescription>Here's how your message will look.</DialogDescription>
            </DialogHeader>
            <div className="bg-muted/30 rounded-xl p-5 space-y-3 border border-border/50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${avatarColor(name)}`}>
                  {getInitial(name || "?")}
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-foreground">{name.trim() || "Your Name"}</p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
                <Badge variant="outline" className={`ml-auto text-[10px] ${categoryMeta.color}`}>
                  {categoryMeta.icon} <span className="ml-1">{categoryMeta.label}</span>
                </Badge>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">{message.trim() || "Your message…"}</p>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>Edit</Button>
              <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
                <PenLine className="w-4 h-4" /> Sign the Book
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6">
          {(["recent", "liked"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {t === "recent" ? "Recent" : "Most Liked"}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            <MessageCircle className="w-3.5 h-3.5 inline mr-1" />{entries.length}
          </span>
        </div>

        {/* Entries */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : displayEntries.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {displayEntries.map((entry) => {
                const catMeta = CATEGORIES.find((c) => c.value === entry.category) || CATEGORIES[0];
                const liked = likedIds.has(entry.id);
                return (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-background rounded-2xl p-5 shadow-sm border border-border/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${avatarColor(entry.name)}`}>
                        {getInitial(entry.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-display font-semibold text-sm text-foreground">{entry.name}</p>
                          <Badge variant="outline" className={`text-[10px] px-2 py-0 h-5 ${catMeta.color}`}>
                            {catMeta.icon}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground/60 ml-auto flex-shrink-0">
                            {relativeTime(entry.created_at)}
                          </span>
                        </div>
                        <p className="text-foreground/80 text-sm leading-relaxed mt-1.5">{entry.message}</p>
                        <button
                          onClick={() => handleLike(entry)}
                          className={`mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1 transition-all ${
                            liked
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 transition-all ${liked ? "fill-primary text-primary scale-110" : ""}`} />
                          {entry.likes > 0 && <span className="tabular-nums">{entry.likes}</span>}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-sm py-12">
            No autographs yet — be the first to sign! 🌟
          </p>
        )}
      </div>
    </section>
  );
}
