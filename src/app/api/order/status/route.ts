import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendEmail } from "@/lib/zeptomail";
import { ebookDownloadEmail, hardcopyConfirmationEmail } from "@/lib/emails";
import { type NextRequest } from "next/server";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return Response.json({ error: "Session ID is required" }, { status: 400 });
    }

    // Check if the webhook already created the order
    const existing = await prisma.order.findFirst({
      where: { stripeSessionId: sessionId },
    });

    if (existing) {
      return Response.json({
        status: "COMPLETE",
        type: existing.type,
        name: existing.name,
        email: existing.email,
        downloadToken: existing.downloadToken,
      });
    }

    // Webhook hasn't fired yet (common in local dev) — verify directly with Stripe
    // and fulfill the order ourselves as a fallback.
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      // Payment not confirmed yet — keep polling
      return Response.json({ status: "PENDING" });
    }

    const meta = session.metadata ?? {};
    const email = session.customer_email ?? "";
    const name = meta.customerName ?? "Customer";
    const productType = meta.productType as "EBOOK" | "HARDCOPY";

    if (productType === "EBOOK") {
      const downloadToken = randomUUID();
      const downloadExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

      const order = await prisma.order.create({
        data: {
          email,
          name,
          type: "EBOOK",
          stripeSessionId: session.id,
          stripePaymentId: session.payment_intent as string | undefined,
          status: "PAID",
          downloadToken,
          downloadExpiresAt,
        },
      });

      const downloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/download/${downloadToken}`;
      await sendEmail({
        to: email,
        toName: name,
        subject: "Your copy of Think Like a King is ready",
        html: ebookDownloadEmail({ name, downloadUrl }),
      });

      console.log(`[order/status] Fallback: e-book order created for ${email}`);

      return Response.json({
        status: "COMPLETE",
        type: order.type,
        name: order.name,
        email: order.email,
        downloadToken: order.downloadToken,
      });
    }

    if (productType === "HARDCOPY") {
      const address = {
        line1: meta.addressLine1,
        line2: meta.addressLine2 || null,
        city: meta.addressCity,
        state: meta.addressState || null,
        postalCode: meta.addressPostalCode,
        country: meta.addressCountry,
      };

      const order = await prisma.order.create({
        data: {
          email,
          name,
          type: "HARDCOPY",
          stripeSessionId: session.id,
          stripePaymentId: session.payment_intent as string | undefined,
          status: "PAID",
          shippingAddress: {
            create: address,
          },
        },
      });

      await sendEmail({
        to: email,
        toName: name,
        subject: "Order confirmed — Think Like a King",
        html: hardcopyConfirmationEmail({ name, address }),
      });

      console.log(`[order/status] Fallback: hardcopy order ${order.id} created for ${email}`);

      return Response.json({
        status: "COMPLETE",
        type: order.type,
        name: order.name,
        email: order.email,
        downloadToken: null,
      });
    }

    // Unknown product type
    return Response.json({ status: "PENDING" });
  } catch (error) {
    console.error("[api/order/status]", error);
    return Response.json({ error: "Failed to fetch order status" }, { status: 500 });
  }
}
