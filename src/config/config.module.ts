import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigController } from './config/config.controller';

@Module({
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class ConfigModule { }
