import { ParticipantData } from '../types';

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL as string | undefined;

export async function sendToGoogleSheet(participant: ParticipantData): Promise<void> {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn('VITE_GOOGLE_SCRIPT_URL não configurada — inscrição não enviada à planilha.');
    return;
  }

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(participant),
    });
  } catch (error) {
    console.error('Falha ao enviar inscrição para o Google Sheets', error);
  }
}
