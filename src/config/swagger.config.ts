import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('Backend Coop API')
        .setDescription('API documentation for Coop')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'Retro Coop API 👾',
        customfavIcon: 'https://nestjs.com/img/logo-math-scale.svg',
        customCss: `
            @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

            /* Reset font and borders */
            .swagger-ui, .swagger-ui *, body {
                font-family: 'Press Start 2P', system-ui !important;
                border-radius: 0 !important;
                font-size: 11px !important;
            }

            /* Dark espresso background */
            body { background-color: #3B231D !important; margin: 20px; }
            .swagger-ui .scheme-container, .swagger-ui .info .base-url { background: transparent !important; color: #CBB682; }

            /* Sand/Beige color for titles and fonts */
            .swagger-ui .info .title {
                color: #CBB682 !important; 
                text-shadow: 2px 2px 0 #986441;
                font-size: 24px !important;
            }
            
            /* Text colors */
            .swagger-ui { color: #CBB682 !important; }
            .swagger-ui .info p { color: #B48259 !important; }

            /* API Block styling: dark chocolate with terra cotta borders */
            .swagger-ui .opblock {
                background: #562B22 !important;
                border: 2px solid #CBB682 !important;
                box-shadow: 4px 4px 0 #986441 !important;
                margin-bottom: 25px !important;
            }
            .swagger-ui .opblock .opblock-summary { border-bottom: 1px dashed #CBB682 !important; padding: 10px !important; }
            .swagger-ui .opblock .opblock-summary-path { color: #CBB682 !important; }
            .swagger-ui .opblock .opblock-summary-description { color: #B48259 !important; }

            /* HTTP Method buttons: Caramel */
            .swagger-ui .opblock .opblock-summary-method {
                background: #C27A44 !important;
                color: #3B231D !important;
                border: 2px solid #CBB682 !important;
                box-shadow: 2px 2px 0 #986441 !important;
                text-transform: uppercase;
                min-width: 80px;
                text-align: center;
            }

            /* Tables and Inputs */
            .swagger-ui table thead tr td, .swagger-ui table thead tr th { color: #CBB682 !important; border-bottom: 1px solid #CBB682; }
            .swagger-ui .parameter__name, .swagger-ui .parameter__type { color: #C27A44 !important; }
            
            .swagger-ui input, .swagger-ui textarea, .swagger-ui select {
                background: #3B231D !important;
                border: 2px solid #CBB682 !important;
                color: #CBB682 !important;
            }

            /* Action Buttons */
            .swagger-ui .btn {
                background: #986441 !important;
                color: #3B231D !important;
                border: 2px solid #3B231D !important;
                box-shadow: 2px 2px 0 #562B22 !important;
            }
            .swagger-ui .btn:hover { background: #CBB682 !important; color: #3B231D !important; }

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
