import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    console.error("Webhook sig error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderNumber = session.metadata?.order_number;
      const depositAmount = parseFloat(session.metadata?.deposit_amount || "0");

      if (orderNumber) {
        // Update order: mark deposit paid
        await supabase
          .from("orders")
          .update({
            payment_status: "deposit_paid",
            status: "confirmed",
            amount_paid: depositAmount,
            stripe_payment_intent: session.payment_intent as string,
            customer_email: session.customer_email || session.metadata?.customer_name || "",
          })
          .eq("order_number", orderNumber);

        // Also upsert customer if email is available
        const email = session.customer_email || session.metadata?.customer_name;
        if (email) {
          await supabase
            .from("customers")
            .upsert(
              {
                name: session.metadata?.customer_name || "",
                email,
                phone: "",
              },
              { onConflict: "email" }
            );
        }
      }
      break;
    }

    case "payment_intent.succeeded": {
      // Handle subsequent payments (50% and 25%) if needed
      const intent = event.data.object as Stripe.PaymentIntent;
      console.log("Payment succeeded:", intent.id);
      break;
    }

    default:
      // Unhandled event type
      break;
  }

  return NextResponse.json({ received: true });
}
