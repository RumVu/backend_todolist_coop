"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const app_config_1 = require("./config/app.config");
const validation_pipe_1 = require("@nestjs/common/pipes/validation.pipe");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const appConfig = app.get(app_config_1.AppConfigService);
    app.setGlobalPrefix(appConfig.apiPrefix);
    app.useGlobalPipes(new validation_pipe_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }));
    await app.listen(process.env.PORT ?? 6969);
    console.log(`Server is running on port http://localhost:${process.env.PORT ?? 6969}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map