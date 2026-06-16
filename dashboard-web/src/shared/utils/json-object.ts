export function formatJsonObject(value: Record<string, unknown> | undefined) {
  if (!value || Object.keys(value).length === 0) {
    return '';
  }

  return JSON.stringify(value, null, 2);
}

export function parseJsonObject(text: string): Record<string, unknown> | undefined {
  const trimmed = text.trim();

  if (!trimmed) {
    return undefined;
  }

  const parsed: unknown = JSON.parse(trimmed);

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    Array.isArray(parsed)
  ) {
    throw new Error('Debe ser un objeto JSON');
  }

  return parsed as Record<string, unknown>;
}

export function isValidJsonObject(text: string | undefined) {
  if (!text?.trim()) {
    return true;
  }

  try {
    parseJsonObject(text);
    return true;
  } catch {
    return false;
  }
}
