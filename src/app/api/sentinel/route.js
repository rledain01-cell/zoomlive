import { NextResponse } from 'next/server';

const SENTINEL_URL = 'https://sentinel-anitbot-production.up.railway.app';
const SENTINEL_PROJECT_KEY = process.env.NEXT_PUBLIC_SENTINEL_PROJECT_KEY;

export async function POST(request) {
    try {
        const body = await request.json();

        // Skip if no project key configured
        if (!SENTINEL_PROJECT_KEY) {
            console.warn('Sentinel: No project key configured');
            return NextResponse.json({
                allowed: true,
                score: 0,
                verdict: 'unknown',
                message: 'Sentinel not configured'
            });
        }

        // Get client IP and user agent from request headers
        const forwardedFor = request.headers.get('x-forwarded-for');
        const realIP = request.headers.get('x-real-ip');
        const ip = forwardedFor?.split(',')[0] || realIP || 'unknown';
        const userAgent = request.headers.get('user-agent') || '';

        // Send check request to Sentinel
        const response = await fetch(`${SENTINEL_URL}/api/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectKey: SENTINEL_PROJECT_KEY,
                userAgent,
                ip,
                signals: body.signals || {}
            })
        });

        const result = await response.json();

        // Log bot detections to Discord/Telegram if configured
        if (result.action === 'block') {
            // Send alert about bot detection
            const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
            const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
            const telegramChatId = process.env.TELEGRAM_CHAT_ID;

            const alertMessage = `
🤖 BOT DETECTED by Sentinel
🎯 Score: ${result.score}
⚖️ Verdict: ${result.verdict}
🔍 Confidence: ${result.confidence}
🌍 IP: ${ip}
🌐 User Agent: ${userAgent}
⏰ Time: ${new Date().toISOString()}
      `.trim();

            // Send to Discord if webhook configured
            if (discordWebhook) {
                try {
                    await fetch(discordWebhook, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content: alertMessage })
                    });
                } catch (err) {
                    console.error('Failed to send Discord alert:', err);
                }
            }

            // Send to Telegram if configured
            if (telegramBotToken && telegramChatId) {
                try {
                    await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: telegramChatId,
                            text: alertMessage
                        })
                    });
                } catch (err) {
                    console.error('Failed to send Telegram alert:', err);
                }
            }
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('Sentinel API error:', error);

        // Fail open - allow access if Sentinel check fails
        return NextResponse.json({
            allowed: true,
            score: 0,
            verdict: 'error',
            message: 'Sentinel check failed, allowing access'
        }, { status: 200 });
    }
}
