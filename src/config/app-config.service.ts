import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>("app.port", 6969);
  }

  get apiPrefix(): string {
    return this.configService.get<string>("app.apiPrefix", "api");
  }

  get appName(): string {
    return this.configService.get<string>("app.name", "Daily Planner API");
  }
}

