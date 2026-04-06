import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { getAllSiteContent, upsertSiteContent as dbUpsert } from "@/lib/imageStorage";

interface SiteContentContextType {
  content: Record<string, string>;
  loading: boolean;
  updateContent: (key: string, url: string | null) => void;
}

const SiteContentContext = createContext<SiteContentContextType>({
  content: {},
  loading: true,
  updateContent: () => {},
});

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSiteContent()
      .then(setContent)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateContent = useCallback((key: string, url: string | null) => {
    setContent((prev) => {
      const next = { ...prev };
      if (url) next[key] = url;
      else delete next[key];
      return next;
    });
  }, []);

  return (
    <SiteContentContext.Provider value={{ content, loading, updateContent }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
