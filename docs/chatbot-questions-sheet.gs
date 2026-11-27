/**
 * Google Sheet that collects every question asked to the website chat bot.
 *
 * Setup (once, free):
 * 1. Make a new Google Sheet, e.g. "أسئلة بوت الموقع".
 * 2. Extensions → Apps Script. Delete what is there and paste this whole file. Save.
 * 3. Deploy → New deployment → type "Web app".
 *    Execute as: Me.  Who has access: Anyone.  → Deploy, allow access.
 * 4. Copy the Web app URL (ends with /exec) and put it in Vercel as
 *    QUESTIONS_SHEET_URL (Settings → Environment Variables), then redeploy.
 *
 * Columns: time | lang | page | question | answer | source (ai = Gemini, quick = ready answer)
 */
// Cells starting with = + - @ would run as formulas; store them as plain text.
function safe(v, max) {
  var s = String(v || '').slice(0, max);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['time', 'lang', 'page', 'question', 'answer', 'source']);
  }
  var row = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(row.time || new Date()),
    safe(row.lang, 10),
    safe(row.page, 200),
    safe(row.question, 1000),
    safe(row.answer, 2000),
    safe(row.source, 10),
  ]);
  return ContentService.createTextOutput('ok');
}
