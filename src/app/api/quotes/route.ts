import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, vehicle_info, wrap_type, message, reference_images } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Upsert customer
    const { data: customer } = await supabase
      .from("customers")
      .upsert(
        { name, email, phone: phone || null },
        { onConflict: "email" }
      )
      .select("id")
      .single();

    // Create quote
    const { data: quote, error } = await supabase
      .from("quotes")
      .insert({
        customer_id: customer?.id ?? null,
        name,
        email,
        phone: phone || null,
        vehicle_info: vehicle_info || null,
        wrap_type: wrap_type || null,
        message: message || null,
        reference_images: reference_images || [],
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Quote insert error:", error);
      return NextResponse.json({ error: "Failed to submit quote." }, { status: 500 });
    }

    // Update customer quote count
    if (customer?.id) {
      await supabase.rpc("increment_customer_quotes", { customer_id_input: customer.id }).catch(() => {
        // Fallback: direct update
        supabase.from("customers").update({ total_quotes: (customer as any).total_quotes + 1 }).eq("id", customer.id);
      });
    }

    return NextResponse.json({ success: true, quoteId: quote?.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
