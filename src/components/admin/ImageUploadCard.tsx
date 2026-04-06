import { useState, useRef } from "react";
import { Upload, Trash2, RefreshCw, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  validateImageFile,
  uploadImage,
  deleteImageFromStorage,
  upsertSiteContent,
  extractStoragePath,
} from "@/lib/imageStorage";

interface ImageUploadCardProps {
  label: string;
  contentKey: string;
  folder: string;
  currentUrl: string | null;
  onUpdate: (key: string, url: string | null) => void;
}

export function ImageUploadCard({
  label,
  contentKey,
  folder,
  currentUrl,
  onUpdate,
}: ImageUploadCardProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingFile = useRef<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    pendingFile.current = file;
    setPreview(URL.createObjectURL(file));
    setImgError(false);
  };

  const handleUpload = async () => {
    const file = pendingFile.current;
    if (!file) return;

    setLoading(true);
    try {
      // Delete old image if replacing
      if (currentUrl) {
        const oldPath = extractStoragePath(currentUrl);
        if (oldPath) {
          try {
            await deleteImageFromStorage(oldPath);
          } catch {
            // Old file may already be gone
          }
        }
      }

      const { url } = await uploadImage(file, folder);
      await upsertSiteContent(contentKey, url);
      onUpdate(contentKey, url);
      setPreview(null);
      pendingFile.current = null;
      toast.success(`${label} uploaded successfully`);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUrl) return;
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return;

    setLoading(true);
    try {
      const path = extractStoragePath(currentUrl);
      if (path) {
        try {
          await deleteImageFromStorage(path);
        } catch {
          // May already be gone
        }
      }
      await upsertSiteContent(contentKey, null);
      onUpdate(contentKey, null);
      toast.success(`${label} deleted`);
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const cancelPreview = () => {
    setPreview(null);
    pendingFile.current = null;
    if (fileRef.current) fileRef.current.value = "";
  };

  const displayUrl = preview || currentUrl;

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <p className="text-sm font-medium text-foreground">{label}</p>

      {/* Image preview */}
      <div className="relative w-full h-36 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
        {displayUrl && !imgError ? (
          <img
            src={displayUrl}
            alt={label}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
        )}
        {preview && (
          <span className="absolute top-2 left-2 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
            Preview
          </span>
        )}
      </div>

      {/* Actions */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="flex flex-wrap gap-2">
        {preview ? (
          <>
            <Button
              size="sm"
              onClick={handleUpload}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1" />
              ) : (
                <Upload className="w-3.5 h-3.5 mr-1" />
              )}
              {loading ? "Uploading…" : "Confirm Upload"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={cancelPreview}
              disabled={loading}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileRef.current?.click()}
              disabled={loading}
              className="flex-1"
            >
              <Upload className="w-3.5 h-3.5 mr-1" />
              {currentUrl ? "Replace" : "Upload"}
            </Button>
            {currentUrl && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
