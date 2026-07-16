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

export type SchemaFieldPrimitiveType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'object';

export type SchemaFieldType = SchemaFieldPrimitiveType | 'array';

export type SchemaFieldFormat =
  | ''
  | 'email'
  | 'date-time'
  | 'date'
  | 'uri'
  | 'uuid';

export interface SchemaFieldDefinition {
  id: string;
  name: string;
  type: SchemaFieldType;
  required: boolean;
  description: string;
  itemsType: SchemaFieldPrimitiveType;
  format: SchemaFieldFormat;
}

export interface SchemaBuilderState {
  fields: SchemaFieldDefinition[];
  additionalProperties: boolean;
}

const PRIMITIVE_TYPES = new Set<string>([
  'string',
  'number',
  'integer',
  'boolean',
  'object',
]);

const SUPPORTED_FORMATS = new Set<string>([
  'email',
  'date-time',
  'date',
  'uri',
  'uuid',
]);

function createFieldId(): string {
  return `field-${Math.random().toString(36).slice(2, 10)}`;
}

function readFormat(value: unknown): SchemaFieldFormat {
  if (typeof value !== 'string' || !SUPPORTED_FORMATS.has(value)) {
    return '';
  }

  return value as SchemaFieldFormat;
}

export function createEmptySchemaField(
  overrides?: Partial<SchemaFieldDefinition>,
): SchemaFieldDefinition {
  return {
    id: createFieldId(),
    name: '',
    type: 'string',
    required: true,
    description: '',
    itemsType: 'string',
    format: '',
    ...overrides,
  };
}

export function createDefaultSchemaBuilderState(): SchemaBuilderState {
  return {
    additionalProperties: false,
    fields: [
      createEmptySchemaField({
        name: 'to',
        type: 'array',
        required: true,
        itemsType: 'string',
        format: 'email',
      }),
      createEmptySchemaField({
        name: 'cc',
        type: 'array',
        required: false,
        itemsType: 'string',
        format: 'email',
      }),
      createEmptySchemaField({
        name: 'bcc',
        type: 'array',
        required: false,
        itemsType: 'string',
        format: 'email',
      }),
      createEmptySchemaField({
        name: 'subject',
        type: 'string',
        required: true,
      }),
      createEmptySchemaField({
        name: 'message',
        type: 'string',
        required: true,
      }),
    ],
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Acepta objeto o JSON stringificado (p. ej. desde jsonb). */
export function normalizeSchemaJson(
  value: unknown,
): Record<string, unknown> | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    try {
      const parsed: unknown = JSON.parse(trimmed);
      return isPlainObject(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  return isPlainObject(value) ? value : null;
}

function getPropertyType(property: Record<string, unknown>): string | null {
  const type = property.type;

  if (typeof type === 'string') {
    return type;
  }

  if (Array.isArray(type)) {
    const nonNull = type.filter((item) => item !== 'null');
    return typeof nonNull[0] === 'string' ? nonNull[0] : null;
  }

  return null;
}

function inferFieldType(
  property: Record<string, unknown>,
): SchemaFieldType {
  const type = getPropertyType(property);

  if (type === 'array') {
    return 'array';
  }

  if (type && PRIMITIVE_TYPES.has(type)) {
    return type as SchemaFieldType;
  }

  if (isPlainObject(property.properties) || property.additionalProperties !== undefined) {
    return 'object';
  }

  if (Array.isArray(property.enum)) {
    return 'string';
  }

  return 'string';
}

function inferItemsType(
  property: Record<string, unknown>,
): SchemaFieldPrimitiveType {
  const items = property.items;

  if (!isPlainObject(items)) {
    return 'string';
  }

  const itemsType = getPropertyType(items);

  if (itemsType && PRIMITIVE_TYPES.has(itemsType)) {
    return itemsType as SchemaFieldPrimitiveType;
  }

  if (isPlainObject(items.properties)) {
    return 'object';
  }

  return 'string';
}

/** Best-effort: siempre produce un campo editable en la interfaz. */
function parsePropertyToField(
  name: string,
  property: unknown,
  required: boolean,
): SchemaFieldDefinition {
  if (!isPlainObject(property)) {
    return createEmptySchemaField({
      name,
      type: 'string',
      required,
    });
  }

  const type = inferFieldType(property);
  const description =
    typeof property.description === 'string' ? property.description : '';
  const format =
    type === 'string' || (type === 'array' && inferItemsType(property) === 'string')
      ? readFormat(property.format) ||
        (isPlainObject(property.items)
          ? readFormat(property.items.format)
          : '')
      : '';

  if (type === 'array') {
    return createEmptySchemaField({
      name,
      type: 'array',
      required,
      description,
      itemsType: inferItemsType(property),
      format,
    });
  }

  return createEmptySchemaField({
    name,
    type,
    required,
    description,
    format: type === 'string' ? readFormat(property.format) : '',
  });
}

export function schemaJsonToBuilderState(
  schemaJson: unknown,
  requiredFieldsFallback: string[] = [],
): SchemaBuilderState {
  const normalized = normalizeSchemaJson(schemaJson);

  if (!normalized) {
    if (requiredFieldsFallback.length > 0) {
      return {
        additionalProperties: false,
        fields: requiredFieldsFallback.map((name) =>
          createEmptySchemaField({ name, type: 'string', required: true }),
        ),
      };
    }

    return createDefaultSchemaBuilderState();
  }

  const requiredFromSchema = getRequiredFieldsFromSchema(normalized);
  const requiredList =
    requiredFromSchema.length > 0
      ? requiredFromSchema
      : requiredFieldsFallback;
  const required = new Set(requiredList);

  const properties = isPlainObject(normalized.properties)
    ? normalized.properties
    : {};

  const fieldsFromProperties = Object.entries(properties).map(
    ([name, property]) =>
      parsePropertyToField(name, property, required.has(name)),
  );

  // Incluye required que no estén en properties.
  const knownNames = new Set(
    fieldsFromProperties.map((field) => field.name.trim()),
  );
  const missingRequired = requiredList
    .filter((name) => !knownNames.has(name))
    .map((name) =>
      createEmptySchemaField({ name, type: 'string', required: true }),
    );

  const fields = orderFieldsBySchema(
    [...fieldsFromProperties, ...missingRequired],
    normalized,
  );

  if (fields.length === 0 && requiredList.length > 0) {
    return {
      additionalProperties: normalized.additionalProperties === true,
      fields: requiredList.map((name) =>
        createEmptySchemaField({ name, type: 'string', required: true }),
      ),
    };
  }

  if (fields.length === 0) {
    return createDefaultSchemaBuilderState();
  }

  return {
    fields,
    additionalProperties: normalized.additionalProperties === true,
  };
}

/** PostgreSQL jsonb no preserva orden de claves; usamos esta extensión. */
export const SCHEMA_FIELD_ORDER_KEY = 'x-field-order';

function readFieldOrder(schemaJson: Record<string, unknown>): string[] {
  const order = schemaJson[SCHEMA_FIELD_ORDER_KEY];

  if (!Array.isArray(order)) {
    return [];
  }

  return [
    ...new Set(
      order
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

function orderFieldsBySchema(
  fields: SchemaFieldDefinition[],
  schemaJson: Record<string, unknown>,
): SchemaFieldDefinition[] {
  const savedOrder = readFieldOrder(schemaJson);

  if (savedOrder.length === 0) {
    return fields;
  }

  const byName = new Map(
    fields.map((field) => [field.name.trim(), field] as const),
  );
  const ordered: SchemaFieldDefinition[] = [];

  for (const name of savedOrder) {
    const field = byName.get(name);

    if (field) {
      ordered.push(field);
      byName.delete(name);
    }
  }

  for (const field of byName.values()) {
    ordered.push(field);
  }

  return ordered;
}

/**
 * Asegura x-field-order en un schema editado como JSON crudo,
 * usando el orden actual de properties si no viene definido.
 */
export function ensureSchemaFieldOrder(
  schemaJson: Record<string, unknown>,
): Record<string, unknown> {
  const properties = isPlainObject(schemaJson.properties)
    ? schemaJson.properties
    : {};
  const propertyNames = Object.keys(properties);
  const existingOrder = readFieldOrder(schemaJson);
  const order =
    existingOrder.length > 0
      ? [
          ...existingOrder.filter((name) => propertyNames.includes(name)),
          ...propertyNames.filter((name) => !existingOrder.includes(name)),
        ]
      : propertyNames;

  return {
    ...schemaJson,
    ...(order.length > 0 ? { [SCHEMA_FIELD_ORDER_KEY]: order } : {}),
  };
}

function buildPropertySchema(
  field: SchemaFieldDefinition,
): Record<string, unknown> {
  if (field.type === 'array') {
    const items: Record<string, unknown> = { type: field.itemsType };

    if (field.itemsType === 'string' && field.format) {
      items.format = field.format;
    }

    return {
      type: 'array',
      items,
      ...(field.description.trim()
        ? { description: field.description.trim() }
        : {}),
    };
  }

  const property: Record<string, unknown> = {
    type: field.type,
  };

  if (field.description.trim()) {
    property.description = field.description.trim();
  }

  if (field.type === 'string' && field.format) {
    property.format = field.format;
  }

  if (field.type === 'object') {
    property.additionalProperties = true;
  }

  return property;
}

export function builderStateToSchemaJson(
  state: SchemaBuilderState,
): Record<string, unknown> {
  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  const fieldOrder: string[] = [];

  for (const field of state.fields) {
    const name = field.name.trim();

    if (!name) {
      continue;
    }

    fieldOrder.push(name);
    properties[name] = buildPropertySchema(field);

    if (field.required) {
      required.push(name);
    }
  }

  return {
    type: 'object',
    ...(required.length > 0 ? { required } : {}),
    properties,
    additionalProperties: state.additionalProperties,
    ...(fieldOrder.length > 0
      ? { [SCHEMA_FIELD_ORDER_KEY]: fieldOrder }
      : {}),
  };
}

export function getRequiredFieldsFromBuilderState(
  state: SchemaBuilderState,
): string[] {
  return [
    ...new Set(
      state.fields
        .filter((field) => field.required && field.name.trim())
        .map((field) => field.name.trim()),
    ),
  ];
}

export function buildExampleFromBuilderState(
  state: SchemaBuilderState,
): Record<string, unknown> {
  const example: Record<string, unknown> = {};

  for (const field of state.fields) {
    const name = field.name.trim();

    if (!name || !field.required) {
      continue;
    }

    switch (field.type) {
      case 'array':
        example[name] = [];
        break;
      case 'boolean':
        example[name] = false;
        break;
      case 'number':
      case 'integer':
        example[name] = 0;
        break;
      case 'object':
        example[name] = {};
        break;
      default:
        if (field.format === 'email') {
          example[name] = 'usuario@empresa.com';
        } else if (field.format === 'date-time') {
          example[name] = '2026-01-01T12:00:00Z';
        } else if (field.format === 'date') {
          example[name] = '2026-01-01';
        } else {
          example[name] = '';
        }
    }
  }

  return example;
}

export function syncFormTextsFromBuilderState(state: SchemaBuilderState): {
  schemaJsonText: string;
  requiredFieldsText: string;
} {
  return {
    schemaJsonText: formatJson(builderStateToSchemaJson(state)),
    requiredFieldsText: formatRequiredFieldsText(
      getRequiredFieldsFromBuilderState(state),
    ),
  };
}

export const DEFAULT_SCHEMA_JSON_TEXT = formatJson(
  builderStateToSchemaJson(createDefaultSchemaBuilderState()),
);
