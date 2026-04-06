import { useState, useEffect } from "react";
import { getAllSiteContent } from "@/lib/imageStorage";

/** Fetches all site_content rows once and returns a key→url map */
export function useSiteContent() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSiteContent()
      .then(setContent)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { content, loading };
}
