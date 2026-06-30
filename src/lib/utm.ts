export const UTM_PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'fbclid',
  'gclid',
] as const;

export type UtmParamKey = (typeof UTM_PARAM_KEYS)[number];
export type UtmParams = Partial<Record<UtmParamKey, string>>;

const STORAGE_KEY = 'storywork_utms';

export function captureUtms(): void {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const fromUrl: UtmParams = {};
  let hasAny = false;

  for (const key of UTM_PARAM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      fromUrl[key] = value;
      hasAny = true;
    }
  }

  if (hasAny) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
  }
}

export function getStoredUtms(): UtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};
    return JSON.parse(saved) as UtmParams;
  } catch {
    return {};
  }
}
