import { resend, FROM_EMAIL } from "@/lib/resend";
import { hardcopyShippedEmail } from "@/lib/emails";
import { type NextRequest } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.text();

  // Verify Lulu webhook signature (HMAC-SHA256)
  if (process.env.LULU_WEBHOOK_SECRET) {
    const signature = request.headers.get("x-lulu-signature") ?? "";
    const expected = createHmac("sha256", process.env.LULU_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expected) {
      console.error("[lulu-webhook] Invalid signature");
      return new Response("Invalid signature", { status: 401 });
    }
  }

  let payload: {
    event: string;
    line_items?: Array<{
      tracking_id?: string;
      tracking_url?: string;
      external_id?: string; // Our luluOrderId
    }>;
  };

  try {
    payload = JSON.parse(body);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // Only act on shipment events
  if (payload.event !== "LINE_ITEM_SHIPPED") {
    return new Response("Unhandled event", { status: 200 });
  }

  const lineItem = payload.line_items?.[0];
  if (!lineItem?.external_id) {
    return new Response("No external_id in payload", { status: 400 });
  }

  try {
    // Find the order by luluOrderId
    const order = await prisma.order.findFirst({
      where: { luluOrderId: lineItem.external_id },
    });

    if (!order) {
      console.error(
        `[lulu-webhook] No order found for luluOrderId: ${lineItem.external_id}`,
      );
      return new Response("Order not found", { status: 404 });
    }

    const trackingNumber = lineItem.tracking_id ?? "N/A";
    const trackingUrl = lineItem.tracking_url ?? "#";

    // Update order status + tracking info
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "SHIPPED",
        trackingNumber,
        trackingUrl,
        shippedAt: new Date(),
      },
    });

    // ── AUTO-SEND TRACKING EMAIL ─────────────────────────────────────────────
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email,
      subject: "Your copy of Think Like a King is on its way",
      html: hardcopyShippedEmail({
        name: order.name,
        trackingNumber,
        trackingUrl,
      }),
    });

    console.log(
      `[lulu-webhook] Tracking email sent to ${order.email} — tracking: ${trackingNumber}`,
    );

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("[lulu-webhook] Error:", err);
    return new Response("Server error", { status: 500 });
  }
}
