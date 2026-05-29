# Think Like a King

> *"The world is not short of problems. It is short of governed minds."*

A full-stack e-commerce storefront for the book **Think Like a King** by Michael King — built with Next.js 16, Stripe, Prisma, Resend, and Lulu print-on-demand. Customers can purchase a token-secured digital download or a premium hardcover edition shipped globally.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
  - [Checkout Flow](#checkout-flow)
  - [Order Fulfillment](#order-fulfillment)
  - [Download System](#download-system)
  - [Webhook Architecture](#webhook-architecture)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Email Templates](#email-templates)
- [Deployment Notes](#deployment-notes)

---

## Overview

The site is a single-page storefront with a modal-based checkout. There are two purchasable editions:

| Edition | Price | Fulfillment |
|---|---|---|
| **E-Book** | $9.99 (configurable) | Token-secured download link emailed instantly |
| **Hardcover** | $24.99 (configurable) | Print-on-demand via Lulu, shipped globally |

Payment is handled entirely by Stripe Checkout. After a successful payment, the success page polls the order status API which verifies the session directly with Stripe as a fallback — meaning the flow works in local development without a live webhook tunnel.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Prisma 7 + `@prisma/adapter-pg` |
| Payments | Stripe (Checkout Sessions, Webhooks) |
| Email | Resend |
| Print-on-Demand | Lulu Direct API |
| Fonts | Germania One, Nunito (Google Fonts) |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                        # Landing page / storefront
│   ├── layout.tsx                      # Root layout, fonts, metadata
│   ├── globals.css                     # Global styles
│   ├── checkout/
│   │   ├── success/page.tsx            # Post-payment success + polling UI
│   │   └── cancel/page.tsx             # Cancelled checkout page
│   └── api/
│       ├── checkout/
│       │   ├── ebook/route.ts          # POST — create Stripe session (e-book)
│       │   └── hardcopy/route.ts       # POST — create Stripe session (hardcopy)
│       ├── order/
│       │   └── status/route.ts         # GET  — poll order status + fallback fulfillment
│       ├── download/
│       │   └── [token]/route.ts        # GET  — validate token, redirect to file
│       └── webhooks/
│           ├── stripe/route.ts         # POST — Stripe checkout.session.completed
│           └── lulu/route.ts           # POST — Lulu LINE_ITEM_SHIPPED
├── components/
│   └── CheckoutModal.tsx               # Two-step checkout modal (edition select → details)
└── lib/
    ├── prisma.ts                       # Prisma client singleton (pg adapter)
    ├── stripe.ts                       # Stripe client
    ├── resend.ts                       # Resend client
    └── emails.ts                       # HTML email templates (ebook, hardcopy, shipped)

prisma/
├── schema.prisma                       # Order, ShippingAddress, enums
└── migrations/                         # Migration history
```

---

## How It Works

### Checkout Flow

1. Customer clicks **Buy the Book** anywhere on the landing page.
2. The `CheckoutModal` opens with a two-step flow:
   - **Step 1** — Choose edition (E-Book or Hardcover). A 1.5s transition plays before advancing.
   - **Step 2** — Enter name, email, and (for hardcopy) a shipping address.
3. On submit, the modal calls either `POST /api/checkout/ebook` or `POST /api/checkout/hardcopy`.
4. The API creates a Stripe Checkout Session using `price_data` with the amount read from env — no pre-created Stripe products required.
5. The customer is redirected to Stripe's hosted checkout page.
6. On completion, Stripe redirects to `/checkout/success?session_id=cs_...`.

### Order Fulfillment

The success page polls `GET /api/order/status?session_id=...` every 1.5 seconds (up to 20 attempts / 30 seconds).

The status endpoint uses a two-path strategy:

```
1. Check DB for existing order  →  found → return COMPLETE
                                ↓
                             not found
                                ↓
2. Retrieve session from Stripe → payment_status !== "paid" → return PENDING
                                ↓
                           payment confirmed
                                ↓
3. Create order in DB + send email → return COMPLETE
```

This means the flow works in two scenarios:
- **Production** — Stripe webhook fires first, creates the order, DB lookup hits immediately.
- **Local dev** — Webhook can't reach localhost, so the status endpoint creates the order itself on the first confirmed poll.

### Download System

E-book downloads use a UUID token stored on the order record.

- Token is generated at order creation time and expires after **48 hours**.
- `GET /api/download/[token]` validates the token, checks expiry, marks `downloadedAt` on first access, then issues a `302` redirect to `EBOOK_FILE_URL`.
- In production, `EBOOK_FILE_URL` should be a short-lived signed URL from S3 or Vercel Blob — not a permanent public link.

### Webhook Architecture

**Stripe** (`POST /api/webhooks/stripe`)
- Verifies the `stripe-signature` header using `STRIPE_WEBHOOK_SECRET`.
- Only handles `checkout.session.completed`.
- Routes to `handleEbook` or `handleHardcopy` based on `metadata.productType`.
- Creates the order record and sends the appropriate confirmation email.

**Lulu** (`POST /api/webhooks/lulu`)
- Verifies the `x-lulu-signature` header using HMAC-SHA256 and `LULU_WEBHOOK_SECRET`.
- Only handles `LINE_ITEM_SHIPPED`.
- Finds the order by `luluOrderId`, updates status to `SHIPPED`, saves tracking info, and sends the shipping notification email.

---

## Environment Variables

Copy `.env` and fill in the values. All variables are required unless marked optional.

```env
# ── Database ──────────────────────────────────────────────────────────────────
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"

# ── App ───────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# ── Stripe ────────────────────────────────────────────────────────────────────
# https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY="sk_test_..."

# https://dashboard.stripe.com/webhooks — add endpoint: /api/webhooks/stripe
# Events to listen for: checkout.session.completed
STRIPE_WEBHOOK_SECRET="whsec_..."

# ── Pricing (in cents — no Stripe products needed) ────────────────────────────
EBOOK_PRICE_CENTS="999"        # $9.99
HARDCOPY_PRICE_CENTS="2499"    # $24.99

# ── Resend ────────────────────────────────────────────────────────────────────
# https://resend.com/api-keys
RESEND_API_KEY="re_..."
# Must be a verified sender domain in Resend
EMAIL_FROM="orders@yourdomain.com"

# ── E-Book File ───────────────────────────────────────────────────────────────
# Direct URL or signed URL to the PDF/EPUB file
EBOOK_FILE_URL="https://..."

# ── Lulu (Print-on-Demand) ────────────────────────────────────────────────────
# https://developers.lulu.com
LULU_API_KEY="..."
LULU_WEBHOOK_SECRET="..."
```

---

## Database

The schema has two models:

**`Order`** — one record per completed purchase.

| Field | Type | Notes |
|---|---|---|
| `id` | `String` (cuid) | Primary key |
| `email` | `String` | Customer email |
| `name` | `String` | Customer name |
| `type` | `ProductType` | `EBOOK` or `HARDCOPY` |
| `stripeSessionId` | `String` (unique) | Stripe Checkout Session ID |
| `stripePaymentId` | `String?` | Stripe PaymentIntent ID |
| `status` | `OrderStatus` | `PENDING → PAID → PROCESSING → SHIPPED` |
| `downloadToken` | `String?` (unique) | UUID for e-book download |
| `downloadExpiresAt` | `DateTime?` | 48h from order creation |
| `downloadedAt` | `DateTime?` | First download timestamp |
| `luluOrderId` | `String?` | Lulu order reference |
| `trackingNumber` | `String?` | Courier tracking number |
| `trackingUrl` | `String?` | Courier tracking link |
| `shippedAt` | `DateTime?` | Timestamp when shipped |

**`ShippingAddress`** — one-to-one with `Order`, hardcopy only.

| Field | Type |
|---|---|
| `line1` | `String` |
| `line2` | `String?` |
| `city` | `String` |
| `state` | `String?` |
| `postalCode` | `String` |
| `country` | `String` (ISO 3166-1 alpha-2) |

**Run migrations:**

```bash
npx prisma migrate dev
```

**Open Prisma Studio:**

```bash
npx prisma studio
```

---

## Getting Started

**Prerequisites:** Node.js 20+, PostgreSQL (local or hosted)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
# Edit .env with your actual keys (see Environment Variables above)

# 3. Run database migrations
npx prisma migrate dev

# 4. Start the development server
npm run dev
```

The app will be at `http://localhost:3000`.

**Testing payments locally:**

Use Stripe's test card `4242 4242 4242 4242` with any future expiry and any CVC. The order status endpoint will verify the payment directly with Stripe after redirect — no webhook tunnel needed in development.

For webhook testing in dev, use the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## API Reference

### `POST /api/checkout/ebook`

Creates a Stripe Checkout Session for the e-book.

**Request body:**
```json
{ "name": "John Doe", "email": "john@example.com" }
```

**Response:**
```json
{ "url": "https://checkout.stripe.com/..." }
```

---

### `POST /api/checkout/hardcopy`

Creates a Stripe Checkout Session for the hardcover edition.

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "address": {
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "US"
  }
}
```

**Response:**
```json
{ "url": "https://checkout.stripe.com/..." }
```

---

### `GET /api/order/status?session_id=cs_...`

Polls order status after checkout. Creates the order as a fallback if the webhook hasn't fired yet.

**Response (pending):**
```json
{ "status": "PENDING" }
```

**Response (complete):**
```json
{
  "status": "COMPLETE",
  "type": "EBOOK",
  "name": "John Doe",
  "email": "john@example.com",
  "downloadToken": "uuid-here-or-null"
}
```

---

### `GET /api/download/[token]`

Validates a download token and redirects to the e-book file.

| Status | Meaning |
|---|---|
| `302` | Valid token — redirects to file |
| `404` | Token not found |
| `410` | Token expired |
| `503` | `EBOOK_FILE_URL` not configured |

---

### `POST /api/webhooks/stripe`

Stripe webhook endpoint. Requires `stripe-signature` header.

Handles: `checkout.session.completed`

---

### `POST /api/webhooks/lulu`

Lulu webhook endpoint. Requires `x-lulu-signature` header (HMAC-SHA256).

Handles: `LINE_ITEM_SHIPPED`

---

## Email Templates

All emails are plain HTML built in `src/lib/emails.ts` with no external template engine. They share a dark-themed base layout matching the site's aesthetic — dark background (`#1a1714`), gold accents (`#c9a84c`), serif typography.

| Template | Trigger | Content |
|---|---|---|
| `ebookDownloadEmail` | E-book order confirmed | Secure download button + fallback link, 48h expiry notice |
| `hardcopyConfirmationEmail` | Hardcopy order confirmed | Formatted shipping address, estimated delivery window |
| `hardcopyShippedEmail` | Lulu `LINE_ITEM_SHIPPED` webhook | Tracking number + carrier tracking button |

---

## Deployment Notes

- Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://thinklikeaking.com`).
- Register `/api/webhooks/stripe` in the Stripe dashboard under **Developers → Webhooks**. Subscribe to `checkout.session.completed` only.
- Register `/api/webhooks/lulu` in the Lulu developer dashboard. Set `LULU_WEBHOOK_SECRET` to match.
- `EBOOK_FILE_URL` should point to a protected file URL. For Vercel Blob or S3, generate a short-lived signed URL at download time rather than storing a permanent public link.
- The Prisma adapter uses the `pg` connection pool directly — ensure `DATABASE_URL` points to a connection pooler (e.g. PgBouncer or Neon's pooled endpoint) in production to avoid exhausting connections.
- Prices are controlled entirely via `EBOOK_PRICE_CENTS` and `HARDCOPY_PRICE_CENTS` in env. No Stripe dashboard products are required.

---

*© Think Like a King — Revere & Regent Press*
