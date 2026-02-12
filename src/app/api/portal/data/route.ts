import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type");
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json([], { status: 200 });
  }

  const supabase = createServiceClient();

  if (type === "projects") {
    const { data } = await supabase
      .from("projects")
      .select("id, title")
      .eq("customer_email", email)
      .order("created_at", { ascending: false });
    return NextResponse.json(data ?? []);
  }

  if (type === "orders") {
    const { data } = await supabase
      .from("orders")
      .select("id, order_number")
      .eq("customer_email", email)
      .order("created_at", { ascending: false });
    return NextResponse.json(data ?? []);
  }

  return NextResponse.json([]);
}
