import { ConfigService } from "@nestjs/config";
export declare class AppConfigService {
    private readonly configService;
    constructor(configService: ConfigService);
    get port(): number;
    get apiPrefix(): string;
    get appName(): string;
}
declare const _default: (() => {
    name: string;
    port: number;
    nodeEnv: string;
    apiPrefix: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    name: string;
    port: number;
    nodeEnv: string;
    apiPrefix: string;
}>;
export default _default;
