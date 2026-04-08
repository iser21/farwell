import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudents } from "@/hooks/useStudents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, Laugh, BookOpen, Eye, Briefcase, Heart, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AWARDS = [
  { id: "clown", title: "Class Clown 😂", icon: Laugh, gradient: "from-amber-500 to-orange-400" },
  { id: "assignment", title: "Assignment King 📚", icon: BookOpen, gradient: "from-emerald-500 to-teal-400" },
  { id: "bunk", title: "Mass Bunk Leader 😎", icon: Sparkles, gradient: "from-sky-500 to-blue-400" },
  { id: "mysterious", title: "Most Mysterious 👀", icon: Eye, gradient: "from-violet-500 to-purple-400" },
  { id: "ceo", title: "Future CEO 💼", icon: Briefcase, gradient: "from-rose-500 to-pink-400" },
  { id: "crush", title: "Class Crush 💘", icon: Heart, gradient: "from-primary to-rose-400" },
] as const;

type VoteTally = Record<string, Record<string, number>>;
type Selections = Record<string, string>;

function getVoterId(): string {
  let id = localStorage.getItem("batch-voter-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("batch-voter-id", id);
  }
  return id;
}

function getAvatar(name: string) {
  const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = hash % 360;
  return {
    letter: name.charAt(0).toUpperCase(),
    bg: `hsl(${hue}, 55%, 50%)`,
  };
}

export function BatchAwards() {
  const { data: students = [] } = useStudents();
  const studentNames = useMemo(() => students.map((s) => s.name), [students]);
  const [tally, setTally] = useState<VoteTally>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});
  const [selections, setSelections] = useState<Selections>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const voterId = useMemo(() => getVoterId(), []);

  // Fetch all votes and determine which awards this voter already voted on
  useEffect(() => {
    async function fetchVotes() {
      const { data, error } = await supabase
        .from("batch_votes")
        .select("award_id, student_name, voter_id");

      if (error) {
        console.error("Failed to fetch votes:", error);
        setLoading(false);
        return;
      }

      const newTally: VoteTally = {};
      const voted: Record<string, boolean> = {};

      for (const row of data || []) {
        if (!newTally[row.award_id]) newTally[row.award_id] = {};
        newTally[row.award_id][row.student_name] = (newTally[row.award_id][row.student_name] || 0) + 1;
        if (row.voter_id === voterId) {
          voted[row.award_id] = true;
        }
      }

      setTally(newTally);
      setUserVoted(voted);
      setLoading(false);
    }

    fetchVotes();
  }, [voterId]);

  const handleSelect = useCallback((awardId: string, student: string) => {
    setSelections((prev) => ({ ...prev, [awardId]: student }));
  }, []);

  const handleVote = useCallback(
    async (awardId: string) => {
      const student = selections[awardId];
      if (!student || userVoted[awardId]) return;

      const { error } = await supabase.from("batch_votes").insert({
        award_id: awardId,
        student_name: student,
        voter_id: voterId,
      });

      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already voted", description: "You already voted for this award." });
        } else {
          toast({ title: "Error", description: "Failed to submit vote.", variant: "destructive" });
        }
        return;
      }

      // Update local tally
      setTally((prev) => {
        const updated = { ...prev };
        if (!updated[awardId]) updated[awardId] = {};
        updated[awardId] = { ...updated[awardId] };
        updated[awardId][student] = (updated[awardId][student] || 0) + 1;
        return updated;
      });
      setUserVoted((prev) => ({ ...prev, [awardId]: true }));
      toast({ title: "Vote recorded! ✅" });
    },
    [selections, userVoted, voterId]
  );

  // Compute top winners per award (sorted by votes desc)
  const winners = useMemo(() => {
    const result: Record<string, { name: string; count: number }[]> = {};
    for (const award of AWARDS) {
      const awardVotes = tally[award.id];
      if (!awardVotes || Object.keys(awardVotes).length === 0) {
        result[award.id] = [];
        continue;
      }
      const sorted = Object.entries(awardVotes)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      // Return top (could be ties at #1)
      const topCount = sorted[0].count;
      result[award.id] = sorted.filter((s) => s.count === topCount);
    }
    return result;
  }, [tally]);

  const totalVotes = useMemo(
    () =>
      Object.values(tally).reduce(
        (sum, awardVotes) =>
          sum + Object.values(awardVotes).reduce((s, c) => s + c, 0),
        0
      ),
    [tally]
  );

  return (
    <section id="awards" className="py-12 sm:py-20 lg:py-28 bg-card relative overflow-hidden">
      <div className="absolute top-20 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">
              Batch Awards
            </h2>
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg">
            Vote for the legends who made these 4 years unforgettable
          </p>
          {totalVotes > 0 && (
            <p className="text-xs text-muted-foreground mt-2">{totalVotes} total votes cast</p>
          )}
        </motion.div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading votes...</div>
        ) : (
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="voting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {AWARDS.map((award, i) => {
                  const Icon = award.icon;
                  const voted = userVoted[award.id];
                  return (
                    <motion.div
                      key={award.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="group bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${award.gradient} flex items-center justify-center shadow-md`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-display font-bold text-foreground text-lg">
                          {award.title}
                        </h3>
                      </div>

                      <div className="flex gap-2">
                        <Select
                          onValueChange={(v) => handleSelect(award.id, v)}
                          disabled={voted}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue
                              placeholder={voted ? "Vote recorded ✅" : "Select a classmate"}
                            />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {studentNames.map((name) => (
                              <SelectItem key={name} value={name}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={() => handleVote(award.id)}
                          disabled={!selections[award.id] || voted}
                          size="sm"
                          className="shrink-0"
                        >
                          {voted ? "Voted" : "Vote"}
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {AWARDS.map((award, i) => {
                  const Icon = award.icon;
                  const awardWinners = winners[award.id] || [];
                  const displayName =
                    awardWinners.length > 0
                      ? awardWinners.map((w) => w.name).join(" & ")
                      : "No votes yet";
                  const voteCount = awardWinners.length > 0 ? awardWinners[0].count : 0;
                  const avatar =
                    awardWinners.length > 0 ? getAvatar(awardWinners[0].name) : null;

                  return (
                    <motion.div
                      key={award.id}
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.12 }}
                      className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${award.gradient} flex items-center justify-center shadow-lg mx-auto mb-4`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      <Badge variant="secondary" className="mb-3 text-xs">
                        {award.title}
                      </Badge>

                      {avatar && (
                        <motion.div
                          className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                          style={{ backgroundColor: avatar.bg }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 15,
                            delay: i * 0.12 + 0.3,
                          }}
                        >
                          {avatar.letter}
                        </motion.div>
                      )}

                      <p className="font-display font-bold text-foreground text-lg">
                        {displayName}
                      </p>

                      {voteCount > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          🗳️ {voteCount} vote{voteCount !== 1 ? "s" : ""}
                        </p>
                      )}

                      {awardWinners.length > 1 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          🏆 Tied winners!
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <motion.div
          className="flex justify-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Button
            onClick={() => setShowResults((p) => !p)}
            size="lg"
            variant={showResults ? "outline" : "default"}
            disabled={totalVotes === 0 && !showResults}
            className="gap-2"
          >
            <Trophy className="w-4 h-4" />
            {showResults ? "Back to Voting" : "Show Results 🏆"}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
