import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Student {
  id: string;
  roll_number: string;
  name: string;
  phone: string | null;
  first_year_image: string | null;
  final_year_image: string | null;
  description: string | null;
  sort_order: number;
}

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: async (): Promise<Student[]> => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Student[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
