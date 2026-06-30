/**
 * Cole este código no Apps Script da sua planilha (Extensões → Apps Script).
 * Atualize a linha 1 da planilha com os cabeçalhos abaixo e crie uma nova implantação.
 *
 * | A          | B    | C     | D      | E         | F          | G          | H     |
 * | Data/Hora  | Nome | Email | WhatsApp | Profissão | Obstáculo | Renda      |       |
 * | I          | J    | K     | L        | M         | N         | O          | P     |
 * | utm_source | utm_medium | utm_campaign | utm_term | utm_content | utm_id | fbclid | gclid |
 */
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.registeredAt || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.profession || '',
      data.challenge || '',
      data.income || '',
      data.utm_source || '',
      data.utm_medium || '',
      data.utm_campaign || '',
      data.utm_term || '',
      data.utm_content || '',
      data.utm_id || '',
      data.fbclid || '',
      data.gclid || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
