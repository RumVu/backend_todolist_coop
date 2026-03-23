"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const apiPrefix = configService.get('app.apiPrefix') ?? 'api';
    app.setGlobalPrefix(apiPrefix);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const port = configService.get('app.port') ?? 6969;
    await app.listen(port);
    console.log(`Server is running on http://localhost:${port}/${apiPrefix}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map