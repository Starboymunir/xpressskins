import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { customer_email, project_id, order_id, description, reference_images } = await request.json();

    if (!customer_email || !description) {
      return NextResponse.json(
        { error: "Email and description are required." },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Get next revision number for this customer
    const { data: existing } = await supabase
      .from("revisions")
      .select("revision_number")
      .eq("customer_email", customer_email)
      .order("revision_number", { ascending: false })
      .limit(1);

    const nextNumber = (existing?.[0]?.revision_number ?? 0) + 1;

    const { data, error } = await supabase
      .from("revisions")
      .insert({
        customer_email,
        project_id: project_id || null,
        order_id: order_id || null,
        revision_number: nextNumber,
        description,
        reference_images: reference_images || [],
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id, revision_number: nextNumber });
  } catch {
    return NextResponse.json({ error: "Failed to create revision" }, { status: 500 });
  }
}
