import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Backend Coop API Documentation')
    .setDescription(
      `
            ### Backend Coop API - Enterprise Group Management System
            
            Welcome to the official API documentation for the Coop Platform. This system is architected for scalability, security, and performance:
            
            - **Core Engine**: Built on NestJS 11, ensuring high performance and enterprise-grade stability.
            - **Real-time Synchronization**: Integrated Socket.io for instant data synchronization across group members.
            - **Microservices Architecture**: Modular design utilizing Redis Transporter for inter-service communication (Message & Event Patterns).
            - **Security & RBAC**: Multi-layered security with JWT authentication, Passport strategies, Rate Limiting (Throttler), and Role-Based Access Control (RBAC).
            - **Centralized File Management**: Robust storage management system with intelligent file handling and validation.
            - **Database & Data Integrity**: High-performance data access layer using Prisma ORM and PostgreSQL.
            - **Background Job Processing**: Asynchronous task execution and distributed queueing using BullQueue and Redis.
            
            This documentation provides a comprehensive overview of endpoints, request models, and response structures for developers.
            `,
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const apiPrefix = process.env.API_PREFIX || 'api';

  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    customSiteTitle: 'Backend Coop API | Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-math-scale.svg',
    customCss: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

            /* Reset font and professional typography */
            .swagger-ui, .swagger-ui *, body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
                border-radius: 4px !important;
            }

            /* Modern Dark Theme */
            body { background-color: #1a1a1a !important; margin: 0; padding: 0; }
            .swagger-ui .scheme-container, .swagger-ui .info .base-url { background: #262626 !important; border-bottom: 1px solid #404040; }
            
            /* Professional Header */
            .swagger-ui .info .title {
                color: #ffffff !important; 
                font-weight: 700 !important;
                font-size: 32px !important;
            }
            
            /* Documentation Text */
            .swagger-ui .info p, 
            .swagger-ui .info li, 
            .swagger-ui .info h1,
            .swagger-ui .info h2,
            .swagger-ui .info h3, 
            .swagger-ui .info h4,
            .swagger-ui .info strong,
            .swagger-ui .info span,
            .swagger-ui .info a { 
                color: #d1d1d1 !important; 
            }

            .swagger-ui .info .description p,
            .swagger-ui .info .description li {
                line-height: 1.6 !important;
            }

            /* API Operation Blocks */
            .swagger-ui .opblock {
                background: #262626 !important;
                border: 1px solid #404040 !important;
                box-shadow: none !important;
                margin-bottom: 12px !important;
            }
            .swagger-ui .opblock .opblock-summary { border-bottom: 1px solid #404040 !important; padding: 12px !important; }
            .swagger-ui .opblock .opblock-summary-path { font-weight: 600 !important; color: #ffffff !important; }
            .swagger-ui .opblock .opblock-summary-description { color: #a3a3a3 !important; }

            /* Method Labels */
            .swagger-ui .opblock .opblock-summary-method {
                border-radius: 4px !important;
                font-weight: 700 !important;
                min-width: 80px;
                text-align: center;
                background: #404040 !important;
                color: #ffffff !important;
            }

            /* Tables and Inputs */
            .swagger-ui table thead tr td, .swagger-ui table thead tr th { color: #ffffff !important; border-bottom: 1px solid #404040; }
            .swagger-ui .parameter__name, .swagger-ui .parameter__type { color: #60a5fa !important; }
            
            .swagger-ui input, .swagger-ui textarea, .swagger-ui select {
                background: #1a1a1a !important;
                border: 1px solid #404040 !important;
                color: #ffffff !important;
            }

            /* Buttons */
            .swagger-ui .btn {
                background: #3b82f6 !important;
                color: #ffffff !important;
                border: none !important;
                font-weight: 600 !important;
                border-radius: 4px !important;
            }
            .swagger-ui .btn:hover { background: #2563eb !important; }

            .swagger-ui .topbar { display: none; }
        `,
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.css',
    ],
  });
}
