import Ajv, { ErrorObject, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

export type PayloadSchemaValidationResult = {
  valid: boolean;
  errors: string[];
};

export type PayloadSchemaConfigurationInput = {
  schemaJson?: Record<string, unknown>;
  requiredFields?: string[];
};

function createAjv(): Ajv {
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
  });

  addFormats(ajv);

  return ajv;
}

function formatInstancePath(instancePath: string): string {
  if (!instancePath || instancePath === '/') {
    return 'payload';
  }

  return instancePath.startsWith('/')
    ? `payload${instancePath.replace(/\//g, '.')}`
    : `payload.${instancePath}`;
}

function formatAjvError(error: ErrorObject): string {
  const location = formatInstancePath(error.instancePath || '/');
  const params = error.params as Record<string, unknown>;

  switch (error.keyword) {
    case 'additionalProperties': {
      const property = String(params.additionalProperty ?? 'desconocida');
      return `${location}: la propiedad "${property}" no está permitida por el schema del canal`;
    }
    case 'required': {
      const property = String(params.missingProperty ?? 'desconocida');
      return `${location}: falta la propiedad requerida "${property}"`;
    }
    case 'type': {
      return `${location}: debe ser de tipo "${String(params.type ?? 'desconocido')}"`;
    }
    case 'enum': {
      const allowed = Array.isArray(params.allowedValues)
        ? params.allowedValues.map(String).join(', ')
        : 'valores permitidos';
      return `${location}: debe ser uno de: ${allowed}`;
    }
    case 'format': {
      return `${location}: formato inválido (se espera "${String(params.format ?? 'válido')}")`;
    }
    case 'minItems': {
      return `${location}: debe tener al menos ${String(params.limit)} elemento(s)`;
    }
    case 'maxItems': {
      return `${location}: debe tener como máximo ${String(params.limit)} elemento(s)`;
    }
    case 'minLength': {
      return `${location}: debe tener al menos ${String(params.limit)} carácter(es)`;
    }
    case 'maxLength': {
      return `${location}: debe tener como máximo ${String(params.limit)} carácter(es)`;
    }
    case 'minimum': {
      return `${location}: debe ser >= ${String(params.limit)}`;
    }
    case 'maximum': {
      return `${location}: debe ser <= ${String(params.limit)}`;
    }
    default: {
      const message = error.message ?? 'valor inválido';
      return `${location}: ${message}`;
    }
  }
}

function normalizeRequiredFields(requiredFields: string[]): string[] {
  return [...new Set(requiredFields.map((field) => field.trim()).filter(Boolean))].sort();
}

function getSchemaRequiredFields(
  schemaJson: Record<string, unknown>,
): string[] {
  const required = schemaJson.required;

  if (!Array.isArray(required)) {
    return [];
  }

  return normalizeRequiredFields(
    required.filter((field): field is string => typeof field === 'string'),
  );
}

export function validateJsonSchemaDocument(
  schemaJson: unknown,
): PayloadSchemaValidationResult {
  if (
    schemaJson === null ||
    Array.isArray(schemaJson) ||
    typeof schemaJson !== 'object'
  ) {
    return {
      valid: false,
      errors: ['schemaJson debe ser un objeto JSON Schema válido'],
    };
  }

  try {
    const ajv = createAjv();
    ajv.compile(schemaJson);

    return { valid: true, errors: [] };
  } catch (error) {
    return {
      valid: false,
      errors: [
        error instanceof Error
          ? error.message
          : 'schemaJson no es un JSON Schema válido',
      ],
    };
  }
}

export function validateRequiredFieldsMatch(
  schemaJson: Record<string, unknown>,
  requiredFields: string[],
): PayloadSchemaValidationResult {
  const schemaRequired = getSchemaRequiredFields(schemaJson);
  const normalizedRequiredFields = normalizeRequiredFields(requiredFields);
  const errors: string[] = [];

  for (const field of schemaRequired) {
    if (!normalizedRequiredFields.includes(field)) {
      errors.push(
        `"${field}" está en schemaJson.required pero no en requiredFields`,
      );
    }
  }

  for (const field of normalizedRequiredFields) {
    if (!schemaRequired.includes(field)) {
      errors.push(
        `"${field}" está en requiredFields pero no en schemaJson.required`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateNotificationPayloadSchemaConfiguration(
  input: PayloadSchemaConfigurationInput,
): PayloadSchemaValidationResult {
  const errors: string[] = [];

  if (!input.schemaJson) {
    errors.push('schemaJson es obligatorio');
    return { valid: false, errors };
  }

  const schemaValidation = validateJsonSchemaDocument(input.schemaJson);

  if (!schemaValidation.valid) {
    errors.push(...schemaValidation.errors);
  }

  if (!input.requiredFields || input.requiredFields.length === 0) {
    errors.push('Debe indicar al menos un campo requerido');
  } else {
    const requiredMatch = validateRequiredFieldsMatch(
      input.schemaJson,
      input.requiredFields,
    );

    if (!requiredMatch.valid) {
      errors.push(...requiredMatch.errors);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validatePayloadAgainstSchema(
  schemaJson: Record<string, unknown>,
  payload: unknown,
): PayloadSchemaValidationResult {
  const schemaValidation = validateJsonSchemaDocument(schemaJson);

  if (!schemaValidation.valid) {
    return schemaValidation;
  }

  const ajv = createAjv();
  let validateFn: ValidateFunction;

  try {
    validateFn = ajv.compile(schemaJson);
  } catch (error) {
    return {
      valid: false,
      errors: [
        error instanceof Error
          ? error.message
          : 'No se pudo compilar schemaJson para validar el payload',
      ],
    };
  }

  const valid = validateFn(payload);

  if (valid) {
    return { valid: true, errors: [] };
  }

  return {
    valid: false,
    errors: (validateFn.errors ?? []).map(formatAjvError),
  };
}
