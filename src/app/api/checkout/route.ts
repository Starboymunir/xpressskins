import { NextRequest, NextResponse } from "next/server";
import { SquareClient } from "square";
import { createServiceClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

/* ── Square client (singleton) ─────────────────────────── */
const square = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment: process.env.SQUARE_ENVIRONMENT === "production" ? "production" : "sandbox",
});

/* ── Auto-resolve location ID ──────────────────────────── */
let cachedLocationId: string | null = null;

async function getLocationId(): Promise<string> {
  if (process.env.SQUARE_LOCATION_ID) return process.env.SQUARE_LOCATION_ID;
  if (cachedLocationId) return cachedLocationId;

  const response = await square.locations.list();
  const locations = response.locations ?? [];
  if (!locations.length) throw new Error("No Square locations found — check your access token.");
  cachedLocationId = locations[0].id!;
  return cachedLocationId;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      product_name,
      product_slug,
      wrap_type,
      total_price,
      deposit_amount,
      customer_email,
      customer_name,
      vehicle_info,
      design_tier,
    } = body;

    if (!total_price || !deposit_amount) {
      return NextResponse.json(
        { error: "Price information is required." },
        { status: 400 }
      );
    }

    const depositCents = Math.round(deposit_amount * 100);
    const origin = request.nextUrl.origin;

    // Generate order number
    const orderNumber = `XS-${Date.now().toString(36).toUpperCase()}`;

    const locationId = await getLocationId();

    // Create Square Payment Link for 25 % deposit
    const linkResponse = await square.checkout.paymentLinks.create({
      idempotencyKey: randomUUID(),
      quickPay: {
        name: `${product_name || "Custom Wrap"} — 25% Deposit`,
        priceMoney: {
          amount: BigInt(depositCents),
          currency: "USD",
        },
        locationId,
      },
      checkoutOptions: {
        redirectUrl: `${origin}/checkout/success?order=${orderNumber}`,
      },
      paymentNote: `Order ${orderNumber} | ${wrap_type || "wrap"} | Total: $${total_price}`,
    });

    const paymentLink = linkResponse.paymentLink;
    if (!paymentLink?.url) {
      throw new Error("Square did not return a payment link URL.");
    }

    // Create order in Supabase (status: pending until webhook confirms)
    const supabase = createServiceClient();
    await supabase.from("orders").insert({
      order_number: orderNumber,
      customer_email: customer_email || "",
      customer_name: customer_name || "",
      vehicle_info: vehicle_info || "",
      wrap_type: wrap_type || "",
      design_tier: design_tier || "",
      total_price: total_price,
      deposit_amount: deposit_amount,
      amount_paid: 0,
      square_payment_link_id: paymentLink.id || "",
      square_order_id: paymentLink.orderId || "",
      payment_status: "pending",
      status: "pending",
    });

    return NextResponse.json({ url: paymentLink.url, order_number: orderNumber });
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
