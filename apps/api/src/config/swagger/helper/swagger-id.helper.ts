export type SwaggerIdType = 'uuid' | 'number' | 'string';

export interface SwaggerIdConfig {
  example: string | number;
  description: string;
}

export function getSwaggerIdConfig(
  type: SwaggerIdType = 'string',
): SwaggerIdConfig {
  switch (type) {
    case 'uuid':
      return {
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'UUID del registro',
      };

    case 'number':
      return {
        example: 1,
        description: 'ID numérico del registro',
      };

    case 'string':
      return {
        example: 'ABC123',
        description: 'Identificador string del registro',
      };

    default:
      return {
        example: 'ABC123',
        description: 'Identificador del registro',
      };
  }
}
