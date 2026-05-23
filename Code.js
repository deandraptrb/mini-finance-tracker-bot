// CENTRALIZED CONFIGURATION
const CONFIG = {
  SHEET_NAME: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MMM yy").replace(" ", ""),
  ACCOUNTS: ["BCA", "OCTO Pay", "OCTO Savers", "SHOPEE", "GOPAY", "OCTO Bonds", "OVO", "SAQU"],
  CATEGORIES: ["Personal", "Utang ayah & ibu", "Investasi", "Coffee Business", "Pindah duit", "Transportation"],
  DEFAULT_ACCOUNT: "BCA",
  DEFAULT_CATEGORY: "Personal"
};

function doPost(event) {
  if (!event || !event.postData) return;
  
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('TELEGRAM_BOT_TOKEN');
  const groqKey = props.getProperty('GROQ_API_KEY');
  
  const contents = JSON.parse(event.postData.contents);
  if (!contents.message || !contents.message.text) return;

  const chatId = contents.message.chat.id;
  const text = contents.message.text;

  processTransaction(chatId, text, token, groqKey);
}


function processTransaction(chatId, text, token, groqKey) {
  try {
    const aiResponse = askGroq(text, groqKey);
    const data = JSON.parse(aiResponse);
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    
    const expAmt = Number(data.ExpenseAmount) || 0;
    const incAmt = Number(data.IncomeAmount) || 0;

    sheet.appendRow([
      new Date(),
      data.Account || CONFIG.DEFAULT_ACCOUNT,
      data.Expense,
      "", 
      expAmt,
      incAmt,
      data.Category || CONFIG.DEFAULT_CATEGORY,
      text
    ]);

    sheet.getRange(sheet.getLastRow(), 1).setNumberFormat("MM/dd/yyyy");

    const nominal = expAmt > 0 ? expAmt : incAmt;
    const formatNominal = "Rp" + nominal.toLocaleString('id-ID');
    
    const successMsg = "**Added to Sheet! ☘︎**\n\n" +
                       "♡ **Item:** " + (data.Expense || "-") + "\n" +
                       "❀ **Nominal:** " + formatNominal + "\n" +
                       "★ **Account:** " + (data.Account || "-") + "\n" +
                       "✿ **Category:** " + (data.Category || "-");
                
    sendMessage(chatId, successMsg, token);
    console.log("Success: " + text);

  } catch (err) {
    console.error("Error: " + err.message);
    if (chatId) sendMessage(chatId, "𓏵 **ERROR:** " + err.message, token);
  }
}

function askGroq(userInput, apiKey) {
  const url = "https://api.groq.com/openai/v1/chat/completions";
  
  const systemPrompt = "Extract financial data to JSON. Keys: Account, Expense, ExpenseAmount, IncomeAmount, Category. " +
    "RULES: " +
    "1. VALID VALUES: Accounts [" + CONFIG.ACCOUNTS.join(", ") + "], Categories [" + CONFIG.CATEGORIES.join(", ") + "]. " +
    "2. DIRECTION LOGIC: If user receives money ('[Name] bayar', 'Dikasih'), set IncomeAmount > 0. If user spends money ('Bayar KE', 'Beli'), set ExpenseAmount > 0. " +
    "3. MAPPING: Category='Utang ayah & ibu' ONLY for Ayah/Ibu. Otherwise use 'Personal'. " +
    "4. DEFAULTS: If Account missing, use '" + CONFIG.DEFAULT_ACCOUNT + "'. If Category unclear, use '" + CONFIG.DEFAULT_CATEGORY +
    "5. OUTPUT: Expense key MUST be a brief summary of the activity. NEVER leave it empty or use booleans."
    ;

  const payload = {
    "model": "llama-3.3-70b-versatile",
    "messages": [
      { "role": "system", "content": systemPrompt },
      { "role": "user", "content": userInput }
    ],
    "response_format": { "type": "json_object" }
  };

  const options = {
    "method": "post",
    "headers": { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json" },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText()).choices[0].message.content;
}

function sendMessage(chatId, text, token) {
  if (!token) return; // Skip if testing without token
  const url = "https://api.telegram.org/bot" + token + "/sendMessage";
  const payload = {
    "chat_id": chatId,
    "text": text.replace(/\*/g, ""),
    "parse_mode": "None" 
  };
  UrlFetchApp.fetch(url, { "method": "post", "contentType": "application/json", "payload": JSON.stringify(payload), "muteHttpExceptions": true });
}

// run this to test without deploying
function testMyBot() {
  const testMessage = "test git"; // change this to test different scenarios
  const props = PropertiesService.getScriptProperties();
  const groqKey = props.getProperty('GROQ_API_KEY');
  const token = props.getProperty('TELEGRAM_BOT_TOKEN');

  console.log("--- Starting Test ---");
  processTransaction(12345, testMessage, token, groqKey);
  console.log("--- Test Finished ---");
}