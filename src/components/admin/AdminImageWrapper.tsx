import { useState, useRef, useCallback } from "react";
import { Pencil, Trash2, Upload, RefreshCw, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useFrontendAdmin } from "@/contexts/FrontendAdminContext";
import { useSiteContent } from "@/hooks/useSiteContent";
import {
  validateImageFile,
  uploadImage,
  deleteImageFromStorage,
  upsertSiteContent,
  extractStoragePath,
} from "@/lib/imageStorage";

interface AdminImageWrapperProps {
  contentKey: string;
  folder: string;
  children: (src: string | null) => React.ReactNode;
  className?: string;
}

export function AdminImageWrapper({
  contentKey,
  folder,
  children,
  className = "",
}: AdminImageWrapperProps) {
  const { user, isAdmin: supabaseAdmin } = useAuth();
  const { isAdmin: frontendAdmin } = useFrontendAdmin();
  const { content, updateContent } = useSiteContent();
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentUrl = content[contentKey] || null;
  const showControls = (!!user && supabaseAdmin) || frontendAdmin;

  const handleFile = useCallback(
    async (file: File) => {
      const error = validateImageFile(file);
      if (error) {
        toast.error(error);
        return;
      }

      setLoading(true);
      try {
        // Delete old
        if (currentUrl) {
          const oldPath = extractStoragePath(currentUrl);
          if (oldPath) {
            try { await deleteImageFromStorage(oldPath); } catch { /* ok */ }
          }
        }

        const { url } = await uploadImage(file, folder);
        await upsertSiteContent(contentKey, url);
        updateContent(contentKey, url);
        toast.success("Image updated!");
      } catch (err: any) {
        toast.error(err.message || "Upload failed");
      } finally {
        setLoading(false);
      }
    },
    [contentKey, folder, currentUrl, updateContent]
  );

  const handleDelete = useCallback(async () => {
    if (!currentUrl) return;
    if (!confirm("Delete this image?")) return;

    setLoading(true);
    try {
      const path = extractStoragePath(currentUrl);
      if (path) {
        try { await deleteImageFromStorage(path); } catch { /* ok */ }
      }
      await upsertSiteContent(contentKey, null);
      updateContent(contentKey, null);
      toast.success("Image deleted");
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  }, [contentKey, currentUrl, updateContent]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className={`relative group/admin ${className}`}>
      {children(currentUrl)}

      {showControls && (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onFileChange}
          />

          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 z-30 bg-background/60 backdrop-blur-sm flex items-center justify-center rounded-lg">
              <RefreshCw className="w-6 h-6 text-primary animate-spin" />
            </div>
          )}

          {/* Admin control buttons */}
          <div className="absolute top-2 right-2 z-20 flex gap-1.5 opacity-0 group-hover/admin:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={loading}
              className="w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-foreground transition-colors shadow-lg"
              title={currentUrl ? "Replace image" : "Upload image"}
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            {currentUrl && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="w-8 h-8 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center hover:bg-destructive transition-colors shadow-lg"
                title="Delete image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Empty state upload prompt */}
          {!currentUrl && !loading && (
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 bg-muted/80 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors cursor-pointer"
            >
              <Upload className="w-5 h-5 text-primary/60" />
              <span className="text-xs text-primary/60 font-medium">Upload Image</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
