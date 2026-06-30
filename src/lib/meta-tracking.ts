import { ParticipantData } from '../types';
import { normalizePhone, sha256, splitName } from './meta-hash';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const CONTENT_NAME = 'Conexão Além da Tela';

export interface MetaUserData {
  email?: string;
  phone?: string;
  name?: string;
  externalId?: string;
  country?: string;
}

export interface MetaCustomData {
  content_name?: string;
  content_category?: string;
  status?: string;
  profession?: string;
  challenge?: string;
  income?: string;
  registration_id?: string;
  currency?: string;
  value?: number;
}

let pixelLoaded = false;
let pixelInitialized = false;

function generateEventId(): string {
  return `sw_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function setCookie(name: string, value: string, days = 90): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function captureFbclid(): void {
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get('fbclid');
  if (!fbclid || getCookie('_fbc')) return;
  setCookie('_fbc', `fb.1.${Date.now()}.${fbclid}`);
}

function loadPixelScript(): Promise<void> {
  if (pixelLoaded || !PIXEL_ID) return Promise.resolve();

  return new Promise((resolve) => {
    if (window.fbq) {
      pixelLoaded = true;
      resolve();
      return;
    }

    const n = function (...args: unknown[]) {
      const fbqFn = n as unknown as {
        callMethod?: (...a: unknown[]) => void;
        queue: unknown[][];
      };
      if (fbqFn.callMethod) {
        fbqFn.callMethod(...args);
      } else {
        fbqFn.queue.push(args);
      }
    };
    (n as unknown as { queue: unknown[][] }).queue = [];
    (n as unknown as { loaded: boolean }).loaded = true;
    (n as unknown as { version: string }).version = '2.0';
    window.fbq = n as Window['fbq'];
    window._fbq = n;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    script.onload = () => {
      pixelLoaded = true;
      resolve();
    };
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

async function buildHashedUserData(user?: MetaUserData): Promise<Record<string, string>> {
  if (!user) return {};

  const hashed: Record<string, string> = {};

  if (user.email) {
    hashed.em = await sha256(user.email);
  }
  if (user.phone) {
    hashed.ph = await sha256(normalizePhone(user.phone));
  }
  if (user.name) {
    const { fn, ln } = splitName(user.name);
    if (fn) hashed.fn = await sha256(fn);
    if (ln) hashed.ln = await sha256(ln);
  }
  if (user.externalId) {
    hashed.external_id = await sha256(user.externalId);
  }
  if (user.country) {
    hashed.country = await sha256(user.country.toLowerCase());
  }

  return hashed;
}

async function initPixel(user?: MetaUserData): Promise<void> {
  if (!PIXEL_ID || pixelInitialized) return;

  await loadPixelScript();
  if (!window.fbq) return;

  const hashedUser = await buildHashedUserData(user);
  window.fbq('init', PIXEL_ID, hashedUser);
  pixelInitialized = true;
}

async function sendCapiEvent(
  eventName: string,
  eventId: string,
  user?: MetaUserData,
  customData?: MetaCustomData
): Promise<void> {
  try {
    const response = await fetch('/api/meta-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href,
        user_data: {
          email: user?.email,
          phone: user?.phone,
          name: user?.name,
          external_id: user?.externalId,
          country: user?.country ?? 'br',
          fbp: getCookie('_fbp'),
          fbc: getCookie('_fbc'),
        },
        custom_data: {
          content_name: CONTENT_NAME,
          ...customData,
        },
      }),
      keepalive: true,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      console.warn('[Meta CAPI] Evento rejeitado:', eventName, response.status, body);
    }
  } catch (error) {
    console.warn('[Meta CAPI] Falha ao enviar evento:', eventName, error);
  }
}

async function trackEvent(
  eventName: string,
  options?: {
    user?: MetaUserData;
    customData?: MetaCustomData;
    eventId?: string;
  }
): Promise<string> {
  const eventId = options?.eventId ?? generateEventId();

  await initPixel(options?.user);

  if (window.fbq) {
    // eventID deve ir no 4º argumento para deduplicação com a CAPI
    window.fbq('track', eventName, options?.customData ?? {}, { eventID: eventId });
  }

  void sendCapiEvent(eventName, eventId, options?.user, options?.customData);

  return eventId;
}

export async function initMetaTracking(): Promise<void> {
  if (!PIXEL_ID) return;
  captureFbclid();
  await initPixel();
  await trackEvent('PageView');
  await trackEvent('ViewContent', {
    customData: {
      content_name: CONTENT_NAME,
      content_category: 'landing_page',
    },
  });
}

export function trackInitiateCheckout(): void {
  void trackEvent('InitiateCheckout', {
    customData: {
      content_name: CONTENT_NAME,
      content_category: 'registration_modal',
    },
  });
}

export function trackLeadStep1(data: Pick<ParticipantData, 'name' | 'email' | 'phone'>): void {
  void trackEvent('Lead', {
    user: {
      email: data.email,
      phone: data.phone,
      name: data.name,
      country: 'br',
    },
    customData: {
      content_name: CONTENT_NAME,
      content_category: 'step_1_contact',
      status: 'partial',
    },
  });
}

export function trackCompleteRegistration(data: ParticipantData): void {
  void trackEvent('CompleteRegistration', {
    user: {
      email: data.email,
      phone: data.phone,
      name: data.name,
      externalId: data.email,
      country: 'br',
    },
    customData: {
      content_name: CONTENT_NAME,
      content_category: data.profession,
      status: 'registered',
      profession: data.profession,
      challenge: data.challenge,
      income: data.income,
      currency: 'BRL',
      value: 0,
    },
  });

  void trackEvent('Lead', {
    user: {
      email: data.email,
      phone: data.phone,
      name: data.name,
      externalId: data.email,
      country: 'br',
    },
    customData: {
      content_name: CONTENT_NAME,
      content_category: data.profession,
      status: 'complete',
      profession: data.profession,
      challenge: data.challenge,
      income: data.income,
    },
  });
}

export function trackContact(participant?: ParticipantData | null): void {
  void trackEvent('Contact', {
    user: participant
      ? {
          email: participant.email,
          phone: participant.phone,
          name: participant.name,
          externalId: participant.email,
          country: 'br',
        }
      : undefined,
    customData: {
      content_name: CONTENT_NAME,
      content_category: 'whatsapp_group',
    },
  });
}

export function trackCtaClick(location: string): void {
  void trackEvent('CustomizeProduct', {
    customData: {
      content_name: CONTENT_NAME,
      content_category: location,
    },
  });
}

export function updatePixelUserData(user: MetaUserData): void {
  if (!PIXEL_ID || !window.fbq) return;
  void buildHashedUserData(user).then((hashed) => {
    window.fbq?.('init', PIXEL_ID, hashed);
  });
}
