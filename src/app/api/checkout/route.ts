import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    // Create Stripe Checkout Session for 25% deposit
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: depositCents,
            product_data: {
              name: `${product_name || "Custom Wrap"} — 25% Deposit`,
              description: `Deposit for ${wrap_type || "wrap"} (Total: $${total_price.toLocaleString()})`,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: customer_email || undefined,
      metadata: {
        order_number: orderNumber,
        product_slug: product_slug || "",
        wrap_type: wrap_type || "",
        total_price: String(total_price),
        deposit_amount: String(deposit_amount),
        customer_name: customer_name || "",
        vehicle_info: vehicle_info || "",
        design_tier: design_tier || "",
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/collections${product_slug ? `/${product_slug}` : ""}`,
    });

    // Create order in Supabase (status: pending until webhook confirms)
    const supabase = createServiceClient();
    await supabase.from("orders").insert({
      order_number: orderNumber,
      customer_email: customer_email || session.customer_email || "",
      customer_name: customer_name || "",
      vehicle_info: vehicle_info || "",
      wrap_type: wrap_type || "",
      design_tier: design_tier || "",
      total_price: total_price,
      deposit_amount: deposit_amount,
      amount_paid: 0,
      stripe_checkout_session: session.id,
      payment_status: "pending",
      status: "pending",
    });

    return NextResponse.json({ url: session.url, order_number: orderNumber });
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
