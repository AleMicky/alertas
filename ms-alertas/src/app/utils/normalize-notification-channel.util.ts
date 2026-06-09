const CHANNEL_CODE_ALIASES: Record<string, string> = {
  EMAIL: 'EMAIL_ALERTS',
  TELEGRAM: 'TELEGRAM_ALERTS',
  TEAMS: 'TEAMS_ALERTS',
  WHATSAPP: 'WHATSAPP_ALERTS',
};

export function normalizeNotificationChannelCode(code: string): string {
  const upper = code.trim().toUpperCase();
  return CHANNEL_CODE_ALIASES[upper] ?? upper;
}

export function notificationChannelLookupCodes(code: string): string[] {
  const upper = code.trim().toUpperCase();
  const aliased = CHANNEL_CODE_ALIASES[upper];
  const candidates = [upper];

  if (aliased && aliased !== upper) {
    candidates.push(aliased);
  }

  for (const [alias, target] of Object.entries(CHANNEL_CODE_ALIASES)) {
    if (target === upper && alias !== upper) {
      candidates.push(alias);
    }
  }

  return [...new Set(candidates)];
}

export function getNotificationChannelKind(
  code: string,
): 'EMAIL' | 'TELEGRAM' | 'TEAMS' | 'WHATSAPP' | 'GOOGLE_CALENDAR' | 'GENERIC' {
  const normalized = normalizeNotificationChannelCode(code);

  if (normalized.includes('EMAIL')) return 'EMAIL';
  if (normalized.includes('TELEGRAM')) return 'TELEGRAM';
  if (normalized.includes('TEAMS')) return 'TEAMS';
  if (normalized.includes('WHATSAPP')) return 'WHATSAPP';
  if (normalized.includes('GOOGLE_CALENDAR') || normalized.includes('CALENDAR')) {
    return 'GOOGLE_CALENDAR';
  }

  return 'GENERIC';
}
