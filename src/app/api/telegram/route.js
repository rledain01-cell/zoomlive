// app/api/telegram/route.js
import { NextResponse } from "next/server";

// This route handles sending a message to Telegram via your bot token
export async function POST(request) {
  try {
    // Parse the JSON body of the incoming request
    const body = await request.json();
    const { text, chat_id: customChatId } = body;

    // Get secrets from server environment
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const defaultChatId = process.env.TELEGRAM_CHAT_ID;

    // Use custom chat ID if provided, otherwise default to environment variable
    const chatId = customChatId || defaultChatId;

    // Validate input parameters
    if (!botToken || !chatId || !text) {
      console.error("Missing required parameters: botToken, chatId, or text.");
      return NextResponse.json(
        { error: "Missing required parameters: botToken, chatId, or text." },
        { status: 400 }
      );
    }

    // Construct Telegram API URL
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // Send the request to Telegram
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });

    // Handle non-200 response from Telegram API
    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(
        `Telegram API error: ${response.status} - ${errorDetails}`
      );
      return NextResponse.json(
        {
          error: "Failed to send Telegram message.",
          details: errorDetails,
        },
        { status: response.status }
      );
    }

    // Parse and return success response
    const data = await response.json();
    console.log("Telegram message sent successfully:", data);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    // Log and return server-side error
    console.error("Error in Telegram route:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
