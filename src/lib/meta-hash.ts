export async function sha256(text: string): Promise<string> {
  const normalized = text.trim().toLowerCase();
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    digits = digits.replace(/^0+/, '');
  }
  if (digits.length <= 11 && !digits.startsWith('55')) {
    digits = `55${digits}`;
  }
  return digits;
}

export function splitName(fullName: string): { fn: string; ln: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    fn: parts[0] ?? '',
    ln: parts.slice(1).join(' '),
  };
}
