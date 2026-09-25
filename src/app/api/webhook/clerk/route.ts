import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (!evt || !evt.type) {
      console.error("❌ Invalid webhook event");
      return new Response("Invalid event", { status: 400 });
    }

    console.log("✅ Webhook received:", evt.type);

    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      // Clerk v7 mein data directly evt.data mein hai
      const data = evt.data as {
        id: string;
        email_addresses?: Array<{ email_address: string }>;
        username?: string | null;
        first_name?: string | null;
        last_name?: string | null;
        image_url?: string | null;
      };

      const email = data.email_addresses?.[0]?.email_address || "";
      const name =
        `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
        data.username ||
        "Anonymous";

      await prisma.user.upsert({
        where: { id: data.id },
        update: {
          email,
          name,
          image: data.image_url || null,
        },
        create: {
          id: data.id,
          email,
          name,
          username: data.username || `user_${data.id.slice(-8)}`,
          image: data.image_url || null,
        },
      });

      console.log(`✅ User ${eventType}: ${email}`);
    }

    if (eventType === "user.deleted") {
      const data = evt.data as { id?: string };
      if (data.id) {
        await prisma.user.deleteMany({ where: { id: data.id } });
        console.log(`✅ User deleted: ${data.id}`);
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new Response("Webhook failed", { status: 400 });
  }
}