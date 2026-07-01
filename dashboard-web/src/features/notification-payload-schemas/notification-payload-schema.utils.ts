export function parseJsonObject(
  text: string,
  fieldName: string,
): Record<string, unknown> {
  const trimmed = text.trim();

  if (!trimmed) {
    throw new Error(`${fieldName} es obligatorio`);
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);

    if (parsed === null || Array.isArray(parsed) || typeof parsed !== 'object') {
      throw new Error(`${fieldName} debe ser un objeto JSON`);
    }

    return parsed as Record<string, unknown>;
  } catch (error) {
    if (error instanceof Error && error.message.includes('debe ser')) {
      throw error;
    }

    throw new Error(`${fieldName} debe ser un JSON válido`);
  }
}

export function parseOptionalJsonObject(
  text: string | undefined,
  fieldName: string,
): Record<string, unknown> | null {
  if (!text?.trim()) {
    return null;
  }

  return parseJsonObject(text, fieldName);
}

export function formatJson(
  value: Record<string, unknown> | null | undefined,
  indent = 2,
): string {
  if (!value || Object.keys(value).length === 0) {
    return '';
  }

  return JSON.stringify(value, null, indent);
}

export function parseRequiredFieldsText(text: string): string[] {
  return [...new Set(text.split(',').map((field) => field.trim()).filter(Boolean))];
}

export function formatRequiredFieldsText(fields: string[]): string {
  return fields.join(', ');
}

export function getRequiredFieldsFromSchema(
  schemaJson: Record<string, unknown>,
): string[] {
  const required = schemaJson.required;

  if (!Array.isArray(required)) {
    return [];
  }

  return [
    ...new Set(
      required
        .filter((field): field is string => typeof field === 'string')
        .map((field) => field.trim())
        .filter(Boolean),
    ),
  ];
}

export function requiredFieldsMatchSchema(
  schemaJson: Record<string, unknown>,
  requiredFields: string[],
): boolean {
  const schemaRequired = getRequiredFieldsFromSchema(schemaJson).sort();
  const normalized = [...requiredFields].sort();

  if (schemaRequired.length !== normalized.length) {
    return false;
  }

  return schemaRequired.every((field, index) => field === normalized[index]);
}

export function buildExampleFromRequiredFields(
  requiredFields: string[],
): Record<string, unknown> {
  return Object.fromEntries(
    requiredFields.map((field) => {
      if (field === 'to' || field === 'cc' || field === 'bcc') {
        return [field, []];
      }

      if (field === 'attachments') {
        return [field, []];
      }

      return [field, ''];
    }),
  );
}

export const DEFAULT_SCHEMA_JSON_TEXT = JSON.stringify(
  {
    type: 'object',
    required: ['to', 'subject', 'message'],
    properties: {
      to: { type: 'array', items: { type: 'string' } },
      subject: { type: 'string' },
      message: { type: 'string' },
    },
    additionalProperties: false,
  },
  null,
  2,
);
