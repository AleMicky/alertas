import {
  validateJsonSchemaDocument,
  validateNotificationPayloadSchemaConfiguration,
  validatePayloadAgainstSchema,
  validateRequiredFieldsMatch,
} from './validate-notification-payload-schema.util';

const validSchema = {
  type: 'object',
  required: ['to', 'subject', 'message'],
  properties: {
    to: { type: 'array', items: { type: 'string' } },
    subject: { type: 'string' },
    message: { type: 'string' },
  },
  additionalProperties: false,
};

describe('validateNotificationPayloadSchemaConfiguration', () => {
  it('acepta un JSON Schema y requiredFields coherentes', () => {
    const result = validateNotificationPayloadSchemaConfiguration({
      schemaJson: validSchema,
      requiredFields: ['to', 'subject', 'message'],
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rechaza schemaJson inválido', () => {
    const result = validateJsonSchemaDocument({
      type: 'object',
      properties: {
        to: { type: 'invalid-type' },
      },
    });

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rechaza cuando requiredFields no coincide con schemaJson.required', () => {
    const result = validateRequiredFieldsMatch(validSchema, [
      'to',
      'subject',
    ]);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      '"message" está en schemaJson.required pero no en requiredFields',
    );
  });

  it('valida payload contra el schema', () => {
    const validPayload = {
      to: ['usuario@empresa.com'],
      subject: 'Hola',
      message: 'Mensaje',
    };

    const validResult = validatePayloadAgainstSchema(
      validSchema,
      validPayload,
    );

    expect(validResult.valid).toBe(true);

    const invalidResult = validatePayloadAgainstSchema(validSchema, {
      to: ['usuario@empresa.com'],
      subject: 'Hola',
    });

    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.errors.length).toBeGreaterThan(0);
  });
});
