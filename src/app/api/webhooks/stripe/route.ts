import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/zeptomail";
import { ebookDownloadEmail, hardcopyConfirmationEmail } from "@/lib/emails";
import { type NextRequest } from "next/server";
import { randomUUID } from "crypto";
import type Stripe from "stripe";

// Stripe requires the raw body for signature verification
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return new Response("Server misconfiguration", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("[stripe-webhook] Signature verification failed:", err);
    return new Response(`Webhook error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  // Only handle completed checkouts
  if (event.type !== "checkout.session.completed") {
    return new Response("Unhandled event type", { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const meta = session.metadata ?? {};
  const email = session.customer_email ?? "";
  const name = meta.customerName ?? "Customer";
  const productType = meta.productType as "EBOOK" | "HARDCOPY";

  try {
    if (productType === "EBOOK") {
      await handleEbook({ session, email, name });
    } else if (productType === "HARDCOPY") {
      await handleHardcopy({ session, email, name, meta });
    }
  } catch (err) {
    console.error("[stripe-webhook] Handler error:", err);
    return new Response("Handler error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}

// ── E-Book handler ────────────────────────────────────────────────────────────

async function handleEbook({
  session,
  email,
  name,
}: {
  session: Stripe.Checkout.Session;
  email: string;
  name: string;
}) {
  const downloadToken = randomUUID();
  const downloadExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h

  // Save order to DB
  await prisma.order.create({
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

  // Send download email
  const downloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/download/${downloadToken}`;

  await sendEmail({
    to: email,
    toName: name,
    subject: "Your copy of Think Like a King is ready",
    html: ebookDownloadEmail({ name, downloadUrl }),
  });

  console.log(
    `[stripe-webhook] E-book order created and email sent to ${email}`,
  );
}

// ── Hard Copy handler ─────────────────────────────────────────────────────────

async function handleHardcopy({
  session,
  email,
  name,
  meta,
}: {
  session: Stripe.Checkout.Session;
  email: string;
  name: string;
  meta: Record<string, string>;
}) {
  const address = {
    line1: meta.addressLine1,
    line2: meta.addressLine2 || null,
    city: meta.addressCity,
    state: meta.addressState || null,
    postalCode: meta.addressPostalCode,
    country: meta.addressCountry,
  };

  // Save order + shipping address to prisma
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

  // TODO: Submit to Lulu print-on-demand API here
  // const luluOrderId = await submitToLulu(order, address);
  // await db.order.update({ where: { id: order.id }, data: { luluOrderId, status: "PROCESSING" } });

  // Send confirmation email
  await sendEmail({
    to: email,
    toName: name,
    subject: "Order confirmed — Think Like a King",
    html: hardcopyConfirmationEmail({ name, address }),
  });

  console.log(
    `[stripe-webhook] Hardcopy order ${order.id} created for ${email}`,
  );
}
