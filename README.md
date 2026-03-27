# Mini Finance Tracker Bot

A Telegram bot for tracking personal income and expenses, powered by Google Apps Script + Google Sheets + Grok AI

Send natural messages like "beli kopi 25rb" or "gaji 5jt", and the bot intelligently processes them using Grok AI, then logs everything automatically into Google Sheets.

## Features

- AI-Powered Processing — Uses Grok AI to understand natural language transactions
- Automatic logging to Google Sheets
- Multi-account support (`BCA`, `OVO`, `Shopee`, `GOPAY`, etc.)
- Custom categories (`Personal`, `Utang ayah & ibu`, `Investasi`, `Coffee Business`, `Transportasi`, etc.)
- Simple and fast — just chat with the bot
- Token & API keys stored securely in Script Properties

## Tech Stack

- Google Apps Script (JavaScript)
- Telegram Bot API
- Google Sheets (as database)
- Grok AI (xAI API) for intelligent parsing
- Script Properties for configuration

## Setup Instructions

### 1. Create the Telegram Bot
1. Open Telegram and talk to **@BotFather**
2. Send `/newbot`
3. Follow the steps and copy your **BOT TOKEN**

### 2. Prepare Google Sheet
- Create a new Google Spreadsheet (or use an existing one)
- Note down the **Spreadsheet ID** from the URL

### 3. Deploy the Apps Script
1. Open your Google Sheet → **Extensions** → **Apps Script**
2. Delete any existing code and paste your `Code.gs`
3. Set up the configuration (see below)
4. Deploy as **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the **Web App URL**

### 4. Configure the Bot
In your Apps Script, set these in **Script Properties** (or directly in the `CONFIG` object):

- `TELEGRAM_BOT_TOKEN` → Your bot token from BotFather
- `GROQ_API_KEY` → Your Grok / xAI API key (if using Groq endpoint)
- `SPREADSHEET_ID` → (optional, if not hardcoded)

Then run these functions once:
- `setWebhook()` — to connect Telegram to your Web App
- `getMe()` — to test the bot

## How to Use

Just send messages to your bot like:
- `beli kopi 25rb`
- `gaji masuk 8.5jt`
- `bayar utang ayah 500rb`
- `transfer ke ovo 100rb`

The bot will use Grok AI to understand the amount, type (income/expense), category, and account, then save it to the sheet.

## Files

- `Code.gs` — Main script (doPost, processTransaction, AI integration)
- `README.md` — This file
- `.clasp.json` & `appsscript.json` — For local development with clasp (optional)

## Configuration Example

```javascript
const CONFIG = {
  SHEET_NAME: "Mar26",
  ACCOUNTS: ["BCA", "OCTO Pay", "OVO", "Shopee", "GOPAY", "SAQU"],
  CATEGORIES: ["Personal", "Utang ayah & ibu", "Investasi", "Coffee Business", "Pindah duit", "Transportasi"],
  DEFAULT_ACCOUNT: "BCA",
  DEFAULT_CATEGORY: "Personal"
};
