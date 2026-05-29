import { stripe } from "@/lib/stripe";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return Response.json({ error: "Email and name are required" }, { status: 400 });
    }

    if (!process.env.EBOOK_PRICE_CENTS || !process.env.NEXT_PUBLIC_SITE_URL) {
      throw new Error("Missing EBOOK_PRICE_CENTS or NEXT_PUBLIC_SITE_URL");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: parseInt(process.env.EBOOK_PRICE_CENTS, 10),
            product_data: {
              name: "Think Like a King — E-Book",
            },
          },
        },
      ],
      customer_email: email,
      metadata: {
        customerName: name,
        productType: "EBOOK",
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("[checkout/ebook]", error);
    return Response.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
