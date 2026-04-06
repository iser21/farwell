import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const AWARDS = [
  { id: "clown", title: "Class Clown 😂", icon: Laugh, gradient: "from-amber-500 to-orange-400" },
  { id: "assignment", title: "Assignment King 📚", icon: BookOpen, gradient: "from-emerald-500 to-teal-400" },
  { id: "bunk", title: "Mass Bunk Leader 😎", icon: Sparkles, gradient: "from-sky-500 to-blue-400" },
  { id: "mysterious", title: "Most Mysterious 👀", icon: Eye, gradient: "from-violet-500 to-purple-400" },
  { id: "ceo", title: "Future CEO 💼", icon: Briefcase, gradient: "from-rose-500 to-pink-400" },
  { id: "helpful", title: "Most Helpful ❤️", icon: Heart, gradient: "from-primary to-rose-400" },
] as const;

const STUDENT_NAMES = [
  "Arjun Sharma", "Priya Nair", "Ravi Kumar", "Sneha Desai", "Kabir Mehta",
  "Ananya Iyer", "Rohan Patel", "Meera Joshi", "Aarav Gupta", "Diya Reddy",
  "Vikram Singh", "Isha Rao", "Nikhil Verma", "Pooja Chatterjee", "Siddharth Das",
  "Kavya Pillai", "Aditya Mishra", "Nisha Banerjee", "Rahul Tiwari", "Tanvi Saxena",
  "Harsh Agarwal", "Simran Kapoor", "Kunal Shah", "Riya Roy", "Manish Bose",
  "Shruti Sinha", "Deepak Chauhan", "Neha Jain", "Amit Yadav", "Anjali Malik",
  "Varun Thakur", "Swati Pandey", "Kartik Chawla", "Divya Arora", "Suresh Khatri",
  "Pallavi Nanda", "Mohit Rathore", "Komal Sethi", "Gaurav Bhat", "Preeti Kulkarni",
  "Akash Dubey", "Sonal Dutta", "Tarun Lal", "Bhavna Hegde", "Vivek Menon",
  "Megha Naik", "Rajesh Rastogi", "Jyoti Pawar", "Pranav Goswami", "Tanya Bhatt",
  "Karan Mahajan", "Sakshi Kaur", "Ashish Dhawan", "Ritika Bajaj", "Dev Soni",
  "Nandini Trivedi", "Yash Khanna", "Aditi Chopra", "Sahil Gill", "Kriti Grover",
  "Ajay Mukherjee", "Madhuri Deshpande", "Tushar Mistry", "Payal Shetty",
  "Naveen Rangan", "Shweta Khurana", "Ishan Luthra", "Khushi Kohli",
  "Aniket Prasad", "Aisha Mirza", "Sameer Kapadia",
];

type Votes = Record<string, Record<string, number>>;
type Selections = Record<string, string>;

function getStoredVotes(): Votes {
  try {
    return JSON.parse(localStorage.getItem("batch-votes") || "{}");
  } catch {
    return {};
  }
}

function getStoredUserVotes(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem("batch-user-voted") || "{}");
  } catch {
    return {};
  }
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
  const [votes, setVotes] = useState<Votes>(getStoredVotes);
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>(getStoredUserVotes);
  const [selections, setSelections] = useState<Selections>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = useCallback((awardId: string, student: string) => {
    setSelections((prev) => ({ ...prev, [awardId]: student }));
  }, []);

  const handleVote = useCallback(
    (awardId: string) => {
      const student = selections[awardId];
      if (!student || userVoted[awardId]) return;

      const updated: Votes = { ...votes };
      if (!updated[awardId]) updated[awardId] = {};
      updated[awardId][student] = (updated[awardId][student] || 0) + 1;

      const updatedUserVoted = { ...userVoted, [awardId]: true };

      setVotes(updated);
      setUserVoted(updatedUserVoted);
      localStorage.setItem("batch-votes", JSON.stringify(updated));
      localStorage.setItem("batch-user-voted", JSON.stringify(updatedUserVoted));
    },
    [votes, userVoted, selections]
  );

  const winners = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const award of AWARDS) {
      const awardVotes = votes[award.id];
      if (!awardVotes || Object.keys(awardVotes).length === 0) {
        result[award.id] = [];
        continue;
      }
      const maxVotes = Math.max(...Object.values(awardVotes));
      result[award.id] = Object.entries(awardVotes)
        .filter(([, count]) => count === maxVotes)
        .map(([name]) => name);
    }
    return result;
  }, [votes]);

  const hasAnyVotes = Object.values(votes).some(
    (v) => v && Object.keys(v).length > 0
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
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight">
              Batch Awards
            </h2>
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg">
            Vote for the legends who made these 4 years unforgettable
          </p>
        </motion.div>

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
                          {STUDENT_NAMES.map((name) => (
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
                    ? awardWinners.length === 1
                      ? awardWinners[0]
                      : awardWinners.join(" & ")
                    : "No votes yet";
                const avatar =
                  awardWinners.length > 0 ? getAvatar(awardWinners[0]) : null;

                return (
                  <motion.div
                    key={award.id}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                    className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Award icon */}
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${award.gradient} flex items-center justify-center shadow-lg mx-auto mb-4`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <Badge variant="secondary" className="mb-3 text-xs">
                      {award.title}
                    </Badge>

                    {/* Winner avatar */}
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

        {/* Toggle button */}
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
            disabled={!hasAnyVotes && !showResults}
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
