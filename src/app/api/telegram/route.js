import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { text } = body;

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramBotToken || !telegramChatId) {
      console.error("Missing Telegram configuration: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID.");
      return NextResponse.json(
        { error: "Configuration Error: Missing Telegram Bot Token or Chat ID." },
        { status: 400 }
      );
    }

    if (!text) {
      return NextResponse.json(
        { error: "Bad Request: Missing message text." },
        { status: 400 }
      );
    }

    const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

    // Attempt to send message with Markdown formatting first
    const payload = {
      chat_id: telegramChatId,
      text: text,
      parse_mode: "Markdown",
    };

    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Telegram markdown send failed: ${response.status} - ${errorText}. Retrying without markdown parse_mode...`);
      
      // Fallback: retry sending without markdown format to ensure message delivery
      const fallbackPayload = {
        chat_id: telegramChatId,
        text: text,
      };

      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fallbackPayload),
      });

      if (!response.ok) {
        const finalErrorDetails = await response.text();
        console.error(`Telegram webhook error: ${response.status} - ${finalErrorDetails}`);
        return NextResponse.json(
          {
            error: "Failed to send Telegram message.",
            details: finalErrorDetails,
          },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (error) {
    console.error("Error in Telegram webhook route:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
