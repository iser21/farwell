import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { legends } from "@/components/farewell/legendsData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader } from "@/components/Loader";
import { ImageUploadCard } from "@/components/admin/ImageUploadCard";
import { ExcelUploadSection } from "@/components/admin/ExcelUploadSection";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useStudents } from "@/hooks/useStudents";
import { Shield, ArrowLeft, LogOut, Image } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const HERO_KEYS = [{ key: "hero_image", label: "Hero Background Image" }];

const TIMELINE_KEYS = [
  { key: "year1_img1", label: "1st Year – Image 1" },
  { key: "year1_img2", label: "1st Year – Image 2" },
  { key: "year1_img3", label: "1st Year – Image 3" },
  { key: "year2_img1", label: "2nd Year – Image 1" },
  { key: "year2_img2", label: "2nd Year – Image 2" },
  { key: "year2_img3", label: "2nd Year – Image 3" },
  { key: "year3_img1", label: "3rd Year – Image 1" },
  { key: "year3_img2", label: "3rd Year – Image 2" },
  { key: "year3_img3", label: "3rd Year – Image 3" },
  { key: "year4_img1", label: "Final Year – Image 1" },
  { key: "year4_img2", label: "Final Year – Image 2" },
  { key: "year4_img3", label: "Final Year – Image 3" },
];

const PROFILE_KEYS = legends.map((l) => ({
  key: `profile_img_${l.id}`,
  label: `#${l.id} – ${l.name}`,
}));

const AdminImages = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { content, loading: loadingData, updateContent } = useSiteContent();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin", { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  const handleUpdate = (key: string, url: string | null) => {
    updateContent(key, url);
  };

  if (loading) return <Loader />;
  if (!user || !isAdmin) return null;

  const renderSection = (
    keys: { key: string; label: string }[],
    folder: string
  ) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {keys.map((item) => (
        <ImageUploadCard
          key={item.key}
          label={item.label}
          contentKey={item.key}
          folder={folder}
          currentUrl={content[item.key] || null}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-3">
            <Image className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground">
              Image Manager
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/dashboard">
                <Shield className="w-4 h-4 mr-1" /> Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-1" /> Site
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              <LogOut className="w-4 h-4 mr-1" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {loadingData ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="hero">
            <TabsList className="mb-6">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="profiles">Profiles</TabsTrigger>
            </TabsList>

            <TabsContent value="hero">
              {renderSection(HERO_KEYS, "hero")}
            </TabsContent>
            <TabsContent value="timeline">
              {renderSection(TIMELINE_KEYS, "timeline")}
            </TabsContent>
            <TabsContent value="profiles">
              {renderSection(PROFILE_KEYS, "profiles")}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default AdminImages;
