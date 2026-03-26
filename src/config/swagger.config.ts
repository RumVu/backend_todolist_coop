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

            /* Reset toàn bộ font chữ về kiểu Pixel 8-bit, tắt bo góc */
            .swagger-ui, .swagger-ui *, body {
                font-family: 'Press Start 2P', system-ui !important;
                border-radius: 0 !important;
                font-size: 11px !important; /* Font pixel khá to nên phải thu nhỏ */
            }

            /* Nền tối phong cách Arcade */
            body { background-color: #1a1a1a !important; margin: 20px; }
            .swagger-ui .scheme-container, .swagger-ui .info .base-url { background: transparent !important; color: #fff; }

            /* Đổ bóng kiểu Pixel cho tiêu đề */
            .swagger-ui .info .title {
                color: #ffd700 !important; 
                text-shadow: 2px 2px 0 #cc0000;
                font-size: 24px !important;
            }
            .swagger-ui .info p { color: #aaaaaa !important; }

            /* Khung API phong cách màn hình xanh/đỏ */
            .swagger-ui .opblock {
                background: #000 !important;
                border: 3px solid #00ff00 !important;
                box-shadow: 4px 4px 0 #005500 !important;
                margin-bottom: 25px !important;
            }
            .swagger-ui .opblock .opblock-summary { border-bottom: 1px dashed #00ff00 !important; padding: 10px !important; }
            .swagger-ui .opblock .opblock-summary-path { color: #fff !important; font-size: 12px !important; }
            .swagger-ui .opblock .opblock-summary-description { color: #00ff00 !important; }

            /* Nút phương thức HTTP Neon Retro */
            .swagger-ui .opblock .opblock-summary-method {
                background: #ff00ff !important;
                color: #fff !important;
                border: 2px solid #fff !important;
                box-shadow: 2px 2px 0 #aa00aa !important;
                text-transform: uppercase;
                min-width: 80px;
                text-align: center;
            }

            /* Bảng thông số và form */
            .swagger-ui table thead tr td, .swagger-ui table thead tr th { color: #ffd700 !important; border-bottom: 2px solid #00ff00; }
            .swagger-ui .parameter__name, .swagger-ui .parameter__type { color: #00ffff !important; }
            .swagger-ui input, .swagger-ui textarea, .swagger-ui select {
                background: #111 !important;
                border: 2px solid #fff !important;
                color: #00ff00 !important;
            }

            /* Nút bấm (Execute, Try it out) */
            .swagger-ui .btn {
                background: #000 !important;
                color: #ff00ff !important;
                border: 2px solid #ff00ff !important;
                box-shadow: 2px 2px 0 #aa00aa !important;
            }
            .swagger-ui .btn:hover { background: #ff00ff !important; color: #000 !important; }

            /* Ẩn Header lãng xẹt default */
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
