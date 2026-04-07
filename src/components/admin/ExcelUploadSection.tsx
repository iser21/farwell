import { useState, useCallback, useRef } from "react";
import { Upload, FileSpreadsheet, AlertCircle, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseExcelFile, type ParsedStudent } from "@/lib/excelParser";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export function ExcelUploadSection() {
  const [parsed, setParsed] = useState<ParsedStudent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setParsed(null);
    setFileName(file.name);

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext || "")) {
      setError("Invalid file type. Please upload .xlsx, .xls, or .csv");
      return;
    }

    try {
      const students = await parseExcelFile(file);
      setParsed(students);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to parse file.");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleSave = async () => {
    if (!parsed || parsed.length === 0) return;
    setSaving(true);
    try {
      // Delete existing students first
      const { error: delErr } = await supabase.from("students").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (delErr) throw delErr;

      // Insert new students in batches of 50
      for (let i = 0; i < parsed.length; i += 50) {
        const batch = parsed.slice(i, i + 50).map((s, idx) => ({
          name: s.name,
          roll_number: s.roll_number || `AUTO-${i + idx + 1}`,
          phone: s.phone || null,
          first_year_image: s.first_year_image || null,
          final_year_image: s.final_year_image || null,
          description: s.description || null,
          sort_order: i + idx + 1,
        }));
        const { error: insErr } = await supabase.from("students").insert(batch);
        if (insErr) throw insErr;
      }

      await queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success(`${parsed.length} students imported successfully!`);
      setParsed(null);
      setFileName(null);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save students.");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setParsed(null);
    setError(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <FileSpreadsheet className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drag & drop an Excel/CSV file here, or <span className="text-primary font-medium">click to browse</span>
        </p>
        {fileName && (
          <p className="mt-2 text-xs text-foreground font-medium">{fileName}</p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview */}
      {parsed && parsed.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Preview — {parsed.length} students found
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <Trash2 className="w-4 h-4 mr-1" /> Clear
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-1" />
                ) : (
                  <Check className="w-4 h-4 mr-1" />
                )}
                {saving ? "Saving…" : "Confirm & Save"}
              </Button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-auto rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsed.slice(0, 20).map((s, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell className="font-mono text-xs">{s.roll_number || "—"}</TableCell>
                    <TableCell className="font-mono text-xs">{s.phone || "—"}</TableCell>
                  </TableRow>
                ))}
                {parsed.length > 20 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground text-xs py-2">
                      … and {parsed.length - 20} more students
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
