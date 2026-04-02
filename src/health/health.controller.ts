import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiExcludeController, ApiOperation } from '@nestjs/swagger';
import { HealthService } from './health.service';

@SkipThrottle()
@ApiExcludeController()
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy trạng thái sức khoẻ của Database và Server' })
  check() {
    return this.healthService.check();
  }
}
