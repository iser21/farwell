import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/Loader";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Shield, Check, X, Trash2, LogOut, ArrowLeft, MessageCircleHeart, RefreshCw, Image } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Confession {
  id: string;
  message: string;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin", { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  const fetchConfessions = async () => {
    setLoadingData(true);
    const { data, error } = await supabase
      .from("confessions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load confessions");
    } else {
      setConfessions(data || []);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchConfessions();

      // Realtime subscription
      const channel = supabase
        .channel("admin-confessions")
        .on("postgres_changes", { event: "*", schema: "public", table: "confessions" }, () => {
          fetchConfessions();
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [user, isAdmin]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("confessions")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update");
    } else {
      toast.success(`Confession ${status}`);
    }
  };

  const deleteConfession = async (id: string) => {
    const { error } = await supabase
      .from("confessions")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Confession deleted");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) return <Loader />;
  if (!user || !isAdmin) return null;

  const filtered = filter === "all" ? confessions : confessions.filter((c) => c.status === filter);
  const counts = {
    all: confessions.length,
    pending: confessions.filter((c) => c.status === "pending").length,
    approved: confessions.filter((c) => c.status === "approved").length,
    rejected: confessions.filter((c) => c.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/images"><Image className="w-4 h-4 mr-1" /> Images</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/"><ArrowLeft className="w-4 h-4 mr-1" /> Site</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-1" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {(["all", "pending", "approved", "rejected"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`p-4 rounded-xl text-left transition-colors ${
                filter === key ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
              }`}
            >
              <p className={`text-2xl font-display font-bold ${filter === key ? "" : "text-foreground"}`}>
                {counts[key]}
              </p>
              <p className={`text-xs font-medium capitalize ${filter === key ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {key}
              </p>
            </button>
          ))}
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-foreground capitalize">
            {filter} confessions ({filtered.length})
          </h2>
          <Button variant="ghost" size="sm" onClick={fetchConfessions}>
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
        </div>

        {/* List */}
        {loadingData ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircleHeart className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No {filter} confessions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                className="bg-card rounded-xl p-5 shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="text-foreground text-sm leading-relaxed mb-2">"{c.message}"</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        c.status === "approved" ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]" :
                        c.status === "rejected" ? "bg-destructive/10 text-destructive" :
                        "bg-warning/10 text-warning"
                      }`}>
                        {c.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {c.status !== "approved" && (
                      <button
                        onClick={() => updateStatus(c.id, "approved")}
                        className="w-8 h-8 rounded-full bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] flex items-center justify-center hover:opacity-80 transition-opacity"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {c.status !== "rejected" && (
                      <button
                        onClick={() => updateStatus(c.id, "rejected")}
                        className="w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-80 transition-opacity"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteConfession(c.id)}
                      className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
