// app/api/discord/route.js
import { NextResponse } from "next/server";

// This route proxies messages to a Discord webhook
export async function POST(request) {
  try {
    // Parse the JSON body of the incoming request
    const body = await request.json();
    const { text, embeds, username, avatar_url } = body;

    // Get webhook URL from environment variables
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    // Validate input parameters
    if (!webhookUrl || !text) {
      console.error("Missing required parameters: webhookUrl or text.");
      return NextResponse.json(
        { error: "Missing required parameters: webhookUrl or text." },
        { status: 400 }
      );
    }

    const payload = {
      content: text,
      embeds,
      username,
      avatar_url,
      allowed_mentions: { parse: [] },
    };

    // Remove undefined properties to keep Discord payload clean
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    // Send the request to Discord
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Handle non-2xx response from Discord
    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(`Discord webhook error: ${response.status} - ${errorDetails}`);
      return NextResponse.json(
        {
          error: "Failed to send Discord webhook message.",
          details: errorDetails,
        },
        { status: response.status }
      );
    }

    // Discord webhooks typically return 204 No Content
    let data = null;
    if (response.status !== 204) {
      try {
        data = await response.json();
      } catch (parseError) {
        // Ignore parse errors for non-JSON responses
        data = null;
      }
    }

    console.log("Discord webhook message sent successfully.");
    return NextResponse.json(
      data ? { success: true, data } : { success: true },
      { status: 200 }
    );
  } catch (error) {
    // Log and return server-side error
    console.error("Error in Discord webhook route:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
