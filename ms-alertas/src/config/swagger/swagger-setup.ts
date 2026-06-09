import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

const SWAGGER_TAGS = [
  ['Sistemas cliente', 'Registro de sistemas que emiten eventos'],
  ['Tokens', 'Tokens de autenticación por sistema'],
  ['Niveles de severidad', 'Catálogo de severidades y prioridades'],
  ['Canales de notificación', 'Webhooks y canales (Telegram, Teams, etc.)'],
  ['Tipos de evento', 'Catálogo de tipos de evento por sistema'],
  ['Eventos', 'Eventos recibidos desde sistemas externos'],
  ['Reglas de alerta', 'Reglas que generan alertas a partir de eventos'],
  ['Alertas', 'Alertas generadas y su seguimiento'],
  ['Notificaciones', 'Envíos de alertas a canales'],
  ['Pruebas', 'Endpoints de integración y pruebas'],
] as const;

const SWAGGER_UI_OPTIONS: SwaggerCustomOptions = {
  customSiteTitle: 'MS Alert — API Docs',
  swaggerOptions: {
    filter: true,
    docExpansion: 'none',
    deepLinking: false,
    persistAuthorization: true,
    displayRequestDuration: true,
    defaultModelsExpandDepth: -1,
    defaultModelExpandDepth: 0,
    defaultModelRendering: 'example',
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
  },
  customCss: `
    .swagger-ui .model-box,
    .swagger-ui .highlight-code > pre,
    .swagger-ui .body-param__textarea {
      max-height: 220px;
      overflow-y: auto;
    }
  `,
};

const swaggerDocumentOptions: SwaggerDocumentOptions = {
  deepScanRoutes: true,
  operationIdFactory: (controllerKey: string, methodKey: string) =>
    `${controllerKey}_${methodKey}`,
};

const buildSwaggerConfig = () => {
  const builder = new DocumentBuilder()
    .setTitle('MS Alertas')
    .setDescription(
      'API para gestión de alertas, eventos, reglas y canales de notificación. ' +
        'Los cuerpos de solicitud muestran tipos de dato y ejemplos listos para probar.',
    )
    .setVersion('1.0')
    .addServer('/', 'Servidor actual')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token',
        description: 'Token del sistema cliente (msa_...)',
      },
      'client-system-token',
    );

  for (const [name, description] of SWAGGER_TAGS) {
    builder.addTag(name, description);
  }

  return builder.build();
};

export const swaggerSetup = (app: INestApplication): void => {
  const document = SwaggerModule.createDocument(
    app,
    buildSwaggerConfig(),
    swaggerDocumentOptions,
  );

  SwaggerModule.setup('docs', app, document, {
    ...SWAGGER_UI_OPTIONS,
    useGlobalPrefix: true,
  });
};
