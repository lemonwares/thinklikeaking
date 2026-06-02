if (!process.env.ZEPTOMAIL_API_KEY) {
  throw new Error("Missing ZEPTOMAIL_API_KEY environment variable");
}

export const FROM_EMAIL = process.env.EMAIL_FROM ?? "orders@thinklikeaking.com";
export const FROM_NAME = process.env.EMAIL_FROM_NAME ?? "Think Like a King";

const ZEPTOMAIL_API_URL = "https://api.zeptomail.com/v1.1/email";

interface SendEmailOptions {
  to: string;
  toName?: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  to,
  toName,
  subject,
  html,
}: SendEmailOptions): Promise<void> {
  const response = await fetch(ZEPTOMAIL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Zoho-enczapikey ${process.env.ZEPTOMAIL_API_KEY}`,
    },
    body: JSON.stringify({
      from: {
        address: FROM_EMAIL,
        name: FROM_NAME,
      },
      to: [
        {
          email_address: {
            address: to,
            name: toName ?? to,
          },
        },
      ],
      subject,
      htmlbody: html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ZeptoMail API error ${response.status}: ${error}`);
  }
}
