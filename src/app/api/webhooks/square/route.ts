import { NextRequest, NextResponse } from "next/server";
import { WebhooksHelper } from "square";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Square webhook handler.
 *
 * After deploying, register this URL in the Square Developer Dashboard:
 *   https://developer.squareup.com → Application → Webhooks
 *   URL: https://your-domain.com/api/webhooks/square
 *   Events: payment.completed
 *
 * Then copy the Signature Key into SQUARE_WEBHOOK_SIGNATURE_KEY in your env.
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signatureHeader = request.headers.get("x-square-hmacsha256-signature") || "";

  /* ── Signature verification (skip if key not yet configured) ── */
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (signatureKey) {
    const notificationUrl = `${request.nextUrl.origin}/api/webhooks/square`;

    const isValid = await WebhooksHelper.verifySignature({
      requestBody: body,
      signatureHeader,
      signatureKey,
      notificationUrl,
    });

    if (!isValid) {
      console.error("Square webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  /* ── Parse event ────────────────────────────────────────────── */
  let event: {
    type: string;
    data?: {
      type?: string;
      id?: string;
      object?: {
        payment?: {
          id?: string;
          status?: string;
          orderId?: string;
          order_id?: string;
          amountMoney?: { amount?: number; currency?: string };
          amount_money?: { amount?: number; currency?: string };
          note?: string;
          receiptUrl?: string;
          receipt_url?: string;
          buyerEmailAddress?: string;
          buyer_email_address?: string;
        };
      };
    };
  };

  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case "payment.completed": {
      const payment = event.data?.object?.payment;
      if (!payment) break;

      const note = payment.note || "";
      // We encode the order number in the payment note: "Order XS-ABC123 | ..."
      const orderMatch = note.match(/Order\s+(XS-[A-Z0-9]+)/i);
      const orderNumber = orderMatch?.[1];

      if (orderNumber) {
        const depositAmount = Number(
          (payment.amountMoney?.amount ?? payment.amount_money?.amount ?? 0)
        ) / 100;

        await supabase
          .from("orders")
          .update({
            payment_status: "deposit_paid",
            status: "confirmed",
            amount_paid: depositAmount,
            square_payment_id: payment.id || "",
            customer_email:
              payment.buyerEmailAddress || payment.buyer_email_address || "",
          })
          .eq("order_number", orderNumber);

        // Upsert customer
        const email =
          payment.buyerEmailAddress || payment.buyer_email_address;
        if (email) {
          await supabase.from("customers").upsert(
            { name: "", email, phone: "" },
            { onConflict: "email" }
          );
        }
      }
      break;
    }

    default:
      // Unhandled event type — ignore
      break;
  }

  return NextResponse.json({ received: true });
}
