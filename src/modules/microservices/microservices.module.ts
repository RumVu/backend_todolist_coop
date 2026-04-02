import { Module } from '@nestjs/common';
import { MicroservicesController } from './microservices.controller';

@Module({
  controllers: [MicroservicesController],
})
export class MicroservicesModule {}
