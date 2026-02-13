import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const XLSX = require("xlsx");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read the Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (rows.length < 2) {
      return NextResponse.json({ error: "Excel file is empty or has no data rows" }, { status: 400 });
    }

    // Skip header row, parse vehicles
    // Expected columns: 0=Brand, 1=Model, 2=Year, 3=Trim, 4-6=partial sqft, 7=100% sqft
    const vehicles: { make: string; model: string; year: number; trim: string; total_sqft: number }[] = [];
    const errors: string[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || !row[0]) continue; // skip empty rows

      const make = String(row[0] ?? "").trim();
      const model = String(row[1] ?? "").trim();
      const year = Number(row[2]);
      const trim = String(row[3] ?? "").trim();
      const totalSqft = Number(row[7]); // Column H = 100% sqft

      if (!make || !model || !year || isNaN(year)) {
        errors.push(`Row ${i + 1}: Missing make/model/year`);
        continue;
      }

      if (!totalSqft || isNaN(totalSqft) || totalSqft <= 0) {
        errors.push(`Row ${i + 1}: Invalid sqft for ${make} ${model} ${year}`);
        continue;
      }

      vehicles.push({ make, model, year, trim, total_sqft: totalSqft });
    }

    if (vehicles.length === 0) {
      return NextResponse.json(
        { error: "No valid vehicles found in file", errors },
        { status: 400 }
      );
    }

    // Upsert to Supabase — clear existing and bulk insert
    const supabase = createServiceClient();

    // Delete all existing vehicles
    const { error: deleteError } = await supabase.from("vehicles").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (deleteError) {
      return NextResponse.json(
        { error: `Failed to clear existing vehicles: ${deleteError.message}` },
        { status: 500 }
      );
    }

    // Insert in batches of 500
    const batchSize = 500;
    let inserted = 0;
    for (let i = 0; i < vehicles.length; i += batchSize) {
      const batch = vehicles.slice(i, i + batchSize);
      const { error: insertError } = await supabase.from("vehicles").insert(batch);
      if (insertError) {
        return NextResponse.json(
          { error: `Failed to insert batch at row ${i}: ${insertError.message}`, inserted },
          { status: 500 }
        );
      }
      inserted += batch.length;
    }

    return NextResponse.json({
      success: true,
      inserted,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully uploaded ${inserted} vehicles${errors.length > 0 ? ` (${errors.length} rows skipped)` : ""}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
