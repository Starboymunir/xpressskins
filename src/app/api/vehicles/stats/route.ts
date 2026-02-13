import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServiceClient();

    // Get total count
    const { count } = await supabase
      .from("vehicles")
      .select("*", { count: "exact", head: true });

    // Get unique makes
    const { data: makesData } = await supabase
      .from("vehicles")
      .select("make");

    const uniqueMakes = new Set((makesData ?? []).map((v: { make: string }) => v.make));

    return NextResponse.json({
      totalVehicles: count ?? 0,
      totalMakes: uniqueMakes.size,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
