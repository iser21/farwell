import * as XLSX from "xlsx";

export interface ParsedStudent {
  name: string;
  roll_number: string;
  phone: string;
  first_year_image?: string;
  final_year_image?: string;
  description?: string;
}

const COLUMN_MAP: Record<string, keyof ParsedStudent> = {
  "full name": "name",
  name: "name",
  "roll number": "roll_number",
  "roll no": "roll_number",
  rollnumber: "roll_number",
  phone: "phone",
  "phone number": "phone",
  "phone no": "phone",
  mobile: "phone",
  "first year image": "first_year_image",
  "first_year_image": "first_year_image",
  "final year image": "final_year_image",
  "final_year_image": "final_year_image",
  description: "description",
};

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/[_\-]+/g, " ");
}

export function parseExcelFile(file: File): Promise<ParsedStudent[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        if (!sheet) {
          reject(new Error("Excel file has no sheets."));
          return;
        }

        const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        if (rows.length === 0) {
          reject(new Error("Excel file is empty."));
          return;
        }

        // Map headers
        const rawHeaders = Object.keys(rows[0]);
        const headerMap: Record<string, keyof ParsedStudent> = {};
        for (const h of rawHeaders) {
          const norm = normalizeHeader(h);
          if (COLUMN_MAP[norm]) headerMap[h] = COLUMN_MAP[norm];
        }

        if (!Object.values(headerMap).includes("name")) {
          reject(new Error("Missing required column: 'Full Name' or 'Name'."));
          return;
        }

        const students: ParsedStudent[] = [];
        for (const row of rows) {
          const s: Partial<ParsedStudent> = {};
          for (const [rawKey, field] of Object.entries(headerMap)) {
            const val = String(row[rawKey] ?? "").trim();
            if (val) (s as Record<string, string>)[field] = val;
          }
          if (s.name) {
            students.push({
              name: s.name,
              roll_number: s.roll_number || "",
              phone: s.phone || "",
              first_year_image: s.first_year_image,
              final_year_image: s.final_year_image,
              description: s.description,
            });
          }
        }

        if (students.length === 0) {
          reject(new Error("No valid student rows found."));
          return;
        }

        resolve(students);
      } catch {
        reject(new Error("Failed to parse file. Ensure it's a valid Excel or CSV file."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsArrayBuffer(file);
  });
}
