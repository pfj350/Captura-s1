import { createHash } from 'crypto';

const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

interface UserDataInput {
  email?: string;
  phone?: string;
  name?: string;
  external_id?: string;
  country?: string;
  fbp?: string;
  fbc?: string;
}

interface EventPayload {
  event_name: string;
  event_id: string;
  event_source_url?: string;
  user_data?: UserDataInput;
  custom_data?: Record<string, unknown>;
}

interface VercelRequest {
  method?: string;
  body?: EventPayload;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}

interface VercelResponse {
  setHeader(name: string, value: string): void;
  status(code: number): { json(data: unknown): void; end(): void };
}
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

interface UserDataInput {
  email?: string;
  phone?: string;
  name?: string;
  external_id?: string;
  country?: string;
  fbp?: string;
  fbc?: string;
}

interface EventPayload {
  event_name: string;
  event_id: string;
  event_source_url?: string;
  user_data?: UserDataInput;
  custom_data?: Record<string, unknown>;
}

function hashValue(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    digits = digits.replace(/^0+/, '');
  }
  if (digits.length <= 11 && !digits.startsWith('55')) {
    digits = `55${digits}`;
  }
  return digits;
}

function splitName(fullName: string): { fn: string; ln: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    fn: parts[0] ?? '',
    ln: parts.slice(1).join(' '),
  };
}

function buildUserData(
  input: UserDataInput | undefined,
  req: VercelRequest
): Record<string, string> {
  const userData: Record<string, string> = {};

  if (input?.email) userData.em = hashValue(input.email);
  if (input?.phone) userData.ph = hashValue(normalizePhone(input.phone));

  if (input?.name) {
    const { fn, ln } = splitName(input.name);
    if (fn) userData.fn = hashValue(fn);
    if (ln) userData.ln = hashValue(ln);
  }

  if (input?.external_id) userData.external_id = hashValue(input.external_id);
  if (input?.country) userData.country = hashValue(input.country.toLowerCase());
  if (input?.fbp) userData.fbp = input.fbp;
  if (input?.fbc) userData.fbc = input.fbc;

  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress;
  if (clientIp) userData.client_ip_address = clientIp;

  const userAgent = req.headers['user-agent'];
  if (userAgent) userData.client_user_agent = userAgent;

  return userData;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return res.status(503).json({ error: 'Meta API not configured' });
  }

  const body = req.body as EventPayload;
  if (!body?.event_name || !body?.event_id) {
    return res.status(400).json({ error: 'event_name and event_id are required' });
  }

  const eventTime = Math.floor(Date.now() / 1000);

  const payload = {
    data: [
      {
        event_name: body.event_name,
        event_time: eventTime,
        event_id: body.event_id,
        event_source_url: body.event_source_url ?? 'https://conectastorywork.com',
        action_source: 'website',
        user_data: buildUserData(body.user_data, req),
        custom_data: body.custom_data ?? {},
      },
    ],
    ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('[Meta CAPI] Error:', result);
      return res.status(response.status).json({ error: 'Meta API error', details: result });
    }

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('[Meta CAPI] Request failed:', error);
    return res.status(500).json({ error: 'Failed to send event' });
  }
}
