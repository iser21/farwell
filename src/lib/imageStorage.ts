import { supabase } from "@/integrations/supabase/client";

const BUCKET = "images";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export interface UploadResult {
  url: string;
  path: string;
}

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only JPG, PNG, and WebP images are allowed.";
  }
  if (file.size > MAX_SIZE) {
    return "File size must be under 5MB.";
  }
  return null;
}

export async function uploadImage(
  file: File,
  folder: string
): Promise<UploadResult> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false });

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteImageFromStorage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

export async function upsertSiteContent(
  key: string,
  value: string | null
): Promise<void> {
  if (value === null) {
    const { error } = await supabase
      .from("site_content")
      .delete()
      .eq("key", key);
    if (error) throw new Error(`DB delete failed: ${error.message}`);
    return;
  }

  const { error } = await supabase.from("site_content").upsert(
    { key, value, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );
  if (error) throw new Error(`DB save failed: ${error.message}`);
}

export async function getSiteContent(key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw new Error(`DB read failed: ${error.message}`);
  return data?.value ?? null;
}

export async function getAllSiteContent(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("site_content")
    .select("key, value");
  if (error) throw new Error(`DB read failed: ${error.message}`);
  const map: Record<string, string> = {};
  for (const row of data || []) {
    if (row.value) map[row.key] = row.value;
  }
  return map;
}

/** Extract storage path from a public URL */
export function extractStoragePath(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}
