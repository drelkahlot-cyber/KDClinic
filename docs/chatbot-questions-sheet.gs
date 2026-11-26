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
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['time', 'lang', 'page', 'question', 'answer', 'source']);
  }
  var row = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(row.time || new Date()),
    row.lang || '',
    row.page || '',
    String(row.question || '').slice(0, 1000),
    String(row.answer || '').slice(0, 2000),
    row.source || '',
  ]);
  return ContentService.createTextOutput('ok');
}
