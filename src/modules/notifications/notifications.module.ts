import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationsService } from './notifications.service';
import { NotificationsProcessor } from './notifications.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-queue',
    }),
  ],
  providers: [NotificationsService, NotificationsProcessor],
  exports: [NotificationsService],
})
export class NotificationsModule {}
