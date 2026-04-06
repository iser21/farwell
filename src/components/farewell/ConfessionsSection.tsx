import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { MessageCircleHeart, Eye, Send, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { containsBannedWords } from "@/lib/wordFilter";
import { useFrontendAdmin } from "@/contexts/FrontendAdminContext";

interface Confession {
  id: string;
  message: string;
  status: string;
  category: string;
  reactions_heart: number;
  reactions_laugh: number;
  reactions_wow: number;
  created_at: string;
}

const CATEGORIES = [
  { value: "funny", label: "Funny", emoji: "😂" },
  { value: "appreciation", label: "Appreciation", emoji: "❤️" },
  { value: "secret", label: "Secret", emoji: "👀" },
  { value: "memory", label: "Memory", emoji: "📸" },
] as const;

const ANON_AVATARS = ["😶", "🎭", "🕶️", "🤫", "👻", "🦊", "🐱", "🦉", "🎃", "🤖"];

const CATEGORY_COLORS: Record<string, string> = {
  funny: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  appreciation: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
  secret: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/20",
  memory: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/20",
};

function getAnonAvatar(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash << 5) - hash + id.charCodeAt(i);
  return ANON_AVATARS[Math.abs(hash) % ANON_AVATARS.length];
}

function getAnonNumber(id: string, allIds: string[]) {
  return allIds.indexOf(id) + 1;
}

const MAX_LENGTH = 300;

export function ConfessionsSection() {
  const { isAdmin } = useFrontendAdmin();
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [pendingConfessions, setPendingConfessions] = useState<Confession[]>([]);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("secret");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [userReactions, setUserReactions] = useState<Record<string, string[]>>(() => {
    try {
      return JSON.parse(localStorage.getItem("confession_reactions") || "{}");
    } catch {
      return {};
    }
  });

  const allIds = useMemo(() => confessions.map((c) => c.id), [confessions]);

  const fetchApproved = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("confessions")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (!error && data) setConfessions(data as Confession[]);
    setLoading(false);
  };

  const fetchPending = async () => {
    const { data, error } = await supabase
      .from("confessions")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (!error && data) setPendingConfessions(data as Confession[]);
  };

  useEffect(() => {
    fetchApproved();
    const channel = supabase
      .channel("confessions-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "confessions" }, () => {
        fetchApproved();
        if (isAdmin) fetchPending();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) fetchPending();
  }, [isAdmin]);

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from("confessions").update({ status: "approved" }).eq("id", id);
    if (error) toast.error("Failed to approve");
    else toast.success("Confession approved ✅");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("confessions").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else toast.success("Confession deleted");
  };

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_LENGTH) {
      toast.error(`Keep it under ${MAX_LENGTH} characters`);
      return;
    }
    if (containsBannedWords(trimmed)) {
      toast.error("Please keep it respectful — some words aren't allowed ❤️");
      return;
    }
    setShowPreview(true);
  };

  const handleSubmit = async () => {
    const trimmed = message.trim();
    if (Date.now() - lastSubmit < 15000) {
      toast.error("Please wait before submitting another confession");
      setShowPreview(false);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("confessions").insert({
      message: trimmed.slice(0, MAX_LENGTH),
      category,
    });
    setSubmitting(false);
    setShowPreview(false);
    if (error) {
      toast.error("Failed to submit — please try again");
    } else {
      setLastSubmit(Date.now());
      setMessage("");
      setCategory("secret");
      toast.success("Confession submitted! It'll appear once approved 🤫");
    }
  };

  const handleReaction = async (confessionId: string, type: "heart" | "laugh" | "wow") => {
    const key = confessionId;
    const existing = userReactions[key] || [];
    const alreadyReacted = existing.includes(type);
    const col = `reactions_${type}` as const;

    setConfessions((prev) =>
      prev.map((c) =>
        c.id === confessionId
          ? { ...c, [col]: Math.max(0, c[col] + (alreadyReacted ? -1 : 1)) }
          : c
      )
    );

    const updated = alreadyReacted
      ? existing.filter((r) => r !== type)
      : [...existing, type];
    const newReactions = { ...userReactions, [key]: updated };
    setUserReactions(newReactions);
    localStorage.setItem("confession_reactions", JSON.stringify(newReactions));

    const current = confessions.find((c) => c.id === confessionId);
    if (!current) return;
    await supabase
      .from("confessions")
      .update({ [col]: Math.max(0, current[col] + (alreadyReacted ? -1 : 1)) })
      .eq("id", confessionId);
  };

  const selectedCategory = CATEGORIES.find((c) => c.value === category);

  return (
    <section id="confessions" className="py-12 sm:py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight mb-4">
            Confessions 🤫
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Say what you never could — anonymously
          </p>
        </motion.div>

        {/* Submit form */}
        <motion.form
          onSubmit={handlePreview}
          className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 shadow-lg mb-8 sm:mb-10 space-y-4 sm:space-y-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted-foreground text-center">
            Keep it fun and respectful ❤️
          </p>

          <div className="space-y-2">
            <Label htmlFor="confession-msg" className="text-sm font-medium">
              Your Confession
            </Label>
            <Textarea
              id="confession-msg"
              placeholder="Say something you never could… (keep it respectful ❤️)"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_LENGTH))}
              rows={3}
              required
              className="rounded-xl resize-none transition-shadow focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]"
            />
            <p className={`text-xs text-right transition-colors ${message.length > MAX_LENGTH * 0.9 ? "text-destructive" : "text-muted-foreground/60"}`}>
              {message.length}/{MAX_LENGTH}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    category === cat.value
                      ? CATEGORY_COLORS[cat.value] + " ring-2 ring-primary/20"
                      : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={!message.trim()} className="w-full sm:w-auto">
            <Eye className="w-4 h-4 mr-2" /> Preview & Submit
          </Button>
        </motion.form>

        {/* Preview modal */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Preview Your Confession</DialogTitle>
              <DialogDescription>This is how it will appear once approved</DialogDescription>
            </DialogHeader>
            <div className="bg-muted/30 border border-border/50 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎭</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Anonymous</p>
                  <Badge variant="outline" className={`text-xs ${CATEGORY_COLORS[category] || ""}`}>
                    {selectedCategory?.emoji} {selectedCategory?.label}
                  </Badge>
                </div>
              </div>
              <p className="text-foreground text-sm leading-relaxed italic">
                "{message.trim()}"
              </p>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowPreview(false)}>Edit</Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                <Send className="w-4 h-4 mr-2" /> {submitting ? "Submitting…" : "Submit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Admin: Pending confessions */}
        {isAdmin && pendingConfessions.length > 0 && (
          <div className="mb-8 sm:mb-10">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageCircleHeart className="w-5 h-5 text-primary" />
              Pending Moderation ({pendingConfessions.length})
            </h3>
            <div className="space-y-3">
              {pendingConfessions.map((c) => (
                <div key={c.id} className="bg-warning/5 border border-warning/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground italic">"{c.message}"</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(c.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => handleApprove(c.id)} className="gap-1">
                      <Check className="w-3.5 h-3.5" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)} className="gap-1">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confessions list */}
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : confessions.length > 0 ? (
          <div className="columns-1 sm:columns-2 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
            <AnimatePresence>
              {confessions.map((c, i) => {
                const avatar = getAnonAvatar(c.id);
                const anonNum = getAnonNumber(c.id, allIds);
                const catInfo = CATEGORIES.find((cat) => cat.value === c.category);
                const myReactions = userReactions[c.id] || [];

                return (
                  <motion.div
                    key={c.id}
                    className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-5 shadow-sm break-inside-avoid hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl sm:text-2xl">{avatar}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-foreground">
                          Anonymous #{anonNum}
                        </p>
                        {catInfo && (
                          <Badge variant="outline" className={`text-[10px] mt-0.5 ${CATEGORY_COLORS[c.category] || ""}`}>
                            {catInfo.emoji} {catInfo.label}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-foreground text-xs sm:text-sm leading-relaxed italic mb-3 sm:mb-4">
                      "{c.message}"
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {([
                        { type: "heart" as const, emoji: "❤️", count: c.reactions_heart },
                        { type: "laugh" as const, emoji: "😂", count: c.reactions_laugh },
                        { type: "wow" as const, emoji: "😮", count: c.reactions_wow },
                      ]).map((r) => (
                        <button
                          key={r.type}
                          onClick={() => handleReaction(c.id, r.type)}
                          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
                            myReactions.includes(r.type)
                              ? "bg-primary/10 border-primary/30 text-primary"
                              : "bg-muted/40 border-transparent text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <span>{r.emoji}</span>
                          {r.count > 0 && <span>{r.count}</span>}
                        </button>
                      ))}

                      {/* Admin delete for approved */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="ml-auto text-xs text-destructive/60 hover:text-destructive transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-4xl mb-3 block">👀</span>
            <p className="text-muted-foreground text-sm">
              No secrets revealed yet… Be the first to break the silence
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
