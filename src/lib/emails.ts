const base = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Think Like a King</title>
</head>
<body style="margin:0;padding:0;background:#f5f0ea;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0ea;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1714;border-radius:6px;overflow:hidden;max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #2e2b27;text-align:center;">
              <p style="margin:0;color:#c9a84c;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">Revere &amp; Regent Press</p>
              <h1 style="margin:8px 0 0;color:#f5f0ea;font-size:22px;font-weight:400;letter-spacing:0.05em;">Think Like a King</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #2e2b27;text-align:center;">
              <p style="margin:0;color:#6b6560;font-size:11px;">
                &copy; ${new Date().getFullYear()} Think Like a King &mdash; Revere &amp; Regent Press
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ── E-Book Download Email ────────────────────────────────────────────────────

export function ebookDownloadEmail({
  name,
  downloadUrl,
}: {
  name: string;
  downloadUrl: string;
}) {
  return base(`
    <p style="margin:0 0 8px;color:#c9a84c;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Your copy is ready</p>
    <h2 style="margin:0 0 20px;color:#f5f0ea;font-size:20px;font-weight:400;">Hello, ${name}.</h2>
    <p style="margin:0 0 16px;color:#a09890;font-size:14px;line-height:1.7;">
      Thank you for your order. Your copy of <strong style="color:#f5f0ea;">Think Like a King</strong> is ready to download.
    </p>
    <p style="margin:0 0 28px;color:#a09890;font-size:14px;line-height:1.7;font-style:italic;">
      This link expires in 48 hours.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      <tr>
        <td style="background:#c9a84c;border-radius:3px;">
          <a href="${downloadUrl}" style="display:inline-block;padding:14px 32px;color:#13110e;font-size:13px;font-weight:bold;text-decoration:none;letter-spacing:0.08em;">
            Download Your Book &rarr;
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0;color:#6b6560;font-size:12px;line-height:1.6;">
      If the button doesn't work, copy this link into your browser:<br />
      <a href="${downloadUrl}" style="color:#c9a84c;">${downloadUrl}</a>
    </p>
  `);
}

// ── Hard Copy Order Confirmation Email ───────────────────────────────────────

export function hardcopyConfirmationEmail({
  name,
  address,
}: {
  name: string;
  address: {
    line1: string;
    line2?: string | null;
    city: string;
    state?: string | null;
    postalCode: string;
    country: string;
  };
}) {
  const addressLines = [
    address.line1,
    address.line2,
    `${address.city}${address.state ? `, ${address.state}` : ""} ${address.postalCode}`,
    address.country,
  ]
    .filter(Boolean)
    .join("<br />");

  return base(`
    <p style="margin:0 0 8px;color:#c9a84c;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Order confirmed</p>
    <h2 style="margin:0 0 20px;color:#f5f0ea;font-size:20px;font-weight:400;">Hello, ${name}.</h2>
    <p style="margin:0 0 16px;color:#a09890;font-size:14px;line-height:1.7;">
      We've received your order for <strong style="color:#f5f0ea;">Think Like a King</strong> and it's now being prepared for print.
      You'll receive another email with your tracking information once your copy ships.
    </p>
    <div style="background:#13110e;border:1px solid #2e2b27;border-radius:4px;padding:20px 24px;margin:0 0 24px;">
      <p style="margin:0 0 4px;color:#c9a84c;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;">Shipping to</p>
      <p style="margin:0;color:#f5f0ea;font-size:14px;line-height:1.8;">${addressLines}</p>
    </div>
    <p style="margin:0;color:#6b6560;font-size:12px;line-height:1.6;">
      Expected delivery: 7–14 business days depending on your region.<br />
      Questions? Reply to this email.
    </p>
  `);
}

// ── Hard Copy Shipped / Tracking Email ───────────────────────────────────────

export function hardcopyShippedEmail({
  name,
  trackingNumber,
  trackingUrl,
}: {
  name: string;
  trackingNumber: string;
  trackingUrl: string;
}) {
  return base(`
    <p style="margin:0 0 8px;color:#c9a84c;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Your book is on its way</p>
    <h2 style="margin:0 0 20px;color:#f5f0ea;font-size:20px;font-weight:400;">Hello, ${name}.</h2>
    <p style="margin:0 0 16px;color:#a09890;font-size:14px;line-height:1.7;">
      <strong style="color:#f5f0ea;">Think Like a King</strong> has been dispatched and is on its way to you.
    </p>
    <div style="background:#13110e;border:1px solid #2e2b27;border-radius:4px;padding:20px 24px;margin:0 0 24px;">
      <p style="margin:0 0 4px;color:#c9a84c;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;">Tracking number</p>
      <p style="margin:0;color:#f5f0ea;font-size:14px;font-family:monospace;">${trackingNumber}</p>
    </div>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      <tr>
        <td style="background:#c9a84c;border-radius:3px;">
          <a href="${trackingUrl}" style="display:inline-block;padding:14px 32px;color:#13110e;font-size:13px;font-weight:bold;text-decoration:none;letter-spacing:0.08em;">
            Track Your Order &rarr;
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0;color:#6b6560;font-size:12px;line-height:1.6;">
      If the button doesn't work, copy this link:<br />
      <a href="${trackingUrl}" style="color:#c9a84c;">${trackingUrl}</a>
    </p>
  `);
}
