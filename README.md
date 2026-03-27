# Mini Finance Tracker Bot

**Telegram bot** that tracks your income and expenses using **Google Apps Script**, **Google Sheets**, and **Grok AI** (via Groq).

Just chat naturally (e.g. `"beli kopi 25rb"` or `"gaji 8jt"`), and the bot uses AI to automatically understand and log the transaction into your Google Sheet.

## Features

- AI-powered transaction understanding (Groq + Llama 3.3)
- Automatically saves to Google Sheets
- Multi-account support (BCA, OVO, GOPAY, Shopee, etc.)
- Smart category detection
- Simple natural language input
- Fast and minimal setup

## Tech Stack

- Google Apps Script (JavaScript)
- Telegram Bot API
- Google Sheets (as database)
- Groq AI (Llama-3.3-70b-versatile)

## How to Set Up

1. **Create your Telegram Bot**
   - Talk to [@BotFather](https://t.me/BotFather) on Telegram
   - Send `/newbot`
   - Copy the **BOT TOKEN**

2. **Prepare Google Sheet**
   - Create or use an existing Google Spreadsheet
   - Make sure you have a sheet named **`Mar26`** (or change `SHEET_NAME` in the code)

3. **Setup the Script**
   - Open your Google Sheet → **Extensions → Apps Script**
   - Paste the `Code.gs` file
   - Go to **Project Settings → Script Properties** and add:
     - `TELEGRAM_BOT_TOKEN` → your bot token
     - `GROQ_API_KEY` → your Groq API key

4. **Deploy the Web App**
   - Click **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy and copy the **Web App URL**

5. **Set the Webhook** (manually)
   - Open this URL in your browser (replace the placeholders):
     https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook?url=YOUR_WEBAPP_URL
     
     You should see `{"ok":true,"result":true}` if successful.

6. **Start Using**
- Open Telegram and send messages to your bot

## Example Messages

- `beli kopi 25rb`
- `gaji 8.5jt`
- `transfer ovo 100rb`
- `bayar utang ayah & ibu 500rb`

## Configuration

Edit the `CONFIG` object in `Code.gs`:

```javascript
const CONFIG = {
SHEET_NAME: 'Mar26',
ACCOUNTS: ["BCA", "OCTO Pay", "OCTO Savers", "SHOPEE", "GOPAY", "OCTO Bonds", "OVO", "SAQU"],
CATEGORIES: ["Personal", "Utang ayah & ibu", "Investasi", "Coffee Business", "Pindah duit", "Transportation"],
DEFAULT_ACCOUNT: "BCA",
DEFAULT_CATEGORY: "Personal"
};
```

## Quick Test (Inside Apps Script)

You can test the bot directly without deploying the Web App:

- Make sure TELEGRAM_BOT_TOKEN and GROQ_API_KEY are set in Script Properties
- Change the test message in the testMyBot() function if you want
- Select testMyBot from the function dropdown and click Run
- Check the Execution log (View → Logs) to see the result

Done! Feel free to improve!
