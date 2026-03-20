import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    findAll(): string;
    findOne(id: string): string;
    remove(id: string): string;
}
