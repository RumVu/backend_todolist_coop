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
        customJsStr: `
            setTimeout(() => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.8.0/dist/mermaid.min.js';
                document.head.appendChild(script);
                
                script.onload = () => {
                    mermaid.initialize({ startOnLoad: false, theme: 'dark', fontFamily: '"Press Start 2P"' });
                    
                    fetch('/api/docs-json').then(res => res.json()).then(data => {
                        let erd = "erDiagram\\n";
                        const schemas = data.components?.schemas || {};
                        const relations = [];

                        for (const ObjectName in schemas) {
                            const schema = schemas[ObjectName];
                            const SafeName = ObjectName.replace(/[^a-zA-Z0-9]/g, '');
                            erd += "  " + SafeName + " {\\n";
                            if (schema.properties) {
                                for (const PropName in schema.properties) {
                                    const prop = schema.properties[PropName];
                                    let type = prop.type;
                                    
                                    if (!type && prop.$ref) {
                                        type = prop.$ref.split('/').pop().replace(/[^a-zA-Z0-9]/g, '');
                                        relations.push({from: SafeName, to: type, name: PropName});
                                    }
                                    if (prop.type === 'array' && prop.items && prop.items.$ref) {
                                        type = prop.items.$ref.split('/').pop().replace(/[^a-zA-Z0-9]/g, '') + "[]";
                                        relations.push({from: SafeName, to: type.replace('[]',''), name: PropName});
                                    }
                                    
                                    type = type || 'Any';
                                    const SafePropName = PropName.replace(/[^a-zA-Z0-9]/g, '_');
                                    erd += "    " + type + " " + SafePropName + "\\n";
                                }
                            }
                            erd += "  }\\n";
                        }

                        relations.forEach(rel => {
                            if (schemas[rel.to] || schemas[rel.to.replace(/Dto$/, '')]) {
                                erd += "  " + rel.from + " ||--o{ " + rel.to + " : contains\\n";
                            }
                        });

                        const container = document.createElement('div');
                        container.style = "padding: 20px; background: #351C15; border: 2px solid #CBB682; box-shadow: 4px 4px 0 #986441; margin: 25px 0; overflow-x: auto;";
                        container.innerHTML = '<h2 style="color: #CBB682; text-shadow: 2px 2px 0 #986441; text-align: center; margin-bottom: 20px;">SCHEMA ER DIAGRAM</h2><div id="mermaid-erd-container" style="text-align: center; color: #FFF;">Generating Diagram...</div>';
                        
                        const insertTarget = document.querySelector('.models') || document.querySelector('.swagger-ui');
                        if (insertTarget && insertTarget.parentNode) {
                            insertTarget.parentNode.insertBefore(container, insertTarget);
                        }
                        
                        mermaid.render('erdSvgGraph', erd).then(result => {
                            document.getElementById('mermaid-erd-container').innerHTML = result.svg;
                        }).catch(e => {
                            document.getElementById('mermaid-erd-container').innerHTML = "Schema Rendering Error: " + e.message;
                        });
                    }).catch(err => console.error("Could not load spec JSON for Mermaid:", err));
                };
            }, 1000);
        `,
    });
}
