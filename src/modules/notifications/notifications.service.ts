import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async queueEmail(to: string, subject: string, body: string) {
    const jobId = `email-${Date.now()}`;
    Logger.log(`Queued email ${jobId} for ${to}`, 'NotificationsService');
    Logger.debug(`Subject: ${subject}`, 'NotificationsService');
    Logger.debug(`Body: ${body}`, 'NotificationsService');
    return jobId;
  }
}
