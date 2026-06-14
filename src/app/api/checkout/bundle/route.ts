import { stripe } from "@/lib/stripe";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, name, address } = await request.json();

    if (!email || !name || !address) {
      return Response.json(
        { error: "Email, name and address are required" },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      throw new Error("Missing NEXT_PUBLIC_SITE_URL");
    }

    // Default bundle price is 3000 cents ($30.00) unless BUNDLE_PRICE_CENTS is in env
    const priceCents = process.env.BUNDLE_PRICE_CENTS
      ? parseInt(process.env.BUNDLE_PRICE_CENTS, 10)
      : 3000;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: priceCents,
            product_data: {
              name: "Think Like a King — Sovereign Bundle (E-Book + Hardcover)",
              description: "Digital E-Book Edition (Instant Download) + Printed Hardcover linen edition shipped to your address.",
            },
          },
        },
      ],
      customer_email: email,
      metadata: {
        customerName: name,
        productType: "BUNDLE",
        // Shipping address stored in metadata for webhook retrieval
        addressLine1: address.line1,
        addressLine2: address.line2 ?? "",
        addressCity: address.city,
        addressState: address.state ?? "",
        addressPostalCode: address.postalCode,
        addressCountry: address.country,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("[checkout/bundle]", error);
    return Response.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
