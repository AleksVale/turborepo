import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('SIG API')
    .setDescription(
      'Sistema Integrado de Gestão - API para gerenciamento de produtos digitais'
    )
    .setVersion('1.0')
    .addTag('Authentication', 'Endpoints de autenticação')
    .addTag('Users', 'Gerenciamento de usuários')
    .addTag('Products', 'Gerenciamento de produtos')
    .addTag('Roles', 'Gerenciamento de roles/permissões')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
    customSiteTitle: 'SIG API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #3b4151 }
    `,
    customfavIcon: '/favicon.ico',
  });
}
