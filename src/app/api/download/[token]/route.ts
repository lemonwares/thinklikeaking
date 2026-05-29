import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  if (!token) {
    return new Response("Invalid link", { status: 400 });
  }

  // Look up the order by download token
  const order = await prisma.order.findUnique({
    where: { downloadToken: token },
  });

  if (!order) {
    return new Response("This download link is invalid.", { status: 404 });
  }

  if (!order.downloadExpiresAt || order.downloadExpiresAt < new Date()) {
    return new Response(
      "This download link has expired. Please contact support.",
      { status: 410 },
    );
  }

  // Mark as downloaded (first access time)
  if (!order.downloadedAt) {
    await prisma.order.update({
      where: { id: order.id },
      data: { downloadedAt: new Date() },
    });
  }

  // Redirect to the signed file URL
  // In production: generate a short-lived signed URL from S3/Vercel Blob
  const fileUrl = process.env.EBOOK_FILE_URL;

  if (!fileUrl) {
    console.error("[download] EBOOK_FILE_URL not set");
    return new Response("File temporarily unavailable. Contact support.", {
      status: 503,
    });
  }

  return Response.redirect(fileUrl, 302);
}
