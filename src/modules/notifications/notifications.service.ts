import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class NotificationsService {
  constructor(@InjectQueue('email-queue') private emailQueue: Queue) {}

  async queueEmail(to: string, subject: string, body: string) {
    Logger.log(`Đang ném việc gửi Email cho ${to} vào Hàng đợi Redis...`, 'NotificationsService');
    
    const job = await this.emailQueue.add('send-email', {
      to,
      subject,
      body,
    }, {
      attempts: 3,     // Nếu SMTP lỗi thì thử lại 3 lần
      backoff: 5000,   // Cách nhau 5 giây
    });

    return job.id;
  }
}
